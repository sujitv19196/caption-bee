<!-- SettingsMenu.svelte -->

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	const defaultSettings: { [key: string]: any } = {
		highAccuracyThreshold: {
			name: 'High accuracy threshold',
			value: 0.9
		},
		mediumAccuracyThreshold: {
			name: 'Medium accuracy threshold',
			value: 0.8
		},
		quickEdit: {
			name: 'Quick Edit',
			value: true
		},
		enableSpeakerNames: {
			name: 'Enable speaker names',
			value: false
		},
		lightTheme: {
			name: 'Light theme',
			value: false
		}
	};

	// Add any additional settings and their default values here
	let settings: { [key: string]: any } = {};
	for (const [key, setting] of Object.entries(defaultSettings)) {
		settings[key] = setting.value;
	}

	const dispatch = createEventDispatcher();

	let showDropdown = false;
	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	function updateSetting() {
		dispatch('settingsChange', settings);
	}

	onMount(() => {
		updateSetting();
	});
</script>

<button id="settings-button" class="clickable" on:click={toggleDropdown}>
	<i class="fa fa-sliders" aria-hidden="true" />
</button>

{#if showDropdown}
	<div id="overlay">
		<div id="menu">
			<div id="title">
				Settings
				<button id="close-button" class="clickable" on:click={toggleDropdown}>
					<i class="fa fa-xmark" aria-hidden="true" />
				</button>
			</div>

			{#each Object.entries(defaultSettings) as [key, setting]}
				<div class="setting-item">
					<label for={setting.name}>{setting.name}</label>

					{#if typeof setting.value === 'boolean'}
						<input
							class="setting-input"
							type="checkbox"
							bind:checked={settings[key]}
							on:change={updateSetting}
						/>
					{:else if typeof setting.value === 'string'}
						<input
							class="setting-input"
							type="text"
							bind:value={settings[key]}
							on:blur={updateSetting}
						/>
					{:else if typeof setting.value === 'number'}
						<input
							class="setting-input"
							type="number"
							step="0.01"
							bind:value={settings[key]}
							on:blur={updateSetting}
						/>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	#settings-button {
		margin: 5px;
		width: 36px;
		height: 36px;
		background: none;
		border: none;
		font-size: 24px;
		color: var(--color-fg-3);
	}
	#overlay {
		position: fixed;
		top: 0;
		right: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
	}
	#menu {
		position: absolute;
		top: 0;
		right: 0;
		width: 400px;
		height: 100%;
		background-color: var(--color-bg-3);
		border-left: 1px solid var(--color-fg-4);
		padding: 15px;
	}
	#title {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 24px;
		font-weight: bold;
		margin-left: 10px;
		margin-bottom: 36px;
	}
	#close-button {
		margin-left: auto;
		width: 36px;
		height: 36px;
		background: none;
		border: none;
		font-size: 24px;
		color: var(--color-fg-2);
	}
	.setting-item {
		display: flex;
		align-items: center;
		margin-left: 10px;
		margin-right: 10px;
		margin-bottom: 36px;
		font-size: 18px;
	}
	.setting-input {
		display: inline-block;
		margin-left: auto;
		background-color: var(--color-bg-1);
		border: none;
		border-radius: 2px;
		accent-color: var(--color-accent);
	}
	.setting-input[type='number'] {
		width: 100px;
		height: 24px;
		font-size: 16px;
		color: var(--color-fg-2);
	}
	.setting-input[type='checkbox'] {
		transform: scale(1.2);
	}
</style>

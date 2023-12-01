<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import type { Writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import Toolbar from './Toolbar.svelte';
	import type { Caption } from '$lib/utils/captions';
	import type { Editor } from '$lib/utils/editor';

	export let editor: Editor;
	export let settings: { [key: string]: any };

	const captionHeight = 60;
	const currentCaptionBottomMargin = 25;
	const toolbarHeight = 150;
	const minMiddleZoneHeight = toolbarHeight + captionHeight + currentCaptionBottomMargin;
	let height: number;
	let numVisibleCaptions: number;
	let middleZoneY: number;
	let middleZoneHeight: number;
	let numCaptionsAbove: number;
	let numCaptionsBelow: number;

	let firstVisibleIdx = 0;
	let captionOffsets: number[] = [];

	function updateVisibleCaptions() {
		firstVisibleIdx = Math.max(0, editor.currentIdx - numCaptionsAbove);
		const lastVisibleIdx = Math.min(
			editor.captions.length - 1,
			editor.currentIdx + numCaptionsBelow
		);
		captionOffsets = [];
		for (let i = firstVisibleIdx; i <= lastVisibleIdx; i++) {
			const relativeIdx = i - editor.currentIdx;
			if (relativeIdx == 0) {
				captionOffsets.push(middleZoneY + toolbarHeight);
			} else if (relativeIdx < 0) {
				captionOffsets.push(middleZoneY + relativeIdx * captionHeight);
			} else {
				captionOffsets.push(middleZoneY + middleZoneHeight + (relativeIdx - 1) * captionHeight);
			}
		}
	}

	// Change text color based on caption accuracy
	function getColorSuffix(caption: Caption) {
		if (caption.score >= settings['highAccuracyThreshold']) {
			return 'default'; // High accuracy, default color
		} else if (caption.edited) {
			return 'edited';
		} else if (caption.score >= settings['mediumAccuracyThreshold']) {
			return 'medium'; // Medium accuracy, amber color
		} else {
			return 'low'; // Low accuracy, dark red color
		}
	}

	function gradientFrom(color: string) {
		return `linear-gradient(to right, ${color} -20px, var(--color-fg-2) 200px)`;
	}

	$: {
		numVisibleCaptions = Math.floor((height - minMiddleZoneHeight) / captionHeight);
		middleZoneHeight = height - numVisibleCaptions * captionHeight;
		middleZoneY = captionHeight * Math.floor(numVisibleCaptions / 2);
		numCaptionsAbove = Math.floor((3 * numVisibleCaptions) / 2);
		numCaptionsBelow = Math.ceil((3 * numVisibleCaptions) / 2);
		updateVisibleCaptions();
		// update settings on change
		settings;
		console.log('bruh');
	}

	let currentCaptionStart: Writable<number>;
	let currentCaptionEnd: Writable<number>;
	let currentCaptionText: Writable<string>;
	let currentCaptionSpeaker: Writable<string>;
	function updateStores() {
		currentCaptionStart = editor.currentCaption.startTimeStore;
		currentCaptionEnd = editor.currentCaption.endTimeStore;
		currentCaptionText = editor.currentCaption.textStore;
		currentCaptionSpeaker = editor.currentCaption.speakerName;
	}
	updateStores();

	let oldIdx = 0;
	let inAnimation = { x: 50, duration: 150, delay: 100 };
	let outAnimation = { x: -50, duration: 150 };
	let skipScroll = false;

	editor.addNavigationListener((currentIdx) => {
		updateVisibleCaptions();
		updateStores();

		if (currentIdx < oldIdx) {
			inAnimation.x = -50;
			outAnimation.x = 50;
		} else {
			inAnimation.x = 50;
			outAnimation.x = -50;
		}

		if (Math.abs(currentIdx - oldIdx) > numVisibleCaptions) {
			skipScroll = true;
		}
		oldIdx = currentIdx;
	});

	function focus(el: HTMLInputElement) {
		el.focus();
	}

	let captionsContainer: HTMLElement;
	onMount(() => {
		updateVisibleCaptions();
		captionsContainer.addEventListener('scroll', () => {
			if (captionsContainer.scrollTop != 0) {
				captionsContainer.scrollTo(0, 0);
			}
		});
	});

	afterUpdate(() => {
		skipScroll = false;
	});
</script>

<div class="captions-container" bind:clientHeight={height} bind:this={captionsContainer}>
	{#key skipScroll}
		<div class="captions-view" in:fly={inAnimation} out:fly={outAnimation}>
			{#each captionOffsets as offset, i (firstVisibleIdx + i)}
				{@const idx = firstVisibleIdx + i}
				{@const caption = editor.captions[idx]}

				<div
					class="caption-row"
					style="position: absolute; top: {offset}px; height: {captionHeight}px;"
					animate:flip={{ duration: 250 }}
				>
					<div class="caption">
						{#if idx === editor.currentIdx}
							<span class="caption-timestamp caption-timestamp-{getColorSuffix(caption)}">
								{new Date($currentCaptionStart * 1000).toISOString().slice(11, 19)}
							</span>
							{#if settings['enableSpeakerNames']}
								<input
									class="current-caption-speaker"
									bind:value={$currentCaptionSpeaker}
									placeholder="Speaker"
									spellcheck="true"
									use:focus
								/>
							{/if}
							<textarea
								class="current-caption"
								bind:value={$currentCaptionText}
								spellcheck="true"
								rows="2"
							/>
						{:else}
							<span class="caption-timestamp caption-timestamp-{getColorSuffix(caption)}">
								{new Date(caption.startTime * 1000).toISOString().slice(11, 19)}
							</span>
							<div class="caption-text caption-text-{getColorSuffix(caption)}">
								{#if settings['enableSpeakerNames'] && caption.speaker != ''}
									{`[${caption.speaker}] ${caption.text}`}
								{:else}
									{caption.text}
								{/if}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/key}
	<div class="toolbar-container" style="position: absolute; top: {middleZoneY + 25}px;">
		<Toolbar {editor} />
	</div>
</div>

<style>
	.captions-container {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: scroll;
	}
	.caption-row {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-family: Arial;
	}
	.caption {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.caption-timestamp {
		padding-left: 50px;
		width: 100px;
		font-size: 14px;
		color: var(--color-fg-3);
	}
	.caption-text {
		width: calc(100% - 250px);
		font-size: 18px;
		color: var(--color-fg-2);
	}
	.current-caption {
		width: 85%;
		background: none;
		border: none;
		font-family: Arial;
		font-size: 18px;
		color: var(--color-fg-1);
	}
	.current-caption-speaker {
		width: 15%;
		background: none;
		border: none;
		font-family: Arial;
		font-size: 18px;
		color: white;
		margin-right: 1%;
	}
	.toolbar-container {
		left: 150px;
		width: calc(100% - 250px);
	}

	.caption-timestamp-medium {
		color: var(--medium-confidence);
	}
	.caption-timestamp-low {
		color: var(--low-confidence);
	}
	.caption-timestamp-edited {
		color: var(--edited);
	}

	.caption-text-medium {
		text-decoration: var(--medium-confidence) dotted underline 3px;
	}
	.caption-text-low {
		text-decoration: var(--low-confidence) dotted underline 3px;
	}
</style>

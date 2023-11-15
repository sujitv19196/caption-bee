<script lang="ts">
	import CaptionBox from './CaptionBox.svelte';
	import type { Editor } from '$lib/utils/editor';

	export let editor: Editor;

	let idxEditing: number | undefined = undefined;

	// Next and Previous Button Logic
	let currentCaption = 0;
	let captionsPerPage = 3;

	function showNextCaptions() {
		const nextCaption = currentCaption + captionsPerPage;
		if (nextCaption < editor.captions.length) {
			currentCaption = nextCaption;
		}
	}

	function showPreviousCaptions() {
		if (currentCaption >= captionsPerPage) {
			currentCaption -= captionsPerPage;
		}
	}
</script>

<div class="captions-container">
	<span class="toolbar">
		<button>Undo</button> <button>Redo</button>
		<button> Show Original </button>
	</span>
	<span class="captions">
		{#if !editor.captions.length}
			<p>No captions available</p>
		{:else}
			<!-- Display only captionsPerPage number of captions -->
			{#each Array.from({ length: Math.min(captionsPerPage, editor.captions.length - currentCaption) }, (_, i) => currentCaption + i) as idx}
				<CaptionBox bind:editor {idx} bind:idxEditing />
			{/each}
		{/if}
	</span>
	<span class="navigation">
		<button on:click={showPreviousCaptions}>Previous</button>
		<button on:click={showNextCaptions}>Next</button>
	</span>
</div>

<style>
	.toolbar {
		display: block;
		margin-bottom: 10px;
	}
	.captions-container {
		width: 30%;
		margin: 10px;
		padding: 10px;
		border-radius: 10px;
		overflow-y: auto;
		background-color: #f0f0f0;
	}

	.navigation {
		display: block;
		margin-top: 10px;
	}
</style>

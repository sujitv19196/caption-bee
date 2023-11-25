<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import CaptionBox from './CaptionBox.svelte';
	import Toolbar from './Toolbar.svelte';
	import type { Caption } from '$lib/utils/captions';
	import type { Editor } from '$lib/utils/editor';

	export let editor: Editor;

	const captionHeight = 60;
	const currentCaptionBottomMargin = 25;
	const toolbarHeight = 150;
	const minMiddleZoneHeight = toolbarHeight + captionHeight + currentCaptionBottomMargin;
	let height: number;
	let numVisibleCaptions: number;
	let middleZoneY: number;
	let middleZoneHeight: number;

	let firstVisibleIdx = 0;
	let captionOffsets: number[] = [];

	function updateVisibleCaptions() {
		firstVisibleIdx = Math.max(0, editor.currentIdx - numVisibleCaptions);
		const lastIdx = Math.min(editor.captions.length, editor.currentIdx + numVisibleCaptions);
		captionOffsets = [];
		for (let i = firstVisibleIdx; i < lastIdx; i++) {
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
	// TODO make tresholds user adjustable
	function getCaptionColor(score: number) {
		if (score > 0.8) {
			return '#00ff00'; // High accuracy, green color
		} else if (score > 0.5) {
			return '#ffff00'; // Medium accuracy, yellow color
		} else {
			return '#ff0000'; // Low accuracy, red color
		}
	}

	$: {
		numVisibleCaptions = Math.floor((height - minMiddleZoneHeight) / captionHeight);
		middleZoneHeight = height - numVisibleCaptions * captionHeight;
		middleZoneY = captionHeight * Math.floor(numVisibleCaptions / 2);
		updateVisibleCaptions();
	}

	editor.addNavigationListener(() => {
		updateVisibleCaptions();
	});

	function focus(el: HTMLInputElement) {
		el.focus();
	}

	onMount(() => {
		updateVisibleCaptions();
	});
</script>

<div class="captions-container" bind:clientHeight={height}>
	<div class="captions-view">
		{#if !editor.captions.length}
			<p>No captions available</p>
		{:else}
			<!-- Display only captionsPerPage number of captions -->
			<!-- {#each Array.from({ length: Math.min(captionsPerPage, editor.captions.length - currentCaption) }, (_, i) => currentCaption + i) as idx}
				<CaptionBox bind:editor {idx} bind:idxEditing />
			{/each} -->

			{#each captionOffsets as offset, i (firstVisibleIdx + i)}
				{@const idx = firstVisibleIdx + i}
				{@const caption = editor.captions[idx]}
				{@const score = caption.score}

				<div
					class="caption-container"
					style="position: absolute; top: {offset}px; height: {captionHeight}px;"
					animate:flip={{ duration: 250 }}
				>
					<div class="caption">
						{#key caption.startTime}
							<span class="caption-timestamp">
								{new Date(caption.startTime * 1000).toISOString().slice(11, 19)}
							</span>
						{/key}

						{#if idx === editor.currentIdx}
							<input
								class="current-caption"
								style="color: {getCaptionColor(score)}"
								bind:value={editor.currentCaption.text}
								use:focus
							/>
						{:else}
							<div class="caption-text" style="color: {getCaptionColor(score)}">{caption.text}</div>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<div
		class="toolbar-container"
		style="position: absolute; top: {middleZoneY + 25}px; height: {middleZoneHeight}px;"
	>
		<Toolbar {editor} />
	</div>
</div>

<style>
	.captions-container {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}
	.caption-container {
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
		font-size: 12px;
		color: #8c8c8c;
	}
	.caption-text {
		width: calc(100% - 250px);
		font-size: 18px;
	}
	.current-caption {
		width: calc(100% - 250px);
		background: none;
		border: none;
		font-family: Arial;
		font-size: 18px;
	}
	.toolbar-container {
		left: 150px;
		width: calc(100% - 250px);
	}
</style>

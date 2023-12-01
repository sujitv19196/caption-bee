<!-- CaptionedVideo.svelte -->

<script lang="ts">
	import { onMount } from 'svelte';
	import type { Editor } from '$lib/utils/editor';

	export let editor: Editor;
	export let videoSrc: string;
	export let hidden: boolean;

	const currentTimeStore = editor.video.currentTimeStore;
	const pausedStore = editor.video.pausedStore;
	const playbackRateStore = editor.video.playbackRateStore;

	let video: HTMLVideoElement;

	let totalCaptions = 0;
	let remainingCaptions = 0;
	let finishedCaptions = 0;
	let skippedCaptions = 0;

	function getRemainingCaptions() {
		totalCaptions = editor.captions.length;
		remainingCaptions = totalCaptions - editor.currentIdx;
	}

	function getFinishedCaptions() {
		finishedCaptions = editor.currentIdx;
	}

	function getSkippedCaptions() {
		//done button is clicked
		if (editor.currentIdx > editor.prevIdx) {
			if (editor.currentIdx - editor.prevIdx > 1)
				skippedCaptions = skippedCaptions + (editor.currentIdx - editor.prevIdx - 1);
		}
		//prev button is clicked
		if (editor.prevIdx > editor.currentIdx) {
			if (editor.prevIdx - editor.currentIdx > 1) {
				if (skippedCaptions - (editor.prevIdx - editor.currentIdx - 1) >= 0)
					skippedCaptions = skippedCaptions - (editor.prevIdx - editor.currentIdx - 1);
				else skippedCaptions = 0;
			}
		}
	}

	editor.addNavigationListener(() => {
		getRemainingCaptions();
		getFinishedCaptions();
		getSkippedCaptions();
	});

	onMount(() => {
		const track = video.addTextTrack('captions', 'Captions', 'en');
		track.mode = 'showing';
		for (const caption of editor.captions) {
			track.addCue(caption.vttCue);
		}
		getRemainingCaptions();
		getFinishedCaptions();
		getSkippedCaptions();
	});
</script>

<div class="video-container">
	<video
		id="video-player"
		{hidden}
		controls
		src={videoSrc}
		bind:this={video}
		bind:currentTime={$currentTimeStore}
		bind:paused={$pausedStore}
		bind:playbackRate={$playbackRateStore}
		bind:duration={editor.video.duration}
	>
		<track kind="captions" />
	</video>
	<div class="statistics-container">
		<div class="statistics-box">
			<p class="statistics-label">Remaining:</p>
			<p style="color: var(--medium-confidence)">{remainingCaptions}</p>
		</div>
		<div class="statistics-box">
			<p class="statistics-label">Finished:</p>
			<p style="color: var(--edited)">{finishedCaptions}</p>
		</div>
		<div class="statistics-box">
			<p class="statistics-label">Skipped:</p>
			<p style="color: var(--color-fg-3)">{skippedCaptions}</p>
		</div>
	</div>
</div>

<style>
	.video-container {
		display: flex;
		flex-direction: column;
	}

	.statistics-container {
		display: flex;
		justify-content: space-around;
		margin-top: 20px;
	}

	.statistics-box {
		width: 33%;
		text-align: center;
		font-size: 18px;
	}

	.statistics-label {
		font-weight: bold;
		margin-bottom: 5px;
		color: var(--color-fg-2);
	}
</style>

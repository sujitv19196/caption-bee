<script lang="ts">
	import { onMount } from 'svelte';
	import RangeSlider from 'svelte-range-slider-pips';
	import type { Caption } from '$lib/utils/captions';
	import type { Editor } from '$lib/utils/editor';

	export let editor: Editor;

	let currentCaption = editor.currentCaption;
	let nextCaption: Caption | null;
	let prevCaption: Caption | null;
	let startTime: number;
	let endTime: number;
	let lowerBound: number;
	let upperBound: number;
	let duration: number;
	let captionDuration: number;
	let range: number[];

	function updateRange() {
		startTime = currentCaption.startTime;
		endTime = currentCaption.endTime;
		captionDuration = endTime - startTime;
	}

	function onNavigation() {
		currentCaption = editor.currentCaption;
		nextCaption = currentCaption.next;
		prevCaption = currentCaption.previous;
		lowerBound = prevCaption?.endTime ?? 0;
		upperBound = nextCaption?.startTime ?? editor.video.duration ?? lowerBound;
		duration = upperBound - lowerBound;

		updateRange();
		range = [startTime, endTime];

		editor.video.currentTime = lowerBound + 0.01;
		editor.video.playUntil = upperBound;
	}
	onNavigation();

	let currentTime = 0;
	let paused = true;
	let slider: HTMLElement;
	let sliderBar: HTMLElement;
	let sliderNubLeft: HTMLElement;
	let sliderNubRight: HTMLElement;
	let sliderActive = false;

	function updateSlider() {
		currentTime = editor.video.currentTime;
		paused = editor.video.paused;

		if (currentTime < lowerBound) {
			slider.style.background = 'var(--color-bg-2)';
		} else if (currentTime > upperBound) {
			slider.style.background = 'var(--color-fg-3)';
		} else {
			const percent = ((100 * (currentTime - lowerBound)) / duration).toFixed(4);
			slider.style.background = `linear-gradient(to right, var(--color-fg-3) ${percent}%, var(--color-bg-2) ${percent}%)`;
		}

		if (!sliderActive) {
			if (currentTime < startTime) {
				sliderBar.style.background = 'var(--color-fg-2)';
			} else if (currentTime > endTime) {
				sliderBar.style.background = 'var(--color-fg-1)';
			} else {
				const percent = ((100 * (currentTime - startTime)) / captionDuration).toFixed(4);
				sliderBar.style.background = `linear-gradient(to right, var(--color-fg-1) ${percent}%, var(--color-fg-2) ${percent}%)`;
			}
			sliderBar.style.transition = 'none';

			if (currentTime < startTime) {
				sliderNubLeft.style.background = 'var(--color-fg-2)';
			} else {
				sliderNubLeft.style.background = 'var(--color-fg-1)';
			}

			if (currentTime < endTime) {
				sliderNubRight.style.background = 'var(--color-fg-2)';
			} else {
				sliderNubRight.style.background = 'var(--color-fg-1)';
			}
		} else {
			sliderBar.style.removeProperty('background');
			sliderNubLeft.style.removeProperty('background');
			sliderNubRight.style.removeProperty('background');
		}
	}

	onMount(() => {
		slider = document.querySelector('#time-slider') as HTMLElement;
		sliderBar = document.querySelector('#time-slider .rangeBar') as HTMLElement;
		[sliderNubLeft, sliderNubRight] = document.querySelectorAll(
			'#time-slider .rangeNub'
		) as NodeListOf<HTMLElement>;
		updateSlider();
	});

	editor.video.addPlaybackListener(() => {
		updateSlider();
	});

	function sliderStart() {
		sliderActive = true;
		updateSlider();
	}

	function sliderStop() {
		sliderActive = false;
		setTimeout(updateSlider, 250);
	}

	function sliderChange() {
		currentCaption.startTime = range[0];
		currentCaption.endTime = range[1];
		updateRange();
	}

	function formatTime(seconds: number) {
		return new Date(seconds * 1000).toISOString().substring(11, 19);
	}

	function togglePlay() {
		if (editor.video.paused && editor.video.currentTime >= upperBound) {
			editor.video.currentTime = lowerBound;
		}
		editor.video.paused = !editor.video.paused;
	}

	function updateCaptionScore() {
		prevCaption = currentCaption.previous;
		// Update score only when user edits text and clicks next
		if (prevCaption?.text !== prevCaption?.originalText) {
			prevCaption ? (prevCaption.score = 1) : null; // Set score to 1 if user edits text
		}
	}

	function reset() {
		currentCaption.text = currentCaption.originalText;
	}

	function onNext() {
		editor.next();
		onNavigation();
		updateCaptionScore();
	}

	function onPrevious() {
		editor.previous();
		onNavigation();
	}
</script>

<head>
	<link
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
		rel="stylesheet"
	/>
</head>

<div class="toolbar">
	<div class="toolbar-slider-row">
		<div style="flex-grow: 1;">
			<RangeSlider
				id="time-slider"
				min={lowerBound}
				max={upperBound}
				step={0.01}
				bind:values={range}
				range
				float
				formatter={formatTime}
				pips
				pipstep={25}
				springValues={{ stiffness: 0.5, damping: 1 }}
				on:start={sliderStart}
				on:stop={sliderStop}
				on:change={sliderChange}
			/>
		</div>

		<button class="slider-button clickable" on:click={togglePlay}>
			{#if !paused}
				<i class="fa fa-pause" aria-hidden="true" />
			{:else if currentTime >= upperBound}
				<i class="fa fa-repeat" aria-hidden="true" />
			{:else}
				<i class="fa fa-play" aria-hidden="true" />
			{/if}
		</button>

		<select class="slider-dropdown select-dark clickable" bind:value={editor.video.playbackRate}>
			<option value={0.5}>0.5x</option>
			<option value={0.75}>0.75x</option>
			<option value={1}>1x</option>
			<option value={1.25}>1.25x</option>
			<option value={1.5}>1.5x</option>
		</select>
	</div>

	<hr class="divider" />

	<div class="toolbar-button-row">
		<button class="toolbar-button clickable" on:click={reset}>reset</button>

		<button class="toolbar-button clickable" style="margin-left: auto;" on:click={onPrevious}
			>previous</button
		>
		<button class="accent-button clickable" on:click={onNext}>done</button>
	</div>
</div>

<style>
	.toolbar {
		width: 100%;
		height: 100px;
		background-color: rgba(62, 62, 62, 0.7);
		-webkit-backdrop-filter: blur(10px);
		backdrop-filter: blur(10px);
		border-radius: 10px;
	}
	.divider {
		height: 1px;
		border: none;
		background-color: var(--color-fg-4);
		margin: 0;
	}
	.toolbar-slider-row,
	.toolbar-button-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		color: var(--color-fg-2);
	}
	.toolbar-button-row {
		height: 48px;
		justify-content: right;
		padding-left: 5px;
		padding-right: 5px;
	}
	.slider-button,
	.slider-dropdown {
		min-width: 30px;
		margin-right: 10px;
		border: none;
		font-size: 16px;
		color: var(--color-fg-2);
	}
	.slider-button {
		background: none;
	}
	.toolbar-button,
	.accent-button {
		height: 25px;
		margin-left: 5px;
		margin-right: 5px;
		border: none;
		border-radius: 5px;
		font-size: 12px;
		color: var(--color-fg-1);
	}
	.toolbar-button {
		background-color: var(--color-fg-4);
	}
	.accent-button {
		background-color: var(--color-accent);
	}
</style>

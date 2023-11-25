<script lang="ts">
	import RangeSlider from 'svelte-range-slider-pips';
	import type { Caption } from '$lib/utils/captions';
	import type { Editor } from '$lib/utils/editor';

	export let editor: Editor;

	let currentCaption = editor.currentCaption;
	let nextCaption: Caption | null;
	let prevCaption: Caption | null;
	let startTime: number;
	let endTime: number;
	let startTimeStr: string;
	let endTimeStr: string;
	let lowerBound: number;
	let upperBound: number;
	let range: number[];

	function update() {
		currentCaption = editor.currentCaption;
		nextCaption = currentCaption.next;
		prevCaption = currentCaption.previous;
		startTime = currentCaption.startTime;
		endTime = currentCaption.endTime;
		startTimeStr = new Date(startTime * 1000).toISOString().substring(11, 19);
		endTimeStr = new Date(endTime * 1000).toISOString().substring(11, 19);
		lowerBound = prevCaption?.endTime ?? 0;
		upperBound = nextCaption?.startTime ?? editor.duration ?? lowerBound;
		range = [startTime, endTime];
	}
	update();

	function updateCaptionSocre() {
		prevCaption = currentCaption.previous;
		// Update score only when user edits text and clicks next
		if (prevCaption?.text !== prevCaption?.originalText) {
			prevCaption ? (prevCaption.score = 1) : null; // Set score to 1 if user edits text
		}
	}

	function undo() {
		if (currentCaption.text !== currentCaption.originalText) {
			document.execCommand('undo');
		}
	}

	function redo() {
		document.execCommand('redo');
	}

	function onNext() {
		editor.next();
		update();
		updateCaptionSocre();
	}

	function onPrevious() {
		editor.previous();
		update();
	}

	function onChange() {
		currentCaption.startTime = range[0];
		currentCaption.endTime = range[1];
	}
</script>

<head>
	<link
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
		rel="stylesheet"
	/>
</head>

<div class="toolbar">
	<RangeSlider
		min={lowerBound}
		max={upperBound}
		step={0.01}
		bind:values={range}
		range
		float
		pips
		pipstep={25}
		on:change={onChange}
	/>
	<hr class="divider" />

	<div class="toolbar-button-row">
		<button class="toolbar-button" on:click={() => undo()}>
			<i class="fa fa-undo" aria-hidden="true" />
		</button>
		<button class="toolbar-button" on:click={() => redo()}>
			<i class="fa fa-redo" aria-hidden="true" />
		</button>
		<button class="toolbar-button" style="margin-left: auto;" on:click={onPrevious}>previous</button
		>
		<button class="next-button" on:click={onNext}>next</button>
	</div>
</div>

<style>
	.toolbar {
		width: 100%;
		height: 100px;
		background-color: #414141bb;
		backdrop-filter: blur(2px);
		border: 1px solid var(--color-border);
		border-radius: 10px;
	}
	.divider {
		height: 1px;
		border: none;
		background-color: #4d4d4d;
		margin: 0;
	}
	.toolbar-button-row {
		height: 48px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: right;
		padding-left: 5px;
		padding-right: 5px;
	}
	.toolbar-button,
	.next-button {
		height: 25px;
		margin-left: 5px;
		margin-right: 5px;
		border: none;
		border-radius: 5px;
		font-family: Arial;
		font-size: 12px;
		color: white;
	}
	.toolbar-button:hover,
	.next-button:hover {
		filter: brightness(1.2);
	}
	.toolbar-button {
		background-color: #555555;
	}
	.next-button {
		background-color: var(--color-accent);
	}
</style>

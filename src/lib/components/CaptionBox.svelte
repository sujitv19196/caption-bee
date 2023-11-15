<script lang="ts">
	import type { Video } from '$lib/utils/video';
	import CaptionTimestamp from './CaptionTimestamp.svelte';
	import InPlaceEdit from './InPlaceEdit.svelte';

	export let vid: Video;
	export let idx: number;
	export let idxEditing: number | undefined;

	let editingHistory: string[] = [vid.captions[idx].text];
	let editingPointer: number = 0;

	const setIdxEditing = (idx: number) => {
		idxEditing = idx;
	};

	function undo() {
		editingPointer = Math.max(editingPointer - 1, 0);
		vid.captions[idx].text = editingHistory[editingPointer];
	}

	function redo() {
		editingPointer = Math.min(editingPointer + 1, editingHistory.length - 1);
		vid.captions[idx].text = editingHistory[editingPointer];
	}

	function reset() {
		vid.captions[idx].text = originalText;
	}

	function changeCaption(field) {
		return ({ detail: newValue }) => {
			editingHistory.push(newValue);
			editingPointer = editingHistory.length - 1;
		};
	}

	let originalText = vid.captions[idx].text;
	console.log('original text: ', originalText);
</script>

<head>
	<link
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
		rel="stylesheet"
	/>
</head>

<button class="caption" on:click={() => setIdxEditing(idx)}>
	{#if idxEditing == idx}
		<CaptionTimestamp
			bind:vid
			{idx}
			prevCaption={idx == 0 ? undefined : vid.captions[idx - 1]}
			nextCaption={idx == vid.captions.length - 1 ? undefined : vid.captions[idx + 1]}
		/>
	{/if}
	<span class="toolbar">
		<button on:click={() => undo()}>
			<i class="fa fa-undo" aria-hidden="true" />
		</button>
		<button on:click={() => redo()}>
			<i class="fa fa-redo" aria-hidden="true" />
		</button>
		<button on:click={() => reset()}> Reset </button>
	</span>
	<InPlaceEdit bind:value={vid.captions[idx].text} on:submit={changeCaption('title')} />
</button>

<style>
	.caption {
		margin-bottom: 10px;
		cursor: pointer;
	}
</style>

<script lang="ts">
	import type { Editor } from '$lib/utils/editor';
	import CaptionTimestamp from './CaptionTimestamp.svelte';
	import InPlaceEdit from './InPlaceEdit.svelte';

	export let editor: Editor;
	export let idx: number;
	export let idxEditing: number | undefined;
	console.log(idx);

	let editingHistory: string[] = [editor.captions[idx].text];
	let editingPointer: number = 0;

	const setIdxEditing = (idx: number) => {
		idxEditing = idx;
	};

	function undo() {
		editingPointer = Math.max(editingPointer - 1, 0);
		editor.captions[idx].text = editingHistory[editingPointer];
	}

	function redo() {
		editingPointer = Math.min(editingPointer + 1, editingHistory.length - 1);
		editor.captions[idx].text = editingHistory[editingPointer];
	}

	function reset() {
		editor.captions[idx].text = originalText;
	}

	function changeCaption(e: CustomEvent) {
		editingHistory.push(e.detail.newValue);
		editingPointer = editingHistory.length - 1;
	}

	let originalText = editor.captions[idx].text;
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
			bind:editor
			{idx}
			prevCaption={idx == 0 ? undefined : editor.captions[idx - 1]}
			nextCaption={idx == editor.captions.length - 1 ? undefined : editor.captions[idx + 1]}
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
	<InPlaceEdit bind:value={editor.captions[idx].text} on:submit={changeCaption} />
</button>

<style>
	.caption {
		margin-bottom: 10px;
		cursor: pointer;
	}
</style>

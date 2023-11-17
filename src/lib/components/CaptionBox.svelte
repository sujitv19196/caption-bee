<script lang="ts">
	import type { Caption } from '$lib/utils/captions';
	import CaptionTimestamp from './CaptionTimestamp.svelte';
	import InPlaceEdit from './InPlaceEdit.svelte';

	// export let editor: Editor;
	export let caption: Caption;
	export let isCurrent: boolean;
	export let positionY: number;

	let editingHistory: string[] = [caption.text];
	let editingPointer: number = 0;

	function undo() {
		console.log('undo function');
		console.log(editingPointer, editingHistory);

		editingPointer = Math.max(editingPointer - 1, 0);
		caption.text = editingHistory[editingPointer];
	}

	function redo() {
		console.log('redo function');
		console.log(editingPointer, editingHistory);

		editingPointer = Math.min(editingPointer + 1, editingHistory.length - 1);
		caption.text = editingHistory[editingPointer];
	}

	function reset() {
		caption.text = originalText;
	}

	function changeCaption(e: CustomEvent) {
		if (caption.text == editingHistory.at(-1)) {
			return;
		}

		editingHistory.push(caption.text);
		editingPointer = editingHistory.length - 1;
	}

	let originalText = caption.text;
	// console.log('original text: ', originalText);
</script>

<head>
	<link
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
		rel="stylesheet"
	/>
</head>

<div class="caption-container" style="position: absolute; top: {positionY}px; left: 200px;">
	<!-- {#if idxEditing == idx}
        <CaptionTimestamp
            bind:editor
            {idx}
            prevCaption={idx == 0 ? undefined : editor.captions[idx - 1]}
            nextCaption={idx == editor.captions.length - 1 ? undefined : editor.captions[idx + 1]}
        />

        <span class="toolbar">
            <button on:click={() => undo()}>
                <i class="fa fa-undo" aria-hidden="true" />
            </button>
            <button on:click={() => redo()}>
                <i class="fa fa-redo" aria-hidden="true" />
            </button>
            <button on:click={() => reset()}> Reset </button>
        </span>
    {/if} -->

	<InPlaceEdit bind:value={caption.text} editing={isCurrent} on:submit={changeCaption} />
</div>

<style>
	.caption {
		margin-bottom: 10px;
		cursor: pointer;
		width: 100%;
	}
</style>

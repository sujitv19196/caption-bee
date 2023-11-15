<script lang="ts">
	import type { Editor } from '$lib/utils/editor';
	import CaptionTimestamp from './CaptionTimestamp.svelte';
	import InPlaceEdit from './InPlaceEdit.svelte';

	export let editor: Editor;
	export let idx: number;
	export let idxEditing: number | undefined;
	console.log(idx);

	const setIdxEditing = (idx: number) => {
		idxEditing = idx;
	};

	// function changeCaption(field: string) {
	// 	return ({ detail: newValue }) => {
	// 		// IRL: POST value to server here
	// 		console.log(`updated ${field}, new value is: "${newValue}"`);
	// 	};
	// }
</script>

<button class="caption" on:click={() => setIdxEditing(idx)}>
	{#if idxEditing == idx}
		<CaptionTimestamp
			bind:editor
			{idx}
			prevCaption={idx == 0 ? undefined : editor.captions[idx - 1]}
			nextCaption={idx == editor.captions.length - 1 ? undefined : editor.captions[idx + 1]}
		/>
	{/if}
	<InPlaceEdit bind:value={editor.captions[idx].text} />
</button>

<style>
	.caption {
		margin-bottom: 10px;
		cursor: pointer;
	}
</style>

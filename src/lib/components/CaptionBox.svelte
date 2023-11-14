<script lang="ts">
	import type { Video } from '$lib/utils/video';
	import CaptionTimestamp from './CaptionTimestamp.svelte';
	import InPlaceEdit from './InPlaceEdit.svelte';

	export let vid: Video;
	export let idx: number;
	export let idxEditing: number | undefined;

	const setIdxEditing = (idx: number) => {
		idxEditing = idx;
	};

	function changeCaption(field) {
		return ({ detail: newValue }) => {
			// IRL: POST value to server here
			console.log(`updated ${field}, new value is: "${newValue}"`);
		};
	}
</script>

<button class="caption" on:click={() => setIdxEditing(idx)}>
	{#if idxEditing == idx}
		<CaptionTimestamp
			bind:vid
			{idx}
			prevCaption={idx == 0 ? undefined : vid.captions[idx - 1]}
			nextCaption={idx == vid.captions.length - 1 ? undefined : vid.captions[idx + 1]}
		/>
	{/if}
	<InPlaceEdit bind:value={vid.captions[idx].text} on:submit={changeCaption('title')} />
</button>

<style>
	.caption {
		margin-bottom: 10px;
		cursor: pointer;
	}
</style>

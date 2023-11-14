<script lang="ts">
	import type { Video } from '$lib/utils/video';
	import CaptionTimestamp from './CaptionTimestamp.svelte';

	export let vid: Video;
	export let idx: number;
	export let idxEditing: number | undefined;

	const setIdxEditing = (idx: number) => {
		idxEditing = idx;
	};
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
	{vid.captions[idx].text}
</button>

<style>
	.caption {
		margin-bottom: 10px;
		cursor: pointer;
	}
</style>

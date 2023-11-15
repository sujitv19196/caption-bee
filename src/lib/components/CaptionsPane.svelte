<script lang="ts">
	import CaptionBox from './CaptionBox.svelte';
	import type { Editor } from '$lib/utils/editor';

	export let editor: Editor;
	console.log(editor.duration);

	let idxEditing: number | undefined = undefined;
</script>

<div class="captions-container">
	<span class="toolbar">
		<button>Undo</button> <button>Redo</button>
		<button> Show Original </button>
	</span>
	{#if !editor.captions.length}
		<p>No captions available</p>
	{:else}
		{#each editor.captions as _, idx}
			<CaptionBox bind:editor {idx} bind:idxEditing />
		{/each}
	{/if}
</div>

<style>
	.toolbar {
		display: block;
		margin-bottom: 10px;
	}
	.captions-container {
		width: 30%;
		margin: 10px;
		padding: 10px;
		border-radius: 10px;
		overflow-y: auto;
		background-color: #f0f0f0;
	}
</style>

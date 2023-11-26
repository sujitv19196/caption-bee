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

	onMount(() => {
		const track = video.addTextTrack('captions', 'Captions', 'en');
		track.mode = 'showing';
		for (const caption of editor.captions) {
			track.addCue(caption.vttCue);
		}
	});
</script>

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

<style>
	#video-player {
		width: calc(100% - 20px);
		margin: 10px;
		border-radius: 10px;
	}
</style>

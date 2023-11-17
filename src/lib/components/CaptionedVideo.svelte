<script lang="ts">
	import { onMount } from 'svelte';
	import type { Editor } from '$lib/utils/editor';

	export let editor: Editor;
	export let videoSrc: string;
	export let hidden: boolean;

	let video: HTMLVideoElement;
	let currentTime: number;
	let paused: boolean;
	let ended: boolean;
	let volume: number;

	editor.addNavigationListener(() => {
		currentTime = editor.currentCaption.startTime;
	});

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
	bind:currentTime
	bind:paused
	bind:ended
	bind:volume
	bind:duration={editor.duration}
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

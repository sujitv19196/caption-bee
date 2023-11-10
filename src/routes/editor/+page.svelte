<script lang="ts">
	import CaptionedVideo from '$lib/components/CaptionedVideo.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let mouseSplitterDistance: number;
	let mouseNearSplitter = false;
	let splitterMoving = false;
	let leftPaneWidth = 400;
	let leftPaneHidden = false;

	function onMouseDown(e: Event) {
		if (mouseNearSplitter) {
			splitterMoving = true;
		}
	}

	function onMouseUp(e: Event) {
		splitterMoving = false;
	}

	function onMouseMove(e: MouseEvent) {
		if (!splitterMoving) {
			mouseSplitterDistance = Math.abs(e.clientX - leftPaneWidth);
			mouseNearSplitter = (mouseSplitterDistance <= 3);
			if (mouseNearSplitter) {
				document.documentElement.style.cursor = 'col-resize';
			} else {
				document.documentElement.style.cursor = 'auto';
			}
		} else {
			if (e.clientX < 150) {
				leftPaneWidth = 5;
				leftPaneHidden = true;
			} else {
				leftPaneWidth = Math.max(300, Math.min(e.clientX + mouseSplitterDistance, 800));
				leftPaneHidden = false;
			}
		}
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<svelte:window
	on:mousedown={onMouseDown}
	on:mouseup={onMouseUp}
	on:mousemove={onMouseMove}
/>

<div id="content">
	<div id="leftPane" style="width: {leftPaneWidth}px;">
		<CaptionedVideo
			videoSrc="/movie.mp4"
			captions={data.captions}
			hidden={leftPaneHidden}
		>
		</CaptionedVideo>
	</div>

	<div id={mouseNearSplitter ? 'splitterHover' : 'splitter'}>

	</div>

	<div id="rightPane">

	</div>
</div>


<style>
	#content {
		display: flex;
		flex-direction: row;
		width: 100vw;
		flex-grow: 1;
		align-items: stretch;
		background-color: var(--color-bg-1);
	}
	#splitter {
		width: 1px;
		background-color: var(--color-border);
	}
	#splitterHover {
		width: 1px;
		background-color: var(--color-accent);
	}
	#rightPane {
		flex-grow: 1;
		background: radial-gradient(ellipse at center, var(--color-bg-2) 60%, var(--color-bg-1) 120%);
	}
</style>

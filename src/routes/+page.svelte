<script lang="ts">
	import { base } from '$app/paths';
	import CaptionedVideo from '$lib/components/CaptionedVideo.svelte';
	import CaptionsPane from '$lib/components/CaptionsPane.svelte';
	import SettingsMenu from '$lib/components/SettingsMenu.svelte';
	import { Caption } from '$lib/utils/caption';
	import { Editor } from '$lib/utils/editor';
	import { currentTheme } from '$lib/utils/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	let settings: { [key: string]: any } = {};

	const captions = Caption.deserializeCaptions(data.captions);
	const editor = new Editor(captions);

	function handleSettingsChange(updatedSettings: { [key: string]: any }) {
		settings = updatedSettings.detail;
		editor.setAdvancedMode(!settings['quickEdit']);
		editor.setUncertaintyThreshold(settings['highAccuracyThreshold']);

		const isLightTheme = settings.lightTheme;
		if (isLightTheme) {
			currentTheme.set('light-theme');
		} else {
			currentTheme.set('dark-theme');
		}
	}

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
			mouseNearSplitter = mouseSplitterDistance <= 3;
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
	<title>Editor</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<svelte:window on:mousedown={onMouseDown} on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<div id="content">
	<div id="leftPane" style="width: {leftPaneWidth}px;">
		<CaptionedVideo videoSrc="{base}/movie.mp4" {editor} hidden={leftPaneHidden} />
	</div>

	<div id={mouseNearSplitter ? 'splitter-hover' : 'splitter'} />

	<div id="right-pane">
		<CaptionsPane {editor} {settings} />
	</div>
</div>

<div id="settings-menu">
	<SettingsMenu on:settingsChange={handleSettingsChange} />
</div>

<style>
	#content {
		position: relative;
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
	#splitter-hover {
		width: 1px;
		background-color: var(--color-accent);
	}
	#right-pane {
		flex: 1;
		background-color: var(--color-bg-2);
	}
	#settings-menu {
		position: absolute;
		top: 10px;
		right: 10px;
	}
</style>

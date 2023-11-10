<script lang="ts">
    import { onMount } from 'svelte';
    import { Caption, type SerializedCaption } from '$lib/utils/captions';

    export let videoSrc: string;
    export let captions: SerializedCaption[];
    export let hidden: boolean;

    let video: HTMLVideoElement;
    let currentTime: number;
    let paused: boolean;
    let ended: boolean;
    let volume: number;

    const _captions = Caption.deserializeCaptions(captions);

    onMount(() => {
        const track = video.addTextTrack('captions', 'Captions', 'en');
        track.mode = 'showing';
        for (const caption of _captions) {
            track.addCue(caption.vttCue);
        }
    })
</script>

<video
    id="videoPlayer"
    hidden={hidden}
    controls
    src={videoSrc}
    bind:this={video}
    bind:currentTime
    bind:paused
    bind:ended
    bind:volume
/>

<style>
    #videoPlayer {
        width: calc(100% - 20px);
        margin: 10px;
        border-radius: 10px;
    }
</style>

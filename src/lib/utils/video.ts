import { get, writable, type Writable } from 'svelte/store';
import type { Analytics } from "./analytics";

export class VideoController {
    private _analytics: Analytics;
    private _duration: number;
    private _currentTimeStore: Writable<number>;
    private _pausedStore: Writable<boolean>;
    private _playbackRateStore: Writable<number>;
    private _playUntil: number | null;
    private _playbackListeners: ((paused: boolean) => void)[];

    constructor(analytics: Analytics) {
        this._analytics = analytics;
        this._duration = 1e9;
        this._currentTimeStore = writable(0);
        this._pausedStore = writable(true);
        this._playbackRateStore = writable(1);
        this._playUntil = null;
        this._playbackListeners = [];

        this._currentTimeStore.subscribe((value: number) => {
            for (const fn of this._playbackListeners) {
                fn(get(this._pausedStore));
            }
            if (this._playUntil != null && value >= this._playUntil) {
                this.paused = true;
            }
        })
        this._pausedStore.subscribe((value: boolean) => {
            for (const fn of this._playbackListeners) {
                fn(value);
            }
        })
        this._playbackRateStore.subscribe((value: number) => {
            for (const fn of this._playbackListeners) {
                fn(get(this._pausedStore));
            }
        })
    }

    get duration(): number {
        return this._duration;
    }

    set duration(value: number) {
        this._duration = value;
    }

    get currentTime(): number {
        return get(this._currentTimeStore);
    }

    set currentTime(value: number) {
        this._currentTimeStore.set(value);
    }

    get currentTimeStore(): Writable<number> {
        return this._currentTimeStore;
    }

    get paused(): boolean {
        return get(this._pausedStore);
    }

    set paused(value: boolean) {
        this._pausedStore.set(value);
        this._analytics.setPaused(value);
    }

    get pausedStore(): Writable<boolean> {
        return this._pausedStore;
    }

    get playbackRate(): number {
        return get(this._playbackRateStore);
    }

    set playbackRate(value: number) {
        this._playbackRateStore.set(value);
    }

    get playbackRateStore(): Writable<number> {
        return this._playbackRateStore;
    }

    get playUntil(): number | null {
        return this._playUntil;
    }

    set playUntil(value: number) {
        this._playUntil = value;
    }

    addPlaybackListener(fn: (paused: boolean) => void) {
        this._playbackListeners.push(fn);
    }
}

import type { Caption } from "./captions";

export class Editor {
    private _captions: Caption[];
    private _currentIdx: number;
    private _duration: number | undefined;
    private _navigationListeners: ((currentIdx: number) => void)[];

    public constructor(captions: Caption[]) {
        this._captions = captions;
        this._currentIdx = 0;
        this._navigationListeners = [];
    }

    get duration(): number | undefined {
        return this._duration;
    }

    set duration(value: number) {
        this._duration = value;
    }

    get captions(): Caption[] {
        return this._captions;
    }

    get currentIdx(): number {
        return this._currentIdx;
    }

    get currentCaption(): Caption {
        return this._captions[this._currentIdx];
    }

    next() {
        if (this._currentIdx < this._captions.length - 1) {
            this._currentIdx += 1;
        }
        for (const fn of this._navigationListeners) {
            fn(this._currentIdx);
        }
    }

    previous() {
        if (this._currentIdx > 0) {
            this._currentIdx -= 1;
        }
        for (const fn of this._navigationListeners) {
            fn(this._currentIdx);
        }
    }

    addNavigationListener(fn: (currentIdx: number) => void) {
        this._navigationListeners.push(fn);
    }

    setCaption(caption: Caption, idx: number): void {
        this._captions[idx] = caption;
    }
}

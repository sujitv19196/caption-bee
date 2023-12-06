import { Analytics } from "./analytics";
import type { Caption } from "./caption";
import { VideoController } from "./video";

export class Editor {
    private _analytics: Analytics;
    private _video: VideoController;
    private _captions: Caption[];
    private _currentIdx: number;
    private _prevIdx: number;
    private _navigationListeners: ((currentIdx: number, prevIdx: number) => void)[];
    private _advancedMode: boolean;
    private _uncertaintyThreshold: number;
    private _numCompleted: number;
    private _numSkipped: number;
    private _numRemaining: number;

    public constructor(captions: Caption[]) {
        this._analytics = new Analytics();
        this._video = new VideoController(this._analytics);
        this._captions = captions;
        this._currentIdx = 0;
        this._prevIdx = this.currentIdx;
        this._navigationListeners = [];
        this._advancedMode = false;
        this._uncertaintyThreshold = 0.7;
        this._numCompleted = 0;
        this._numSkipped = 0;
        this._numRemaining = 0;
        this.calculateProgress();
    }

    get video(): VideoController {
        return this._video;
    }

    get captions(): Caption[] {
        return this._captions;
    }

    get currentIdx(): number {
        return this._currentIdx;
    }

    get prevIdx(): number {
        return this._prevIdx;
    }

    get currentCaption(): Caption {
        return this._captions[this._currentIdx];
    }

    get completedCaptions(): number {
        return this._numCompleted;
    }

    get remainingCaptions(): number {
        return this._numRemaining;
    }

    get skippedCaptions(): number {
        return this._numSkipped;
    }

    next() {
        if (this._currentIdx < this._captions.length - 1) {
            this._analytics.finishEdit(this._currentIdx, this._captions[this._currentIdx]);
            this._captions[this._currentIdx].edited = true;
            this._prevIdx = this.currentIdx;
            while (this._currentIdx < this._captions.length - 1) {
                this._currentIdx += 1;
                if (this._advancedMode || this._captions[this._currentIdx].score < this._uncertaintyThreshold) {
                    break;
                }
            }

            this._numCompleted += 1;
            this._numSkipped += this._currentIdx - this._prevIdx - 1
            this._numRemaining -= 1;
            this.invokeListeners();
            this._analytics.startEdit(this._currentIdx, this._captions[this._currentIdx]);
        } else {
            this._analytics.download();
        }
    }

    previous() {
        if (this._currentIdx > 0) {
            this._analytics.finishEdit(this._currentIdx, this._captions[this._currentIdx]);
            this._prevIdx = this.currentIdx;
            while (this._currentIdx > 0) {
                this._currentIdx -= 1;
                if (this._advancedMode || this._captions[this._currentIdx].score < this._uncertaintyThreshold) {
                    break;
                }
            }

            this._numCompleted -= 1;
            this._numSkipped -= this._prevIdx - this._currentIdx - 1
            this._numRemaining += 1;
            this.invokeListeners();
            this._analytics.startEdit(this._currentIdx, this._captions[this._currentIdx]);
        }
    }

    addNavigationListener(fn: (currentIdx: number, prevIdx: number) => void) {
        this._navigationListeners.push(fn);
    }

    setCaption(caption: Caption, idx: number): void {
        this._captions[idx] = caption;
    }

    setAdvancedMode(advancedMode: boolean): void {
        if (advancedMode !== this._advancedMode) {
            this._advancedMode = advancedMode;
            this._currentIdx = 0;
            this.calculateProgress();
            this.invokeListeners();
        }
    }

    setUncertaintyThreshold(uncertaintyThreshold: number): void {
        if (uncertaintyThreshold !== this._uncertaintyThreshold) {
            this._uncertaintyThreshold = uncertaintyThreshold;
            this._currentIdx = 0;
            this.calculateProgress();
            this.invokeListeners();
        }
    }

    private calculateProgress() {
        this._numCompleted = 0;
        this._numSkipped = 0;
        this._numRemaining = 0;
        let idx = this._currentIdx;
        while (idx < this._captions.length) {
            if (this._advancedMode || this._captions[idx].score < this._uncertaintyThreshold) {
                this._numRemaining += 1;
            }
            idx += 1;
        }
    }

    private invokeListeners() {
        for (const fn of this._navigationListeners) {
            fn(this._currentIdx, this.prevIdx);
        }
    }
}

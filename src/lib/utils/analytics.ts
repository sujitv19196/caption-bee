import type { Caption } from "./caption";

interface Edit {
    index: number;
    duration: number;
    playbackDuration: number;
    oldStartTime: number;
    newStartTime?: number;
    oldEndTime: number;
    newEndTime?: number;
    oldText: string;
    newText?: string;
}

export class Analytics {
    private _edits: Edit[];
    private _editStartTime: number;
    private _paused: boolean;
    private _playbackStartTime: number;

    constructor() {
        this._edits = [];
        this._editStartTime = 0;
        this._paused = true;
        this._playbackStartTime = 0;
    }

    startEdit(index: number, caption: Caption) {
        const edit: Edit = {
            index,
            duration: 0,
            playbackDuration: 0,
            oldStartTime: caption.startTime,
            oldEndTime: caption.endTime,
            oldText: caption.text
        }
        this._edits.push(edit);
        this._editStartTime = performance.now()
        if (!this._paused) {
            this._playbackStartTime = this._editStartTime;
        }
    }

    setPaused(paused: boolean) {
        if (paused !== this._paused) {
            if (!paused) {
                this._playbackStartTime = performance.now();
            } else if (this._edits.length > 0) {
                const edit = this._edits[this._edits.length - 1];
                edit.playbackDuration += performance.now() - this._playbackStartTime;
            }
            this._paused = paused;
        }
    }

    finishEdit(index: number, caption: Caption) {
        if (this._edits.length > 0) {
            const edit = this._edits[this._edits.length - 1];
            const now = performance.now();
            edit.duration = now - this._editStartTime;
            if (!this._paused) {
                edit.playbackDuration += now - this._playbackStartTime;
            }
            edit.newStartTime = caption.startTime;
            edit.newEndTime = caption.endTime;
            edit.newText = caption.text;
        }
    }

    download() {
        const file = new File([JSON.stringify(this._edits)], 'analytics.json', {
            type: 'text/plain'
        })
        const link = document.createElement('a')
        const url = URL.createObjectURL(file)

        link.href = url
        link.download = file.name
        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }
}




export interface SerializedCaption {
    startTime: number;
    endTime: number;
    text: string;
    originalText?: string;
}


export class Caption {
    private _startTime: number;
    private _endTime: number;
    private _text: string;
    private _originalText: string;
    private _next: Caption | null = null;
    private _previous: Caption | null = null;
    private _vttCue: VTTCue;

    get startTime(): number {
        return this._startTime;
    }

    set startTime(value: number) {
        this._startTime = value;
    }

    get endTime(): number {
        return this._endTime;
    }

    set endTime(value: number) {
        this._endTime = value;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
        this._vttCue.text = value;
    }

    get originalText(): string {
        return this._originalText;
    }

    get next(): Caption | null {
        return this._next;
    }

    get previous(): Caption | null {
        return this._previous;
    }

    get vttCue(): VTTCue {
        return this._vttCue;
    }

    private constructor(serialized: SerializedCaption) {
        this._startTime = serialized.startTime;
        this._endTime = serialized.endTime;
        this._text = serialized.text;
        this._originalText = serialized.originalText ?? serialized.text;
        this._vttCue = new VTTCue(this._startTime, this._endTime, this._text);
    }

    serialize(): SerializedCaption {
        return {
            startTime: this._startTime,
            endTime: this._endTime,
            text: this._text,
            originalText: this._originalText,
        };
    }

    static deserializeCaptions(serialized: SerializedCaption[]): Caption[] {
        const captions: Caption[] = [];
        let lastCaption: Caption | null = null;
        for (const item of serialized) {
            const caption = new Caption(item);
            if (lastCaption != null) {
                caption._previous = lastCaption;
                lastCaption._next = caption;
            }
            lastCaption = caption;
            captions.push(caption);
        }
        return captions;
    }
}

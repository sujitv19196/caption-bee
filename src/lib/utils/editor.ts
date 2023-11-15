import type { Caption } from "./captions";

export class Editor {
  private _src: string;
  private _duration: number | undefined;
  private _captions: Caption[];

  public constructor(src: string, captions: Caption[]) {
    this._src = src;
    this._captions = captions;
  }

  get src(): string {
    return this._src;
  }

  set src(value: string) {
    this._src = value;
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

  set captions(value: Caption[]) {
    this._captions = value;
  }

  public setCaption(caption: Caption, idx: number): void {
    this._captions[idx] = caption;
  }
}
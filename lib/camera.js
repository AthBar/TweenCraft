import { physicalInstance } from "./instance.js";

export class _camera extends physicalInstance{}
export class Camera extends _camera{
    #zoom = [1,1];
    set xZoom(v){this.#zoom[0] = v}
    set yZoom(v){this.#zoom[1] = v}
    get xZoom(){return this.#zoom[0]}
    get yZoom(){return this.#zoom[1]}
    get zoom(){return [this.#zoom[0].valueOf(), this.#zoom[1].valueOf()]}
    set zoom(v){this.#zoom[0] = this.#zoom[1] = v}
}
export class OneZoomCamera extends _camera{zoom=1}
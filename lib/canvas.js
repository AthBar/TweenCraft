class Canvas{
    #el;
    #ctx;
    constructor(element){
        if (element instanceof HTMLCanvasElement){
            this.#el = element;
            this.#ctx = this.#el.getContext("2d");
        }
    }
    setToCurrentFullscreen(){
        this.#el.width = window.innerWidth;
        this.#el.height = window.innerHeight;
    }
    set width(v){return this.#el.width=v}
    set height(v){return this.#el.height=v}
    get element(){return this.#el}
    get ctx(){return this.#ctx}
}

export {Canvas};
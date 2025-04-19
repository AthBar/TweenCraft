import { innerWindowSize } from "./primitive.js";

class Canvas extends EventTarget{
    #el;
    #ctx;
    #fullscreenObserver = new ResizeObserver(e=>{
        let parentElement = e[0].target;
        let size = [parentElement.clientWidth, parentElement.clientHeight];
        [this.#el.width, this.#el.height] = size;

        this.dispatchEvent(new Event("viewportchange", {"width":size[0],"height":size[1]}))
    });
    #fullscreenParent;
    #nonFullScreenSize = [0,0];
    constructor(element){
        super();
        if (element instanceof HTMLCanvasElement){
            this.#el = element;
            this.#ctx = this.#el.getContext("2d");
        }
    }
    setToFullscreen(parentElement, saveFullscreen=false){
        parentElement = parentElement||this.#el.parentElement;
        if(this.#fullscreenParent instanceof HTMLElement)this.stopFullscreen();
        this.#fullscreenObserver.observe(parentElement);

        //Save current size and set size to 100%. If I don't set it to 100% the body will get two resizes (initial resize and then 
        // the resize caused by the canvas size being set to the new image size in pixels). By setting it to 100% we make sure the
        // physical canvas size is never changing regardless of image size. Image size is set immediately and we get one event anyway
        this.#nonFullScreenSize = saveFullscreen?[this.#el.style.width, this.#el.style.height]:undefined;
        this.#el.style.width = this.#el.style.height = "100%";
        this.#el.setAttribute("fullscreen","");
    }
    stopFullscreen(){
        this.#fullscreenObserver.unobserve(this.#fullscreenParent);

        //Reset previous size before fullscreen
        [this.#el.style.width, this.#el.style.height] = this.#nonFullScreenSize||[null,null];
        this.#el.removeAttribute("fullscreen");
    }
    set width(v){return this.#el.width=v}
    set height(v){return this.#el.height=v}
    get element(){return this.#el}
    get ctx(){return this.#ctx}
}

export {Canvas};
import { Canvas } from "./canvas.js";
import { NumberValue } from "./primitive.js";
import { Scene } from "./scene.js";

class BaseProject{
    name;
    #version=[1];
    get version(){
        return this.#version;
    }
}

class Project extends BaseProject{
    #canvas;
    #scene;
    #autodraw = [];
    #drawing = false;
    #time;
    constructor(canvas){super();
        if(!(canvas instanceof Canvas))throw new TypeError("Canvas must be an instance or descendant of Canvas (defined in /canvas.js)");
        this.#canvas = canvas;
        this.#scene = new Scene();
        this.#autodraw.push(canvas.addEventListener("viewportchange", e=>{
            this.draw(true);
        }));
        this.#perFrame(0);
    }
    set time(v){if(NumberValue.isNumberValue(v))this.#time=v}
    draw(bypass){
        if(!bypass&&this.#drawing)return;
        this.#drawing = true;
        let ctx = this.#canvas.ctx;
        ctx.fillStyle = "red";
        ctx.clearRect(-1000,-1000,2000,2000);
        this.#scene.render(ctx,this.#time);
    }
    #perFrame(now){
        this.#drawing = false;
        window.requestAnimationFrame(now=>this.#perFrame(now));
    }
    get scene(){return this.#scene}
    set scene(v){
        if(v instanceof Scene)this.#scene = v
    }
}

export {Project}
import { Canvas } from "./canvas.js";
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
    constructor(canvas){super();
        if(!(canvas instanceof Canvas))throw new TypeError("Canvas must be an instance or descendant of Canvas (defined in /canvas.js)");
        this.#canvas = canvas;
        this.#scene = new Scene();
    }
    draw(time){
        let ctx = this.#canvas.ctx;
        ctx.fillStyle = "red";
        ctx.clearRect(-1000,-1000,2000,2000);
        this.#scene.render(ctx,time);
    }
    get scene(){return this.#scene}
    set scene(v){
        if(v instanceof Scene)this.#scene = v
    }
}

export {Project}
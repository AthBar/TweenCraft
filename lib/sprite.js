import {physicalInstance} from "./instance.js"
import { Vector2 } from "./primitive.js";

export class _sprite extends physicalInstance{draw(){}}
export class _rectSprite extends _sprite{
    #size = [1,1];
    set width(v){this.#size[0] = v}
    get width(){return this.#size[0].valueOf()}
    set height(v){this.#size[1] = v}
    get height(){return this.#size[1].valueOf()}
    get currentSize(){
        return [this.#size[0].valueOf(), this.#size[1].valueOf()];
    }
    setTransform(ctx){
        //Set transform to defaults and let the object handle scaling
        ctx.setTransform(
            1,0,0,1,
            ...this.currentPosition  //position
        );
    }
}

//Make difference in the rendering
export class fixedSprite extends _rectSprite{}
export class worldSprite extends _sprite{}

/**                                          ISSUE
 * As of the second stable pre-release (I don't even have a version number yet cuz why the hell would I?)
 * the Fixed and World sprite variants are both affected by the camera. This will obviously not stay like
 * this, but I'm still developing. 
 * 
 * My (master, genius) plan for them is the following:
 * * Make a multi-canvas multi-context system that will end up rendering to the final canvas (Project.canvas)
 * * Possibly make each scene have a different canvas
 * * Make a UI scene subclass (is that how it's called?) that will handle the UI specifically
 * * OR make each scene have two canvases but I don't think I want to optimize allat
 * * Make a "final" or "master" scene class that may not be a child of another scene (unlike normal scenes)
 * and has to be the child of a project. If this happens I will disallow normal scenes to be children of a
 * project. The master scene WILL have a dual canvas system for the world and the UI and possibly sorting layers
 * 
 * I'M SO FUCKING EXCITED I'M STILL 15 I AM AWESOME I AM A GENIUS I AM HIM HELL YEAH >:))))
 * 
 * Real talk though I am overstimulated by what the potential for this is. I think of code concepts so much 
 * faster than I can actually develop them. This is a promise to myself that I will stay consistent until I am done
 */
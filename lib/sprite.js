import {physicalInstance} from "./instance.js"

export class _sprite extends physicalInstance{draw(){}}
export class _rectSprite extends _sprite{
    #size = [1,1];
    set width(v){this.#size[0] = v}
    set height(v){this.#size[1] = v}
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

export class UIRect extends fixedSprite{
    #borderSize=2;
    draw(ctx){
        let size = this.currentSize;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(-size[0]/2,-size[1]/2,...size);
    }
}
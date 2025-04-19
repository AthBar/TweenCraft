import { fixedSprite } from "../sprite.js";

export class UIRect extends fixedSprite{
    #borderSize=2;
    draw(ctx){
        let size = this.currentSize;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(-size[0]/2,-size[1]/2,...size);
    }
}
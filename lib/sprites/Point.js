import { fixedSprite, worldSprite } from "../sprite.js";

export class WorldPoint extends worldSprite{
    #radius=2;
    #full = true;
    #color;
    draw(ctx){
        ctx.lineWidth = this.#radius;
        if(this.#color)this.#full?ctx.fillStyle=this.#color:ctx.strokeStyle=this.#color;
        ctx.beginPath();
        ctx.moveTo(...this.currentPosition);
        ctx.arc(0,0, this.#radius, 0, Math.PI*2);
        this.#full?ctx.fill():ctx.stroke();
    }
}

//Yes, I have to recode the class with a different inheritance. I don't plan on changing this
//I might make a single internal class that has the properties and functions and have both just reference it but not yet

/*
Something like this:
    class Point{#radius;...;draw(ctx){...}}
    ScreenPoint.draw = ()=>{ ...; Point.draw.call(this, ...)}
*/

export class ScreenPoint extends fixedSprite{
    #radius=2;
    #full = true;
    #color;
    draw(ctx){
        ctx.lineWidth = this.#radius;
        if(this.#color)this.#full?ctx.fillStyle=this.#color:ctx.strokeStyle=this.#color;
        ctx.beginPath();
        ctx.moveTo(...this.currentPosition);
        ctx.arc(0,0, this.#radius, 0, Math.PI*2);
        this.#full?ctx.fill():ctx.stroke();
    }
}

/*
 * Yes, I have one file for both Screen and World Points but different ones for "UI" and World Rectangles
 * The thing is a rectangle is more common to be used in UIs than a point. A ScreenPoint is non standard
 * for GUIs and anything you might want to show independently of a camera. From now on know that if you
 * see a type that has one file but both variants it simply means it's a non standard GUI element
 */
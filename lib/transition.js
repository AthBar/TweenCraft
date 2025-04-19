import { EASE, Ease } from "./easing.js";
import { _instance } from "./instance.js";

class _transition extends _instance{
    #ease;
    constructor(ease){
        super();
        this.ease = ease;
    }
    set ease(v){
        if(v instanceof Ease)this.#ease = v;
        else try{
            this.#ease = new Ease(v);
        }
        catch {
            this.#ease = EASE.LINEAR;
        }
    }
    get ease(){return this.#ease}
}

export class Keyframe extends _transition{
    targetValue;
    targetTime;
    constructor(time,value,ease){
        super(ease);
        this.targetValue = value;
        this.targetTime = time;
    }
}

Keyframe.applyValue = function(time,previous,next){
    let start = previous.targetTime;
    let end = next.targetTime;
    let duration = end-start;

    let position = time - start;
    
    let progress = position / duration;
    let eased = next.ease.ease(progress);

    let startValue = previous.targetValue;
    let endValue = next.targetValue;
    let difference = endValue-startValue;

    return startValue + difference*eased;
}
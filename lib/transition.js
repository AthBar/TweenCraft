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

//Define as:
// Transition: Move to target, lasting for the duration
// Motion: Move from start to target, lasting for the duration
// Motion Keyframe: Move from start to target, starting now ending at the target time
// Keyframe: Move to target, starting now ending at the target time

class Transition extends _transition{
    #target;
    #duration;
    constructor(target, duration){
        this.#target=target;
        this.#duration=duration;
    }
}

class Motion extends _transition{
    #start;
    #end;
    #duration;
    constructor(startValue, endValue, duration){

    }
};

export class Keyframe extends _transition{
    targetValue;
    targetTime;
    constructor(time,value,ease){
        super(ease);
        this.targetValue = value;
        this.targetTime = time;
    }
}
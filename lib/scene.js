import { Camera, _camera } from "./camera.js";
import { _instance } from "./instance.js";
import { _sprite, worldSprite } from "./sprite.js";
import { Keyframe } from "./transition.js";



class _baseScene extends _sprite{
    #camera;
    constructor(camera){
        super();
        this.setParent(this);
        this.lock(false);

        this.#camera = (camera instanceof _camera)?camera:new Camera();
    }
    render(ctx){
        let scale = this.#camera.zoom;
        ctx.setTransform(scale[0],0,0,scale[1],-this.#camera.x,-this.#camera.y);
        for (let i of this.children){
            ctx.translate(i.x,i.y);

            i.draw(ctx);

            ctx.translate(-i.x,-i.y);
        }
    }
    set camera(v){if(v instanceof _camera)this.#camera=v}
    get camera(){return this.#camera}
}


//Play scene
export class Scene extends _baseScene{
    #instanceTransitions = new Map();
    constructor(){
        super();
    }
    render(ctx,time){
        this.applyKeyframes(time);
        _baseScene.prototype.render.call(this, ctx);
    }
    applyKeyframes(time){
        //Instance keyframes
        for (let [instance, perProp] of this.#instanceTransitions){
            if (!this.isRelevant(instance))continue;
            //Per property
            for (let prop in perProp){
                let list = perProp[prop];
                if(!list.get("inOrder"))list = perProp[prop] = this.getAscendingKeysMap(list);

                let previous;
                let next;

                //Per keyframe (find in between which frames time is)
                for (let [keyTime, transition] of list){
                    if(!Number.isFinite(keyTime))continue;

                    next = transition;
                    if(time <= transition.targetTime)break;
                    previous = transition;
                }
                if(!previous||previous===next){
                    instance[prop] = next.targetValue;
                    continue;
                }

                //Actually apply the value
                let start = previous.targetTime;
                let end = next.targetTime;
                let duration = end-start;

                let position = time - start;
                
                let progress = position / duration;
                let eased = next.ease.ease(progress);

                let startValue = previous.targetValue;
                let endValue = next.targetValue;
                let difference = endValue-startValue;

                instance[prop] = startValue + difference*eased;
            }
        }
    }
    isRelevant(instance){
        return true;
    }
    getAscendingKeysMap(map){return new Map([...map.entries()].sort((a,b)=>a[0]-b[0]))}
    createInstanceKeyframe(instance, property, targetTime, targetValue, ease){
        let map = this.#instanceTransitions;
        let keyframe = new Keyframe(targetTime, targetValue, ease);

        if(!map.has(instance)){
            map.set(instance, {})
        }

        let instanceTransitions = map.get(instance);
        let propTransitions;
        if(!(instanceTransitions[property] instanceof Map)){
            propTransitions = instanceTransitions[property] = new Map();
            propTransitions.set("inOrder", true);
        }
        propTransitions = instanceTransitions[property];

        if(!(instanceTransitions[property].get(targetTime) instanceof Keyframe)){
            propTransitions.set(targetTime, keyframe);
            propTransitions.set("inOrder", false);
        }
        else {
            let existing = propTransitions.get(targetTime);
            existing.targetValue = targetValue;
            existing.ease = ease;
        }

        return keyframe;
    }
}
export class editorScene extends _baseScene{}
import { Camera, _camera } from "./camera.js";
import { EASE } from "./easing.js";
import { _instance } from "./instance.js";
import { objectPrimitive } from "./primitive.js";
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
        ctx.setTransform(scale[0],0,0,scale[1],ctx.canvas.width/2-this.#camera.x,ctx.canvas.height/2-this.#camera.y);
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
/**
 * Let me explain the transition object structure:
 * instanceTransitions: Map(                        | - 
 *     {instance}: Object(                          | - 
 *          {propertyKey}: Map(                     | - This could well be a normal Object or even an array right? NO! I have a Map because it preserves insertion order and that enables me to sort its entries by key (time). That way searching for the keyframes we are currently between becomes half as complex (search until we find a Keyframe.time >= Scene.time instead of looking through each key, comparing it to time blah blah blah). What can you say? I'm just a self taught damn genius
 *              "inOrder": bool                     | - Once we sort the time map, we set this to true. If we add a keyframe at any time in the map we set it back to false and it will need to be resorted the next time transitions are applied.
 *              {time}: Keyframe                    | - Each time may only have one Keyframe. If trying to set a new Keyframe at a time that already has one, the existing instance will change target value but will stay the same. Keep that in mind or just don't commit the super stupid act of setting another keyframe for the same property at the same time.
 *          )                                       | - 
 *     )                                            | - 
 * )                                                |
 * 
 * Primitive transitions is pretty much the same just the properties are the 
 * index if it is an object primitive or 0 if it is a variable primitive
 * (Shit now I realize the name primitive is not ideal)
 * (That's why I don't have a version number yet)
 */
export class Scene extends _baseScene{
    #instanceTransitions = new Map();
    #primitiveTransitions = new Map();
    constructor(){
        super();
    }
    render(ctx,time){
        this.applyPrimitives(time);
        this.applyKeyframes(time);
        _baseScene.prototype.render.call(this, ctx);
    }
    #findKeyframesInTimedMap(map,time){
        let previous;
        let next;
        //Per keyframe (find in between which frames time is)
        for (let [keyTime, keyframe] of map){
            if(!Number.isFinite(keyTime))continue;

            next = keyframe;
            if(time <= keyframe.targetTime)break;
            previous = keyframe;
        }
        if(!previous||previous===next)return false;
        //if(previous===next)return [next,next];
        return [previous, next];
    }
    #applyPropertyValue(time,mapParent,mapIndex){
        let map = mapParent[mapIndex];
        if(!map.get("inOrder")){
            mapParent[mapIndex] = this.getAscendingKeysMap(map);
            map.set("inOrder", true);
        }

        let keyframes = this.#findKeyframesInTimedMap(map, time);
        if(!keyframes)return;

        return Keyframe.applyValue(time, ...keyframes);
    }
    applyPrimitives(time){
        for(let [primitive, perIndex] of this.#primitiveTransitions){
            if(!this.isRelevant(primitive))continue;

            for (let i in perIndex){
                primitive.set(i,this.#applyPropertyValue(time, perIndex, i));
            }
        }
    }
    applyKeyframes(time){
        //Instance keyframes
        for (let [instance, perProp] of this.#instanceTransitions){
            if (!this.isRelevant(instance))continue;
            //Per property
            for (let prop in perProp){
                let list = perProp[prop];
                if(!list.get("inOrder"))list = perProp[prop] = this.getAscendingKeysMap(list);

                let keyframes = this.#findKeyframesInTimedMap(list, time);
                if(!keyframes)return;

                instance[prop] = Keyframe.applyValue(time, ...keyframes);
            }
        }
    }
    //To be used later on. Will return false for instances that are not visible and for primitives that belong to an irrelevant instance
    isRelevant(instance){
        return true;
    }
    getAscendingKeysMap(map){return new Map([...map.entries()].sort((a,b)=>a[0]-b[0]))}
    createInstanceKeyframe(instance, property, targetTime, targetValue, ease=EASE.LINEAR){
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
    createPrimitiveKeyframe(primitive, targetTime, targetValue, index=0, ease=EASE.LINEAR){
        let map = this.#primitiveTransitions;
        let keyframe = new Keyframe(targetTime, targetValue, ease);
        let primitiveTransitions;
        let isIndexed = primitive instanceof objectPrimitive;

        if(!map.has(primitive)) map.set(primitive, primitiveTransitions = {});
        else primitiveTransitions = map.get(primitive);

        let timeMap = primitiveTransitions[index] || (primitiveTransitions[index] = new Map());

        let existing;
        if((existing = timeMap.get(targetTime)) instanceof Keyframe){
            existing.targetValue = targetValue;
            existing.ease = ease;
        }
        else {
            timeMap.set(targetTime, keyframe);
            timeMap.set("inOrder", false);
        }
    }
}
export class editorScene extends _baseScene{}
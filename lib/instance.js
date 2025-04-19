import { _primitive, objectPrimitive, varPrimitive, Vector2 } from "./primitive.js";

export class _instance extends EventTarget{
    alias;
    #children = new instanceTree;
    #parent;
    #lock = false;
    setParent(parent){
        if(this.#lock != 0)return false;

        return this.#parent = parent;
    }
    addChild(child){
        if (child instanceof _instance){
            if (child.setParent(this)){
                this.#children.addItem(child);
            }
        }
    }
    lock(canUnlock = true){
        this.#lock = 1+!canUnlock
    }
    unlock(){
        if(this.#lock=2)return false;
        this.#lock = 0;
    }
    set(property,value,key=0){
        if(this[property] instanceof varPrimitive){
            this[property].set(value);
        }
        else if(this[property] instanceof objectPrimitive){
            this[property].set(key, value);
        }
        else if(this[property] instanceof Object){
            this[property][key] = value;
        }
        else{
            this[property] = value;
        }
    }
    set parent(v){this.#lock==0?this.#parent=v:false}
    get children(){return this.#children.items}
    get parent(){return this.#parent}
    get locked(){return !!this.#lock}
    get unlockable(){return this.#lock != 2}
};

export class physicalInstance extends _instance{
    #position;
    #rotation = 0; //For fuck's sake
    constructor(position=[0,0]){
        super();
        if(!Vector2.isVector2(position))throw new TypeError("Invalid position format");
        this.#position=position;
    }
    get currentPosition(){
        return [this.#position[0].valueOf(), this.#position[1].valueOf()];
    }
    get currentRotation(){
        return this.#rotation.valueOf();
    }
    set position(v){if(Vector2.isVector2(position))this.#position = v}
    set x(v){this.#position[0] = v}
    set y(v){this.#position[1] = v}
    get x(){return this.#position[0].valueOf()}
    get y(){return this.#position[1].valueOf()}
}

class instanceTree{
    #items = new Set();
    addItem(item){
        if(item instanceof _instance)this.#items.add(item);
    }
    includesItem(){
        return this.#items.has(item);
    }
    get items(){return [...this.#items]}
}
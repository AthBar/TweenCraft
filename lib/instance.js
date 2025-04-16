export class _instance{
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
    set parent(v){this.#lock==0?this.#parent=v:false}
    get children(){return this.#children.items}
    get parent(){return this.#parent}
    get locked(){return !!this.#lock}
    get unlockable(){return this.#lock != 2}
};

export class physicalInstance extends _instance{
    position = [0,0];
    rotation = 0; //For fuck's sake
    constructor(x,y){
        super();
    }
    get currentPosition(){
        return [this.position[0].valueOf(), this.position[1].valueOf()];
    }
    get currentRotation(){
        return this.rotation.valueOf();
    }
    set x(v){this.position[0] = v}
    set y(v){this.position[1] = v}
    get x(){return this.position[0].valueOf()}
    get y(){return this.position[1].valueOf()}
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
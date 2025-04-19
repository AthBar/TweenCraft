export class _primitive{}
export class objectPrimitive extends _primitive{
    set(list,index,value){
        if(list[index].set instanceof Function)list[index].set(value);
        else list[index] = value;
    }
}
export class varPrimitive extends _primitive{
    #value;
    //Case (.set(value)): If v has a true value then set the value to v
    //Case (.set(index, value) with index=0): Set the value to {value} (form .set(index, value) with index = 0). If {index} just happens to be zero but no {value} is provided then the value still gets set to 0 (i=0 default)
    //Case (.set(index, value) with index!=0): If trying to set an element by index, the value will be set to the index as in .set(value)
    set(v,i=0){this.#value=v?v:i}
    valueOf(){return this.#value}
}
export class ArrayValue extends objectPrimitive{
    #value=[];
    set(index,value){
        index = index.valueOf();

        if(Number.isFinite(index)&&index>=0){
            this.#value[index] = value;
        }
    }
    get 0(){return this.#value[0]}
    get 1(){return this.#value[1]}
    get 2(){return this.#value[2]}
    get 3(){return this.#value[3]}
    get length(){return this.#value.length}
    valueOf(){
        return this.#value.map(el=>el.valueOf());
    }
}
export class Vector2 extends objectPrimitive{
    #value=[0,0];
    constructor(x,y){
        super();
        [...this.#value]=[x,y];
    }
    get length(){return 2}
    get x(){return this.#value[0]}
    get y(){return this.#value[1]}
    get 0(){return this.#value[0]}
    get 1(){return this.#value[1]}
    get connectedX(){new NumberValue}
    get connectedY(){}
    set x(v){this.#value[0]=v}
    set y(v){this.#value[1]=v}
    set(i, v){
        if(!(typeof v === "number"))return;
        
        //Cool compressed code! [proud]
        i = Number.isFinite(i)?i:({"x":0,"y":1}[i]);
        objectPrimitive.prototype.set.call(this, this.#value, i, v);
    }
    valueOf(){
        return [
            (this.#value[0]==0||this.#value[0])?this.#value[0].valueOf():undefined,
            (this.#value[1]==0||this.#value[1])?this.#value[1].valueOf():undefined
        ];
    }
}
//Accept Vector2 or ArrayValue[2] = {0:number, 1:number} or [number, number]
Vector2.isVector2 = primitive=>(primitive instanceof Vector2||(primitive instanceof Array||primitive instanceof ArrayValue)&&primitive.length==2&&NumberValue.isNumberValue(primitive[0])&&NumberValue.isNumberValue(primitive[0]));

export class Rect extends objectPrimitive{
    #value=[0,0,1,1];
    constructor(x,y,width,height){
        super();
        [...this.#value] = [x,y,width,height];
    }
    get length(){return 4}
    get x(){return this.#value[0]}
    get y(){return this.#value[1]}
    get width(){return this.#value[2]}
    get height(){return this.#value[3]}
    set x(v){this.#value[0]=v}
    set y(v){this.#value[1]=v}
    set width(v){this.#value[2]=v}
    set height(v){this.#value[3]=v}
}

//I am not responsible for returning values (0-255) and (0-1) for now
//Also I don't care about your stupid HSVA type (just kidding it's pretty awesome)
//These WILL be added on the next stable version and it's going to be a happy world
export class ColorValue extends objectPrimitive{
    #value=[0,0,0,1];
    set(index,value){
        index = index.valueOf();

        if(Number.isFinite(index)&&index>=0){
            this.#value[index] = value;
        }
    }
    //Yes I really hate this
    get 0(){return this.#value[0]}
    get 1(){return this.#value[1]}
    get 2(){return this.#value[2]}
    get 3(){return this.#value[3]}
    get r(){return this.#value[0]}
    get g(){return this.#value[1]}
    get b(){return this.#value[2]}
    get a(){return this.#value[3]}
    set r(v){if(NumberValue.isNumberValue(v))this.#value[0]=v}
    set g(v){if(NumberValue.isNumberValue(v))this.#value[1]=v}
    set b(v){if(NumberValue.isNumberValue(v))this.#value[2]=v}
    set a(v){if(NumberValue.isNumberValue(v))this.#value[3]=v}
    //End of hate
    get length(){return this.#value.length}
    valueOf(){
        return "rgba(" + this.#value.toString() + ")";
    }
}

export class NumberValue extends varPrimitive{
    set(v){
        if(typeof v === "number")varPrimitive.prototype.set.call(this, v);
    }
    set 0(v){this.set.call(this,v)}
}
NumberValue.isNumberValue = primitive=>(primitive instanceof NumberValue||typeof primitive=="number");

export class FunctionValue{
    #f;
    constructor(f){
        if (f instanceof Function)this.#f = f;
    }
    valueOf(){
        return this.#f();
    }
}

export const innerWindowSize = new Vector2(new FunctionValue(()=>window.innerWidth),new FunctionValue(()=>window.innerHeight));
export const outerWindowSize = new Vector2(new FunctionValue(()=>window.outerWidth),new FunctionValue(()=>window.outerHeight));
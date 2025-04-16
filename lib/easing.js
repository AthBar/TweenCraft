export class Ease{
    #f=v=>v;
    constructor(easeFunction){
        if(typeof easeFunction !== 'function')throw new TypeError("Ease function must be an executable function");
        this.#f=easeFunction;
    }
    ease(now){return this.#f(now)}
};

const EASE = {
    LINEAR:           x=>x,

    INSTANT_START:    ()=>1,
    INSTANT_MIDDLE:   x=>(x>=0.5)+0,
    INSTANT_END:      x=>(x>=1)+0,
    INSTANT_AT:   n=> x=>(x>=n)+0,

    QUAD_IN:          x=>x*x,
    QUAD_OUT:         x=>1-(1-x)**2,
    QUAD_IN_OUT:      x=>x<0.5?2*x*x:1-(-2*x+2)**2/2,

    SINE_IN:          x=>1-Math.cos((x*Math.PI)/2),
    SINE_OUT:         x=>Math.sin((x*Math.PI)/2),
    SINE_IN_OUT:      x=>-(Math.cos(Math.PI*x)-1)/2,

    CIRC_IN:          x=>1-Math.sqrt(1-x*x),
    CIRC_OUT:         x=>Math.sqrt(1-(x-1)**2),
    CIRC_IN_OUT:      x=>x<0.5?(1-Math.sqrt(1-(2*x)**2))/2:(Math.sqrt(1-(-2*x+2)**2)+1)/2,

    EXPO_IN:          x=>x===0?x:2**(10*x-10),
    EXPO_OUT:         x=>x===1?1:1-2**(-10*x),
    EXPO_IN_OUT:      x=>x===0?0:x===1?1:x<0.5?2**(20*x-10)/2:(2-2**(-20 * x + 10))/2,

    BACK_IN:          x=>2.70158*x**3-1.70158*x*x,
    BACK_OUT:         x=>1+2.70158*(x - 1)**3+1.70158*(x - 1)**2,
    BACK_IN_OUT:      x=>x<0.5?((2*x)**2*((2.5949095+1)*2*x-2.5949095))/2:((2*x-2)**2*((2.5949095+1)*(x*2-2)+2.5949095)+2)/2,

    ELASTIC_IN:       x=>x===0?0:x===1?1:(-2)**(10*x-10)*Math.sin((x*10-10.75)*(2*Math.PI)/3),
    ELASTIC_OUT:      x=>x===0?0:x===1?1:2**(-10 * x)*Math.sin((x*10-0.75)*(2*Math.PI)/3)+1,
    ELASTIC_IN_OUT:   x=>x===0?0:x===1?1:x<0.5?-(2**(20*x-10)*Math.sin((20*x-11.125)*(2*Math.PI)/4.5))/2:(2**(-20*x+10)*Math.sin((20*x-11.125)*(2*Math.PI)/4.5))/2+1,

    BOUNCE_OUT:       x=>(x < 1 / 2.75)?7.5625 * x * x:(x < 2 / 2.75)? 7.5625 * (x -= 1.5 / 2.75) * x + 0.75:(x < 2.5 / 2.75)? 7.5625 * (x -= 2.25 / 2.75) * x + 0.9375:7.5625 * (x -= 2.625 / 2.75) * x + 0.984375,
    BOUNCE_IN:        x=>1-EASE.BOUNCE_OUT(1-x),
    BOUNCE_IN_OUT:    x=>x<0.5?(1-EASE.BOUNCE_OUT(1-2*x))/2:(1+EASE.BOUNCE_OUT(2*x-1))/2,

    NTH_IN:       n=> x=>x**n,
    NTH_OUT:      n=> x=>1-(1-x)**n,
    NTH_IN_OUT:   n=> x=>x<=0.5?(2*x)**n:1-(-2 * x + 2)**n/2
};
Object.freeze(EASE);

export {EASE};
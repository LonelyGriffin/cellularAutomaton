/**
 * Created by LonelyGriffin on 05.12.2016.
 */

let map = Symbol("map");
/**
 * event dispatcher
 */
class Dispatcher {
    constructor(){
        this[map] = {}; //protected map property
    }

    /**
     * it subscribe to event
     * @param {string} [event='default'] type of event
     * @param {function} [callback=()=>{}] The function to call when the event generation
     * @param {object} [context=null] The context to function
     */
    on(event = "default", callback = ()=>{}, context = null){
        let callbacks = this[map][event] = this[map][event] || [];
        callbacks.push({callback, context});
    }

    /**
     * it unsubscribe to event
     * @param {string} [event='default'] The type of event
     * @param {function} [callback=()=>{}] The function to call when the event generation
     * @param {object} [context=null] The context to function
     */
    off(event = "default", callback = ()=>{}, context = null){
        let callbacks = this[map][event];

        if(!callbacks){return;}

        for(let i = callbacks.length - 1; i >= 0; i--){
            if(callbacks[i].callback == callback && callbacks[i].context == context){
                callbacks.splice(i, 1);
            }
        }

    }

    /**
     * it generate event
     * @param {string} [event='default'] The type of event
     * @param {...*} [data]
     */
    fire(event = "default", ...data){
        let callbacks = this[map][event];

        if(!callbacks){return;}

        for(let i = callbacks.length - 1; i >= 0; i--){
            callbacks[i].callback.apply(callbacks[i].context, data);
        }
    }
}

export default new Dispatcher();
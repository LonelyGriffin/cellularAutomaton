/**
 * Created by User on 05.12.2016.
 */
import defaultTemplate from "./tmpl.jade";
import ID from "id";

let eventHandlers = Symbol("eventHandlers");

export default class Component {
    static get events(){return {}}
    constructor(template = defaultTemplate, $e=$("<span>")){
        this.id = ID.reserve();
        this.$e = $e;
        this.tmpl = template;

        this[eventHandlers] = {};
        this.bind();
    }
    getDataForRender(){
        return "Component";
    }
    view(){
        this.$e.append(this.render());
    }
    render(){
        return this.tmpl({
                data: this.getDataForRender()
        });
    }
    bind(){
        for(let event in this.events){
            let handlerName = this.events[event];
            if($.isFunction(this[handlerName])){
                let handler = $.proxy(this[handlerName]);
                this[eventHandlers][event] = handler;
                this.$e.on(event + "", handler, this);
            }
        }
    }
    unbind(){
        for(let event in this[eventHandlers]){
            let handler = this[eventHandlers][event];
            this.$e.on(event + "", handler, this);
        }
        this[eventHandlers][event] = {};
    }
    die(){
        this.unbind();
        this.$e.remove();
        ID.free(this.id);
    }
}
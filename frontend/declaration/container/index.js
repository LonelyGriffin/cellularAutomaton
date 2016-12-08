/**
 * Created by User on 07.12.2016.
 */
import Component from "component";
import defaultTemplate from "./tmpl.jade";

export default class Container extends Component{
    constructor(childs = [], template = defaultTemplate, $e=$("<div>")){
        super(template, $e);
        this.childs = $.isArray(childs) ? childs :
                                    childs ? [childs] : [];
    }
    getDataForRender(){
        return "Container"
    }
    view(){
        for(let i = 0; i < this.childs.length; i++){
            this.childs[i].bind();
        }
        super.view();
        for(let i = 0; i < this.childs.length; i++){
            this.childs[i].unbind();
        }

    }
    render(){
        //render childs
        let childWrap = $("<div>");
        for(let i = 0; i < this.childs.length; i++){
            this.childs[i].view();
            childWrap.append(this.childs[i].$e);
        }
        //render container
        return this.tmpl({
            data: this.getDataForRender(),
            childs: childWrap[0].outerHTML
        });
    }
}
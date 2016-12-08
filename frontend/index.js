/**
 * Created by User on 05.12.2016.
 */
import  Component from  "component";
import  Container from "container";
let c = new Component();
let cc = new Container(c);



cc.view();

$("body").append(cc.$e);
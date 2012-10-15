/*
    (C)2008-2010 WebFrameWork 1.3
    JavaScript DOM Librairie : Standard
    
    Dependences: dom.js
*/

/* objGetAtt */
function objGetAtt(obj, name){    
    return _w3c_HTMLElement_getAtt.apply(obj,new Array(name));
}

/* objSetAtt */
function objSetAtt(obj, name, value){    
    return _w3c_HTMLElement_setAtt.apply(obj,new Array(name, value));
}

/* objGetClassName */
function objGetClassName(obj){
    return _w3c_HTMLElement_getClassName.apply(obj);
}

/* objSetClassName */
function objSetClassName(obj,name){
    return _w3c_HTMLElement_setClassName.apply(obj,new Array(name));
}

/* objGetName */
function objGetName(obj){
    return _w3c_HTMLElement_getName.apply(obj);
}

/* objSetName */
function objSetName(obj,name){
    return _w3c_HTMLElement_setName.apply(obj,new Array(name));
}

/* objSetEvent */
function objSetEvent(obj,e_name,func){
    return _w3c_HTMLElement_setEvent.apply(obj,new Array(e_name,func));
}

/* objSetInnerText */
function objSetInnerText(obj,text){
    return _a_HTMLElement_setInnerText.apply(obj,new Array(text));
}

/* objGetInnerText */
function objGetInnerText(obj){
    return _a_HTMLElement_getInnerText.apply(obj);
}

/* objGetChildren */
function objGetChildren(obj,text){
    return _a_HTMLElement_getChildren.apply(obj);
}

/* objGetChildrenByTagName */
function objGetChildrenByTagName(obj,tagName){
    return _a_HTMLElement_getChildrenByTagName.apply(obj,new Array(tagName));
}

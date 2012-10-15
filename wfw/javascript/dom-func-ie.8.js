/*
    (C)2008-2010 ID-Informatik. All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    WebFrameWork(R) version: 1.3
    
    Fonctions globales du DocumentObjectModel-2.
    Ce script est optimizé pour Microsoft-Internet-Explorer 8.x
    
    Dependences: dom.js

    Revisions:
        [03-10-2012] Implementation
*/

function pop(args)
{
    //retourne le tableau des arguments sans l'objet appelant (place en premiere argument)
    var _args = new Array();
    for(var i=1;i<args.length;i++){
        //alert(i+": "+typeof(args[i]));
        _args.push(args[i]);
     }
    return _args;
}



function undefined_function(args)
{
    if(typeof(wfw.error) != 'undefined')
        wfw.error.set(wfw.error.ERR_CALL_UNSUPORTED_DOM_FUNCTION);

    return 'undefined';
}

/*
--------------------------------------------------------------------------------------------------------------------------------------
    HTMLElement Section

    objHasAtt
    objGetAtt
    objSetAtt
    objRemoveAtt
    objGetAttNS
    objSetAttNS
    objRemoveAttNS
    objGetClassName
    objSetClassName
    objGetName
    objSetName
    objSetEvent
    objSetInnerText
    objGetInnerText
    objGetChildren
    objGetChildrenByTagName
    objGetChild
    objGetParent
    objGetChildElement
    objGetNext
    objGetPrev
    objGetX
    objGetY
    objGetAbsX
    objGetAbsY
    objGetW
    objGetH
    objSetW
    objSetH
    objSetXY
    objSetAbsXY
    objSetRect
    objGetRect
    objGetNode
    objInsertNode
    objRemoveChildNode
--------------------------------------------------------------------------------------------------------------------------------------
*/

/* objHasAtt */
function objHasAtt(self, name)
{    
    return (objGetAtt(self, name)==null ? false : true);
}

/* objGetAtt */
function objGetAtt(self, name)
{
    return _w3c_HTMLElement_getAtt.apply(self, pop(arguments));
}

/* objSetAtt */
function objSetAtt(self, name, value)
{
    return _w3c_HTMLElement_setAtt.apply(self, pop(arguments));
}

/* objRemoveAtt */
function objRemoveAtt(self, name)
{
    return _w3c_HTMLElement_removeAtt.apply(self, pop(arguments));
}

/* objGetAttNS */
function objGetAttNS(self, ns, name)
{
    return _w3c_HTMLElement_getAttNS.apply(self, pop(arguments));
}

/* objSetAttNS */
function objSetAttNS(self, ns, name, value)
{
    return _w3c_HTMLElement_setAttNS.apply(self, pop(arguments));
}

/* objRemoveAttNS */
function objRemoveAttNS(self, ns, name)
{
    return _w3c_HTMLElement_removeAttNS.apply(self, pop(arguments));
}

/* objGetClassName */
function objGetClassName(self){
    // methods
    var method = undefined_function;
        
    // W3C, style
    if(typeof(self.className)!='undefined'){
        method = _ie7_HTMLElement_getClassName; // IE7.compatible
    }
    else if((typeof(self.getAttribute)!='undefined')){
        method = _w3c_HTMLElement_getClassName;
    }

    return _w3c_HTMLElement_getClassName.apply(self, pop(arguments));
}

/* objSetClassName */
function objSetClassName(self,name){
    // methods
    var method = undefined_function;
        
    // W3C, style
    if(typeof(self.className)!='undefined'){
        method = _ie7_HTMLElement_setClassName; // IE7.compatible
    }
    else if((typeof(self.getAttribute)!='undefined') && (typeof(self.setAttribute)!='undefined')){
        method = _w3c_HTMLElement_setClassName;
    }
    
    return method.apply(self, pop(arguments));
}

/* objGetName */
function objGetName(self){
    return _w3c_HTMLElement_getName.apply(self, pop(arguments));
}

/* objSetName */
function objSetName(self,name){
    return _w3c_HTMLElement_setName.apply(self, pop(arguments));
}

/**
 * Assigne un évenement à un objet
 * @param self Objet en cours
 * @param e_name Nom de l'événement (sans le préfix 'on')
 * @param func Fonction de rappel (voir remarques)
 * @param param Paramètre utilisateur passé à la fonction de rappel 'func'
 * @return [bool] true si l'événement est initialisé, sinon false
*/
function objSetEvent(self,e_name,func,param){
    // methods
    var method = undefined_function;
        
    // W3C, style
    if((typeof(self.addEventListener)!='undefined')){
        method = _w3c_HTMLElement_setEvent;
    }
    else if((typeof(self.attachEvent)!='undefined')){
        method = _a_HTMLElement_setEvent;
    }
    
    return method.apply(self, pop(arguments));
}

/* objSetInnerText */
function objSetInnerText(self,text){
    // methods
    var method = undefined_function;

    if((typeof(self.textContent)!='undefined')){
        method = _b_HTMLElement_setInnerText;
    }
    else if((typeof(self.innerText)!='undefined')){
        method = _c_HTMLElement_setInnerText;
    }
    
    return method.apply(self, pop(arguments));
}

/* objGetInnerText */
function objGetInnerText(self){
    // methods
    var method = undefined_function;
        
    if((typeof(self.text)!='undefined')){
        method = _a_HTMLElement_getInnerText;
    }
    else if((typeof(self.textContent)!='undefined')){
        method = _b_HTMLElement_getInnerText;
    }
    else if((typeof(self.innerText)!='undefined')){
        method = _c_HTMLElement_getInnerText;
    }
    else if((typeof(self.nodeValue)!='undefined')){
        method = _d_HTMLElement_getInnerText;
    }
    else{
        method = _std_HTMLElement_getInnerText;
    }
    
    return method.apply(self, pop(arguments));
}

/* objGetChildren */
function objGetChildren(self){
    return _a_HTMLElement_getChildren.apply(self, pop(arguments));
}

/* objGetChildrenByTagName */
function objGetChildrenByTagName(self,tagName){
    return _a_HTMLElement_getChildrenByTagName.apply(self, pop(arguments));
}

/* objGetChild */
function objGetChild(self,tagName){
    return _a_HTMLElement_getChild.apply(self, pop(arguments));
}

/* objGetParent */
function objGetParent(self,tagName){
    return _a_HTMLElement_getParent.apply(self, pop(arguments));
}

/* objGetChildElement */
function objGetChildElement(self){
    // methods
    var method =  undefined_function;

    if(typeof(self.children)!='undefined')
        method = _w3c_HTMLElement_getChildElement;
    else if(typeof(self.all)!='undefined')
        method = _a_HTMLElement_getChildElement;
        
    return method.apply(self, pop(arguments));
}


/* objGetNext */
function objGetNext(self,tagName){
    return _a_HTMLElement_getNext.apply(self, pop(arguments));
}

/* objGetPrev */
function objGetPrev(self,tagName){
    return _a_HTMLElement_getPrev.apply(self, pop(arguments));
}

/* objGetX */
function objGetX(self){
    return _a_HTMLElement_getX.apply(self, pop(arguments));
}

/* objGetY */
function objGetY(self){
    return _a_HTMLElement_getY.apply(self, pop(arguments));
}

/* objGetAbsX */
function objGetAbsX(self){
    return _a_HTMLElement_getAbsX.apply(self, pop(arguments));
}

/* objGetAbsY */
function objGetAbsY(self){
    return _a_HTMLElement_getAbsY.apply(self, pop(arguments));
}

/* objGetW */
function objGetW(self){
    return _a_HTMLElement_getW.apply(self, pop(arguments));
}

/* objGetH */
function objGetH(self){
    return _a_HTMLElement_getH.apply(self, pop(arguments));
}

/* objSetW */
function objSetW(self, width){
    return _a_HTMLElement_setW.apply(self, pop(arguments));
}

/* objSetH */
function objSetH(self, height){
    return _a_HTMLElement_setH.apply(self, pop(arguments));
}

/* objGetOrgH */
function objGetOrgH(self, height){
    return _w3c_HTMLElement_getOrgH.apply(self, pop(arguments));
}

/* objGetOrgW */
function objGetOrgW(self, height){
    return _w3c_HTMLElement_getOrgW.apply(self, pop(arguments));
}

/* objSetXY */
function objSetXY(self, x, y){
    return _a_HTMLElement_setXY.apply(self, pop(arguments));
}

/* objSetAbsXY */
function objSetAbsXY(self, x, y){
    return _a_HTMLElement_setAbsXY.apply(self, pop(arguments));
}

/* objSetRect */
function objSetRect(self,x,y,w,h){
    return _a_HTMLElement_setRect.apply(self, pop(arguments));
}

/* objGetRect */
function objGetRect(self){
    return _a_HTMLElement_getRect.apply(self, pop(arguments));
}

/* objGetNode */
function objGetNode(self,path){
    return _w3cHTMLElement_getNode.apply(self, pop(arguments));
}

/* objInsertNode */
function objInsertNode(self,parent,ref,position){
    return _w3c_HTMLElement_insertNode.apply(self, pop(arguments));
}

/* objRemoveChildNode */
function objRemoveChildNode(self,ref,position){
    return _w3c_HTMLElement_removeChildNode.apply(self, pop(arguments));
}

/*
--------------------------------------------------------------------------------------------------------------------------------------
    HTMLNode Section

    nodeInsertAfter
    nodeGetValue
    nodeGetChildNode
    nodeGetChild
    nodeGetParent
    nodeGetChildren
    nodeGetNext
    nodeGetPrev
    nodeGetNexts
    nodeEnumNodes
    nodeCloneNode
    nodeRemoveNode
    nodeGetInnerHTML
    nodeRemoveChildNode
    nodeGetDocument
--------------------------------------------------------------------------------------------------------------------------------------
*/

/* nodeInsertAfter */
function nodeInsertAfter(self,tagName){
    return _w3c_Node_insertAfter.apply(self, pop(arguments));
}

/* nodeGetValue */
function nodeGetValue(self,def){
    // methods
    var method = undefined_function;
        
    if(typeof(self.nodeValue)!='undefined'){
        method = _w3c_Node_getValue;
    }
    else if(typeof(self.textContent)!='undefined'){
        method = _a_Node_getValue;
    }
    else if(typeof(self.innerText)!='undefined'){
        method = _b_Node_getValue;
    }
    else if(typeof(self.text)!='undefined'){
        method = _c_Node_getValue;
    }
    
    return method.apply(self, pop(arguments));
}

/* nodeGetChildNode */
function nodeGetChildNode(self){
    // methods
    var method = undefined_function;
        
    if(typeof(self.firstChild)!='undefined'){
        method = _w3c_Node_getChildNode;
    }
    else if(typeof(self.childNodes)!='undefined'){
        method = _a_Node_getChildNode;
    }
    
    return method.apply(self, pop(arguments));
}

/* nodeGetChild */
function nodeGetChild(self,filterFunc){
    return _w3c_Node_getChild.apply(self, pop(arguments));
}

/* nodeGetParent */
function nodeGetParent(self,filterFunc){
    return _w3c_Node_getParent.apply(self, pop(arguments));
}

/* nodeGetChildren */
function nodeGetChildren(self,filterFunc){
    return _w3c_Node_getChildren.apply(self, pop(arguments));
}

/* nodeGetNext */
function nodeGetNext(self,filterFunc){
    return _w3c_Node_getNext.apply(self, pop(arguments));
}

/* nodeGetPrev */
function nodeGetPrev(self,filterFunc){
    return _w3c_Node_getPrev.apply(self, pop(arguments));
}

/* nodeGetNexts */
function nodeGetNexts(self,filterFunc){
    return _w3c_Node_getNexts.apply(self, pop(arguments));
}

/* nodeEnumNodes */
function nodeEnumNodes(self, callback, bNext, param) {
    return _w3c_Node_enumNodes.apply(self, pop(arguments));
}

/* nodeCloneNode */
function nodeCloneNode(self,depth){
    return _w3c_Node_cloneNode.apply(self, pop(arguments));
}

/* nodeCloneNode */
function nodeRemoveNode(self){
    return _w3c_Node_removeNode.apply(self, pop(arguments));
}

/* nodeGetInnerHTML */
function nodeGetInnerHTML(self,depth){
    return _a_Node_getInnerHTML.apply(self, pop(arguments));
}

/* nodeRemoveChildNode */
function nodeRemoveChildNode(self,depth){
    return _a_Node_removeChildNode.apply(self, pop(arguments));
}

/* nodeGetDocument */
function nodeGetDocument(self) {
    return _w3c_Node_getDocument.apply(self, pop(arguments));
}

/*
--------------------------------------------------------------------------------------------------------------------------------------
    HTMLDocument Section

    docGetElement
    docGetElements
    docGetNamedElements
    docGetRootElement
    docGetNode
    docGetClientW
    docGetClientH
    docGetBodyW
    docGetBodyH
    docSetCookie
    docGetCookie
    docDelCookie
    docSetCSSRule
    docGetCSSRule
    docGetCSSFile
    docImportNode
--------------------------------------------------------------------------------------------------------------------------------------
*/

/* docGetElement */
function docGetElement(self,id){
    // methods
    var method = undefined_function;
    
    if(typeof(self.getElementById) != 'undefined')
        method = _w3c_HTMLDocument_getElement;
    else if(typeof(self.embeds) != 'undefined')
        method = _a_HTMLDocument_getElement;
    else // if(typeof(self['body']) != 'undefined') // testable?!
        method = _b_HTMLDocument_getElement;
        
    return method.apply(self, pop(arguments));
}

/* docGetElements */
function docGetElements(self,tagName){
    // methods
    var method = undefined_function;
    
    if(typeof(self.getElementsByTagName) != 'undefined')
        method = _w3c_HTMLDocument_getElements;
    else if(typeof(self.all) != 'undefined')
        method = _a_HTMLDocument_getElements;
    else  if(typeof(self.layers) != 'undefined')
        method = _b_HTMLDocument_getElements;
        
    return method.apply(self, pop(arguments));
}

/* docGetElements */
function docGetNamedElements(self,name){
    // methods
    var method = undefined_function;
    
    if(typeof(self.getElementsByName) != 'undefined')
        method = _w3c_HTMLDocument_getNamedElements;
    else if(typeof(self.all) != 'undefined')
        method = _a_HTMLDocument_getNamedElements;
    else  if(typeof(self.layers) != 'undefined')
        method = _b_HTMLDocument_getNamedElements;
        
    return method.apply(self, pop(arguments));
}

/* docGetRootElement */
function docGetRootElement(self){
    return _w3c_HTMLDocument_getRootElement.apply(self, pop(arguments));
}

/* docGetNode */
function docGetNode(self,path){
    return _w3c_HTMLDocument_getNode.apply(self, pop(arguments));
}

/* docGetClientW */
function docGetClientW(self){
    return _a_HTMLDocument_getClientW.apply(self, pop(arguments));
}

/* docGetClientH */
function docGetClientH(self){
    return _a_HTMLDocument_getClientH.apply(self, pop(arguments));
}

/* docGetBodyW */
function docGetBodyW(self){
    return _a_HTMLDocument_getBodyW.apply(self, pop(arguments));
}

/* docGetBodyH */
function docGetBodyH(self){
    return _a_HTMLDocument_getBodyH.apply(self, pop(arguments));
}

/* docSetCookie */
function docSetCookie(self,name,value){
    return _a_HTMLDocument_setCookie.apply(self, pop(arguments));
}

/* docGetCookie */
function docGetCookie(self,name){
    return _a_HTMLDocument_getCookie.apply(self, pop(arguments));
}

/* docDelCookie */
function docDelCookie(self,name){
    return _a_HTMLDocument_delCookie.apply(self, pop(arguments));
}

/* docSetCSSRule */
function docSetCSSRule(self,file,selector,rules){
    // methods
    var method = undefined_function;
    
    if(typeof(file.insertRule) != 'undefined')
        method = _a_HTMLDocument_setCSSRule;
    else if(typeof(file.addRule) != 'undefined')
        method = _b_HTMLDocument_setCSSRule;
        
    return method.apply(self, pop(arguments));
}

/* docGetCSSRule */
function docGetCSSRule(self,file,rule){
    // methods
    var method = undefined_function;
    
    if(typeof(file.rules) != 'undefined')
        method = _a_HTMLDocument_getCSSRule;
    else if(typeof(file.cssRules) != 'undefined')
        method = _b_HTMLDocument_getCSSRule;
        
    return method.apply(self, pop(arguments));
}

/* docGetCSSFile */
function docGetCSSFile(self,filename){
    return _a_HTMLDocument_getCSSFile.apply(self, pop(arguments));
}

/* docImportNode */
function docImportNode(self, node, bDepth){
    return _a_HTMLDocument_importNode.apply(self, pop(arguments));
}

/*
--------------------------------------------------------------------------------------------------------------------------------------
    Window Section

    wndGetURL
--------------------------------------------------------------------------------------------------------------------------------------
*/

/* wndGetURL */
function wndGetURL(self){
    return _w3c_Window_getURL.apply(self, pop(arguments));
}

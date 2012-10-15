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
    
    Fonctions globales du DocumentObjectModel-2, chacunes des fonctions du WFW-DOM est definit ici dans leur version compatible.
    Pour chaque appel la fonction test l'objet a la recherche d'un methode compatible.
    
    Dependences: dom.js

    Revisions:
        [16-02-2012] Add, nodeGetDocument()
        [29-02-2012] Debug, docDelCookie() mauvaise fonction d'appel [r�solue]
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
    // methods
    var method = undefined_function;
        
    // W3C, style
    if(typeof(self.getAttribute)!='undefined'){
        method = _w3c_HTMLElement_getAtt;
    }

    return method.apply(self, pop(arguments));
}

/* objSetAtt */
function objSetAtt(self, name, value)
{
    // methods
    var method = undefined_function;
        
    // W3C, style
    if(typeof(self.setAttribute)!='undefined'){
        method = _w3c_HTMLElement_setAtt;
    }
    
    return method.apply(self, pop(arguments));
}

/* objRemoveAtt */
function objRemoveAtt(self, name)
{
    // methods
    var method = undefined_function;
        
    // W3C, style
    if(typeof(self.removeAttribute)!='undefined'){
        method = _w3c_HTMLElement_removeAtt;
    }
    
    return method.apply(self, pop(arguments));
}

/* objGetAttNS */
function objGetAttNS(self, ns, name)
{    
    // methods
    var method = undefined_function;
        
    // W3C, style
    if(typeof(self.getAttributeNS)!='undefined'){
        method = _w3c_HTMLElement_getAttNS;
    }
    
    return method.apply(self, pop(arguments));
}

/* objSetAttNS */
function objSetAttNS(self, ns, name, value)
{
    // methods
    var method = undefined_function;
        
    // W3C, style
    if(typeof(self.setAttributeNS)!='undefined'){
        method = _w3c_HTMLElement_setAttNS;
    }
    
    return method.apply(self, pop(arguments));
}

/* objRemoveAttNS */
function objRemoveAttNS(self, ns, name)
{
    // methods
    var method = undefined_function;
        
    // W3C, style
    if(typeof(self.removeAttributeNS)!='undefined'){
        method = _w3c_HTMLElement_removeAttNS;
    }
    
    return method.apply(self, pop(arguments));
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
    
    return method.apply(self, pop(arguments));
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
    // methods
    var method = undefined_function;
        
    // W3C, style
    if((typeof(self.getAttribute)!='undefined')){
        method = _w3c_HTMLElement_getName;
    }
    
    return method.apply(self, pop(arguments));
}

/* objSetName */
function objSetName(self,name){
    // methods
    var method = undefined_function;
        
    // W3C, style
    if((typeof(self.setAttribute)!='undefined')){
        method = _w3c_HTMLElement_setName;
    }
    
    return method.apply(self, pop(arguments));
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
    // methods
    var method = _a_HTMLElement_getChildren;
    
    return method.apply(self, pop(arguments));
}

/* objGetChildrenByTagName */
function objGetChildrenByTagName(self,tagName){
    // methods
    var method = _a_HTMLElement_getChildrenByTagName;
    
    return method.apply(self, pop(arguments));
}

/* objGetChild */
function objGetChild(self,tagName){
    // methods
    var method = _a_HTMLElement_getChild;
    
    return method.apply(self, pop(arguments));
}

/* objGetParent */
function objGetParent(self,tagName){
    // methods
    var method = _a_HTMLElement_getParent;
    
    return method.apply(self, pop(arguments));
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
    // methods
    var method = _a_HTMLElement_getNext;
    
    return method.apply(self, pop(arguments));
}

/* objGetPrev */
function objGetPrev(self,tagName){
    // methods
    var method = _a_HTMLElement_getPrev;
    
    return method.apply(self, pop(arguments));
}

/* objGetX */
function objGetX(self){
    // methods
    var method = undefined_function;

    if(typeof(self.offsetLeft)!='undefined')
        method = _a_HTMLElement_getX;
        
    return method.apply(self, pop(arguments));
}

/* objGetY */
function objGetY(self){
    // methods
    var method = undefined_function;

    if(typeof(self.offsetTop)!='undefined')
        method = _a_HTMLElement_getY;
        
    return method.apply(self, pop(arguments));
}

/* objGetAbsX */
function objGetAbsX(self){
    // methods
    var method = undefined_function;

    if((typeof(self.offsetLeft)!='undefined') && (typeof(self.offsetParent)!='undefined'))
        method = _a_HTMLElement_getAbsX;
        
    return method.apply(self, pop(arguments));
}

/* objGetAbsY */
function objGetAbsY(self){
    // methods
    var method = undefined_function;

    if((typeof(self.offsetTop)!='undefined') && (typeof(self.offsetParent)!='undefined'))
        method = _a_HTMLElement_getAbsY;
        
    return method.apply(self, pop(arguments));
}

/* objGetW */
function objGetW(self){
    // methods
    var method = undefined_function;

    if((typeof(self.style.width)!='undefined') || (typeof(self.clientWidth)!='undefined'))
        method = _a_HTMLElement_getW;
        
    return method.apply(self, pop(arguments));
}

/* objGetH */
function objGetH(self){
    // methods
    var method = undefined_function;

    if((typeof(self.style.height)!='undefined') || (typeof(self.clientHeight)!='undefined'))
        method = _a_HTMLElement_getH;
        
    return method.apply(self, pop(arguments));
}

/* objSetW */
function objSetW(self, width){
    // methods
    var method = undefined_function;

    if((typeof(self.style.width)!='undefined'))
        method = _a_HTMLElement_setW;
        
    return method.apply(self, pop(arguments));
}

/* objSetH */
function objSetH(self, height){
    // methods
    var method = undefined_function;

    if((typeof(self.style.height)!='undefined'))
        method = _a_HTMLElement_setH;
        
    return method.apply(self, pop(arguments));
}

/* objGetOrgH */
function objGetOrgH(self, height){
    // methods
    var method = _w3c_HTMLElement_getOrgH;
        
    return method.apply(self, pop(arguments));
}

/* objGetOrgW */
function objGetOrgW(self, height){
    // methods
    var method = _w3c_HTMLElement_getOrgW;
        
    return method.apply(self, pop(arguments));
}

/* objSetXY */
function objSetXY(self, x, y){
    // methods
    var method = undefined_function;

    if((typeof(self.style.left)!='undefined') && (typeof(self.style.top)!='undefined'))
        method = _a_HTMLElement_setXY;
        
    return method.apply(self, pop(arguments));
}

/* objSetAbsXY */
function objSetAbsXY(self, x, y){
    // methods
    var method = undefined_function;

    if((typeof(self.style.left)!='undefined') && (typeof(self.style.top)!='undefined'))
        method = _a_HTMLElement_setAbsXY;
        
    return method.apply(self, pop(arguments));
}

/* objSetRect */
function objSetRect(self,x,y,w,h){
    // methods
    var method = _a_HTMLElement_setRect;
    
    return method.apply(self, pop(arguments));
}

/* objGetRect */
function objGetRect(self){
    // methods
    var method = _a_HTMLElement_getRect;
    
    return method.apply(self, pop(arguments));
}

/* objGetNode */
function objGetNode(self,path){
    // methods
    var method = _w3cHTMLElement_getNode;
    
    return method.apply(self, pop(arguments));
}

/* objInsertNode */
function objInsertNode(self,parent,ref,position){
    // methods
    var method = _w3c_HTMLElement_insertNode;
    
    return method.apply(self, pop(arguments));
}

/* objRemoveChildNode */
function objRemoveChildNode(self,ref,position){
    // methods
    var method = _w3c_HTMLElement_removeChildNode;

    return method.apply(self, pop(arguments));
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
    // methods
    var method = undefined_function;
        
    if((typeof(self.insertBefore)!='undefined')&&(typeof(self.appendChild)!='undefined')){
        method = _w3c_Node_insertAfter;
    }
    
    return method.apply(self, pop(arguments));
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
    // methods
    var method = _w3c_Node_getChild;
    
    return method.apply(self, pop(arguments));
}

/* nodeGetParent */
function nodeGetParent(self,filterFunc){
    // methods
    var method = _w3c_Node_getParent;
    
    return method.apply(self, pop(arguments));
}

/* nodeGetChildren */
function nodeGetChildren(self,filterFunc){
    // methods
    var method = _w3c_Node_getChildren;
    
    return method.apply(self, pop(arguments));
}

/* nodeGetNext */
function nodeGetNext(self,filterFunc){
    // methods
    var method = _w3c_Node_getNext;
    
    return method.apply(self, pop(arguments));
}

/* nodeGetPrev */
function nodeGetPrev(self,filterFunc){
    // methods
    var method = _w3c_Node_getPrev;
    
    return method.apply(self, pop(arguments));
}

/* nodeGetNexts */
function nodeGetNexts(self,filterFunc){
    // methods
    var method = _w3c_Node_getNexts;
    
    return method.apply(self, pop(arguments));
}

/* nodeEnumNodes */
function nodeEnumNodes(self, callback, bNext, param) {
    // methods
    var method = _w3c_Node_enumNodes;
    
    return method.apply(self, pop(arguments));
}

/* nodeCloneNode */
function nodeCloneNode(self,depth){
    // methods
    var method = _w3c_Node_cloneNode;
    
    return method.apply(self, pop(arguments));
}

/* nodeCloneNode */
function nodeRemoveNode(self){
    // methods
    var method = _w3c_Node_removeNode;
    
    return method.apply(self, pop(arguments));
}

/* nodeGetInnerHTML */
function nodeGetInnerHTML(self,depth){
    // methods
    var method = _a_Node_getInnerHTML;
    
    return method.apply(self, pop(arguments));
}

/* nodeRemoveChildNode */
function nodeRemoveChildNode(self,depth){
    // methods
    var method = _a_Node_removeChildNode;
    
    return method.apply(self, pop(arguments));
}

/* nodeGetDocument */
function nodeGetDocument(self) {
    // methods
    var method = undefined_function;

    if (typeof (self.ownerDocument) != 'undefined') {
        method = _w3c_Node_getDocument;
    }

    return method.apply(self, pop(arguments));
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
    // methods
    var method = _w3c_HTMLDocument_getRootElement;
    
    return method.apply(self, pop(arguments));
}

/* docGetNode */
function docGetNode(self,path){
    // methods
    var method = _w3c_HTMLDocument_getNode;
    
    return method.apply(self, pop(arguments));
}

/* docGetClientW */
function docGetClientW(self){
    // methods
    var method = undefined_function;

    if(typeof(self.body)!='undefined')
        method = _a_HTMLDocument_getClientW;
    
    return method.apply(self, pop(arguments));
}

/* docGetClientH */
function docGetClientH(self){
    // methods
    var method = undefined_function;

    if(typeof(self.body)!='undefined')
        method = _a_HTMLDocument_getClientH;
    
    return method.apply(self, pop(arguments));
}

/* docGetBodyW */
function docGetBodyW(self){
    // methods
    var method = undefined_function;

    if(typeof(self.body)!='undefined')
        method = _a_HTMLDocument_getBodyW;
    
    return method.apply(self, pop(arguments));
}

/* docGetBodyH */
function docGetBodyH(self){
    // methods
    var method = undefined_function;

    if(typeof(self.body)!='undefined')
        method = _a_HTMLDocument_getBodyH;
    
    return method.apply(self, pop(arguments));
}

/* docSetCookie */
function docSetCookie(self,name,value){
    // methods
    var method = undefined_function;
    
    if(typeof(self.cookie) != 'undefined')
        method = _a_HTMLDocument_setCookie;
        
    return method.apply(self, pop(arguments));
}

/* docGetCookie */
function docGetCookie(self,name){
    // methods
    var method = undefined_function;
    
    if(typeof(self.cookie) != 'undefined')
        method = _a_HTMLDocument_getCookie;
        
    return method.apply(self, pop(arguments));
}

/* docDelCookie */
function docDelCookie(self,name){
    // methods
    var method = undefined_function;
    
    if(typeof(self.cookie) != 'undefined')
        method = _a_HTMLDocument_delCookie;
        
    return method.apply(self, pop(arguments));
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
    // methods
    var method = undefined_function;
    
    if(typeof(self.styleSheets) != 'undefined')
        method = _a_HTMLDocument_getCSSFile;
        
    return method.apply(self, pop(arguments));
}

/* docImportNode */
function docImportNode(self, node, bDepth){
    // methods
    var method = _a_HTMLDocument_importNode;
    
    /*if(typeof(self.importNode) != 'undefined')
        method = _w3c_HTMLDocument_importNode; //mauvaise importation des tags HTML
    */
        
    return method.apply(self, pop(arguments));
}

/*
--------------------------------------------------------------------------------------------------------------------------------------
    Window Section

    wndGetURL
--------------------------------------------------------------------------------------------------------------------------------------
*/

/* wndGetURL */
function wndGetURL(self){
    // methods
    var method = undefined_function;
    
    if(typeof(self.location) != 'undefined')
        method = _w3c_Window_getURL;
        
    return method.apply(self, pop(arguments));
}

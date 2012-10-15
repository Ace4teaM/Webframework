/*--------------------------------------------------------------------------------------------------------------------------------------
    (C)2008-2010 WebFrameWork 1.3
    JavaScript DOM Librairie : Compatible
    
    Dependences: dom.js

    DEBUG:  Probleme de recursion excessive notament avec les fonctions nodeGetNode, objGetChild, objGetNext, ...
            ( voir si la cause n'est pa due aux nom de fonction semblable dans l'heritage, ex: node.getChildren && element.getChildren, ... ?!)
--------------------------------------------------------------------------------------------------------------------------------------*/

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

function assignMethod(args,method_name,method,bCall)
{
    //recupere l'objet appelant et le reste des arguments
    var _obj = args[0];
    var _args = pop(args);
        
    // Verifie si la methode existe deja au sein de l'objet, si oui, execute directement
    //if(typeof(_obj[method_name]) == 'function')
    //    return _obj[method_name].apply(_obj,_args);

    // Si l'objet est modifiable, ajoute la methode
    if(typeof(method)!='function'){
        wfw.puts(method_name+' method is not a function: ('+typeof(method)+')');
        return false;
    }
             
    // Si l'objet est modifiable, ajoute la methode
    // dans le cas des objets ActiveX, ceci ne possede pas de constructeur et ne sont pas modifiable
    if((typeof(_obj)=='object') && (typeof(_obj.constructor)!='undefined'))
        _obj[method_name] = method;
            
    // Execute
    return (bCall ? method.apply(_obj,_args) : true);  
}

/*--------------------------------------------------------------------------------------------------------------------------------------
    HTMLElement Section
--------------------------------------------------------------------------------------------------------------------------------------*/

/* objGetAtt */
function objGetAtt(obj, name)
{
    if(typeof(obj.getAtt) == 'function')
        return obj.getAtt(name);
        //return obj.getAtt.apply(obj,pop(arguments));

    // methods
    var method = null;

    // W3C, style
    if((typeof(obj.hasAttribute)!='undefined') && (typeof(obj.getAttribute)!='undefined')){
        method = _w3c_HTMLElement_getAtt;
    }

    // assigne si possible puis execute
    return assignMethod( arguments, "getAtt", method, true );
}

/* objSetAtt */
function objSetAtt(obj, name, value)
{    
    if(typeof(obj.setAtt) == 'function')
        return obj.setAtt(name, value);
        //return obj.setAtt.apply(obj,pop(arguments));

    // methods
    var method = null;
        
    // W3C, style
    if((typeof(obj.hasAttribute)!='undefined') && (typeof(obj.setAttribute)!='undefined')){
        method = _w3c_HTMLElement_setAtt;
    }

    // assigne si possible puis execute
    return assignMethod( arguments, "setAtt", method, true );
}

/* objGetClassName */
function objGetClassName(obj){
    if(typeof(obj.getClassName) == 'function')
        return obj.getClassName();
        //return obj.getClassName.apply(obj,pop(arguments));

    // methods
    var method = null;
        
    // W3C, style
    if((typeof(obj.getAttribute)!='undefined')){
        method = _w3c_HTMLElement_getClassName;
    }

    // assigne si possible puis execute
    return assignMethod( arguments, "getClassName", method, true );
}

/* objSetClassName */
function objSetClassName(obj,name){
    if(typeof(obj.setClassName) == 'function')
        return obj.setClassName(name);
        //return obj.setClassName.apply(obj,pop(arguments));

    // methods
    var method = null;
        
    // W3C, style
    if((typeof(obj.getAttribute)!='undefined') && (typeof(obj.setAttribute)!='undefined')){
        method = _w3c_HTMLElement_setClassName;
    }

    // assigne si possible puis execute
    return assignMethod( arguments, "setClassName", method, true );
}

/* objGetName */
function objGetName(obj){
    if(typeof(obj.getName) == 'function')
        return obj.getName();
        //return obj.getName.apply(obj,pop(arguments));

    // methods
    var method = null;
        
    // W3C, style
    if((typeof(obj.getAttribute)!='undefined')){
        method = _w3c_HTMLElement_getName;
    }

    // assigne si possible puis execute
    return assignMethod( arguments, "getName", method, true );
}

/* objSetName */
function objSetName(obj,name){
    if(typeof(obj.setName) == 'function')
        return obj.setName(name);
        //return obj.setName.apply(obj,pop(arguments));

    // methods
    var method = null;
        
    // W3C, style
    if((typeof(obj.setAttribute)!='undefined')){
        method = _w3c_HTMLElement_setName;
    }

    // assigne si possible puis execute
    return assignMethod( arguments, "setName", method, true );
}

/* objSetEvent */
function objSetEvent(obj,e_name,func){
    if(typeof(obj.setEvent) == 'function')
        return obj.setEvent(e_name,func);
        //return obj.setEvent.apply(obj,pop(arguments));

    // methods
    var method = null;
        
    // W3C, style
    if((typeof(obj.addEventListener)!='undefined')){
        method = _w3c_HTMLElement_setEvent;
    }
    else if((typeof(obj.attachEvent)!='undefined')){
        method = _a_HTMLElement_setEvent;
    }

    // assigne si possible puis execute
    return assignMethod( arguments, "setEvent", method, true );
}

/* objSetInnerText */
function objSetInnerText(obj,text){
    if(typeof(obj.setInnerText) == 'function')
        return obj.setInnerText(text);
        //return obj.setInnerText.apply(obj,pop(arguments));

    // methods
    var method = null;
        
    if((typeof(obj.text)!='undefined')){
        method = _a_HTMLElement_setInnerText;
    }
    else if((typeof(obj.textContent)!='undefined')){
        method = _b_HTMLElement_setInnerText;
    }
    else if((typeof(obj.innerText)!='undefined')){
        method = _c_HTMLElement_setInnerText;
    }

    // assigne si possible puis execute
    return assignMethod( arguments, "setInnerText", method, true );
}

/* objGetInnerText */
function objGetInnerText(obj){
    if(typeof(obj.getInnerText) == 'function')
        return obj.getInnerText();
        //return obj.getInnerText.apply(obj,pop(arguments));

    // methods
    var method = null;
        
    if((typeof(obj.text)!='undefined')){
        method = _a_HTMLElement_getInnerText;
    }
    else if((typeof(obj.textContent)!='undefined')){
        method = _b_HTMLElement_getInnerText;
    }
    else if((typeof(obj.innerText)!='undefined')){
        method = _c_HTMLElement_getInnerText;
    }
    else if((typeof(obj.nodeValue)!='undefined')){
        method = _d_HTMLElement_getInnerText;
    }

    // assigne si possible puis execute
    return assignMethod( arguments, "getInnerText", method, true );
}

/* objGetChildren */
function objGetChildren(obj){
    if(typeof(obj.getChildren) == 'function')
        return obj.getChildren();
        //return obj.getChildren.apply(obj,pop(arguments));

    // methods
    var method = _a_HTMLElement_getChildren;

    // assigne si possible puis execute
    return assignMethod( arguments, "getChildren", method, true );
}

/* objGetChildrenByTagName */
function objGetChildrenByTagName(obj,tagName){
    if(typeof(obj.getChildrenByTagName) == 'function')
        return obj.getChildrenByTagName(tagName);
        //return obj.getChildrenByTagName.apply(obj,pop(arguments));

    // methods
    var method = _a_HTMLElement_getChildrenByTagName;

    // assigne si possible puis execute
    return assignMethod( arguments, "getChildrenByTagName", method, true );
}

/* objGetChild */
function objGetChild(obj,tagName){
  //  if(typeof(obj.getChild) == 'function')
   //     return obj.getChild(tagName);
        //return obj.getChild.apply(obj,pop(arguments));

    // methods
    var method = _a_HTMLElement_getChild;

    // assigne si possible puis execute
    return assignMethod( arguments, "getChild", method, true );
}

/* objGetChildElement */
function objGetChildElement(obj){
    if(typeof(obj.getChildElement) == 'function')
        return obj.getChildElement();
        //return obj.getChildElement.apply(obj,pop(arguments));

    // methods
    var method =  null;

    if(typeof(obj.children)!='undefined')
        method = _w3c_HTMLElement_getChildElement;
    else if(typeof(obj.all)!='undefined')
        method = _a_HTMLElement_getChildElement;

    // assigne si possible puis execute
    return assignMethod( arguments, "getChildElement", method, true );
}


/* objGetNext */
function objGetNext(obj,tagName){
 //   if(typeof(obj.getNext) == 'function')
 //       return obj.getNext(tagName);
        //return obj.getNext.apply(obj,pop(arguments));

    // methods
    var method = _a_HTMLElement_getNext;

    // assigne si possible puis execute
    return assignMethod( arguments, "getNext", method, true );
}

/* objGetX */
function objGetX(obj){
    if(typeof(obj.getX) == 'function')
        return obj.getX();
        //return obj.getX.apply(obj,pop(arguments));

    // methods
    var method = null;

    if(typeof(obj.offsetLeft)!='undefined')
        method = _a_HTMLElement_getX;

    // assigne si possible puis execute
    return assignMethod( arguments, "getX", method, true );
}

/* objGetY */
function objGetY(obj){
    if(typeof(obj.getY) == 'function')
        return obj.getY();
        //return obj.getY.apply(obj,pop(arguments));

    // methods
    var method = null;

    if(typeof(obj.offsetTop)!='undefined')
        method = _a_HTMLElement_getY;

    // assigne si possible puis execute
    return assignMethod( arguments, "getY", method, true );
}

/* objGetAbsX */
function objGetAbsX(obj){
    if(typeof(obj.getAbsX) == 'function')
        return obj.getAbsX();
        //return obj.getAbsX.apply(obj,pop(arguments));

    // methods
    var method = null;

    if((typeof(obj.offsetLeft)!='undefined') && (typeof(obj.offsetParent)!='undefined'))
        method = _a_HTMLElement_getAbsX;

    // assigne si possible puis execute
    return assignMethod( arguments, "getAbsX", method, true );
}

/* objGetAbsY */
function objGetAbsY(obj){
    if(typeof(obj.getAbsY) == 'function')
        return obj.getAbsY();
        //return obj.getAbsY.apply(obj,pop(arguments));

    // methods
    var method = null;

    if((typeof(obj.offsetTop)!='undefined') && (typeof(obj.offsetParent)!='undefined'))
        method = _a_HTMLElement_getAbsY;

    // assigne si possible puis execute
    return assignMethod( arguments, "getAbsY", method, true );
}

/* objGetW */
function objGetW(obj){
    if(typeof(obj.getW) == 'function')
        return obj.getW();
        //return obj.getW.apply(obj,pop(arguments));

    // methods
    var method = null;

    if((typeof(obj.style.width)!='undefined'))
        method = _a_HTMLElement_getW;

    // assigne si possible puis execute
    return assignMethod( arguments, "getW", method, true );
}

/* objGetH */
function objGetH(obj){
    if(typeof(obj.getH) == 'function')
        return obj.getH();
        //return obj.getH.apply(obj,pop(arguments));

    // methods
    var method = null;

    if((typeof(obj.style.height)!='undefined'))
        method = _a_HTMLElement_getH;

    // assigne si possible puis execute
    return assignMethod( arguments, "getH", method, true );
}

/* objSetW */
function objSetW(obj, width){
    if(typeof(obj.setW) == 'function')
        return obj.setW(width);
        //return obj.setW.apply(obj,pop(arguments));

    // methods
    var method = null;

    if((typeof(obj.style.width)!='undefined'))
        method = _a_HTMLElement_setW;

    // assigne si possible puis execute
    return assignMethod( arguments, "setW", method, true );
}

/* objSetH */
function objSetH(obj, height){
    if(typeof(obj.setH) == 'function')
        return obj.setH(height);
        //return obj.setH.apply(obj,pop(arguments));

    // methods
    var method = null;

    if((typeof(obj.style.height)!='undefined'))
        method = _a_HTMLElement_setH;

    // assigne si possible puis execute
    return assignMethod( arguments, "setH", method, true );
}

/* objSetXY */
function objSetXY(obj, x, y){
    if(typeof(obj.setXY) == 'function')
        return obj.setXY(x, y);
        //return obj.setXY.apply(obj,pop(arguments));

    // methods
    var method = null;

    if((typeof(obj.style.left)!='undefined') && (typeof(obj.style.top)!='undefined'))
        method = _a_HTMLElement_setXY;

    // assigne si possible puis execute
    return assignMethod( arguments, "setXY", method, true );
}

/* objSetRect */
function objSetRect(obj,x,y,w,h){
    if(typeof(obj.setRect) == 'function')
        return obj.setRect(x,y,w,h);
        //return obj.setRect.apply(obj,pop(arguments));

    // methods
    var method = _a_HTMLElement_setRect;

    // assigne si possible puis execute
    return assignMethod( arguments, "setRect", method, true );
}

/*--------------------------------------------------------------------------------------------------------------------------------------
    HTMLNode Section
--------------------------------------------------------------------------------------------------------------------------------------*/

/* nodeInsertAfter */
function nodeInsertAfter(node,tagName){
    if(typeof(node.insertAfter) == 'function')
        return node.insertAfter(tagName);
        //return node.insertAfter.apply(node,pop(arguments));

    // methods
    var method = null;
        
    if((typeof(node.insertBefore)!='undefined')&&(typeof(node.appendChild)!='undefined')){
        method = _w3c_Node_insertAfter;
    }

    // assigne si possible puis execute
    return assignMethod( arguments, "insertAfter", method, true );
}

/* nodeGetValue */
function nodeGetValue(node,def){
    if(typeof(node.getValue) == 'function')
        return node.getValue(def);
        //return node.getValue.apply(node,pop(arguments));

    // methods
    var method = null;
        
    if(typeof(node.nodeValue)!='undefined'){
        method = _w3c_Node_getValue;
    }
    else if(typeof(node.textContent)!='undefined'){
        method = _a_Node_getValue;
    }
    else if(typeof(node.innerText)!='undefined'){
        method = _b_Node_getValue;
    }
    else if(typeof(node.text)!='undefined'){
        method = _c_Node_getValue;
    }

    // assigne si possible puis execute
    return assignMethod( arguments, "getValue", method, true );
}

/* nodeGetChildNode */
function nodeGetChildNode(node){
    if(typeof(node.getChildNode) == 'function')
        return node.getChildNode();
        //return node.getChildNode.apply(node,pop(arguments));

    // methods
    var method = null;
        
    if(typeof(node.firstChild)!='undefined'){
        method = _w3c_Node_getChildNode;
    }
    else if(typeof(node.childNodes)!='undefined'){
        method = _a_Node_getChildNode;
    }

    // assigne si possible puis execute
    return assignMethod( arguments, "getChildNode", method, true );
}

/* nodeGetChild */
function nodeGetChild(node,filterFunc){
//    if(typeof(node.getChild) == 'function')
  //      return node.getChild(filterFunc);
        //return node.getChild.apply(node,pop(arguments));

    // methods
    var method = _w3c_Node_getChild;

    // assigne si possible puis execute
    return assignMethod( arguments, "getChild", method, true );
}

/* nodeGetChildren */
function nodeGetChildren(node,filterFunc){
    if(typeof(node.getChildren) == 'function')
        return node.getChildren(filterFunc);
        //return node.getChildren.apply(node,pop(arguments));

    // methods
    var method = _w3c_Node_getChildren;

    // assigne si possible puis execute
    return assignMethod( arguments, "getChildren", method, true );
}

/* nodeGetNext */
function nodeGetNext(node,filterFunc){
 //   if(typeof(node.getNext) == 'function')
 //       return node.getNext(filterFunc);
        //return node.getNext.apply(node,pop(arguments));

    // methods
    var method = _w3c_Node_getNext;

    // assigne si possible puis execute
    return assignMethod( arguments, "getNext", method, true );
}

/* nodeGetNexts */
function nodeGetNexts(node,filterFunc){
    if(typeof(node.getNexts) == 'function')
        return node.getNexts(filterFunc);
        //return node.getNexts.apply(node,pop(arguments));

    // methods
    var method = _w3c_Node_getNexts;

    // assigne si possible puis execute
    return assignMethod( arguments, "getNexts", method, true );
}

/*--------------------------------------------------------------------------------------------------------------------------------------
    HTMLDocument Section
--------------------------------------------------------------------------------------------------------------------------------------*/

/* docGetElement */
function docGetElement(doc,id){
    if(typeof(doc.getElement) == 'function')
        return doc.getElement(id);
        //return doc.getElement.apply(doc,pop(arguments));

    // methods
    var method = null;
    
    if(typeof(doc.getElementById) != 'undefined')
        method = _w3c_HTMLDocument_getElement;
    else if(typeof(doc.embeds) != 'undefined')
        method = _a_HTMLDocument_getElement;
    else // if(typeof(doc['body']) != 'undefined') // testable?!
        method = _b_HTMLDocument_getElement;

    // assigne si possible puis execute
    return assignMethod( arguments, "getElement", method, true );
}

/* docGetElements */
function docGetElements(doc,tagName){
    if(typeof(doc.getElements) == 'function')
        return doc.getElements(tagName);
        //return doc.getElements.apply(doc,pop(arguments));

    // methods
    var method = null;
    
    if(typeof(doc.getElementsByTagName) != 'undefined')
        method = _w3c_HTMLDocument_getElements;
    else if(typeof(doc.all) != 'undefined')
        method = _a_HTMLDocument_getElements;
    else  if(typeof(doc.layers) != 'undefined')
        method = _b_HTMLDocument_getElements;

    // assigne si possible puis execute
    return assignMethod( arguments, "getElements", method, true );
}

/* docGetRootElement */
function docGetRootElement(doc,tagName){
    if(typeof(doc.getRootElement) == 'function')
        return doc.getRootElement(tagName);
        //return doc.getRootElement.apply(doc,pop(arguments));

    // methods
    var method = _w3c_HTMLDocument_getRootElement;
    
    // assigne si possible puis execute
    return assignMethod( arguments, "getRootElement", method, true );
}

/* docGetNode */
function docGetNode(doc,path){
    if(typeof(doc.getNode) == 'function')
        return doc.getNode(path);
        //return doc.getNode.apply(doc,pop(arguments));

    // methods
    var method = _w3c_HTMLDocument_getNode;
    
    // assigne si possible puis execute
    return assignMethod( arguments, "getNode", method, true );
}

/* docGetClientW */
function docGetClientW(doc){
    if(typeof(doc.getClientW) == 'function')
        return doc.getClientW();
        //return doc.getClientW.apply(doc,pop(arguments));
        
    // methods
    var method = null;

    if(typeof(document.body)!='undefined')
        method = _a_HTMLDocument_getClientW;
    
    // assigne si possible puis execute
    return assignMethod( arguments, "getClientW", method, true );
}

/* docGetClientH */
function docGetClientH(doc){
    if(typeof(doc.getClientH) == 'function')
        return doc.getClientH();
        //return doc.getClientH.apply(doc,pop(arguments));

    // methods
    var method = null;

    if(typeof(document.body)!='undefined')
        method = _a_HTMLDocument_getClientH;
    
    // assigne si possible puis execute
    return assignMethod( arguments, "getClientH", method, true );
}

/* docGetBodyW */
function docGetBodyW(doc){
    if(typeof(doc.getBodyW) == 'function')
        return doc.getBodyW();
        //return doc.getBodyW.apply(doc,pop(arguments));

    // methods
    var method = null;

    if(typeof(document.body)!='undefined')
        method = _a_HTMLDocument_getBodyW;
    
    // assigne si possible puis execute
    return assignMethod( arguments, "getBodyW", method, true );
}

/* docGetBodyH */
function docGetBodyH(doc){
    if(typeof(doc.getBodyH) == 'function')
        return doc.getBodyH();
        //return doc.getBodyH.apply(doc,pop(arguments));

    // methods
    var method = null;

    if(typeof(document.body)!='undefined')
        method = _a_HTMLDocument_getBodyH;
    
    // assigne si possible puis execute
    return assignMethod( arguments, "getBodyH", method, true );
}

/* docSetCookie */
function docSetCookie(doc,name,value){
    if(typeof(doc.setCookie) == 'function')
        return doc.setCookie(name,value);
        //return doc.setCookie.apply(doc,pop(arguments));

    // methods
    var method = null;
    
    if(typeof(doc.cookie) != 'undefined')
        method = _a_HTMLDocument_setCookie;

    // assigne si possible puis execute
    return assignMethod( arguments, "setCookie", method, true );
}

/* docGetCookie */
function docGetCookie(doc,name){
    if(typeof(doc.getCookie) == 'function')
        return doc.getCookie(name);
        //return doc.getCookie.apply(doc,pop(arguments));

    // methods
    var method = null;
    
    if(typeof(doc.cookie) != 'undefined')
        method = _a_HTMLDocument_getCookie;

    // assigne si possible puis execute
    return assignMethod( arguments, "getCookie", method, true );
}

/* docDelCookie */
function docDelCookie(doc,name){
    if(typeof(doc.delCookie) == 'function')
        return doc.delCookie(name);
        //return doc.delCookie.apply(doc,pop(arguments));

    // methods
    var method = null;
    
    if(typeof(doc.cookie) != 'undefined')
        method = _a_HTMLDocument_getCookie;

    // assigne si possible puis execute
    return assignMethod( arguments, "delCookie", method, true );
}

/*--------------------------------------------------------------------------------------------------------------------------------------
    Window Section
--------------------------------------------------------------------------------------------------------------------------------------*/

/* wndGetURL */
function wndGetURL(wnd){
    if(typeof(wnd.getURL) == 'function')
        return wnd.getURL();
        //return wnd.getURL.apply(wnd,pop(arguments));

    // methods
    var method = null;
    
    if(typeof(wnd.location) != 'undefined')
        method = _w3c_Window_getURL;

    // assigne si possible puis execute
    return assignMethod( arguments, "getURL", method, true );
}

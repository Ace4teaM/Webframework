/*--------------------------------------------------------------------------------------------------------------------------------------
    (C)2008-2010 WebFrameWork 1.3
    JavaScript DOM Librairie : Compatible
    
    Dependences: dom.js
--------------------------------------------------------------------------------------------------------------------------------------*/

if(typeof(Element)!='undefined'){
    Element.prototype.getAtt = function(name)           { return objGetAtt(this,name); }
    Element.prototype.setAtt = function(name,value)     { return objSetAtt(this,name,value); }
    Element.prototype.setClassName = function(name)     { return objSetClassName(this,name); }
    Element.prototype.getName = function()              { return objGetName(this); }
    Element.prototype.setEvent = function(e_name,func)  { return objSetEvent(this,e_name,func); }
    Element.prototype.setInnerText = function(text)     { return objSetInnerText(this,text); }
    Element.prototype.getInnerText = function()         { return objGetInnerText(this); }
    Element.prototype.getChilds = function()            { return objGetChilds(this); }
    Element.prototype.getChild = function(name)         { return objGetChild(this,name); }
    Element.prototype.getNext = function(name)          { return objGetNext(this,name); }
    Element.prototype.insertAfter = function(node, ref) { return objInsertAfter(this,node, ref); }
    Element.prototype.getX = function()                 { return objGetX(this); }
    Element.prototype.getY = function()                 { return objGetY(this); }
    Element.prototype.getAbsX = function()              { return objGetAbsX(this); }
    Element.prototype.getAbsY = function()              { return objGetAbsY(this); }
    Element.prototype.getW = function()                 { return objGetW(this); }
    Element.prototype.getH = function()                 { return objGetH(this); }
    Element.prototype.setW = function(w)                { return objSetW(this,w); }
    Element.prototype.setH = function(h)                { return objSetH(this,h); }
    Element.prototype.setXY = function(x,y)             { return objSetRect(this,x,y); }
    Element.prototype.setRect = function(x,y,w,h)       { return objSetXY(this,x,y,w,h); }
}

if(typeof(HTMLElement)!='undefined'){
    HTMLElement.prototype.getAtt = function(name)           { return objGetAtt(this,name); }
    HTMLElement.prototype.setAtt = function(name,value)     { return objSetAtt(this,name,value); }
    HTMLElement.prototype.setClassName = function(name)     { return objSetClassName(this,name); }
    HTMLElement.prototype.getName = function()              { return objGetName(this); }
    HTMLElement.prototype.setEvent = function(e_name,func)  { return objSetEvent(this,e_name,func); }
    HTMLElement.prototype.setInnerText = function(text)     { return objSetInnerText(this,text); }
    HTMLElement.prototype.getInnerText = function()         { return objGetInnerText(this); }
    HTMLElement.prototype.getChilds = function()            { return objGetChilds(this); }
    HTMLElement.prototype.getChild = function(name)         { return objGetChild(this,name); }
    HTMLElement.prototype.getNext = function(name)          { return objGetNext(this,name); }
    HTMLElement.prototype.insertAfter = function(node, ref) { return objInsertAfter(this,node, ref); }
    HTMLElement.prototype.getX = function()                 { return objGetX(this); }
    HTMLElement.prototype.getY = function()                 { return objGetY(this); }
    HTMLElement.prototype.getAbsX = function()              { return objGetAbsX(this); }
    HTMLElement.prototype.getAbsY = function()              { return objGetAbsY(this); }
    HTMLElement.prototype.getW = function()                 { return objGetW(this); }
    HTMLElement.prototype.getH = function()                 { return objGetH(this); }
    HTMLElement.prototype.setW = function(w)                { return objSetW(this,w); }
    HTMLElement.prototype.setH = function(h)                { return objSetH(this,h); }
    HTMLElement.prototype.setXY = function(x,y)             { return objSetRect(this,x,y); }
    HTMLElement.prototype.setRect = function(x,y,w,h)       { return objSetXY(this,x,y,w,h); }
}

if(typeof(HTMLDocument)!='undefined'){
    HTMLDocument.prototype.getElement = function(id)                  { return docGetElement_(this,id); }
    HTMLDocument.prototype.getElements = function(tagName)            { return docGetElements(tagName); }
    HTMLDocument.prototype.getNamedElements = function(tagName,name)  { return docGetNamedElements(tagName,name); }
    HTMLDocument.prototype.getURLArg = function()                     { return docGetURLArg(); }
    HTMLDocument.prototype.getURL = function()                        { return docGetURL(); }
    HTMLDocument.prototype.getClientW = function()                    { return docGetClientW(this); }
    HTMLDocument.prototype.getClientH = function()                    { return docGetClientH(this); }
    HTMLDocument.prototype.getBodyW = function()                      { return docGetBodyW(this); }
    HTMLDocument.prototype.getBodyH = function()                      { return docGetBodyH(this); }
    HTMLDocument.prototype.getNode = function(path)                   { return docGetNode(this,path); }
}

if(typeof(Document)!='undefined'){
    Document.prototype.getElement = function(id)                  { return docGetElement_(this,id); }
    Document.prototype.getElements = function(tagName)            { return docGetElements(tagName); }
    Document.prototype.getNamedElements = function(tagName,name)  { return docGetNamedElements(tagName,name); }
    Document.prototype.getURLArg = function()                     { return docGetURLArg(); }
    Document.prototype.getURL = function()                        { return docGetURL(); }
    Document.prototype.getClientW = function()                    { return docGetClientW(this); }
    Document.prototype.getClientH = function()                    { return docGetClientH(this); }
    Document.prototype.getBodyW = function()                      { return docGetBodyW(this); }
    Document.prototype.getBodyH = function()                      { return docGetBodyH(this); }
    Document.prototype.getNode = function(path)                   { return docGetNode(this,path); }
}

if(typeof(XMLDocument)!='undefined'){
    XMLDocument.prototype.getElement = function(id)                  { return docGetElement_(this,id); }
    XMLDocument.prototype.getElements = function(tagName)            { return docGetElements(tagName); }
    XMLDocument.prototype.getNamedElements = function(tagName,name)  { return docGetNamedElements(tagName,name); }
    XMLDocument.prototype.getURLArg = function()                     { return docGetURLArg(); }
    XMLDocument.prototype.getURL = function()                        { return docGetURL(); }
    XMLDocument.prototype.getClientW = function()                    { return docGetClientW(this); }
    XMLDocument.prototype.getClientH = function()                    { return docGetClientH(this); }
    XMLDocument.prototype.getBodyW = function()                      { return docGetBodyW(this); }
    XMLDocument.prototype.getBodyH = function()                      { return docGetBodyH(this); }
    XMLDocument.prototype.getNode = function(path)                   { return docGetNode(this,path); }
}

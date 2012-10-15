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

    Fonctions globales du DocumentObjectModel-2, chacunes des fonctions du WFW-DOM est definit ici dans leurs diverses versions.

    chaque fonction suit une regle de nomage du style: _prefix_type_nom() ou:
    -prefix: Definit la version de compatibilite ( _std_: propose une methode standard découlant des autres fonctions (independante), _w3c_ :propose une methode du standard W3C. _a_, _b_, _c_, etc... propose divers alternatives aux autres navigateurs du marche. )
    -type  : Definit a quel type d'objet est applicable la fonction. ex: 'node' definit un objet de type 'HTMLNode', 'doc' definit un objet de type 'DOMDocument', ...
             A noter que ces fonctions sont appelees dans le context de l'objet, l'operateur 'this' est utilise pour y faire reference.
    -nom   : Le nom de la fonction.
             Le nom doit etre strictement unique, meme pour plusieurs 'types' distincts.
    
    Dependences: base.js

    Revisions:
        [03-02-2011], Ajout de _a_HTMLElement_getPrev(), _w3c_Node_getPrev(), _w3c_HTMLElement_removeChildNode().
        [08-02-2011], Ajout de _*_HTMLDocument_getNamedElements();
        [08-02-2011], _a_HTMLDocument_setCookie() retourne true.
        [03-05-2011], Ajout du parametre 'param' a _*_HTMLElement_setEvent().
        [30-05-2011], Ajout de _w3c_HTMLElement_getOrgH() et _w3c_HTMLElement_getOrgW()
        [31-05-2011], Modification de _a_HTMLElement_setXY(), la fonction ne calcule plus l'offset du scrolling [position incorrect sous IE-9]
        [02-06-2011], Modification de _a_HTMLElement_getH, _a_HTMLElement_getW, _a_HTMLElement_setW, _a_HTMLElement_setH
        [18-11-2011], Modification de _*_HTMLElement_setEvent, si le callback retourne false, la propagation de l'evenement est stoper
        [18-11-2011], Debug _w3c_Node_insertAfter(), inversion des arguments [resolue]
        [21-11-2011], Debug _w3c_HTMLDocument_getNode() et _w3cHTMLElement_getNode()
        [30-11-2011], Update _w3c_Node_getChildren(), utilise nodeGetNext() plutot .nextSibling
        [30-11-2011], Add _a_Node_getInnerHTML()
        [30-11-2011], Add _a_Node_removeChildNode()
        [06-01-2012], Debug _w3c_HTMLElement_setEvent(), erreur de programmation
*/

/*
--------------------------------------------------------------------------------------------------------------------------------------
    Node Types
--------------------------------------------------------------------------------------------------------------------------------------
*/

var ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = 2;
var TEXT_NODE = 3;
var CDATA_SECTION_NODE = 4;
var ENTITY_REFERENCE_NODE = 5;
var ENTITY_NODE = 6;
var PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE = 8;
var DOCUMENT_NODE = 9;
var DOCUMENT_TYPE_NODE = 10;
var DOCUMENT_FRAGMENT_NODE = 11;
var NOTATION_NODE = 12;

var XML_ELEMENT_NODE = 1;
var XML_ATTRIBUTE_NODE = 2;
var XML_TEXT_NODE = 3;
var XML_CDATA_SECTION_NODE = 4;
var XML_ENTITY_REFERENCE_NODE = 5;
var XML_ENTITY_NODE = 6;
var XML_PROCESSING_INSTRUCTION_NODE = 7;
var XML_COMMENT_NODE = 8;
var XML_DOCUMENT_NODE = 9;
var XML_DOCUMENT_TYPE_NODE = 10;
var XML_DOCUMENT_FRAGMENT_NODE = 11;
var XML_NOTATION_NODE = 12;

/*
--------------------------------------------------------------------------------------------------------------------------------------
    HTMLElement Section
--------------------------------------------------------------------------------------------------------------------------------------
*/


/*
    [rev1] Obtient la valeur d'un attribut

    Parametres:
        [string]      name  : Nom de l'attribut
    Retourne:
        Valeur de l'attribut, null si inexistant.
    Remarques:
        Mozilla    : l'attribut "value" est déconnecté de la propriété "value"!
                       obj.getAttribut("value") retourne la valeur pre-definit au chargement du document. obj.value, lui, retourne la valeur dynamique.
        I.E        : obj.hasAttribute() n'est pas reconnue par l'objet ActiveX 'Microsoft.XMLHTTP'
        I.E/Safari : le test de eval('this.class') mène parfois à un bug ?? (voir wfw.template.check_arguments())
    Revisions:
        [14-03-2010], Retourne null si l'attribut n'existe pas (retourne "undefined" precedement).
        [14-03-2010], Fix bug pour Mozilla-FireFox qui ne retourne pas la valeur dynamique de l'attribut "value".
        [09-08-2010], reimplente la methode .hasAttribute(), ajoute l'exception 'type'
        [08-10-2010], name est insensible a la case, test les arguments avec typeof()
        [30-12-2010], igonre la methode .hasAttribute() qui n'est pas definit par l'objet ActiveX 'Microsoft.XMLHTTP'
        [30-12-2010], test directement l'objet pour savoir si une propriete dynamique est disponible a la place de l'attribut (voir DEBUG 1.1)
        [21-04-2011], Ajout de _w3c_Node_cloneNode() et _w3c_Node_removeNode()
        [21-04-2011], Implemente l'attribut "bNext" a _w3c_Node_enumNodes()
*/
var _w3c_HTMLElement_getAtt = function(name){
    name = name.toLowerCase();

    // si l'attribut existe en tant que propriete de l'objet retourne celui-ci
    if((cInputIdentifier.isValid(name)==ERR_OK) && (eval("typeof(this."+name+")") == 'string'))
        return eval("this."+name+";");

    // avec espace de nom
//    if(name.indexOf(":"))
//        return objGetAttNS(this,name);

    return this.getAttribute(name);
}

/*
    [rev1] Definit la valeur d'un attribut

    Parametres:
        [string]      name  : Nom de l'attribut
        [string]      value : Valeur de l'attribut
    Retourne:
           Valeur de l'attribut, null si l'attribut est inexistant.
    Remarques:
        voir : _w3c_HTMLElement_getAtt()
    Revisions:
        [14-03-2010], Retourne null si l'attribut n'existe pas (retourne "undefined" precedement)
        [31-03-2010], Utilise la methode .setAttribute() si disponible notamment pour Mozilla et l'attribut "type".
        [31-03-2010], Sur Mozilla .hasAttribute() ne reconnais pas "type" comme un attribut! le code a ete supprimer
        [09-08-2010], reimplente la methode .hasAttribute(), ajoute l'exception 'type'
        [08-10-2010], name est insensible a la case, test les arguments avec typeof()
        [30-12-2010], igonre la methode .hasAttribute() qui n'est pas definit par l'objet ActiveX 'Microsoft.XMLHTTP'
        [30-12-2010], test directement l'objet pour savoir si une propriete dynamique est disponible a la place de l'attribut (voir _w3c_HTMLElement_getAtt: DEBUG 1.1)
        [16-02-2011], Utiliser la valeur 'value' avec des quotes(') dans la syntaxe (name='value';) cree une erreur de chaine [resolue]
*/
var _w3c_HTMLElement_setAtt = function(name,value){
    name = name.toLowerCase();
    
    // si l'attribut existe en tant que propriete de l'objet retourne celui-ci
    if((cInputIdentifier.isValid(name)==ERR_OK) &&  (eval("typeof(this."+name+")") == 'string'))
        return eval("this."+name+"=value;");

    this.setAttribute(name,value);

    return this.getAttribute(name);
}

/*
    [rev1] Supprime un attribut.

    Parametres:
        [string]      name  : Nom de l'attribut
    Retourne:
        true
*/
var _w3c_HTMLElement_removeAtt = function(name){
    this.removeAttribute(name);
    return true;
}

/*
    [rev1] Obtient la valeur d'un attribut dans l'espace de nom donné.

    Parametres:
        [string] ns    : Espace de nom
        [string] name  : Nom de l'attribut
    Retourne:
        Valeur de l'attribut, null si inexistant ou vide
*/
var _w3c_HTMLElement_getAttNS = function(ns,name){
    var value = this.getAttributeNS(ns,name);
    if(typeof(value)!='string' || empty(value))
        return null;
    return value;
}

/*
    [rev1] Definit la valeur d'un attribut dans l'espace de nom donne.

    Parametres:
        [string] ns    : Espace de nom
        [string] name  : Nom de l'attribut
        [string] value : Valeur de l'attribut
    Retourne:
        Valeur de l'attribut, null si inexistant ou vide
*/
var _w3c_HTMLElement_setAttNS = function(ns,name,value){
    var value = this.setAttributeNS(ns,name,value);
    if(typeof(value)!='string' || empty(value))
        return null;
    return value;
}

/*
   [rev1] Supprime un attribut dans l'espace de nom donne.

    Parametres:
        [string] ns    : Espace de nom
        [string] name  : Nom de l'attribut
    Retourne:
        true
*/
var _w3c_HTMLElement_removeAttNS = function(ns,name){
    this.removeAttributeNS(ns,name);
    return true;
}


/*
   [rev1] Obtient la 'class' d'un élément

    Retourne:
        Valeur de l'attribut
    Revisions:
        [18-10-2010], ajout la compatibilite IE7: _ie7_HTMLElement_getClassName
*/
var _w3c_HTMLElement_getClassName = function(){
	return this.getAttribute("class");
}

var _ie7_HTMLElement_getClassName = function(){
    return this.className;
}

/*
    [rev1] Définit la classe d'un élément

    Parametres:
        [string] name  : Nom de classe
    Retourne:
        Valeur de l'attribut, null si
    Revisions:
        [18-10-2010], ajout la compatibilite IE7: _ie7_HTMLElement_setClassName
*/
var _w3c_HTMLElement_setClassName = function(name){
	this.setAttribute("class",name);
	return this.getAttribute("class");
}

var _ie7_HTMLElement_setClassName = function(name){
    return (this.className = name);
}

/*
    [rev1] Obtient le nom d'un élément

    Retourne:
        Nom de l'élément
*/
var _w3c_HTMLElement_getName = function(){
	return this.getAttribute("name");
}

/*
    [rev1] Definit le nom d'un élément
    
    Parametres:
        [string] name  : Nom
    Retourne:
        Nom de l'élément
*/
var _w3c_HTMLElement_setName = function(name){
	this.setAttribute("name",name);
	return this.getAttribute("name");
}

/*
    [rev1] Attache une fonction d'événement à un élément

    Parametres:
        [string]   e_name  : Nom de l'événement (sans le préfix 'on', par exemple 'onclick' devient ‘click’)
        [function] func    : Fonction de rappel
        ( [object]   param   : Paramètres à passer à la fonction )
    Retourne:
        [bool] true
    Remarque:
        La fonction de rappel prend la forme : void func(event)
        L'Accès à l'objet cible est accessible via l'operateur "this".
    Exemple:
        function myEventCallBack(e)
        {
            alert(e); //l'objet event
            alert(this); //l'objet declencheur
        }
        objSetEvent( $doc("myElement"), "mouseover", myEventCallBack );
*/
//Standard
var _w3c_HTMLElement_setEvent = function (e_name, func, param) {
    //	this["event_"+e_name+"_param"] = param;
    //appel 'addEventListener' une seule fois pour ne pas cumuler les appels
    //si 'addEventListener' est utilisé successivement sur un objet, les evenements sont empilés et appelés en chaine. Pour utiliser des listes d'evenements utilisez l'extention 'wfw.event'
    if (typeof (this["e" + e_name]) == "undefined") {
        this.addEventListener(e_name, function (e) {
            var ret = this["e" + e_name].apply(this, [e, param]);

            //stop la propagation ?
            if (ret == false) {
                if (e.cancelBubble)
                    e.cancelBubble = true;
                else if (e.stopPropagation)
                    e.stopPropagation();
            }
            else {
                if (e.cancelBubble)
                    e.cancelBubble = false;
            }
        }, false);
    }
    this["e" + e_name] = func; // assigne temporairement la fonction a la racine de l'objet pour recupere le pointeur 'this' lors de l'appel
    return true;
}

//I.E (attachEvent)
var _a_HTMLElement_setEvent = function(e_name,func,param){
    var obj=this;
//	obj["event_"+e_name+"_param"] = param;
	obj["e"+e_name+func] = func;
	obj[e_name+func] = function() {
        var ret = obj["e"+e_name+func]( window.event.srcElement, param );

        //stop la propagation ?
        if(ret==false)
        {
            if(window.event.cancelBubble)
                window.event.cancelBubble = true;
            else if(window.event.stopPropagation)
                window.event.stopPropagation();
        }
        else {
            if (window.event.cancelBubble)
                window.event.cancelBubble = false;
        }
    };
	obj.attachEvent( "on"+e_name, obj[e_name+func] );
    return true;
}

//Ancienne alternative (A TESTER)
var _b_HTMLElement_setEvent = function (e_name, func, param) {
    var obj = this;
    //	obj["event_"+e_name+"_param"] = param;
    obj["e" + e_name] = func;
    obj["on"+e_name] = function () {
        var ret = obj["e" + e_name](window.event.srcElement, param);

        //stop la propagation ?
        if (ret == false) {
            if (window.event.cancelBubble)
                window.event.cancelBubble = true;
            else if (window.event.stopPropagation)
                window.event.stopPropagation();
        }
        else {
            if (window.event.cancelBubble)
                window.event.cancelBubble = false;
        }
    };
    return true;
}

/*
    [rev1] Remplace le texte d'un element

    Parametres:
        [string] text  : Nouveau texte
    Retourne:
        Texte
    Revisions:
        [05-05-2010], utilise typeof() pour verifier l'existance d'un membre
        [05-05-2010], test le membre .text pour coller avec l'utilisation des noeuds dans les documents créer dynamiquement, notamment la classe XMLDocument (WebFrameWork)
*/
/*_a_HTMLElement_setInnerText = function(text){
	return (this.text = text); // lecture seul uniquement
}*/
var _b_HTMLElement_setInnerText = function (text) {
    return (this.textContent = text);
}
var _c_HTMLElement_setInnerText = function (text) {
    return (this.innerText = text);
}

/*
    [rev1] Obtient le texte d'un element

    Retourne:
        texte
    Revisions:
        [05-05-2010], utilise typeof() pour verifier l'existance d'un membre
        [05-05-2010], test le membre .text pour coller avec l'utilisation des noeuds dans les documents créer dynamiquement, notamment la classe XMLDocument (WebFrameWork)
*/
var _a_HTMLElement_getInnerText = function(text){
	return this.text;
}
var _b_HTMLElement_getInnerText = function(text){
	return this.textContent;
}
var _c_HTMLElement_getInnerText = function(text){
	return this.innerText;
}
var _d_HTMLElement_getInnerText = function(){
	return this.nodeValue;
}
var _std_HTMLElement_getInnerText = function(){
    var text="";
    var child_node = nodeGetChildNode(this);
    while(child_node!=null){
        if(child_node.nodeType == XML_TEXT_NODE){
            text += child_node.wholeText;
        }
        if(nodeGetChildNode(child_node)){
            text += getInnerText(nodeGetChildNode(child_node));
        }
        child_node = nodeGetNext(child_node,null);
    }
	return text;
}

/*
    [rev1] Obtient une liste de tous les éléments enfants

    Retourne:
        [array] Liste des elements
*/
var _a_HTMLElement_getChildren = function(){
	return nodeGetChildren(
                this,
                function(child){return (child.nodeType==ELEMENT_NODE)?true:false;}
    );
}

/*
    [rev1] Obtient une liste des éléments enfants filtrés par nom de balise
    
    Parametres:
        [string] tagName  : Nom de balise
    Retourne:
        [array] Liste des elements
*/
var _a_HTMLElement_getChildrenByTagName = function(tagName){
    tagName = tagName.toLowerCase();
	return nodeGetChildren(
                this,
                function(child){return ((child.nodeType==ELEMENT_NODE) && (child.tagName.toLowerCase() == tagName))?true:false;}
    );
}

/*
    Obtient le prochain élément enfant

    Parametres:
        [string] tagName  : Nom de balise du prochain élément à retourner. Si null, retourne le premier élément venu
    Retourne:
        L'Objet trouve, null si introuvable.
    Revisions:
        [26-05-2010] La fonction accept la valeur 'null' pour le parametre 'tagName'.
        [05-08-2010] La fonction compare les noms de balises 'tagName' en minuscules et compare seulement les noeuds de type element.
*/
var _a_HTMLElement_getChild = function(tagName){
    return nodeGetChild(
        this,
        function(o){
            return ((o.nodeType==ELEMENT_NODE) && ((null == tagName) || (o.tagName.toLowerCase() == tagName.toLowerCase())))?true:false;
        }
    );
}
/*
    Obtient l'élément parent

    Parametres:
        [string] name  : Nom de balise du prochain élément à retourner. Si null retourne le premier élément venu
    Retourne:
        L'Objet trouve, null si introuvable.
*/
var _a_HTMLElement_getParent = function(tagName){
    return nodeGetParent(
        this,
        function(o){
            return ((o.nodeType==ELEMENT_NODE) && ((null == tagName) || (o.tagName.toLowerCase() == tagName.toLowerCase())))?true:false;
        }
    );
}

/*
    Retourne le premier élément enfant

    Retourne:
        L'Élément enfant, null si introuvable
*/
var _w3c_HTMLElement_getChildElement = function () {
    if (this.children && this.children.length)
        return this.children[0];
    return null;
}
var _a_HTMLElement_getChildElement = function () {
    if (this.all && this.all.length)
        return this.all[0];
    return null;
}

/*
    Retourne l'élément suivant

    Parametres:
        [string] tagName  : Nom de balise du prochain élément à retourner. Si null retourne le premier élément venu
    Retourne:
        L'Objet trouvé, null si introuvable.
    Revisions:
        [05-08-2010], La fonction compare les noms de balise 'tagName' en minuscule et compare seulement les noeuds de type element.
*/
var _a_HTMLElement_getNext = function(tagName) {
    return nodeGetNext(
        this,
        function(o){return ((o.nodeType==ELEMENT_NODE) && ((null == tagName) || (o.tagName.toLowerCase() == tagName.toLowerCase())))?true:false;}
    );
}

/*
    Retourne l'élément precedent

    Parametres:
        [string] tagName  : Nom de balise du prochain element a retourner, si null retourne le premier element venu
    Retourne:
        L'Objet trouve, null si introuvable.
*/
var _a_HTMLElement_getPrev = function(tagName) {
    return nodeGetPrev(
        this,
        function(o){return ((o.nodeType==ELEMENT_NODE) && ((null == tagName) || (o.tagName.toLowerCase() == tagName.toLowerCase())))?true:false;}
    );
}

/*
    Retourne la position relative d'un objet sur l'axe X

    Retourne:
        [int] Décalage vers la droite en pixels.
*/
var _a_HTMLElement_getX = function(){
	return parseInt(this.offsetLeft);
}

/*
    Retourne la position relative d'un objet sur l'axe Y

    Retourne:
        [int] Décalage vers le bas en pixels.
*/
var _a_HTMLElement_getY = function(){
	return parseInt(this.offsetTop);
}

/*
    Retourne la position absolue d'un element sur l'axe X

    Retourne:
        [int] Décalage vers la droite en pixels.
    Revisions:
        [21-04-2010], la fonction ne tronque plus les valeurs negative a zero.
        [24-04-2010], test les noms de balise en minuscule.
        [24-04-2010], supprime le point virgule apres l'instruction 'while'.
*/
var _a_HTMLElement_getAbsX = function(){
	var oCur=this;
	var iPos=document.body.offsetLeft;
	while(oCur.tagName.toLowerCase()!="body" && oCur.tagName.toLowerCase()!="html"){
		iPos+=oCur.offsetLeft;
		oCur=oCur.offsetParent;
	}
	return parseInt(iPos);
}

/*
    Retourne la position absolue d'un élément sur l'axe Y

    Retourne:
        [int] Décalage vers le bas en pixels.
    Revisions:
        [21-04-2010], la fonction ne tronque plus les valeurs negative a zero.
*/
var _a_HTMLElement_getAbsY = function(){
	var oCur = this;
    var iPos = document.body.offsetTop;
	while(oCur.tagName.toLowerCase()!="body" && oCur.tagName.toLowerCase()!="html"){
		iPos+=oCur.offsetTop;
		oCur = oCur.offsetParent;
	}
	return parseInt(iPos);
}

/*
    Retourne la largeur d'un élément en pixels

    Retourne:
        [int] Largeur en pixels.
    Revisions:
        [07-10-2010], si width n'est pas definit dans le style, getW utilise l'attribut 'clientWidth' pour obtenir la largeur
        [15-03-2011], utilise seulement l'attribut clientWidth pour obtenir la taille en pixels
        [02-06-2011], pour les images la propriete 'width' est utilise
*/
var _a_HTMLElement_getW = function()
{
    //image type
    if(this.tagName.toLowerCase()=="img"){
        return parseInt(this.width); 
    }
    //autres types
	return parseInt(this.clientWidth);
}

/*
    Retourne la hauteur d'un élément

    Retourne:
        [int] Hauteur en pixels.
    Revisions:
        [07-10-2010], si height n'est pas definit dans le style, getH utilise l'attribut 'clientHeight' pour obtenir la hauteur
        [15-03-2011], utilise seulement l'attribut clientWidth pour obtenir la taille en pixels
        [02-06-2011], pour les images la propriete 'width' est utilise
*/
var _a_HTMLElement_getH = function()
{
    //image type
    if(this.tagName.toLowerCase()=="img"){
        return parseInt(this.height); 
    }
    //autres types
	return parseInt(this.clientHeight);
}

/*
    Definit la largeur d'un élément
    
    Parametres:
        [int] width : Largeur en pixels.
    Retourne:
        [int] La nouvelle largeur en pixels.
    Revisions:
        [07-10-2010], si width est non specifie, setW restore la dimension de l'element par default et retourne la nouvelle largeur
        [07-10-2010], retourne la hauteur en entier et non en texte
        [02-06-2011], pour les images la propriete 'width' est utilise
*/
var _a_HTMLElement_setW = function(width)
{
    //restore la taille par defaut?
    if(width==null){
        this.style.width = "";
        return parseInt(this.clientWidth);//retourne la taille
    }
    //image?
    if(typeof(width)=="number" && this.tagName.toLowerCase()=="img"){
        this.width = width;
    }
    //autres?
    if(typeof(width)=="number"){
        this.style.width = width+"px";
    }
    return parseInt(this.clientWidth);
}

/*
    Definit la hauteur d'un element
    
    Parametres:
        [int] height : Hauteur en pixels.
    Retourne:
        [int] La nouvelle Hauteur en pixels.
    Revisions:
        [07-10-2010], si height est non specifie, setH restore la dimension de l'element par default et retourne la nouvelle hauteur
        [07-10-2010], retourne la hauteur en entier et non en texte
        [02-06-2011], pour les images la propriete 'width' est utilise
*/
var _a_HTMLElement_setH = function(height)
{
    //restore la taille par defaut?
    if(height==null){
        this.style.height = "";//restore la taille par defaut
        return parseInt(this.clientHeight);//retourne la taille
    }
    //image?
    if(typeof(height)=="number" && this.tagName.toLowerCase()=="img"){
        this.height = height;
    }
    //autres?
    if(typeof(height)=="number"){
        this.style.height = height+"px";
    }

    return parseInt(this.clientHeight);
}
/*
    Retourne la largeur original d'un élément en pixels

    Retourne:
        [int] La largeur original en pixels.
*/
var _w3c_HTMLElement_getOrgW = function()
{
    //place l'élément en premier plan avec sa taille automatique 
    var last_position = this.style.position;
    var last_width = this.style.width;
    this.style.position="absolute";
    this.style.width="auto";
    //sauvegarde la taille 
    var original_width = this.clientWidth;
    //restore la position original 
    this.style.width=last_width;
    this.style.position=last_position;
    return original_width;
}
/*
    Retourne la hauteur original d'un élément en pixels
    
    Retourne:
        [int] La hauteur original en pixels.
*/
var _w3c_HTMLElement_getOrgH = function()
{
    //place l'élément en premier plan avec sa taille automatique 
    var last_position = this.style.position;
    var last_height = this.style.height;
    this.style.position="absolute";
    this.style.height="auto";
    //sauvegarde la taille 
    var original_height = this.clientHeight;
    //restore la position original 
    this.style.height=last_height;
    this.style.position=last_position;
    return original_height;
}
/*
    Définit la position absolue X et Y d'un élément en pixels
    
    Parametres:
        [int] x : Position X.
        [int] y : Position Y.
    Retourne:
        [void] rien.
*/
var _a_HTMLElement_setAbsXY = function(x,y){
	var oCur=objGetParent(this);
	var xOfs=document.body.offsetLeft;
	var yOfs=document.body.offsetTop;
	while(oCur.tagName.toLowerCase()!="body" && oCur.tagName.toLowerCase()!="html"){
		xOfs+=oCur.offsetLeft;
		yOfs+=oCur.offsetTop;
		oCur=oCur.offsetParent;
	}
	x = parseInt(x)-parseInt(xOfs);
	y = parseInt(y)-parseInt(yOfs);

    // assigne la nouvelle position a l'objet
	this.style.left = x + "px";
	this.style.top  = y + "px";
	
	/*this.offsetLeft = x;
	this.offsetTop = y;*/
}
/*
    Definit la position relative X et Y d'un élément en pixels 
    
    Parametres:
        [int] x : Position X.
        [int] y : Position Y.
    Retourne:
        [void].
    Remarques:
        La position est relative ou absolue suivant le style 'position' de l'élément.
*/
var _a_HTMLElement_setXY = function(x,y){
  //  x = parseInt(x);
    //  y = parseInt(y);
   /*var rx=0;
    var ry=0;

    //offset de la zone cliente du document
	if(self.pageYOffset) {
		rX = self.pageXOffset;
		rY = self.pageYOffset;
	}
	else if(document.documentElement && document.documentElement.scrollTop) {
		rX = document.documentElement.scrollLeft;
		rY = document.documentElement.scrollTop;
	}
	else if(document.body) {
		rX = document.body.scrollLeft;
		rY = document.body.scrollTop;
    }

    // ajoute l'offet a la position donné (I.E seulement)
	if(document.all) {
		x += rX; 
		y += rY;
	}*/

    // assigne la nouvelle position a l'objet
	this.style.left = x + "px";
	this.style.top  = y + "px";
	
	/*this.offsetLeft = x;
	this.offsetTop = y;*/
}

/*
    Definit le rectangle d'un element 
    
    Parametres:
        [int] x : Position X en pixels.
        [int] y : Position Y en pixels.
        [int] w : Largeur en pixels.
        [int] h : Hauteur en pixels.
    Retourne:
        [void].
    Remarques:
        La fonction appelle successivement les fonctions objSetXY, objSetH et objSetW.
*/
var _a_HTMLElement_setRect = function(x,y,w,h){
    objSetXY(this,x,y);
    objSetH(this,h);
    objSetW(this,w);
}

/*
    Obtient le rectangle d'un element 
    
    Retourne:
        [object] Rectangle de l'element.
*/
var _a_HTMLElement_getRect = function(){
    return {
        left:objGetX(this),
        top:objGetY(this),
        right:objGetX(this)+objGetW(this),
        bottom:objGetY(this)+objGetH(this),
        width:objGetW(this),
        height:objGetH(this)
    };
}

/*
    Obtient un élément enfant depuis son chemin d'accès strict

    Parametres:
        [string] path : Chemin d'accès relatif au noeud, séparé par des slashs ex:"div/ul/li".
    Retourne:
        [HTMLElement] Le noeud trouvé, null si introuvable.
*/
var _w3cHTMLElement_getNode = function(path) {
	//explose le chemin d'acces en un tableau
    path = path.toLowerCase();
    if(path.substr(0,1)=="/")//ne prend pas en compte le premier séparateur (évite la création d'un élément vide)
        path=path.substr(1);
	var path_ar = path.split('/');

	//cherche dans l'arboresence
	var cur = this;
	for (var i = 0; i < path_ar.length; i++) {
//	    wfw.puts('find for ('+path_ar[i]+') in: ' + cur.tagName);
	    cur = objGetChildrenByTagName(cur,path_ar[i]);
	    if (cur.length == 0) {
//	        wfw.puts("objGetNode: can't find node: '"+path_ar[i]+"' from path: "+path);
	        return null;
	    }

        //choisi le premier element dans l'ordre hierarchique, pour continuer la recherche
        cur = cur[0];
	}
	return cur;
}

/*
    Insert un élément

    Parametres:
        [HTMLElement] parent   : Future parent de l'élément à insérer.
        [HTMLElement] ref      : L'élément de référence, enfant de 'parent'. null, si INSERTNODE_END ou INSERTNODE_BEGIN est spécifié.
        [int]         position : Position de l'insertion ( voir Remarques ).
    Retourne:
        [HTMLElement] Le noeud inséré, null en cas d'échec.
*/
var INSERTNODE_AFTER  = 1; // 'ref' utiliser
var INSERTNODE_BEFORE = 2; // 'ref' utiliser
var INSERTNODE_BEGIN  = 3; // 'ref' null
var INSERTNODE_END    = 4; // 'ref' null
var INSERTNODE_REPLACE= 5; // 'ref' utiliser

var _w3c_HTMLElement_insertNode = function(parent,ref,position)
{
    switch(position){
        //
        // Apres la reference ('ref' utiliser)
        //
        case INSERTNODE_AFTER:
            if(!ref)
                return null;
            // si ref a un element frere, insert avant
            if (ref.nextSibling) {  
                return parent.insertBefore(this, ref.nextSibling); 
            }
            // sinon insert a la fin du parent 
            return parent.appendChild(this);
        //
        // Avant la reference ('ref' utiliser)
        //
        case INSERTNODE_BEFORE:
            if(!ref)
                return null;
            return parent.insertBefore(this, ref); 
        //
        // A la fin du parent ('ref' = null)
        //
        case INSERTNODE_END:
            return parent.appendChild(this); 
        //
        // Au debut du parent ('ref' = null)
        //
        case INSERTNODE_BEGIN:
            var firstchild = objGetChildElement(parent);
            // si le parent a un premier enfant, insert avant celui ci
            if(firstchild)
                return parent.insertBefore(this, firstchild); 
            // sinon insert a la fin du parent 
            return parent.appendChild(this);
        //
        // A la place de la reference ('ref' utiliser)
        //
        case INSERTNODE_REPLACE:
            if(!ref)
                return null;
            //ajoute avant la reference
            var new_node = parent.insertBefore(this, ref);
            //supprime la reference
            parent.removeChild(ref);
            return new_node;
    }
    return null;
} 

/*
    Supprime un ou plusieurs des éléments enfants

    Parametres:
        [HTMLElement] ref      : L'Elément de référence, null si REMOVENODE_FIRST, REMOVENODE_LAST ou REMOVENODE_ALL est utilisé.
        [int]         position : Position du noeud à supprimer ( voir Remarques ).
    Retourne:
        [HTMLElement] true, null en cas d'échec.
*/
var REMOVENODE_FIRST = 1;//Supprime le premier enfant du parent
var REMOVENODE_LAST  = 2;//Supprime le dernier enfant du parent
var REMOVENODE_ALL   = 3;//Supprime tout les enfants du parent
var REMOVENODE_AFTER  = 4;//Supprime l'élément suivant la référence
var REMOVENODE_BEFORE  = 5;//Supprime l'élément précédent la référence
var REMOVENODE_ALL_AFTER  = 6;//Supprime tous les éléments suivant la référence
var REMOVENODE_ALL_BEFORE  = 7;//Supprime tous les éléments précédent la référence
var REMOVENODE_REF = 8;//Supprime la référence

var _w3c_HTMLElement_removeChildNode = function(ref,position)
{
    var first = (ref==null) ? objGetChild(this,null) : ref;
    var next;
    
    switch(position){
        //
        // le premier enfant ('ref' = null)
        //
        case REMOVENODE_FIRST:
            first = objGetChild(this,null);
            if(first!=null)
                this.removeChild(first);
            return true;
        //
        // le dernier enfant ('ref' = null)
        //
        case REMOVENODE_LAST:
            var cur = objGetChild(this,null);
            while((next=objGetNext(cur,null))!=null)
                cur=next;
            if(cur!=null)
                this.removeChild(cur);
            return true;
        //
        // tout les enfants ('ref' = null)
        //
        case REMOVENODE_ALL:
            while((next=objGetChild(this,null))!=null)
                this.removeChild(next);
            return true;
        //
        // Apres la reference ('ref' utiliser)
        //
        case REMOVENODE_AFTER:
            if(!ref)
                return null;
            next = objGetNext(ref,null);
            if (next!=null) {  
                this.removeChild(next);
            }
            return true;
        //
        // Avant la reference ('ref' utiliser)
        //
        case REMOVENODE_BEFORE:
            if(!ref)
                return null;
            var prev = objGetPrev(ref,null);
            if (prev!=null) {  
                this.removeChild(prev);
            }
            return true;
        //
        // Apres la reference ('ref' utiliser)
        //
        case REMOVENODE_ALL_AFTER:
            if(!ref)
                return null;
            while((next=objGetNext(ref,null))!=null) {  
                this.removeChild(next);
            }
            return true;
        //
        // Avant la reference ('ref' utiliser)
        //
        case REMOVENODE_ALL_BEFORE:
            if(!ref)
                return null;
            while((next=objGetPrev(ref,null))!=null) {  
                this.removeChild(next);
            }
            return true;
        //
        // Avant la reference ('ref' utiliser)
        //
        case REMOVENODE_REF:
            if(!ref)
                return null;
            this.removeChild(ref);
            return true;
    }
    return null;
} 

/*
--------------------------------------------------------------------------------------------------------------------------------------
    Node Section
--------------------------------------------------------------------------------------------------------------------------------------
*/

/*
    Insert un nouveau noeud apres un noeud de reference

    Parametres:
        [Node] node    : Le noeud de référence.
    Retourne:
        [HTMLElement] Le noeud inséré.
*/
var _w3c_Node_insertAfter = function(ref) {
    var parent = ref.parentNode;
    if(!parent)
        return;
    if(ref.nextSibling) {
	return parent.insertBefore(this, ref.nextSibling);
    }
    return parent.appendChild(this);
}

/*
    Obtient la valeur d'un noeud

    Parametres:
        [string] def    : Valeur retourné par défaut si le texte est vide.
    Retourne:
        [string] Text du noeud.
    Remarques:
        La valeur d'un noeud est le texte contenu entre la balise ouvrante et la balise fermante, aucunes partie de la syntaxe XML est retourné
*/
var _w3c_Node_getValue = function(def) {
    var text = this.nodeValue;
    return ((text=="") && (typeof(def)=='string'))?def:text;
}
var _a_Node_getValue = function(def) {
    var text = this.textContent;
    return ((text=="") && (typeof(def)=='string'))?def:text;
}
var _b_Node_getValue = function(def) {
    var text = this.innerText;
    return ((text=="") && (typeof(def)=='string'))?def:text;
}
var _c_Node_getValue = function(def) {
    var text = this.text;
    return ((text=="") && (typeof(def)=='string'))?def:text;
}

/*
    Retourne le premier noeud enfant

    Retourne:
        [Node] Noeud trouve, null si aucun.
*/
var _w3c_Node_getChildNode = function () {
    return this.firstChild;
}
var _a_Node_getChildNode = function () {
    if (this.childNodes && this.childNodes.length)
        return this.childNodes[0];
    return null;
}

/*
    Recherche un noeud enfant de l'element
    
    Parametres:
        [function] filterFunc : Fonction de filtrage, si null le prochain noeud enfant est renvoyé (équivalent à nodeGetChildNode).
    Retourne:
        [Node] Noeud trouvé, null si aucun.
    Remarque:
        La fonction cherche uniquement dans les enfants directe de l'element
        filterFunc prend la forme : bool filterFunc(node).
        La fonction s'arrête lorsque filterFunc retourne true ou si la fin de la recherche est atteinte.
*/
var _w3c_Node_getChild = function (filterFunc){
    var next = nodeGetChildNode(this);

    if(typeof(filterFunc) != 'function'){
 //       wfw.puts('use without filterFunc: '+typeof(filterFunc));
        filterFunc=function(children){return true;} // retourne le premier venu
    }

	while(next!=null){
        if(filterFunc(next)==true){
  //          wfw.puts('getChild node, '+typeof(next)+' tag('+next.tagName+') type('+next.nodeType+')');
    		return next;
        }
        next = next.nextSibling;
	}
	return null;
}

/*
    Retourne le prochain noeud parent
    
    Parametres:
        [function] filterFunc : Fonction de filtrage, si null le prochain noeud parent est renvoye.
    Retourne:
        [Node] Noeud trouve, null si aucun.
    Remarque:
        filterFunc prend la forme : bool filterFunc(node).
        La fonction s'arrête lorsque filterFunc retourne true ou si la fin de la recherche est atteinte.
*/
var _w3c_Node_getParent = function (filterFunc){
    var next = this.parentNode;

    if(typeof(filterFunc) != 'function'){
//        wfw.puts('use without filterFunc: '+typeof(filterFunc));
        filterFunc=function(parent){return true;} // retourne le premier venu
    }

	while(next!=null){
        if(filterFunc(next)==true){
//            wfw.puts('getParent node, '+typeof(next)+' tag('+next.tagName+') type('+next.nodeType+')');
    		return next;
        }
        next = next.parentNode;
	}
	return null;
}

/*
    Obtient une liste des noeuds enfants
    
    Parametres:
        [function] filterFunc : Fonction de filtrage, si null tout les noeuds sont acceptes.
    Retourne:
        [array] Liste des noeuds trouvés, vide si aucun.
    Remarque:
        filterFunc prend la forme : bool filterFunc(node).
        La fonction ajoute le noeud à la liste lorsque filterFunc retourne true, sinon il est ignoré.
*/
var _w3c_Node_getChildren = function (filterFunc){
	var ar = [];
	var child = nodeGetChildNode(this);

    if(typeof(filterFunc) != 'function')
        filterFunc=function(children){return true;}

	while(child!=null)
    {
        if(filterFunc(child)==true)
    		ar.push(child);
        child = nodeGetNext(child);
	}
	return ar;
}

/*
    Obtient le prochain noeud
    
    Parametres:
        [function] filterFunc : Fonction de filtrage, si null le prochain noeud est renvoye.
    Retourne:
        [Node] Noeud trouve, null si aucun.
    Remarque:
        La fonction s'arrête lorsque filterFunc retourne true ou lorsque la fin de la recherche est atteinte.
*/
var _w3c_Node_getNext = function (filterFunc){
	var next = this.nextSibling;

    if(typeof(filterFunc) != 'function')
        filterFunc=function(children){return true;}

	while(next!=null){
        if(filterFunc(next)==true)
    		return next;
        next = next.nextSibling;
	}
	return null;
}

/*
    Obtient le noeud precedent
    
    Parametres:
        [function] filterFunc : Fonction de filtrage, si null le prochain noeud est renvoye.
    Retourne:
        [Node] Noeud trouve, null si aucun.
    Remarque:
        La fonction s'arrête lorsque filterFunc retourne true ou lorsque la fin de la recherche est atteinte.
*/
var _w3c_Node_getPrev = function (filterFunc){
	var next = this.previousSibling;

    if(typeof(filterFunc) != 'function')
        filterFunc=function(children){return true;}

	while(next!=null){
        if(filterFunc(next)==true)
    		return next;
        next = next.previousSibling;
	}
	return null;
}

/*
    Obtient une liste des noeuds suivants
    
    Parametres:
        [function] filterFunc : Fonction de filtrage, si null tout les noeuds sont acceptes.
    Retourne:
        [array] List des noeud trouve, vide si aucun.
    Remarque:
        La fonction ajoute le noeud a la liste lorsque filterFunc retourne true, sinon il est ignore.
*/
var _w3c_Node_getNexts = function (filterFunc){
	var ar = [];
	var next = this.nextSibling;

    if(typeof(filterFunc) != 'function')
        filterFunc=function(children){return true;}

	while(next!=null){
        if(filterFunc(next)==true)
    		ar.push(next);
        next = next.nextSibling;
	}
	return ar;
}

/*
    Enumere tout les noeuds enfants
    
    Parametres:
        [function] callback : Fonction de rappel.
        [bool]     bNext    : Poursuivre l'enumeration aux noeuds suivant ?
        [bool]     param    : Parametre a passer au callback
    Retourne:
        [value] true si la fonction se termine normalement, sinon la valeur de callback est retourne si elle est differente de true.
    Argument callback:
        La fonction de rappel 'callback' prend la forme suivante: result callback(node, cond, param)
        L'énumération continue tant que callback retourne true. Si la valeur diffère, enumNodes retourne le résultat.
        Si "condition.ignore_child=1", enumNodes ignore le scan des elements enfants pour le noeud en cours (node).
    Revisions:
        [20/09/10], Resolution bug, double appel a nodeEnumNodes et mauvaise interpretation du resultat pour nodeGetChildNode
*/
var _w3c_Node_enumNodes = function(callback,bNext,param)
{
    var result = true;
    var node = this;
    var cond;
    if(typeof(bNext)=="undefined")
        bNext = true;
    while(node){
        cond = {};
        if ((result = callback(node, cond, param)) !== true)
            return result;
        var child = nodeGetChildNode(node);
        if(child != null && (typeof(cond["ignore_child"])=="undefined")){
            result = nodeEnumNodes(child,callback,true,param);
            if(result !== true)
                return result;
        }
        if(bNext==true)
            node = node.nextSibling;
        else
            node = null;
    }
	return result;
}
/*
    Clone un noeud
    
    Parametres:
        [bool] depth : Si true, clone les éléments enfants.
    Retourne:
        [Node] Nouveau noeud cloné.
*/
var _w3c_Node_cloneNode = function(depth)
{
    return this.cloneNode(depth);
}

/*
    Supprime un noeud
    
    Retourne:
        [bool] true.
*/
var _w3c_Node_removeNode = function()
{
    if(this.parentNode)
        this.parentNode.removeChild(this);
    return true;
}

/*
    Obtient le contenu HTML d'un noeud
    
    Retourne:
        [string] contenu.
*/
var _a_Node_getInnerHTML = function(depth)
{
    var node_text = "";
    var node_childs = nodeGetChildren(this);
    var node;
    var i,x;
    for(i=0; i<node_childs.length; i++)
    {
        node = node_childs[i];
        switch (node.nodeType)
        {
            case XML_ELEMENT_NODE:
                var nodeName = node.nodeName.toLowerCase();

                // la balise
                node_text += "<"+nodeName;

                // insert les attributs
                if(node.attributes)
                {
                    for(x=0; x<node.attributes.length; x++) 
                    {
                        node_text += " "+node.attributes[x].nodeName+'="'+node.getAttribute(node.attributes[x].nodeName)+'"';
                    }
                }
                //fin de balise
                node_text += ">";

                // insert les noeuds enfants
                if(depth)
                    node_text += nodeGetInnerHTML(node,depth);

                //balise de fermeture
                node_text += "</"+nodeName+">";
                
                break;

            case XML_TEXT_NODE:
            case XML_CDATA_SECTION_NODE:
            case XML_COMMENT_NODE:
                node_text += objGetInnerText(node);
                break;

            default:
                wfw.puts("_a_Node_getInnerHTML: ignored node "+node.nodeType);
                break;
	    }
    }
    return node_text;
}

/*
    Supprime un ou plusieurs des éléments enfants

    Parametres:
        [HTMLElement] ref      : L'Elément de référence, null si REMOVENODE_FIRST, REMOVENODE_LAST ou REMOVENODE_ALL est utilisé.
        [int]         position : Position du noeud à supprimer ( voir Remarques ).
    Retourne:
        [HTMLElement] true, null en cas d'échec.
*/

var REMOVENODE_FIRST = 1;//Supprime le premier enfant du parent
var REMOVENODE_LAST  = 2;//Supprime le dernier enfant du parent
var REMOVENODE_ALL   = 3;//Supprime tout les enfants du parent
var REMOVENODE_AFTER  = 4;//Supprime l'élément suivant la référence
var REMOVENODE_BEFORE  = 5;//Supprime l'élément précédent la référence
var REMOVENODE_ALL_AFTER  = 6;//Supprime tous les éléments suivant la référence
var REMOVENODE_ALL_BEFORE  = 7;//Supprime tous les éléments précédent la référence
var REMOVENODE_REF = 8;//Supprime la référence

var _a_Node_removeChildNode = function(ref,position)
{
    var first = (ref==null) ? nodeGetChild(this,null) : ref;
    var next;
    switch(position){
        //
        // le premier enfant ('ref' = null)
        //
        case REMOVENODE_FIRST:
            first = nodeGetChild(this,null);
            if(first!=null)
                this.removeChild(first);
            return true;
        //
        // le dernier enfant ('ref' = null)
        //
        case REMOVENODE_LAST:
            var cur = nodeGetChild(this,null);
            while((next=nodeGetNext(cur,null))!=null)
                cur=next;
            if(cur!=null)
                this.removeChild(cur);
            return true;
        //
        // tout les enfants ('ref' = null)
        //
        case REMOVENODE_ALL:
            while((next=nodeGetChild(this,null))!=null)
                this.removeChild(next);
            return true;
        //
        // Apres la reference ('ref' utiliser)
        //
        case REMOVENODE_AFTER:
            if(!ref)
                return null;
            next = nodeGetNext(ref,null);
            if (next!=null) {  
                this.removeChild(next);
            }
            return true;
        //
        // Avant la reference ('ref' utiliser)
        //
        case REMOVENODE_BEFORE:
            if(!ref)
                return null;
            var prev = nodeGetPrev(ref,null);
            if (prev!=null) {  
                this.removeChild(prev);
            }
            return true;
        //
        // Apres la reference ('ref' utiliser)
        //
        case REMOVENODE_ALL_AFTER:
            if(!ref)
                return null;
            
            while((next=nodeGetNext(ref,null))!=null) {  
                this.removeChild(next);
            }
            return true;
        //
        // Avant la reference ('ref' utiliser)
        //
        case REMOVENODE_ALL_BEFORE:
            if(!ref)
                return null;
            
            while((next=nodeGetPrev(ref,null))!=null) {  
                this.removeChild(next);
            }
            return true;
        //
        // Avant la reference ('ref' utiliser)
        //
        case REMOVENODE_REF:
            if(!ref)
                return null;
            this.removeChild(ref);
            return true;
    }
    return null;
}

/*
Obtient le document associé à un noeud

Retourne:
[DOMDocument] Objet du document.
*/
var _w3c_Node_getDocument = function () {
    return this.ownerDocument;
}

/*
--------------------------------------------------------------------------------------------------------------------------------------
    HTMLDocument Section
--------------------------------------------------------------------------------------------------------------------------------------
*/

/*
    Obtient un élément du document spécifié
    
    Parametres:
        [string] id : Identificateur de l'élément.
    Retourne:
        [HTMLElement] L'Élément trouvé, null si introuvable.
*/
var _w3c_HTMLDocument_getElement = function(id){
    return this.getElementById(id);
}
var _a_HTMLDocument_getElement = function(id){
    if(typeof(this.embeds[id]) != 'undefined')
        return this.embeds[id];
	return null;
}
var _b_HTMLDocument_getElement = function(id){
    if(typeof(this[id]) != 'undefined')
        return this[id];
	return null;
}


/*
    Obtient une liste d'éléments par leurs noms de balises
    
    Parametres:
        [string] tagName : Nom de balise des éléments à rechercher.
    Retourne:
        [array] Liste des éléments trouvés. Vide, si aucun.
*/
var _w3c_HTMLDocument_getElements = function(tagName){
	return this.getElementsByTagName(tagName);
}
var _a_HTMLDocument_getElements = function(tagName){
	var objs = new Array();
	var oList = this.all;
	//recherche
	for(var i=0;i<oList.length;i++){
		if(oList[i].tagName.toLowerCase() == tagName.toLowerCase()){
			objs.push(oList[i]);
		}
	}
	return objs;
}
var _b_HTMLDocument_getElements = function(tagName){
	var objs = new Array();
	var oList = this.layers;
	//recherche
	for(var i=0;i<oList.length;i++){
		if(oList[i].tagName.toLowerCase() == tagName.toLowerCase()){
			objs.push(oList[i]);
		}
	}
	return objs;
}

/*
    Obtient une liste d'éléments nommés
    
    Parametres:
        [string] name : Nom d'élément.
    Retourne:
        [array] Liste des éléments trouvés. Vide, si aucun.
*/
var _w3c_HTMLDocument_getNamedElements = function(name){
	return this.getElementsByName(name);
}
var _a_HTMLDocument_getNamedElements = function(name){
	var objs = new Array();
	var oList = this.all;
	//recherche
	for(var i=0;i<oList.length;i++){
        var find_name=objGetAtt(oList[i],"name");
		if((find_name!=null) && (find_name.toLowerCase() == name.toLowerCase())){
			objs.push(oList[i]);
		}
	}
	return objs;
}
var _b_HTMLDocument_getNamedElements = function(name){
	var objs = new Array();
	var oList = this.layers;
	//recherche
	for(var i=0;i<oList.length;i++){
            var find_name=objGetAtt(oList[i],"name");
            if((find_name!=null) && (find_name.toLowerCase() == name.toLowerCase())){
                objs.push(oList[i]);
            }
	}
	return objs;
}

/*
    Obtient l'élément racine du document
    
    Retourne:
        [HTMLElement] L'Element, null si introuvable.
*/
var _w3c_HTMLDocument_getRootElement = function() {
    //wfw.puts("docGetRootElement: "+this);
    return this.documentElement;
}

/*
    Importe un noeud dans le document en cours
    
    Retourne:
        [Node] Le noeud inséré.
*/
var _w3c_HTMLDocument_importNode = function(node, allChildren)
{
    return this.importNode(node, allChildren);
}

var _a_HTMLDocument_importNode = function(node, allChildren)
{
    /* find the node type to import */
    switch (node.nodeType)
    {
        case XML_ELEMENT_NODE:
            /* cree l'element */
            var newNode = this.createElement(node.nodeName);
            var i;
               
            /* insert les attributs */
            if(node.attributes)
            {
                for(i=0; i<node.attributes.length; i++) 
                {
                    objSetAtt(newNode,node.attributes[i].nodeName, node.getAttribute(node.attributes[i].nodeName));
                }
            }

            /* insert les noeuds enfants */
            var childs = nodeGetChildren(node);
            for(i=0; i<childs.length; i++)
            {
                var insert = docImportNode(this,childs[i], allChildren);
                if(insert!=null)
                    objInsertNode(insert,newNode,null,INSERTNODE_END);
            }

            return newNode;

        case XML_TEXT_NODE:
        case XML_CDATA_SECTION_NODE:
        case XML_COMMENT_NODE:
            return this.createTextNode(objGetInnerText(node));

        default:
            wfw.puts("ignored node "+node.nodeType);
            return null;
	}
}

/*
    Obtient un noeud depuis son chemin d'accès strict
    
    Parametres:
        [string] path : Chemin d'accès au noeud ex:"html/body/div".
    Retourne:
        [HTMLElement] L'Element, null si introuvable.
    Revisions:
        [rev.1.1] 05/08/2010, la fonction compare les noms de balises 'tagName' en minuscules.
*/
var _w3c_HTMLDocument_getNode = function(path) {
    var rootElement = docGetRootElement(this);

	//verifie l'existance d'un premier noeud
	if (typeof(rootElement) != "object"){
        wfw.puts("docGetRootElement is empty: "+rootElement);
	    return null;
    }
	//explose le chemin d'acces en un tableau
    path = path.toLowerCase();
    if(path.substr(0,1)=="/")//ne prend pas en compte le premier séparateur (évite la créeation d'un élément vide)
        path=path.substr(1);
	var path_ar = path.split('/');

    //compare le premier noeud
    // [correctif a placer] (le premier noeud doit etre de type Element sinon la fonction echoue)
	if(path_ar[0] != rootElement.tagName.toLowerCase()) {
	    wfw.puts("invalid first node: ('"+path_ar[0]+"' != '"+rootElement.tagName+"')");
	    return null;
	}
	//cherche dans l'arboresence
	var cur = rootElement;
	for (var i = 1; i < path_ar.length; i++) {
//	    wfw.puts('find for ('+path_ar[i]+') in: ' + cur.tagName);
	    cur = objGetChildrenByTagName(cur,path_ar[i]);
	    if (cur.length == 0) {
//	        wfw.puts("can't find node: " + path_ar[i]);
	        return null;
	    }

        //choisi le premier element dans l'ordre hierarchique, pour continuer la recherche
        cur = cur[0];
	}
	return cur;
}

/*
    Obtient la largeur du client
    
    Retourne:
        [int] Largeur (dans l'unité définit).
*/
var _a_HTMLDocument_getClientW = function() {
    return parseInt(this.body.clientWidth);
}

/*
    Obtient la hauteur du client
    
    Retourne:
        [int] Hauteur (dans l'unité définit).
*/
var _a_HTMLDocument_getClientH = function() {
    return parseInt(this.body.clientHeight);
}

/*
    Obtient la largeur du corps du document
    
    Retourne:
        [int] Largeur (dans l'unité définit).
*/
var _a_HTMLDocument_getBodyW = function() {
    return parseInt(this.body.style.width);
}

/*
    Obtient la hauteur du corps du document
    
    Retourne:
        [int] Hauteur (dans l'unité définit).
*/
var _a_HTMLDocument_getBodyH = function() {
    return parseInt(this.body.style.height);
}

/*
    Definit la valeur d'un cookie
    
    Parametres:
        [string] name  : Nom du cookie.
        [string] value : Valeur du cookie.
    Retourne:
        [bool] true.
*/
var _a_HTMLDocument_setCookie = function (name, value, lifeTimeInDay) {
    var expire = "";
    lifeTimeInDay = parseInt(lifeTimeInDay);
    if (!isNaN(lifeTimeInDay)) {
        var date = new Date();
        date.setDate(date.getDate() + lifeTimeInDay);
        expire = "expires=" + date.toUTCString();
    }
    this.cookie = name + "=" + escape(value) + ";" + expire;
    return true;
}

/*
    Obtient la valeur d'un cookie
    
    Parametres:
        [string] name  : Nom du cookie.
    Retourne:
        [string] Valeur du cookie, null si inexistant.
*/
var _a_HTMLDocument_getCookie = function(name){
	var aCookie = this.cookie.split("; ");
	for (var i=0; i < aCookie.length; i++)
	{
		var aCrumb = aCookie[i].split("=");
		if(name == aCrumb[0]) 
			return unescape(aCrumb[1]);
	}

	return null;
}

/*
    Supprime un cookie
    
    Parametres:
        [string] name  : Nom du cookie.
    Retourne:
        [bool] true.
*/
var _a_HTMLDocument_delCookie = function(name){
    this.cookie = name + "=" + "; expires=Fri, 31 Dec 1970 23:59:59 GMT;";
    return true;
}

/*
    Definit une regle de style CSS
    
    Parametres:
        [StyleSheets] file : Objet styleSheets retourne par docGetCSSFile.
        [string] selector  : Sélecteur CSS.
        [string] rules     : Regles CSS.
    Retourne:
        [bool] true.
*/
var _a_HTMLDocument_setCSSRule = function(file,selector,rules){
    file.insertRule(selector+' { '+rules+' }',file.cssRules.length);
    return true;
}
var _b_HTMLDocument_setCSSRule = function(file,selector,rules){
    file.addRule(selector,rules,-1);
    return true;
}

/*
    Obtient une regle de style CSS
    
    Parametres:
        [StyleSheets] file : Objet styleSheets retourne par docGetCSSFile.
        [string] selector  : Sélecteur CSS.
    Retourne:
        [StyleRules] Objet StyleRules, null si introuvable.
*/
var _a_HTMLDocument_getCSSRule = function(file,selector){
//    alert("find for:"+selector);
    for(var i=0;i<file.rules.length;i++){
        var rule = file.rules[i];
//        alert("find in:"+rule.selectorText);
        if(typeof(rule.selectorText) && (rule.selectorText == selector)){
            return rule;
        }
    }
    return null;
}

var _b_HTMLDocument_getCSSRule = function(file,selector){
//    alert("find for:"+selector);
    for(var i=0;i<file.rules.length;i++){
        var rule = file.cssRules[i];
//        alert("find in:"+rule.selectorText);
        if(typeof(rule.selectorText) && (rule.selectorText == selector)){
            return rule;
        }
    }
    return null;
}

/*
    Obtient un fichier de style
    
    Parametres:
        [string] filename  : Nom du fichier CSS a rechercher.
    Retourne:
        [StyleSheets] Objet StyleSheets, null si introuvable.
*/
var _a_HTMLDocument_getCSSFile = function(file_name){
    file_name = filename(file_name).toLowerCase();
//    alert("find for:"+file_name);
    for(var i=0;i<document.styleSheets.length;i++){
        var styles = document.styleSheets[i];
//        alert("find in:"+filename(styles.href)+" ("+styles.href);
        if(typeof(styles.href) && (filename(styles.href).toLowerCase() == file_name)){
            return styles;
        }
    }
    return null;
}

/*
--------------------------------------------------------------------------------------------------------------------------------------
    Window Section
--------------------------------------------------------------------------------------------------------------------------------------
*/

/*
    Obtient l'URL de la fenetre

    Retourne:
        [string] l'URL complete
    Revisions:
        [25-10-2010] retourne l'adresse 'this.location.href' de type string plutot que 'this.location' de type objet.
*/
var _w3c_Window_getURL = function() {
    return this.location.href;
}


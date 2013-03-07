/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        Author: AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    XML Site file

    JS  Dependences: base.js
    YUI Dependences: base, node, wfw, wfw-http, wfw-request

    Implementation: [19-10-2012]
*/

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

YUI.add('wfw-xml', function (Y) {
    var wfw = Y.namespace('wfw');

    wfw.Xml = {
        DEFAULT_FILE : function()
        {
            //OBJECT
            this.ns      = "wfw_xml_default_file";
            //le document "default.xml"
            this.doc     = null; // xml document interface
            this.docRoot = null; // root element
            
            /*
             * Constructeur
             */
        },
        /*
            Convertie un document XML en tableau associatif
            Parametres:
                    [object] obj     : Tableau associatif des arguments 
                    [bool]   bencode : true si le texte "text" est encodé au format d'une URI
            Retourne:
                    [string] Texte au format XARG
        */
        nodeToArray : function(xml_element)
        {
            var ar = {};
            xml_element.all("> *").each(function(node){
                ar[node.get("tagName")] = node.get("text");
            });
            return ar;
        }
    };
    
    /*-----------------------------------------------------------------------------------------------------------------------
    * DEFAULT_FILE Class Implementation
    *-----------------------------------------------------------------------------------------------------------------------*/

    wfw.Xml.DEFAULT_FILE.prototype.Initialise = function(doc)
    {
        //Initialise les membres
        this.doc = null;

        //charge le document
        if(typeof(doc)=="string")
        {
            wfw.HTTP.get(doc);

            //TODO: Use HTTP.getReadyState() function in future
            if((wfw.HTTP.httpRequest.readyState == wfw.Request.READYSTATE_DONE) && (wfw.HTTP.httpRequest.status == 200))
                this.doc = xml_parse(wfw.HTTP.getResponse());
            else
                this.post("Initialise","can't load file "+doc+" : state="+wfw.HTTP.httpRequest.readyState+"/"+wfw.HTTP.httpRequest.status);
        }
        else
            this.doc = doc;

        if(this.doc == null){
            this.post("Initialise","failed load doc file");
            return false;
        }
        
        this.docRoot = Y.Node(this.doc.documentElement);

        return true;
    };

    /*
    Obtient un noeud de l'index des modules (obselete, utiliser getConfigNode)
    Arguments:
        [string] id   : identificateur du module. Si null, retourne le premier noeud 
    Retourne:
        [XMLElement] Noeud trouve, null si introuvable
    */
    wfw.Xml.DEFAULT_FILE.prototype.getModuleConfigNode = function(id)
    {
        return this.getConfigNode("module",id);
    };

    /*
    Obtient un noeud de la configuration
    Arguments:
            [string] type : nom de balise de l'élément enfant
            [string] id   : identificateur du module. Si null, retourne le premier noeud 
    Retourne:
        [XMLElement] Noeud trouve, null si introuvable
    */
    wfw.Xml.DEFAULT_FILE.prototype.getConfigNode = function(type,id)
    {
        //premier noeud ?
        if(id==null)
            return this.docRoot.one('> config > '+type);

        return this.docRoot.one('> config > '+type+'[id="'+id+'"]');
    };

    /*
    Obtient la valeur d'un noeud
    Arguments:
        [string] nodeName : nom du noeud (nom de balise)
    Retourne:
        [string] Text du noeud trouve. Une chaine vide est retourné si le noeud est introuvable
    */
    wfw.Xml.DEFAULT_FILE.prototype.getValue = function(nodeName)
    {
        var node = this.docRoot.one('> '+nodeName);
        //recherche
        if(node)
            return node.get("text");
        
        return "";
    };

    /*
    Obtient la valeur d'un noeud de l'index
    Arguments:
        [string] type : type de noeud (nom de balise)
        [string] id   : identificateur
    Retourne:
        [string] Text du noeud trouve. Une chaine vide est retourné si le noeud est introuvable
    */
    wfw.Xml.DEFAULT_FILE.prototype.getIndexValue = function(type,id)
    {
        //recherche
        var node = this.getIndexNode(type,id);
        if(node)
            return node.get("text");
        
        return "";
    };

    /*
    Obtient un noeud de l'index
    Arguments:
        [string] type : type de noeud (nom de balise)
        [string] id   : identificateur
    Retourne:
        [XMLElement] Noeud trouve, null si introuvable
    */
    wfw.Xml.DEFAULT_FILE.prototype.getIndexNode = function(type,id)
    {
        return this.docRoot.one('> index > '+type+'[id="'+id+'"]');
    };

    /*
    Ajoute un noeud à l'index
    Arguments:
        [string] type : type de noeud (nom de balise)
        [string] id   : identificateur
    Retourne:
        [XMLElement] Noeud inséré, null en cas d'erreur
    */
    wfw.Xml.DEFAULT_FILE.prototype.addIndexNode = function(type,id)
    {
        //obtient le noeud de l'index
        var index_node = this.docRoot.one('> index');
        if(index_node == null)
            return null;

        //cree l'element
        var node = this.doc.createElement(type);
        if(node == null){
            this.post("Initialise","failed create node "+type);
            return null; 
        }
        node = Y.Node(node);

        node.set("id",id);
        index_node.append(node);

        return node;
    };

    /*
    Obtient un noeud de l'arbre de navigation
    Arguments:
        [string] page_id   : identificateur. Si null retourne le noeud parent de l'arbre 'site/tree'
    Retourne:
        [XMLElement] Noeud trouve, null si introuvable
    */
    wfw.Xml.DEFAULT_FILE.prototype.getTreeNode = function(page_id)
    {
        if(page_id==null)
            return this.docRoot.one('> tree');
        
        //enumere les noeud
        return this.docRoot.one('> tree '+page_id);
    };

    /*
    Ajoute un noeud a l'arbre de navigation
    Arguments:
        [string] parent_id : identificateur de la page du parent. Si null, le neud est placé à la racine de l'arbre
        [string] page_id   : identificateur de la page à inserer
    Retourne:
        [XMLElement] Noeud insere, null en cas d'erreur
    */
    wfw.Xml.DEFAULT_FILE.prototype.addTreeNode = function(parent_id,page_id)
    {
        var tree_node = this.docRoot.one('> tree');
        if(tree_node == null)
            return null;
        
        //obtient le parent
        var parent_node;
        if(parent_id == null)
            parent_node = tree_node;
        else if( (parent_node = this.getTreeNode(parent_id)) == null)
            return null;
        
        //initialise l'enfant
        var page_node = this.getTreeNode(page_id);
        if(page_node == null)   
        {                   
            if((page_node = this.doc.createElement(page_id)) == null)
                return null; 
            page_node = Y.Node(page_node);
        }
        
        //insert le noeud
        parent_node.append(page_node);

        return page_node;
    };

    /*
        Debug print 
    */
    wfw.Xml.DEFAULT_FILE.prototype.post = function(title,msg)
    {
        wfw.puts("wfw.Xml.DEFAULT_FILE: "+title+", "+msg);
    };

    /*
      Obtient le texte associé à une définition de champs
      @param string id Identificateur du champs
      @param string lang Langage utilisé. 'fr' Par défaut
      @return Texte trouvé. Si vide ou introuvable l'identifiant du champs est retourné
     */
    wfw.Xml.DEFAULT_FILE.prototype.getFiledText = function(id, lang)
    {
        if(typeof(lang)=="undefined")
            lang="fr";
    
        var entry_node = Y.Node(this.doc.documentElement).one("results[lang="+lang+"] > fields > "+id);
        if(entry_node == null){
            wfw.puts("UnknownField "+id);
            return false;
//            return RESULT(cResult::Failed,cXMLDefault::UnknownField);
        }

        var text = trim(entry_node.get("text"));
        return (empty(text) ? id : text);
        
//        return true;
//        return RESULT_OK();
    };
}, '1.0', {
    requires:['base','wfw','wfw-http','wfw-request']
});


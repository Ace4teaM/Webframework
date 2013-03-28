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

    /**
     * @class Xml
     * @memberof wfw
     * @brief XML interface
     * */
    wfw.Xml = {
        /**
         * @class DEFAULT_FILE
         * @memberof Xml
         * @brief Fichier default
         * */
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
        
        /**
         * @fn object nodeToArray(xml_element)
         * @memberof Xml
         * @brief Convertie les enfants d'un élément XML en tableau associatif (non-récursif)
         * @param xml_element [Node] L'Élément parent à scanner
         * @return object Tableau associatif correspondant à l'élément XML
        */
        nodeToArray : function(xml_element)
        {
            var ar = {};
            xml_element.all("> *").each(function(node){
                //wfw.puts(node.get("tagName")+"="+node.get("text"));
                ar[node.get("tagName")] = node.get("text");
            });
            return ar;
        },
    
        /**
         * @fn object nodeToArrayRecursive(xml_element,ar)
         * @memberof Xml
         * @brief Convertie les enfants d'un élément XML en tableau associatif récursif
         * @param xml_element [Node] L'Élément parent à scanner
         * @param object ar Optionel, tableau associatif à initialiser
         * @return object Tableau associatif correspondant à l'élément XML
        */
        nodeToArrayRecursive : function(xml_element,ar)
        {
            //première initialisation ?
            if(typeof(ar)=="undefined")
                ar = {};
            //scan les éléments enfants
            xml_element.all("> *").each(function(node){
                var name = node.get("tagName");
                if(node.one("> *") != null){
                    //alert(node.one("> *"));
                    ar[name]={};
                    wfw.Xml.nodeToArrayRecursive(node,ar[name]);
                }
                else
                    ar[name] = node.get("text");
            });
            return ar;
        },
        /**
         * @fn void onCheckRequestResult(obj)
         * @memberof Xml
         * @brief Traite le résultat d'une requête XML via wfw.Request
         * @param object obj L'Objet wfw.Request.REQUEST
         * @remarks Cette fonction est un callback, elle doit être utilisée en paramètre de l'objet wfw.Request.REQUEST
         * 
         * @code{.js}
         * // Paramètres utilisateurs à passer à la fonction wfw.Request.Add:
         * var param = {
         *      no_result : false,                   // Si spécifié, le contenu du fichier est retourné sans traitement des erreurs
         *      no_msg    : false,                   // Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
         *      onsuccess : function(obj,xml_doc, xml_root){}, // Optionnel, callback en cas de succès
         *      onfailed  : function(obj,xml_doc, xml_root){}, // Optionnel, callback en cas de échec
         *      onerror   : function(obj){},         // Optionnel, callback en cas d'erreur de transmition de la requête
         *      wfw_form_name : "formName"           // Optionnel, nom associé à l'élément FORM recevant les données de retours
         * };
         * @endcode
         * 
         * @verbatim
         * La variable xml_doc des callbacks onsuccess() et onfailed() passe le document XML en objet 
         * onCheckRequestResult() reçoit un format XML en réponse, il convertie en objet puis traite le résultat:
         * - En cas d'erreur, l'erreur est traité et affiché par la fonction wfw.Document.showRequestMsg (voir documentation)
         * - En cas d'echec, l'erreur est traité et affiché par la fonction wfw.Form.onFormResult (voir documentation)
         * [Le nom du formulaire HTML utilisé pour le résultat est définit par l'argument 'wfw_form_name' (si définit), sinon le nom de l'objet de requête]
         * @endverbatim
         */
        onCheckRequestResult: function (obj) {
            var param = object_merge({
               no_result : false,                   // Si spécifié, le contenu du fichier est retourné sans traitement des erreurs
               no_msg    : true,                    // Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
               onsuccess : function(obj,xml_doc, xml_root){}, // Optionnel, callback en cas de succès
               onfailed  : function(obj,xml_doc, xml_root){}, // Optionnel, callback en cas de échec
               onerror   : function(obj){},         // Optionnel, callback en cas d'erreur de transmition de la requête
               wfw_form_name : "formName"           // Optionnel, nom associé à l'élément FORM recevant les données de retours
            },obj.user);
/*
            var bErrorFunc = 0;
            var bSuccessFunc = 0;
            var bFailedFunc = 0;
            var bCheckResult = 1;

            if (obj.user != null) {
                bCheckResult = (typeof (obj.user["no_result"]) != "undefined") ? 0 : 1;
                bErrorFunc = (typeof (obj.user["onerror"]) == "function") ? 1 : 0;
                bSuccessFunc = (typeof (obj.user["onsuccess"]) == "function") ? 1 : 0;
                bFailedFunc = (typeof (obj.user["onfailed"]) == "function") ? 1 : 0;
            }*/

            if (!wfw.Request.onCheckRequestStatus(obj))
                return;

            //convertie le document
            var xml_doc = xml_parse(obj.response);
            if (xml_doc == null) {
                wfw.Document.showRequestMsg(obj, "Document XML mal formé", obj.response);
                param.onerror(obj);
                return;
            }
            var xml_root = Y.Node(xml_doc.documentElement);

            //callback
            if (!param.no_result) {
                var result = xml_root.one("result");
                var info = xml_root.one("info");
                if (result != null) {
                    var args =
                    {
                        result: result.get('text'),
                        info: ((info != null) ? info.get('text') : "")
                    };
                    // message utilisateur
                    if(!param.no_msg){
                        var result_form_id = ((typeof obj.args["wfw_form_name"] == "string") ? obj.args.wfw_form_name : obj.name);
                        wfw.Form.onFormResult(result_form_id, args, obj);
                    }
                    //echec ?
                    if (args.result != "ERR_OK") {
                        // failed callback
                        param.onfailed(obj, xml_doc, xml_root);
                        return;
                    }
                }
            }
            param.onsuccess(obj, xml_doc, xml_root);
        }
    };
    
    /*-----------------------------------------------------------------------------------------------------------------------
    * DEFAULT_FILE Class Implementation
    *-----------------------------------------------------------------------------------------------------------------------*/

    /**
     * @fn object Initialise(doc)
     * @memberof DEFAULT_FILE
     * @brief Initialise le document
     * @param string/object doc Document de base
     * @return bool Résultat de la procédure
    */
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

    /**
     * @deprecated utiliser getConfigNode
     * 
     * @fn XMLElement getModuleConfigNode(id)
     * @memberof DEFAULT_FILE
     * 
     * @brief Obtient un noeud de l'index des modules
     * @param string id Identifiant du module
     * @return Noeud correspondant au module
     * @retval Y.Node Noeud de l'élément trouvé
     * @retval null L'Elément est introuvable
    */
    wfw.Xml.DEFAULT_FILE.prototype.getModuleConfigNode = function(id)
    {
        return this.getConfigNode("module",id);
    };

    /**
     * @fn XMLElement getConfigNode(type,id)
     * @memberof DEFAULT_FILE
     * 
     * @brief Obtient un noeud de la configuration
     * @param string type Nom de balise de l'élément enfant
     * @param string id Identifiant du module. Si null, retourne le premier noeud est utilisé
     * @return Noeud correspondant au module
     * @retval Y.Node Noeud de l'élément trouvé
     * @retval null L'Elément est introuvable
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
    requires:['base','wfw','wfw-form','wfw-http','wfw-request']
});


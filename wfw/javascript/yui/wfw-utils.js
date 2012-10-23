/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        Author: AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    Utils
    Fonctions utiles

    JS  Dependences: base.js
    YUI Dependences: base, wfw

    Implementation: [17-10-2012] 
 */

YUI.add('wfw-utils', function (Y) {
    var wfw = Y.namespace('wfw');
    
    wfw.Utils = {
        /*
            Obtient le prochain Element par son nom de balise
            Parametres:
                [HTMLElement] node    : Element de base
                [string]      tagName : Nom de balise a retourner. (insensible a la case)
            Retourne:
                [HTMLElement] Le noeud trouvé, null si introuvable.

         */
        getNextNodeByTagName : function(node,tagName)
        {
            return node.next(
                function(next){
                    if(next.get("tagName").toLowerCase() == tagName.toLowerCase())
                        return next;
                }
            );
        },
        
        /*
            Importe un noeud dans le document en cours

            Retourne:
                [Node] Le noeud inséré.
         */
        importNode : function(doc, node, allChildren)
        {
            if(typeof(doc.importNode) != "undefined")
                return doc.importNode(node, allChildren);
            
            /* find the node type to import */
            switch (node.get("nodeType"))
            {
                case XML_ELEMENT_NODE:
                    /* cree l'element */
                    var newNode = doc.create("<"+node.get("nodeName")+">");
                    var i;

                    /* insert les attributs */
                    node.get("attributes").each(function(attr){
                        newNode.setAttribute(attr.get("name"), attr.get("text"));
                    });

                    /* insert les noeuds enfants */
                    var childs = node.get("childNodes").each(function(child){
                        Y.importNode(doc,child,allChildren);
                        if(insert!=null)
                            newNode.append(insert);
                    });

                    return newNode;

                case XML_TEXT_NODE:
                case XML_CDATA_SECTION_NODE:
                case XML_COMMENT_NODE:
                    return doc.create(node.get("text"));

                default:
                    wfw.puts("ignored node "+node.get("nodeType"));
                    return null;
            }
        },
        
        /*
            Obtient le prochain element enfant
            Paramètres:
                [HTMLNode] node : Noeud parent
            Retourne:
                [HTMLNode] Noeud enfant, null si introuvable
         */
        getChildNode : function(node) {
            var child = node.get("firstChild");
            if(child == null) {
                var childList = node.get("childNodes");
                if(childList != null)
                    return childList.get(0);
            }
            return child;
        },

        /*
            Obtient la largeur du client
            Paramètres:
                [HTMLDocument] doc : Optionel, document concerné.
            Retourne:
                [int] Largeur (dans l'unité définit).
         */
        getClientWidth : function(doc) {
            if(doc == "undefined")
                doc = Y.Node.one("document");
            return parseInt(doc.one("body").get("clientWidth"));
        },

        /*
            Obtient la hauteur du client
            Paramètres:
                [HTMLDocument] doc : Optionel, document concerné.
            Retourne:
                [int] Hauteur (dans l'unité définit).
         */
        getClientHeight : function(doc) {
            if(doc == "undefined")
                doc = Y.Node.one("document");
            return parseInt(doc.one("body").get("clientHeight"));
        },
        
        /*
         * Définit la hauteur d'un élément
         */
        setHeight: function (element, h) {
            element.set("height",h+"px");
            return h;
        },
                        
        /*
         * Définit la largeur d'un élément
         */
        setWidth: function (element, w) {
            element.set("width",w+"px");
            return w;
        },
        
        /*
         * Retourne la hauteur d'un élément
         */
        getHeight: function (element, options) {
            //var s = parseInt(parent.get("clientHeight"));
            var s = parseInt(element.getComputedStyle("height"));
            
            return s;
        },
        /*
         * Retourne la hauteur d'un élément
         */
        getWidth: function (element, options) {
            //var s = parseInt(parent.get("clientWidth"));
            var s = parseInt(element.getComputedStyle("width"));
            
            return s;
        },
        
        /*
         * Retourne la hauteur originale d'un élément
         */
        getOrgHeight: function (element, options)
        {
            //place l'élément en premier plan avec sa taille automatique 
            var last_position = element.get("style.position");
            var last_height = element.get("style.height");
            element.set("style.position", "absolute");
            element.set("style.height", "auto");
            
            //sauvegarde la taille
            var original_height = element.get("clientHeight");
            
            //restore la position original 
            element.set("style.height",last_height);
            element.set("style.position",last_position);
            
            return original_height;
        },
        
        /*
         * Retourne la hauteur d'un élément
         */
        getOrgWidth: function (element, options)
        {
            //place l'élément en premier plan avec sa taille automatique 
            var last_position = element.get("style.position");
            var last_width = element.get("style.width");
            element.set("style.position", "absolute");
            element.set("style.width","auto");
            
            //sauvegarde la taille 
            var original_width = element.get("clientWidth");
            
            //restore la position original 
            element.set("style.width",last_width);
            element.set("style.position",last_position);
            
            return original_width;
        },
        
        /*
         * Active/Desactive un groupe d'éléments
         * Paramètres:
         *  [YUI.Node] element  : Noeud de l'élément parent
         *  [bool]     bEnabled : Active/Desactive les éléments
         * Retourne:
         *  [void]
         */
        enabledContent: function (element, bEnabled) {
            var enumNode = element.all("*");
            enumNode.each(
                function (node) {
                    if (node.get("nodeType") == XML_ELEMENT_NODE) {
                        switch (node.get("tagName").toLowerCase()) {
                            case "input":
                            case "textarea":
                            case "select":
                                if(!cInputBool.toBool(bEnabled))
                                    node.set("disabled",disable);
                                else
                                    node.removeAttribute("disabled");
                                break;
                        }
                    }
                }
                );
        },
        /*
        Callback : wfw.request.Add
        Vérifie et traite une requête XML
        Parametres:
        [object]   obj     : L'Objet requête (retourné par wfw.request.Add)
        User Parametres:
        [function] onsuccess(obj,xml_doc) : Optionnel, callback en cas de succès
        [function] onfailed(obj,xml_doc)  : Optionnel, callback en cas de échec
        [function] onerror(obj)           : Optionnel, callback en cas d'erreur de transmition de la requête
        [string]   no_msg                 : Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
        [string]   no_result              : Si spécifié, le contenu du fichier est retourné sans traitement des erreurs
        Retourne:
        rien
        Remarques:
        La variable xml_doc des callbacks onsuccess et onfailed passe le document XML en objet 
        onCheckRequestResult_XML reçoit un format XML en reponse, il convertie en objet puis traite le résultat
        En cas d'erreur, l'erreur est traité et affiché par la fonction wfw.utils.onRequestMsg (voir documentation)
        En cas d'echec, l'erreur est traité et affiché par la fonction wfw.form.onFormResult (voir documentation)
            [Le nom de la form utilisé pour le résultat est définit par l'argument 'wfw_form_name' (si définit) sinon le nom de l'objet de requête]
         */
        onCheckRequestResult_XML: function (obj) {
            var bErrorFunc = 0;
            var bSuccessFunc = 0;
            var bFailedFunc = 0;
            var bCheckResult = 1;

            if (obj.user != null) {
                bCheckResult = (typeof (obj.user["no_result"]) != "undefined") ? 0 : 1;
                bErrorFunc = (typeof (obj.user["onerror"]) == "function") ? 1 : 0;
                bSuccessFunc = (typeof (obj.user["onsuccess"]) == "function") ? 1 : 0;
                bFailedFunc = (typeof (obj.user["onfailed"]) == "function") ? 1 : 0;
            }

            if (!wfw.utils.onCheckRequestStatus(obj))
                return;

            //convertie le document
            var xml_doc = xml_parse(obj.response);
            if (xml_doc == null) {
                wfw.utils.onRequestMsg(obj, "Document XML mal formé", obj.response);
                if (bErrorFunc)
                    obj.user.onerror(obj);
                return;
            }

            //callback
            if (bCheckResult) {
                var result = docGetElement(xml_doc, "result");
                var info = docGetElement(xml_doc, "info");
                if (result != null) {
                    var args =
                    {
                        result: (objGetInnerText(result)),
                        info: ((info != null) ? objGetInnerText(info) : "")
                    };
                    if (parseInt(args.result) != ERR_OK) {
                        //message
                        var result_form_id = ((typeof obj.args["wfw_form_name"] == "string") ? obj.args.wfw_form_name : obj.name);
                        wfw.form.onFormResult(result_form_id, args, obj);

                        //failed callback
                        if (bFailedFunc)
                            obj.user.onfailed(obj, xml_doc);
                    }
                    return;
                }
            }
            if (bSuccessFunc)
                obj.user.onsuccess(obj, xml_doc);
        },
        /*
        Callback : wfw.request.Add
        Vérifie et traite une requête
        Parametres:
        [object]   obj     : L'Objet requête (retourné par wfw.request.Add)
        User Parametres:
        [function] onsuccess(obj,response): Optionnel, callback en cas de succès
        [function] onerror(obj)           : Optionnel, callback en cas d'erreur de transmition de la requête
        [string]   no_msg                 : Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
        Retourne:
        rien
        Remarques:
        En cas d'echec, l'erreur est traité et affiché par la fonction wfw.utils.onRequestMsg (voir documentation)
         */
        onCheckRequestResult: function (obj) {
            var bErrorFunc = 0;
            var bSuccessFunc = 0;

            if (obj.user != null) {
                bErrorFunc = (typeof (obj.user["onerror"]) == "function") ? 1 : 0;
                bSuccessFunc = (typeof (obj.user["onsuccess"]) == "function") ? 1 : 0;
            }

            if (!wfw.utils.onCheckRequestStatus(obj))
                return;

            //success callback
            if (bSuccessFunc)
                obj.user.onsuccess(obj, obj.response);
        },
        /*
        Convertie un tableau associatif en document XML
        Parametres:
        [object] fields : Tableau associatif des valeurs
        Retourne:
        [DOMDocument] Document XML, null en cas d'erreur
        Remarques:
        L'Elément root du document est nommé "data"
         */
        fieldsToXML: function (fields) {
            /*fields to xmlDoc (Compatible)*/
            var doc_text = '<?xml version="1.0"?><data>';
            for (var field_name in fields) {
                doc_text += '<' + field_name + '>' + fields[field_name] + '</' + field_name + '>';
            }
            doc_text += '</data>';
            var doc = xml_parse(doc_text);
            if (doc == null)
                wfw.puts("wfw_ListElement->insertFields : can't parse fields");

            /*fields to xmlDoc (I.E bug)
            var doc = xml_parse('<?xml version="1.0"?><data></data>');
            for(field_name in fields){
            var node = doc.createElement(field_name);
            doc.documentElement.appendChild(node);
            objSetInnerText(node,fields[field_name]);
            }*/

            /*fields to xmlDoc (no I.E)
            var doc = document.createDocumentFragment();
            // imite l'element racine d'un document
            doc.documentElement=document.createElement("data");
            doc.appendChild(doc.documentElement);
            for(field_name in fields){
            var node = document.createElement(field_name);
            doc.documentElement.appendChild(node);
            objSetInnerText(node,fields[field_name]);
            }*/

            /*fields to xmlDoc 'w3c' (no I.E)
            var doc = document.implementation.createDocument(null, 'data', null);
            for(field_name in fields){
            var node = doc.createElement(field_name);
            doc.documentElement.appendChild(node);
            objSetInnerText(node,fields[field_name]);
            //alert(node.tagName);
            }*/

            return doc;
        },
        /*
        Formate un texte simple en HTML
            Arguments:
                [string] text: Texte brut
            Retourne:
                [string] texte HTML
         */
        strToHTML: function (text) {
            text = text.replace(/</g, "&lt;");
            text = text.replace(/>/g, "&gt;");
            text = text.replace(/[-]{5,}/g, "<hr />");
            text = text.replace(/(\r\n|\n|\r)/gm, "<br />");
            return text;
        }
    };
}, '1.0', {
    requires:['base','wfw']
});

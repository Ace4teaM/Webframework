/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2012,2013 Thomas AUGUEY <contact@aceteam.org>
    ---------------------------------------------------------------------------------------------------------------------------------------
    This file is part of WebFrameWork.

    WebFrameWork is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WebFrameWork is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WebFrameWork.  If not, see <http://www.gnu.org/licenses/>.
    ---------------------------------------------------------------------------------------------------------------------------------------
*/

/**
 * @file
 * Fonctions utiles
 *
 * @defgroup YUI
 * @{
 */

/**
 * @defgroup WFW-Utils
 * @brief Fonctions utiles
 *
 * @section depend Dépendences
 * @par
 * - JS  Dependences: base.js
 * - YUI Dependences: base, wfw
 *  
 *  @{
 */
YUI.add('wfw-utils', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class Utils
     * @memberof wfw
     * @brief Fonctions utiles
     * */
    wfw.Utils = {
        /**
            * @fn string getNextNodeByTagName(node,tagName)
            * @memberof Utils
            * 
            * @brief Obtient le prochain Element par son nom de balise
            * @param node    [HTMLElement] Elément de base
            * @param tagName [string]      Nom de balise a retourner. (insensible à la case)
            * @return [HTMLElement] Le noeud trouvé, null si introuvable.
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
        
        /**
            * @fn string importNode(doc, node, allChildren)
            * @memberof Utils
            *
            * @brief Importe un noeud dans le document en cours
            * @param doc [DOMDocument] Document dans lequel sera importé le nouveau noeud
            * @param node [Node] Noeud à importer
            * @param allChildren [bool] Si true importe également les noeuds enfants
            * 
            * @return [Node] Le noeud inséré.
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
        
        /**
            * @fn string getChildNode(node)
            * @memberof Utils
            * 
            * @brief Obtient le prochain élément enfant
            * @param node [HTMLNode] Noeud parent
            * @return [HTMLNode] Noeud enfant, null si introuvable
         */
        getChildNode : function(node) {
            var child = node.get("firstChild");
            if(child == null) {
                var childList = node.get("childNodes");
                if(childList.size())
                    return childList.get(0);
            }
            return child;
        },

        /**
            * @fn string getClientWidth(doc)
            * @memberof Utils
            * 
            * @brief Obtient la largeur du client
            * @param doc [HTMLDocument] Optionel, document concerné.
            * @return [int] Largeur (dans l'unité définit).
         */
        getClientWidth : function(doc) {
            if(doc == "undefined")
                doc = Y.Node.one("document");
            return parseInt(doc.one("body").get("clientWidth"));
        },

        /**
            * @fn string getClientHeight(doc)
            * @memberof Utils
            * 
            * @brief Obtient la hauteur du client
            * @param doc [HTMLDocument] Optionel, document concerné.
            * @return [int] Hauteur (dans l'unité définit).
         */
        getClientHeight : function(doc) {
            if(doc == "undefined")
                doc = Y.Node.one("document");
            return parseInt(doc.one("body").get("clientHeight"));
        },
        
        /**
            * @fn string setHeight(element, h)
            * @memberof Utils
            * 
            * @brief Définit la hauteur d'un élément
            * @param element [HTMLElement] Elément à modifier
            * @param h [int] Hauteur en pixels
            * @return Hauteur donnée en paramètre
            * @remarks Cette fonction modifie l'attribut CSS 'height'
         */
        setHeight: function (element, h) {
            element.set("height",h+"px");
            return h;
        },
                        
        /**
            * @fn string setWidth(element, w)
            * @memberof Utils
            *
            * @brief Définit la largeur d'un élément
            * @param element [HTMLElement] Elément à modifier
            * @param w [int] Largeur en pixels
            * @return Largeur donnée en paramètre
            * @remarks Cette fonction modifie l'attribut CSS 'width'
         */
        setWidth: function (element, w) {
            element.set("width",w+"px");
            return w;
        },
        
        /**
            * @fn string getHeight(element, options)
            * @memberof Utils
            *
            * @brief Retourne la hauteur d'un élément
            * @param element [HTMLElement] Elément à modifier
            * @param options Obsolète
            * @return Hauteur donnée en paramètre
         */
        getHeight: function (element, options) {
            //var s = parseInt(parent.get("clientHeight"));
            var s = parseInt(element.getComputedStyle("height"));
            
            return s;
        },

        /**
            * @fn string getWidth(element, options)
            * @memberof Utils
            *
            * @brief Retourne la hauteur d'un élément
            * @param element [HTMLElement] Elément à modifier
            * @param options Obsolète
            * @return Largeur donnée en paramètre
         */
        getWidth: function (element, options) {
            //var s = parseInt(parent.get("clientWidth"));
            var s = parseInt(element.getComputedStyle("width"));
            
            return s;
        },
        
        /**
            * @fn string getOrgHeight(element, options)
            * @memberof Utils
            *
            * @brief Retourne la hauteur originale d'un élément
            * @param element [HTMLElement] Elément à modifier
            * @param options Obsolète
            * @return Largeur en pixels
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
        
        /**
            * @fn string getOrgWidth(element, options)
            * @memberof Utils
            *
            * @brief Retourne la largeur originale d'un élément
            * @param element [HTMLElement] Elément à modifier
            * @param options Obsolète
            * @return Largeur en pixels
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
        
        /**
         * @fn string enabledContent(element, bEnabled)
         * @memberof Utils
         *
         * @brief Active/Désactive un groupe d'éléments
         * @param element  [Node] Noeud de l'élément parent
         * @param bEnabled [bool] Active/Desactive les éléments
         * @remarks Cette fonction Supprime/Ajoute l'attribut 'disabled' à l'élément
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

        /**
         * @fn string onCheckRequestResult(obj)
         * @memberof Utils
         *
         * @brief Vérifie et traite une requête
         * @param obj     [object] L'Objet requête (retourné par wfw.Request.Add)
         * @par User Paramètres
         * @param onsuccess (obj,response) [function] Optionnel, callback en cas de succès
         * @param onerror (obj)            [function] Optionnel, callback en cas d'erreur de transmition de la requête
         * @param no_msg                   [string]   Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
         * @remarks En cas d'echec, l'erreur est traité et affiché par la fonction wfw.utils.onRequestMsg (voir documentation)
         * @remarks Callback utilisable avec wfw.Request.Add()
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
        /**
         * @fn string fieldsToXML(fields)
         * @memberof Utils
         *
         * @brief Convertie un tableau associatif en document XML
         * @param fields [object] Tableau associatif des valeurs
         * @return [DOMDocument] Document XML, null en cas d'erreur
         * @remarks L'Elément root du document est nommé "data"
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
        /**
         * @fn string strToHTML(text)
         * @memberof Utils
         *
         * @brief Formate un texte simple en HTML
         * @param text [string] Texte brut
         * @return [string] texte HTML
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

/** @} */ // end of group URI
/** @} */ // end of group YUI
/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2013 Thomas AUGUEY <contact@aceteam.org>
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
 * @brief jQuery Navigator Plugin
 * @method navigator
 * @memberof JQuery
 * 
 * #Introduction
 * Accès aux données de navigation
 * 
 * ## Obtient l'URL d'une page
 * navigator( 'url' [, att] )
 * navigator( 'uri' [, att] )
 * 
 * ## Obtient un noeud de l'index
 * DOMNode navigator( 'index' )
 * 
 * ## Retourne l'état d'initialisation du plugin
 * bool navigator( 'loaded' )
 * 
 * **/
(function($)
{
    //globals variables
    var defaultDoc   = null; // pointeur sur l'objet DOMDocument (fichier default.xml)
    var loaded       = false; // true si le document default.xml est chargé
    var pageURI      = null; // URL de la page en cours
    var pageTreeNode = null; // Noeud de la page en cours dans l'arborescence


    //constructeur
    $.fn.navigator = function(p){
        var me = $(this);
        var args = arguments;


        /**
        * @brief Obtient l'URL d'une page
        * @param id Identifiant de la page
        * @param att Tableau associatif des arguments de l'url
        * @return string URL de la page
        * @retval null la page est introuvable ou le plugin non initialisé
        */
        function getURL(id,att){
            //obtient l'URI depuis le fichier default
            var node = getIndex("page",id);
console.log("---------------------\n",id,att);
//                    console.log(node);
            if(node==null){
                //if(typeof RESULT == "function") return RESULT(cResult.Failed,"DEFAULT_CANT_FOUND_PAGE_NODE");
                return false;
            }
            var uri = node.text();
                   console.log(uri);

            if( att ){
                //décompose l'uri
                var obj = uri_cut(uri);
                        console.log(obj);
                        console.log("query="+obj.query);

                //merge les attributs
                var query_obj = uri_query_to_object(obj.query,null);
                object_merge(query_obj,att,false);
                obj.query = uri_object_to_query(query_obj,null);

                //recompose l'uri
                uri = uri_paste(obj);
    //                   console.log(uri);
            }
            //
            return uri;
        }
    
    
        /**
        * @brief Obtient le noeud d'un index
        * @param type Nom de balise du noeud
        * @param id Identifiant du noeud
        * @return DOMNode noeud de l'index
        * @retval null le noeud est introuvable ou le plugin non initialisé
        */
        function getIndex(type,id){
            //return $(defaultDoc.documentElement).children("site > index > "+type+"[id='"+id+"']");
            return $("site > index > "+type+"[id='"+id+"']",$(defaultDoc.documentElement));
        }
    
    
        /**
        * @brief Obtient l'identifiant de l'application
        * @return string Identifiant de l'application
        * @retval null le noeud est introuvable ou le plugin non initialisé
        */
        function getAppId(){
            return $("site > id",$(defaultDoc.documentElement)).text();
        }
    
        /**
        * @brief Obtient le nom de l'application
        * @return string Nom de l'application
        * @retval null le noeud est introuvable ou le plugin non initialisé
        */
        function getAppName(){
            return $("site > name",$(defaultDoc.documentElement)).text();
        }
    
        //setter
        if(typeof(p) == "string" && args.length > 1){
            switch(p.toLowerCase()){
                //
                // Obtient une URL
                //
                case "uri":
                case "url":
                    var id   = args[1];
                    var att  = args[2];
                    //next?
                    if(loaded)
                    {
                        switch(id.toLowerCase()){
                            case "#previous":
                                id = pageTreeNode.prev().prop('tagName');
                                break;
                            case "#next":
                                id = pageTreeNode.next().prop('tagName');
                                break;
                            case "#parent":
                                id = pageTreeNode.parent().prop('tagName');
                                break;
                            case "#child":
                                id = pageTreeNode.find("> *").prop('tagName');
                                break;
                        }
                    }
                    return getURL(id,att);
            }
        }
        //getter
        else if(typeof(p) == "string"){
            switch(p.toLowerCase()){
                //
                // Charge ?
                //
                case "loaded":
                    return loaded;
                //
                // Obtient l'identifiant de l'application
                //
                case "id":
                    return getAppId();
                //
                // Obtient le nom de l'application
                //
                case "name":
                    return getAppName();
                //
                // Obtient un noeud de l'index
                //
                case "index":
                    var type = args[1];
                    var id   = args[2];
                    return getIndex(type,id);
            }
        }
        // initialise l'élément
        else {
            //OK
            if(loaded)
                return this;

            //params
            p = $.extend({
                defaultFile    : "default.xml"
            },p);

            //charge le fichier default.xml
            $.ajax( {
                type: "GET",
                url: p.defaultFile,
                dataType: "xml",
                async : false,
                success: function(xml) {
                    defaultDoc = xml;
                    loaded = true;
                }
            });

            if(loaded)
            {
                // recupere l'id de la page actuelle
                pageId = $("html > head > meta[http-equiv='wfw.page-id']").attr("content");
                console.log("pageId="+pageId);
                if(!empty_string(pageId))
                {
                    // recupère l'url de la page actuelle
                    pageURI = $("site > index > page[id='"+pageId+"']",defaultDoc).text();
                    console.log("pageURI="+pageURI);

                    // recupère le noeud de l'index
                    pageTreeNode = $("site > tree "+pageId,defaultDoc);
                    console.log("pageTreeNode="+pageTreeNode.prop('tagName'));
                }
            }
 
        }
            
       return this;
    };
    
})(jQuery);

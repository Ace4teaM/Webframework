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
 * @brief jQuery Request Plugin
 * @method request
 * @memberof JQuery
 * 
 * #Introduction
 * Simplifie la gestion des requêtes HTTP dans une application Webframework
 * 
 * ## Execute une requête XARG
 * request( 'xarg', 'my_page_id', { request params... }, function(obj,args){ 
 *      obj;   // request object
 *      args;  // the native javascript object of response parameters
 * } )
 *
 * ## Execute une requête XARG (avec paramètres)
 * request( 'xarg', 'my_page_id', { args... }, { 
 *     no_result : false,                // Si spécifié, le contenu du fichier est retourné sans traitement des erreurs
 *     no_msg    : true,                 // Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
 *     onsuccess : function(obj,args){}, // Optionnel, callback en cas de succès
 *     onfailed  : function(obj,args){}, // Optionnel, callback en cas de échec
 *     onerror   : function(obj){},      // Optionnel, callback en cas d'erreur de transmition de la requête
 *     wfw_form_name : "formName"        // Optionnel, nom associé à l'élément FORM recevant les données de retours
 * } )
 * 
 * ## Execute une requête XML
 * request( 'xml', 'my_page_id', { request params... }, function(obj,xml_doc, xml_root){ 
 *      obj;      // request object
 *      xml_doc;  // the native XMLDOMDocuemnt interface
 *      xml_root; // the root document element
 * } )
 *
 * ## Execute une requête XML (avec paramètres)
 * request( 'xml', 'my_page_id', { args... }, { 
 *     no_result : false,                // Si spécifié, le contenu du fichier est retourné sans traitement des erreurs
 *     no_msg    : true,                 // Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
 *     onsuccess : function(obj,xd,xr){},// Optionnel, callback en cas de succès
 *     onfailed  : function(obj,xd,xr){},// Optionnel, callback en cas de échec
 *     onerror   : function(obj){},      // Optionnel, callback en cas d'erreur de transmition de la requête
 *     wfw_form_name : "formName"        // Optionnel, nom associé à l'élément FORM recevant les données de retours
 * } )
 * 
 * ## Execute une requête standard
 * request( 'add', { 
 *      name              : null,   // Nom symbolique de la requête
 *      url               : "",     // URL de destination d ela requête
 *      args              : null,   // Arguments passés en paramétre de la fonction
 *      response_header   : null,   // En-têtes de la réponse
 *      response          : null,   // Corps de la reponse texte
 *      response_obj      : null,   // Objet natif de la requete (XHR)
 *      callback          : function(req_obj,user){},// Optionnel, callback d'avancement de la request
 *      user              : {},     // Paramétres "utilisateur" passé en argument de callback
 *      status            : "wait", // Statut actuel de la requête ("wait" ou code réponse HTTP ex:200)
 *      remove_after_exec : true,   // Supprime la requête de la liste après exécution
 *      async             : true    // Asynchrone/Synchrone
 * } )
 *
 **/
(function($)
{
    /*
    * Ajoute une requête HTTP
    * @param args Objet de requete
    */
    function add(args){
        var req_obj = object_merge({
            name              : null,   // Nom symbolique de la requête
            url               : "",     // URL de destination d ela requête
            args              : null,   // Arguments passés en paramètre de la fonction
            response_header   : null,   // En-têtes de la réponse
            response          : null,   // Corps de la reponse texte
            response_obj      : null,   // Objet natif de la requete (XHR)
            callback          : function(req_obj,user){},// Optionnel, callback d'avancement de la request
            user              : {},     // Paramétres "utilisateur" passé en argument de callback
            status            : "wait", // Statut actuel de la requête ("wait" ou code réponse HTTP ex:200)
            remove_after_exec : true,   // Supprime la requête de la liste après exécution
            async             : true    // Asynchrone/Synchrone
        },args);

        // genere le nom ?
        if ((typeof (req_obj.name) != 'string') || empty(req_obj.name))
            req_obj.name = uniqid();
        
        //transforme les arguments
        if(typeof (req_obj.args) == "string")
            req_obj.args = uri_query_to_object(req_obj.args);
        
        //FIX: $.ajax ne supporte pas les parametres dans l'URL pour une request POST
        //convertie les arguments de l'url dans l'objet req_obj.args
        if(req_obj.url.indexOf('?'))
        {
            var uriObj = uri_cut(req_obj.url);
            //convertie les arguments en objet
            if(uriObj.query)
                req_obj.args = object_merge(req_obj.args,uri_query_to_object(uriObj.query));
            //reforme l'url sans arguments
            uriObj.query="";
            req_obj.url = uri_paste(uriObj);
        }

        //Execute la requete
        $.ajax({
            type:"POST",
            url: req_obj.url,
            data: req_obj.args,
            /*context: req_obj,*/
            async:req_obj.async,
            success: function( /*PlainObject*/ data, /*String*/ textStatus, /*jqXHR*/ jqXHR ) {
                req_obj.status = jqXHR.status; //met a jour l'etat
                req_obj.response_header = jqXHR.getAllResponseHeaders();
                req_obj.response = data;
                req_obj.response_obj = jqXHR;
                if(typeof req_obj.callback == "function")
                    req_obj.callback(req_obj,req_obj.user);
            },
            error: function(/*jqXHR*/ jqXHR, /*String*/ textStatus, /*String*/ errorThrown) {
                req_obj.status = jqXHR.status; //met a jour l'etat
                req_obj.response_header = jqXHR.getAllResponseHeaders();
                req_obj.response = null;
                req_obj.response_obj = jqXHR;
                if(typeof req_obj.callback == "function")
                    req_obj.callback(req_obj,req_obj.user);
            }
        }); 

        return req_obj;
    };


    //constructeur
    $.fn.request = function(p){
        var me = $(this);
        var args = arguments;

        //s'assure que le plugin navigator est initialisé
        if(!$(window).navigator("loaded"))
            $(window).navigator();

        // SETTER
        if(typeof(p) == "string"){
            switch(p){
                /**
                 * @param opt Objet de requete
                 */
                case "xarg":
                    var req_page      = args[1];
                    var req_args      = args[2];
                    var req_params    = args[3]; // si null sync
                    if(typeof req_params == "function")
                        req_params = {onsuccess:req_params};
                    var req_url       = $(window).navigator("page",req_page);

                    var req_obj = {
                        url: req_url,
                        args: object_merge(req_args,{output:"xarg"}),
                        async:false,
                        type:"text/plain",
                        user: ((typeof req_params == "function") ? { onsuccess : req_params } : req_params),
                        callback: function(obj){
                            switch(obj.status){
                                //OK
                                case 200:
                                    //callback params
                                    var param = object_merge({
                                       no_result : false,                // Si spécifié, le contenu du fichier est retourné sans traitement des erreurs
                                       no_msg    : true,                 // Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
                                       onsuccess : function(obj,args){}, // Optionnel, callback en cas de succès
                                       onfailed  : function(obj,args){}, // Optionnel, callback en cas de échec
                                       onerror   : function(obj){},      // Optionnel, callback en cas d'erreur de transmition de la requête
                                       wfw_form_name : "formName"        // Optionnel, nom associé à l'élément FORM recevant les données de retours
                                    },obj.user);
                                    
                                    //resultat ?
                                    var args = xarg_to_object(obj.response,false);
                                    if (!args) {
                                        if (!param.no_msg)
                                            console.log("Erreur de requête", obj.response);
                                        param.onerror(obj);
                                        break;
                                    }

                                    //non x-argument result !
                                    if ((!param.no_result) && typeof(args.result) == 'undefined') {
                                        if (!param.no_msg)
                                            console.log("Résultat de requête non spécifié", obj.response);
                                        param.onerror(obj);
                                        break;
                                    }

                                    //erreur ?
                                    if ((!param.no_result) && (args.result != "ERR_OK")) {
                                        //failed callback
                                        param.onfailed(obj, args);
                                        break;
                                    }

                                    //success callback
                                    param.onsuccess(obj, args);
                                    break;
                                default:
                                    console.log("xarg other");
                                    break;
                            }
                        }
                    };

                    //sync request
                    return add(req_obj);

                /**
                 * @param opt Objet de requete
                 */
                case "xml":
                    var req_page      = args[1];
                    var req_args      = args[2];
                    var req_params    = args[3];
                    if(typeof req_params == "function")
                        req_params = {onsuccess:req_params};
                    var req_url       = $(window).navigator("page",req_page);

                    var req_obj = {
                        url: req_url,
                        args: object_merge(req_args,{output:"xml"}),
                        async:false,
                        user:req_params,
                        callback: function(obj){
                            switch(obj.status){
                                //OK
                                case 200:
                                    //callback params
                                    var param = object_merge({
                                       no_result : false,                // Si spécifié, le contenu du fichier est retourné sans traitement des erreurs
                                       no_msg    : true,                 // Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
                                       onsuccess : function(obj,xd,xr){},// Optionnel, callback en cas de succès
                                       onfailed  : function(obj,xd,xr){},// Optionnel, callback en cas de échec
                                       onerror   : function(obj){},      // Optionnel, callback en cas d'erreur de transmition de la requête
                                       wfw_form_name : "formName"        // Optionnel, nom associé à l'élément FORM recevant les données de retours
                                    },obj.user);
                                    
                                    //parse le document
                                    var xml_doc = obj.response;
                                    if (typeof xml_doc == "string"){
                                        xml_doc = xml_parse(xml_doc);
                                        if (xml_doc == null) {
                                            console.log("Document XML mal formé", obj.response);
                                            param.onerror(obj);
                                            break;
                                        }
                                    }
                                    var xml_root = $(xml_doc.documentElement);

                                    //callback
                                    if (!param.no_result) {
                                        var result = $("result",xml_root);
                                        if (result != null) {
                                            //echec ?
                                            if (result.text() != "ERR_OK") {
                                                // failed callback
                                                param.onfailed(obj, xml_doc, xml_root);
                                                console.log("Failed", result.text());
                                                break;
                                            }
                                        }
                                        else{
                                            if (!param.no_msg)
                                                console.log("Résultat de requête non spécifié", obj.response);
                                            param.onerror(obj, xml_doc, xml_root);
                                        }
                                    }
                                    param.onsuccess(obj, xml_doc, xml_root);
                                    break;
                                default:
                                    console.log("xarg other");
                                    break;
                            }
                        }
                    };

                    //sync request
                    return add(req_obj);

                /**
                 * @param opt Objet de requete
                 */
                case "add":
                    var req_obj = add(args[1]);
                    return this;
            }
        }
            
       return this;
    };
})(jQuery);

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
 * @brief jQuery Form Plugin
 * @method form
 * @memberof JQuery
 * 
 * #Introduction
 * Crée un formulaire basé sur le model de données
 * 
 * ## Définit les valeurs de champs
 * form( 'values', values[] )
 * 
 * ## Obtient les valeurs de champs
 * values[] form( 'values' )
 * 
 * ## Initialise le formulaire
 * form( )
 * 
 * ## Initialise le formulaire avec des champs définits
 * form( fields:[ {name,value,type}, ... ] )
 * 
 * ## Transmet le formulaire 
 * form( fields:[ {name,value,type}, ... ] )

 * **/
(function($)
{
    //constructeur
    $.fn.request = function(p){
        var me = $(this);
        var args = arguments;

        // SETTER
        if(typeof(p) == "string"){
            switch(p){
                /**
                 * @param opt Objet de requete
                 */
                case "xarg":
                    var req_page      = args[1];
                    var req_args      = args[2];
                    var req_onsuccess = args[3]; // si null sync
                    var req_onfailed  = args[4];

                    //sync request
                    return me.request("add",{
                        url: $.navigator("page",req_page),
                        args: req_args,
                        callback: function(reqObj){
                            if(reqObj.status == "success"){
                                expected = "...";
                                value = reqObj.response;
                                equal( value , expected, "sync request" );
                            }
                            if(reqObj.status == "error"){
                                expected = "...";
                                value = reqObj.response;
                                equal( value , expected, "sync request" );
                            }
                        }
                    });
                /**
                 * @param opt Objet de requete
                 */
                case "add":
                    var req_obj = object_merge({
                        name              : null,
                        url               : "",
                        args              : null,
                        response_header   : null,
                        response          : null,
                        response_obj      : null,
                        callback          : null,
                        user              : {},
                        status            : "wait",
                        remove_after_exec : true,
                        async             : true
                    },args[1]);

                    // genere le nom ?
                    if ((typeof (req_obj.name) != 'string') || empty(req_obj.name))
                        req_obj.name = uniqid();
                    //transforme les arguments
                    if(typeof (req_obj.args) == "string")
                        req_obj.args = uri_query_to_object(req_obj.args);

                    $.ajax({
                        type:"POST",
                        url: req_obj.url,
                        data: req_obj.args,
                        /*context: req_obj,*/
                        async:req_obj.async,
                        success: function( /*PlainObject*/ data, /*String*/ textStatus, /*jqXHR*/ jqXHR ) {
                            console.log(textStatus);
                            req_obj.status = textStatus; //met a jour l'etat
                            req_obj.response_header = jqXHR.getAllResponseHeaders();
                            req_obj.response = data;
                            req_obj.response_obj = data;
                            req_obj.callback(req_obj);
                        },
                        error: function(/*jqXHR*/ jqXHR, /*String*/ textStatus, /*String*/ errorThrown) {
                            req_obj.status = textStatus; //met a jour l'etat
                            req_obj.response_header = jqXHR.getAllResponseHeaders();
                            req_obj.response = null;
                            req_obj.response_obj = null;
                            req_obj.callback(req_obj);
                        }
                    }); 

                    return this;
            }
        }
            
       return this;
    };
    
})(jQuery);

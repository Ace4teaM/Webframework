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
 * ## Initialise des champs existants
 * form( )
 * 
 * ## Initialise avec des champs définits
 * form( fields:[ {name,value,type}, ... ] )
 * 
 * **/
(function($)
{
    //globals variables
    var defaultDoc = null;
    var loaded = false;
    
    //constructeur
    $.fn.navigator = function(p){
        var me = $(this);
        var args = arguments;

        //setter
        if(typeof(p) == "string" && args.length > 1){
            switch(p){
                //Définit les valeurs de champs
                case "loaded":
                    return loaded = args[1];
            }
        }
        //getter
        else if(typeof(p) == "string"){
            switch(p){
                //charge ?
                case "loaded":
                    return loaded;
                //Obtient un noeud de l'index
                case "index":
                    var type = args[1];
                    var id   = args[2];
                    return $(">index>"+type+"[id='"+id+"']",$(defaultDoc.documentElement));
            }
        }
        // initialise l'élément
        else{
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
        }
            
       return this;
    };
    
})(jQuery);

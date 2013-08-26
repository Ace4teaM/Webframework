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
    // Fabrique un élément HTML depuis une definition de champ
    function makeField(parent,field){
        parent = $(parent);

        field = $.extend({
           name    : '',
           value   : '',
           type    : 'string'
        },field);

        //pas de classe ?
        //if(empty(field.type)) return;
        
        //obtient la classe du type
        var className = "cInput"+field.type.toLowerCase();
        
        //Si la classe n'existe pas, crée un élément basique
        if (eval("typeof "+className) != 'object'){
        //           console.log(className+" type not specified");
            var input = $('<input type="text" />');
            input.attr("name",field.name);
            input.val(field.value);
            return input;
        }
        
        //Crée l'élément
        var inputClass = eval(className);

        //        console.log("make from "+className+" type");
        return $(inputClass.toElement(field.name,field.value,field.label));
    };
    
    // Intialise un élément HTML existant
    function makeExistingField(parent,node){
        parent = $(parent);

        var field = {
            name    : node.attr("name"),
            value   : node.val(),
            type    : node.attr("data-type")
        };
        
        return makeField(parent,field);
    };
    
    //constructeur
    $.fn.form = function(p){
        var me = $(this);
        var args = arguments;

        // SETTER
        if(typeof(p) == "string" && args.length > 1){
            switch(p){
                //
                // SETTER
                // Définit les valeurs de champs
                //
                case "values":
                    var values = args[1];

                    me.each(function()
                    {
                        var parent = $(this);
                        for(var key in values)
                        {
                            // éléments à valeur
                            var find = $("input[name="+key+"]",parent);
                            if(find.length)
                                find.val(values[key]);
                            // éléments à textes
                            else
                                $("*[name="+key+"]",parent).text(values[key]);
                        }
                    });

                    return this;
            }
        }
        // GETTER
        else if(typeof(p) == "string"){
            switch(p){
                //
                // GETTER
                // Obtient les valeurs de champs
                //
                case "values":
                    var values = {};

                    this.each(function()
                    {
                        var parent = $(this);
                        $("input[name], select[name], textarea[name]",parent).each(function(i,node){
                            node = $(node);
                            values[node.attr("name")] = node.val();
                        });
                    });

                    return values;
            }

        }
        // Initialise l'élément
        else{
            //Initialisation avec parametres...
            if(typeof p == "object")
            {
                 p = $.extend({
                     fields    : null
                 },p);

                 return this.each(function()
                 {
                     var parent = $(this);

                     parent.empty();

                     //fabrique les champs
                     for(var i in p.fields){
                         var input = makeField(this,p.fields[i]);
                         var label = parent.append("<div>"+p.fields[i].label+"</div>");
                        // parent.append(label);
                         parent.append(input);
                     }
                 });
            }

            //Initialisation sans parametres...
            if(typeof p == "undefined")
            {
                 return this.each(function()
                 {
                     var parent = $(this);

                     //fabrique les champs (ignore les champs cachés)
                     $("*[name][type!='hidden']",parent).each(function(i,node){
                         node = $(node);
                         var input = makeExistingField(this,node);
                         node.replaceWith(input);
                     });
                 });
            }
        }
            
       return this;
    };
    
})(jQuery);

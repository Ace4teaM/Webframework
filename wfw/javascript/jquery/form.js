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
 * @option array  fields  Liste des noms de champs
 * 
 * **/
(function($)
{
    // Fabrique un élément HTML depuis une definition de champ
    function makeField(parent,field){
        parent = $(parent);
        var input;

       field = $.extend({
           name    : '',
           value   : '',
           type    : 'string'
       },field);
       
       //obtient la classe du type
        var className = "cInput"+field.type.toLowerCase(); 
        if (eval("typeof "+className) != 'object'){
//           console.log(className+" type not specified");
            input = $('<input type="text" />');
            input.attr("name",field.name);
            input.val(field.value);
            return input;
        }
//        console.log("make from "+className+" type");
        var inputClass = eval(className);
        return $(inputClass.toElement(field.name,field.value,field.label));
    };
    
    // Intialise un élément HTML existant
    function makeExistingField(parent,node){
        parent = $(parent);
        var input;

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

        //setter
        if(typeof(p) == "string" && args.length > 1){
            switch(p){
                //Définit les valeurs de champs
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
        //getter
        else if(typeof(p) == "string"){
            switch(p){
                //Obtient les valeurs de champs
                case "values":
                    var values = {};

                    this.each(function()
                    {
                        var parent = $(this);
                        $("input[name], textarea[name]",parent).each(function(i,node){
                            node = $(node);
                            values[node.attr("name")] = node.val();
                        });
                    });

                    return values;
            }

        }
        // initialise l'élément
        else{
            //@page $form Initialisation avec parametres
            //Obtient les valeurs de champs
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

            //initialisation sans parametres
            if(typeof p == "undefined")
            {
                 return this.each(function()
                 {
                     var parent = $(this);

                     //fabrique les champs
                     $("*[name]",parent).each(function(i,node){
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

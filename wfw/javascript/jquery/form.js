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
 * Permet de créer facilement un formulaire générique
 * 
 * @option array fields       Définitions des champs
 * 
 * **/
(function($)
{
    // Fabrique un element HTML depuis une definition de champ
    function makeField(parent,p,field){
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
            input = $('<input type="text" />');
            input.attr("name",field.name);
            input.val(field.value);
            return input;
        }
        var inputClass = eval(className);
        return $(inputClass.toElement(field.name,field.value,field.label));
    };
    
    //constructeur
    $.fn.form = function(p){
       if(typeof p == "object")
       {
            p = $.extend({
                fields    : null
            },p);

            return this.each(function()
            {
                var parent = $(this);

                //fabrique les champs
                for(var i in p.fields){
                    var input = makeField(this,p,p.fields[i]);
                    var label = parent.append(p.fields[i].label);
                    parent.append(input);
                    $([label,input]).wrap('<div></div>')
                }
            });
       }
       
       //@page $form.values values Option
       //Obtient les valeurs de champs
       if(p == "values"){
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
       
       return this;
    };
    
})(jQuery);

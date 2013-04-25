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
 * @option string mode        Orientation des briques
 * @option mixed  selector    Sélecteurs
 * @option string size        Optionel, Hauteur/Largeur des elements
 * @option bool   wrap        Optionel, Entoure les éléments d'une balise SPAN
 * 
 * ##mode
 * @code{.js}
 * { mode : "rows" }
 * @endcode
 * Orientation des briques: "rows" ou "cols"
 * - "rows" Empile en ligne (vertical)
 * - "cols" Non supporté, Empile en colonnes (horizontal)
 * 
 * ##selector
 * @code{.js}
 * { selector : null }
 * @endcode
 * Selecteurs des lignes d'éléments
 * - ["#a", "#b,#c", ...]  Groupes d'éléments
 * - "#a / #b,#c"          Groupes d'éléments sur une ligne
 * 
 * ##size
 * @code{.js}
 * { size : null }
 * @endcode
 * Force la hauteur/largeur des éléments.
 * Si null, la taille n'est pas affectée.
 * 
 * ##wrap
 * @code{.js}
 * { wrap : true }
 * @endcode
 * Les éléments sélectionnés ne seront pas modifiés, un nouvel élément SPAN contiendera les attributs de styles.
 * Utile pour permettre à l'élément source d'utiliser les attributs 'padding' et 'margin' sans affecter la position des éléments.
 * 
 * #Exemple
 * @code{.js}
 * $("#date-layout").stack({
 *     mode:"rows",
 *     selector : [ "#dateLabel", "#beginDate, #endDate" ],
 *     size:[null,"20px"]
 * });
 * @endcode{.js}
 * **/

(function($)
{
    //emplie en lignes
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
            input.attr("value",field.value);
            return input;
        }
        var inputClass = eval(className);
        return $(inputClass.toElement(field.name,field.value,field.label));
        /*
        switch(field.type){
            case 'text':
                input = $('<textarea col="10" rows="5" name="'+field.name+'"></textarea>');
                input.text(field.value);
                break;
            default:
                input = $('<input type="text" name="'+field.name+'" />');
                input.attr("value",field.value);
                break;
        }
        
        switch(field.type){
            case 'date':
                input.datePicker();
                break;
            case 'integer':
            case 'float':
            case 'factor':
                input.spinner();
                break;
        }*/
        
        //
        
    };
    
    //constructeur
    $.fn.form = function(p){
       p = $.extend({
           dialog    : true,
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
    };
    
})(jQuery);

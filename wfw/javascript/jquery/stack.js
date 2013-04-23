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
 * @brief jQuery Stack Plugin
 * @method stack
 * @memberof JQuery
 * 
 * #Introduction
 * Permet d'empiler des éléments HTML de façon semblable à des briques.
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
 * Les éléments sélectionnés ne serons pas modifié, un nouvel élément SPAN contiendera les attributs de styles
 * Utile pour permettre à l'élément source d'utiliser les attributs 'padding' et 'margin' sans affecter la position des éléments
 * 
 * **/
(function($)
{
    //emplie en lignes
    function rowsStack(parent,p){
        parent = $(parent);

        //supprime les textes enfants
        //(evite les espacements non gérés)
        parent.contents().filter(function() {
          return this.nodeType == 3; //Node.TEXT_NODE
        }).remove();

        //lignes depuis un string ?
        var rows = p.selector;
        if(typeof(rows) == "string"){
            rows = strexplode(rows,'/',true);
        }

        //hauteurs normalisés
        var height = $(parent).height() / rows.length;

        //initialise les largeurs
        for(var row in rows){
            var list = $(rows[row]);
            var width  = ($(parent).width() / list.length);

            $.each(list,function(i,node){
                if(p.wrap){
                    var tmp = $("<span></span>");
                    tmp.append(node);
                    node = tmp;
                }
                else
                    node = $(node);
                
                node.css("display","inline-block");
                node.css("width",width+"px");

                if(p.size instanceof String || typeof(p.size)=="string"){
                    node.css("height",p.size);
                }
                if(p.size instanceof Array){
                    if(p.size[row])
                        node.css("height",p.size[row]);
                }
                
                parent.append(node);
            });
        }

    };
    
    //constructeur
    $.fn.stack = function(p){
       p = $.extend({
           mode        : "rows",
           selector    : null,
           size        : null,
           wrap        : true
       },p);

       return this.each(function()
       {
           if(p.mode == "rows")
             rowsStack(this,p);
       });
    };
    
})(jQuery);

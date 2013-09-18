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
 * @brief jQuery XML Utils Plugin
 * @method xml
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
    /**
     * @fn object nodeToObject(Node xml_element, object ar)
     * @memberof Xml
     * 
     * @brief Convertie les enfants d'un élément XML en tableau associatif récursif
     * 
     * @param xml_element L'Élément parent à scanner
     * @param ar          Optionel, tableau associatif à initialiser
     * @return Tableau associatif correspondant à l'élément XML
    */
    $.fn.xmlNodeToObject = function(p){
        var me = $(this);
        var args = arguments;
        var out = {};
    
        function nodeToObject(xml_element,ar)
        {
            //première initialisation ?
            if(typeof(ar)=="undefined")
                ar = {};
            //scan les éléments enfants
            $(xml_element).children("*").each(function(i){
                var node = $(this);
                var name = this.tagName;
                if(node.children("*").length){
                    ar[name]={};
                    nodeToObject(node,ar[name]);
                }
                else
                    ar[name] = node.text();
            });
            return ar;
        }
        
        return nodeToObject(me,out);
    };
})(jQuery);

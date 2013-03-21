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

/*------------------------------------------------------------------------------------------------------------------*/
//
// Initialise le layout
//
/*------------------------------------------------------------------------------------------------------------------*/
MyApp.onInitLayout = function(Y){

    var wfw = Y.namespace("wfw");

    //cache le contenu
    Y.Node.all("#content > *").hide();

    var items=[];
    Y.Node.all(".function").each(function (node){
        //alert(menuPanel.items);
        items.push({
            title: node.one("h2").get("text"),
            contentEl: node.one(".function_content").getDOMNode()
        });
    });

    //
    var menuPanel = Ext.create('Ext.Panel', {
        title: 'Liste des fonctions',
        layout: {
            // layout-specific configs go here
            type: 'accordion',
            titleCollapse: false,
            animate: true,
            activeOnTop: true
        },
        region: 'west',     // position for region
        width: "100%",
        split: true,         // enable resizing
        margins: '0 5 5 5',
        items: items,
        renderTo: "content"
    });
}


//ajoute la fonction a l'initialisation de l'application'
MyApp.Loading.callback_list.push( MyApp.onInitLayout );

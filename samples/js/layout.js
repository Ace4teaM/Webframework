/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
ID-Informatik
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "layout.html"

Implentation: [18-10-2012]
*/

//initialise le contenu
YUI(wfw_yui_config).use('node', 'wfw', 'wfw-layout', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){

        /*
	 * ---------------------------------------------------------------
	 * Initialise une FieldBar personnalisé
	 * ---------------------------------------------------------------
	 */
        var layout = Y.Node.one("#my_layout");
        
        //Initialise une barre de champs depuis un élément INPUT
        wfw.Layout.initElement(layout, {
            w:320,
            h:240
        });
	
        wfw.Layout.setElement(layout,Y.Node.one("#north"),50,"top");
        wfw.Layout.setElement(layout,Y.Node.one("#west"),50,"left");
        wfw.Layout.setElement(layout,Y.Node.one("#east"),50,"right");
        wfw.Layout.setElement(layout,Y.Node.one("#sud"),50,"bottom");
        wfw.Layout.setElement(layout,Y.Node.one("#center"),null,"middle");
	
        wfw.Layout.setPlacement(layout);
    };
    
    Y.one('window').on('load', onLoad);
});
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

Implentation: [04-10-2012]
*/

//initialise le contenu
YUI(wfw_yui_config).use('node', 'wfw', 'wfw-layout', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){

        /*
	 * ---------------------------------------------------------------
	 * Initialise une layout
	 * ---------------------------------------------------------------
	 */
        var layout = Y.Node.one("#my_layout");
        
        //Initialise une barre de champs depuis un élément INPUT
        wfw.Layout.initElement(layout, {
            stretch:true, 
            w:600, 
            h:400
        });
	
        wfw.Layout.setElement(layout,Y.Node.one("#north"),50,"top");
        wfw.Layout.setElement(layout,Y.Node.one("#west"),50,"left");
        wfw.Layout.setElement(layout,Y.Node.one("#east"),50,"right");
        wfw.Layout.setElement(layout,Y.Node.one("#sud"),50,"bottom");
        wfw.Layout.setElement(layout,Y.Node.one("#center"),null,"middle");
	
        wfw.Layout.setPlacement(layout);
	
	
        /*
	 * ---------------------------------------------------------------
	 * Initialise le layout 2
	 * ---------------------------------------------------------------
	 */
        var layout2 = Y.Node.one("#my_layout2");
        
        //Initialise une barre de champs depuis un élément INPUT
        wfw.Layout.initElement(layout2,{
            stretch:true, 
            w:400, 
            h:300
        });
	
        wfw.Layout.setElement(layout2,Y.Node.one("#north2"),null,"top");
        wfw.Layout.setElement(layout2,Y.Node.one("#west2"),null,"left");
        wfw.Layout.setElement(layout2,Y.Node.one("#center2"),null,"middle");
	
        wfw.Layout.setPlacement(layout2);
    };
    
    Y.one('window').on('load', onLoad);
    
    /*
     *Evenements
     **/
    
    Y.one('#stretch').on('click', function(){wfw.Layout.stretch(Y.Node.one('#my_layout')); } );
    Y.one('#stretch_x').on('click', function(){wfw.Layout.stretch_x(Y.Node.one('#my_layout')); } );
    Y.one('#stretch_y').on('click', function(){wfw.Layout.stretch_y(Y.Node.one('#my_layout')); } );
    Y.one('#unstretch').on('click', function(){wfw.Layout.unstretch(Y.Node.one('#my_layout')); } );
    
});
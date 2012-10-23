/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "style.html"

Revisions:
    [11-10-2012] Implentation
*/

//initialise le contenu
YUI(wfw_yui_config).use('node', 'wfw-event', 'wfw-style', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){
		
        //[Ajoute la classe]
        Y.Node.one("#add_btn").on("click",function(e){
            var element = Y.Node.one("#e1");
			
            var className = Y.Node.one("#style_selector").get('value');
            wfw.Style.addClass(element,className);
            element.set("text","Element: "+wfw.Style.getClass(element));
        });
		
        //[Supprime la classe]
        Y.Node.one("#rem_btn").on("click",function(e){
            var element = Y.Node.one("#e1");
			
            var className = Y.Node.one("#style_selector").get('value');
            wfw.Style.removeClass(element,className);
            element.set("text","Element: "+wfw.Style.getClass(element));
        });
		
        //[Possède la classe ?]
        Y.Node.one("#have_btn").on("click",function(e){
            var element = Y.Node.one("#e1");
            var className = Y.Node.one("#style_selector").get('value');
            alert(wfw.Style.haveClass(element,className));
        });
    };

    //onload event
    Y.one('window').on('load', onLoad);
});

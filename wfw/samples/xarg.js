/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "xarg.html"

Revisions:
    [11-10-2012] Implentation
*/

//initialise le contenu
YUI().use('node', 'event', 'xarg', function (Y)
{
	var onLoad = function(e){
		
		//convertie un objet en texte
		var object = {
			foo : "bar",
			hello : "world"
		};
		
		var text = Y.XArg.to_string(object);

		Y.one("#text").append(text);
		
		//convertie un texte en objet
		object = Y.XArg.to_object(text);

		Y.one("#obj").append(wfw.toString(object));
	};

	//onload event
	Y.one('window').on('load', onLoad);
});

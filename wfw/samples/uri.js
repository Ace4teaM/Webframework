/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "uri.html"

Revisions:
    [11-10-2012] Implentation
*/

//initialise le contenu
YUI().use('node', 'event', 'uri', function (Y)
{
	var onLoad = function(e){
		
		var uri = Y.Node.one("window").get("location.href");
		var adr = Y.URI.cut( uri );
		
		if (adr != null) {
			Y.Node.one("#addr").set('text', adr.addr);
			Y.Node.one("#scheme").set('text', adr.scheme);
			Y.Node.one("#authority").set('text', adr.authority);
			Y.Node.one("#path").set('text', adr.path);
			Y.Node.one("#query").set('text', adr.query);
			Y.Node.one("#fragment").set('text', adr.fragment);
		}
		else
			Y.Node.one("body").append('<strong>Invalid address format</strong>');
		
		wfw.puts(adr);
	};

	//onload event
	Y.one('window').on('load', onLoad);
});

/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
ID-Informatik
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "navigator.html"

Revisions:
    [18-10-2012] Implentation
*/

//initialise le contenu
YUI().use('node', 'wfw-navigator', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){
        Y.Node.one("#page_id").set("text", wfw.Navigator.getId());
    };
    
    Y.one('window').on('load', onLoad);
});


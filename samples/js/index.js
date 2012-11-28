/*
(C)2012 AceTeaM. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
Auteur : AUGUEY THOMAS
Mail   : dev@aceteam.org
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "navigator.html"

Implentation: [18-10-2012]
*/

//initialise le contenu
YUI(wfw_yui_config(wfw_yui_base_path)).use('node', 'wfw-navigator', 'wfw-fieldbar', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){
    };
    
    Y.one('window').on('load', onLoad);
});


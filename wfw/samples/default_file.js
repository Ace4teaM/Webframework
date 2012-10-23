/*
(C)2012 AceTeaM. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
Auteur : AUGUEY THOMAS
Mail   : dev@aceteam.org
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "default_file.html"

Implentation: [19-10-2012]
*/

//initialise le contenu
YUI(wfw_yui_config).use('node', 'wfw-xml', 'io', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){
        /*Y.io('./default.xml', {
            method: 'GET',
            on: {
                success: function (id, result) {
            alert("s");
                },
                failure: function (id, result) {
            alert("f");
            alert(result.status);
                }
            }
        });*/
        
            
        var file = new wfw.Xml.DEFAULT_FILE();
        if(file.Initialise("default.xml")){
            Y.Node.one("#title").set("text", file.getValue("title"));
            Y.Node.one("#description").set("text", file.getValue("description"));
            Y.Node.one("#logo").set("src", file.getIndexValue("image","logo"));
        }
    };
    
    Y.one('window').on('load', onLoad);
});


/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
ID-Informatik
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "objet.html"

Implentation: [18-10-2012]
*/

//initialise le contenu
YUI(wfw_yui_config).use('node', 'wfw-document', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){
        // intialise un objet simple
        Y.one("#demo_btn1").on("click",function(){
            //initialise avec des valeurs passés en argument
            var obj = new wfw.OBJECT({
                foo:"bar"
            });
            Y.one("#demo").set("text",wfw.toString(obj,false));
        });
        
        // intialise un objet DIALOG
        Y.one("#demo_btn2").on("click",function(){
            //initialise avec des valeurs passés en argument
            var obj = new wfw.Document.DIALOG({
                center:false,
                onPop:function(){
                    alert("cou");
                }
            });
                
            Y.one("#demo").set("text",wfw.toString(obj,false));
        });

        // intialise un objet DIALOG (avec attributs)
        Y.one("#demo_btn3").on("click",function(){
            //initialise avec des données existantes
            wfw.States.fromId("my_data", {
                center:false, // membre de wfw.Document.DIALOG_BOX
                foo:"bar"     // obj2 accepte des données supplémentaires
            },{
                name : "wfw_document_dialog"
            });
                
            var obj = new wfw.Document.DIALOG("my_data:wfw_document_dialog");
                
            Y.one("#demo").set("text",wfw.toString(obj,false));
        });
    };

    Y.one('window').on('load', onLoad);
});


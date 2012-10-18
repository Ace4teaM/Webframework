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

Revisions:
    [18-10-2012] Implentation
*/

//initialise le contenu
YUI().use('node', 'wfw-document', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){
        Y.one("#demo_btn").on("click",function(){
            //initialise avec des valeurs passés en argument
            var obj = new wfw.Document.DIALOG_BOX({
                center:false,
                onPop:function(){
                    alert("cou");
                }
            });
                
            Y.one("#demo").set("text",wfw.toString(obj,false));
        });
                
        Y.one("#demo_btn2").on("click",function(){
            //initialise avec des données existantes
            wfw.States.fromId("my_data", {
                center:false, // membre de wfw.Document.DIALOG_BOX
                foo:"bar"     // obj2 accepte des données supplémentaires
            });
                
            var obj = new wfw.Document.DIALOG_BOX("my_data");
                
            Y.one("#demo").set("text",wfw.toString(obj,false));
        });
    };

    Y.one('window').on('load', onLoad);
});


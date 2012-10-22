/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
ID-Informatik
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "fieldlist.html"

Implentation: [22-10-2012]
*/

//initialise le contenu
YUI(wfw_yiu_config).use('node', 'event', 'wfw-fieldlist', function (Y)
{
    var wfw = Y.namespace("wfw");

    var onLoad = function(e){
        wfw.FieldList.initElement(Y.Node.one('#list'));
        
        Y.Node.one('#newFieldBtn').on("click",function()
        {
            switch(wfw.FieldList.insert(Y.one('#list'),Y.one('#add_field').get("value")))
            {
                case null:
                    alert("Le maximum de champs initialisable est atteint");
                    break;
                case "empty":
                    alert("Un champ ne peut être ajouté si il est vide !");
                    break;
            }
        });
    };
    Y.one('window').on('load', onLoad);
});


/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
ID-Informatik
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "dialog.html"

Revisions:
    [17-10-2012] Implentation
*/

//initialise le contenu
YUI().use('node', 'document', function (Y)
{
	var onLoad = function(e){
        //direct print "Nouveau dialogue"
        var dlg = Y.Document.print("First content");
        dlg.parent_node.on("click", function (e, p) { Y.Document.closeDialog(); }, null, dlg);

        ///dialog 1 "Classe CSS personnalisée"
        var dlg = $new(Y.Document.DIALOG, {
            cssClass: "wfw_ext_dialog-content test_dialog",
            onInit: function () {
                this.print("print");
                this.parent_node.on("click", function (e, p) { Y.Document.closeDialog(); }, null, dlg);
            }
        });
        Y.Document.insertDialog(dlg,null,"visible");

        ///dialog 2 "Simple"
        var dlg = $new(Y.Document.DIALOG, {
            onInit: function () {
                this.print("world");
                this.print("hello");
                this.parent_node.on("click", function (e, p) { Y.Document.closeDialog(); }, null, dlg);
            }
        });
        Y.Document.insertDialog(dlg, null, "visible");

        //direct print "Dialogue existant"
        Y.Document.print("Additional content");

        ///dialog 3 "Titre + boutons de choix"
        var dlg = $new(Y.Document.DIALOG_BOX, {
            title: "Pile des dialogues",
            onInit: function () {
                this.print("world");
                this.print("hello");
                this.print("-----");
            },
            onOK: {
                clickEvent: function (e, dlg) {
                    for (var x in Y.Document.dialogStack)
                        dlg.print(x + "=" + objGetAtt(Y.Document.dialogStack[x], "id"));
                },
                buttonText: "Actualiser",
                autoClose: false
            },
            onCancel: {
                clickEvent: function (e, dlg) {
                    Y.Document.confirm("Sur ?",
                        function (e, dlg) { Y.Document.messageBox("ok"); },
                        function (e, dlg) { Y.Document.messageBox("humm..."); }
                    );
                },
                buttonText: "Fermer"
            }
        });
        Y.Document.insertDialog(dlg, null, "visible");
	};
    
	Y.one('window').on('load', onLoad);
});


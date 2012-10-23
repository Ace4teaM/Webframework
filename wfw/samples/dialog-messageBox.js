/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
ID-Informatik
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "dialog-messageBox.html"

Implentation: [17-10-2012]
*/

//initialise le contenu
YUI(wfw_yui_config).use('node', 'wfw-document', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    // Vérouille un élément à l'écran
    Y.Node.one("#LockElement").on("click", function (e,p) {
        wfw.Document.lockElement(
            Y.Node.one("#messageBox"),
            {
                title: "Répondez à cette question ...",
                onOK: function (element) {//OK
                    wfw.Document.messageBox("Cool ;)");
                },
                onCancel: function (element) {//Cancel
                    wfw.Document.messageBox("Dommage !");
                }
            }
        );
    });
    /*
    function MessageBox() {
        wfw.ext.document.messageBox("First Message");
        wfw.ext.document.print("(This message box has been stacked in the first)");
        //empile une seconde boite de dialogue
        wfw.ext.document.messageBox("Second message");
    }
    function LockFrame() {
        wfw.ext.document.lockFrame(
            "dialog_content.html",
            {
                onOK: function (doc) {//OK
                    var input = docGetElement(doc, "input");
                    wfw.ext.document.messageBox("Vous avez entrée: '" + objGetAtt(input, "value") + "'");
                },
                onCancel: function (doc) {//Annuler
                }
            }
        );
    }
    function LoadingBox() {
        wfw.ext.document.LoadingBox(
            function(e){//printEvent
                //executez votre procédure ici... (synchrone)
                // [...envoyer une requete quelconque...]
                wfw.request.Add(null, "../wfw/req/version.php", null, wfw.utils.onCheckRequestResult_XARG, null, false);
            }
        );
    }
    function LockImage() {
        wfw.ext.document.lockImage("http://i45.servimg.com/u/f45/13/35/93/61/bf3_fu11.jpg");
    }
*/
});


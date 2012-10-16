/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        Author: AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    DataType
    Verification des formats de données

    JS  Dependences: base.js
    YUI Dependences: base, node, request

    Revisions:
        [16-10-2012] Implementation
*/

YUI.add('document', function (Y, NAME) {
    Y.Document = {

        /*
            Initialise l'extension
        */
        init: function () {

            return true;
        },

        /*
            * Affiche un message de rêquete en interne
            */ 
        showRequestMsg : function (obj, msg, debug) {
            var bMsg = (obj.user != null && typeof (obj.user["no_msg"]) == "undefined") ? 1 : 0;

            if (bMsg && (typeof (wfw.ext) == "object")) {
                this.messageBox(msg);
            }

            //debug
            wfw.puts("[" + obj.url + "] " + msg);
            if (typeof (debug) == "string")
                wfw.puts(debug);

            return true;
        }
    };
        
    //initialise
    Y.Document.init();
    
}, '1.0', {
      requires:['base', 'node', 'request']
});

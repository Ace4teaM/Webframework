/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    Resultat de procedure

    JS  Dependences: base.js
    YUI Dependences: base

    Implementation: [17-10-2012]
*/

YUI.add('wfw-result', function (Y) {
    var wfw = Y.namespace('wfw');
    
    wfw.Result = {
        Ok      : "ERR_OK",
        Success : "ERR_OK",
        Failed  : "ERR_FAILED",
        ERR_OK : 0,
        ERR_FAILED : 1,
        /**
            Objet de resultat
        
            Implémente:
                WFW.OBJECT
            Membres:
                [string] error      : Status numerique
                [string] error_str  : Status textuel
                [object] args       : Tableau associatif des arguments additionnels
        */
        RESULT : function(att){
            //OBJECT
            this.ns            = "wfw_result";
            //
            this.error         = 0;
            this.error_str     = "no_error";
            this.args          = null;

            /*
            * Constructeur
            */
            wfw.Result.RESULT.superclass.constructor.call(this, att);
        },
        
        /*
         * Crée un objet résultat depuis un objet X-Argument
         **/
        fromXArg : function(xarg_object){
            return new wfw.Request.RESULT({
                error:xarg_object.error, 
                error_str:xarg_object.error_str, 
                args:xarg_object
            });
        },

        /*
         * Crée un objet résultat depuis un objet XML
         **/
        fromXML : function(xml_object){
            return null;
        }
    };
    
    /*-----------------------------------------------------------------------------------------------------------------------
    * RESULT Class Implementation
    *-----------------------------------------------------------------------------------------------------------------------*/

    Y.extend(wfw.Result.RESULT, wfw.OBJECT);

    //retourne la valeur d'un argument
    wfw.Result.RESULT.prototype.getArg = function(name){
        return (typeof(this.args)!=null && typeof(this.args[name])!="undefined" ? this.args[name] : "");
    };
    
}, '1.0', {
    requires:['base']
});

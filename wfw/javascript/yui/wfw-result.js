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

    Revisions:
        [17-10-2012] Implementation
*/

YUI.add('result', function (Y) {
    Y.Result = {
        ERR_OK : 0,
        ERR_FAILED : 1,
        /**
            Objet de resultat
            Membres:
                [string] error      : Status numerique
                [string] error_str  : Status textuel
                [object] args       : Tableau associatif des arguments additionnels
        */
        RESULT : {
            error             : 0,
            error_str         : "no_error",
            args              : null,

            //constructeur
            _construct : function(obj){
            },

            //retourne la valeur d'un argument
            getArg : function(name){
                return (typeof(this.args)!=null && typeof(this.args[name])!="undefined" ? this.args[name] : "");
            }
        },
        
        /*
         * Crée un objet résultat depuis un objet X-Argument
         **/
        fromXArg : function(xarg_object){
            return $new(this.RESULT,{error:xarg_object.error, error_str:xarg_object.error_str, args:xarg_object});
        },

        /*
         * Crée un objet résultat depuis un objet XML
         **/
        fromXML : function(xml_object){
            return null;
        }

    };
}, '1.0', {
      requires:['base']
});

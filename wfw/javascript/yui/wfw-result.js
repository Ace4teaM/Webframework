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
    
    /**
     * @class Result
     * @memberof wfw
     * @brief Interface de résultat
     * */
    wfw.Result = {
        Ok      : "ERR_OK",
        Success : "ERR_OK",
        Failed  : "ERR_FAILED",
        ERR_OK : "ERR_OK",
        ERR_FAILED : "ERR_FAILED",
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
            this.result        = "ERR_OK";
            this.error         = "SUCCESS";
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
            return new wfw.Result.RESULT({
                result:xarg_object.result, 
                error:xarg_object.error, 
                args:xarg_object
            });
        },

        /*
         * Crée un objet résultat depuis un objet XML
         **/
        fromXML : function(xml_object){
            var obj = wfw.Xml.nodeToArray(xml_object);
            return new wfw.Result.RESULT({
                result:obj.result, 
                error:obj.error, 
                args:obj
            });
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
    
    //retourne la valeur d'un argument
    wfw.Result.RESULT.prototype.getError = function(){
        if(this.args && typeof(this.args.txt_error))
            return this.args.txt_error;
        return this.error;
    };
    
    //retourne la valeur d'un argument
    wfw.Result.RESULT.prototype.getResult = function(){
        if(this.args && typeof(this.args.txt_result))
            return this.args.txt_result;
        return this.result;
    };
    
    //retourne la valeur d'un argument
    wfw.Result.RESULT.prototype.getMessage = function(){
        if(this.args && typeof(this.args.txt_message))
            return this.args.txt_message;
        if(this.args && typeof(this.args.message))
            return this.args.message;
        return "";
    };
    
}, '1.0', {
    requires:['base', 'wfw-xml']
});

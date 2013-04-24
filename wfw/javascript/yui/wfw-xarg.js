/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    X-Arguments

    JS  Dependences: base.js
    YUI Dependences: base, node, wfw, wfw-uri, wfw-request

    Implementation: [11-10-2012]
*/

YUI.add('wfw-xarg', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class XArg
     * @memberof wfw
     * @brief Format d'échange: Simple arguments
     * */
    wfw.XArg = {
        XARG_START_OF_TEXT_CODE : 0x02,
        XARG_END_OF_TEXT_CODE   : 0x03,
        XARG_START_OF_TEXT_CHAR : String.fromCharCode(0x2),
        XARG_END_OF_TEXT_CHAR   : String.fromCharCode(0x3),
        XARG_START_OF_TEXT_URI  : "%02",
        XARG_END_OF_TEXT_URI    : "%03",
            
        /*
                Convertie un texte XARG en objet
                Parametres:
                        [string] text     : Texte au format XARG 
                        [bool]   bencoded : true si le texte "text" est encodé au format d'une URI
                Retourne:
                        [object] Tableau associatif des éléments, null en cas d'erreur
            */
        to_object : function(text,bencoded)
        {
            if(typeof(text)!='string')
                return null;
	
            var rslt = new Object();
            var begin_pos = 0;
            var pos;
            var separator = this.XARG_START_OF_TEXT_CHAR;
            var end       = this.XARG_END_OF_TEXT_CHAR;
	
            if(bencoded){
                separator = this.XARG_START_OF_TEXT_URI;//STX
                end       = this.XARG_END_OF_TEXT_URI;//ETX
            }
	
            while((pos=text.indexOf(separator,begin_pos)) != -1)
            {
                var pos2  = text.indexOf(end,pos);
                if(pos2 == -1){ // fin anticipe
                    wfw.puts("wfw.xarg.to_object(), attention: fin anormale de requete!");
                    return rslt;
                }
	
                //alert(begin_pos+"->"+pos+"\n"+pos+"->"+pos2);

                var name  = text.substr(begin_pos,pos-begin_pos);
                var value = text.substr(pos+separator.length,pos2-(pos+separator.length));

                begin_pos = pos2+end.length; //prochaine position de depart

                rslt[name]=value;
            }
            return rslt;
        },
            
        /*
                Convertie un texte XARG en objet
                Parametres:
                        [object] obj     : Tableau associatif des arguments 
                        [bool]   bencode : true si le texte "text" est encodé au format d'une URI
                Retourne:
                        [string] Texte au format XARG
            */
        to_string : function(obj,bencode){
            if(typeof(obj)!='object')
                return null;
	
            var text = "";
            for(var i in obj){
                text += (""+i+this.XARG_START_OF_TEXT_CHAR+obj[i]+this.XARG_END_OF_TEXT_CHAR);
            }
	
            if(bencode)
                text=wfw.URI.encodeUTF8(text);
	
            return text;
        },
            
        /*
                Obtient le parametre XARG d'une URI
                Parametres:
                        [string] uri     : URI à utiliser. Si null, l'URI du document en cours est utilisé 
                Retourne:
                        [string] Texte au format XARG, en cas d'erreur un numero est retourné
                Remarques:
                        Le texte est lu depuis l'argument "_xarg_" de l'URI
            */
        from_uri : function(uri){
            //si non specifie, utilise l'uri du document en cours
            if(typeof(uri)!='string')
                if(typeof(uri = Y.Node.one("window").get("location.href"))!='string')
                    return -1;
            //en objet...
            var uri_obj = wfw.URI.cut(uri);
            if(uri_obj==null)
                return -2;
            if(empty(uri_obj.query))
                return -3;
            var uri_query = wfw.URI.query_to_object(uri_obj.query,true);
            if(typeof(uri_query['_xarg_'])!="string")
                return -4;
            //convertie la chene _xarg_
            return uri_query['_xarg_'];
        },
            
    
        /*
            Vérifie et traite le résultat d'une requête XARG
            Parametres:
                [object]   obj     : L'Objet requête (retourné par wfw.request.Add)
            User Parametres:
                [function] onsuccess(obj,args) : Optionnel, callback en cas de succès
                [function] onfailed(obj,args)  : Optionnel, callback en cas de échec
                [function] onerror(obj)        : Optionnel, callback en cas d'erreur de transmition de la requête
                [string]   no_msg              : Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
                [string]   no_result           : Si spécifié, le contenu du fichier est retourné sans traitement des erreurs
                [string]   no_output           : Si spécifié, aucun dialogue d'erreur n'est affiché
            Retourne:
                rien
            Remarques:
                La variable args des callbacks onsuccess et onfailed passes les arguments XARG en objet 
                onCheckRequestResult_XARG reçoit un format XARG en reponse, il convertie en objet puis traite le résultat
                En cas d'erreur, l'erreur est traité et affiché par la fonction wfw.Document.showRequestMsg (voir documentation)
                En cas d'echec, l'erreur est traité et affiché par la fonction wfw.Form.onFormResult (voir documentation)
                [Le nom de la form utilisé pour le résultat est définit par l'argument 'wfw_form_name' (si définit) sinon le nom de l'objet de requête]
            */
           
           /**
            * @todo Rename onCheckRequestResult_XARG by onCheckRequestResult 
            */
        onCheckRequestResult : function (obj) { return wfw.XArg.onCheckRequestResult_XARG(obj); },
        onCheckRequestResult_XARG : function (obj) {
            var param = object_merge({
               no_result : false,                   // Si spécifié, le contenu du fichier est retourné sans traitement des erreurs
               no_msg    : true,                    // Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
               onsuccess : function(obj,args){}, // Optionnel, callback en cas de succès
               onfailed  : function(obj,args){}, // Optionnel, callback en cas de échec
               onerror   : function(obj){},         // Optionnel, callback en cas d'erreur de transmition de la requête
               wfw_form_name : "formName"           // Optionnel, nom associé à l'élément FORM recevant les données de retours
            },obj.user);
            
            if (!wfw.Request.onCheckRequestStatus(obj))
                return;

            //resultat ?
            var args = wfw.XArg.to_object(obj.response, false);
            if (!args) {
                if (!param.no_msg)
                    wfw.Document.showRequestMsg(obj, "Erreur de requête", obj.response);
                param.onerror(obj);
                return;
            }

            //non x-argument result !
            if ((!param.no_result) && typeof(args.result) == 'undefined') {
                if (!param.no_msg)
                    wfw.Document.showRequestMsg(obj, "Résultat de requête non spécifié", obj.response);
                param.onerror(obj);
                return;
            }

            //erreur ?
            if ((!param.no_result) && (args.result != "ERR_OK")) {
                //message
                if (!param.no_msg){
                    var result_form_id = ((typeof obj.args["wfw_form_name"] == "string") ? obj.args.wfw_form_name : obj.name);
                    wfw.Form.onFormResult(result_form_id, args, obj);
                }
                //failed callback
                param.onfailed(obj, args);
                return;
            }

            //success callback
            param.onsuccess(obj, args);
        }
    };
}, '1.0', {
    requires:['base','node','wfw','wfw-uri','wfw-request','wfw-document','wfw-result']
});

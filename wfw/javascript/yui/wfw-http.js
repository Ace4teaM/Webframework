/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    HTTP Request Interface

    JS  Dependences: base.js
    YUI Dependences: base, node, wfw, wfw-uri

    Revisions:
        [11-10-2012] Implementation
*/

YUI.add('wfw-http', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class HTTP
     * @memberof wfw
     * @brief Fonctions de base des requêtes HTTP
     * */
    wfw.HTTP = {
        /*
         * Globals
         */
        httpRequest  : null, // l'objet HttpRequest (utilisé pour les requetes synchrones uniquement)
        http_user    : "",
        http_pwd     : "",

        /*
            Classe Part de requête
            Implémente:
                WFW.OBJECT
            Membres:
                [array]  headers  : Tableau associatif des en-têtes HTTP
                [string] data     : Données
        */
        HTTP_REQUEST_PART : function(att) {
            //OBJECT
            this.ns         = "wfw_http";
            //HTTP_REQUEST_PART
            this.headers  = [];
            this.data     = "";
            
            /*
             * Constructeur
             */
            wfw.HTTP.HTTP_REQUEST_PART.superclass.constructor.call(this, att);
            
        },

        /*
         *Initialise l'interface HTTP
         **/
        init : function(){
            
            // assigne l'interface a l'objet WebFrameWork
            this.httpRequest = this.createHttpRequest();
            this.http_user = "";
            this.http_pwd = "";
            
            
            //debug
            if (this.httpRequest==null){
                wfw.puts("Error creating the XMLHttpRequest object.");
                return false;
            }
            
            return true;
        },
        
        /**
         * @brief Initialise une interface XMLHttpRequest
         * @return XMLHttpRequest Instance de la classe XMLHttpRequest
         * @retval false La fonction à échouée
         **/
        createHttpRequest : function(){
            var http;
            
            // Mozilla, Safari, ...
            try
            {
                http = new XMLHttpRequest();
            }
            //IE
            catch(e1)
            {
                try{
                    http = new ActiveXObject("Microsoft.XMLHTTP");
                    /*var versions = new Array(
                        "MSXML2.XMLHTTP.6.0",
                        "MSXML2.XMLHTTP.5.0",
                        "MSXML2.XMLHTTP.4.0",
                        "MSXML2.XMLHTTP.3.0",
                        "MSXML2.XMLHTTP",
                        "Microsoft.XMLHTTP'
                    );
                    //test pour toutes les versions connues
                    for(var i=0; i<versions.length && this.httpRequest==null; i++){
                        try{ 
                            http = new ActiveXObject(versions[i]);
                        } 
                        catch(e){
                        }
                    }*/
                }
                catch(e2)
                {
                    wfw.puts("Error creating the ActiveXObject('Microsoft.XMLHTTP') object.");
                    wfw.checkError(e1);
                    wfw.checkError(e2);
                }
                
            }

            //debug
            if (http==null)
                return false;
            
            return http;
        },
        
        /*
            Assigne un nom d'utilisateur et un mot de passe aux demandes de requêtes sécurisées
            Arguments:
                [string] usr : Nom d'utilisateur
                [string] pwd : Mot de passe
            Retourne:
                [bool] true
        */
        authentication : function(usr,pwd){
            this.http_user = usr;
            this.http_pwd = pwd;
            return true;
        },


        /*
            Retourne le statut HTTP de la dernière requête
            Retourne:
                [int] Code de statut HTTP
        */
        getResponseStatus : function(){
            return this.httpRequest.status;
        },

        /*
            Retourne la réponse en cours au format texte ou binaire suivant le type MIME rencontré
            Retourne:
                [string] Corps de la requête
        */
        getResponse : function(){
            //wfw.Request.print();
            //wfw.puts('this.getResponse: '+this.httpRequest.status);
            if(this.httpRequest.status != 200)
                return null;
            //attention a ne pas utiliser this.httpRequest.responseText avec un contenu autre que du texte, ceci engendre un bug
            switch(MIME_lowerType(this.httpRequest.getResponseHeader('Content-type'))){
                case 'application':
                case 'text':
                    return this.httpRequest.responseText;
                case 'xml':alert('xml');
                    return this.httpRequest.responseXML;
                default:
                    return this.httpRequest.responseBody;
            }
        },

        getReqResponse : function(req){
            //wfw.Request.print();
            //wfw.puts('this.getResponse: '+this.httpRequest.status);
            if(req.status != 200)
                return null;
            //attention a ne pas utiliser this.httpRequest.responseText avec un contenu autre que du texte, ceci engendre un bug
            switch(MIME_lowerType(req.getResponseHeader('Content-type'))){
                case 'application':
                case 'text':
                    return req.responseText;
                case 'xml':alert('xml');
                    return req.responseXML;
                default:
                    return req.responseBody;
            }
        },
        /*
            Envoie une requête HTTP avec méthode GET (bloquante)
            Arguments:
                [string] url : URL de requête
            Retourne:
                [string] Réponse, null si une exception est survenue
            Remarques:
                Attention: IE9 n'actualise pas le cache du navigateur (même si l'header Cache-Control est passé), voir BUG 'wfw-ie9_get_request_cache_control'
        */
        get : function(url){
            try{
                //Ceci est l'unique solution trouvé pour actualiser le cache sous I.E
                //Cette solution doit être provisoire.
                //En effet, l'ajout d'un argument à l'uri peut provoquer un comportement inattendu dans un script serveur
                //(ne pas utiliser URI.remakeURI, qui ne prend pas encharge les chemins sans nom de domaine)
                url += ((url.indexOf('?')!=-1) ? "&" : "?")+"random="+(parseInt(Math.random()*1000).toString());
                //
                this.httpRequest.onreadystatechange = null;//pas de callback (important)
                this.httpRequest.open('GET', url, false, this.http_user, this.http_pwd);
                this.httpRequest.setRequestHeader("Cache-Control","no-cache, must-revalidate"); 
                this.httpRequest.send(null);

                return this.getResponse();
            }
            catch(e){
                return null;
            }
        },
        
        /*
            Envoie une requête HTTP avec méthode POST (bloquante)
            Argument:
                [string] url    : URL de requête
                [object] params : Tableau associatif ou URI encodée des paramètres
            Retourne:
                [string] Réponse
        */
        post : function(url, params) {
            //this.httpRequest = this.createHttpRequest();
            try{
                if(typeof(params)=='object')
                    params = wfw.URI.object_to_query(params/*,true*/);//encode l'UTF 8
                this.httpRequest.onreadystatechange = null;//pas de callback (important)
                this.httpRequest.open('POST', url, false, this.http_user, this.http_pwd);
                this.httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                //this.httpRequest.setRequestHeader("Content-length", params.length);
                this.httpRequest.setRequestHeader("Cache-Control","no-cache"); 
                //this.httpRequest.setRequestHeader("Connection", "close");
                this.httpRequest.send(params);

                return this.getResponse();
            }
            catch(e){
                return null;
            }
        },
        
        /*
            Envoie une requête POST multipart (bloquante)
            Argument:
                [string] url            : URL de requête
                [array]  contents       : Tableau indexé des contenus (HTTP_REQUEST_PART)
                [string] multipart_type : Optionnel, type MIME multipart. Par défault "form-data" (voir remarques)
            Retourne:
                [string] Réponse
            Remarques:
                L'Argument 'multipart_type' définit un des types MIME multipart standard : (mixed, digest, alternative, parallel) ou étendu : (encrypted, byteranges, etc...)
        */
        post_multipart : function(url, contents, multipart_type) {
            //this.httpRequest = this.createHttpRequest();
            try{
                var boundary_keyword = "end-of-body";

                if(typeof(multipart_type)=="undefined")
                    multipart_type="form-data";

                this.httpRequest.onreadystatechange = null;//pas de callback (important)
                this.httpRequest.open('POST', url, false, this.http_user, this.http_pwd);
                this.httpRequest.setRequestHeader("Content-type", "multipart/"+multipart_type+"; boundary="+boundary_keyword);
                this.httpRequest.setRequestHeader("MIME-Version", "1.0");
                this.httpRequest.setRequestHeader("Cache-Control","no-cache"); 
                // ajoute les contenus (HTTP_REQUEST_PART) à la requête
                var body = "";
                for(var x in contents)
                {
                    var content = contents[x];
                    body += "--"+boundary_keyword+"\r\n";
                    for(var y in content.headers)
                        body += content.headers[y]+"\r\n";
                    body += "\r\n"/* + "\r\n"*/;
                    body += content.data+"\r\n";
                }
                // fin de la requête
                body += "--"+boundary_keyword+"\r\n";
                //envoie
                this.httpRequest.send(body);

                return this.getResponse();
            }
            catch(e){
                return null;
            }
        },
        
        /*
            Envoie une requête POST multipart (non-bloquante)
            Argument:
                [string]   url            : URL de requête
                [array]    contents       : Tableau indexé des contenus (HTTP_REQUEST_PART)
                [string]   multipart_type : Type MIME multipart. Par défault "form-data" (voir remarques)
                [function] callback(e,context)   : Fonction de rappel (appelé dans le context XMLHttpRequest)
                [function] context       : Context de données passé au callback
            Retourne:
                [bool] true
            Remarques:
                L'Argument 'multipart_type' définit un des types MIME multipart standard : (mixed, digest, alternative, parallel) ou étendu : (encrypted, byteranges, etc...)
        */
        post_multipart_async : function (url, contents, multipart_type, callback, context) {
            // Instancie une nouvelle interface XMLHTTpRequest
            // Attention: Dans le cas contraire, la requete en cours Asynchrone annule la requete précédente (si elle n'est pas terminé)
            var http = this.createHttpRequest();
            //prepare le contenu
            var crlf = "\r\n";
            var boundary_keyword = "end-of-body";

            if(typeof(multipart_type)=="undefined")
                multipart_type="form-data";

            http.onreadystatechange = function(e){return callback.call(http,e,context)};
            http.open('POST', url, true, this.http_user, this.http_pwd);
            http.setRequestHeader("Content-type", "multipart/"+multipart_type+"; boundary="+boundary_keyword);
            http.setRequestHeader("MIME-Version", "1.0");
            http.setRequestHeader("Cache-Control","no-cache"); 
            // ajoute les contenus (HTTP_REQUEST_PART) à la requête
            var body = "";
            for(var x in contents)
            {
                var content = contents[x];
                body += "--" + boundary_keyword + crlf;
                for(var y in content.headers)
                    body += content.headers[y] + crlf;
                body += crlf;
                body += content.data + crlf;
            }
            // fin
            body += "--" + boundary_keyword + "--" + crlf;
            /*
            wfw.puts("body=\n");
            wfw.puts(body);
            */
            http.send(body);
            return true;
        },
        
        /*
            Requete GET (non-bloquante)
            Argument:
                [string]   url      : URL de requête
                [function] callback(e,context)   : Fonction de rappel (appelé dans le context XMLHttpRequest)
                [function] context       : Context de données passé au callback
            Retourne:
                [bool] true
        */
        get_async : function(url, callback, context){
            // Instancie une nouvelle interface XMLHTTpRequest
            // Attention: Dans le cas contraire, la requete en cours Asynchrone annule la requete précédente (si elle n'est pas terminé)
            var http = this.createHttpRequest();
            //Ceci est l'unique solution trouvé pour actualiser le cache sous I.E
            //Cette solution doit être provisoire.
            //En effet, l'ajout d'un argument a l'uri peut provoquer un comportement inattendu dans un script serveur
            //(ne pas utiliser URI.remakeURI, qui ne prend pas encharge les chemins sans nom de domaine)
            url += ((url.indexOf('?')!=-1) ? "&" : "?")+"random="+(parseInt(Math.random()*1000).toString());
            //
            http.onreadystatechange = function(e){return callback.call(http,e,context)};
            http.open('GET', url, true, this.http_user, this.http_pwd);
            http.setRequestHeader("Cache-Control","no-cache"); 
            http.send(null);
            return true;
        },
        
        /*
            Requete POST (non-bloquante)
            Argument:
                [string]   url      : URL de requête
                [object]   params   : Tableau associatif ou URI encodée des paramètres
                [function] callback(e,context)   : Fonction de rappel (appelé dans le context XMLHttpRequest)
                [function] context       : Context de données passé au callback
            Retourne:
                [bool] true
        */
        post_async : function(url, params, callback, context) {
            // Instancie une nouvelle interface XMLHTTpRequest
            // Attention: Dans le cas contraire, la requete en cours Asynchrone annule la requete précédente (si elle n'est pas terminé)
            var http = this.createHttpRequest();
            //
            if(typeof(params)=='object')
                params = wfw.URI.object_to_query(params/*,true*/);//encode l'UTF 8
            http.onreadystatechange = function(e){return callback.call(http,e,context)};
            http.open('POST', url, true, this.http_user, this.http_pwd);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //http.setRequestHeader("Content-length", params.length);
            http.setRequestHeader("Cache-Control","no-cache"); 
            //http.setRequestHeader("Connection", "close");
            http.send(params);
            return true;
        }
    };
    
    
    /*-----------------------------------------------------------------------------------------------------------------------
     * HTTP_REQUEST_PART Class Implementation
     *-----------------------------------------------------------------------------------------------------------------------*/
    
    Y.extend(wfw.HTTP.HTTP_REQUEST_PART, wfw.OBJECT);

    /*-----------------------------------------------------------------------------------------------------------------------
     * Initialise
     -----------------------------------------------------------------------------------------------------------------------*/
    wfw.HTTP.init();
    
}, '1.0', {
      requires:['base','node','wfw','wfw-uri']
});

/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2013 Thomas AUGUEY <contact@aceteam.org>
    ---------------------------------------------------------------------------------------------------------------------------------------
    This file is part of WebFrameWork.

    WebFrameWork is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WebFrameWork is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WebFrameWork.  If not, see <http://www.gnu.org/licenses/>.
    ---------------------------------------------------------------------------------------------------------------------------------------
*/


/*
 * Implémentation native de l'objet IXMLHTTPRequest
 **/

/**
 * @brief Crée l'object natif XMLHttpRequest
 * @return Object XMLHttpRequest
 * @retval false Echec de la procédure, voir cResult::getLast pour plus d'informations
 **/
function http_create(){
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
            return RESULT(cResult.Failed,"HTTP_CREATE_XML_REQUEST",{message:e2});
        }

        //debug
        if(http==null)
           return RESULT(cResult.Failed,"HTTP_CREATE_XML_REQUEST",{message:"ActiveXObject Microsoft.XMLHTTP"});

    }

    //debug
    if(http==null)
       return RESULT(cResult.Failed,"HTTP_CREATE_XML_REQUEST",{message:"XMLHttpRequest"});

    RESULT_OK();
    return http;
}


/*
    @brief Retourne la réponse d'une requête HTTP
    @param http   [IXMLHTTPRequest] Objet de la requête
    @return Réponse de la requête. Peut être un objet suivant le type MIME retourné (XML,Text)
    @retval false Echec de la procédure, voir cResult::getLastpour plus d'informations
*/
function http_response(http) {
    
    if(http.status != 200)
        return RESULT(cResult.Failed,"HTTP_REQ_STATUS",{status:http.status});
       
    RESULT_OK();
    
    //attention a ne pas utiliser this.httpRequest.responseText avec un contenu autre que du texte, ceci engendre un bug
    switch(MIME_lowerType(http.getResponseHeader('Content-type'))){
        case 'application':
        case 'text':
            return http.responseText;
        case 'xml':
            return http.responseXML;
        default:
            return http.responseBody;
    }
}


/*
    @brief Envoie une requête HTTP avec méthode GET (bloquante)
    @param http   [IXMLHTTPRequest] Objet de la requête
    @param url    [string] URL de requête
    @param user   [string] Nom d'utilisateur en cas d'authentification
    @param pwd    [string] Mot-de-passe en cas d'authentification
    @return Réponse de la requête. Peut être un objet suivant le type MIME retourné (XML,Text)
    @retval false Echec de la procédure, voir cResult::getLastpour plus d'informations
*/
function http_get(http,url,user,pwd){
    try{
        //Ceci est l'unique solution trouvé pour actualiser le cache sous I.E
        //Cette solution doit être provisoire.
        //En effet, l'ajout d'un argument à l'uri peut provoquer un comportement inattendu dans un script serveur
        //Note: Ne pas utiliser < uri_paste >, qui ne prend pas encharge les chemins sans nom de domaine
        url += ((url.indexOf('?')!=-1) ? "&" : "?")+"random="+(parseInt(Math.random()*1000).toString());
        //
        http.onreadystatechange = null;//pas de callback (important)
        http.open('GET', url, false, user, pwd);
        http.setRequestHeader("Cache-Control","no-cache, must-revalidate"); 
        http.send(null);

        return http_response(http);
    }
    catch(e){
        return RESULT(cResult.Failed,"HTTP_REQ_SEND",{message:e});
    }
}

/*
    @brief Envoie une requête HTTP avec méthode GET (non-bloquante)
    @param url                 [string] URL de requête
    @param callback(e,context) [string] Fonction de rappel (appelé dans le context XMLHttpRequest)
    @param context             [string] Context de données passé au callback
    @param user                [string] Nom d'utilisateur en cas d'authentification
    @param pwd                 [string] Mot-de-passe en cas d'authentification
    @return Résultat de la procèdure
    @retval true Succès de la procédure
    @retval false Echec de la procédure, voir cResult::getLastpour plus d'informations
*/
function http_get_async(url, callback, context, user, pwd){
    // Instancie une nouvelle interface XMLHTTpRequest
    // Attention: Dans le cas contraire, la requete en cours Asynchrone annule la requete précédente (si elle n'est pas terminé)
    var http = http_create();
    if(!http)
        return false;
    //Ceci est l'unique solution trouvé pour actualiser le cache sous I.E
    //Cette solution doit être provisoire.
    //En effet, l'ajout d'un argument a l'uri peut provoquer un comportement inattendu dans un script serveur
    //(ne pas utiliser URI.remakeURI, qui ne prend pas encharge les chemins sans nom de domaine)
    url += ((url.indexOf('?')!=-1) ? "&" : "?")+"random="+(parseInt(Math.random()*1000).toString());
    //
    http.onreadystatechange = function(e){return callback.call(http,e,context)};
    http.open('GET', url, true, user, pwd);
    http.setRequestHeader("Cache-Control","no-cache"); 
    http.send(null);

    return RESULT_OK();
}


/*
    @brief Envoie une requête HTTP avec méthode POST (bloquante)
    @param http   [IXMLHTTPRequest] Objet de la requête
    @param url    [string] URL de requête
    @param params [object] Tableau associatif ou URI encodée des paramètres
    @param user   [string] Nom d'utilisateur en cas d'authentification
    @param pwd    [string] Mot-de-passe en cas d'authentification
    @return Réponse de la requête. Peut être un objet suivant le type MIME retourné (XML,Text)
    @retval false Echec de la procédure, voir cResult::getLastpour plus d'informations
*/
function http_post(http, url, params, user, pwd) {
    try{
        if(typeof(params)=='object')
            params = uri_object_to_query(params,uri_encodeUTF8);
        http.onreadystatechange = null;//pas de callback (important)
        http.open('POST', url, false, user, pwd);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //http.setRequestHeader("Content-length", params.length);
        http.setRequestHeader("Cache-Control","no-cache"); 
        //http.setRequestHeader("Connection", "close");
        http.send(params);

        return http_response(http);
    }
    catch(e){
        return RESULT(cResult.Failed,"HTTP_REQ_SEND",{message:e});
    }
}


/*
    @brief Envoie une requête HTTP avec méthode POST (non-bloquante)
    @param url                 [string] URL de requête
    @param paramst             [object] Tableau associatif ou URI encodée des paramètres
    @param callback(e,context) [string] Fonction de rappel (appelé dans le context XMLHttpRequest)
    @param context             [string] Context de données passé au callback
    @param user                [string] Nom d'utilisateur en cas d'authentification
    @param pwd                 [string] Mot-de-passe en cas d'authentification
    @return Résultat de la procèdure
    @retval true Succès de la procédure
    @retval false Echec de la procédure, voir cResult::getLastpour plus d'informations
*/
function http_post_async(url, params, callback, context, user, pwd) {
    // Instancie une nouvelle interface XMLHTTpRequest
    // Attention: Dans le cas contraire, la requete en cours Asynchrone annule la requete précédente (si elle n'est pas terminé)
    var http = http_create();
    if(!http)
        return false;
    //
    if(typeof(params)=='object')
        params = uri_object_to_query(params,uri_encodeUTF8);
    http.onreadystatechange = function(e){return callback.call(http,e,context)};
    http.open('POST', url, true, user, pwd);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //http.setRequestHeader("Content-length", params.length);
    http.setRequestHeader("Cache-Control","no-cache"); 
    //http.setRequestHeader("Connection", "close");
    http.send(params);

    return RESULT_OK();
}


/**
    @brief Envoie une requête HTTP avec méthode POST multipart (bloquante)
    @param http           [IXMLHTTPRequest] Objet de la requête
    @param url            [string] URL de requête
    @param contents       [object] Tableau indexé des contenus {headers:[],data}
    @param multipart_type [string] Type MIME multipart. Par défault "form-data" (voir remarques)
    @param user           [string] Nom d'utilisateur en cas d'authentification
    @param pwd            [string] Mot-de-passe en cas d'authentification
    @remarks 'multipart_type' définit un des types MIME multipart standard : (mixed, digest, alternative, parallel) ou étendu : (encrypted, byteranges, etc...)
    @return Réponse de la requête. Peut être un objet suivant le type MIME retourné (XML,Text)
    @retval false Echec de la procédure, voir cResult::getLastpour plus d'informations
*/
function http_post_multipart(http, url, contents, multipart_type, user, pwd) {
    try{
        var boundary_keyword = "end-of-body";

        if(typeof(multipart_type)=="undefined")
            multipart_type="form-data";

        http.onreadystatechange = null;//pas de callback (important)
        http.open('POST', url, false, user, pwd);
        http.setRequestHeader("Content-type", "multipart/"+multipart_type+"; boundary="+boundary_keyword);
        http.setRequestHeader("MIME-Version", "1.0");
        http.setRequestHeader("Cache-Control","no-cache"); 
        
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
        http.send(body);

        return http_response(http);
    }
    catch(e){
        return RESULT(cResult.Failed,"HTTP_REQ_SEND",{message:e});
    }
}

/**
    @brief Envoie une requête HTTP avec méthode POST multipart (non-bloquante)
    @param url                 [string] URL de requête
    @param contents            [object] Tableau indexé des contenus {headers:[],data}
    @param multipart_type      [string] Type MIME multipart. Par défault "form-data" (voir remarques)
    @param callback(e,context) [string] Fonction de rappel (appelé dans le context XMLHttpRequest)
    @param context             [string] Context de données passé au callback
    @param user                [string] Nom d'utilisateur en cas d'authentification
    @param pwd                 [string] Mot-de-passe en cas d'authentification
    @remarks 'multipart_type' définit un des types MIME multipart standard : (mixed, digest, alternative, parallel) ou étendu : (encrypted, byteranges, etc...)
    @return Résultat de la procèdure
    @retval true Succès de la procédure
    @retval false Echec de la procédure, voir cResult::getLastpour plus d'informations
*/
function http_post_multipart_async(url, contents, multipart_type, callback, context, user, pwd) {
    // Instancie une nouvelle interface XMLHTTpRequest
    // Attention: Dans le cas contraire, la requete en cours Asynchrone annule la requete précédente (si elle n'est pas terminé)
    var http = http_create();
    if(!http)
        return false;
    //prepare le contenu
    var crlf = "\r\n";
    var boundary_keyword = "end-of-body";

    if(typeof(multipart_type)=="undefined")
        multipart_type="form-data";

    http.onreadystatechange = function(e){return callback.call(http,e,context)};
    http.open('POST', url, true, user, pwd);
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
    
    return RESULT_OK();
}

/*
    (C)2008-2011 ID-Informatik, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    Struture de l'objet WebFrameWork

    Composants:
        http     - Socket HTTP
        request  - Gestionnaire de requêtes HTTP
        event    - Gestionnaire d'événements
        timer    - Timers
        form     - Gestionnaire de formulaire
        style    - Gestionnaire de styles CSS
        search   - Recherche
        math     - Utilitaire mathématiques
        uri      - Universal Resource Identifier
        xarg     - Fonctions relatives au format de requete XARG
        stdEvent - Stock les événements standard du WFW
        utils    - Fonctions utiles
        states   - Stockages de données
    
    Dependences: base.js, dom.js

    Revisions:
        [22-10-2010] Ajout de l'objet wfw.style.
        [22-10-2010] Modification de l'evenement 'eventCheckDataType', utilise maintenant la classe de style 'wfw_invalidate' pour afficher les objets non valide.
        [25-10-2010] Ajout de l'objet wfw.math.
        [25-10-2010] Supprime l'attribut wfw.doc_root
        [01-11-2010] wfw.http_getResponse() retourne null en cas d'echec de la requete.
        [01-11-2010] Ajout de wfw.http_getResponseStatus().
        [10-11-2010] Ajout de l'attribut wfw.request.auto_start, permet au requetes d'etres execute automatiquement a leurs insertions sans besoin d'appel a la fonction Start().
        [10-11-2010] Change wfw.template.make(), ajout de l'argument 'selectElement'.
        [10-11-2010] Change wfw.request.Add(), ajout de l'argument 'user_data'.
        [10-11-2010] Ajout de l'object wfw.xarg.
        [10-11-2010] Ajout de l'object wfw.stdEvent.
        [26-11-2010] Debug wfw.uri.cut(), accepte le caractere '-' dans le format du query
        [27-11-2010] Debug wfw.uri.cut(), utilise les doubles slashs '\\' dans les expressions regulieres pour marquer les caracteres speciaux, ex: '\\-', car lorsque les chenes sont collees entre eux ceci annule l'effet du simple slash qui est a nouveau interprete.
        [10-11-2010] Ajout de l'object wfw.utils.
        [26-02-2011] Ajout de wfw.utils.getURIField()
        [26-02-2011] Ajout de l'header "Cache-Control" aux fonctions http_get(), http_post(), http_get_async(), http_post_async() pour lutter contre le cache du navigateur.
        [28-02-2011] Ajout de wfw.utils.remakeURI()
        [28-02-2011] Ajout de wfw.utils.getDomainName()
        [03-03-2011] Ameliore la fonction wfw.utils.onCheckRequestResult_XARG()
        [15-03-2011] Debug, wfw.timer.CreateFrequencyTimer(),insert(),remove(). L'objet ne gere pas correctement sa pile et ses identificateurs de timers [resolue]
        [22-03-2011] Debug, wfw.form.get_fields(). La fonction retourne un objet au lieu d'un string pour l'element checkbox [resolue]
        [26-03-2011] Ajout de wfw.utils.getURIAnchor()
        [06-04-2011] Ajoute l'attribut "att" a la fonction wfw.utils.remakeURI().
        [08-04-2011] Ameliore la fonction wfw.stdEvent.onFormResult().
        [26-04-2011] Ajout de wfw.request.Exists().
        [02-05-2011] Debug, set_fields(). la varibale d'argument fields est redefinit [resolue].
        [10-06-2011] Change $get().
        [11-06-2011] Debug wfw.template.check_text(), erreur de syntaxe (utilisation de double quote)
        [11-06-2011] Debug wfw.template.check_default_value(), erreur de syntaxe
        [11-06-2011] Debug wfw.template.check_node_condition(), erreur de syntaxe (utilisation de double quote)
        [23-09-2011] Modify wfw.event.SetCallback()
        [23-09-2011] Changement de comportement pour wfw.event.onEventCall() : les callbacks en liste qui retourne 'false' sont automatiquement supprimés de la liste d'appel
        [23-09-2011] Modify wfw.form.send() : ajout de l'argument 'target'
        [23-09-2011] Changement de comportement pour wfw.form.send() : les paramètres modifiés de l'élément 'form' sont restoré en fin de fonction.
        [24-09-2011] Modification sur wfw.form.get_fields(), la valeur des champs textarea sont obtenu par objGetAtt
        [04-10-2011] Modify wfw.template.make(), ajout de l'argument 'args'
        [08-10-2011] Changement de comportement pour wfw.utils.onCheckRequestResult_XML() et wfw.utils.onCheckRequestResult_XARG()
        [10-10-2011] Debug wfw.uri.object_to_query(), encodage minimal des caracteres "&" et "="
        [10-10-2011] Ajout de wfw.utils.fieldsToXML()
        [12-10-2011] Debug wfw.template.check_arguments(), erreur de condition, oublie de l'argument 'arg'
        [20-10-2011] Ajout de wfw.http_post_multipart() et http_post_multipart_async()
        [20-10-2011] Debug, désactive les headers "Content-length" et "Connection" dans wfw.http_post() et wfw.http_post_async(). ['unsafe' avertissement sous google-chrome]
        [20-10-2011] Ajout de wfw.form.initFromArg()
        [20-10-2011] Modify ExecuteNext(), support des fichiers en argument
        [20-10-2011] Debug wfw.toString(), mauvaise convertion du type number en texte [resolue].
        [24-10-2011] Update wfw.stdEvent.onFormResult(), wfw.utils.onCheckRequestResult_XML() et wfw.utils.onCheckRequestResult_XARG()
        [05-11-2011] Debug wfw.request.ExecuteNext(), mauvais appel de la fonction wfw.http_post_multipart
        [11-11-2011] Modify wfw.uri.encode() encode les caractéres "[" et "]"
        [29-11-2011] Modify $all()
        [30-11-2011] Debug wfw.http_get() et wfw.http_get_async(), passe un nombre entier comme parametre supplementaire
        [30-11-2011] wfw.utils.remakeURI(), convertie le parametre 'add_fields' en string si il est de type "number"
        [02-12-2011] Rename wfw.form.initFromElement() par wfw.form.initFromURI()
        [03-12-2011] Debug wfw.http_get() et wfw.http_get_async(), evite l'utilisation de la fonction wfw.utils.remakeURI pour les chemins local (sans domaine)
        [06-12-2011] Update wfw.stdEvent.onFormResult(), utilise messageBox() pour afficher les messages d'erreurs
        [13-12-2011] Ajout de wfw.uri.encodeUTF8() et wfw.uri.decodeUTF8()
        [29-12-2011] Update wfw.request.ExecuteNext() accepte des arguments de requête en objet
        [03-01-2012] Update wfw.utils.onRequestMsg() affiche les messages avec wfw.ext.document.messageBox()
        [05-01-2012] Update wfw.utils.onCheckRequestResult_XARG() et .onCheckRequestResult_XML() utilise l'argument 'wfw_form_name' pour identifier le formulaire de résultat
        [05-01-2012] Update wfw.stdEvent.onFormResult(), modifie l'affichage des messages d'erreurs.
        [06-01-2012] Add wfw.form.sendFrame().
        [07-01-2012] Add wfw.request.make() et wfw.form.sendForm()
        [14-01-2012] Update wfw.event: les listes d'appels peuvent maintenant utiliser un parametre pour chaque callback
        [14-01-2012] Update wfw.event.SetCallback(), ajout du paramètre "param"
        [14-01-2012] Update wfw.event.ApplyTo(), utilise objSetEvent pour passer les parametres
        [14-01-2012] Update wfw.event.onEventCall(), appel func.apply() pour utiliser le contexte de la fonction
        [20-01-2012] Debug wfw.form.get_fiels(), obtient les champs de types "password"
        [21-02-2012] Add, wfw.utils.strToHTML()
        [01-03-2012] Debug, wfw.http_post, wfw.http_post_multipart et wfw.http_get utilisait 'wfw.nav.httpRequest.onreadystatechange' ce qui créait un double appel de 'wfw.request.onResult()' [resolue]
        [03-03-2012] Update, wfw.search.string, Implentation de l'attribut MATCH_EXPRESSION
        [03-03-2012] Update, wfw.form.get_fields, changement d'arguments
        [10-03-2012] Debug, wfw.form.get_fields, obtient les champs 'input[radio]' vide si aucun choix n'est fait
        [10-03-2012] Update, wfw.utils.enabledContent, améliore la compatibilité
        [10-03-2012] Update, wfw.form.init_fields, ajout de la prise en charge de l'attribut special 'wfw_enabled'
*/

/*
-----------------------------------------------------------------------------------------------
    Base object
-----------------------------------------------------------------------------------------------
*/

var wfw = {
    /*
        Objet referencable "identifiable"
    */
    REF : {
        name: "Unnamed",/*nom de la classe parent*/
        ref_count:{created:0/*compteur d'objet créé*/,instances:0/*compteur d'objet en cours d'instance*/},
        //ref_inst:[],
        id:"",/*identificateur de l'instance*/
        //_object:null,
        _construct : function(obj){
            obj.ref_count.created++;//index de creation
            obj.ref_count.instanced++;//index de references
            if(empty(obj.id))
                obj.id = strtoid(obj.name + "_" + obj.ref_count.created);//indentificateur de reference 
            //obj.ref_inst[obj.id] = obj;//indentificateur de reference 
            //stock le pointeur de reference dans l'objet "states"
            obj = wfw.states.fromId(obj.id,obj,{ assign:true });//conserve le pointeur de reference
            wfw.puts("new REF("+obj.name+" => "+obj.id+");");
        },
        remove : function(){
            //supprime les ressources memoires
            wfw.puts("delete REF("+this.id+");");
            this.ref_count.instanced--;
            return wfw.states.remove(this.id);
        }
    },
    /*
        Statut d'erreur
        Membres:
            [String] str  : Texte de l'erreur
            [Int]    code : Code de l'erreur
        Remarques:
            Cet objet est retourné par une fonction lorsqu'une erreur survient
    */
    ERROR : {
        str   : null,
        code  : null,
        _construct : function(obj){
            wfw.puts("ERROR ["+obj.code+"]:"+obj.str);
        }
    },
    
    /*
        Statut d'erreur
        Membres:
            [array]  headers  : Tableau associatif des en-têtes HTTP
            [string] data     : Données
    */
    HTTP_REQUEST_PART : {
        headers  : [],
        data     : ""
    },

    //consoleWindow: null,
    /*
    Envoie un texte ou un objet à la console de deboguage
    Arguments:
        [mixed] obj : Contenu à écrire, le contenu est transformé en texte par la fonction "wfw.toString"
    Retourne:
        Le texte envoyé
    */
    puts: function (obj,depth) {
        var text = wfw.toString(obj,depth);
        //ecrit vers la console
        if (typeof (console) == 'object')
            console.log(text);
        else {
            /* alert(text);
            if(this.consoleWindow == null)
            this.consoleWindow = window.open('about:blank','consoleWindow');
            if(this.consoleWindow == null)
            this.consoleWindow.document.write(text+"\n");*/
        }
        return text;
    },
    /*
    Convertie un objet Javascript en texte
    Arguments:
        [mixed] obj   : Contenu à écrire, le contenu est transformé en texte par la fonction "wfw.toString"
        [bool]  depth : Scan les objets et tableaux recursivement
    Retourne:
    Texte de l'objet
    */
    toString: function (obj, depth) {
        if (typeof (depth) == "undefined")
            depth = true;
        var text = "";
        //convertie en texte
        switch (typeof (obj)) {
            case 'string':
                text = obj;
                break;
            case 'number':
                text = obj.toString(); //convert to string
                break;
            case 'function':
                text = ">"+obj;
                break;
            case 'object':
                for (var obj_member in obj)
                    text += 'object {' + obj_member + ':' + (!depth ? "" + obj[obj_member] : wfw.toString(obj[obj_member])) + "},\n";
                text += "\n";
                break;
            case 'array':
                if (!depth)
                    text += "" + obj;
                else
                    for (var i = 0; i < obj.length; i++)
                        text += '{' + i + ':' + (!depth ? "" + obj[i] : wfw.toString(obj[i])) + "},\n";
                text += "\n";
                break;
        }
        return text;
    },


    /*
    variables
    */
    path: function (request_name) { return 'wfw/' + request_name; }, // symbolik link
    request_path: function (request_name) { return 'wfw/req/' + request_name; }, // symbolik link
    //request_path: function(request_name){ return 'req:'+request_name; }, // url rewriting

    nav: new Object(), // navigator dependent-interfaces instances
    dummy: function () { }, // empty function
    version: "1.3.0", //webframework library version
    copyright: "(C)2010 ID-Informatik. All rights reserved.", // empty function
    url: "http://id-informatik.com"
};

/*
-----------------------------------------------------------------------------------------------
    Error
-----------------------------------------------------------------------------------------------
*/
wfw.error = {
    state: 0,

    ERR_CALL_UNSUPORTED_DOM_FUNCTION : 0x1,

    set : function(error_code){
        this.state |= error_code;
    },
    
    text : function(state){
        var text="";
        if(state!=0){
            if(state & this.ERR_CALL_UNSUPORTED_DOM_FUNCTION)
                text+="Error: call to unsuported function!\n";
        }
        return text;
    },

    log : function(text){
        this.log.push(text);
    },

    logAlert : function(){
        objAlertMember(this.log);
    }
};

/*
-----------------------------------------------------------------------------------------------
    HTTP Socket functions
-----------------------------------------------------------------------------------------------
*/
{
	var http = null; // l'objet HttpRequest
    // Mozilla, Safari, ...
    try
    {
        http = new XMLHttpRequest();
    }
    catch(e)
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
        catch(e)
        {
        	wfw.puts("Error creating the ActiveXObject('Microsoft.XMLHTTP') object.");
        }
    }

    //debug
    if (http==null){
        wfw.puts("Error creating the XMLHttpRequest object.");
    }
    else{

        // assigne l'interface a l'objet WebFrameWork
        wfw.nav.httpRequest = http;
        wfw.nav.http_user = "";
        wfw.nav.http_pwd = "";
        
        /*
            Assigne un nom d'utilisateur et un mot de passe aux demandes de requêtes sécurisées
            Arguments:
                [string] usr : Nom d'utilisateur
                [string] pwd : Mot de passe
            Retourne:
                [bool] true
        */
        wfw.http_authentication = function(usr,pwd){
            wfw.nav.http_user = usr;
            wfw.nav.http_pwd = pwd;
		    return true;
    	}
        
        
        /*
            Retourne le statut HTTP de la dernière requête
            Retourne:
                [int] Code de statut HTTP
        */
        wfw.http_getResponseStatus = function(){
            return wfw.nav.httpRequest.status;
        }

        /*
            Retourne la réponse en cours au format texte ou binaire suivant le type MIME rencontré
            Retourne:
                [string] Corps de la requête
        */
        wfw.http_getResponse = function(){
            //wfw.request.print();
            //wfw.puts('wfw.http_getResponse: '+wfw.nav.httpRequest.status);
            if(wfw.nav.httpRequest.status != 200)
                return null;
            //attention a ne pas utiliser wfw.nav.httpRequest.responseText avec un contenu autre que du texte, ceci engendre un bug
            switch(MIME_lowerType(wfw.nav.httpRequest.getResponseHeader('Content-type'))){
                case 'application':
                case 'text':
                    return wfw.nav.httpRequest.responseText;
                case 'xml':alert('xml');
                    return wfw.nav.httpRequest.responseXML;
                default:
                    return wfw.nav.httpRequest.responseBody;
            }
        }

        /*
            Envoie une requête HTTP avec méthode GET (bloquante)
            Arguments:
                [string] url : URL de requête
            Retourne:
                [string] Réponse
            Remarques:
                Attention: IE9 n'actualise pas le cache du navigateur (même si l'header Cache-Control est passé), voir BUG 'wfw-ie9_get_request_cache_control'
        */
        wfw.http_get = function(url){
            //Ceci est l'unique solution trouvé pour actualiser le cache sous I.E
            //Cette solution doit être provisoire.
            //En effet, l'ajout d'un argument à l'uri peut provoquer un comportement inattendu dans un script serveur
            //(ne pas utiliser wfw.utils.remakeURI, qui ne prend pas encharge les chemins sans nom de domaine)
            url += ((url.indexOf('?')!=-1) ? "&" : "?")+"random="+(parseInt(Math.random()*1000).toString());
		    //
            wfw.nav.httpRequest.onreadystatechange = null;//pas de callback (important)
            wfw.nav.httpRequest.open('GET', url, false, wfw.nav.http_user, wfw.nav.http_pwd);
            wfw.nav.httpRequest.setRequestHeader("Cache-Control","no-cache, must-revalidate"); 
		    wfw.nav.httpRequest.send(null);
            return this.http_getResponse();
    	}
        /*
            Envoie une requête HTTP avec méthode POST (bloquante)
            Argument:
                [string] url    : URL de requête
                [object] params : Tableau associatif ou URI encodée des paramètres
            Retourne:
                [string] Réponse
        */
        wfw.http_post = function(url, params) {
            if(typeof(params)=='object')
                params = wfw.uri.object_to_query(params/*,true*/);//encode l'UTF 8
            wfw.nav.httpRequest.onreadystatechange = null;//pas de callback (important)
            wfw.nav.httpRequest.open('POST', url, false, wfw.nav.http_user, wfw.nav.http_pwd);
            wfw.nav.httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //wfw.nav.httpRequest.setRequestHeader("Content-length", params.length);
            wfw.nav.httpRequest.setRequestHeader("Cache-Control","no-cache"); 
            //wfw.nav.httpRequest.setRequestHeader("Connection", "close");
            wfw.nav.httpRequest.send(params);
            
            return this.http_getResponse();
        }
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
        wfw.http_post_multipart = function(url, contents, multipart_type) {
            var boundary_keyword = "end-of-body";

            if(typeof(multipart_type)=="undefined")
                multipart_type="form-data";
                
            wfw.nav.httpRequest.onreadystatechange = null;//pas de callback (important)
            wfw.nav.httpRequest.open('POST', url, false, wfw.nav.http_user, wfw.nav.http_pwd);
            wfw.nav.httpRequest.setRequestHeader("Content-type", "multipart/"+multipart_type+"; boundary="+boundary_keyword);
            wfw.nav.httpRequest.setRequestHeader("MIME-Version", "1.0");
            wfw.nav.httpRequest.setRequestHeader("Cache-Control","no-cache"); 
            //
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
            // fin
            body += "--"+boundary_keyword+"\r\n";
            
            wfw.nav.httpRequest.send(body);

            return this.http_getResponse();
        }
        /*
            Envoie une requête POST multipart (non-bloquante)
            Argument:
                [string]   url            : URL de requête
                [array]    contents       : Tableau indexé des contenus (HTTP_REQUEST_PART)
                [string]   multipart_type : Type MIME multipart. Par défault "form-data" (voir remarques)
                [function] callback       : Fonction de rappel
            Retourne:
                [bool] true
            Remarques:
                L'Argument 'multipart_type' définit un des types MIME multipart standard : (mixed, digest, alternative, parallel) ou étendu : (encrypted, byteranges, etc...)
        */
        wfw.http_post_multipart_async = function (url, contents, multipart_type, callback) {
            var crlf = "\r\n";
            var boundary_keyword = "end-of-body";

            if(typeof(multipart_type)=="undefined")
                multipart_type="form-data";
                
            wfw.nav.httpRequest.onreadystatechange = callback;
            wfw.nav.httpRequest.open('POST', url, true, wfw.nav.http_user, wfw.nav.http_pwd);
            wfw.nav.httpRequest.setRequestHeader("Content-type", "multipart/"+multipart_type+"; boundary="+boundary_keyword);
            wfw.nav.httpRequest.setRequestHeader("MIME-Version", "1.0");
            wfw.nav.httpRequest.setRequestHeader("Cache-Control","no-cache"); 
            //
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
            wfw.nav.httpRequest.send(body);
            return true;
        }
        /*
            http_get_async, Requete GET (non-bloquante)
            Argument:
                [string]   url      : URL de requête
                [function] callback : Fonction de rappel
            Retourne:
                [bool] true
        */
        wfw.http_get_async = function(url, callback){
            //Ceci est l'unique solution trouvé pour actualiser le cache sous I.E
            //Cette solution doit être provisoire.
            //En effet, l'ajout d'un argument a l'uri peut provoquer un comportement inattendu dans un script serveur
            //(ne pas utiliser wfw.utils.remakeURI, qui ne prend pas encharge les chemins sans nom de domaine)
            url += ((url.indexOf('?')!=-1) ? "&" : "?")+"random="+(parseInt(Math.random()*1000).toString());
		    //
            wfw.nav.httpRequest.onreadystatechange = callback;
            wfw.nav.httpRequest.open('GET', url, true, wfw.nav.http_user, wfw.nav.http_pwd);
            wfw.nav.httpRequest.setRequestHeader("Cache-Control","no-cache"); 
            wfw.nav.httpRequest.send(null);
            return true;
        }
        /*
            http_post_async, Requete POST (non-bloquante)
            Argument:
                [string]   url      : URL de requête
                [object]   params   : Tableau associatif ou URI encodée des paramètres
                [function] callback : Fonction de rappel
            Retourne:
                [bool] true
        */
        wfw.http_post_async = function(url, params, callback) {
            if(typeof(params)=='object')
                params = wfw.uri.object_to_query(params/*,true*/);//encode l'UTF 8
            wfw.nav.httpRequest.onreadystatechange = callback;
            wfw.nav.httpRequest.open('POST', url, true, wfw.nav.http_user, wfw.nav.http_pwd);
            wfw.nav.httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //wfw.nav.httpRequest.setRequestHeader("Content-length", params.length);
            wfw.nav.httpRequest.setRequestHeader("Cache-Control","no-cache"); 
            //wfw.nav.httpRequest.setRequestHeader("Connection", "close");
            wfw.nav.httpRequest.send(params);
            return true;
        }
    }
}

/*
-----------------------------------------------------------------------------------------------
    Gestionnaire de requetes HTTP
-----------------------------------------------------------------------------------------------
*/
wfw.request = {
    exec_list: new Array(), // tableau des actions
    cur_action: 0,          // indice de l'action en cours
    async: true,
    auto_start: true,
    working: false,
    loading_box_delay: 0,//temps disponible avant que la boite de chargement s'affiche à l'ecran
    READYSTATE_UNSENT: 0,
    READYSTATE_OPENED: 1,
    READYSTATE_HEADERS_RECEIVED: 2,
    READYSTATE_LOADING: 3,
    READYSTATE_DONE: 4,
    
    /*
        Objet de requête
        Membres:
            [string] name              : Identificateur de la requête
            [string] url               : URL cible de la requête
            [object] args              : Tableau associatif des arguments, contient des champs de types 'string' et/ou 'wfw.HTTP_REQUEST_PART' (voir exemples)
            [string] response_header   : Reçoit les en-têtes de la réponse HTTP
            [string] response          : Reçoit la réponse (texte)
            [string] response_obj      : Reçoit la réponse (objet). null si indisponible
            [function] callback        : Fonction de rappel (voir exemples)
            [mixed]  user              : Données utilisateur passé au 'callback'
            [string] status            : Reçoit le statut de la requête ("wait", "exec", ou [HTML Status Code])
            [bool]   remove_after_exec : Si true, supprime la requête après l'exécution
            [bool]   async             : Si true, la requête est exécuté de façon ASynchrone, sinon synchrone
        Remarques:
            Callbacks prédéfinit disponibles:
                wfw.utils.onCheckRequestResult_XARG : Test le résultat d'une requête Webframework/XARG et retourne les arguments
                wfw.utils.onCheckRequestResult_XML  : Test le résultat d'une requête Webframework/XML et retourne le document
                wfw.utils.onCheckRequestResult      : Test le statut d'une requête HTTP et retourne la réponse
        Exemple:
            // Utilisation du callback
            var callback = function(obj){
                switch(obj.status){
                    case "wait":
                        // requête en attente d'execution 
                        break;
                    case "exec":
                        // requête en cours d'execution 
                        break;
                    case 200:
                        // requête executée
                        alert(obj.response);
                        break;
                    case 400:
                        alert("Requête indisponible");
                        break;
                    default:
                        //autres status...
                        break;
                }
            }
        Exemple:
            //exemple d'intialisation d'arguments
            my_request.args={
                param_1 : $new( wfw.HTTP_REQUEST_PART, {
                    headers: [
                        'Content-Disposition: form-data; name="param_1"',
                        'Content-Type: text/plain'
                    ],
                    data: "value"
                }),
                param_2 : "value",
                param_n : "value"
            };
    */
    REQUEST : {
        name              : null,
        url               : "",
        args              : null,
        response_header   : null,
        response          : null,
        response_obj      : null,
        callback          : null,
        user              : {},
        status            : "wait",
        remove_after_exec : true,
        async             : true,
        
        //constructeur
        _construct : function(obj){
            // genere le nom ?
            if ((typeof (obj.name) != 'string') || empty(obj.name) || obj.name===null)
                obj.newName();
            //transforme les arguments
            if(typeof (obj.args) == "string")
                obj.args = wfw.uri.query_to_object(obj.args);
            //transforme les arguments
            if(typeof (obj.async) == "undefined")
                obj.async = true;
        },

        //génére un nom unique
        newName : function(){
            this.name = "_" + getTimeMS();
            while ("_" + getTimeMS() == this.name); ; //retarde le temps d'execution pour garantir que le nom soit unique
        }
    },

    user: {
        onStart: function () {},
        onFinish: function () {}
    },

    onStart: function () {
        //affiche une boite chargement si les requetes depasses un certain délais d'attente
        if(wfw.request.loading_box_delay){
            setTimeout(function () {
                var loadingBox = $("&wfw_ext_document_LoadingBox");
                if (wfw.request.working && !loadingBox){
                    wfw.ext.document.openLoadingBox();
                    //wfw.puts("start");
                }
                var refreshIntervalId = setInterval(function () {
                    var loadingBox = $("&wfw_ext_document_LoadingBox");
                    if (!wfw.request.working && loadingBox){
                        wfw.ext.document.closeLoadingBox();
                        //wfw.puts("end");
                    }
                    if (!wfw.request.working && !loadingBox){
                        clearInterval(refreshIntervalId);
                        //wfw.puts("stop");
                    }
                }, 1000);
            }, wfw.request.loading_box_delay);
        }
        //debute
        this.working = true;
        this.user.onStart();
    },
    onFinish: function () {
     //   var loadingBox = $("&wfw_ext_document_LoadingBox");
     //   if(loadingBox) wfw.ext.document.closeDialog(loadingBox);

        this.working = false;
        this.user.onFinish();
    },
    
    /*
    Ajoute un objet de requête

    Paramètres:
        [wfw.request.REQUEST] action : Objet de la requête
    Retourne:
        [wfw.request.REQUEST] L'Objet de la requête
    Remarques:
        Si la requête existe, elle est remplacé.
    */
    Insert: function (action) {
        // la requete existe ?
        var i_old_action = this.GetIndice(action.name);
        if (i_old_action < 0) {
            // wfw.puts("add action: "+name);
            this.exec_list.push(action);
        }
        else {
            // wfw.puts('replace action('+i_old_action+'): '+name);
            this.exec_list[i_old_action] = action;
        }

        wfw.puts("Add Request: " + action.name + ", " + action.url);

        //appel du callback callback
        if (action.callback != null)
            action.callback(action);

        //execute la requete ?
        if (this.auto_start && !this.working){
            this.Start(this.async);
        }

        return action;
    },

    /*
    Ajoute une requête

    Parametres:
        [string]        name      : Identificateur de requete. Si null, un identifiant unique sera généré
        [string]        url       : URL de la requête
        [string/object] arg       : Arguments qui serons passés à la requête (text ou objet)
        [function]      callback  : Format du callback: void callback(action)
        [object]        user_data : Données passé en argument à la fonction 'callback'
        [bool]          async     : synchrone/asynchrone
    Retourne:
        [wfw.request.REQUEST] L'Objet de la requête
    Remarques:
        L'ensemble des arguments construit un objet 'wfw.request.REQUEST', reportez-vous à la documentation pour en savoir d'avantage.
        Si la requête existe, elle est remplacé.
    */
    Add: function (name, url, arg, callback, user_data, async) {

        // fabrique l'objet
        var action = $new( wfw.request.REQUEST, {
            name              : name,
            url               : url,
            args              : copy(arg),
            callback          : callback,
            user              : user_data,
            status            : "wait",
            remove_after_exec : true,
            async             : (((typeof (async) == "undefined") || (async == true)) ? true : false)
        });

        return this.Insert(action);

        /*
        // la requete existe ?
        var i_old_action = this.GetIndice(name);
        if (i_old_action < 0) {
            // wfw.puts("add action: "+name);
            this.exec_list.push(action);
        }
        else {
            // wfw.puts('replace action('+i_old_action+'): '+name);
            this.exec_list[i_old_action] = action;
        }

        wfw.puts("Add Request: " + action.name + ", " + url);

        //appel du callback callback
        if (callback != null)
            callback(action);

        //execute la requete ?
        if (this.auto_start && !this.working){
            this.Start(this.async);
        }
        
        return action;*/
    },

    /*
    Supprime une requête
    
    Parametres:
        [string] name : Identificateur de requête
    Retourne:
        [bool] true si la requête est supprimé, false si la requête n'existe pas
    */
    Remove: function (name) {
        for (var i = 0; i < this.exec_list.length; i++) {
            var req = this.exec_list[i];
            if (req.name == name) {
                if (req.status == "wait")
                    wfw.puts("Remove Request: warning! request " + name + " is currently executed");
                wfw.puts("Remove Request: " + name + ", " + this.exec_list[i].url);
                this.exec_list.splice(i, 1);
                return true;
            }
        }
        return false;
    },

    /*
    Retourne le nombre de requêtes en liste
            
    Retourne:
        [int] Nombre de requêtes trouvé (peut importe le statut)
    */
    Count: function () {
        return this.exec_list.length;
    },

    /*
    Retourne la liste des requêtes
            
    Retourne:
        [array] Liste des requêtes, tableau indéxé d'objet 'wfw.request.REQUEST'
    Remarques:
        Attention, List retourne la référence interne à l'objet liste
    */
    List: function () {
        return this.exec_list;
    },

    /*
    Retourne la requête en cours d'exécution
            
    Retourne:
        [wfw.request.REQUEST] L'Objet de la requête
    */
    CurrentAction: function () {
        if (typeof (this.exec_list[this.cur_action]) == 'undefined')
            return null;
        return this.exec_list[this.cur_action];
    },

    /*
    Obtient une requête par son indice

    Arguments:
        [int] count : Indice de la requête
    Retourne:
        [wfw.request.REQUEST] L'Objet de la requête
    */
    Get: function (count) {
        return this.exec_list[count];
    },
    
    /*
    Obtient une requête par son nom

    Arguments:
    [string] name : Identificateur de la requête
    Retourne:
        [wfw.request.REQUEST] L'Objet de la requête. null si introuvable
    */
    GetByName: function (name) {
        var i = this.GetIndice();
        if(i<0)
            return null;
        return this.Get(i);
    },

    /*
    Retourne l'indice de la requête spécifié
            
    Arguments:
        [string] name : Identificateur de la requête
    Retourne:
        [int] Indice de la requête. -1 si introuvable
    */
    GetIndice: function (name) {
        for (var i = 0; i < this.exec_list.length; i++) {
            if (this.exec_list[i].name == name)
                return i;
        }
        return -1;
    },
    
    /*
        [PRIVATE]
        DEBUG PRINT
    */
    print: function () {
        for (var i = 0; i < this.exec_list.length; i++) {
            wfw.puts(i+":"+this.exec_list[i].name+" ["+this.exec_list[i].status+"]");
        }
    },

    /*
    Verifie l'existance d'une requête
            
    Arguments:
        [string] name : Identificateur de la requête
    Retourne:
        [bool] true si la requête existe, false si elle n'existe pas.
    */
    Exists: function (name) {
        return (this.GetIndice(name) < 0) ? false : true;
    },

    /*
    Retourne l'indice de la requête en cours d'exécution
            
    Retourne:
        [int] Indice. si négatif, aucune requêtes n'est en cours d'exécution
    */
    CurrentCount: function () {
        return this.cur_action;
    },

    /*
    Retourne l'indice de la prochaine requête en attente d'exécution
           
    Arguments:
        [int] start : Indice de départ du scan. Si négatif, la fonction retourne -1
    Retourne:
        [int] Indice. si -1, aucune requête n'est en attente
    */
    FindNextExecution: function (start) {
        if (start < 0)
            return -1;
        //recherche la prochaine requête non exécuté
        for (var i = start; i < this.exec_list.length; i++) {
            //wfw.puts('FindNextExecution: find['+i+'/'+this.exec_list.length+']'+this.Get(i).status+"; "+this.Get(i).url);
            if (this.Get(i).status == 'wait') {
                return i;
            }
        }
        //wfw.puts('FindNextExecution: no find');
        return -1;
    },

    /*
    Débute l'exécution des requêtes en attentes
            
    Arguments:
        [bool] async : Synchrone / Asynchrone
    Retourne:
        [bool] valeur de retour de la méthode ExecuteNext()
    */
    Start: function (async) {
        //if(wfw.request.loading_box_delay){
        //    wfw.puts("Start openLoadingBox");
        //}
        this.async = async;
        this.onStart();
        return this.ExecuteNext();
    },

    /*
    Exécute la prochaine requête
            
    Retourne:
        [bool] true en cas de succès, false si aucune autre requête est en attente
    Remarques:
        En appelant, wfw.request.onResult la fonction exécute automatiquement la prochaine requête en attente
    */
    ExecuteNext: function () {
        // recherche la prochaine action à executer
        this.cur_action = this.FindNextExecution(0);
        //wfw.puts("ExecuteNext: "+this.cur_action);
        if (this.cur_action < 0) {//si aucune, termine ici
            this.onFinish();
            return false;
        }

        var action = this.CurrentAction();
//        wfw.puts("Execute Request: " + action.name + ", " + action.url);
        action["status"] = "exec";
        //callback
        var callback = action["callback"];
        if (callback != null)
            callback(action);
        //convertie les argument en corps de requete    
        var multipart_args = [];
        if (action["args"] != null) {
            for (var x in action["args"]) {
                var user_arg = action["args"][x];
                switch (typeof (user_arg)) {
                    case "boolean":
                    case "number":
                    case "string":
                        //passe une chaine
                        multipart_args.push(
                            {
                                headers: [
                                    'Content-Disposition: form-data; name="' + x + '"',
                                    'Content-Type: text/plain'
                                ],
                                data: (user_arg)
                            }
                        );
                        break;
                    case "object":
                        //passe directement l'objet de requete
                        multipart_args.push(user_arg);
                        break;
                }
            }
        }
        //asynchrone
        if (action["async"] == true) {
            if (action["args"] == null)
                wfw.http_get_async(action["url"], wfw.request.onResult);
            else
                wfw.http_post_multipart_async(action["url"], multipart_args, "form-data", wfw.request.onResult);
            //wfw.http_post_async(action["url"], action["args"], wfw.request.onResult);
        }
        //synchrone
        else {
            //verrouille l'ecran en attendant la fin de la requete bloquante
            //if(typeof(wfw.ext)=="object"){
            //   wfw.ext.document.LoadingBox();
            //}
            //            wfw.puts("wfw.request.onResult: 2");

            if (action["args"] == null)
                wfw.http_get(action["url"]);
            else
                wfw.http_post_multipart(action["url"], multipart_args, "form-data");
            //wfw.http_post(action["url"], action["args"]);

            //            wfw.puts("wfw.request.onResult: 3");
            //            wfw.puts("wfw.request.onResult: ID is:"+this.cur_action);
            wfw.request.onResult(null);

            //deverouille l'ecran si aucun texte n'est visible a l'ecran
            /*     if(!wfw.ext.document.isPrintedScreen())*/
            //wfw.ext.document.unlockScreen();
            //    wfw.ext.document.clearScreen();
        }

        return true;
    },

    /*
    Efface la liste des requêtes
            
    Retourne:
        [bool] true.
    */
    Clear: function () {
        this.exec_list = new Array();
        this.cur_action = 0;
        return true;
    },

    /*
    Positionne l'ensemble des statuts de requêtes en attente
            
    Retourne:
        [bool] true.
    */
    Reset: function () {
        for (var i = 0; i < this.exec_list.length; i++) {
            var action = this.Get(i);
            action.status = 'wait';
            action.response_header = null;
            action.response = null;
            action.response_obj = null;

            //callback
            if (action.callback != null)
                action.callback(action);
        }

        if (this.auto_start && !this.working)
            this.Start(this.async);

        return true;
    },

    /*
        [PRIVATE]
        Callback de résultat interne
    */
    onResult: function (e)// attention! executé dans le context global (pas de this)
    {
        var action = wfw.request.CurrentAction();
        if (action == null) {
            wfw.puts("wfw.request.onResult: This request has already been deleted from the list. ID:" + this.cur_action);
            return;
        }

        //met a jour le status
        action["status"] = wfw.nav.httpRequest.readyState; //met a jour l'etat
        
        switch (wfw.nav.httpRequest.readyState) {
            case wfw.request.READYSTATE_UNSENT:
                //wfw.puts(action.name+' READYSTATE_UNSENT '+wfw.nav.httpRequest.readyState);
                break;

            case wfw.request.READYSTATE_OPENED:
                //wfw.puts(action.name+' READYSTATE_OPENED '+wfw.nav.httpRequest.readyState);
                break;

            case wfw.request.READYSTATE_HEADERS_RECEIVED:
                //wfw.puts(action.name+' READYSTATE_HEADERS_RECEIVED '+wfw.nav.httpRequest.readyState);
                break;

            case wfw.request.READYSTATE_LOADING:
                //wfw.puts(action.name+' READYSTATE_LOADING '+wfw.nav.httpRequest.readyState);
                break;

            case wfw.request.READYSTATE_DONE:
                {
                    //wfw.puts(action.name+' READYSTATE_DONE '+wfw.nav.httpRequest.readyState);
                    action["status"] = wfw.nav.httpRequest.status; //met a jour l'etat
                    action["response_header"] = wfw.nav.httpRequest.getAllResponseHeaders();
                    action["response"] = wfw.http_getResponse();
                    action["response_obj"] = null;

                    //cree l'objet associe si possible
                    /* switch(wfw.nav.httpRequest.getResponseHeader('Content-Type')){
                    case "text/wfw.xra": // non officiel: webframework x-request arguments
                    action["response_obj"] = x_request_arguments_parse(action["response"],false);
                    break;
                    case "text/html":
                    case "text/xml":
                    //action["response_obj"] = xml_parse(action["response"]); // ??!!
                    break;
                    }*/

                    //callback
                    var callback = action["callback"];
                    if (callback != null)
                        callback(action);

                    if (action.remove_after_exec == true)
                        wfw.request.Remove(action.name);
                    else
                        wfw.puts("wfw.request.onResult: can't remove request object");

                    //passe a l'action suivante (non-bloquante)
                    //window.setTimeout("wfw.request.ExecuteNext();",0);
                    wfw.request.ExecuteNext();
                }
                break;
            default:
                wfw.puts("wfw.request.onResult: '"+action.name+"' unknown state: "+wfw.nav.httpRequest.readyState);
                break;
        }
    }
};
    
/*
-----------------------------------------------------------------------------------------------
    Events Manager
        Gere des listes d'evenements par objet.
        
-----------------------------------------------------------------------------------------------
*/
wfw.event = {
    /*
    Tableaux des listes d'événements

    list[ListName][EventType][FuncName] = {
    [function] func  : callback
    [mixed]    param : callback param
    }
    */
    list: new Object(),

    /*
    Ajoute ou modifie un événement à la liste spécifié

    Arguments:
        [string]   list_name  : Identifiant de la liste à modifier ou à créer
        [string]   event_type : Type d'événement (ex: click, mouseover, etc...)
        [string]   func_name  : Nom indicatif de la fonction à associer (généralement, le nom réel de la fonction)
        [function] func       : La fonction de callback à associer
        [bool]     bUp        : Si true, la fonction est placé en tête de liste
        [mixed]    param      : Optionnel, paramètres à passer au callback
    Remarques:
        La fonction 'func' prend la forme : void function(event,param);
        Les callback retournant 'false' seront supprimés de la liste d'appel et ne seront donc plus rappelés ultérieurement
    Retourne:
        [bool] true
    */
    SetCallback: function (list_name, event_type, func_name, func, bUp, param) {
        //initialise la liste si besoin
        if (typeof (this.list[list_name]) == 'undefined')
            this.list[list_name] = new Object();
        //initialise l'evenement si besoin
        if (typeof (this.list[list_name][event_type]) == 'undefined')
            this.list[list_name][event_type] = new Object();
        //definit l'objet de l'evenement
        this.list[list_name][event_type][func_name] = {
            func: (func),
            param: (param)
        };

        //remonte la fonction en tete de liste ?
        if (bUp)
            this.list[list_name][event_type] = keyfirst(this.list[list_name][event_type], func_name);

        return true;
    },

    /*
    Supprime un événement de la liste spécifié

    Arguments:
    [string]   list_name  : Identifiant de la liste
    [string]   event_type : Type d'événement (ex: click, mouseovr, etc...)
    [string]   func_name  : Nom indicatif de la fonction à supprimer
    Retourne:
    [bool] true en case de succès, false en cas d'erreur
    */
    UnSetCallback: function (list_name, event_type, func_name) {
        if ((typeof (this.list[list_name]) != 'undefined') &&
                (typeof (this.list[list_name][event_type]) != 'undefined') &&
                (typeof (this.list[list_name][event_type][func_name]) != 'undefined')) {
            delete this.list[list_name][event_type][func_name];
            return true;
        }
        return false;
    },

    /*
    Détache une liste d'événements d'un élément

    Arguments:
    [object]   obj       : L'Elément précédemment initialisé avec wfw.event.ApplyTo
    [string]   list_name : Identifiant de la liste à modifier ou à créer
    Remarques:
    RemoveTo supprime la variable de référence associé à l'objet '_wfw_events'
    Retourne:
    [bool] true en cas de succès, false en cas d'échec
    */
    RemoveTo: function (obj, list_name) {
        if (typeof (obj._wfw_events) == "undefined")
            return false;
        delete obj._wfw_events;
        return true;
    },
    /*
    Attache une liste d'événements à un élément

    Arguments:
    [object]   obj       : L'Elément à initialiser
    [string]   list_name : Identifiant de la liste à modifier ou à créer
    Remarques:
    ApplyTo ajoute une variable de référence associé à l'objet '_wfw_events'
    Un élément ne peut être attaché qu'à une seule liste à la fois
    Retourne:
    [bool] true en cas de succès, false en cas d'échec
    */
    ApplyTo: function (obj, list_name) {
        if (typeof (this.list[list_name]) == "undefined")
            return false;

        //assigne chacun des evenements a l'objet
        for (var eventType in this.list[list_name])
            objSetEvent(obj, eventType, wfw.event.onEventCall, this.list[list_name]);

        //assigne tout les types d'evenements à la liste (pas dispo avec tout les navigateurs!)
        /*   //var text="";
        for(att in obj){
        //   text+=att+", ";
        if(att.substr(0,2) == 'on') // event?
        {
        // text+=(att.substr(2,att.length-2)+"\n");
        objSetEvent(obj,att.substr(2,att.length-2),wfw.event.onEventCall);
        }
        }
        //alert("apply to:\n"+text);*/

        return true;
    },
    /*
    CALLBACK
    Appel successivement l'ensemble des callbacks attachées a l'élément
    Remarques:
    Les callback retournant 'false' seront supprimés de la liste d'appel et ne seront donc plus rappelés ultérieurement
    */
    onEventCall: function (e, events_list) {
        //recupere l'objet evenement (inutile ?!)
        if (typeof (event) == "object")
            e = event;

        //obtient la liste pour cet evenement
        var list = events_list[e.type];
        //appel les fonctions de callback
        for (var name in list) {
            var eFunc = list[name];
            if (typeof (eFunc.func) == "function") {
                // appel la fonction dans le context de l'objet (this)
                var ret = eFunc.func.apply(this,[e,eFunc.param]);
                //supprime la fonction de la pile d'appel ?
                if (ret == false) {
                    wfw.puts("wfw.event.onEventCall : removing callback " + e.type + "->" + name);
                    delete list[name];
                }
            }
        }
    },
    /*
    CALLBACK
        Appel un événement
    Remarques:
        Les callback retournant 'false' seront supprimés de la liste d'appel et ne seront donc plus rappelés ultérieurement
    */
    callEvent: function (event_obj,list_name, event_type) {
        //obtient la liste pour cet evenement
        if(typeof(this.list[list_name])=="undefined" || typeof(this.list[list_name][event_type])=="undefined")
            return;
        var list = this.list[list_name][event_type];
        //appel les fonctions de callback
        for (var name in list) {
            var eFunc = list[name];
            if (typeof (eFunc.func) == "function") {
                // appel la fonction dans le context de l'objet (this)
                var ret = eFunc.func.apply(event_obj,[null,eFunc.param]);
                //supprime la fonction de la pile d'appel ?
                if (ret == false) {
                    wfw.puts("wfw.event.onEventCall : removing callback " + e.type + "->" + name);
                    delete list[name];
                }
            }
        }
    }
};

/*
-----------------------------------------------------------------------------------------------
    Timing Manager
        Gere les timers de rappels programmes.
-----------------------------------------------------------------------------------------------
*/
wfw.timer = {
    timers:new Array(),
    /*
        Obtient un timer existant

        Arguments:
            [int]   id : Indice du timer
        Retourne:
            [object] L'Object du timer, null si le timer n'existe pas
    */
    get : function(id){
        if(id>=0 && id<this.timers.length)
            return this.timers[id];
        return null;
    },
    /*
        Supprime un timer existant

        Arguments:
            [int/object]   id : Indice du timer ou l'objet du timer
        Retourne:
            [bool] true si la fonction est un succès, false en cas d'échec
    */
    remove : function(id){
        //le timer?
        if(typeof(id)=='object')
            id=id.id;
        //ok?
        if(typeof(id)!='number')
            return false;
        if(id<0 || id>this.timers.length)
            return false;
        //stop le timer si il est en cours d'utilisation
        //this.timers[id].stop();
        //supprime
        delete(this.timers[id]);
        this.timers[id]=null;
        //decale les elements suivant et ajuste le nouvelle id
        /*for(var i=id;i<this.timers.length-1;i++){
            this.timers[i]=this.timers[i+1];
            this.timers[i].id=i;//actualise l'id
        }
        //supprime le dernier element
        this.timers.pop();*/
//        wfw.puts('wfw.timer.remove: '+id);
        return true;
    },
    /*
        Insert un nouvel objet timer à la liste

        Arguments:
            [object]   timer : L'Objet timer
        Retourne:
            [int] Indice du timer
        Remarque:
            insert initialise automatiquement l'indice du timer (timer.id)
    */
    insert : function(timer){
        for(var i=0;i<this.timers.length;i++){
            if(this.timers[i]==null){
                this.timers[i]=timer;
                timer.id = i;
                return timer.id;
            }
        }
        
        timer.id = this.timers.push(timer)-1;
        return timer.id;
    },
    
    /*
        Crée un timer redondant
        Retourne:
            [int] delay : frequence en milliseconde
            [function] onUpdate : callback de rappel
            [function] onStop : callback de rappel
        Revisions:
            [07-10-2010], ajoute le membre 'state' qui definit l'etat actuel du timer
    */
    CreateTickTimer : function(delay,att){
        
        //insert dans une nouvelle liste
        if(typeof(wfw.timer.ticksTimer[delay]) == "undefined"){
            var list = wfw.timer.ticksTimer[delay] = $new(wfw.timer.TICKS_TIMER_LIST,{frequency:delay});
            var timer = $new(wfw.timer.TICKS_TIMER,att);
            timer.keyList = list.timers.push(timer)-1;
            timer.list = list;
            list.auto_update();
        }
        //insert dans une liste existante
        else{
            var list = wfw.timer.ticksTimer[delay];
            var timer = $new(wfw.timer.TICKS_TIMER,att);
            timer.keyList = list.timers.push(timer)-1;
            timer.list = list;
        }
        
        return timer;
    },
    ticksTimer : {},//TICKS_TIMER_LIST[frequency]
    TICKS_TIMER_LIST : {
        id        : null,
        timers    : null,//TICKS_TIMER array
        frequency : 1000,
        timeout : null,
        /*tickCount : 0,
        beginTime : 0,*/
        /*
            Constructeur
        */
        _construct : function(obj){
            // genere l'id et ajoute à la liste
            obj.id = wfw.timer.insert(obj);
            obj.timers = [];
            wfw.puts('new wfw.timer.TICKS_TIMER_LIST: id='+obj.id);
        },
        auto_update    : function(){
            var time=getTimeMS();
            //appel les callbacks
            for(var t in this.timers)
                this.timers[t].update(time);
            //prochain appel
            this.timeout = setTimeout('wfw.timer.get('+this.id+').auto_update();',this.frequency);
        }
    },
    TICKS_TIMER : {
        id          : null,
        onUpdate    : function(elapsedTime,tickCount){ },
        onStop      : function(elapsedTime,tickCount){ },
        onPause     : function(elapsedTime,tickCount){ },
        tickCount   : 0,//Nombre d'update
        beginTime   : 0,//[private] timestamp de départ
        elapsedTime : 0,//Timestamp écoulé depuis le départ du timer
        bStop       : false,//true si le timer est stopé
        list        : null,//[private] l'objet TICKS_TIMER_LIST associé
        keyList     : null,//[private] indice du timer dans l'objet TICKS_TIMER_LIST
        user        : null, // Données réservé à l'utilisateur
        /*
            Constructeur
        */
        _construct : function(obj){
            //init
            obj.beginTime=getTimeMS();
            obj.tickCount=0;
            // genere l'id et ajoute à la liste
            obj.id = wfw.timer.insert(obj);
            wfw.puts('new wfw.timer.TICKS_TIMER: id='+obj.id);
        },
        /*
            Supprime le timer
        */
        remove : function(){
            remove_key(this.list,this.keyList);
            return wfw.timer.remove(this.id);
        },
        /*
            Départ du timer
        */
        start : function(){
            if(!this.beginTime)
                this.beginTime=getTimeMS();
            this.bStop=false;
        },
        /*
            Arrêt du timer
        */
        stop : function(){
            this.bStop=true;
            this.beginTime=0;
            this.tickCount=0;
            this.elapsedTime=0;
            this.onStop();
        },
        /*
            Pause du timer
        */
        pause : function(){
            this.bStop=true;
            this.onPause();
        },
        /*
            [PRIVATE]
            Actualise le timer
        */
        update : function(time){
            //Stopé ?
            if(this.bStop)
                return;
            //update...
            this.elapsedTime = time - this.beginTime;
            this.onUpdate(this.elapsedTime,this.tickCount);
            this.tickCount++;
        }
    },
    /*
        Objet de timer (fréquence)
        Membres:
            [int]      id               : Auto, Identificateur de l'objet
            [int]      begin            : Auto, Temps de départ (timestamp en milliseconde)
            [int]      end              : Auto, Temps de fin (timestamp en milliseconde)
            [int]      current_frame    : Auto, Numèro de frame en cours
            [float]    current_time     : Auto, Temps normalisé en cours (0~1)
            [int]      frame_per_second : Nombre de frame par seconde
            [int]      max_frame        : Auto, Maximum de frame 
            [object]   timeout          : Auto, Javscript Timeout objet
            [string]   state            : Auto, Etat du timer ("stop","update")
            [bool]     bAutoRemove      : Si true, supprime le timer après exécution
            [int]      duration         : Durée de vie du timer en millisecondes
            [object]   user             : Données réservé pour l'utilisateur
            [function] onUpdateFrame    : Update callback
            [function] onStop           : Stop callback
            [function] onStart          : Start callback
            [function] onFinish         : Finish callback
    */
    FREQUENCY_TIMER : {
        id               : null,
        begin            : null,
        end              : null,
        current_frame    : 0,
        current_time     : 0.0,
        frame_per_second : 24,
        max_frame        : 0,
        timeout          : null,
        state            : "stop", //stop,update
        bAutoRemove      : true,
        duration         : 0,
        user             : null,
        /*
            [Actualise le timer]
            time     : timestamp actuel en milli-secondes
            frame    : numero de frame 
            normTime : temps normalise entre 0 et 1
        */
        onUpdateFrame    : function(time,normTime,frame){ },
        onStop           : function(){ },
        onStart          : function(){ },
        onFinish         : function(){ },
        onRemove         : function(){ },
        /*
            Constructeur
        */
        _construct : function(obj){
            // genere l'id et ajoute à la liste
            obj.id = wfw.timer.insert(obj);
//            wfw.puts('new wfw.timer.FREQUENCY_TIMER: id='+obj.id);
        },
        /*
            Démarre le décomptage du timer (asynchrone)
            [int] duration : Optionnel, Durée d'exécution
            [07-10-2010], met a jour l'etat 'this.state'
        */
        start : function(duration){
            if(typeof(duration) != "undefined")
                this.duration = duration;
            this.state="update";
            this.begin=getTimeMS();
            this.end=this.begin+this.duration;
            this.max_frame = parseInt(this.frame_per_second*(this.duration/1000));
            this.onStart();
            this.auto_update();
        },
        /*
            Exécute le timer (synchrone)
            [int] duration : Optionnel, Durée d'exécution
            [07-10-2010], met a jour l'etat 'this.state'
        */
        exec : function(duration){
            if(typeof(duration) != "undefined")
                this.duration = duration;
            this.state="update";
            this.begin=getTimeMS();
            this.end=this.begin+this.duration;
            this.max_frame = parseInt(this.frame_per_second*(this.duration/1000));
            this.onStart();
            wfw.puts("max_frame:"+this.max_frame);
            for(var i=0;i<this.max_frame+1;i++){
                this.frame_update();
                this.current_frame++;
            }
            this.onFinish();
            this.stop();
        },
        /*
            Stop le timer
            [07-10-2010], met a jour l'etat 'this.state'
        */
        stop : function(){
            this.state="stop";
            if(this.timeout!=null){
                clearTimeout(this.timeout);
                this.timeout=null;
            }
            this.onStop();
            if(this.bAutoRemove){
                this.onRemove();
                wfw.timer.remove(this.id);
            }
        },
        /*
            Stop et supprime le timer
            [07-10-2010], met a jour l'etat 'this.state'
        */
        remove : function(){
            this.stop();
            this.onRemove();
            wfw.timer.remove(this.id);
        },
        /*
            Définit la fréquence de rappel de la méthode 'onUpdateFrame'
            [int] frame_by_seconde : Nombre de frame par seconde
        */
        set_frame_per_seconde : function(frame_by_seconde){
            this.frame_per_second=frame_by_seconde;
        },
        /*
            [PRIVATE]
            Appelé automatiquement par la méthode 'start' 
            [07-10-2010], appel this.stop() lors de la fin d'execution
        */
        auto_update : function(){
            var cur = getTimeMS();
            if(cur>this.end)
                cur=this.end;
            this.set_time((1.0/(this.end-this.begin))*(cur-this.begin)); // calcule le temps normalisé actuel

            this.onUpdateFrame(cur,this.current_time,this.current_frame);

            if(cur<this.end)
                this.timeout = setTimeout('wfw.timer.get('+this.id+').auto_update();',1000/this.frame_per_second);
            else{
                this.onFinish();
                this.stop();
            }
        },
        /*
            [PRIVATE]
            Appele automatiquement par la méthode 'exec' 
            [07-10-2010], appel this.stop() lors de la fin d'execution
        */
        frame_update : function(){
            wfw.puts("current_frame:"+this.current_frame);
            var cur = ((this.end-this.begin)/this.max_frame)*this.current_frame;
            if(cur>this.end)
                cur=this.end;
            wfw.puts("cur time:"+cur);
            this.set_frame(this.current_frame); // calcule le temps normalise actuel

            this.onUpdateFrame(cur,this.current_time,this.current_frame);
        },
        /*
            [PRIVATE]
            Change le temps en cours
                [float] time : temps normalisé (0~1)
        */
        set_time : function(time){
            this.current_time = time;
            this.current_frame = parseInt(this.max_frame*time);
        },
        /*
            [PRIVATE]
            Change la frame en cours
                [int] frame : numéro de frame (0= première frame)
        */
        set_frame : function(frame){
            this.current_time = (1.0/this.max_frame)*frame;
            this.current_frame = frame;
        }
    },
    /*
        Crée un timer de fréquence
        Retourne:
            [wfw.timer.FREQUENCY_TIMER] L'Objet du timer
    */
    CreateFrequencyTimer : function(att){
        return $new(wfw.timer.FREQUENCY_TIMER,att);
    }
};

/*
-----------------------------------------------------------------------------------------------
    Form Manager
        Gere les formulaires en lignes, verification automatique des format de donnes, creation des requetes.
-----------------------------------------------------------------------------------------------
*/
wfw.form = {
    /*
    Initialise un formulaire depuis un résulat de requête
    Arguments:
    [string]   name     : Identifiant de la requête (voir wfw.request.Add())
    [string]   formId   : Identifiant de l'élément FORM
    [object]   args     : Tableau associatif des champs retourné par une requête XARG
    Remarques:
    initFromArg affiche les messages d'erreurs (wfw.stdEvent.onFormResult)
    Retourne:
    [bool] true en cas de succès, sinon false
    */
    initFromArg: function (name, formId, args) {
        //obtient l'element form
        var form = $(formId);
        if (!form) {
            wfw.puts("wfw.form.initFromArg: can't get form " + formId);
            return false;
        }

        //charge les champs
        if (args != null) {
            //alert("initFromElement: charge les champs");
            this.set_fields(formId, args);
        }

        //initialise les champs
        this.init_fields(formId);

        //rappel le resultat de la requête precedente
        if (typeof (args.result) != "undefined")
            wfw.stdEvent.onFormResult(formId, args);

        return true;
    },
    /*
    Initialise un formulaire depuis l'URL
    Arguments:
    [string]   name     : Identifiant de la requête (voir wfw.request.Add())
    [string]   formId   : Identifiant de l'élément FORM
    [function] callback : Optionnel, fonction de rappel (voir remarques)
    Remarques:
    Format du callback: void callback(string form_name, object result, [object req_obj])
    callback reçois en argument le résultat de la requête au format XARG (voir documentation)
    initFromURI affiche les messages d'erreurs si l'argument '_xarg_' est présent (wfw.stdEvent.onFormResult)
    Retourne:
    true en cas de succès, sinon false
    */
    initFromURI: function (name, formId, callback) {
        //obtient l'element form
        var form = $(formId);
        if (!form) {
            wfw.puts("wfw.form.initFromURI(): can't get form " + formId);
            return false;
        }
        if (typeof (callback) != "function")
            callback = wfw.stdEvent.onFormResult;

        //initialise les elements du formulaire
        //        var element_list = new Array();
        var uri = wfw.uri.cut(wndGetURL(window));
        //        objAlertMembers(uri);
        var url_element_list = ((uri != null && !empty(uri.query)) ? wfw.uri.query_to_object(uri.query, true) : null);
        //        objAlertMembers(url_element_list);

        //charge les champs
        if (url_element_list != null) {
            //alert("initFromElement: charge les champs");
            this.set_fields(formId, url_element_list);
        }

        //initialise les champs
        this.init_fields(formId);

        //rappel le resultat de la requete precedente ('_xarg_')
        if ((url_element_list != null) && (typeof (url_element_list['_xarg_']) == 'string')) {
            // reponse de requête passée dans '_xarg_' ?
            var result = x_request_arguments_parse(url_element_list['_xarg_'], false);
            if (typeof (result.wfw_form_name) && (result.wfw_form_name == name))
            {
                var req_obj = $new(wfw.request.REQUEST,{
                    args:object_pop(url_element_list,["_xarg_"])
                });
                callback(result.wfw_form_name, result, req_obj);
            }
        }
        return true;
    },
    /*
    Initialise un formulaire depuis un tableau de données
    Arguments:
    [string]   name     : Identifiant de la requête (voir wfw.request.Add())
    [string]   formId   : Identifiant de l'élément FORM
    [object]   fields   : tableau associatif des données
    Retourne:
    false en cas d'échec, true en cas de succès
    */
    initFromFields: function (name, formId, fields) {
        //obtient l'element form
        var form = $(formId);
        if (!form) {
            wfw.puts("wfw.form.initFromFields(): can't get form " + formId);
            return false;
        }

        //charge les champs
        if (fields != null) {
            //alert("initFromElement: charge les champs");
            this.set_fields(formId, fields);
        }

        //initialise les champs
        this.init_fields(formId);

        return true;
    },
    /*
    Initialise les champs d'un formulaire
    Arguments:
    [string] formId : Identifiant de l'élément FORM
    Remarques :
    Pour connaitre les different éléments spéciaux (voir formulaire)
    */
    init_fields: function (formId) {
        //obtient l'element form
        var form = $(formId);
        if (!form)
            return false;

        //scan les elements
        nodeEnumNodes(
            form,
            function (node, conditions) {
                if (node.nodeType == ELEMENT_NODE) {
                    //
                    // multilangage input
                    //
                    var data_type = objGetAtt(node, 'wfw_lang');
                    if (data_type != null)
                        wfw.ext.lang.attachToInput(node, strexplode(data_type,",",true), {keyChange : true});

                    //
                    // verification de données ?
                    //
                    var data_type = objGetAtt(node, 'wfw_datatype');
                    if (data_type != null)
                        wfw.event.ApplyTo(node, "wfw_datatype_check");

                    //
                    // liste de champs ? (wfw.ext)
                    //
                    var wfw_form_element = objGetAtt(node, 'wfw_fieldlist');
                    if (wfw_form_element != null && $if("wfw.ext"))
                        wfw.ext.fieldlist.initElement(node);

                    //
                    // liste de données ? (wfw.ext)
                    //
                    var wfw_datalist = objGetAtt(node, 'wfw_datalist');
                    if (wfw_datalist != null && $if("wfw.ext")) {
                        switch (node.tagName.toLowerCase()) {
                            case "input":
                                wfw.ext.datalist.attachToInput(wfw_datalist, node);
                                break;
                            case "select":
                                wfw.ext.datalist.attachToSelect(wfw_datalist, node);
                                break;
                        }
                    }

                    //
                    // module requis ? (wfw.ext)
                    //
                    var wfw_require_module = objGetAtt(node, 'wfw_require_module');
                    if (wfw_require_module != null && $if("wfw.ext")) {
                        var module = wfw.ext.navigator.getModule(wfw_require_module);
                        switch (node.tagName.toLowerCase()) {
                            /*case "input":
                            node.disabled = (module==null) ? "disabled" : "";
                            wfw.ext.bubble.insertTextToElement(node,"Requière le module "+wfw_require_module);
                            break;*/ 
                            default:
                                if (module == null)
                                    wfw.style.addClass(node, "wfw_hidden");
                                else
                                    wfw.style.removeClass(node, "wfw_hidden");
                                break;
                        }
                    }
                    
                    //
                    // active/desactive un contenu
                    //
                    var wfw_enabled = objGetAtt(node, 'wfw_enabled');
                    if (wfw_enabled != null) {
                        //[change]
                        objSetEvent(node,"click",function(e,p){
                            var enabled_element_id = objGetAtt(this, 'wfw_enabled');
                            if(empty(enabled_element_id))
                                return;
                            var enabled_element_node = $(enabled_element_id);
                            if(enabled_element_node!=null)
                                wfw.utils.enabledContent($(enabled_element_id),this.checked);
                        },null);

                        //premiere initialisation
                        wfw.utils.enabledContent($(wfw_enabled),node.checked);
                    }
                }
                return true; // continue l'enumeration
            },
            false
        );
    },
    /*
    Initialise les champs d'un formulaire
    Arguments:
    [string] formId : Identifiant de l'élément FORM
    [object] fields : Tableau associatif des champs à initialiser
    Remarques:
    Seuls les champs donnés sont initialisés, les autres champs du formulaire restent inchangés
    Retourne:
    [void]
    */
    set_fields: function (formId, fields,options) {
        //obtient l'element form
        var form = $(formId);
        if (!form)
            return false;

        //options
        options = object_merge({
            lang : null
        },options,false);
        
        //verifie que l'extension pour les langages est presente
        if(!$if("wfw.ext.lang"))
          options.ext_lang = null;

        //
        var datalist_list = new Array();

        //scan les elements
        nodeEnumNodes(
            form,
            function (node, conditions) {
                if (node.nodeType == ELEMENT_NODE) {
                    var element_name;

                    // element name ?
                    if (empty(element_name = objGetAtt(node, 'name')))
                        return true; //continue
                    //element_name = element_name.toLowerCase();
                    var field_value = ((fields != null) && (typeof fields[element_name] != "undefined")) ? ""+fields[element_name] : null;//assume le type string

                    //par type...
                    switch (node.tagName.toLowerCase()) {
                        case 'input':
                            switch (objGetAtt(node, 'type')) {
                                case 'button': /* texte des boutons (lecture seule) */
                                case 'hidden':
                                case 'text':
                                    // importe la valeur, si existante
                                    if (field_value != null){
                                        //charge le texte dans un langage specifique ?
                                        var text_lang = (options.lang!=null) ? wfw.ext.lang.setInputString(node,field_value,options.lang) : false;
                                        if(!text_lang)
                                            objSetAtt(node, 'value', field_value);
                                            
                                        //
                                        //objSetAtt(node, 'value', field_value);
                                    }
                                    break;
                                case 'checkbox':
                                    // importe la valeur, si existante
                                    if (field_value == 'on' || field_value == 'true') {
                                        objSetAtt(node, 'checked', 'checked');
                                        objSetAtt(node, 'value', 'on');
                                    }
                                    else {
                                        objRemoveAtt(node, 'checked');
                                    }
                                    break;
                                case 'radio':
                                    // importe la valeur, si existante
                                    if (field_value == objGetAtt(node, 'value')) {
                                        objSetAtt(node, 'checked', 'checked');
                                    }
                                    break;
                            }
                            break;
                        case 'select':
                            // importe la valeur, si existante
                            if (field_value != null) {
                                for (var i = 0; i < node.options.length; i++)
                                    if (node.options[i].value == field_value)
                                        node.selectedIndex = i;
                            }
                            break;
                        case 'textarea':
                            // importe la valeur, si existante
                            if (field_value != null)
                            {
                                objSetInnerText(node, field_value);
                            }
                            break;
                        //                     
                        //en lecture seule...                     
                        //                     
                        case 'form':
                        case 'html':
                        case 'body':
                            break;
                        default:
                            // importe la valeur, si existante
                            if (field_value != null)
                                objSetInnerText(node, field_value);
                            break;
                    }
                }
                return true; // continue l'enumeration
            },
            false
        );

        //for(i in datalist_list)
        //    wfw.form.datalist.hide(objGetAtt(datalist_list[i],"id"));
    },
    /*
    Obtient la liste des champs d'un formulaire
    Arguments:
        [string] formId  : Identifiant de l'élément FORM
        [object] options : Optionnel, Arguments additionnels (voir options)
    Retourne:
        [object] Tableau associatif des champs trouvés. Vide, si aucun élément n'est trouvé
    Remarques:
        Les input de type "radio" sont listés avec une valeur vide si aucun choix n'est fait
    Options:
        [string] selectByAtt   = "name"   : Attribut utilisé pour séléctionner les éléments
        [bool]   getStaticNode = "false"  : Si true, ajoute les éléments non éditables à la liste (div, span, p, etc...)
        [string] lang          = null     : Langage à utiliser lors de la lecture des textes (wfw.ext.lang)
    */
    get_fields: function (formId, options) {
        var fields = new Object();
        
        //options
        options = object_merge({
            selectByAtt:"name",
            getStaticNode:false,
            lang : null
        },options,false);
        
        //verifie que l'extension pour les langages est presente
        if(!$if("wfw.ext.lang"))
          options.ext_lang = null;

        //obtient l'element
        var form = $(formId);
        if (!form)
            return false;

        //charge les champs des valeurs trouvees
        nodeEnumNodes(
            form,
            function (node, conditions) {
                if (node.nodeType == ELEMENT_NODE) {
                    var element_name;

                    // element name ?
                    if (empty(element_name = objGetAtt(node, options.selectByAtt)))
                        return true; //continue
                    element_name = element_name.toLowerCase();

                    // initialise le champs
                    //fields[element_name] = ""; // ne pas mettre à zero pour éviter que les champs "radio" ne se supprimes lors de l'iteration

                    //par type...
                    //  if(node.tagName.toLowerCase()=='input')
                    //      alert(element_name+"="+objGetAtt(node,'type')+"="+objGetAtt(node,'value'));
                    switch (node.tagName.toLowerCase()) {
                        case 'input':
                            switch (objGetAtt(node, 'type')) {
                                case 'hidden':
                                case 'text':
                                case 'password':
                                    //charge le texte dans un langage specifique ?
                                    var text_lang = (options.lang!=null) ? wfw.ext.lang.getInputString(node,options.lang) : null;
                                    if(text_lang!=null)
                                        fields[element_name] = text_lang;
                                    else
                                        fields[element_name] = objGetAtt(node, 'value');
                                    break;
                                case 'radio':
                                    if (node.checked == true)
                                        fields[element_name] = objGetAtt(node, 'value');
                                    //ajoute une valeur vide si aucun choix n'est fait
                                    //( cette valeur vide permet à get_fields d'identifier l'element meme si aucun champs n'est choisit )
                                    else if(typeof(fields[element_name])=="undefined")
                                        fields[element_name] = "";
                                    break;
                                case 'checkbox':
                                    fields[element_name] = (node.checked ? "on" : "off");
                                    break;
                                case 'file':
                                    wfw.puts("wfw.form.get_fields: file input not supported!");
                                    break;
                            }
                            break;
                        case 'select':
                            fields[element_name] = objGetAtt(node, 'value');
                            break;
                        case 'textarea':
                            //fields[element_name] = objGetInnerText(node);
                            fields[element_name] = objGetAtt(node, 'value'); // !! a verifier !!
                            break;
                        //                     
                        //en lecture seule...                     
                        //                     
                        default:
                            if(options.getStaticNode)
                                fields[element_name] = objGetInnerText(node);
                            return true; // continue l'enumeration
                    }
                }
                return true; // continue l'enumeration
            },
            false
        );
        return fields;
    },
    /*
    Obtient la liste des champs d'un formulaire
    Arguments:
    [string] formId  : Identifiant de l'élément FORM
    [object] options : Optionnel, Arguments additionnels (voir remarques)
    Retourne:
    [object] Tableau associatif avec les champs trouvés. Vide, si aucun élément n'est trouvé
    Remarques:
        Arguments additionnels:
            [string] selectByAtt   = "name"   : Nom de l'attribut qui identifie l'élément.
            [bool]   getStaticNode = "false"  : Si true, ajoute les éléments non editables à la liste (div, span, p, etc...)
    */
    get_elements: function (formId, options) {
        var fields = new Object();

        //options
        var att = {
            selectByAtt:"name",
            getStaticNode:false
        };
        if(typeof(options)!="undefined")
            att=object_merge(att,options);

        //obtient l'element
        var form = $(formId);
        if (!form)
            return false;

        //liste les éléments trouvés
        nodeEnumNodes(
            form,
            function (node, conditions) {
                if (node.nodeType == ELEMENT_NODE) {
                    var element_name;

                    // element name ?
                    if (empty(element_name = objGetAtt(node, att.selectByAtt)))
                        return true; //continue
                    element_name = element_name.toLowerCase();
                    switch (node.tagName.toLowerCase()) {
                        case 'input':
                            switch (objGetAtt(node, 'type')) {
                                case 'hidden':
                                case 'text':
                                case 'password':
                                case 'checkbox':
                                case 'file':
                                    fields[element_name] = node;
                                case 'radio':
                                    if (node.checked == true)
                                        fields[element_name] = objGetAtt(node, 'value');
                                    break;
                            }
                            break;
                        case 'select':
                        case 'textarea':
                            fields[element_name] = node;
                            break;
                        default:
                            if(att.getStaticNode)
                                fields[element_name] = node;
                            return true; // continue l'enumeration
                    }
                }
                return true; // continue l'enumeration
            },
            false
        );
        return fields;
    },
    /*
    Envoie un formulaire
    Arguments:
    [string]   formId    : Identifiant de l'élément FORM
    [function] [callback]: (obselete) Optionnel, fonction de rappel. Si non spécifié 'wfw.stdEvent.onFormResult' est utilisé
    [string]   [uri]     : Optionnel, URI
    [string]   [target]  : Optionnel, nom du document cible
    Retourne:
    [bool] false en cas d'échec. true en cas de succès.
    Remarques:
    send, Provoque l'envoie du formulaire par le navigateur
    */
    send: function (formId, callback, uri, target) {

        //dynamique?
        //if(typeof(wfw.request))
        if (typeof (callback) != "function")
            callback = wfw.stdEvent.onFormResult;

        var form = document.forms.namedItem(formId);
        if (form == null)
            return false;

        var old_action = form.action;
        var old_target = form.target;

        if (typeof (uri) == "string")
            form.action = uri;

        if (typeof (target) == "string")
            form.target = target;

        form.submit();

        form.action = old_action;
        form.target = old_target;

        return true;
    },
    /*
    Envoie un formulaire par requête
    Arguments:
    [string]   formId    : Identifiant de l'élément FORM
    [string]   [uri]     : Optionnel, URI
    [boll]     [async]   : Optionnel, asynchrone ?
    [function] [callback]: Optionnel, callback passé à wfw.request.Add Si non spécifié 'wfw.stdEvent.onFormResult' est utilisé
    [object]   [param]   : Optionnel, paramètres passés au callback
    Remarques:
    sendReq, Initilise une nouvelle requête avec les champs du formulaire
    Les éléments de type input[file] ne sont pas supportés
    Retourne:
    [bool] false en cas d'échec. true en cas de succès.
    */
    sendReq: function (formId, uri, async, callback, param) {
        var arg = wfw.form.get_fields("form");

        var form = document.forms.namedItem(formId);
        if (form == null)
            return false;

        //callback   
        if (typeof (callback) != "function")
            callback = wfw.utils.onCheckRequestResult_XARG;

        //uri   
        if (typeof (uri) != "string")
            uri = form.action;

        //param   
        if (typeof (param) != "object")
            param = null;

        wfw.request.Add(formId, uri, arg, callback, param, async);

        return true;
    },
    /*
    Envoie un formulaire par iframe
    Arguments:
        [string]   formId    : Identifiant de l'élément FORM
        [string]   [uri]     : Optionnel, URI
        [function] [callback]: Optionnel, callback recevant la réponse, callback(responseText,param)
        [object]   [param]   : Optionnel, paramètres passés au callback
        [object] options : Optionnel, Arguments additionnels (voir options)
    Remarques:
        sendFrame, initialise une IFrame dynamique pour recevoir le contenu de la requete. La reponse est ensuite passé au callback puis l'iframe est supprimée
    Retourne:
        [bool] false en cas d'échec. true en cas de succès.
    Options:
        [object] add_fileds   = null   : Tableau associatif des paramètres supplementaire à ajouter
    */
    sendFrame: function (formId, uri, callback, param, options) {
        //merge les options
        options = object_merge({
            add_fileds : null
        },options,false);

        //obtient la form
        var form = $(formId);
        if (form == null)
            return false;

        //crée l'iframe
        var frame_id = uniqid();
        var frame = document.createElement('iframe');
        objSetAtt(frame, "id", frame_id);
        objSetAtt(frame, "name", frame_id);
        objSetAtt(frame, "width", "400px");
        objSetAtt(frame, "height", "400px");
        objSetAtt(frame, "style", "border:1px solid black;");
        frame.callback = callback;
        frame.param = param;

        //pour un fonctionnement normal : insert avant onLoad (safari), apres initialisation (IE)
        objInsertNode(frame, document.body, null, INSERTNODE_END);

        //[onLoad]
        objSetEvent(frame, "load", function (e) {
            //ok, appel le callback
            var textContent = "";
            if(this.contentWindow.document){
                if (this.contentWindow.document.body.innerHTML)
                    textContent = this.contentWindow.document.body.innerHTML;
                else if (this.contentWindow.document.body.outerText)//opera
                    textContent = this.contentWindow.document.body.outerText;
                else
                    wfw.puts("wfw.form.sendFrame: cant get response from iframe !!");
            }
            else
               wfw.puts("wfw.form.sendFrame: cant get document from iframe !!");

            this.callback(textContent, this.param);
            //nodeRemoveNode(this); //opera bug
        }, param);
        
        //ajoute les parametres additionnels
        if(options.add_fields != null){
            var elements = wfw.form.get_elements(formId,{ getStaticNode:true });
            var input;
            for(var field_name in options.add_fields){
                //obtient l'input si il existe
                input = (typeof(elements[field_name])!="undefined") ? elements[field_name] : null;
                //cree l'input si il n'existe pas
                if(input == null && (input = document.createElement('input'))!=null)
                    objInsertNode(input, form, null, INSERTNODE_END);
                //pas d'input ?
                if(input == null)
                    continue;
                //initialise l'input
                objSetAtt(input, "type", "text");
                objSetAtt(input, "name", field_name);
                objSetAtt(input, "value", options.add_fields[field_name]);
            }
        }

        //prepare puis envoie la form
        var old_action = form.action;
        var old_target = form.target;

        if (typeof (uri) == "string")
            form.action = uri;

        form.target = frame_id;

        form.submit();

        form.action = old_action;
        form.target = old_target;

        return true;
    }
};

/*
-----------------------------------------------------------------------------------------------
    Style Manager
        Gere les style CSS.
-----------------------------------------------------------------------------------------------
*/
wfw.style = {
    /*
        Vérifie si l'élément est attaché à une classe donnée
            [object]   obj       : L'Elément
            [string]   className : Nom de la classe
        Retourne:
            [bool] true si la class est présente, sinon false
    */
    haveClass : function(obj,className){
        var orgClass = objGetClassName(obj);
        if(orgClass.indexOf(className) == -1)
            return false;
        return true;
    },
    /*
        Attache une classe à un élément
            [object]   obj       : L'Elément
            [string]   className : Nom de classe
        Retourne:
            [string] chaine original comportant les noms de classes présent avant changement
    */
    addClass : function(obj,className){
        var orgClass = objGetClassName(obj);
        if(orgClass.indexOf(className) == -1)
            return objSetClassName(obj,orgClass+" "+className);
        return orgClass;
    },
    /*
        Détache une classe d'un élément
            [object]   obj       : L'Elément
            [string]   className : Nom de classe
        Retourne:
            [string] chaine original comportant les noms de classes présent avant changement
    */
    removeClass : function(obj,className){
        var orgClass = objGetClassName(obj);
        orgClass = orgClass.replace(className, '');
        return objSetClassName(obj,orgClass);
    },
    /*
        Détache une classe d'un élément
            [object]   obj       : L'Elément
            [string]   className : Nom de classe
        Retourne:
            [string] chaine original comportant les noms de classes présent avant changement
    */
    createClass : function(className, style){
        
        var styleNode = $("wfw_ext_dynamic_style");

        if(!styleNode){
            styleNode = document.createElement("style");
            objSetAtt(styleNode,"type","text/css");
            objSetAtt(styleNode,"id","wfw_ext_dynamic_style");
            var headNode = docGetNode(document,"html/head");
            objInsertNode(styleNode,headNode,null,INSERTNODE_END);
        }

        objGetInnerText(styleNode,className+"{"+style+"}");
        var insert_content = className+"{"+style+"}\n";
        var content = objGetInnerText(styleNode);

        //remplace la chaine existante 
        if(!empty(content)){
            var offset_start = content.indexOf(className);
            if(offset_start>=0){
                var offset_end = content.indexOf("\n",offset_start);
                objSetInnerText(styleNode,content.substring(0, offset_start)+insert_content+content.substring(offset_end+1));
                return;
            }
        }

        //insert a la suite du contenu
        content += insert_content;
//        wfw.puts(styleNode,false);
        objSetInnerText(styleNode,content);

    }
};

/*
-----------------------------------------------------------------------------------------------
    Recherche
-----------------------------------------------------------------------------------------------
*/
wfw.search = {
    MATCH_WORDS : 0x1,//recherche un mot
    MATCH_LINE : 0x0,//recherche la ligne
    MATCH_CASE : 0x2,//sensible a la case
    MATCH_WHOLE_WORD : 0x4,//recherche un mot entier/recherche une ligne entière
    MATCH_EXACT_STRING : 0x8,//recherche la ligne exacte (seulement avec 'MATCH_LINE')
    MATCH_EXPRESSION : 0x10,//utilise les expressions régulières (* = n'importe quel caracteres)
    /*
        Test une recherche sur la chaine de caracteres
	    Argument:
            [string] search  : Chaine à rechercher
            [string] value   : Chaine à analyser
            [int]    att     : Attributs de la recherche
	    Retourne:
            [bool] true si la chaine est trouvé, sinon false
    */
    string : function(search, value,att) {
        //utilise les expressions régulières ?
        if(att & this.MATCH_EXPRESSION){
            //precede les caracteres speciaux par un back-slash '\'
            search = search.replace(new RegExp('([\\\\\;\\.\\!\\$\\^\\[\\]\\(\\)\\{\\}\\?\\+\\-\\|]{1})','gi'),'\\$1');
            //autres caracteres
            search = search.replace('*','(?:[.]*)');
        }
        else{
            //precede les caracteres speciaux par un back-slash '\'
            var reg = new RegExp('([\\\\\;\\.\\!\\$\\^\\[\\]\\(\\)\\{\\}\\?\\*\\+\\-\\|]{1})', 'gi');
            search = search.replace(reg,'\\$1');
        }
        //recherche par mot...
        if(att & this.MATCH_WORDS)
        {
            var words = strexplode(search, " ", true);
            for(var x in words)
            {
                var word = words[x];
                //attribut de l'expression reguliere
                var exp_att="g";
                if(!(att & this.MATCH_CASE))
                    exp_att+="i";
                //mot entier
                if(att & this.MATCH_WHOLE_WORD)
                    word="(\\W|^)"+word+"(\\W|$)";
                else
                    word="(\\W|^)"+word;
                //remplace les espaces par le caractere special d'espacement '\s'
                word = word.replace(/[\s]{1,}/gi,'\\s');
                //test
                var reg = new RegExp(word, exp_att);
                if(reg.test(value))
                    return true;
            }
        }
        //recherche la ligne
        else//MATCH_LINE
        {
            //attribut de l'expression reguliere
            var exp_att="g";
            if(!(att & this.MATCH_CASE))
                exp_att+="i";
            //ligne entiere
            if(att & this.MATCH_WHOLE_WORD)
                search="(\\W|^)"+search+"(\\W|$)";
            else if(att & this.MATCH_EXACT_STRING)
                search="^"+search+"$";
            //remplace les espaces par le caractere special d'espacement '\s'
            search = search.replace(/[\s]{1,}/gi,'\\s');
            //test
            var reg = new RegExp(search, exp_att);
            if(reg.test(value))
                return true;
        }
        return false;
    },
    string_array : function(search, string_ar,att) {
        var new_fields = [];
        for(var index in string_ar)
        {
            var value = string_ar[index];
            if(typeof(value)=="string" && this.string(search,value,att))
            {
                new_fields.push(value);
            }
        }
        return new_fields;
    },
    string_object : function(search, string_obj,att) {
        var new_fields = {};
        for(var index in string_obj)
        {
            var value = string_obj[index];
            if(typeof(value)=="string" && this.string(search,value,att))
            {
                new_fields[index]=value;
            }
        }
        return new_fields;
    }
};

/*
-----------------------------------------------------------------------------------------------
    Math utils
-----------------------------------------------------------------------------------------------
*/
wfw.math = {
    //converti un caractere hexadecimale (0-F) en entier numerique
    hex_char_to_int : function(hc) {
        switch(hc){
            case '0': return 0;
            case '1': return 1;
            case '2': return 2;
            case '3': return 3;
            case '4': return 4;
            case '5': return 5;
            case '6': return 6;
            case '7': return 7;
            case '8': return 8;
            case '9': return 9;
            case 'A': return 10;
            case 'B': return 11;
            case 'C': return 12;
            case 'D': return 13;
            case 'E': return 14;
            case 'F': return 15;
            case 'a': return 10;
            case 'b': return 11;
            case 'c': return 12;
            case 'd': return 13;
            case 'e': return 14;
            case 'f': return 15;
         }
         return null;
    },
    
    //converti un nombre hexadecimale (2 caracteres) en entier
    hex2_to_int : function(hex) {
        var i1 = this.hex_char_to_int(hex.substr(0,1));
        var i2 = this.hex_char_to_int(hex.substr(1,1));

        return i2 + (i1*16);
    },
    
    //converti un nombre hexadecimale (3 caracteres) en entier
    hex3_to_int : function(hex) {
        var i1 = this.hex_char_to_int(hex.substr(0,1));
        var i2 = this.hex_char_to_int(hex.substr(1,1));
        var i3 = this.hex_char_to_int(hex.substr(2,1));

        return i3 + (i2*256) + (i1*16);
    },
    
    //converti un nombre hexadecimale (4 caracteres) en entier
    hex4_to_int : function(hex) {
        var i1 = this.hex_char_to_int(hex.substr(0,1));
        var i2 = this.hex_char_to_int(hex.substr(1,1));
        var i3 = this.hex_char_to_int(hex.substr(2,1));
        var i4 = this.hex_char_to_int(hex.substr(3,1));

        return i4 + (i3*4069) + (i2*256) + (i1*16);
    },

    //converti un nombre hexadecimale (texte) en entier numerique
    hex_to_int : function(hex) {
        var hex_length = hex.length;
        var integer = 0;
        var i=0;
        while(hex_length--){
            var hex_int = this.hex_char_to_int(hex.substr(i,1));
          //  alert(hex_length+":"+hex.substr(hex_length,1)+"="+hex_int);
            if(hex_length==0)
                integer += hex_int;
            else
                integer += (hex_int*Math.pow(2,4*hex_length)); //hex_int*(2^nbits) - (2^nbits) = 16(2^4), 256(2^8), 4096(2^12), 65536(2^16),...
          //  alert(integer);
            i++;
        }
        return integer;
    },
    
    //converti un entier numerique en caractere hexadecimale (0-15)
    int_to_hex_char : function(i) {
        switch(parseInt(i)){
            case 0: return 0;
            case 1: return 1;
            case 2: return 2;
            case 3: return 3;
            case 4: return 4;
            case 5: return 5;
            case 6: return 6;
            case 7: return 7;
            case 8: return 8;
            case 9: return 9;
            case 10: return 'A';
            case 11: return 'B';
            case 12: return 'C';
            case 13: return 'D';
            case 14: return 'E';
            case 15: return 'F';
         }
         return null;
    },
    int32_to_hex : function(num) {
        return zerolead(num.toString(16), 4).toUpperCase();
    },
    char_to_hex : function(num) {
        return zerolead(num.toString(16), 2).toUpperCase();
    }
    //converti un nombre entier (32bits) en chaine hexadecimale
    /*int32_to_hex : function(num) { 
        var _4096=0;
        var _256=0;
        var _16=0;
        var div;
        //combien de multiple de 4096
        div = parseInt(num / 4096);
        if(div){
            num = num - (div * 4096);
            _4096 = div;
        }
        //combien de multiple de 256
        div = parseInt(num / 256);
        if(div){
            num = num - (div * 256);
            _256 = div;
        }
        //combien de multiple de 16
        div = parseInt(num / 16);
        if(div){
            num = num - (div * 16);
            _16 = div;
        }
        //rest
        return ( (_4096 ? this.int_to_hex_char(_4096) : "") + (_256 ? this.int_to_hex_char(_256) : "") + (_16 ? this.int_to_hex_char(_16) : "") + this.int_to_hex_char(num) );
    }*/

};

/*
-----------------------------------------------------------------------------------------------
    Local path
        respect du RFC 3986
-----------------------------------------------------------------------------------------------
*/
wfw.path = {
    filename : function(path)
    {
        var name = '[^\\//?*]*';
        var exp = new RegExp('^([/]?)('+name+'/)*('+name+')$','g');
        rslt = exp.exec(path);
        if(rslt != null){
//            objAlertMembers(rslt);
            var point_pos = rslt[3].lastIndexOf('.');
            if(!point_pos)
                return "";
            return rslt[3].substring(0,point_pos);
        }
        return null;
    }/*,
    fileext : function(path)
    {
        alert(path);
        var name = '[^\\//?*]*';
        var exp = new RegExp('^([/]?)('+name+'/)*('+name+')$','g');
        rslt = exp.exec(path);
        if(rslt != null){
            objAlertMembers(rslt);
            return rslt[3].substring(rslt[3].lastIndexOf('.'));
        }
        return null;
    }*/
};

/*
-----------------------------------------------------------------------------------------------
    Universal Resource Identifier
        respect du RFC 3986
-----------------------------------------------------------------------------------------------
*/
wfw.uri = {

    /*
        Composants d'une adresse URI
        Membres:
            [string] addr      : Adresse complète de l'URI
            [string] scheme    : Schéma sans "://". Si aucun, une chaine vide
            [string] authority : Nom de domaine ou adresse IP
            [string] path      : Chemin d'accès (sans "/" en début). Si aucun, une chaine vide
            [string] query     : Paramètres (sans "?" au début). Si aucun, une chaine vide
            [string] fragment  : Ancre (sans "#" au début). Si aucun, une chaine vide
    */
    ADDRESS : {
        _name: "wfw.uri.ADDRESS",
        addr      : "",
        scheme    : "",
        authority : "",
        path      : "",
        query     : "",
        fragment  : "",
        
        //constructeur
        _construct : function(obj){
            obj.makeAddress();
        },

        /* méthodes */
        makeAddress: function () {
            this.addr = "";
            //protocol
            if (!empty(this.scheme))
                this.addr += this.scheme + '://';
            //domain
            this.addr += this.authority;
            //chemin
            if (!empty(this.path))
                this.addr += '/' + this.path;
            //parametres
            if (!empty(this.query))
                this.addr += '?' + this.query;
            //ancre
            if (!empty(this.fragment))
                this.addr += '#' + this.fragment;
            return this.addr;
        }
    },

    /*
    Découpe une adresse web (URI) en sections
    Le format est basé sur le standard RFC-2396 (http://tools.ietf.org/html/rfc2396#section-3.1)

    Paramètres:
        [string] uri : l'URI
    Retourne:
        [wfw.uri.ADDRESS] Objet de l'adresse. null si l'URI est invalide
    */
    cut: function (uri) {
        // !! FONCTION A METTE A JOUR RFC-3986 !!
        //caracteres authorisés par le RFC-3986 (http://tools.ietf.org/html/rfc3986)
        var c_sub_delims = "[!$&'()*+,;=]";
        var c_pct_encoded = "%[0-9]{2}";
        var c_unreserved = "[A-Za-z0-9-._~]";
        var c_query = c_unreserved + c_pct_encoded + c_sub_delims + "[:@]*";
        // !! FONCTION A METTE A JOUR RFC-3986 !!

        //
        var obj = $new(wfw.uri.ADDRESS, { addr: uri, scheme: "", authority: "", path: "", query: "", fragment: "" });
        var exp, rslt;

        //obtient le schema (scheme)
        var scheme = '[A-Za-z]{1}[A-Za-z0-9+\\.\\-]*';
        exp = new RegExp('^((' + scheme + ')://)?(.*)', 'g');
        rslt = exp.exec(uri);
        if (rslt[2] != undefined) {
            obj.scheme = rslt[2];
            uri = rslt[3]; //restant de l'uri
        }

        //obtient le domaine (*/) (authority) [obligatoire]
        var port = '[0-9]+';
        var domain = '[A-Za-z]{1}[A-Za-z0-9_\\.:\\-]*'; //Registry-based
        //var server   = '';//Server-based <userinfo>@<host>:<port>
        exp = new RegExp('^(' + domain + ')?(.*)', 'g');
        rslt = exp.exec(uri);
        if (rslt[1] == undefined) // domaine obligatoire dans l'URI
        {
            wfw.puts("wfw.uri.cut: Invalid URI, domain not found in: " + uri);
            return null;
        }
        obj.authority = rslt[1];
        uri = rslt[2]; //restant de l'uri

        //obtient le path (*), query (?*) [optionnel] et fragment (#*) [optionnel]
        var path = '[A-Za-z0-9_\\.+%\\-]*';
        var query = '[A-Za-z0-9_\\.&=+;%\\-\\(\\)\\:\\/]*';
        var fragment = '[A-Za-z0-9_+%\\-]*';
        exp = new RegExp('^([/' + path + ']*)([?' + query + ']?)([#' + fragment + ']?)', 'g');
        rslt = exp.exec(uri);
        obj.path = ((rslt[1] != undefined) ? rslt[1].substr(1, rslt[1].length - 1) : ""); // sans '/'
        obj.query = ((rslt[2] != undefined) ? rslt[2].substr(1, rslt[2].length - 1) : ""); // sans '?'
        obj.fragment = ((rslt[3] != undefined) ? rslt[3].substr(1, rslt[3].length - 1) : ""); // sans '#'

        return obj;
    },

    /*
    Construit la chaine d'une URI à partir d'un objet

    Paramètres:
        [wfw.uri.ADDRESS] uri : Objet de l'adresse
    Retourne:
        [string] Chaine de l'URI
    */
    paste: function (uri) {
        var query = "";
        //protocol
        if (!empty(uri.scheme))
            query += uri.scheme + '://';
        //domain
        query += uri.authority;
        //chemin
        if (!empty(uri.path))
            query += '/' + uri.path;
        //parametres
        if (!empty(uri.query))
            query += '?' + uri.query;
        //ancre
        if (!empty(uri.fragment))
            query += '#' + uri.fragment;
        return query;
    },

    /*
    Construit la chaine d'une URI à partir des arguments

    Parametres:
    [string] scheme,authority,path,query,fragment
    Retourne:
    Chaine contenant l'URI.
    Remarques:
    Format d'une URI: "scheme.authority://path?query#fragment"
    */
    make: function (scheme, authority, path, query, fragment) {
        var query = "";
        //protocol
        if (!empty(scheme))
            query += scheme + '://';
        //domain
        query += authority;
        //chemin
        if (!empty(path))
            query += '/' + path;
        //parametres
        if (!empty(query))
            query += '?' + query;
        //ancre
        if (!empty(fragment))
            query += '#' + fragment;
        return query;
    },

    /*
    Convertie une chaine de paramètres 'Query' en tableau associatif

    Parametres:
    [string] querystr : La chaine du query, ex: "voiture=alpha&lieu=paris"
    [bool]   bdecode  : Si true, le texte des paramètres est décodé (encodage URI)
    Retourne:
    [object] Tableau associatif des paramètres
    */
    query_to_object: function (querystr, bdecode) {
        var query = querystr.split("&");
        var queryend = new Object();

        if (!query.length)
            return null;

        for (var i = 0; i < query.length; i++) {
            var tmp = query[i].split("=");
            if (bdecode)
                queryend[tmp[0]] = this.decodeUTF8(tmp[1]);
            else
                queryend[tmp[0]] = tmp[1];
        }

        return queryend;
    },

    /*
    Convertie un tableau associatif en chaine de paramètres 'Query' sans le séparateur '?'

    Parametres:
    [object] querytab : Tableau associatif des paramètres
    [bool]   bencode  : Si true, encode les paramètres
    Retourne:
    [string] La chaine de paramètres.
    */
    object_to_query: function (querytab, bencode) {
        var querystr = "";
        var bfirst = true;

        // if(typeof(bencode)=="undefined")
        //    bencode=true;

        for (var key in querytab) {
            if (typeof (querytab[key]) != 'string')
                continue;

            //
            if (!bfirst)
                querystr += "&";
            else
                bfirst = false;

            if (bencode)
                querystr += escape(key) + "=" + this.encodeUTF8(querytab[key]);
            else {
                //encode au moins les carateres speciaux "=" et "&"
                var value = querytab[key];
                value = value.replace(/\&/g, "%26");
                value = value.replace(/\=/g, "%3D");
                querystr += key + "=" + value;
            }
        }

        return querystr;
    },

    /*
    Encode les caractères dans une URI

    Parametres:
    [string] text : La chaine à encoder
    Retourne:
    [string] La chaine encodé au format d'une URI.
    Remarque:
    Encode tous les caractères supérieurs à 0x7f et ignore les caractères inferieur à 0x1f (dit, de contrôle)
    Encode les caractères supperieur à un octet (0xFF) sur plusieurs fragements ex: 0x4520 = "%45%20"
    */
    encode: function (text) {
        var string = "";
        var i = 0;
        var c;

        while (i < text.length) {

            c = text.charCodeAt(i);

            /*if (c <= 0x1f) {// (control hardware devices characters)
                //ignore...
            }
            else */if (c > 0xFF) { //+ bytes
                wfw.puts("wfw.uri.encode: unsuported up to 1 byte caracters encoding");
                //ignore...
            }
            else if (c < 0x30) { //+ bytes
                string += "%" + wfw.math.char_to_hex(c);
            }
            else {
                var reserved = "!*'();:@&=+$,/?%#[]<>";
                if ((x = reserved.indexOf(text.substr(i, 1))) != -1)
                    string += "%" + wfw.math.char_to_hex(reserved.charCodeAt(x));
                else
                    string += String.fromCharCode(c); //sans encodage 
            }
            i++;
        }

        return string;
    },
    /*
    Décode les caractères d'une URI

    Parametres:
    [string] text : La chaine à décoder
    Retourne:
    [string] La chaine décodé.
    Remarque:
    Les caractères ASCII sont encodés avec un '%' suivit du nombre hexadécimal sur un octet. ex: "%E9"
    */
    decode: function (text) {
        var string = "";
        var i = 0;
        var c;

        while (i < text.length) {

            c = text.charCodeAt(i);

            switch (c) {
                case 0x25: //%
                    var i1 = wfw.math.hex_char_to_int(text.substr(i + 1, 1)); //c1
                    var i2 = wfw.math.hex_char_to_int(text.substr(i + 2, 1)); //c2
                    var octal = i2 + (i1 * Math.pow(2, 4));
                    c = String.fromCharCode(octal);
                    i += 2;
                    break;
                default:
                    c = String.fromCharCode(c);
                    break;
            }

            i++;
            string += c;

        }

        return string;
    },

    /*
    Encode les caractères dans une URI (UTF-8)

    Parametres:
    [string] text : La chaine à encoder
    Retourne:
    [string] La chaine encodé au format d'une URI.
    Remarque:
    Les caractères inférieur à 0x1F (de contrôle) sont ignorés
    Les caractères ASCII sont encodés avec un '%' suivit du nombre hexadécimal sur un octet. ex: "%E9"
    Les caractères UTF-8 sont encodés avec un à quatre '%' suivit du nombre hexadécimal sur un octet. ex: "%D0%89"
    */
    encodeUTF8: function (text) {
        var string = "";
        var i = 0;
        var x;
        var c;

        while (i < text.length) {

            c = text.charCodeAt(i);
            //ASCII base ?
            /*if (c <= 0x7) {// (control hardware devices characters)
                //ignore...
            }
            else */if (c <= 0x30) {
                string += "%" + wfw.math.char_to_hex(c);
            }
            else if (c <= 0x7F) {
                var reserved = "!*'();:@&=+$,/?%#[]<>";
                if ((x = reserved.indexOf(text.substr(i, 1))) != -1)
                    string += "%" + wfw.math.char_to_hex(reserved.charCodeAt(x));
                else
                    string += String.fromCharCode(c); //sans encodage
            }
            //UTF8
            else if (c <= 0xFFFFFFFF) {
                // 2 bytes
                if (c >= 0x7F && c < 0x800) {
                    string += "%" + wfw.math.char_to_hex((c >> 6) | 0xC0);    //110X.XXXXb
                    string += "%" + wfw.math.char_to_hex((c & 0x3F) | 0x80);  //10XX.XXXXb
                }
                // 3 bytes
                if (c >= 0x800 && c < 0xFFFF) {
                    string += "%" + wfw.math.char_to_hex((c >> 12) | 0xE0);          //1110.XXXXb
                    string += "%" + wfw.math.char_to_hex(((c >> 6) & 0x3F) | 0x80);  //10XX.XXXXb
                    string += "%" + wfw.math.char_to_hex((c & 0x3F) | 0x80);         //10XX.XXXXb
                }
                // 4 bytes
                if (c >= 0xFFFF) {
                    string += "%" + wfw.math.char_to_hex((c >> 18) | 0xF0);          //1111.0XXXb
                    string += "%" + wfw.math.char_to_hex((c >> 12) | 0xE0);          //10XX.XXXXb
                    string += "%" + wfw.math.char_to_hex(((c >> 6) & 0x3F) | 0x80);  //10XX.XXXXb
                    string += "%" + wfw.math.char_to_hex((c & 0x3F) | 0x80);         //10XX.XXXXb
                }
            }
            else { //+ bytes
                wfw.puts("wfw.uri.encodeUTF8: unsuported up to 4 bytes caracters encoding");
                //ignore...
            }
            i++;
        }

        return string;
    },
    /*
    Décode les caractères d'une URI (UTF-8)

    Parametres:
    [string] text : La chaine à décoder
    Retourne:
    [string] La chaine décodé.
    Remarque:
    Les caractères ASCII sont encodés avec un '%' suivit du nombre hexadécimal sur un octet. ex: "%E9"
    Les caractères UTF-8 sont encodés avec un à quatre '%' suivit du nombre hexadécimal sur un octet. ex: "%D0%89"

    UTF8 bits encoding :
    0 [CCCCxxxx|TTxxxxxx|TTxxxxxx|TTxxxxxx] 32bits
    C  = Forment une suite de 1 d'une longueur égale au nombre d'octets utilisés pour coder le caractère (1000,1100,1110 ou 1111)
    TT = Les deux premiers bits de poids fort identifie les octets suivants (Egale à 10b )
    x  = Constitue les bits de la valeur final une fois contracté
    */
    decodeUTF8: function (text) {
        var string = "";
        var i = 0;
        var c;

        while (i < text.length) {

            c = text.charCodeAt(i);

            switch (c) {
                case 0x25: //%
                    var byte1 = wfw.math.hex2_to_int(text.substr(i + 1, 2));
                    // UNICODE codé sur 1 byte
                    if (byte1 <= 0x7F) {
//                        wfw.puts("codé sur 1 octets");
                        c = String.fromCharCode(byte1);
                        string += c;
                        i += 2;
                    }
                    // UNICODE codé sur 2 octets (11000000b+)
                    else if (byte1 > 0x7F && byte1 < 0xE0) {
//                        wfw.puts("codé sur 2 octets");
                        var byte2 = wfw.math.hex2_to_int(text.substr(i + 4, 2));
                        if (byte2 >= 0x80)//10b de poid fort?
                        {
                            c = ((byte1 & 0x1F) << 6) | (byte2 & 0x3F); //5bits et 6bits
                            string += String.fromCharCode(c);
                            i += 5;
                        }
                    }
                    // UNICODE codé sur 3 octets (11100000b+)
                    else if (byte1 >= 0xE0 && byte1 < 0xF0) {
//                        wfw.puts("codé sur 3 octets");
                        var byte2 = wfw.math.hex2_to_int(text.substr(i + 4, 2));
                        var byte3 = wfw.math.hex2_to_int(text.substr(i + 7, 2));
                        if (byte2 >= 0x80 && byte3 >= 0x80)//10b de poid fort?
                        {
                            c = ((byte1 & 0xF) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F); //5bits, 6bits et 6bits
                            string += String.fromCharCode(c);
                            i += 8;
                        }
                    }
                    // UNICODE codé sur 4 octets (11110000b+)
                    else if (byte1 >= 0xF0) {
//                        wfw.puts("codé sur 4 octets");
                        var byte2 = wfw.math.hex2_to_int(text.substr(i + 4, 2));
                        var byte3 = wfw.math.hex2_to_int(text.substr(i + 7, 2));
                        var byte4 = wfw.math.hex2_to_int(text.substr(i + 10, 2));
                        if (byte2 >= 0x80 && byte3 >= 0x80 && byte4 >= 0x80)//10b de poid fort?
                        {
                            c = ((byte1 & 0x7) << 18) | ((byte2 & 0x3F) << 12) | ((byte3 & 0x3F) << 6) | (byte4 & 0x3F); //5bits, 6bits, 6bits et 6bits
                            string += String.fromCharCode(c);
                            i += 11;
                        }
                    }
                    //pas trouvé?
                    if (c == 0x25) {
                        wfw.puts(byte1 + " pas trouvé");
                        c = "?"; //illegal encoding
                        i += 2;
                    }
                    break;

                default:
                    string += String.fromCharCode(c);
                    break;
            }
            i++; //caractere lu
//            wfw.puts(text.substring(0,i));
        }
//        wfw.puts(string);

        return string;
    }
};

/*
-----------------------------------------------------------------------------------------------
    Error
-----------------------------------------------------------------------------------------------
*/
wfw.xarg = {
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
                wfw.puts("x_request_arguments_parse(), attention: fin anormale de requete!");
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
            text=wfw.uri.encodeUTF8(text);

        return text;
    },
	/*
		Obtient le parametre XARG d'une URI
		Parametres:
			[string] uri     : URI à utiliser. Si null, l'URI en cours est utilisé 
		Retourne:
			[string] Texte au format XARG, en cas d'erreur un numero est retourné
		Remarques:
			Le texte est lu depuis l'argument "_xarg_" de l'URI
	*/
    from_uri : function(uri){
        //si non specifie, utilise l'uri du document en cours
        if(typeof(uri)!='string')
             if(typeof(uri = wndGetURL(window))!='string')
                return -1;
        //en objet...
        var uri_obj = wfw.uri.cut(uri);
        if(uri_obj==null)
            return -2;
        if(empty(uri_obj.query))
            return -3;
        var uri_query = wfw.uri.query_to_object(uri_obj.query,true);
        if(typeof(uri_query['_xarg_'])!="string")
            return -4;
        //convertie la chene _xarg_
        return uri_query['_xarg_'];
    }
};

/*
-----------------------------------------------------------------------------------------------
    Error
-----------------------------------------------------------------------------------------------
*/
wfw.stdEvent = {
    onReqCheckDataType: function (action) {
        if (action.status != 200)
            return;

        var result = x_request_arguments_parse(action.response, false);

        if (result.result == ERR_OK) {
            wfw.style.removeClass(action.user.input, 'wfw_invalidate');
        }
        else {
            wfw.style.addClass(action.user.input, 'wfw_invalidate');
        }

        wfw.request.Remove(action.name);
    },
    
    /*onShowRequestResult_XARG*/
    onFormResult: function (form_name, result, req_obj) {
    
        var title = result.error;
        var msg = result.error_str;

        //options du dialogue
        var options={
            no_msg : false,
            no_result : false,
            show_debug : true
        };
        options = object_merge(options,req_obj.user);

        //affiche le msg
        if ($if("wfw.ext.document")){
            var dlg = $new(wfw.ext.document.DIALOG_BOX, {
                title:title,
                onOK : {
                    buttonText : "Fermer"
                },
                onPrint : function(){
                    this.print(msg);

                    //affiche les informations de deboguage
                    if(options.show_debug){
                        var parse = "";

                        //infos
                        parse = "<fieldset><legend>Informations sur la requête</legend>"+
                                '<div class="wfw_edit_field"><span>URI</span><span>'+req_obj.url+'</span></div>' +
                                "</fieldset>";   
                        var doc = xml_parse(parse);
                        var node = docImportNode(document, doc.documentElement, true);
                        this.print(node);

                        //liste les arguments en sortie
                        parse = "";
                        for (var i in result)
                        {
                            //crée l'élément dialogue
                            parse += '<div class="wfw_edit_field"><span>'+i+'</span><span>'+result[i]+'</span></div>';
                        }
                        if(!empty(parse)){
                            parse = "<fieldset><legend>Arguments en sortie</legend>"+parse+"</fieldset>";   
                            var doc = xml_parse(parse);
                            var node = docImportNode(document, doc.documentElement, true);
                            this.print(node);
                        }

                        //liste les arguments en entrée
                        parse = "";
                        for (var i in req_obj.args)
                        {
                            //crée l'élément dialogue
                            parse += '<div class="wfw_edit_field"><span>'+i+'</span><span>'+req_obj.args[i]+'</span></div>';
                        }
                        if(!empty(parse)){
                            parse = "<fieldset><legend>Arguments en entrée</legend>"+parse+"</fieldset>";   
                            var doc = xml_parse(parse);
                            var node = docImportNode(document, doc.documentElement, true);
                            this.print(node);
                        }

                    }
                    wfw.ext.document.printOK(this,"wfw_ext_dialog_content",options);
                }
            });
            wfw.ext.document.insertDialog(dlg,null,"visible");
        }
        else
            wfw.puts(title+"\n"+msg);
    },
    onFormResultDebug: function (form_name, result, req_obj) {
        var func = wfw.puts;
        var inst = wfw;
        //affiche le message dans une boite de dialogue
        if (typeof (wfw.ext) == "object" && typeof (wfw.ext.document) == "object") {
            func = wfw.ext.document.print;
            inst = wfw.ext.document;
        }
        //liste les arguments
        for (var i in req_obj.args)
            func.call(inst,i+": " + req_obj.args[i]);
        func.call(inst,"-------------------------------");
        //liste les arguments du resultat
        for (var i in result)
            func.call(inst,i+": " + result[i]);
        //affiche l'url
        if (typeof (req_obj) != "undefined")
        {
           func.call(inst,"-------------------------------");
           func.call(inst,"[" + req_obj.url + "]");
        }
        func.call(inst,"-------------------------------");
    }
};

/*
-----------------------------------------------------------------------------------------------
    Utils
-----------------------------------------------------------------------------------------------
*/
wfw.utils = {
    //active/desactive les champs contenu dans un element
    enabledContent: function (element, bEnabled) {
        nodeEnumNodes(
            element,
            function (node,cond,param) {
                if (node.nodeType == XML_ELEMENT_NODE) {
                    switch (node.tagName.toLowerCase()) {
                        case "input":
                        case "textarea":
                        case "select":
                            var disable = (cInputBool.toBool(param.enabled) ? false : true);
                            if(disable)
                                objSetAtt(node,"disabled",disable);
                            else
                                objRemoveAtt(node,"disabled");
                            break;
                    }
                }
                return true;
            },
            false,//ne poursuit pas l'enumeration avec les noeuds suivant
            {
                enabled:bEnabled
            }
        );
    },
    /*
    obselete
    Retourne:
    [string] Nouvelle URI. null est retourné si l'URI ou un des paramétres est invalide
    */
    makeURI: function (domain, fields, anchor) {
        var uri_obj = { scheme: "", authority: "", path: "", query: "", fragment: "" };

        //domain en cours
        if (typeof (domain) != "string") {
            var wnd_uri_obj = wfw.uri.cut(wndGetURL(window));
            if (wnd_uri_obj == null)
                return null;
            domain = wnd_uri_obj.authority;
        }

        if (typeof (add_fields) == "object")
            uri_obj.query = wfw.uri.object_to_query(add_fields, true);
        else if (typeof (add_fields) == "string")
            uri_obj.query = add_fields;
        else {
            wfw.puts("wfw.utils.remakeURI(): invalid argument type 'add_fields' = (" + typeof (add_fields) + ")");
            return null;
        }

        //ancre
        if (typeof (anchor) == "string")
            uri_obj.fragment = anchor;

        //reforme l'URI
        return wfw.uri.paste(uri_obj);
    },
    /*
    Re-Fabrique une URI
    Parametres:
    [string] uri               : URI à transformer. Si null, l'URI en cours est utilisé 
    [string/object] add_fields : Champs à insérer 
    [string] att               : Si 0x1 les champs présent sont remplacés, sinon, les nouveaux champs sont associés aux champs présent (les nouveaux champs remplacent les anciens)
    [string] anchor            : Optionnel, Ancre à insérer
    Retourne:
    [string] Nouvelle URI. null est retourné si l'URI ou un des paramétres est invalide
    */
    remakeURI: function (uri, add_fields, att, anchor) {
        if (typeof (add_fields) == "number")
            add_fields = add_fields.toString();
        if (typeof (uri) != "string")
            uri = wndGetURL(window);
        //decompose l'uri
        if ((uri_obj = wfw.uri.cut(uri)) == null)
            return null;
        //remplace les champs actuel
        if (att & 0x1) {
            if (typeof (add_fields) == "object")
                uri_obj.query = wfw.uri.object_to_query(add_fields, true);
            else if (typeof (add_fields) == "string")
                uri_obj.query = add_fields;
            else {
                wfw.puts("wfw.utils.remakeURI(): invalid argument type 'add_fields' = (" + typeof (add_fields) + ")");
                return null;
            }
        }
        //ajoute aux champs actuel
        else {
            var fields = new Object();
            if (!empty(uri_obj.query)) {
                fields = wfw.uri.query_to_object(uri_obj.query, true);
            }
            if (typeof (add_fields) == "string") {
                fields = wfw.uri.query_to_object(add_fields, true);
            }
            uri_obj.query = wfw.uri.object_to_query(object_merge(fields, add_fields));
        }
        //ancre
        if (typeof (anchor) == "string")
            uri_obj.fragment = anchor;

        //reforme l'URI
        return wfw.uri.paste(uri_obj);
    },
    /*
    Obtient le nom de domaine de l'URI en cours
    Retourne:
    [string] Nom de domaine, si introuvable
    */
    getDomainName: function () {
        var uri = wfw.uri.cut(wndGetURL(window));
        if (uri == null)
            return null;
        return uri.authority;
    },
    /*
    Obtient l'ancre de l'URI en cours
    Retourne:
    [string] L'Ancre, null si introuvable
    */
    getURIAnchor: function () {
        var uri = wfw.uri.cut(wndGetURL(window));
        if (uri == null)
            return null;
        return uri.fragment;
    },
    /*
    Obtient les champs du query pour l'URI en cours
    Retourne:
    [object] Tableau associatif des champs, null si introuvable
    */
    getURIFields: function () {
        var uri = wfw.uri.cut(wndGetURL(window));
        return ((uri != null && !empty(uri.query)) ? wfw.uri.query_to_object(uri.query, true) : null);
    },
    /*
    Obtient un champs du query pour l'URI en cours
    Parametres:
    [string] name : Nom du champs à retourner 
    Retourne:
    [string] Valeur du champs, null si introuvable
    */
    getURIField: function (name) {
        var fields = this.getURIFields();
        if (fields != null && (typeof (fields[name]) == 'string')) {
            return fields[name];
        }
        return null;
    },
    /*
    Callback : wfw.request.Add
    Vérifie et traite une requête HTTP
    Parametres:
    [object]   obj     : L'Objet requête (retourné par wfw.request.Add)
    User Parametres:
    [function] onerror : Optionnel, fonction appelée en cas d'erreur
    Retourne:
    [bool] true si la requête est terminé, false en cas de traitement ou d'erreur
    Remarques:
    onCheckRequestStatus retourne true si la reponse est prête à être utilisé
    En cas d'echec, l'erreur est traité et affiché par la fonction wfw.utils.onRequestMsg (voir documentation)
    */
    onCheckRequestStatus: function (obj) {
        var bErrorFunc = (obj.user != null && typeof (obj.user["onerror"]) == "function") ? 1 : 0;

        if (obj.status == 404) {
            wfw.utils.onRequestMsg(obj, "Requête indisponible (erreur 404)");
            if (bErrorFunc) obj.user.onerror(obj);
            return false;
        }

        if (obj.status != 200)
            return false;

        return true;
    },
    //traite un message de requete en interne
    onRequestMsg: function (obj, msg, debug) {
        var bMsg = (obj.user != null && typeof (obj.user["no_msg"]) == "undefined") ? 1 : 0;

        if (bMsg && (typeof (wfw.ext) == "object")) {
            wfw.ext.document.messageBox(msg);
        }

        //debug
        wfw.puts("[" + obj.url + "] " + msg);
        if (typeof (debug) == "string")
            wfw.puts(debug);

        return true;
    },
    
    /*
    Callback : wfw.request.Add
    Vérifie et traite une requête XARG
    Parametres:
    [object]   obj     : L'Objet requête (retourné par wfw.request.Add)
    User Parametres:
    [function] onsuccess(obj,args) : Optionnel, callback en cas de succès
    [function] onfailed(obj,args)  : Optionnel, callback en cas de échec
    [function] onerror(obj)        : Optionnel, callback en cas d'erreur de transmition de la requête
    [string]   no_msg              : Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
    [string]   no_result           : Si spécifié, le contenu du fichier est retourné sans traitement des erreurs
    Retourne:
    rien
    Remarques:
    La variable args des callbacks onsuccess et onfailed passes les arguments XARG en objet 
    onCheckRequestResult_XARG reçoit un format XARG en reponse, il convertie en objet puis traite le résultat
    En cas d'erreur, l'erreur est traité et affiché par la fonction wfw.utils.onRequestMsg (voir documentation)
    En cas d'echec, l'erreur est traité et affiché par la fonction wfw.stdEvent.onFormResult (voir documentation)
        [Le nom de la form utilisé pour le résultat est définit par l'argument 'wfw_form_name' (si définit) sinon le nom de l'objet de requête]
    */
    onCheckRequestResult_XARG: function (obj) {
        var bErrorFunc = 0;
        var bSuccessFunc = 0;
        var bFailedFunc = 0;
        var bCheckResult = 1;

        if (obj.user != null) {
            bCheckResult = (typeof (obj.user["no_result"]) != "undefined") ? 0 : 1;
            bErrorFunc = (typeof (obj.user["onerror"]) == "function") ? 1 : 0;
            bSuccessFunc = (typeof (obj.user["onsuccess"]) == "function") ? 1 : 0;
            bFailedFunc = (typeof (obj.user["onfailed"]) == "function") ? 1 : 0;
        }

        if (!wfw.utils.onCheckRequestStatus(obj))
            return;

        //resultat ?
        var args = wfw.xarg.to_object(obj.response, false);
        if (!args) {
            wfw.utils.onRequestMsg(obj, "Erreur de requête", obj.response);
            if (bErrorFunc)
                obj.user.onerror(obj);
            return;
        }

        //non x-argument result !
        if (typeof (args.result) == 'undefined') {
            wfw.utils.onRequestMsg(obj, "Résultat de requête invalide", obj.response);
            if (bErrorFunc)
                obj.user.onerror(obj);
            return;
        }

        //erreur ?
        if (bCheckResult && (parseInt(args.result) != ERR_OK)) {
            //message
            var result_form_id = ((typeof obj.args["wfw_form_name"] == "string") ? obj.args.wfw_form_name : obj.name);
            wfw.stdEvent.onFormResult(result_form_id, args, obj);

            //failed callback
            if (bFailedFunc)
                obj.user.onfailed(obj, args);
            return;
        }

        //success callback
        if (bSuccessFunc)
            obj.user.onsuccess(obj, args);
    },
    /*
    Callback : wfw.request.Add
    Vérifie et traite une requête XML
    Parametres:
    [object]   obj     : L'Objet requête (retourné par wfw.request.Add)
    User Parametres:
    [function] onsuccess(obj,xml_doc) : Optionnel, callback en cas de succès
    [function] onfailed(obj,xml_doc)  : Optionnel, callback en cas de échec
    [function] onerror(obj)           : Optionnel, callback en cas d'erreur de transmition de la requête
    [string]   no_msg                 : Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
    [string]   no_result              : Si spécifié, le contenu du fichier est retourné sans traitement des erreurs
    Retourne:
    rien
    Remarques:
    La variable xml_doc des callbacks onsuccess et onfailed passe le document XML en objet 
    onCheckRequestResult_XML reçoit un format XML en reponse, il convertie en objet puis traite le résultat
    En cas d'erreur, l'erreur est traité et affiché par la fonction wfw.utils.onRequestMsg (voir documentation)
    En cas d'echec, l'erreur est traité et affiché par la fonction wfw.stdEvent.onFormResult (voir documentation)
        [Le nom de la form utilisé pour le résultat est définit par l'argument 'wfw_form_name' (si définit) sinon le nom de l'objet de requête]
    */
    onCheckRequestResult_XML: function (obj) {
        var bErrorFunc = 0;
        var bSuccessFunc = 0;
        var bFailedFunc = 0;
        var bCheckResult = 1;

        if (obj.user != null) {
            bCheckResult = (typeof (obj.user["no_result"]) != "undefined") ? 0 : 1;
            bErrorFunc = (typeof (obj.user["onerror"]) == "function") ? 1 : 0;
            bSuccessFunc = (typeof (obj.user["onsuccess"]) == "function") ? 1 : 0;
            bFailedFunc = (typeof (obj.user["onfailed"]) == "function") ? 1 : 0;
        }

        if (!wfw.utils.onCheckRequestStatus(obj))
            return;

        //convertie le document
        var xml_doc = xml_parse(obj.response);
        if (xml_doc == null) {
            wfw.utils.onRequestMsg(obj, "Document XML mal formé", obj.response);
            if (bErrorFunc)
                obj.user.onerror(obj);
            return;
        }

        //callback
        if (bCheckResult) {
            var result = docGetElement(xml_doc, "result");
            var info = docGetElement(xml_doc, "info");
            if (result != null) {
                var args =
                {
                    result: (objGetInnerText(result)),
                    info: ((info != null) ? objGetInnerText(info) : "")
                };
                if (parseInt(args.result) != ERR_OK) {
                    //message
                    var result_form_id = ((typeof obj.args["wfw_form_name"] == "string") ? obj.args.wfw_form_name : obj.name);
                    wfw.stdEvent.onFormResult(result_form_id, args, obj);

                    //failed callback
                    if (bFailedFunc)
                        obj.user.onfailed(obj, xml_doc);
                }
                return;
            }
        }
        if (bSuccessFunc)
            obj.user.onsuccess(obj, xml_doc);
    },
    /*
    Callback : wfw.request.Add
    Vérifie et traite une requête
    Parametres:
    [object]   obj     : L'Objet requête (retourné par wfw.request.Add)
    User Parametres:
    [function] onsuccess(obj,response): Optionnel, callback en cas de succès
    [function] onerror(obj)           : Optionnel, callback en cas d'erreur de transmition de la requête
    [string]   no_msg                 : Si spécifié, les messages d'erreurs ne sont pas affichés à l'écran
    Retourne:
    rien
    Remarques:
    En cas d'echec, l'erreur est traité et affiché par la fonction wfw.utils.onRequestMsg (voir documentation)
    */
    onCheckRequestResult: function (obj) {
        var bErrorFunc = 0;
        var bSuccessFunc = 0;

        if (obj.user != null) {
            bErrorFunc = (typeof (obj.user["onerror"]) == "function") ? 1 : 0;
            bSuccessFunc = (typeof (obj.user["onsuccess"]) == "function") ? 1 : 0;
        }

        if (!wfw.utils.onCheckRequestStatus(obj))
            return;

        //success callback
        if (bSuccessFunc)
            obj.user.onsuccess(obj, obj.response);
    },
    /*
    Convertie un tableau associatif en document XML
    Parametres:
    [object] fields : Tableau associatif des valeurs
    Retourne:
    [DOMDocument] Document XML, null en cas d'erreur
    Remarques:
    L'Elément root du document est nommé "data"
    */
    fieldsToXML: function (fields) {
        /*fields to xmlDoc (Compatible)*/
        var doc_text = '<?xml version="1.0"?><data>';
        for (var field_name in fields) {
            doc_text += '<' + field_name + '>' + fields[field_name] + '</' + field_name + '>';
        }
        doc_text += '</data>';
        var doc = xml_parse(doc_text);
        if (doc == null)
            wfw.puts("wfw_ListElement->insertFields : can't parse fields");

        /*fields to xmlDoc (I.E bug)
        var doc = xml_parse('<?xml version="1.0"?><data></data>');
        for(field_name in fields){
        var node = doc.createElement(field_name);
        doc.documentElement.appendChild(node);
        objSetInnerText(node,fields[field_name]);
        }*/

        /*fields to xmlDoc (no I.E)
        var doc = document.createDocumentFragment();
        // imite l'element racine d'un document
        doc.documentElement=document.createElement("data");
        doc.appendChild(doc.documentElement);
        for(field_name in fields){
        var node = document.createElement(field_name);
        doc.documentElement.appendChild(node);
        objSetInnerText(node,fields[field_name]);
        }*/

        /*fields to xmlDoc 'w3c' (no I.E)
        var doc = document.implementation.createDocument(null, 'data', null);
        for(field_name in fields){
        var node = doc.createElement(field_name);
        doc.documentElement.appendChild(node);
        objSetInnerText(node,fields[field_name]);
        //alert(node.tagName);
        }*/

        return doc;
    },
    /*
    Formate un texte simple en HTML
        Arguments:
            [string] text: Texte brut
        Retourne:
            [string] texte HTML
    */
    strToHTML: function (text) {
        text = text.replace(/</g, "&lt;");
        text = text.replace(/>/g, "&gt;");
        text = text.replace(/[-]{5,}/g, "<hr />");
        text = text.replace(/(\r\n|\n|\r)/gm, "<br />");
        return text;
    }
};

/*
-----------------------------------------------------------------------------------------------
    Evenements Lists
-----------------------------------------------------------------------------------------------
*/

/*
    eventCheckDataType
        Verifie les formats de donnees en ligne.

    Applicable:
        Elements INPUT
*/
wfw.event.SetCallback(
    "wfw_datatype_check",
    "change",
    "eventCheckDataType",
    function(e){
        var data_type = objGetAtt(this,'wfw_datatype');
        if(data_type==null)
            return;
        //post la requete
        wfw.request.Add(null,wfw.request_path('input_check.php'),{type:data_type,value:this.value},wfw.stdEvent.onReqCheckDataType,{input:this});
    }
);

/*
-----------------------------------------------------------------------------------------------
    Stockages de données
-----------------------------------------------------------------------------------------------
*/

wfw.states = {
    user_data : [],
    /*
        Remarques:
            Les données de la variable 'states' sont copié et un nouveau pointeur persistant est retourné 
    */
    getRefId: function (ref) {
        for(var id in this.user_data){
            if(this.user_data[id] == ref)
                return id;
        }
        return null;
    },
    /*
        Remarques:
            Les données de la variable 'states' sont copié et un nouveau pointeur persistant est retourné 
    */
    exist: function (id) {
        if(typeof this.user_data[id] == element)
            return true;

        return false;
    },
    /*
        Remarques:
            Les données de la variable 'states' sont copié et un nouveau pointeur persistant est retourné 
    */
    existElement: function (element) {
        var id=objGetAtt(element,"id");
        if(typeof this.user_data[id] == element)
            return true;

        return false;
    },
    /*
        Remarques:
            Les données de la variable 'states' sont copié et un nouveau pointeur persistant est retourné 
    */
    fromElement: function (element,states,options) {
        
        //obtient l'attribut
        var id=objGetAtt(element,"id");
        if(empty(id)){
            if(typeof(options.exists)!="undefined" && options.exists==true)
                return null;
            //genere un nouvel
            id=uniqid();
            objSetAtt(element,"id",id);
        }

        return this.fromId(id,states,options);
    },
    /*
        Remarques:
            Les données de la variable 'states' sont copié et un nouveau pointeur persistant est retourné 
    */
    fromId: function (id,states,options) {
        //options
        options=object_merge({
            assign:false,
            erase:false,
            exists:false,
            name:"global"
        },options,false);
        
        //obtient l'attribut
        if(empty(id)){
            return null;
        }
        
        //l'objet existe ?
        if(typeof this.user_data[id] == "undefined")
        {
            if(options.exists){
 //               wfw.puts("l'objet existe pas :"+id+", sub="+options.name);
                return null;
            }
            this.user_data[id] = {};
        }
        
        //le sous objet existe ?
        if(options.exists && typeof this.user_data[id][options.name] == "undefined"){
 //           wfw.puts("le sous objet existe pas :"+id+", sub="+options.name);
            return null;
        }
        //assigne ou copie le pointeur ?
        if(options.assign){
            this.user_data[id][options.name] = states;
        }
        else{
            //supprime le contenu ?
            if(options.erase)
                this.user_data[id][options.name]={};
            //merge l'objet
            this.user_data[id][options.name] = object_merge(this.user_data[id][options.name],states,false);
        }

        return this.user_data[id][options.name];
    },
    //
    remove: function (id) {
        //obtient l'attribut
        if(empty(id)){
            return null;
        }
        //obtient l'attribut
        if(typeof this.user_data[id] == "undefined")
            return;
        delete this.user_data[id];
        eval("delete this.user_data."+id+";");

        //ok
        //wfw.puts("wfw.states.remove('"+id+"')");
    }
}

/*
-----------------------------------------------------------------------------------------------
    Shortcut functions
-----------------------------------------------------------------------------------------------
*/

/*
Obtient un ou plusieur éléments du document actif
   syntax:
    "id,"     = element
    "#name, " = elements nommés (merge)
    "~name, " = elements nommés (array)
    "&name, " = element states (object)
    Remarques:
        si syntax est un objet, syntax est retrourne
*/
$ = function(syntax,doc){
    var out = new Array();
    var obj;
    
    //object
    if(typeof(doc)=="undefined")
        doc=document;

    //object
    if(typeof(syntax)=="object")
        return syntax;

    //document id
    if(typeof(syntax)=="string")
    {
        var elements = strexplode(syntax,",",true);

        for(var i=0;i<elements.length;i++)
        {
            var prefix = elements[i].substr(0,1);

            switch(prefix)
            {
                case "&":
                    obj = wfw.states.fromId(elements[i].substr(1),null,{exists:true})
                    out.push(obj);
                    break;
                case "#":
                    obj = docGetNamedElements(doc,elements[i].substr(1));
                    out = array_merge(out,obj,false);
                    break;
                case "~":
                    obj = docGetNamedElements(doc,elements[i].substr(1));
                    out.push(obj);
                    break;
                default:
                    if((obj = docGetElement(doc,elements[i]))!=null)
                        out.push(obj);
                    break;
            }
        }
    }

    //aucun ?
    if(!out.length)
    {
//        wfw.puts("not found for "+syntax);
        return null;
    }
    
    //si l'objet est unique retourne seulement celui-ci
    if(out.length == 1)
    {
//        wfw.puts("only one for "+syntax);
        return out[0];
    }

//    wfw.puts("array for "+syntax);
    return out;
};

$all = function(array,func){
    var i=0;
    for(key in array){
//        wfw.puts("key="+key+", value="+array[key].toString());
        ret = func(array[key],key,i);
//        wfw.puts(array[key].toString()+"->ret="+typeof(ret));
        if(typeof(ret)!=="undefined")
            return ret;
        i++;
    }
    
    //retourne "undefined", permet les appels imbriqué 
};

$if = function(element)
{
    if(eval("typeof("+element+")")=="undefined")
        return false;
    if(eval(element)==null)
        return false;
    return true;
};
$name = function(element)
{
    if((element=$(element))==null)
        return "";
    var value = objGetAtt(element,"name");
    if(typeof(value)=="string")
        return value;
    return "";
};

/*
    Obtient / Définit l'attribut 'value' d'un élément
    Arguments:
        element : l'element (objet ou identificateur)
        set     : si specifie, la valeur est changer

    Retourne:
        valeur en cours de l'element
*/
$value = function(element,set)
{
    if((element=$(element))==null)
        return "";
       
    //redefinit la valeur en cours
    if(typeof(set)!="undefined")
        objSetAtt(element,"value",set);

    //obtient la valeur en cours
    value = objGetAtt(element,"value");
    if(typeof(value)!="string")
        value = "";
 
    return value;
};

/*
    Arguments:
        element : l'element (objet ou identificateur)
        set     : si specifie, la valeur est changer

    Retourne:
        text en cours de l'element
*/
$text = function(element,set)
{
    if((element=$(element))==null)
        return "";
       
    //redefinit la valeur en cours
    if(typeof(set)!="undefined")
        objSetInnerText(element,set);

    //obtient la valeur en cours
    value = objGetInnerText(element);
    if(typeof(value)!="string")
        value = "";
 
    return value;
};

/*
    Obtient un element (sécurisé)

    Arguments:
        text : chemin vers l'élément. ex: "window.document.body"
        alt  : valeur alternative si l'élément n'existe pas

    Retourne:
        l'élément pointé par 'text'

    Remarques:
        $get, 
*/
$get = function(text,alt)
{
    if(typeof(alt)=="undefined")
        alt=null;
    var tab = strexplode(text,'.');
    var path = "";
    for(i=0; i<tab.length; i++){
        path += tab[i];
        if(eval("typeof("+path+")")=="undefined")
            return alt;
        path += ".";
    }
       
    return eval(text);
};

$for = function(obj,callback)
{
    if(typeof(obj)=="string")
        obj = $(obj);

    var i=0;
    switch(typeof(obj))
    {
        case "object":
            if(obj instanceof Array)
            {
                for(var key in obj)
                {
                    callback(obj[key]);
                    i++;
                }
            }
            else if(obj!=null)
            {
                callback(obj);
                i++;
            }
            break;
        default:
            break;
    }
    return i;
};

/*
    Crée une instance d'objet
    Paramètres:
        [object] object    : Objet model de base
        [object] arguments : Optionel, tableau associatif des arguments à initialiser
        [string] id        : Optionel, identifiant global de la ressource. Si non spécifié l'identificateur est généré
    Remarques:
        Les données sont identifié et stocké globalement dans l'objet "wfw.states".
        Utilisez la fonction wfw.states.getRefId() pour obtenir l'indentifiant la nouvelle ressource.
    Retourne:
        [objet] Instance sur le nouvel objet

$delete = function(inst_or_id){
    //obtient l'instance et l'id
    var inst;
    var id;
    if(typeof inst_or_id == "string"){
        id = inst_or_id;
        inst = wfw.states.fromId(inst_or_id);
    }
    else{
        id = typeof(inst_or_id["_id"]) ? inst_or_id["_id"] : wfw.states.getRefId(inst_or_id);
        inst = inst_or_id;
    }

    //supprime les ressources memoires
    delete inst._object._inst[id];
    wfw.states.remove(id);

    //ok    
    wfw.puts("$delete('"+id+"')");
}*/
/*
var $new_inst_count=0;
$new = function(object,args,id){

    if(typeof(id)!="string" || empty(id)){
        id = (typeof object._name == "string") ? strtoid(object._name+"_"+(++$new_inst_count)) : uniqid();
    }
    
    //stock le pointeur de reference
    var inst = wfw.states.fromId(id,{});
    
    //bases
    if(typeof(object["_base"])!="undefined"){
        var bases=object["_base"];
        for(var x in bases){
            inst = object_merge(inst,$new(bases[x],args),false);
        }
    }
    
    if(typeof(object)=="string")
        object=eval(object);

    //liste les classes de bases
    inst=object_merge(inst,object,false);

    //assigne les arguments
    if(typeof(args)!="undefined"){
        for(var arg_name in object)
        {
            if(typeof(args[arg_name])!="undefined")
                inst[arg_name]=args[arg_name];
            else
                inst[arg_name]=object[arg_name];
        }
    }
    
    //assigne l'id
    inst._id = id;

    //ajoute la classe de base à l'instance
    inst._object = object;

    //ajoute l'instance a la classe de base
    object._inst[id] = inst;

    //constructeur
    if(typeof(object["_construct"])=="function")
        object._construct(inst);
    
    wfw.puts("$new('"+id+"')");


    return inst;
};*/
/*
//var $new_inst_count=0;
$new = function(object,args,id){
    //stock le pointeur de reference
    var inst = {};
    
    //arguments des bases
    var bases = [];
    if(typeof(object["_base"])!="undefined"){
        for(var x in object["_base"]){
            bases.push(eval(object["_base"][x]));
            //merger les bases enfants
        }
    }
    for(var x in bases){
        inst = object_merge(inst,bases[x],false);
        //merger les bases enfants
    }
    
    //arguments de classe
    if(typeof(object)=="string")
        object=eval(object);
    inst = object_merge(inst,object,false);

    //assigne les arguments
    if(typeof(args)!="undefined"){
        for(var arg_name in inst)
        {
            if(typeof(args[arg_name])!="undefined")
                inst[arg_name]=args[arg_name];
        }
    }
    
    //constructeurs des bases
    for(var x in bases){
        if(typeof(bases[x]["_construct"])=="function")
            bases[x]._construct(inst);
    }

    //constructeurs de classe
    if(typeof(object["_construct"])=="function")
        object._construct(inst);
    
    //ajoute la classe de base à l'instance
    //inst._object = object;
    
    //ajoute l'instance a la classe de base
    //object._inst[id] = inst;

    return inst;
};*/

//var $new_inst_count=0;
/*
    Initialise une nouvelle instance d'objet
    Remarques:
        "$new" assume l'initialisation de l'heritage des objets
*/
$new = function(object,args,id){
    //stock le pointeur de reference
    var inst = {};
    
    //liste les classes de bases
    var bases = [];
    var bases_red = {};
    var bases_str = "";
    var cur = object["_base"];
    while(typeof(cur)!="undefined"){
        var base_name = cur;
        var base_obj = eval(cur);
        //fin ?
        if(typeof base_obj == "undefined"){
            cur = undefined;
            continue;
        }
        //redondance ?
        if(typeof bases_red[base_name] != "undefined"){
            cur = undefined;
            continue;
        }
        //ajoute a la liste
        bases_red[base_name]=true;
        bases.push(base_obj);
//        bases_str+=base_name+ " ";
        //enfant suivant
        cur = base_obj["_base"];
    }
    bases.reverse();
//    objAlertMembers(bases);
//    objAlertMembers(bases_red);
//    wfw.puts("$new( bases: "+bases_str+" )");

    //arguments des bases
    for(var x in bases){
        inst = object_merge(inst,bases[x],false);
        //merger les bases enfants
    }
    
    //arguments de classe
    if(typeof(object)=="string")
        object=eval(object);
    inst = object_merge(inst,object,false);

    //assigne les arguments
    if(typeof(args)!="undefined"){
        for(var arg_name in inst)
        {
            if(typeof(args[arg_name])!="undefined")
                inst[arg_name]=args[arg_name];
        }
    }
    
    //constructeurs des bases
    for(var x in bases){
        if(typeof(bases[x]["_construct"])=="function")
            bases[x]._construct(inst);
    }

    //constructeurs de classe
    if(typeof(object["_construct"])=="function")
        object._construct(inst);
    
    //ajoute la classe de base à l'instance
    //inst._object = object;
    
    //ajoute l'instance a la classe de base
    //object._inst[id] = inst;

    return inst;
};

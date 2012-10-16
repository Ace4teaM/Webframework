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
        [02-10-2012] Update, wfw.uri.cut, accepte dans la syntaxe de l'URI un nombre indéfinit de slash '/' après le protocol "xxx://"
*/

/*
-----------------------------------------------------------------------------------------------
    Error Handler
-----------------------------------------------------------------------------------------------


window.onerror = function(desc,page,line,chr){
    wfw.puts_error(desc);
    return true;
}*/

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
        Traitement des exception
        Parametres:
            [object] e : Objet Exception
        Retourne
            [boolean] false
    */
    checkError: function(e){
        var str ="Exception: ("+e.number+")\n"
        str+="\t"+e.name+"\n";
        str+="\t"+e.message+"\n";
        str+="\t"+e.toString();
        wfw.puts_error(str);
        return false;
    },
    //consoleWindow: null,
    /*
    Envoie un texte ou un objet à la console de deboguage
    Arguments:
        [mixed] obj : Contenu à écrire, le contenu est transformé en texte par la fonction "wfw.toString"
    Retourne:
        Le texte envoyé
    */
    puts_error: function (txt) {
        return wfw.puts(
             '============================================================\n'
            +'-------------------!! Error Occurred !!---------------------\n'
            +txt+"\n"
            +'============================================================'
        );
    },
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
            // alert(text);
            //if(this.consoleWindow == null)
            //this.consoleWindow = window.open('about:blank','consoleWindow');
            //if(this.consoleWindow == null)
            //this.consoleWindow.document.write(text+"\n");
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
        try{
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
        }
        catch(e){
            text = "<unredable object> "+e;
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
$doc = function(syntax,doc){
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
    if((element=$doc(element))==null)
        return "";
    var value = objGetAtt(element,"name");
    if(typeof(value)=="string")
        return value;
    return "";
};

/*
    Obtient / Définit l'attribut 'value' d'un élément
    Arguments:
        [HTMLElement] element : l'element (objet ou identificateur)
        [string]      set     : si specifie, cette valeur est assigné à l'objet

    Retourne:
        valeur en cours de l'element
*/
$value = function(element,set)
{
    if((element=$doc(element))==null)
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
    if((element=$doc(element))==null)
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
        obj = $doc(obj);

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

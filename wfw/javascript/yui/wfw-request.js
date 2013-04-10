/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    Gestionnaire de requetes HTTP

    JS  Dependences: base.js
    YUI Dependences: base, node, wfw, wfw-http

    Implementation: [11-10-2012] 
*/


YUI.add('wfw-request', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class Request
     * @memberof wfw
     * @brief Gestionnaire de requêtes HTTP
     * */
    wfw.Request = {
        
        /*
            Données Membres
        */
        exec_list         : new Array(), // tableau des actions
        cur_action        : 0,          // indice de l'action en cours
        async             : true,
        auto_start        : true,
        working           : false,
        loading_box_delay : 0,//temps disponible avant que la boite de chargement s'affiche à l'ecran
       
        READYSTATE_UNSENT           : 0,
        READYSTATE_OPENED           : 1,
        READYSTATE_HEADERS_RECEIVED : 2,
        READYSTATE_LOADING          : 3,
        READYSTATE_DONE             : 4,

        /**
         * @class REQUEST
         * @brief Classe d'une requête HTTP
         * @memberof Request
         * @implements OBJECT
         * 
         * @param name              [string]   Identificateur de la requête
         * @param url               [string]   URL cible de la requête
         * @param args              [object]   Tableau associatif des arguments, contient des champs de types 'string' et/ou 'wfw.HTTP_REQUEST_PART' (voir exemples)
         * @param response_header   [string]   Reçoit les en-têtes de la réponse HTTP
         * @param response          [string]   Reçoit la réponse (texte)
         * @param response_obj      [string]   Reçoit la réponse (objet). null si indisponible
         * @param callback          [function]   Fonction de rappel (voir exemples)
         * @param user              [mixed]   Données utilisateur passé à la fonction de rappel \p callback
         * @param status            [int/string]   Reçoit le statut de la requête ("wait", "exec", ou [HTML Status Code])
         * @param remove_after_exec [bool]   Si true, supprime la requête après l'exécution
         * @param async             [bool]   Si true, la requête est exécuté de façon ASynchrone, sinon synchrone
         * 
         * @see XArg.onCheckRequestResult
         * @see Xml.onCheckRequestResult
         * @see Request.onCheckRequestResult
         * 
         * @page request Utilisation de l'objet Request
         * @tableofcontents
         * hello
         * @section samples Exemples
         * @subsection sample_callback Exemple d'implémentation de la fonction de callback
         * @code{.js}
            // Utilisation du callback
            var callback = function(obj){
               switch(obj.status){
                   case "wait":
                      // requête en attente d'execution 
                       wfw.puts("requête en attente d'execution ");
                       break;
                   case "exec":
                       // requête en cours d'execution 
                       wfw.puts("requête en cours d'execution ");
                   break;
                   case 200:
                       // requête executée
                       wfw.puts(obj.response);
                       break;
                   case 400:
                       alert("Requête indisponible");
                       break;
                   default:
                       //autres status...
                       wfw.puts("autres status ("+obj.status+")");
                       break;
               }
            }
         * @endcode
         * @subsection sample_args Exemple d'intialisation d'arguments
         * @code{.js}
                var args = {
                    // paramètre avec en-tête HTTP
                    param_1 : new wfw.HTTP_REQUEST_PART( {
                        headers: [
                            'Content-Disposition: form-data; name="param_1"',
                            'Content-Type: text/plain'
                        ],
                        data: "value"
                    }),
                    // paramètres simples
                    param_2 : "value",
                    param_n : "value"
                };
        * @endcode
        */
        REQUEST : function(att){
            //OBJECT
            this.ns                = "wfw_request";
            //REQUEST
            this.name              = null;
            this.url               = "";
            this.args              = null;
            this.response_header   = null;
            this.response          = null;
            this.response_obj      = null;
            this.callback          = null;
            this.user              = {};
            this.status            = "wait";
            this.remove_after_exec = true;
            this.async             = true;

            /*
             * Constructeur
             */
            wfw.Request.REQUEST.superclass.constructor.call(this, att);
            
            // genere le nom ?
            if ((typeof (this.name) != 'string') || empty(this.name) || this.name===null)
                this.newName();
            //transforme les arguments
            if(typeof (this.args) == "string")
                this.args = wfw.URI.query_to_object(this.args);
            //transforme les arguments
            if(typeof (this.async) == "undefined")
                this.async = true;

        },

        user: {
            onStart: function () {},
            onFinish: function () {}
        },

        onStart: function () {
            //affiche une boite chargement si les requetes depasses un certain délais d'attente
            if(wfw.Request.loading_box_delay && (typeof wfw.Document != "undefined")){
                setTimeout(function () {
                    var loadingBox = wfw.States.fromId("wfw_ext_document_LoadingBox", null, {
                        exists:true
                    });
                    if (wfw.Request.working && !loadingBox){
                        wfw.Document.openLoadingBox();
                    //wfw.puts("start");
                    }
                    var refreshIntervalId = setInterval(function () {
                        var loadingBox = wfw.States.fromId("wfw_ext_document_LoadingBox", null, {
                            exists:true
                        });
                        if (!wfw.Request.working && loadingBox){
                            wfw.Document.closeLoadingBox();
                        //wfw.puts("end");
                        }
                        if (!wfw.Request.working && !loadingBox){
                            clearInterval(refreshIntervalId);
                        //wfw.puts("stop");
                        }
                    }, 1000);
                }, wfw.Request.loading_box_delay);
            }
            //debute
            this.working = true;
            this.user.onStart();
        },
        onFinish: function () {
            //   var loadingBox = $doc("&wfw_ext_document_LoadingBox");
            //   if(loadingBox) wfw.Document.closeDialog(loadingBox);

            this.working = false;
            this.user.onFinish();
        },

        /**
        * @fn REQUEST Insert(action)
        * @brief Ajoute un objet de requête
        * @memberof Request
        *
        * @param REQUEST action Objet de la requête
        * @return REQUEST L'Objet de la requête passé en argument
        * 
        * @remarks Si la requête existe, elle est remplacé
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

            wfw.puts("wfw.request.Insert: " + action.name + ", " + action.url + " (async:"+ action.async +")");

            //appel du callback callback
            if (action.callback != null){
                action.callback(action);
            }

            //execute la requete ?
            //[Note: si la requete est asynchrone elle doit être immediatement executée pour eviter d'attendre la fin d'une requete synchrone]
            if (this.auto_start && (!this.working || !action.async)){
                this.Start(this.async);
            }

            return action;
        },
        insert : this.Insert,//naming convention

        /**
        * @fn REQUEST Add(name, url, arg, callback, user_data, async)
        * @brief Ajoute une requête
        * @memberof Request
        *
        * Parametres:
        * @param    [string]        name      : Identificateur de requete. Si null, un identifiant unique sera généré
        * @param    [string]        url       : URL de la requête
        * @param    [string/object] arg       : Arguments qui serons passés à la requête (text ou objet)
        * @param    [function]      callback  : Format du callback: void callback(action)
        * @param    [object]        user_data : Données passé en argument à la fonction 'callback'
        * @param    [bool]          async     : synchrone/asynchrone
        * Retourne:
        * @return    [REQUEST] L'Objet de la requête
        * Remarques:
        *     L'ensemble des arguments construit un objet 'REQUEST', reportez-vous à la documentation pour en savoir d'avantage.
        *     Si la requête existe, elle est remplacé.
        * Callback prédéfinit:
        * 	wfw.utils.onCheckRequestResult_XARG
        * 	wfw.utils.onCheckRequestResult_XML
        * 	wfw.utils.onCheckRequestResult
        **/
        Add: function (name, url, arg, callback, user_data, async) {


            // fabrique l'objet
            var action = new wfw.Request.REQUEST( {
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
        },
        add : this.Add,//naming convention

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
        remove : this.Remove,//naming convention

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
            [array] Liste des requêtes, tableau indéxé d'objet 'REQUEST'
        Remarques:
            Attention, List retourne la référence interne à l'objet liste
        */
        List: function () {
            return this.exec_list;
        },

        /*
        Retourne la requête en cours d'exécution

        Retourne:
            [REQUEST] L'Objet de la requête
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
            [REQUEST] L'Objet de la requête
        */
        Get: function (count) {
            return this.exec_list[count];
        },

        /*
        Obtient une requête par son nom

        Arguments:
        [string] name : Identificateur de la requête
        Retourne:
            [REQUEST] L'Objet de la requête. null si introuvable
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
            //if(this.loading_box_delay){
            //    wfw.puts("Start openLoadingBox");
            //}
            //wfw.puts("Start");
            this.async = async;
            this.onStart();
            return this.ExecuteNext();
        },

        /*
        Exécute la prochaine requête

        Retourne:
            [bool] true en cas de succès, false si aucune autre requête est en attente
        Remarques:
            En appelant, onResult() la fonction exécute automatiquement la prochaine requête en attente
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
            
            //convertie les argument en part de requete (HTTP_REQUEST_PART)  
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
                            if(user_arg instanceof wfw.HTTP.HTTP_REQUEST_PART)
                                multipart_args.push(user_arg);
                            else
                                wfw.puts("wfw.Request.ExecuteNext: Warning, non HTTP_REQUEST_PART object found");
                            break;
                    }
                }
            }
            
            //asynchrone
            if (action["async"] == true) {
                if (action["args"] == null)
                    wfw.HTTP.get_async(action["url"], this.onResult);
                else
                    wfw.HTTP.post_multipart_async(action["url"], multipart_args, "form-data", this.onResult);
            }
            //synchrone
            else {
                if (action["args"] == null)
                    wfw.HTTP.get(action["url"]);
                else
                    wfw.HTTP.post_multipart(action["url"], multipart_args, "form-data");

                wfw.Request.onResult(null);
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
            var action = wfw.Request.CurrentAction();
            if (action == null) {
                wfw.puts("wfw.request.onResult: This request has already been deleted from the list. ID:" + wfw.Request.cur_action);
                return;
            }

            //met a jour le status
            action["status"] = wfw.HTTP.httpRequest.readyState; //met a jour l'etat

            switch (wfw.HTTP.httpRequest.readyState) {
                case wfw.Request.READYSTATE_UNSENT:
                    //wfw.puts(action.name+' READYSTATE_UNSENT '+wfw.HTTP.httpRequest.readyState);
                    break;

                case wfw.Request.READYSTATE_OPENED:
                    //wfw.puts(action.name+' READYSTATE_OPENED '+wfw.HTTP.httpRequest.readyState);
                    break;

                case wfw.Request.READYSTATE_HEADERS_RECEIVED:
                    //wfw.puts(action.name+' READYSTATE_HEADERS_RECEIVED '+wfw.HTTP.httpRequest.readyState);
                    break;

                case wfw.Request.READYSTATE_LOADING:
                    //wfw.puts(action.name+' READYSTATE_LOADING '+wfw.HTTP.httpRequest.readyState);
                    break;

                case wfw.Request.READYSTATE_DONE:
                    {
                        //wfw.puts(action.name+' READYSTATE_DONE '+wfw.HTTP.httpRequest.readyState);
                        action["status"] = wfw.HTTP.httpRequest.status; //met a jour l'etat
                        action["response_header"] = wfw.HTTP.httpRequest.getAllResponseHeaders();
                        action["response"] = wfw.HTTP.getResponse();
                        action["response_obj"] = null;

                        //cree l'objet associe si possible
                        /* switch(wfw.HTTP.httpRequest.getResponseHeader('Content-Type')){
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
                            wfw.Request.Remove(action.name);
                        else
                            wfw.puts("wfw.request.onResult: can't remove request object");

                        //passe a l'action suivante (non-bloquante)
                        //window.setTimeout("wfw.request.ExecuteNext();",0);
                        wfw.Request.ExecuteNext();
                    }
                    break;
                default:
                    wfw.puts("wfw.request.onResult: '"+action.name+"' unknown state: "+wfw.HTTP.httpRequest.readyState);
                    break;
            }
        },


        /*
        Vérifie et traite une requête HTTP
        Parametres:
            [object]   obj     : L'Objet requête (retourné par wfw.request.Add)
        User Parametres:
            [function] onerror : Optionnel, fonction appelée en cas d'erreur
        Retourne:
            [bool] true si la requête est terminé, false en cas de traitement ou d'erreur
        Remarques:
            onCheckRequestStatus retourne true si la reponse est prête à être utilisé
            En cas d'echec, l'erreur est traité et affiché par la fonction wfw.Document.showRequestMsg (voir documentation)
        */
        onCheckRequestStatus: function (obj) {
            var param = object_merge({
               oncontent : function(obj,content){}, // Optionnel, callback appelé une fois le contenu recupere
               onerror   : function(obj){}          // Optionnel, callback en cas d'erreur de transmition de la requête
            },obj.user);
            
            if (obj.status == 404) {
                wfw.Document.showRequestMsg(obj, "Requête indisponible (erreur 404)");
                param.onerror(obj);
                return false;
            }

            if (obj.status != 200)
                return false;

            param.oncontent(obj,obj.response);
            
            return true;
        }
    };
    
    
    /*-----------------------------------------------------------------------------------------------------------------------
     * REQUEST Class Implementation
     *-----------------------------------------------------------------------------------------------------------------------*/
    
    Y.extend(wfw.Request.REQUEST,wfw.OBJECT);

    /*
    * Génére un nom unique dans le membre 'name'
    * Retourne:
    *  [void]
    * */
    wfw.Request.REQUEST.prototype.newName = function(){
        this.name = "_" + getTimeMS();
        while ("_" + getTimeMS() == this.name); ; //retarde le temps d'execution pour garantir que le nom soit unique
    };

}, '1.0', {
    requires:['base','node','wfw','wfw-http']
});

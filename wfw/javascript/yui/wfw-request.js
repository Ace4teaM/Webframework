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
    YUI Dependences: base, node, wfw, http

    Revisions:
        [11-10-2012] Implementation
*/

YUI.add('request', function (Y) {
    Y.Request = {
        
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
            Classe Requête
        
            Implémente:
                WFW.OBJECT
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
                    param_1 : $new( Y.WFW.HTTP_REQUEST_PART, {
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
        REQUEST : function(att){
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
            Y.Request.REQUEST.superclass.constructor.call(this, att);
            
            // genere le nom ?
            if ((typeof (this.name) != 'string') || empty(this.name) || this.name===null)
                this.newName();
            //transforme les arguments
            if(typeof (this.args) == "string")
                this.args = Y.URI.query_to_object(this.args);
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
            if(Y.Request.loading_box_delay && (typeof Y.Document != "undefined")){
                setTimeout(function () {
                    var loadingBox = Y.States.fromId("wfw_ext_document_LoadingBox", null, {exists:true});
                    if (Y.Request.working && !loadingBox){
                        Y.Document.openLoadingBox();
                        //Y.WFW.puts("start");
                    }
                    var refreshIntervalId = setInterval(function () {
                        var loadingBox = Y.States.fromId("wfw_ext_document_LoadingBox", null, {exists:true});
                        if (!Y.Request.working && loadingBox){
                            Y.Document.closeLoadingBox();
                            //Y.WFW.puts("end");
                        }
                        if (!Y.Request.working && !loadingBox){
                            clearInterval(refreshIntervalId);
                            //Y.WFW.puts("stop");
                        }
                    }, 1000);
                }, Y.Request.loading_box_delay);
            }
            //debute
            this.working = true;
            this.user.onStart();
        },
        onFinish: function () {
            //   var loadingBox = $doc("&wfw_ext_document_LoadingBox");
            //   if(loadingBox) Y.Document.closeDialog(loadingBox);

            this.working = false;
            this.user.onFinish();
        },

        /**
        Ajoute un objet de requête

        Paramètres:
            [REQUEST] action : Objet de la requête
        Retourne:
            [REQUEST] L'Objet de la requête
        Remarques:
            Si la requête existe, elle est remplacé.
        */
        Insert: function (action) {
            // la requete existe ?
            var i_old_action = this.GetIndice(action.name);
            if (i_old_action < 0) {
                // Y.WFW.puts("add action: "+name);
                this.exec_list.push(action);
            }
            else {
                // Y.WFW.puts('replace action('+i_old_action+'): '+name);
                this.exec_list[i_old_action] = action;
            }

            Y.WFW.puts("wfw.request.Insert: " + action.name + ", " + action.url);

            //appel du callback callback
            if (action.callback != null)
                action.callback(action);

            //execute la requete ?
            if (this.auto_start && !this.working){
                this.Start(this.async);
            }

            return action;
        },
        insert : this.Insert,//naming convention

        /**
        * Ajoute une requête
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
            var action = $new( this.REQUEST, {
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
                        Y.WFW.puts("Remove Request: warning! request " + name + " is currently executed");
                    Y.WFW.puts("Remove Request: " + name + ", " + this.exec_list[i].url);
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
                Y.WFW.puts(i+":"+this.exec_list[i].name+" ["+this.exec_list[i].status+"]");
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
                //Y.WFW.puts('FindNextExecution: find['+i+'/'+this.exec_list.length+']'+this.Get(i).status+"; "+this.Get(i).url);
                if (this.Get(i).status == 'wait') {
                    return i;
                }
            }
            //Y.WFW.puts('FindNextExecution: no find');
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
            //    Y.WFW.puts("Start openLoadingBox");
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
            En appelant, onResult() la fonction exécute automatiquement la prochaine requête en attente
        */
        ExecuteNext: function () {
            // recherche la prochaine action à executer
            this.cur_action = this.FindNextExecution(0);
            //Y.WFW.puts("ExecuteNext: "+this.cur_action);
            if (this.cur_action < 0) {//si aucune, termine ici
                this.onFinish();
                return false;
            }

            var action = this.CurrentAction();
    //        Y.WFW.puts("Execute Request: " + action.name + ", " + action.url);
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
                    Y.HTTP.get_async(action["url"], this.onResult);
                else
                    Y.HTTP.post_multipart_async(action["url"], multipart_args, "form-data", this.onResult);
            }
            //synchrone
            else {
                if (action["args"] == null)
                    Y.HTTP.get(action["url"]);
                else
                    Y.HTTP.post_multipart(action["url"], multipart_args, "form-data");

                Y.Request.onResult(null);
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
            var action = Y.Request.CurrentAction();
            if (action == null) {
                Y.WFW.puts("wfw.request.onResult: This request has already been deleted from the list. ID:" + Y.Request.cur_action);
                return;
            }

            //met a jour le status
            action["status"] = Y.HTTP.httpRequest.readyState; //met a jour l'etat

            switch (Y.HTTP.httpRequest.readyState) {
                case Y.Request.READYSTATE_UNSENT:
                    //Y.WFW.puts(action.name+' READYSTATE_UNSENT '+Y.HTTP.httpRequest.readyState);
                    break;

                case Y.Request.READYSTATE_OPENED:
                    //Y.WFW.puts(action.name+' READYSTATE_OPENED '+Y.HTTP.httpRequest.readyState);
                    break;

                case Y.Request.READYSTATE_HEADERS_RECEIVED:
                    //Y.WFW.puts(action.name+' READYSTATE_HEADERS_RECEIVED '+Y.HTTP.httpRequest.readyState);
                    break;

                case Y.Request.READYSTATE_LOADING:
                    //Y.WFW.puts(action.name+' READYSTATE_LOADING '+Y.HTTP.httpRequest.readyState);
                    break;

                case Y.Request.READYSTATE_DONE:
                    {
                        //Y.WFW.puts(action.name+' READYSTATE_DONE '+Y.HTTP.httpRequest.readyState);
                        action["status"] = Y.HTTP.httpRequest.status; //met a jour l'etat
                        action["response_header"] = Y.HTTP.httpRequest.getAllResponseHeaders();
                        action["response"] = Y.HTTP.getResponse();
                        action["response_obj"] = null;

                        //cree l'objet associe si possible
                        /* switch(Y.HTTP.httpRequest.getResponseHeader('Content-Type')){
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
                            Y.Request.Remove(action.name);
                        else
                            Y.WFW.puts("wfw.request.onResult: can't remove request object");

                        //passe a l'action suivante (non-bloquante)
                        //window.setTimeout("wfw.request.ExecuteNext();",0);
                        Y.Request.ExecuteNext();
                    }
                    break;
                default:
                    Y.WFW.puts("wfw.request.onResult: '"+action.name+"' unknown state: "+Y.HTTP.httpRequest.readyState);
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
            En cas d'echec, l'erreur est traité et affiché par la fonction Y.Document.showRequestMsg (voir documentation)
        */
        onCheckRequestStatus: function (obj) {
            var bErrorFunc = (obj.user != null && typeof (obj.user["onerror"]) == "function") ? 1 : 0;

            if (obj.status == 404) {
                Y.Document.showRequestMsg(obj, "Requête indisponible (erreur 404)");
                if (bErrorFunc)
                    obj.user.onerror(obj);
                return false;
            }

            if (obj.status != 200)
                return false;

            return true;
        }
    };
    
    
    /*-----------------------------------------------------------------------------------------------------------------------
     * REQUEST Class Implementation
     *-----------------------------------------------------------------------------------------------------------------------*/
    
    Y.extend(Y.Request.REQUEST,Y.WFW.OBJECT);

    /*
    * Génére un nom unique dans le membre 'name'
    * Retourne:
    *  [void]
    * */
    this.newName = function(){
        this.name = "_" + getTimeMS();
        while ("_" + getTimeMS() == this.name); ; //retarde le temps d'execution pour garantir que le nom soit unique
    };

}, '1.0', {
      requires:['base','node','wfw','http']
});

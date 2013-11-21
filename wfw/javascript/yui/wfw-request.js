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

/**
 * @file
 * Fonctions utiles aux addresses Internet (URI)
 *
 * @defgroup YUI
 * @{
 */

/**
 * @defgroup Request
 * @brief Gestionnaire de requêtes HTTP

 * @section samples Exemples
 * @subsection sample_callback Utilisation de la fonction de callback
   @par
   L'attribut Callback permet d'obtenir la réponse et d'intercepter les étapes de la requête.
   @code{.js}
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
    };

    wfw.Request.Add(name, url, arg, callback, user_data, async);
  @endcode

  @subsection sample_args Utilisation d'arguments avec en-tête HTTP
  @par
  Il est possible de passer des en-têtes HTTP directement avec les arguments
  @code{.js}
    var args = {
        // paramètre avec en-têtes HTTP
        param_1 : new wfw.HTTP_REQUEST_PART( {
            headers: [
                'Content-Disposition: form-data; name="param_1"',
                'Content-Type: text/plain'
            ],
            data: "value"
        }),
        // paramètres sans en-têtes HTTP
        param_2 : "value",
        param_n : "value"
    };
    
    wfw.Request.Add(name, url, args, callback, user_data, async);
  @endcode
 * @{
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
         * @brief Objet de requête
         * @memberof Request
         * @implements OBJECT
         * 
         * @param name              [string]     Identificateur de la requête
         * @param url               [string]     URL cible de la requête
         * @param args              [object]     Tableau associatif des arguments, contient des champs de types 'string' et/ou 'wfw.HTTP_REQUEST_PART' (voir exemples)
         * @param response_header   [string]     Reçoit les en-têtes de la réponse HTTP
         * @param response          [string]     Reçoit la réponse (texte)
         * @param response_obj      [string]     Reçoit la réponse (objet). null si indisponible
         * @param callback          [function]   Fonction de rappel (voir exemples)
         * @param user              [mixed]      Données utilisateur passé à la fonction de rappel \p callback
         * @param status            [int/string] Reçoit le statut de la requête ("wait", "exec", ou [HTML Status Code])
         * @param remove_after_exec [bool]       Si true, supprime la requête après l'exécution
         * @param async             [bool]       Si true, la requête est exécuté de façon ASynchrone, sinon synchrone
         * 
         * @see XArg.onCheckRequestResult
         * @see Xml.onCheckRequestResult
         * @see Request.onCheckRequestResult
         * 
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
        * @param action REQUEST Objet de la requête
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
            if (this.auto_start && (!this.working/* || !action.async*/)){
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
        * @param    name      [string]        Identificateur de requete. Si null, un identifiant unique sera généré
        * @param    url       [string]        URL de la requête
        * @param    arg       [string/object] Arguments qui serons passés à la requête (text ou objet)
        * @param    callback  [function]      Format du callback: void callback(action)
        * @param    user_data [object]        Données passé en argument à la fonction 'callback'
        * @param    async     [bool]          synchrone/asynchrone
        * @return   [REQUEST] L'Objet de la requête
        * @remarks L'ensemble des arguments construit un objet 'REQUEST', reportez-vous à la documentation pour en savoir d'avantage.
        * @remarks Si la requête existe, elle sera remplacée.
        * @par Callback prédéfinit
        * 	- wfw.Utils.onCheckRequestResult_XARG
        * 	- wfw.Utils.onCheckRequestResult_XML
        * 	- wfw.Utils.onCheckRequestResult
        */
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

        /**
            @fn bool Remove(name)
            @memberof Request
            @brief Supprime une requête
            @param name [string] Identificateur de requête
            @return [bool] true si la requête est supprimé, false si la requête n'existe pas
        */
        Remove: function (name) {
            for (var i = 0; i < this.exec_list.length; i++) {
                var req = this.exec_list[i];
                if (req.name == name) {
                    if (req.status == "wait")
                        wfw.puts("Remove Request: warning! request " + name + " is currently executed");
//                    wfw.puts("Remove Request: " + name + ", " + this.exec_list[i].url);
                    this.exec_list.splice(i, 1);
                    return true;
                }
            }
            return false;
        },
        remove : this.Remove,//naming convention

        /**
            @fn int Count()
            @memberof Request
            @brief Retourne le nombre de requêtes en liste
            @return [int] Nombre de requêtes trouvé (peut importe le statut)
        */
        Count: function () {
            return this.exec_list.length;
        },

        /**
            @fn array List()
            @memberof Request
            @brief Retourne la liste des requêtes
            @return [array] Liste des requêtes, tableau indéxé d'objet 'REQUEST'
            @remarks Cette fonction retourne l'instance de la liste (à manipuler avec précaution)
        */
        List: function () {
            return this.exec_list;
        },

        /**
            @fn REQUEST CurrentAction()
            @memberof Request
            @brief Retourne la requête en cours d'exécution
            @return [REQUEST] L'Objet de la requête
        */
        CurrentAction: function () {
            if (typeof (this.exec_list[this.cur_action]) == 'undefined')
                return null;
            return this.exec_list[this.cur_action];
        },

        /**
            @fn REQUEST Get(count)
            @memberof Request
            @brief Obtient une requête par son indice
            @param count [int] Indice de la requête
            @return [REQUEST] L'Objet de la requête
        */
        Get: function (count) {
            return this.exec_list[count];
        },

        /**
            @fn REQUEST GetByName(name)
            @memberof Request
            @brief Obtient une requête par son nom
            @parama name [string] Identificateur de la requête
            @return [REQUEST] L'Objet de la requête. null si introuvable
        */
        GetByName: function (name) {
            var i = this.GetIndice();
            if(i<0)
                return null;
            return this.Get(i);
        },

        /**
            @fn int GetIndice(name)
            @memberof Request
            @brief Retourne l'indice de la requête spécifié
            @param name [string] Identificateur de la requête
            @return [int] Indice de la requête. -1 si introuvable
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

        /**
            @fn bool Exists(name)
            @memberof Request
            @brief Verifie l'existance d'une requête
            @param [string] name : Identificateur de la requête
            @return [bool] true si la requête existe, false si elle n'existe pas.
        */
        Exists: function (name) {
            return (this.GetIndice(name) < 0) ? false : true;
        },

        /**
            @fn int CurrentCount()
            @memberof Request
            @brief Retourne l'indice de la requête en cours d'exécution
            @return [int] Indice. si négatif, aucune requêtes n'est en cours d'exécution
        */
        CurrentCount: function () {
            return this.cur_action;
        },

        /**
            @fn int FindNextExecution(start)
            @memberof Request
            @brief Retourne l'indice de la prochaine requête en attente d'exécution
            @param start [int] Indice de départ du scan. Si négatif, la fonction retourne -1
            @return [int] Indice. si -1, aucune requête n'est en attente
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

        /**
            @fn bool Start(async)
            @memberof Request
            @brief Débute l'exécution des requêtes en attentes
            @param async [bool] Synchrone / Asynchrone
            @return [bool] valeur de retour de la méthode ExecuteNext()
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

        /**
            @fn bool ExecuteNext()
            @memberof Request
            @brief Exécute la prochaine requête
            @return [bool] true en cas de succès, false si aucune autre requête est en attente
            @remarks En appelant, onResult() la fonction exécute automatiquement la prochaine requête en attente
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
                    wfw.HTTP.get_async(action["url"], this.onResult, action);
                else
                    wfw.HTTP.post_multipart_async(action["url"], multipart_args, "form-data", this.onResult, action);
            }
            //synchrone
            else {
                if (action["args"] == null)
                    wfw.HTTP.get(action["url"]);
                else
                    wfw.HTTP.post_multipart(action["url"], multipart_args, "form-data");

                wfw.Request.onResult.call(wfw.HTTP.httpRequest,null,action);
            }

            // Execute la prochaine requete
            // Si la derniére requête est asynchrone alors, il ne faut pas attendre car si la prochaine est synchrone elle sera mise en attente (ce qui ne doit pas etre le cas)
            // Si la derniére requête est synchrone alors, inutile d'attendre car elle est deja execute (bloquante)
            return wfw.Request.ExecuteNext();
        },

        /**
            @fn bool Clear()
            @memberof Request
            @brief Efface la liste des requêtes
            @return [bool] true.
        */
        Clear: function () {
            this.exec_list = new Array();
            this.cur_action = 0;
            return true;
        },

        /**
            @fn bool Reset()
            @memberof Request
            @brief Positionne l'ensemble des statuts de requêtes en attente
            @return [bool] true.
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
            Le contexte de la fonction est un objet XMLHttpRequest
        */
        onResult: function (e,action)
        {
            //met a jour le status
            action["status"] = this.readyState; //met a jour l'etat

            switch (this.readyState) {
                /*
                case wfw.Request.READYSTATE_UNSENT:
                    wfw.puts(action.name+' READYSTATE_UNSENT '+wfw.HTTP.httpRequest.readyState);
                    break;

                case wfw.Request.READYSTATE_OPENED:
                    wfw.puts(action.name+' READYSTATE_OPENED '+wfw.HTTP.httpRequest.readyState);
                    if(action.async)
                        wfw.Request.ExecuteNext();
                    break;

                case wfw.Request.READYSTATE_HEADERS_RECEIVED:
                    wfw.puts(action.name+' READYSTATE_HEADERS_RECEIVED '+wfw.HTTP.httpRequest.readyState);
                    break;

                case wfw.Request.READYSTATE_LOADING:
                    wfw.puts(action.name+' READYSTATE_LOADING '+wfw.HTTP.httpRequest.readyState);
                    break;*/

                case wfw.Request.READYSTATE_DONE:
                    {
                        wfw.puts("wfw.request.onResult: Done > "+action.name);
                        //wfw.puts(action.name+' READYSTATE_DONE '+wfw.HTTP.httpRequest.readyState);
                        action["status"] = this.status; //met a jour l'etat
                        action["response_header"] = this.getAllResponseHeaders();
                        action["response"] = wfw.HTTP.getReqResponse(this);
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
                        //if(!action.async)
                        //    return wfw.Request.ExecuteNext();
                    }
                    break;
                /*default:
                    wfw.puts("wfw.request.onResult: '"+action.name+"' state: "+this.readyState);
                    break;*/
            }
        },


        /**
            @fn bool onCheckRequestStatus(obj)
            @memberof Request
            @brief Vérifie et traite une requête HTTP
            @param obj     [REQUEST] L'Objet requête (retourné par wfw.Request.Add)
            @return [bool] true si la requête est terminé, false en cas de traitement ou d'erreur
            @remarks onCheckRequestStatus retourne true si la reponse est prête à être utilisé
            @remarks En cas d'echec, l'erreur est traité et affiché par la fonction wfw.Document.showRequestMsg (voir documentation)
            @par Options
                Options utilisables dans le paramètre 'REQUEST obj.user'
                - [function] oncontent(obj,content) : Optionnel, appelée appelée une fois le contenu récupéré
                - [function] onerror(obj) : Optionnel, fonction appelée en cas d'erreur
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
    * @fn void newName()
    * @memberof REQUEST
    * @brief Génére un nom unique dans le membre 'name'
    * */
    wfw.Request.REQUEST.prototype.newName = function(){
        this.name = "_" + getTimeMS();
        while ("_" + getTimeMS() == this.name); ; //retarde le temps d'execution pour garantir que le nom soit unique
    };

}, '1.0', {
    requires:['base','node','wfw','wfw-http']
});

/** @} */ // end of group Request
/** @} */ // end of group YUI
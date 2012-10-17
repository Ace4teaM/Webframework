/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        Author: AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    Gestionnaire d'evenement

    JS  Dependences: base.js
    YUI Dependences: base, node

    Revisions:
        [11-10-2012] Implementation

    Previsions:
        Associer les données de l'objet à l'extension State
        Trouver une solution pour remplacerla fonction objSetEvent() par obj.on(...) avec passage de parametre
*/

YUI.add('event', function (Y, NAME) {
	Y.Event = {
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
            [YUI.Node]   obj       : L'Elément précédement initialisé avec ApplyTo()
            [string]     list_name : Identifiant de la liste à modifier ou à créer
        Remarques:
            RemoveTo supprime la variable de référence associé à l'objet '_wfw_events'
        Retourne:
            [bool] true en cas de succès, false en cas d'échec
        */
        RemoveTo: function (obj, list_name) {
            obj = obj.getDOMNode();
            if (typeof (obj._wfw_events) == "undefined")
                return false;
            delete obj._wfw_events;
            return true;
        },
        
        /*
        Attache une liste d'événements à un élément

        Arguments:
            [YUI.Node]   obj       : L'Elément à initialiser
            [string]     list_name : Identifiant de la liste à modifier ou à créer
        Remarques:
            ApplyTo ajoute une variable de référence associé à l'objet '_wfw_events'
            Un élément ne peut être attaché qu'à une seule liste à la fois
        Retourne:
            [bool] true en cas de succès, false en cas d'échec
        */
        ApplyTo: function (obj, list_name) {
            obj = obj.getDOMNode();
            if (typeof (this.list[list_name]) == "undefined")
                return false;

            //assigne chacun des evenements a l'objet
            for (var eventType in this.list[list_name])
                objSetEvent(obj, eventType, this.onEventCall, this.list[list_name]);

            //assigne tout les types d'evenements à la liste (pas dispo avec tout les navigateurs!)
            /*   //var text="";
            for(att in obj){
            //   text+=att+", ";
            if(att.substr(0,2) == 'on') // event?
            {
            // text+=(att.substr(2,att.length-2)+"\n");
            objSetEvent(obj,att.substr(2,att.length-2),this.onEventCall);
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
                        Y.WFW.puts("wfw.event.onEventCall : removing callback " + e.type + "->" + name);
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
                        Y.WFW.puts("wfw.event.onEventCall : removing callback " + e.type + "->" + name);
                        delete list[name];
                    }
                }
            }
        }

	}
}, '1.0', {
      requires:['base']
});

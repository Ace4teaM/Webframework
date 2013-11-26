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
 * Fonctions utiles au modèle de données
 *
 * @defgroup YUI
 * @{
 */

/**
 * @defgroup WFW-Event
 * @brief Fonctions utile aux événements
 *
 * @section depend Dépendences
 * @par
 *   - JS  Dependences: base.js
 *   - YUI Dependences: base
 *
 *  @{
 */
YUI.add('wfw-event', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class Event
     * @memberof wfw
     * @brief Gestionnaire d'événements
     * */
    wfw.Event = {
        /**
          * @var list
          * @brief Tableaux des listes d'événements
          * @memberof Event
          
          * @code{.js}
            list[ListName][EventType][FuncName] = {
                func  : [function] callback
                param : [mixed]    callback param
            }
            
            // Exemple
            
            list["checkValueEvents"] = {
                click : {
                    controleFocus : {
                        func  : function(e, p){
                            this.set("text", p.foo);
                        },
                        param : {
                            foo : "bar"
                        }
                    },
                    ...
               },
               ...
            };
           @endcode
        */
        list: new Object(),

        /**
          *  @fn bool SetCallback(list_name, event_type, func_name, func, bUp, param)
          *  @brief Ajoute ou modifie un événement à la liste spécifié
          *  @memberof Event

          *  @param list_name  [string]   Identifiant de la liste à modifier ou à créer
          *  @param event_type [string]   Type d'événement (ex: click, mouseover, etc...)
          *  @param func_name  [string]   Nom indicatif de la fonction à associer (généralement, le nom réel de la fonction)
          *  @param func       [function] La fonction de callback à associer
          *  @param bUp        [bool]     Si true, la fonction est placé en tête de liste
          *  @param param      [mixed]    Optionnel, paramètres à passer au callback
            
          *  @remarks La fonction 'func' prend la forme : void function(event,param);
          *  @remarks Les callback retournant 'false' seront supprimés de la liste d'appel et ne seront donc plus rappelés ultérieurement
          *  @return [bool] true
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

        /**
         *  @fn bool UnSetCallback(list_name, event_type, func_name)
         *  @brief Supprime un événement de la liste spécifié
         *  @memberof Event
         *
         *  @param list_name  [string]   Identifiant de la liste
         *  @param event_type [string]   Type d'événement (ex: click, mouseovr, etc...)
         *  @param func_name  [string]   Nom indicatif de la fonction à supprimer
         *  @return [bool] true en case de succès, false en cas d'erreur
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

        /**
         *   @fn bool RemoveTo(obj, list_name)
         *   @brief Détache une liste d'événements d'un élément
         *   @memberof Event
         *
         *   @param obj       [Node]    L'Elément précédement initialisé avec ApplyTo()
         *   @param list_name [string]  Identifiant de la liste à modifier ou à créer
         *
         *   @remarks RemoveTo supprime la variable de référence associé à l'objet '_wfw_events'
         *   @return [bool] true en cas de succès, false en cas d'échec
        */
        RemoveTo: function (obj, list_name) {
            //var states = new wfw.Event.CALL_LIST(obj.get("id")+":wfw_event");
            if (typeof (obj._wfw_events) == "undefined")
                return false;
            delete obj._wfw_events;
            return true;
        },
        
        /**
         *   @fn bool ApplyTo(obj, list_name)
         *   @brief Attache une liste d'événements à un élément
         *   @memberof Event
         *
         *   @param obj       [Node]    L'Elément à initialiser
         *   @param list_name [string]  Identifiant de la liste à modifier ou à créer
         *
         *   @remarks ApplyTo ajoute une variable de référence associé à l'objet '_wfw_events'
         *   @remarks Un élément ne peut être attaché qu'à une seule liste à la fois
         *
         *   @return [bool] true en cas de succès, false en cas d'échec
        */
        ApplyTo: function (obj, list_name) {
            //var states = new wfw.Event.CALL_LIST(obj.get("id")+":wfw_event");

            if (typeof (this.list[list_name]) == "undefined")
                return false;

            //assigne chacun des evenements a l'objet
            for (var eventType in this.list[list_name])
                obj.on(eventType, this.onEventCall, null, this.list[list_name]);

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
        
        /**
          *   @fn bool onEventCall(e, events_list)
          *   @brief Callback: Appel successivement l'ensemble des callbacks attachés a l'élément
          *   @memberof Event

          *   @remarks Les callback retournant 'false' seront supprimés de la liste d'appel et ne seront donc plus rappelés ultérieurement
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
        
        /**
          *   @fn bool callEvent(event_obj,list_name, event_type)
          *   @brief Callback: Appel un événement
          *   @memberof Event

          *   @remarks Les callback retournant 'false' seront supprimés de la liste d'appel et ne seront donc plus rappelés ultérieurement
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
}, '1.0', {
    requires:['base','wfw']
});


/** @} */ // end of group Event
/** @} */ // end of group YUI
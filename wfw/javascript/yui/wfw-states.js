/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2012,2013 Thomas AUGUEY <contact@aceteam.org>
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


YUI.add('wfw-states', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class States
     * @memberof wfw
     * @brief Gestionnaire d'objets
     * 
     * States permet de manipuler des structures de données
     * |----------------------|
     * |      OBJECT          |
     * |----------------------|
     * |    namespace1        | --> {OBJECT DATA..}
     * |    namespace2        | --> {OBJECT DATA..}
     * |    etc...            |
     * |----------------------|
     * */
    wfw.States = {
        /*
        * Données 
        */
        user_data: [],
        /*
        Obtient l'id d'une instance à partir de son pointeur
        Arguments:
        [object] ref : Pointeur sur l'objet de données
        Retourne:
        [string] Identificateur, null si introuvable.
        */
        getRefId: function(ref){
            for (var id in this.user_data) {
                if (this.user_data[id] == ref) 
                    return id;
            }
            return null;
        },
        /*
        Verifie si des données existe pour un identifiant donné
        Arguments:
        [string] id : Identificateur
        Retourne:
        [boolean] true si des données existes, sinon false.
        */
        exist: function(id){
            if (typeof this.user_data[id] == element) 
                return true;

            return false;
        },
        /*
        Verifie si des données existe pour un élément donné
        Arguments:
        [YUI.Node] element : Elément
        Retourne:
        [boolean] true si des données existes, sinon false.
        Remarque:
        existElement se base sur l'attribut "id" de l'élément pour obtenir ses données.
        */
        existElement: function(element){
            var id = element.get("id");
            if (typeof this.user_data[id] == element) 
                return true;

            return false;
        },
        /*
        Crée un objet de données assigné à un élémentHTML
        Parametres:
            [YUI.Node] element : L'Element HTML
            [object]   states  : Données à assigner
            [object]   options : Options additionel, voir: fromId()
        Retourne:
            [objet] Pointeur sur l'objet de données
        Remarques:
            Si l'élément ne possède pas d'identificateur, il sera généré et assigné automatiquement
        */
        fromElement: function(element, states, options){
            if (typeof(options) == "undefined")
                options = {};

            //obtient l'attribut
            var id = element.get("id");
            if (empty(id)) {
                if (typeof(options.exists) != "undefined" && options.exists == true) 
                    return null;
                //genere un nouvel
                id = uniqid();
                element.set("id", id);
            }

            return this.fromId(id, states, options);
        },
        
        /*
        Crée un objet de donnée depuis un identifiant
        Parametres:
            [string]  id      : Identifiant
            [object]  states  : Données à assigner
            [object]  options : Options additionel, voir: Options
        Options:
            [boolean] assign  : Si true assigne la référence 'states', sinon copie l'objet. (false par défaut)
            [boolean] erase   : Si true, l'objet existant est remplacé par l'objet 'state', sinon l'objet 'state' est associé (object_merge) à l'objet existant. (false par défaut)
        Utilisable uniquement si 'assign=false'.
            [boolean] exists  : Si true, l'objet et le sous-objet doit exister, sinon la fonction retourne null
            [string]  name    : Nom du sous-objet à affecter. "global" par défaut.
        Retourne:
            [objet] Référence sur le sous-objet affecté. null si la fonction a échouée.
        */
        fromId: function(id, states, options){
            //options
            options = object_merge({
                assign: false,
                erase: false,
                exists: false,
                name: "global"
            }, options, false);

            //obtient l'attribut
            if (empty(id)) {
                return null;
            }

            //l'objet existe ?
            if (typeof this.user_data[id] == "undefined") {
                if (options.exists) {
                    //wfw.puts("l'objet existe pas :"+id+", sub="+options.name);
                    return null;
                }
                this.user_data[id] = {};
            }

            //le sous objet existe ?
            if (options.exists && typeof this.user_data[id][options.name] == "undefined") {
                //wfw.puts("le sous objet existe pas :"+id+", sub="+options.name);
                return null;
            }
            //assigne ou copie le pointeur ?
            if (options.assign) {
                this.user_data[id][options.name] = states;
            }
            else {
                //supprime le contenu ?
                if (options.erase) 
                    this.user_data[id][options.name] = {};
                //merge l'objet
                this.user_data[id][options.name] = object_merge(this.user_data[id][options.name], states, false);
            }

            return this.user_data[id][options.name];
        },
        /*
        Supprime un objet de donnée depuis son identifiant
        Parametres:
            [string]  id      : Identifiant
        Retourne:
            [boolean] true si l'objet à été supprimé, false si l'objet n'existe pas.
            [object] null si l'identifiant est vide.
        */
        remove: function(id){
            //obtient l'attribut
            if (empty(id)) {
                return null;
            }
            //obtient l'attribut
            if (typeof this.user_data[id] == "undefined") 
                return false;
            delete this.user_data[id];
            eval("delete this.user_data." + id + ";");

            return true;
        }
    };
}, '1.0', {
    requires:['base','node']
});

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
 * @defgroup WFW-Base
 * @brief Fonctions de bases
 *
 * @section depend Dépendences
 * @par
 *   - JS  Dependences: base.js
 *   - YUI Dependences: base, wfw-states
 *
 *  @{
 */
YUI.add('wfw', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class wfw
     * @memberof Y
     * @brief Classe mére de la librairie Webframework
     * 
     */
    var tmp = {
        /**
         * @fn OBJECT createObject(att)
         * @brief Construit un nouvel objet
         * @memberof wfw
         * 
         * @param att [object] Attributs de l'objet
         * @return Instance de la classe OBJECT
        */
        createObject : function(att){
            return new this.OBJECT(att);
        },

        /**
         * @class OBJECT
         * @brief Classe d'un objet de base
         * @memberof wfw
         * 
         * @param att [string/object] Données de l'objet, Peut être un objet associatif ou un identifiant wfw.States
         * 
         * @par Propriétés
         * @param id [string] Identificateur de l'instance
         * @param ns [string] Espace de nommage
         * 
         * @remarks Initialiser les données depuis une instance wfw.States
         * 
        */
        OBJECT : function(att){
            this.id;// Identificateur de l'instance
            this.ns;// Espace de nommage

            /*
             * Constructeur
             */
            
            // initialise les données ?
            if(att != null)
            {
                //depuis l'objet 'States' ?
                if(typeof att == "string" && typeof wfw.States != "undefined"){
                    // 'global' namespace
                    if(att.indexOf(':') == -1){
                        this.id = att;
                        object_merge(this,wfw.States.fromId(this.id, null, {
                            exists:true
                        }),false);
                    }
                    // named namespace
                    else{
                        var id = strexplode(att,':');
                        this.id   = id[0];
                        this.ns = id[1];
                        object_merge(this,wfw.States.fromId(this.id, null, {
                            exists:true, 
                            name:this.ns
                        }),false);
                    }
                }
                
                //depuis un noeud du document ?
                //if(instanceof att == Y.Node)
                //    object_merge(this,att,false);
                
                //depuis l'argument 'att' ?
                if(typeof att == "object" && att != null)
                    object_merge(this,att,false);
            }
            
            //espace de nomage global
            if(empty(this.ns))
                this.ns = "global";
            
            //identificateur générique ?
            if(empty(this.id))
                this.id = strtoid(uniqid());
            
            wfw.puts("new OBJECT("+this.ns+" => "+this.id+");");
        },
        
        /**
         * @fn bool checkError(e)
         * @brief Traitement d'une exception Javascript
         * @memberof wfw
         * 
         * @param e [object] Objet Exception
         * @return [bool] false
         * @remarks checkError() utilise la fonction puts_error() pour afficher un message d'erreur
        */
        checkError: function(e){
            var str ="Exception: ("+e.number+")\n"
            str+="\t"+e.name+"\n";
            str+="\t"+e.message+"\n";
            str+="\t"+e.toString();
            this.puts_error(str);
            return false;
        },
        
        /**
         * @fn bool checkError(e)
         * @brief Ecrit un texte ou un objet dans la console de deboguage avec une en-tête d'erreur
         * @memberof wfw
         * 
         * @param obj [mixed] Variable à écrire, la variable est affichée par la fonction toString()
         * @return [string] Le texte généré
        */
        puts_error: function (txt) {
            return this.puts(
                '============================================================\n'
                +'-------------------!! Error Occurred !!---------------------\n'
                +txt+"\n"
                +'============================================================'
                );
        },
        
        /*
         * @fn bool puts(obj,depth)
         * @brief Ecrit un texte ou un objet dans la console de deboguage
         * @memberof wfw
         * 
         * @param obj [mixed] Contenu à écrire, le contenu est transformé en texte par la fonction "wfw.toString"
         * @param depth [bool] Contenu à écrire, le contenu est transformé en texte par la fonction "wfw.toString"
         * @return [string] Le texte généré
        */
        puts: function (obj,depth) {
            var text = this.toString(obj,depth);
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
        
        /**
         * @fn bool toString(obj,depth)
         * @brief Convertie un objet Javascript en chaine de caractéres
         * @memberof wfw
         * 
         * @param obj   [mixed] Contenu à écrire, le contenu est transformé en texte par la fonction "wfw.toString"
         * @param depth [bool]  Si true, scan les objets et tableaux recursivement
         * @return [string] Texte de l'objet
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
                            text += 'object {' + obj_member + ':' + (!depth ? "" + obj[obj_member] : this.toString(obj[obj_member])) + "},\n";
                        text += "\n";
                        break;
                    case 'array':
                        if (!depth)
                            text += "" + obj;
                        else
                            for (var i = 0; i < obj.length; i++)
                                text += '{' + i + ':' + (!depth ? "" + obj[i] : this.toString(obj[i])) + "},\n";
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
        path: function (request_name) {
            return 'wfw/' + request_name;
        }, // symbolik link
        request_path: function (request_name) {
            return 'wfw/req/' + request_name;
        }, // symbolik link
        //request_path: function(request_name){ return 'req:'+request_name; }, // url rewriting

        nav: new Object(), // navigator dependent-interfaces instances
        dummy: function () { }, // empty function
        version: "1.7", //webframework library version
        copyright: "(C)2013 Thomas AUGUEY", // empty function
        url: "http://www.aceteam.org http://webframework.fr"

    };
    object_merge(wfw,tmp,false);

}, '1.0', {
    requires:['base','wfw-states']
});


/** @} */ // end of group Base
/** @} */ // end of group YUI
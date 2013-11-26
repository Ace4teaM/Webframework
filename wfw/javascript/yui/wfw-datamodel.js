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
 * @defgroup WFW-DataModel
 * @brief Fonctions du modèle de données
 *
 * @section depend Dépendences
 * @par
 *   - JS  Dependences: base.js
 *   - YUI Dependences: base, wfw, wfw-event, wfw-utils, wfw-navigator
 *
 *  @{
 */
YUI.add('wfw-datamodel', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class DataModel
     * @memberof wfw
     * @brief Fonctions relatives au modèle de données
     * */
    wfw.DataModel = {

        datamodel:false,//doc xml (false==en attente d'un premier chargement, null==chargement echoué)

        /**
         * @class FIELD
         * @brief Définition d'un champ de données
         * @memberof DataModel
         * 
         * @param string id    Identifiant 
         * @param string type  Format (integer, string, float, mail, ...)
         * @param string label Texte définition
        */
        FIELD : function(att){
            //
            this.id     = null; // identifiant 
            this.type   = null; // format (integer, string, float, mail, ...)
            this.label  = null; // text definition
            
            /*
             * Constructeur
             */
            if(typeof(att)=="string")
                object_merge(this,wfw.DataModel.getFieldInfos(att),false);
            else{
                object_merge(this,att,false);
                if(this.id)
                    object_merge(this,wfw.DataModel.getFieldInfos(this.id),false);
            }
        },
        
        /**
         * @class FORM
         * @brief Construit un formulaire de champs
         * @memberof DataModel
         * @implements OBJECT
         * 
         * @param FIELD[] fields Liste des définitions de champs (voir wfw.DataModel.makeField)
        */
        FORM : function(att){
            //OBJECT
            this.ns                = "wfw_datamodel";
            //FORM
            this.fields            = [];
            this.panel             = null;

            /*
             * Constructeur
             */
            wfw.DataModel.FORM.superclass.constructor.call(this, att);
            
            //parse les champs
            for(var i in this.fields){
                var field = this.fields[i];
                if(!(field instanceof wfw.DataModel.FIELD))
                    this.fields[i] = new wfw.DataModel.FIELD(this.fields[i]);
            }
            
            this.createHTML();
        },
        
        /*------------------------------------------------------------------------------------------------------------------*/
        /**
         * @fn array fetchData(table_name, cols)
         * @brief Récupére des données d'une table SQL
         * @memberof Request
         *
         * @param string table_name Nom de table
         * @param array cols Liste des identifiants de colonnes
         * @return array Tableau des données
         * @remarks Cette fonction utilise le contrôleur 'datafetch' pour obtenir les données.
         */
        /*------------------------------------------------------------------------------------------------------------------*/

        fetchData: function(table_name, cols)
        {
            var myData=[];
            var param = {
                table_name : table_name,
                cols_names : cols.join(",")
            };
            wfw.Request.Add(
                null,
                wfw.Navigator.getURI("datafetch"),
                param,
                wfw.Xml.onCheckRequestResult,{
                    onsuccess:function(req,doc,root){
                        root.all(table_name).each(function(node){
                            var data = [];
                            for( var col in cols){
                                data.push( [node.one(">"+cols[col]).get("text")] );
                            }
                            myData.push( data );
                        });
                    }
                },false
            );
            return myData;
        },

        /**
         * @fn array getFieldInfos(id)
         * @brief Obtient des informations sur un champ
         * @memberof Request
         *
         * @param string id Identifiant du champ
         * @return object Tableau associatif contenant les informations sur le champ
         * 
         * @par Retour
         * Détail sur le format de l'objet retourné
         * @code{.js}
         * var obj = wfw.DataModel.getFieldInfos('field_name');
         * obj == {
         *  id    : string // Identifiant du champ (passé en argument)
         *  label : string // Nom du champ
         *  type  : string // Type du champ (tel que definit dans la configuration [fields_formats])
         * };
         * @endcode
         */

        getFieldInfos : function(id)
        {
            if(this.datamodel==false)
                this.loadDataModel();
            if(this.datamodel==null)
                return null;

            var root = Y.Node(this.datamodel.documentElement);
            
            var fieldNode = root.one(">"+id);
            if(fieldNode == null){
                wfw.puts("getFieldInfos: unknown "+id+" filed");
                return false;
            }
            return {
                id    : id,
                name  : id,
                type  : fieldNode.get("text"),
                label : fieldNode.getAttribute("label")
            };
        },

        /**
         * @fn array getFieldsInfos(ids)
         * @brief Obtient des informations sur plusieurs champs
         * @memberof Request
         * 
         * @param id [array] Identifiants des champs
         * @return array Liste des tableaux associatifs contenant les informations sur les champs
         * 
         * @par Retour
         * Détail sur le format de l'objet retourné
          @code{.js}
          var obj = wfw.DataModel.getFieldInfos('field_name');
          // obj == [
          //  {id,label,type},
          //  {id,label,type},
          //  {id,label,type},
          //  ...
          // ];
          @endcode
         */

        getFieldsInfos : function(ids)
        {
            if(this.datamodel==false)
                this.loadDataModel();
            if(this.datamodel==null)
                return null;

            var root = Y.Node(this.datamodel.documentElement);
            var infos=[];
            for(var i in ids){
                var id=ids[i];
                var fieldNode = root.one(">"+id);
                if(fieldNode == null){
                    wfw.puts("getFieldInfos: unknown "+id+" filed");
                    return false;
                }
                infos.push({
                    id    : id,
                    name  : id,
                    type  : fieldNode.get("text"),
                    label : fieldNode.getAttribute("label")
                });
            }
            return infos;
        },

        /*------------------------------------------------------------------------------------------------------------------*/
        /**
         * @fn array loadDataModel()
         * @brief Charge le modèle de données
         * @memberof Request
         *
         * @return [XMLDocument] document du modèle de données
         */
        /*------------------------------------------------------------------------------------------------------------------*/

        loadDataModel : function()
        {
            this.datamodel = null;
            wfw.Request.Add(
                null,
                wfw.Navigator.getURI("datamodel"),
                null,
                wfw.Xml.onCheckRequestResult,
                {
                    no_result : true,
                    no_msg    : true,
                    onsuccess : function(obj,xml_doc,xml_root){
                        wfw.DataModel.datamodel = xml_doc;
                        wfw.puts("Datamodel loaded");
                    },
                    onfailed   : function(obj,xml_doc,xml_root){
                        wfw.puts("Datamodel not loaded (failed)");
                    },
                    onerror   : function(obj){
                        wfw.puts("Datamodel not loaded (error)");
                    }
                },
                false
                );
            return this.datamodel;
        },

        /*------------------------------------------------------------------------------------------------------------------*/
        /**
         * @fn object bindValue(type,value)
         * @brief Convertie une valeur en type Javascript
         * @memberof Request
         *
         * @return [object] Objet de données
         * @retval null La classe input n'existe pas
         */
        /*------------------------------------------------------------------------------------------------------------------*/
        bindValue : function(type,value)
        {
            var className = "cInput"+type.toLowerCase();
            if (eval("typeof "+className) == 'object'){
                var input = eval(className);
                return input.toObject(value);
            }
            return null;
        },
        
        /*------------------------------------------------------------------------------------------------------------------*/
        /**
         * @fn string parseValue(value)
         * @brief Convertie un type Javascript en type Webframework
         * @memberof Request
         *
         * @return [string] Valeur convertie
         * @retval null Pour le type null
         */
        /*------------------------------------------------------------------------------------------------------------------*/
        parseValue : function(value)
        {
            if(value == null)
                return null;
            if(typeof(value) == "string")
                return value;
            if(value instanceof Boolean)
                return (value ? 'TRUE' : 'FALSE');
            if(value instanceof String)
                return value.toString();
            if(value instanceof Date)
                return value.toString('yyyy-MM-dd');
            
            return ""+value;//autres
        }
    };

    /*-----------------------------------------------------------------------------------------------------------------------
     * FIELD Class Implementation
     *-----------------------------------------------------------------------------------------------------------------------*/
    
    /**
     * @fn string createHTML()
     * @brief Crée l'élément HTML
     * @memberof FIELD
     *
     * @return [Node] Noeud du champ
     */
    wfw.DataModel.FIELD.prototype.createHTML = function(){
        return Y.Node.create('<input type="text" name="'+this.id+'">');
    };
    
    /*-----------------------------------------------------------------------------------------------------------------------
     * FORM Class Implementation
     *-----------------------------------------------------------------------------------------------------------------------*/
    
    Y.extend(wfw.DataModel.FORM,wfw.OBJECT);

    /**
     * @fn string createHTML()
     * @brief Créer le formulaire HTML
     * @memberof FORM
     *
     * @return [Node] Noeud du formulaire
     */
    wfw.DataModel.FORM.prototype.createHTML = function(){
        wfw.puts(this.fields);return;
        for(var i in this.fields){
            var field = this.fields[i];
            
            var containerEl = Y.Node.create("<div></div>");
            containerEl.append("<label>"+field.label+"</label>");
            containerEl.append(field.toHTML());
        }
    };
}, '1.0', {
    requires:['base','wfw','wfw-event','wfw-utils','wfw-navigator']
});

/** @} */ // end of group DataModel
/** @} */ // end of group YUI
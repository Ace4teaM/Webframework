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

YUI.add('wfw-datamodel', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class DataModel
     * @memberof wfw
     * @brief Fonctions relatives aux model de données
     * */
    wfw.DataModel = {

        datamodel:false,//doc xml (false==en attente d'un premier chargement, null==chargement echoué)
    
        /*------------------------------------------------------------------------------------------------------------------*/
        /**
         * @brief Récupére des données d'une table SQL
         * @param string table_name Nom de table
         * @param array cols Liste des identifiants de colonnes
         * @return array Tableau des données
         * @remarks Cette fonction utilise le contrôleur 'datafetch' pour obtenir les données.
         * @remarks Pour fonctionner, l'index de page 'datafetch' avec l'URL valide doit être définit dans le fichier 'default.xml' de votre application
         **/
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
         ------------------------------------------------------------------------------------------------------------------
         * @brief Obtient des informations sur un champ
         * @param string id Identifiant du champ
         * @return object Tableau associatif contenant les informations sur le champ
         * 
         * ## Retour
         * Détail sur le format de l'objet retourné
         * @code{.js}
         * var obj = {
         *  id    : string // Identifiant du champ (passé en argument)
         *  label : string // Nom du champ
         *  type  : string // Type du champ (tel que definit dans la configuration [fields_formats])
         * };
         * @endcode
         ------------------------------------------------------------------------------------------------------------------
         **/

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
                type  : fieldNode.get("text"),
                label : fieldNode.getAttribute("label")
            };
        },

        /*------------------------------------------------------------------------------------------------------------------*/
        /**
         * @brief Charge le model de données
         **/
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
        }

    };

}, '1.0', {
    requires:['base','wfw','wfw-event','wfw-utils','wfw-navigator']
});

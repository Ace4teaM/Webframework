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

Ext.define('MyApp.DataModel', {
    singleton: true,
    datamodel:false//doc xml (false==en attente d'un premier chargement, null==chargement echoué)
});



/*
 *------------------------------------------------------------------------------------------------------------------
 * @brief Construit un formulaire de champs
 * @param array wfw_fields Liste des définitions de champs (voir MyApp.DataModel.makeField)
 *------------------------------------------------------------------------------------------------------------------
 */
Ext.define('MyApp.DataModel.FieldsForm', {
    extend: 'Ext.form.Panel',
    alias: 'fieldsform',

    config:{
        bodyStyle:'padding:5px 5px 0',
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 220
        },
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },
        defaults_buttons:true,
        wfw_fields:[],
        items:[]
    },
        
        
    initComponent: function()
    {
        var wfw = Y.namespace("wfw");
        var me = this;
        
        //initalise les items de champs
        var items=[];
        for(var key in this.wfw_fields){
            items.push(MyApp.DataModel.makeField(this.wfw_fields[key]));
        }

        Ext.apply(this, {
            items: items
        });

        if(this.defaults_buttons)
            Ext.apply(this,{
                dockedItems:[{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: ['->',{
                        iconCls: 'wfw_icon save',
                        text: 'Sauvegarder',
                        scope:me,
                        handler:function(){
                            var wfw = Y.namespace("wfw");
                            //appel le controleur
                            wfw.Request.Add(null,this.url,
                                object_merge(this.add_args,this.getValues(),true),
                                wfw.XArg.onCheckRequestResult,
                                {
                                    onsuccess:function(req,args){
                                        MyApp.showResultToMsg(wfw.Result.fromXArg(args));
                                        //window.location.reload();
                                    },
                                    onfailed:function(req,args){
                                        MyApp.showResultToMsg(wfw.Result.fromXArg(args));
                                    }
                                },
                                false
                            );
                        }
                    }]
                }]
            });
        
        this.superclass.initComponent.apply(this, arguments);
    },
    
    loadFormData: function(url){
        var wfw = Y.namespace("wfw");
            var form = this.getForm();
            //appel le controleur
            wfw.Request.Add(null,url,
                {output:"xarg"},
                wfw.XArg.onCheckRequestResult,
                {
                    onsuccess:function(req,args){
                        form.setValues(args);
//                        wfw.puts(args);
                    },
                    onfailed:function(req,args){
                        MyApp.showResultToMsg(wfw.Result.fromXArg(args));
                    },
                    onerror:function(req){
                        wfw.puts("get_url data error");
                    }
                },
                false
            );
    },
        
    constructor: function(config) {
        Ext.apply(this, this.config);
        this.superclass.constructor.call(this,config);
        return this;
    }
});
    
/*------------------------------------------------------------------------------------------------------------------*/
//
// Construit un formulaire avec les champs du dictionnaire de données
//
/*------------------------------------------------------------------------------------------------------------------*/
Ext.define('MyApp.DataModel.FieldsDialog', {
    extend: 'Ext.window.Window',

    requires: [
        'MyApp.DataModel.FieldsForm'
    ],
        
    config:{
        closable: true,
        width: 600,
        layout:'fit',
        bodyStyle: 'padding: 5px;',
        modal:true,
        items: [],
        buttons: [],
        //fieldsform:{xtype:'fieldsform'},
        //wfw_fields:[],
        fieldsform:false,
        callback:function(data){}
    },
        
    initComponent: function()
    {
        var me=this;
            
        if(!this.fieldsform)
            return false;
            
        Ext.apply(this, {
            items: this.fieldsform
        });

            
        //this.form = Ext.create('MyApp.FieldsForm',config);
        this.btnCancel = Ext.create('Ext.Button',{
            text:"Annuler",
            handler: function() {
                me.close();
            }
        });
            
        this.btnOK = Ext.create('Ext.Button',{
            text:"OK",
            handler: function() {
                me.callback(me.fieldsform.getValues());
                me.close();
            }
        });
            
        Ext.apply(this, {
            buttons: [
            this.btnCancel,
            '->',
            this.btnOK
            ]
        });
            
        this.superclass.initComponent.apply(this, arguments);
    },
       
    getFieldsForm: function(){
        return this.fieldsform;
    },
         
    constructor: function(config) {
        Ext.apply(this, this.config);
        this.superclass.constructor.call(this,config);
        return this;
    }
});

/*------------------------------------------------------------------------------------------------------------------*/
/**
 * @brief Convertie les formulaires HTML présents en formulaire dynamique ExtJS
 * @remarks Le forumalire HTML original doit être généré via la methode PHP Application.makeFormView()
 **/
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.DataModel.makeField = function(att)
{
    var wfw = Y.namespace("wfw");
    var g = MyApp.global.Vars;
    var def = {
        id:false,
        type:false,
        label:false,
        optional:false
    };
    
    if(att.id)
        def = object_merge(def,MyApp.DataModel.getFieldInfos(att.id),false);
    
    att = object_merge(def,att,false);

    var item = {
        name:att.id,
        fieldLabel: att.label
    };
    
    if(att.optional)
        item.allowBlank = true;
    
    switch(att.type){
        case "html":
        case "cInputHTML":
            object_merge(item,{
                xtype: 'htmleditor',
                height:250,
                enableColors: false,
                enableAlignments: false
            },false);
            break;
        case "text":
        case "cInputText":
            object_merge(item,{
                xtype: 'textarea',
                height:250
            },false);
            break;
        case "bool":
        case "cInputBool":
            object_merge(item,{
                xtype: 'checkboxfield'
            },false);
            break;
        case "integer":
        case "cInputInteger":
            object_merge(item,{
                xtype: 'numberfield'
            },false);
            break;
        case "date":
        case "cInputDate":
            object_merge(item,{
                xtype: 'datefield',
                format: 'd-m-Y',
                submitFormat:'Y-m-d',
                value: new Date()
            },false);
            break;
        case "string":
        case "cInputString":
        default:
            object_merge(item,{
                xtype: 'textfield'
            },false);
            break;
    }
    
    return item;//Ext.create('Ext.form.field',item);
}

/*------------------------------------------------------------------------------------------------------------------*/
/**
 * @brief Convertie un type de champ Webframework en type Extjs
 * @return Type de champ compatible avec 'Ext.data.Field.type'
 * @remarks Si le type est inconnu 'auto' est retourné
 **/
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.DataModel.convertFieldType = function(type)
{
    var wfw = Y.namespace("wfw");
    
    switch(type){
        case "float":
        case "cInputFloat":
            return 'float';
        case "bool":
        case "cInputBool":
            return 'boolean';
        case "integer":
        case "cInputInteger":
            return 'int';
        case "date":
        case "cInputDate":
            return 'date';
        case "html":
        case "cInputHTML":
        case "text":
        case "cInputText":
        case "string":
        case "cInputString":
        default:
            return 'string';
    }
    
    return "auto";
}

/*------------------------------------------------------------------------------------------------------------------*/
/**
 * @brief Récupére des données d'une table SQL
 * @param string table_name Nom de table
 * @param array cols Liste des identifiants de colonnes
 * @remarks Cette fonction utilise le contrôleur 'datafetch' pour obtenir les données.
 * @remarks Pour fonctionner, l'index de page 'datafetch' avec l'URL valide doit être définit dans le fichier 'default.xml' de votre application
 **/
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.DataModel.fetchData = function(table_name, cols)
{
    var wfw = Y.namespace("wfw");
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
}

/**
 ------------------------------------------------------------------------------------------------------------------
 * @brief Initialise un model de stockage basé sur le dictionnaire de données
 * @param array cols Liste des identifiants de colonnes (tel que definit dans la configuration [fields_formats])
 * @param array data Liste des tableaux de données. Utilisez MyApp.DataModel.fetchData pour obtenir les données depuis la BDD
 * @return Ext.data.ArrayStore Stockage de données
 ------------------------------------------------------------------------------------------------------------------
 **/

MyApp.DataModel.createArrayStore = function(cols, data)
{
    var wfw = Y.namespace("wfw");
    var fieldsList = [];
    for( var col in cols){
        var att = MyApp.DataModel.getFieldInfos(cols[col]);
        if(att)
            fieldsList.push({
                name : att.id,
                type : MyApp.DataModel.convertFieldType(att.type)
            });
    }
//  wfw.puts(fieldsList);
    return Ext.create('Ext.data.ArrayStore', {fields:fieldsList, data: data});
}

/**
 ------------------------------------------------------------------------------------------------------------------
 * @brief Initialise un model de stockage basé sur le dictionnaire de données
 * @param array cols Liste des identifiants de colonnes (tel que definit dans la configuration [fields_formats])
 * @param array data Liste des tableaux de données. Utilisez MyApp.DataModel.fetchData pour obtenir les données depuis la BDD
 * @return Ext.data.ArrayStore Stockage de données
 ------------------------------------------------------------------------------------------------------------------
 **/
Ext.define('MyApp.DataModel.Grid', {
    extend: 'Ext.grid.Panel',
    
    config:{
        stateful: true,
        stateId: 'stateGrid',
        cols:[],
        viewConfig: {
            stripeRows: true
        }
    },

    constructor: function(config) {
        Ext.apply(this, this.config);
        this.superclass.constructor.call(this,config);
        return this;
    },

    initComponent: function()
    {
        var wfw = Y.namespace("wfw");
        var me=this;
        
        var gridCol = [];
        for(var i in this.cols){
            wfw.puts(this.cols[i]);
            var att = MyApp.DataModel.getFieldInfos(this.cols[i]);
            gridCol.push({
                text     : att.label,
                flex     : 1,
                sortable : true,
                dataIndex: att.id
            });
        }

        //Boutons
        Ext.apply(this, {
            columns: gridCol
        });
        
        this.superclass.initComponent.apply(this, arguments);
        
        //initialise les evenements
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
    },

    onSelectChange: function(selModel, selections){
        //alert(selections.length ? false : true);
        //this.deleteBtn.setDisabled(selections.length ? false : true);
    }

});


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

MyApp.DataModel.getFieldInfos = function(id)
{
    var wfw = Y.namespace("wfw");
    
    if(MyApp.DataModel.datamodel==false)
        MyApp.DataModel.loadDataModel();
    if(MyApp.DataModel.datamodel==null)
        return null;

    var root = Y.Node(MyApp.DataModel.datamodel.documentElement);
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
}

/*------------------------------------------------------------------------------------------------------------------*/
/**
 * @brief Charge le model de données
 **/
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.DataModel.loadDataModel = function()
{
    var wfw = Y.namespace("wfw");
    MyApp.DataModel.datamodel = null;
    wfw.Request.Add(
        null,
        wfw.Navigator.getURI("datamodel"),
        null,
        wfw.Xml.onCheckRequestResult,
        {
            no_result : true,
            no_msg    : true,
            onsuccess : function(obj,xml_doc,xml_root){
                MyApp.DataModel.datamodel = xml_doc;
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
    return MyApp.DataModel.datamodel;
}

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

Ext.define('Wfw.DataModel', {
    singleton: true
});



/*
 *------------------------------------------------------------------------------------------------------------------
 * @brief Construit un formulaire de champs
 * @param array wfw_fields Liste des définitions de champs (voir Wfw.DataModel.makeField)
 *------------------------------------------------------------------------------------------------------------------
 */
Ext.define('Wfw.DataModel.FieldsForm', {
    extend: 'Ext.form.Panel',
    alias: 'fieldsform',

    config:{
        bodyStyle:'padding:5px 5px 0',
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 150
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
            items.push(Wfw.DataModel.makeField(this.wfw_fields[key]));
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
                                        showResultToMsg(wfw.Result.fromXArg(args));
                                        //window.location.reload();
                                    },
                                    onfailed:function(req,args){
                                        showResultToMsg(wfw.Result.fromXArg(args));
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
                        showResultToMsg(wfw.Result.fromXArg(args));
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
Ext.define('Wfw.DataModel.FieldsDialog', {
    extend: 'Ext.window.Window',

    requires: [
        'Wfw.DataModel.FieldsForm'
    ],

    config:{
        closable: true,
        width: 400,
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

        //this.form = Ext.create('Wfw.FieldsForm',config);
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

/**
 * @brief Convertie une liste de champs XML en liste de champs Extjs (utilisable avec Wfw.DataModel.FieldsForm)
 * @param node [Y.Node] Noeud parent des champs
 * @return [array] Liste des champs
 */
Wfw.DataModel.makeFieldsListFromXml = function(node)
{
    //liste les champs
    var fieldNode = node.one(">*");
    var fields = [];
    while(fieldNode){
        fields.push({
            id : fieldNode.get("tagName"),
            value : fieldNode.get("text")
        });
        fieldNode = fieldNode.next();
    }
    
    return fields;
}

/**
 * @brief Convertie un champ du model de données en composant Extjs
 * @param att [object] Attributs du champs
 * @return [array] Liste des champs
 * 
 * @par Exemple
 * @code{.js}
  var extjsComp = Wfw.DataModel.makeField({
        id:"data_model_name",   // define the data model id
        type:"data_model_type", // auto by default
        label:"text",           // auto by default
        optional:false,         // true si optional field item
        //name:false            // auto by default (same of id)
  });
  @endcode
 */
Wfw.DataModel.makeFieldList = function(data)
{
    var fieldList = [];
    for(var id in data){
        fieldList.push({id:id,value:data[id]});
    }
    return fieldList;
}

/**
 * @brief Convertie un champ du model de données en composant Extjs
 * @param att [object] Attributs du champs
 * @par Exemple
 * @code{.js}
  var extjsComp = Wfw.DataModel.makeField({
        id:"data_model_name",   // define the data model id
        type:"data_model_type", // auto by default
        label:"text",           // auto by default
        value:null,             // null by default
        optional:false,         // true si optional field item
        //name:false            // auto by default (same of id)
  });
  @endcode
 */
Wfw.DataModel.makeField = function(att)
{
    var wfw = Y.namespace("wfw");

    var def = {
        id:false,
        type:false,
        label:false,
        optional:false,
        value:null,
        validator:null,
        name:false//optionel, en remplacement de l'id
    };
    
    if(typeof(att)=="string")
        att = {id: att};
    
    if(att.id)
        def = object_merge(def,wfw.DataModel.getFieldInfos(att.id),false);
    
    att = object_merge(def,att,false);

    var item = {
        name:(def.name?def.name:att.id),
        fieldLabel: att.label,
        value: def.value
    };
    
    // optionel
    if(att.optional)
        item.allowBlank = true;
    
    // validation du format
    /*if(att.type){
        item["validator"] = eval("cInput"+att.type+".isValid");
        //item["regex"] = eval("cInput"+att.type+".regExp()");
    }*/
    
    // type
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

Wfw.DataModel.convertFieldType = function(type)
{
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

/**
 ------------------------------------------------------------------------------------------------------------------
 * @brief Initialise un model de stockage basé sur le dictionnaire de données
 * @param array cols Liste des identifiants de colonnes (tel que definit dans la configuration [fields_formats])
 * @param array data Liste des tableaux de données. Utilisez wfw.DataModel.fetchData pour obtenir les données depuis la BDD
 * @return Ext.data.ArrayStore Stockage de données
 ------------------------------------------------------------------------------------------------------------------
 **/

Wfw.DataModel.createArrayStore = function(cols, data)
{
    var wfw = Y.namespace("wfw");
    var fieldsList = [];
    for( var col in cols){
        var att = wfw.DataModel.getFieldInfos(cols[col]);
        if(att)
            fieldsList.push({
                name : att.id,
                type : Wfw.DataModel.convertFieldType(att.type)
            });
    }
//  wfw.puts(fieldsList);
    return Ext.create('Ext.data.ArrayStore', {fields:fieldsList, data: data});
}

/**
 ------------------------------------------------------------------------------------------------------------------
 * @brief Initialise un model de stockage basé sur le dictionnaire de données
 * @param array cols Liste des identifiants de colonnes (tel que definit dans la configuration [fields_formats])
 * @param array data Liste des tableaux de données. Utilisez wfw.DataModel.fetchData pour obtenir les données depuis la BDD
 * @return Ext.data.ArrayStore Stockage de données
 ------------------------------------------------------------------------------------------------------------------
 **/
Ext.define('Wfw.DataModel.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.wfw_datamodel_grid',
    
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
            var att = wfw.DataModel.getFieldInfos(this.cols[i]);
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


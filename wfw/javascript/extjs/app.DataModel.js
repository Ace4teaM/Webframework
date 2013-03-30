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



/*------------------------------------------------------------------------------------------------------------------*/
//
// Construit un formulaire avec les champs du dictionnaire de données
//
/*------------------------------------------------------------------------------------------------------------------*/
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
        wfw_fields:[],
        items:[]
    },
        
        
    initComponent: function()
    {
        //initalise les items de champs
        var items=[];
        for(var key in this.initialConfig.wfw_fields){
            items.push(MyApp.DataModel.makeField(this.initialConfig.wfw_fields[key]));
        }
            
        Ext.apply(this, {
            items: items
        });

        this.superclass.initComponent.apply(this, arguments);
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
 * @brief Charge le model de données
 **/
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.DataModel.getFieldInfos = function(id)
{
    if(MyApp.DataModel.datamodel==false)
        MyApp.DataModel.loadDataModel();
    if(MyApp.DataModel.datamodel==null)
        return null;

    var root = Y.Node(MyApp.DataModel.datamodel.documentElement);
    var fieldNode = root.one(">"+id);
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
    wfw.Request.Add(
        null,
        wfw.Navigator.getURI("datamodel"),
        null,
        wfw.Xml.onCheckRequestResult,
        {
            no_result : true,
            no_msg    : true,
            onsuccess : function(obj,xml_doc){
                MyApp.DataModel.datamodel = xml_doc;
                wfw.puts("Datamodel loaded");
            },
            onerror   : function(obj){
                wfw.puts("Datamodel not loaded");
            }
        },
        false
        );
    return MyApp.DataModel.datamodel;
}

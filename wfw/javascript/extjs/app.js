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
var Y;//requis pour la librairie Webframework

/*------------------------------------------------------------------------------------------------------------------*/
/**
 * Implémentation de l'application ExtJS
 **/
/*------------------------------------------------------------------------------------------------------------------*/

//application class
Ext.application({
    name: 'MyApp',
    appFolder: 'application',
    enableQuickTips:true,
    controllers: [
    ],
    autoCreateViewport: false,
    launch: function() {
        Y = YUI(wfw_yui_config(wfw_yui_base_path)).use('node', 'event', 'wfw-result','wfw-xml-template', 'wfw-user', 'loading-box', 'io', 'wfw-navigator', 'wfw-request', 'wfw-xml','datatype-xml', function (Y)
        {
            var wfw = Y.namespace("wfw");
            
            //appel les fonctions d'initialisation
            for(var index in MyApp.Loading.callback_list){
                var func = MyApp.Loading.callback_list[index];
                func(Y);
            }

            //fin de chargement
            if(typeof(Y.LoadingBox) != "undefined")
                Y.LoadingBox.stop();
        });
    },
    onCheckUserConnection: null,
    onInitMainLayout: null,
    createFrameDialog: null,
    showFormDialog: null,
    makeForm: null
});

//globals variables
Ext.define('MyApp.global.Vars', {
    statics: {
        //viewport
        statusPanel : null,
        contentPanel : null,
        menuPanel : null,
        footerPanel : null,
        viewport : null
    }
});

//loading functions
//ajoutez à ce global les fonctions d'initialisations
Ext.define('MyApp.Loading', {
    statics: {
        callback_list : []
    }
});



/*------------------------------------------------------------------------------------------------------------------*/
//
// Construit un formulaire avec les champs du dictionnaire de données
//
/*------------------------------------------------------------------------------------------------------------------*/
Ext.define('MyApp.FieldsForm', {
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
            items.push(MyApp.makeField(this.initialConfig.wfw_fields[key]));
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
    },
        
    test:function(){
        return 'dfdfsdf'
        }
});
    
/*------------------------------------------------------------------------------------------------------------------*/
//
// Construit un formulaire avec les champs du dictionnaire de données
//
/*------------------------------------------------------------------------------------------------------------------*/
Ext.define('MyApp.FieldsDialog', {
    extend: 'Ext.window.Window',

    requires: [
    'MyApp.FieldsForm'
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

MyApp.onInitForm = function(Y)
{
    var wfw = Y.namespace("wfw");
    var g = MyApp.global.Vars;
    var formEl = Y.Node.one("#form");
    if(!formEl)
        return;
    //champs
    var items=[];
    formEl.all("fieldset").each(function(fieldsetEl){
        var fieldset={
            xtype:'fieldset',
            checkboxToggle:true,
            title: fieldsetEl.one("legend").get("text"),
            defaultType: 'textfield',
            collapsible: true,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items:[]
        };
        fieldsetEl.all("div.wfw_edit_field").each(function(fieldEl){
            var label = fieldEl.one("label");
            var node = fieldEl.one("input");
            if(!node||!label)
                return;
            var id = node.get("id");
            var name = node.get("name");
            var value = node.get("value");
            var type = node.get("className");
            /*var parent = node.get("parentNode");
                        parent.set("id",name+"_parentNode");
                        parent = Ext.get(name+"_parentNode");
                        node.remove();*/
            //alert(id+","+type+","+value);
            var item;
            switch(type){
                case "cInputString":
                    item={
                        xtype: 'textfield',
                        id:name,
                        name:name,
                        fieldLabel: label.get("text"),
                        height:20
                    };
                    break;
                case "cInputText":
                    item={
                        xtype: 'htmleditor',
                        id:name,
                        name:name,
                        fieldLabel: label.get("text"),
                        height:250,
                        enableColors: false,
                        enableAlignments: false
                    };
                    break;
                case "cInputDate":
                    item={
                        xtype: 'datefield',
                        fieldLabel: label.get("text"),
                        id:name,
                        name:name,
                        format: 'd-m-Y',
                        submitFormat:'Y-m-d',
                        value: new Date()
                    };
                    break;
                default:
                    item={
                        xtype: 'textfield',
                        id:name,
                        name:name,
                        fieldLabel: label.get("text"),
                        height:20
                    };
                    break;
            }
            fieldset.items.push(item);
        });
        items.push(fieldset);
    });

    //boutons additionnels
    var buttons=[];
    formEl.all("#buttons input[type=button]").each(function(btnElement){
        buttons.push({
            text: btnElement.get("value")
        });
    });
                
    //submit button
    var submitBtn = formEl.one("#buttons input[type=submit]");
    buttons.push(
    {
        text: ((submitBtn) ? submitBtn.get("value") : "Envoyer"),
        handler: function() {
            var form = this.up('form').getForm();

            wfw.Request.Add(
                null,
                form.url,
                object_merge(
                {
                    output:"xml"
                },
                form.getValues()
                    ),
                wfw.Xml.onCheckRequestResult,
                {
                    no_msg    : true,
                    onsuccess : function(obj,xml_doc){
                        var result = wfw.Result.fromXML( Y.Node(xml_doc.documentElement) );
                        MyApp.showResultToMsg(result);
                    },
                    onfailed : function(obj,xml_doc){
                        var result = wfw.Result.fromXML( Y.Node(xml_doc.documentElement) );
                        MyApp.showResultToMsg(result);
                    },
                    onerror   : function(obj){
                        alert("onerror");
                    }
                },
                false
                );
        /*
            if (form.isValid()) {
                form.submit({
                    success: function(form, action) {
                        Ext.Msg.alert('Success', action.result.message);
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
                    }
                });
            } else {
                Ext.Msg.alert( "Error!", "Your form is invalid!" );
            }*/
        }
    });
                
    //formulaire
    var form = Ext.create('Ext.form.Panel', {
        id:formEl.get("id"),
        url:formEl.get("action"),
        frame:true,
        title: false,
        width: "100%",
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 180
        },
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },

        items: items,
        buttons: buttons
    });
                
    formEl.remove();
                
    g.contentPanel.add(form);
}



/*------------------------------------------------------------------------------------------------------------------*/
/**
 * @brief Convertie les formulaires HTML présents en formulaire dynamique ExtJS
 * @remarks Le forumalire HTML original doit être généré via la methode PHP Application.makeFormView()
 **/
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.makeField = function(att)
{
    var wfw = Y.namespace("wfw");
    var g = MyApp.global.Vars;
    
    att = object_merge(
    {
        id:false,
        type:false,
        label:false,
        optional:false
    },att,false);

    if(!att.label)
        att.label = wfw.Navigator.doc.getFiledText(att.id);
    
    if(!att.type)
        att.type = wfw.Navigator.doc.getFiledType(att.type);
    
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

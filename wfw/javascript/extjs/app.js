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
        Y = YUI(wfw_yui_config(wfw_yui_base_path)).use('node', 'event', 'wfw-io','wfw-result','wfw-xml-template', 'wfw-user', 'loading-box', 'io', 'wfw-navigator', 'wfw-request', 'wfw-xml','datatype-xml', function (Y)
        {
            var wfw = Y.namespace("wfw");

            //initialise le viewport
            MyApp.Loading.onInitLayout(Y);
            
            //appel les fonctions d'initialisations
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
Ext.define('MyApp.callback', {callback:{}
});

//loading functions
//ajoutez à ce global les fonctions d'initialisations
Ext.define('MyApp.Loading', {
    statics: {
        onInitLayout: function(Y){},
        callback_list : []
    }
});

Ext.apply(MyApp.Loading, {onInitLayout:function(Y){
}});

MyApp.Loading.addCallback = function(cb)
{
    this.callback_list.push(cb);
};

MyApp.addCallback = function(cb)
{
    MyApp.Loading.addCallback(cb);
};

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


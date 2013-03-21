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
        MyApp.global.Vars.yui = YUI(wfw_yui_config(wfw_yui_base_path)).use('node', 'event', 'wfw-xml-template', 'etape_regionale-region', 'wfw-user', 'loading-box', 'io', 'wfw-navigator', 'wfw-request', 'wfw-xml','datatype-xml', function (Y)
        {
            var wfw = Y.namespace("wfw");
            
            //appel les fonctions d'initialisation
            for(var index in MyApp.Loading.callback_list){
                var func = MyApp.Loading.callback_list[index];
                func(Y);
            }

            //fin de chargement
            if(typeof(Y.LoadingBox)!="undefined")
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
/**
 * @brief Test la connexion de l'utilisateur
 * @param string url  URL de la page
 * */
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.onInitSearchEvent = function(Y)
{
    var wfw = Y.namespace("wfw");

    var searchTextNode = Y.one("#search_str");
    var searchBtnNode = Y.one("#search_btn");
    var searchTypeNode = Y.one("#search_item");
    var searchRegionNode = Y.one("#search_region");
    
    //texte par defaut
    wfw.Style.addClass(searchTextNode,"default_search_string");
    var original_value = searchTextNode.get("value");
    
    //fonction de recherche
    var search = function(){
        var uri = wfw.URI.remakeURI(
            wfw.Navigator.getURI(searchTypeNode.get("value")),
            {
                filter : "true",
                keyword : (wfw.Style.haveClass(searchTextNode,"default_search_string") ? "" : searchTextNode.get("value")),
                catalog : searchRegionNode.get("value")
                /*category : Y.one("#search_category")*/
            }
        );
        window.location = uri;
    }
    
    // bouton rechercher...
    searchBtnNode.on("click",function(e){
           search();
    });
    
    // si clique, efface le champ de recherche
    searchTextNode.on("click",function(e){
        //if(this.get("value") == original_value)
        {
            this.set("value","");
            wfw.Style.removeClass(this,"default_search_string");
        }
    });
    
    // si perte de focus, retablie le texte original
    searchTextNode.on("blur",function(e){
        if(empty(this.get("value"))){
            this.set("value",original_value);
            wfw.Style.addClass(this,"default_search_string");
        }
    });

    // <Enter>
    searchTextNode.on("keypress",function(e){
       if (e.keyCode == 13){
           search();
       }
    });
}

/*------------------------------------------------------------------------------------------------------------------*/
/**
 * @brief Test la connexion de l'utilisateur
 * @param string url  URL de la page
 * */
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.onCheckUserConnection = function(Y)
{
    var wfw = Y.namespace("wfw");

    //connection status change
    var onLoad = function(e)
    {
        Y.one("#connection").hide();
        Y.one("#account").hide();

        wfw.User.onConnectionStatusChange = function(status)
        {
            var status_msg = "Non-Connecté";
            switch(status){
                case "USER_CONNECTED":
                    status_msg = "Connecté";
                    break;
                case "USER_CONNECTION_NOT_EXISTS":
                    break;
                case "USER_CONNECTION_IP_REFUSED":
                    break;
                case "USER_DISCONNECTED":
                    break;
            }
            Y.one("#connection_status").set("text",status_msg);

            //interface
            if(status_msg == "Non-Connecté")
                Y.one("#connection").show();
            else if(status_msg == "Connecté")
                Y.one("#account").show();
        }

        //
        wfw.User.checkConnection();
    };

    //initialise les evenements
    Y.one('window').on('load', onLoad);
}

/*------------------------------------------------------------------------------------------------------------------*/
/**
 * @brief Ouvre une frame dans un dialogue
 * @param string url  URL de la page
 * */
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.createFrameDialog = function(url){
    
    var Y = MyApp.global.Vars.yui;
    var wfw = Y.namespace("wfw");
    var contentHTML="";
    wfw.Request.Add(null, url, null, 
        function(obj){
            switch(obj.status){
                case "wait":
                    // requête en attente d'execution 
                    wfw.puts("requête en attente d'execution ");
                    break;
                case "exec":
                    // requête en cours d'execution 
                    wfw.puts("requête en cours d'execution ");
                    break;
                case 200:
                    // requête executée
                    contentHTML = obj.response;
                    break;
                case 400:
                    alert("Requête indisponible");
                    break;
                default:
                    //autres status...
                    wfw.puts("autres status ("+obj.status+")");
                    break;
            }
        }, null, false);

    var wnd = new Ext.Window({
        title : "iframe",
        width : 650,
        height: 300,
        layout : 'fit',
        header: false,
        border: false,
        closable: false,
        draggable: false,
        y:0,
        /*items : [{xtype : "component", html: contentHTML}],*/
        items : [{
            xtype : "component",
            id    : 'iframe-win',  // Add id
            
            autoEl : {
                tag : "iframe",
                src : url
            }
        }],
        buttons : [
        {
            text    : 'Fermer',
            handler : function(btn,event){
                wnd.close();
            }
        }
        ]
    });
    wnd.on('show',function(){
        wnd.center();
    });
    //wnd.show();
    return wnd;
}

/*------------------------------------------------------------------------------------------------------------------*/
/**
 * @brief Formulaire: Ajouter un avis
 * @param string url  URL de la page
 * */
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.showFormDialog = function(title,form_id,values){

    var Y = MyApp.global.Vars.yui;
    var wfw = Y.namespace("wfw");
}


/*------------------------------------------------------------------------------------------------------------------*/
/**
 * @brief Formulaire: Ajouter un avis
 * @param string url  URL de la page
 * */
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.makeForm = function(form_id,values,onResult){

    var Y = MyApp.global.Vars.yui;
    var wfw = Y.namespace("wfw");
    var i;
    var def = wfw.Navigator.doc;
    var wnd,result,form;
    
    var xmlFomDef = null;
    //obtient la definition du formulaire
    wfw.Request.Add(null, "form_definition.php?page="+form_id, null, 
        function(obj){
            switch(obj.status){
                case "wait":
                    // requête en attente d'execution 
                    wfw.puts("requête en attente d'execution ");
                    break;
                case "exec":
                    // requête en cours d'execution 
                    wfw.puts("requête en cours d'execution ");
                    break;
                case 200:
                    // requête executée
                    xmlFomDef = Y.XML.parse(obj.response);
                    break;
                case 400:
                    alert("Requête indisponible");
                    break;
                default:
                    //autres status...
                    wfw.puts("autres status ("+obj.status+")");
                    break;
            }
        }, null, false);

    if(!xmlFomDef)
        return null;
    
    //initialise la liste des items
    var items=[];
    Y.Node(xmlFomDef).all("data > *").each(function(node){
        var item;
        switch(node.getAttribute("type")){
            case "string":
                item = {
                    xtype: 'textfield',
                    height:20
                };
                break;
            case "integer":
                item = {
                    xtype: 'numberfield',
                    height:20
                };
                break;
            case "text":
                item = {
                    xtype: 'textareafield',
                    grow: true,
                    height:80
                };
                break;
            default:
                item = {
                    xtype: 'textfield',
                    height:20
                };
                break;
        }
        item.name = node.get("tagName");
        item.fieldLabel = node.get("text");
        if(typeof(values)!="undefined" && typeof(values[item.name])!="undefined"){
            item.value = values[item.name];
        }
        items.push(item);
    });
    /**
    if(opt_fields != null){
        var fieldset={
            xtype:'fieldset',
            checkboxToggle:true,
            title: "plus",
            defaultType: 'textfield',
            collapsible: true,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items:[]
        };
        
        for(i=0; i<opt_fields.length; i++){
            var name = opt_fields[i];
            var title = def.getFiledText(name);
            var type = "type";
            var item = {
                xtype: 'textfield',
                id:name,
                name:name,
                fieldLabel: title,
                height:20
            };
            fieldset.items.push(item);
        }
        
        items.push(fieldset);
    }*/
    
    //bouton submit
    var buttons=[];
    buttons.push(
    {
        text: "Envoyer",
        handler: function() {
            var response = null;
            var formObj = this.up('form').getForm();

            wfw.Request.Add(
                null,
                "form.php?page="+form_id+"&output=xml",
                formObj.getValues(), 
                function(obj){
                    switch(obj.status){
                        case "wait":
                            // requête en attente d'execution 
                            wfw.puts("requête en attente d'execution ");
                            break;
                        case "exec":
                            // requête en cours d'execution 
                            wfw.puts("requête en cours d'execution ");
                            break;
                        case 200:
                            // requête executée
                            response = Y.XML.parse(obj.response);
                            break;
                        case 400:
                            alert("Requête indisponible");
                            break;
                        default:
                            //autres status...
                            wfw.puts("autres status ("+obj.status+")");
                            break;
                    }
                }, null, false
            );
//            alert(response);
            
            //OK ?
            if(!response)
                return;
            response = wfw.Xml.nodeToArray(Y.Node(response.documentElement));
            
            //affiche le resultat
            if(result)
                wnd.remove(result);
            var text = response["txt_error"];
            if(typeof(response["txt_message"]) != "undefned")
                text += "<br/>"+response["txt_message"];
            result =  Ext.create('Ext.form.Panel', {
                region: 'north',
                html: text
            });

            wnd.add(result);

            //call back
            if(typeof(onResult) == "function")
                onResult(wnd,response);
            
            //ferme la fenetre
            if(response.one("error").get("text") == "ERR_OK")
                wnd.close();
        }
    });

    //modal window
    wnd = Ext.create('Ext.Window', {
        modal: true,
        frame:true,
        title: false,
        width: 600,
        height: 300,
        layout:'border'
    });
    
    //formulaire
    form =  Ext.create('Ext.form.Panel', {
        region: 'center',
        url:"form.php?page="+form_id+"&output=xml",
        frame:false,
        title: false,
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 180
        },
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },
        renderTo:Ext.Body,
        items: items,
        buttons: buttons
    });
    
    wnd.add(form);
    
    return wnd;
    
}
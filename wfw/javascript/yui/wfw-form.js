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
 * Fonctions utiles aux formulaires
 *
 * @defgroup YUI
 * @{
 */

/**
 * @defgroup WFW-Form
 * @brief Fonctions utile aux formulaires
 *
 * @section depend Dépendences
 * @par
 *   - JS  Dependences: base.js
 *   - YUI Dependences: base, wfw, wfw-request, wfw-uri, wfw-event, wfw-style, wfw-xarg, wfw-document
 *
 *  @{
 */
YUI.add('wfw-form', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class Form
     * @memberof wfw
     * @brief Manipulation des formulaires HTML
     * */
    wfw.Form = {
        /**
         *   @fn void onFormResult(form_name, result, req_obj)
         *   @brief Vérifie et traite le résultat d'une requête de formulaire
         *   @memberof Form

         *   @param form_name [string]  Nom de l'élément <FORM>
         *   @param result    [RESULT]  L'Objet résultat
         *   @param req_obj   [REQUEST] L'Objet requête
        */
        onFormResult: function (form_name, result, req_obj) {

            var title = result.error;
            var msg   = result.error_str;

            //options du dialogue
            var options = object_merge({
                no_msg : false,
                no_result : false,
                show_debug : true
            }, req_obj.user);

            //affiche le msg
            if (typeof wfw.Document != "undefined"){
                var dlg = new wfw.Document.DIALOG_BOX( {
                    title:title,
                    onOK : {
                        buttonText : "Fermer"
                    },
                    onPrint : function(){
                        this.print(msg);

                        //affiche les informations de deboguage
                        if(options.show_debug){
                            var parse = "";

                            //infos
                            parse =  "<fieldset><legend>Informations sur la requête</legend>"+
                            '<div class="wfw_edit_field"><span>URI</span><span>'+req_obj.url+'</span></div>' +
                            "</fieldset>";
                            this.print(Y.Node.create(node));

                            //liste les arguments en sortie
                            parse = "";
                            for (var i in result)
                            {
                                //crée l'élément dialogue
                                parse += '<div class="wfw_edit_field"><span>'+i+'</span><span>'+result[i]+'</span></div>';
                            }
                            if(!empty(parse))
                                this.print(Y.Node.create("<fieldset><legend>Arguments en sortie</legend>"+parse+"</fieldset>"));

                            //liste les arguments en entrée
                            parse = "";
                            for (var i in req_obj.args)
                            {
                                //crée l'élément dialogue
                                parse += '<div class="wfw_edit_field"><span>'+i+'</span><span>'+req_obj.args[i]+'</span></div>';
                            }
                            if(!empty(parse))
                                this.print(Y.Node.create("<fieldset><legend>Arguments en entrée</legend>"+parse+"</fieldset>"));
                        }
                        wfw.Document.printOK(this,"wfw_ext_dialog_content",options);
                    }
                });
                wfw.Document.insertDialog(dlg,null,"visible");
            }
            else
                wfw.puts(title+"\n"+msg);
        },
            
        /**
         *   @fn void onFormResultDebug(form_name, result, req_obj)
         *   @brief Vérifie et traite le résultat d'une requête de formulaire (DEBUG version)
         *   @memberof Form

         *   @param form_name [string]  Nom de l'élément <FORM>
         *   @param result    [RESULT]  L'Objet résultat
         *   @param req_obj   [REQUEST] L'Objet requête
         **/
        onFormResultDebug: function (form_name, result, req_obj) {
                
            //par défaut, affiche les messages dans la console
            var func = wfw.puts;
            var inst = wfw;
                
            //si possible, affiche les messages dans une boite de dialogue
            if (typeof (wfw.Document) != "undefined") {
                func = wfw.Document.print;
                inst = wfw.Document;
            }
                
            //liste les arguments de la requête
            if (typeof (req_obj) != "undefined")
            {
                for (var i in req_obj.args)
                    func.call(inst,i+": " + req_obj.args[i]);
                func.call(inst,"-------------------------------");
            }
                
            //liste les arguments du resultat
            for (var i in result)
                func.call(inst,i+": " + result[i]);
                
            //affiche l'url
            if (typeof (req_obj) != "undefined")
            {
                func.call(inst,"-------------------------------");
                func.call(inst,"[" + req_obj.url + "]");
            }
            func.call(inst,"-------------------------------");
        },
            
        /**
         *   @fn void onFormResultDebug(form_name, result, req_obj)
         *   @brief Initialise un formulaire depuis un résulat de requête
         *   @memberof Form

         *   @param name     [string/Node]   Identifiant de la requête (voir wfw.request.Add())
         *   @param formId   [string]        Identifiant de l'élément FORM
         *   @param args     [object]        Tableau associatif des champs retourné par une requête XARG

         *   @remarks initFromArg() affiche les messages d'erreurs avec la fonction onFormResult()
         *   @return [bool] true en cas de succès, sinon false
         */
        initFromArg: function (name, formId, args) {
            //obtient l'element form
            var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
            if (!form) {
                wfw.puts("wfw.form.initFromArg: can't get form " + formId);
                return false;
            }

            //charge les champs
            if (args != null) {
                //alert("initFromElement: charge les champs");
                this.set_fields(formId, args);
            }

            //initialise les champs
            this.init_fields(formId);

            //rappel le resultat de la requête precedente
            if (typeof (args.result) != "undefined")
                this.onFormResult(formId, args);

            return true;
        },

        /**
         *  @fn bool initFromURI(name, formId, callback)
         *  @brief Initialise un formulaire depuis l'URL
         *  @memberof Form
            
         *  @param name     [string]   Identifiant de la requête (voir wfw.request.Add())
         *  @param formId   [string]   Identifiant de l'élément FORM
         *  @param callback [function] Optionnel, fonction de rappel (voir remarques)

         *  @remarks Format du callback: void callback(string form_name, object result, [object req_obj])
         *  @remarks callback reçois en argument le résultat de la requête au format XARG (voir documentation)
         *  @remarks initFromURI affiche les messages d'erreurs si l'argument '_xarg_' est présent (wfw.stdEvent.onFormResult)
         
         * @return true en cas de succès, sinon false
         */
        initFromURI: function (name, formId, callback) {
            //obtient l'element form
            var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
            if (!form) {
                wfw.puts("wfw.form.initFromURI(): can't get form " + formId);
                return false;
            }
            if (typeof (callback) != "function")
                callback = this.onFormResult;

            //initialise les elements du formulaire
            //        var element_list = new Array();
            var uri = wfw.URI.cut( Y.Node.one("window").get("location.href") );
            //        objAlertMembers(uri);
            var url_element_list = ((uri != null && !empty(uri.query)) ? wfw.URI.query_to_object(uri.query, true) : null);
            //        objAlertMembers(url_element_list);

            //charge les champs
            if (url_element_list != null) {
                //alert("initFromElement: charge les champs");
                this.set_fields(formId, url_element_list);
            }

            //initialise les champs
            this.init_fields(formId);

            //rappel le resultat de la requete precedente ('_xarg_')
            if ((url_element_list != null) && (typeof (url_element_list['_xarg_']) == 'string')) {
                // reponse de requête passée dans '_xarg_' ?
                var result = x_request_arguments_parse(url_element_list['_xarg_'], false);
                if (typeof (result.wfw_form_name) && (result.wfw_form_name == name))
                {
                    var req_obj = new wfw.Request.REQUEST({
                        args:object_pop(url_element_list,["_xarg_"])
                    });
                    callback(result.wfw_form_name, result, req_obj);
                }
            }
            return true;
        },
        /**
         *  @fn bool initFromFields(name, formId, fields)
         *  @brief Initialise un formulaire depuis un tableau de données
         *  @memberof Form
            
         *  @param name     [string]   Identifiant de la requête (voir wfw.Request.Add())
         *  @param formId   [string]   Identifiant de l'élément FORM
         *  @param fields   [object]   Tableau associatif des données
         
         *  @return false en cas d'échec, true en cas de succès
         */
        initFromFields: function (name, formId, fields) {
            //obtient l'element form
            var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
            if (!form) {
                wfw.puts("wfw.form.initFromFields(): can't get form " + formId);
                return false;
            }

            //charge les champs
            if (fields != null) {
                //alert("initFromElement: charge les champs");
                this.set_fields(formId, fields);
            }

            //initialise les champs
            this.init_fields(formId);

            return true;
        },

        /**
         *  @fn void init_fields(formId)
         *  @brief Initialise les champs d'un formulaire
         *  @memberof Form
            
         *  @param formId [string] Identifiant de l'élément FORM
         *  @remarks Pour connaitre les différent éléments spéciaux (voir formulaire)
         */
        init_fields: function (formId) {
            //obtient l'element form
            var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
            if (!form)
                return false;

            //scan les elements
            var enumNode = form.all("*");
            enumNode.each(
                function (node) {
                    if (node.nodeType == XML_ELEMENT_NODE) {
                        //
                        // multilangage input
                        //
                        var data_type = node.get('wfw_lang');
                        if (data_type != null)
                            wfw.Language.attachToInput(node.getDOMNode(), strexplode(data_type,",",true), {
                                keyChange : true
                            });

                        //
                        // verification de données ?
                        //
                        var data_type = node.get('wfw_datatype');
                        if (data_type != null)
                            wfw.Event.ApplyTo(node, "wfw_datatype_check");

                        //
                        // liste de champs ? (FieldList)
                        //
                        var wfw_form_element = node.get('wfw_fieldlist');
                        if (wfw_form_element != null && (typeof wfw.FieldList != "undefined"))
                            wfw.FieldList.initElement(node.getDOMNode());

                        //
                        // barre de champs ? (FieldBar)
                        //
                        var wfw_fieldbar_element = node.get('wfw_fieldbar');
                        if (wfw_fieldbar_element != null && (typeof wfw.FieldBar != "undefined"))
                            wfw.FieldBar.initElement(node.getDOMNode());

                        //
                        // liste de données ? (DataList)
                        //
                        var wfw_datalist = node.get('wfw_datalist');
                        if (wfw_datalist != null && (typeof wfw.DataList != "undefined")) {
                            switch (node.tagName.toLowerCase()) {
                                case "input":
                                    wfw.DataList.attachToInput(wfw_datalist, node.getDOMNode());
                                    break;
                                case "select":
                                    wfw.DataList.attachToSelect(wfw_datalist, node.getDOMNode());
                                    break;
                            }
                        }

                        //
                        // module requis ? (Navigator)
                        //
                        var wfw_require_module = node.get('wfw_require_module');
                        if (wfw_require_module != null && (typeof wfw.Navigator != "undefined")) {
                            var module = wfw.Navigator.getModule(wfw_require_module);
                            switch (node.get("tagName").toLowerCase()) {
                                /*case "input":
                                    node.disabled = (module==null) ? "disabled" : "";
                                    wfw.Bubble.insertTextToElement(node,"Requière le module "+wfw_require_module);
                                    break;*/ 
                                default:
                                    if (module == null)
                                        wfw.Style.addClass(node, "wfw_hidden");
                                    else
                                        wfw.Style.removeClass(node, "wfw_hidden");
                                    break;
                            }
                        }

                        //
                        // active/desactive un contenu
                        //
                        var wfw_enabled = node.get('wfw_enabled');
                        if (wfw_enabled != null && (typeof wfw.Utils != "undefined")) {
                            //[change]
                            node.on("click",function(e){
                                var enabled_element_id = this.get('wfw_enabled');
                                if(empty(enabled_element_id))
                                    return;
                                var enabled_element_node = Y.Node.one('#'+enabled_element_id);
                                if(enabled_element_node!=null)
                                    wfw.Utils.enabledContent(enabled_element_node,this.get("checked"));
                            },null);

                            //premiere initialisation
                            wfw.Utils.enabledContent(Y.Node.one('#'+wfw_enabled),node.get("checked"));
                        }
                    }
                }
                );
        },
            
        /**
         *  @fn void set_fields(formId, fields, options)
         *  @brief Initialise les champs d'un formulaire
         *  @memberof Form
            
         *  @param formId [string] Identifiant de l'élément FORM
         *  @param fields [object] Tableau associatif des champs à initialiser
         *  @remarks Seuls les champs donnés sont initialisés, les autres champs du formulaire restent inchangés
         */
        set_fields: function (formId, fields,options) {
            //obtient l'element form
            var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
            if (!form)
                return false;

            //options
            options = object_merge({
                lang : null
            },options,false);

            //
            var datalist_list = new Array();

            //scan les elements
            var enumNode = form.all("*");
            enumNode.each(
                function (node) {
                    if (node.get("nodeType") == XML_ELEMENT_NODE) {
                        var element_name;

                        // element name ?
                        if (empty(element_name = node.getAttribute('name')))
                            return; //continue
                        //element_name = element_name.toLowerCase();
                        var field_value = ((fields != null) && (typeof fields[element_name] != "undefined")) ? ""+fields[element_name] : null;//assume le type string

                        //par type...
                        switch (node.get("tagName").toLowerCase()) {
                            case 'input':
                                switch (node.get('type').toLowerCase()) {
                                    case 'button': /* texte des boutons (lecture seule) */
                                    case 'hidden':
                                    case 'text':
                                        // importe la valeur, si existante
                                        if (field_value != null){
                                            //charge le texte dans un langage specifique ?
                                            var text_lang = (options.lang!=null) ? wfw.Language.setInputString(node.getDOMNode(),field_value,options.lang) : false;
                                            if(!text_lang)
                                                node.set('value', field_value);
                                        }
                                        break;
                                    case 'checkbox':
                                        // importe la valeur, si existante
                                        if (field_value == 'on' || field_value == 'true') {
                                            node.set('checked', 'checked');
                                            node.set('value', 'on');
                                        }
                                        else {
                                            node.removeAttribute('checked');
                                        }
                                        break;
                                    case 'radio':
                                        // importe la valeur, si existante
                                        if (field_value == node.get('value')) {
                                            node.set('checked', 'checked');
                                        }
                                        break;
                                }
                                break;
                            case 'select':
                                // importe la valeur, si existante
                                if (field_value != null) {
                                    for (var i = 0; i < node.options.length; i++)
                                        if (node.options[i].value == field_value)
                                            node.selectedIndex = i;
                                }
                                break;
                            case 'textarea':
                                // importe la valeur, si existante
                                if (field_value != null)
                                {
                                    node.set("text", field_value);
                                }
                                break;
                            //                     
                            //en lecture seule...                     
                            //                     
                            case 'form':
                            case 'html':
                            case 'body':
                                break;
                                    
                            default:
                                // importe la valeur, si existante
                                if (field_value != null)
                                    node.set("text", field_value);
                                break;
                        }
                    }
                }
                );
        },
            
        /**
         *  @fn object get_fields(formId, options)
         *  @brief Obtient la liste des champs d'un formulaire
         *  @memberof Form

         *  @param formId  [string] Identifiant de l'élément FORM
         *  @param options [object] Optionnel, Arguments additionnels (voir options)
         
         *  @return [object] Tableau associatif des champs trouvés. Vide, si aucun élément n'est trouvé
         *  @remarks Les input de type "radio" sont listés avec une valeur vide si aucun choix n'est fait

         *  @par Options
         *  @param selectByAtt   = "name"   [string] Attribut utilisé pour séléctionner les éléments
         *  @param getStaticNode = "false"  [bool]   Si true, ajoute les éléments non éditables à la liste (div, span, p, etc...)
         *  @param lang          = null     [string] Langage à utiliser lors de la lecture des textes (wfw.Language)
         */
        get_fields: function (formId, options) {
            var fields = new Object();

            //options
            options = object_merge({
                selectByAtt:"name",
                getStaticNode:false,
                lang : null
            },options,false);

            //obtient l'element
            var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
            if (!form)
                return false;

            //charge les champs des valeurs trouvees
            var enumNode = form.all("*");
            enumNode.each(
                function (node) {
                    if (node.get("nodeType") == XML_ELEMENT_NODE) {
                        var element_name;

                        // element name ?
                        if ( empty(element_name = node.getAttribute(options.selectByAtt)) )
                            return; //continue
                        element_name = element_name.toLowerCase();

                        // initialise le champs
                        //fields[element_name] = ""; // ne pas mettre à zero pour éviter que les champs "radio" ne se supprimes lors de l'iteration

                        //par type...
                        switch (node.get("tagName").toLowerCase()) {
                            case 'input':
                                switch (node.get('type').toLowerCase()) {
                                    case 'hidden':
                                    case 'text':
                                    case 'password':
                                        //charge le texte dans un langage specifique ?
                                        var text_lang = (options.lang!=null) ? wfw.Language.getInputString(node,options.lang) : null;
                                        if(text_lang!=null)
                                            fields[element_name] = text_lang;
                                        else
                                            fields[element_name] = node.get('value');
                                        break;
                                    case 'radio':
                                        if (node.get("checked") == true)
                                            fields[element_name] = node.get('value');
                                        //ajoute une valeur vide si aucun choix n'est fait
                                        //( cette valeur vide permet à get_fields d'identifier l'element meme si aucun champs n'est choisit )
                                        else if(typeof(fields[element_name])=="undefined")
                                            fields[element_name] = "";
                                        break;
                                    case 'checkbox':
                                        fields[element_name] = (node.get("checked") ? "on" : "off");
                                        break;
                                    case 'file':
                                        wfw.puts("wfw.form.get_fields: file input not supported!");
                                        break;
                                }
                                break;
                            case 'select':
                                fields[element_name] = node.get('value');
                                break;
                            case 'textarea':
                                fields[element_name] = node.get('text'); //valeur statique
                                //fields[element_name] = node.get('value'); //valeur dynamique
                                break;
                            //                     
                            //en lecture seule...                     
                            //                     
                            default:
                                if(options.getStaticNode)
                                    fields[element_name] = node.get("text");
                                return;
                        }
                    }
                }
                );
            return fields;
        },
        /**
         *  @fn object get_elements(formId, options)
         *  @brief Obtient les champs d'un formulaire
         *  @memberof Form

         *  @param formId  [string] Identifiant de l'élément FORM
         *  @param options [object] Optionnel, Arguments additionnels (voir Options)
         *  @return [object] Tableau associatif "nom/noeud" des champs trouvés. Vide, si aucun élément n'est trouvé
         
         * @par Options
         *  @param selectByAtt   = "name"   [string] Attribut servant à identifier l'élément
         *  @param getStaticNode = "false"  [bool]   Accepte les éléments non standard à un formulaire (div, span, p, etc...)
         */
        get_elements: function (formId, options) {
            var fields = new Object();

            //options
            var att = {
                selectByAtt:"name",
                getStaticNode:false,
                forceAttLowerCase:false
            };
            if(typeof(options)!="undefined")
                att = object_merge(att,options);

            //obtient l'element
            var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
            if (!form)
                return false;

            //liste les éléments trouvés
            var enumNode = form.all("*");
            enumNode.each(
                function (node) {
                    if (node.get("nodeType") == XML_ELEMENT_NODE) {
                        var element_name;

                        // element name ?
                        if ( empty(element_name = node.getAttribute(att.selectByAtt)) ) // custom (ex: 'name' in DIV)
                            return; //continue
                        
                        if(att.forceAttLowerCase)
                            element_name = element_name.toLowerCase();
                            
                        switch (node.get("tagName").toLowerCase()) {
                            case 'input':
                                switch (node.get('type').toLowerCase()) {
                                    case 'hidden':
                                    case 'text':
                                    case 'password':
                                    case 'checkbox':
                                    case 'file':
                                        fields[element_name] = node;
                                    case 'radio':
                                        if (node.get("checked") == true)
                                            fields[element_name] = node;
                                        break;
                                }
                                break;
                            case 'select':
                            case 'textarea':
                                fields[element_name] = node;
                                break;
                            default:
                                if(att.getStaticNode)
                                    fields[element_name] = node;
                                return; // continue l'enumeration
                        }
                    }
                }
                );
            return fields;
        },
            
        /**
         *  @fn bool send(formId, callback, uri, target)
         *  @brief Envoie un formulaire
         *  @memberof Form

         *  @param formId    [string]   Identifiant de l'élément FORM
         *  @param callback  [function] Obselete
         *  @param uri       [string]   Optionnel, URI
         *  @param target    [string]   Optionnel, nom du document cible
         
         *  @return [bool] false en cas d'échec. true en cas de succès.
         *  @remarks Provoque l'envoie du formulaire par le navigateur
         */
        send: function (formId, callback, uri, target) {

            //dynamique?
            if (typeof (callback) != "function")
                callback = this.onFormResult;

            //obtient la form
            var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
            if (form == null)
                return false;

            var old_action = form.get("action");
            var old_target = form.get("target");

            if (typeof (uri) == "string")
                form.set("action", uri);

            if (typeof (target) == "string")
                form.set("target", target);

            form.submit();

            form.set("action", old_action);
            form.set("target", old_target);

            return true;
        },
        /**
         * @fn bool sendReq(formId, uri, async, callback, param)
         * @brief Envoie un formulaire par requête
         * @memberof Form

         * @param formId   [string]   Identifiant de l'élément FORM
         * @param uri      [string]   Optionnel, URI
         * @param async    [bool]     Optionnel, asynchrone ?
         * @param callbcak [function] Optionnel, callback passé à wfw.request.Add Si non spécifié 'onFormResult()' est utilisé
         * @param param    [object]   Optionnel, paramètres passés au callback
         
         * @remarks Initilise une nouvelle requête avec les champs du formulaire
         * @remarks Les éléments de type input[file] ne sont pas supportés
         * @return [bool] false en cas d'échec. true en cas de succès.
         */
        sendReq: function (formId, uri, async, callback, param) {

            //obtient la form
            var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
            if (form == null)
                return false;

            //callback   
            if (typeof (callback) != "function")
                callback = wfw.XArg.onCheckRequestResult_XARG;

            //uri   
            if (typeof (uri) != "string")
                uri = form.get("action");

            //param   
            if (typeof (param) != "object")
                param = null;

            wfw.Request.Add(formId, uri, this.get_fields(formId), callback, param, async);

            return true;
        },
        /**
         * @fn bool sendFrame(formId, uri, callback, param, options)
         * @brief Envoie un formulaire par iframe
         * @memberof Form

         * @param formId   [string]   Identifiant de l'élément FORM
         * @param uri      [string]   Optionnel, URI
         * @param callback [function] Optionnel, callback recevant la réponse, callback(responseText,param)
         * @param param    [object]   Optionnel, paramètres passés au callback
         * @param options  [object]   Optionnel, Arguments additionnels (voir options)

         * @remarks Initialise une IFrame dynamique pour recevoir le contenu de la requete. La reponse est ensuite passé au callback puis l'iframe est supprimée
           
         * @return [bool] false en cas d'échec. true en cas de succès.
         * @par Options
         * @param add_fileds   = null   [object] Tableau associatif des paramètres supplementaire à ajouter
         * @param hiddenFrame  = true   [bool]   Cache l'élément iframe lors de sa création
         */
        sendFrame: function (formId, uri, callback, param, options) {
            //merge les options
            options = object_merge({
                add_fileds : null,
                hiddenFrame: true
            },options,false);

            //obtient la form
            var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
            if (form == null)
                return false;

            //crée l'iframe
            var frame_id = uniqid();
            var frame = Y.Node.create('<iframe>');
            frame.set("id", frame_id);
            frame.set("name", frame_id);
            frame.set("width", "400px");
            frame.set("height", "400px");
            frame.set("type", "text/plain");
            if(options.hiddenFrame)
                wfw.Style.addClass(frame,"wfw_hidden");
            frame.callback = callback;
            frame.param    = param;

            //pour un fonctionnement normal : insert avant onLoad (safari), apres initialisation (IE)
            //objInsertNode(frame, document.body, null, INSERTNODE_END);
            Y.Node.one("body").append(frame);

            //[onLoad]
            frame.on("load", function (e) {
                //ok, appel le callback
                var args={
                    node        : this,
                    window      : this.get("contentWindow"),
                    document    : this.get("contentWindow").get("document"),
                    htmlContent : this.get("contentWindow").get("document").get("body").get("text"),
                    textContent : this.get("contentWindow").get("document").get("body").get("innerHTML")
                };
                this.callback(args.textContent, this.param, args);
            //this.remove(); //opera bug
            });

            //ajoute les parametres additionnels
            if(options.add_fields != null){
                var elements = wfw.Form.get_elements(formId,{
                    getStaticNode:true
                });
                var input;
                for(var field_name in options.add_fields){
                    //obtient l'input si il existe
                    input = (typeof(elements[field_name])!="undefined") ? elements[field_name] : null;
                    //cree l'input si il n'existe pas
                    if(input == null && (input = Y.Node.create('<input>'))!=null)
                        //objInsertNode(input, form, null, INSERTNODE_END);
                        form.append(input);
                    //pas d'input ?
                    if(input == null)
                        continue;
                    //initialise l'input
                    input.set("type", "text");
                    input.set("name", field_name);
                    input.set("value", options.add_fields[field_name]);
                }
            }

            //prepare puis envoie le formulaire
            var old_action = form.get("action");
            var old_target = form.get("target");

            if (typeof(uri) == "string")
                form.set("action", uri);

            form.set("target", frame_id);

            form.submit();

            form.set("action", old_action);
            form.set("target", old_target);

            return true;
        }
    }
}, '1.0', {
    requires:['base', 'wfw','wfw-request','wfw-xml','wfw-uri','wfw-event','wfw-style','wfw-xarg']
});


/** @} */ // end of group Form
/** @} */ // end of group YUI
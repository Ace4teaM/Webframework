/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    [16-10-2012] Formulaires HTML

    JS  Dependences: base.js
    YUI Dependences: base, wfw, request, uri, event, style, xarg, document

    Revisions:
        [16-10-2012] Implementation
*/

YUI.add('form', function (Y, NAME) {
	Y.Form = {
            /*
                Vérifie et traite le résultat d'une requête de formulaire
                Arguments:
                    [string]          form_name : Nom de l'élément <FORM>
                    [Result.RESULT]   result    : L'Objet résultat
                    [Request.REQUEST] req_obj   : L'Objet requête
                Retourne:
                    [void]
             **/
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
                if (typeof Y.Document != "undefined"){
                    var dlg = $new(Y.Document.DIALOG_BOX, {
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
                            Y.Document.printOK(this,"wfw_ext_dialog_content",options);
                        }
                    });
                    Y.Document.insertDialog(dlg,null,"visible");
                }
                else
                    Y.WFW.puts(title+"\n"+msg);
            },
            
            /*
                Vérifie et traite le résultat d'une requête de formulaire (DEBUG version)
                Paramètres:
                    [string]          form_name : Nom de l'élément <FORM>
                    [Result.RESULT]   result    : L'Objet résultat
                    [Request.REQUEST] req_obj   : L'Objet requête
                Retourne:
                    [void]
             **/
            onFormResultDebug: function (form_name, result, req_obj) {
                
                //par défaut, affiche les messages dans la console
                var func = Y.WFW.puts;
                var inst = Y.WFW;
                
                //si possible, affiche les messages dans une boite de dialogue
                if (typeof (Y.Document) != "undefined") {
                    func = Y.Document.print;
                    inst = Y.Document;
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
            
            /*
            Initialise un formulaire depuis un résulat de requête
            Arguments:
                [string/YUI.Node]   name     : Identifiant de la requête (voir wfw.request.Add())
                [string]            formId   : Identifiant de l'élément FORM
                [object]            args     : Tableau associatif des champs retourné par une requête XARG
            Remarques:
                initFromArg() affiche les messages d'erreurs avec la fonction onFormResult()
            Retourne:
                [bool] true en cas de succès, sinon false
            */
            initFromArg: function (name, formId, args) {
                //obtient l'element form
                var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
                if (!form) {
                    Y.WFW.puts("wfw.form.initFromArg: can't get form " + formId);
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
            /*
            Initialise un formulaire depuis l'URL
            Arguments:
            [string]   name     : Identifiant de la requête (voir wfw.request.Add())
            [string]   formId   : Identifiant de l'élément FORM
            [function] callback : Optionnel, fonction de rappel (voir remarques)
            Remarques:
            Format du callback: void callback(string form_name, object result, [object req_obj])
            callback reçois en argument le résultat de la requête au format XARG (voir documentation)
            initFromURI affiche les messages d'erreurs si l'argument '_xarg_' est présent (wfw.stdEvent.onFormResult)
            Retourne:
            true en cas de succès, sinon false
            */
            initFromURI: function (name, formId, callback) {
                //obtient l'element form
                var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
                if (!form) {
                    Y.WFW.puts("wfw.form.initFromURI(): can't get form " + formId);
                    return false;
                }
                if (typeof (callback) != "function")
                    callback = this.onFormResult;

                //initialise les elements du formulaire
                //        var element_list = new Array();
                var uri = Y.URI.cut( Y.Node.one("window").get("location.href") );
                //        objAlertMembers(uri);
                var url_element_list = ((uri != null && !empty(uri.query)) ? Y.URI.query_to_object(uri.query, true) : null);
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
                        var req_obj = $new(Y.Request.REQUEST,{
                            args:object_pop(url_element_list,["_xarg_"])
                        });
                        callback(result.wfw_form_name, result, req_obj);
                    }
                }
                return true;
            },
            /*
            Initialise un formulaire depuis un tableau de données
            Arguments:
            [string]   name     : Identifiant de la requête (voir wfw.request.Add())
            [string]   formId   : Identifiant de l'élément FORM
            [object]   fields   : tableau associatif des données
            Retourne:
            false en cas d'échec, true en cas de succès
            */
            initFromFields: function (name, formId, fields) {
                //obtient l'element form
                var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
                if (!form) {
                    Y.WFW.puts("wfw.form.initFromFields(): can't get form " + formId);
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
            
            /*
            Initialise les champs d'un formulaire
            Arguments:
            [string] formId : Identifiant de l'élément FORM
            Remarques :
            Pour connaitre les different éléments spéciaux (voir formulaire)
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
                        if (node.nodeType == ELEMENT_NODE) {
                            //
                            // multilangage input
                            //
                            var data_type = node.get('wfw_lang');
                            if (data_type != null)
                                Y.Language.attachToInput(node.getDOMNode(), strexplode(data_type,",",true), {keyChange : true});

                            //
                            // verification de données ?
                            //
                            var data_type = node.get('wfw_datatype');
                            if (data_type != null)
                                Y.Event.ApplyTo(node, "wfw_datatype_check");

                            //
                            // liste de champs ? (FieldList)
                            //
                            var wfw_form_element = node.get('wfw_fieldlist');
                            if (wfw_form_element != null && (typeof Y.FieldList != "undefined"))
                                Y.FieldList.initElement(node.getDOMNode());

                            //
                            // barre de champs ? (FieldBar)
                            //
                            var wfw_fieldbar_element = node.get('wfw_fieldbar');
                            if (wfw_fieldbar_element != null && (typeof Y.FieldBar != "undefined"))
                                Y.FieldBar.initElement(node.getDOMNode());

                            //
                            // liste de données ? (DataList)
                            //
                            var wfw_datalist = node.get('wfw_datalist');
                            if (wfw_datalist != null && (typeof Y.DataList != "undefined")) {
                                switch (node.tagName.toLowerCase()) {
                                    case "input":
                                        Y.DataList.attachToInput(wfw_datalist, node.getDOMNode());
                                        break;
                                    case "select":
                                        Y.DataList.attachToSelect(wfw_datalist, node.getDOMNode());
                                        break;
                                }
                            }

                            //
                            // module requis ? (Navigator)
                            //
                            var wfw_require_module = node.get('wfw_require_module');
                            if (wfw_require_module != null && (typeof Y.Navigator != "undefined")) {
                                var module = Y.Navigator.getModule(wfw_require_module);
                                switch (node.get("tagName").toLowerCase()) {
                                    /*case "input":
                                    node.disabled = (module==null) ? "disabled" : "";
                                    Y.Bubble.insertTextToElement(node,"Requière le module "+wfw_require_module);
                                    break;*/ 
                                    default:
                                        if (module == null)
                                            Y.Style.addClass(node, "wfw_hidden");
                                        else
                                            Y.Style.removeClass(node, "wfw_hidden");
                                        break;
                                }
                            }

                            //
                            // active/desactive un contenu
                            //
                            var wfw_enabled = node.get('wfw_enabled');
                            if (wfw_enabled != null && (typeof Y.Utils != "undefined")) {
                                //[change]
                                node.on("click",function(e){
                                    var enabled_element_id = this.get('wfw_enabled');
                                    if(empty(enabled_element_id))
                                        return;
                                    var enabled_element_node = Y.Node.one('#'+enabled_element_id);
                                    if(enabled_element_node!=null)
                                        Y.Utils.enabledContent(enabled_element_node,this.get("checked"));
                                },null);

                                //premiere initialisation
                                Y.Utils.enabledContent(Y.Node.one('#'+wfw_enabled),node.get("checked"));
                            }
                        }
                    }
                );
            },
            
            /*
            Initialise les champs d'un formulaire
            Arguments:
                [string] formId : Identifiant de l'élément FORM
                [object] fields : Tableau associatif des champs à initialiser
            Remarques:
                Seuls les champs donnés sont initialisés, les autres champs du formulaire restent inchangés
            Options:
                [...A Implenter...]
            Retourne:
                [void]
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
                        if (node.get("nodeType") == ELEMENT_NODE) {
                            var element_name;

                            // element name ?
                            if (empty(element_name = node.get('name')))
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
                                                var text_lang = (options.lang!=null) ? Y.Language.setInputString(node.getDOMNode(),field_value,options.lang) : false;
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
            
            /*
            Obtient la liste des champs d'un formulaire
            Arguments:
                [string] formId  : Identifiant de l'élément FORM
                [object] options : Optionnel, Arguments additionnels (voir options)
            Retourne:
                [object] Tableau associatif des champs trouvés. Vide, si aucun élément n'est trouvé
            Remarques:
                Les input de type "radio" sont listés avec une valeur vide si aucun choix n'est fait
            Options:
                [string] selectByAtt   = "name"   : Attribut utilisé pour séléctionner les éléments
                [bool]   getStaticNode = "false"  : Si true, ajoute les éléments non éditables à la liste (div, span, p, etc...)
                [string] lang          = null     : Langage à utiliser lors de la lecture des textes (Y.Language)
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
                        if (node.get("nodeType") == ELEMENT_NODE) {
                            var element_name;

                            // element name ?
                            if ( empty(element_name = node.get(options.selectByAtt)) //standard (ex: 'name' in INPUT)
                                    && empty(element_name = node.getAttribute(options.selectByAtt)) ) // custom (ex: 'name' in DIV)
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
                                            var text_lang = (options.lang!=null) ? Y.Language.getInputString(node,options.lang) : null;
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
                                            Y.WFW.puts("wfw.form.get_fields: file input not supported!");
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
            /*
            Obtient les champs d'un formulaire
            Arguments:
                [string] formId  : Identifiant de l'élément FORM
                [object] options : Optionnel, Arguments additionnels (voir Options)
            Retourne:
                [object] Tableau associatif "nom/noeud" des champs trouvés. Vide, si aucun élément n'est trouvé
            Options:
                [string] selectByAtt   = "name"   : Attribut servant à identifier l'élément.
                [bool]   getStaticNode = "false"  : Accepte les éléments non standard à un formulaire (div, span, p, etc...)
            */
            get_elements: function (formId, options) {
                var fields = new Object();

                //options
                var att = {
                    selectByAtt:"name",
                    getStaticNode:false
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
                        if (node.get("nodeType") == ELEMENT_NODE) {
                            var element_name;

                            // element name ?
                            if ( empty(element_name = node.get(att.selectByAtt)) //standard (ex: 'name' in INPUT)
                                    && empty(element_name = node.getAttribute(att.selectByAtt)) ) // custom (ex: 'name' in DIV)
                                return; //continue
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
            
            /*
            Envoie un formulaire
            Arguments:
            [string]   formId    : Identifiant de l'élément FORM
            [function] [callback]: Obselete
            [string]   [uri]     : Optionnel, URI
            [string]   [target]  : Optionnel, nom du document cible
            Retourne:
            [bool] false en cas d'échec. true en cas de succès.
            Remarques:
            send, Provoque l'envoie du formulaire par le navigateur
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
            /*
            Envoie un formulaire par requête
            Arguments:
                [string]   formId    : Identifiant de l'élément FORM
                [string]   [uri]     : Optionnel, URI
                [bool]     [async]   : Optionnel, asynchrone ?
                [function] [callback]: Optionnel, callback passé à wfw.request.Add Si non spécifié 'onFormResult()' est utilisé
                [object]   [param]   : Optionnel, paramètres passés au callback
            Remarques:
                sendReq, Initilise une nouvelle requête avec les champs du formulaire
                Les éléments de type input[file] ne sont pas supportés
            Retourne:
                [bool] false en cas d'échec. true en cas de succès.
            */
            sendReq: function (formId, uri, async, callback, param) {

                //obtient la form
                var form = (typeof(formId)=="string" ? Y.Node.one("#"+formId) : formId);
                if (form == null)
                    return false;

                //callback   
                if (typeof (callback) != "function")
                    callback = Y.XArg.onCheckRequestResult_XARG;

                //uri   
                if (typeof (uri) != "string")
                    uri = form.get("action");

                //param   
                if (typeof (param) != "object")
                    param = null;

                Y.Request.Add(formId, uri, this.get_fields(formId), callback, param, async);

                return true;
            },
            /*
            Envoie un formulaire par iframe
            Arguments:
                [string]   formId    : Identifiant de l'élément FORM
                [string]   [uri]     : Optionnel, URI
                [function] [callback]: Optionnel, callback recevant la réponse, callback(responseText,param)
                [object]   [param]   : Optionnel, paramètres passés au callback
                [object] options : Optionnel, Arguments additionnels (voir options)
            Remarques:
                sendFrame, initialise une IFrame dynamique pour recevoir le contenu de la requete. La reponse est ensuite passé au callback puis l'iframe est supprimée
                
            Retourne:
                [bool] false en cas d'échec. true en cas de succès.
            Options:
                [object] add_fileds   = null   : Tableau associatif des paramètres supplementaire à ajouter
                [bool]   hiddenFrame  = true   : Cache l'élément iframe lors de sa création
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
                    Y.Style.addClass(frame,"wfw_hidden");
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
                    var elements = Y.Form.get_elements(formId,{ getStaticNode:true });
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
      requires:['base', 'wfw','request','uri','event','style','xarg']
});

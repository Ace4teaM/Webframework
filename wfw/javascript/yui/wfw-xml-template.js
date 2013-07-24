/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        Author: AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    XML Site file

    JS  Dependences: base.js
    YUI Dependences: base, node, wfw, wfw-http, wfw-request

    Implementation: [19-10-2012]
*/

YUI.add('wfw-xml-template', function (Y) {
    var wfw = Y.namespace('wfw');

    /**
     * @class Template
     * @memberof wfw
     * @brief Template XML
     * */
    wfw.Template = {
        /*
        Insert une copie d'un template dans le document en cours
        Parametres:
        [HTMLElement] template      : L'Elément template
        [HTMLElement] insert_into   : L'Elément liste ou sera inseré l'objet (en fin)
        [object]      fields        : Tableau associatif des champs à inserer 
        [DOMDocument] [doc]         : Optionnel, Document en séléction 
        [HTMLNode]    [doc_node]    : Optionnel, Noeud en préséléction (enfant du document 'doc')
        [HTMLElement] [replacement] : Optionnel, Noeud à remplacer lors de l'insertion 
        Retourne:
        [HTMLElement] L'Elément nouvellement créé et inséré, null en cas d'erreur.
        */
        insert: function (template, insert_into, fields, doc, doc_node, replacement) {
            if (typeof (doc) == "undefined") {
                doc = null;
                doc_node = null;
            }

            //fabrique le template
            var newElement = template.cloneNode(true);

            //supprime l'id pour eviter une duplication de la valeur
            newElement.removeAttribute("id");

            //remplace un objet existant?
            if ((typeof (replacement) != "undefined") && (replacement != null)) {
                replacement.append(newElement,'after');
                //nodeInsertAfter(newElement, replacement);
                replacement.remove();
            }
            else
                insert_into.append(newElement);
                //objInsertNode(newElement, insert_into, null, INSERTNODE_END);

            this.make(Y.Node(document), newElement, doc, doc_node, fields);

            wfw.Style.removeClass(newElement, "wfw_hidden");

            return newElement;
        },
        /*
        Transforme l'élément donné
        [DOMDocument] doc            : Le document source
        [HTMLElement] element        : L'Elément model au sein du document source
        [DOMDocument] selectDoc      : Le document de la séléction, null si aucun
        [HTMLElement] selectElement  : Noeud de séléction en entrée, doit être enfant du document 'selectDoc'. Si null, l'élément racine du document est séléctionné
        [object]      args           : Tableau associatif des arguments
        Retourne:
        [HTMLElement] L'Elément transformé
        */
        make: function (doc, element, selectDoc, selectElement, args) {
            //arguments de type string uniquement
            var str_args = {};
            if (args != null) {
                var x;
                for (x in args) {
                    str_args[x] = "" + args[x];
                }
            }

            var template = new cXMLTemplate();

            //initialise la classe
            if (!template.Initialise(doc, element, selectDoc, selectElement, str_args))
                return null;

            //transforme l'élément
            template.Make();

            delete template;

            return element;
        },

        /*
        Transforme l'élément donné
        [DOMDocument] doc            : Le document source
        [HTMLElement] element        : L'Elément model au sein du document source
        [DOMDocument] selectDoc      : Le document de la séléction, null si aucun
        [HTMLElement] selectElement  : Noeud de séléction en entrée, doit être enfant du document 'selectDoc'. Si null, l'élément racine du document est séléctionné
        [object]      args           : Tableau associatif des arguments
        Retourne:
        [HTMLElement] L'Elément transformé
        */
        makeSrc: function (doc, element, selectDoc, selectElement, args) {
            //arguments de type string uniquement
            var str_args = {};
            if (args != null) {
                var x;
                for (x in args) {
                    str_args[x] = "" + args[x];
                }
            }

            var template = new cXMLTemplate();

            //initialise la classe
            if (!template.Initialise(doc, element, selectDoc, selectElement, str_args))
                return null;

            //transforme l'élément
            var src = template.Make();

            delete template;

            return src;
        },

        /*
        Transforme un document
        [DOMDocument] doc            : Le document
        [HTMLElement] element        : L'Elément model au sein du document source
        [DOMDocument] selectDoc      : Le document de la séléction, null si aucun
        [HTMLElement] selectElement  : Noeud de séléction en entrée, doit être enfant du document 'selectDoc'. Si null, l'élément racine du document est séléctionné
        [object]      args           : Tableau associatif des arguments
        Retourne:
        [DOMDocument] Le document
        */
        makeDoc: function (doc, element, selectDoc, selectElement, args) {
            var template = new cXMLTemplate();

            //initialise la classe
            if (!template.Initialise(doc, element, selectDoc, selectElement, args))
                return null;

            //transforme l'élément
            template.Make();

            return template.input;
        },

        /*
        Transforme le document d'une frame
        [HTMLFrame]   frame          : L'Objet frame
        [HTMLElement] element        : L'Elément model au sein du document source
        [DOMDocument] selectDoc      : Le document de la séléction, null si aucun
        [HTMLElement] selectElement  : Noeud de séléction en entrée, doit être enfant du document 'selectDoc'. Si null, l'élément racine du document est séléctionné
        [object]      args           : Tableau associatif des arguments
        Retourne:
        [HTMLFrame] L'Objet frame
        */
        makeFrame: function (frame, element, selectDoc, selectElement, args) {
            var template = new cXMLTemplate();
            var frame_doc = Y.Node(frame.get("contentWindow").get("document"));

            //initialise la classe
            if (!template.Initialise(frame_doc, element, selectDoc, selectElement, args))
                return null;

            //transforme l'élément
            var content = template.Make();

            delete template;

            //get content
            //var content = template.getContent();

            frame_doc.write(content);

            return frame;
        }/*,

        importDoc: function (parent, doc, select) {
            var element_list = Y.Node(doc).one("#"+select);
            var node = docImportNode(document, content_element, true);
            objInsertNode(node, parent, null, INSERTNODE_END);
        }*/
    };


    /*
    -----------------------------------------------------------------------------------------------
        cXMLTemplate class
    -----------------------------------------------------------------------------------------------
    */
    function cXMLTemplate()
    {
        //URI utilise par l'extention XML template
        this.wfw_template_uri;
        //instances des fichiers XML de selection
        this.xml_files;
        //chemin d'acces des fichiers a rechercher
        this.var_path;
        //arguments globales
        this.arg;
        //Element de selection
        this.select;
        //instances des classes Marker
        this.check_text_class;
        //classes marqueurs
        this.marker_class_names;
        //classes action
        this.action_class_names;
        //Element de selection principale (entrée)
        this.input_element;
        //fichier à transformer (entrée)
        this.input;

        if ( typeof this._initialized == "undefined" )
        {
            this._initialized = true;

            /*
                Initialise le template
                Parametres:
                    [DOMDocument/string] input_file    : Fichier à transformer
                    [HTMLElement]        input_element : Optionnel, L'Elément à transformer. Si null, l'élément root du document 'input_file' est séléctionné
                    [DOMDocument/string] select_file   : Optionnel, Fichier de séléction 
                    [HTMLElement]        select        : Optionnel, L'Elément de séléction. Si null, l'élément root du document 'select_file' est séléctionné
                    [object]             arg           : Optionnel, Arguments supplémentaire de la séléction
                Retourne:
                    [bool] true en cas de succès, false en cas d'erreur.
            */
            cXMLTemplate.prototype.Initialise = function (input_file, input_element, select_file, select, arg) {
                //Initialise les membres
                this.wfw_template_uri = "http://www.webframework.fr/last/xmlns/template";
                this.xml_files = new Array();
                this.var_path = (typeof (input_file) == "string") ? dirname(input_file) : "";
                this.arg = (arg != null) ? copy(arg) : {};
                this.select = null;
                this.check_text_class = [];
                this.marker_class_names = [
                "cXMLTemplateMarker_simple",
                "cXMLTemplateMarker_format",
                "cXMLTemplateMarker_attribute",
                "cXMLTemplateMarker_parse",
                "cXMLTemplateMarker_default"
                ];
                this.action_class_names = [
                "cXMLTemplateAction_array",
                "cXMLTemplateAction_exp",
                "cXMLTemplateAction_select",
                "cXMLTemplateAction_merge",
                "cXMLTemplateAction_include",
                "cXMLTemplateAction_ignore",
                "cXMLTemplateAction_format",
                "cXMLTemplateAction_each",
                "cXMLTemplateAction_eval"
                ];
                this.input_element = null;
                this.input = null;

                // timestamp
                var timestamp = getTime();

                // arguments predefinits
                this.arg["__date_rfc822__"] = (date(DATE_RFC822, timestamp));
                this.arg["__date_w3c__"] = (date("Y-m-d", timestamp));
                this.arg["__timestamp__"] = timestamp.toString();
                this.arg["__hostname__"] = window.location.hostname;

                //stat sur le fichier (non supporte)
                this.arg["__file_ctime__"] = "";
                this.arg["__file_mtime__"] = "";
                this.arg["__file_ctime_rfc822__"] = "";
                this.arg["__file_mtime_rfc822__"] = "";

                //charge/assigne le fichier input
                if ((typeof (input_file) == "string")) {
                    if (this.load(input_file))
                        this.input_element = this.input.get("documentElement");
                }
                else {
                    this.input = ((input_file == null) ? Y.Node(document) : input_file);
                    this.input_element = ((input_element != null) ? input_element : this.input.get("documentElement"));
                }

                if (this.input == null) {
                    this.post("Initialise", "failed load_input_file");
                    return false;
                }

                if (this.input_element == null) {
                    this.post("Initialise", "can't get input_element");
                    return false;
                }

                //charge/assigne le fichier de selection
                if ((typeof (select_file) == "string")) {
                    var varfile = null;
                    if (varfile = this.load_xml_file(select_file))
                        this.select = varfile.get("documentElement");
                }
                else {
                    this.select = ((select == null && select_file != null) ? select_file.get("documentElement") : select);
                }

                //cree les instances de classes Marker
                for (var i = 0; i < this.marker_class_names.length; i++) {
                    var class_name = this.marker_class_names[i];
                    var class_inst = eval("new " + class_name + "(this,this.arg)");
                    if (class_inst)
                        this.check_text_class.push(class_inst);
                }

                //		    this.post("var_path",'"'+this.var_path+'"');

                return true;
            };

            /*
                Transforme le document
                    [Document] doc           : le document source
                    [Element]  element       : l'element model au sein du document source
                    [Document]  selectDoc    : le document de la selection, null si aucun
                    [Element] selectElement  : noeud de selection en entree, doit etre enfant du document 'selectDoc'. Si null, l'element racine du document est selectionné
                    [object]  args           : tableau associatif des arguments
                Retourne:
                    rien.
                Remarques:
                    le format est identique aux templates PHP, voir la documentation.
            */
            cXMLTemplate.prototype.Make = function () {
                
                //transforme les noeuds
                var first_node = wfw.Utils.getChildNode(this.input_element);
                if (first_node != null) {
                    this.check_node(this.select, first_node, this.arg);
                    this.clean_node(first_node);
                }

                //recupere le contenu HTML
                var file_content = this.input_element.getHTML();

                //finalise le contenu
                for (var i = 0; i < this.check_text_class.length; i++) {
                    var class_inst = this.check_text_class[i];
                    file_content = class_inst.finalize(file_content);
                }
                
                //reconstruit le doc type
                /*if(this.input.doctype!=null)
                {
                var doctype='<!DOCTYPE '+this.input.doctype.name+' PUBLIC "'+this.input.doctype.publicId+'" "'+this.input.doctype.systemId+'">\n\n';
                file_content = doctype+file_content;
                }*/
                return file_content;
            };

            /*
                Charge le document en cours (Herite de XMLDocument)
                    [string]  path  : chemin du document à charger
                Retourne:
                    true, false si le document 'input_file' ne peut pas etre charge.
            */
            cXMLTemplate.prototype.load = function(path)
            {
                wfw.HTTP.get(path);

                if((wfw.HTTP.httpRequest.readyState == wfw.Request.READYSTATE_DONE) && (wfw.HTTP.httpRequest.status == 200))
                {
                    this.input = Y.Node(xml_parse(wfw.HTTP.getResponse()));
                    return true;
                }

                this.post("load","can't load input file ("+name+")");
                return false;
            };

            /*
                Charge un document de selection
                    [string]  name  : nom du fichier dans le chemin courant
                Retourne:
                    [object] document, null en cas d'erreur.
            */
            cXMLTemplate.prototype.load_xml_file = function(name)
            {
                if(typeof(this.xml_files[name]) != "object")
                {
                    var content = wfw.HTTP.get(this.var_path+name);
                    if(!((wfw.HTTP.httpRequest.readyState == wfw.Request.READYSTATE_DONE) && (wfw.HTTP.httpRequest.status == 200)))
                    {
                        this.post("load_xml_file",this.var_path+name+" file unavailable");
                        return false;
                    }
                    this.post("load_xml_file",this.var_path+name+" loaded");
                    this.xml_files[name] = Y.Node(xml_parse(content));
                }
                return this.xml_files[name];
            };

            /*
                Scan un texte à la recherche de marqueurs prédéfinit
                    [XMLNode] select  : reçoie le noeud de séléction de l'action précédente, NULL si aucun
                    [string]  text    : la chaine a scaner
                    [object]  arg    : recoie les arguments de l'action precedente, tableau vide si aucune
                    [string]  delimiter_l_char : delimiteur gauche du marqueur
                    [string]  delimiter_r_char : delimiteur droit du marqueur
                Retourne:
                    rien.
                Remarques:
                    le format est identique au templates PHP, voir la documentation.
            */
            cXMLTemplate.prototype.check_text = function(select,text,arg,delimiter_l_char,delimiter_r_char)
            {
                //arguments par defauts
                if(typeof(delimiter_l_char)=='undefined')
                    delimiter_l_char='{';
                if(typeof(delimiter_r_char)=='undefined')
                    delimiter_r_char='}';

                //                       
                var identifier = cInputName.regExp;
                var string = "[^\']*";
                var delimiter_l = "";
                var delimiter_r = ""; 
                var level = 0;           

                //recherche pour chaque niveau d'imbrication
                do
                {                                         
                    var old_text = text;
                    level++;            

                    delimiter_l += "\\"+delimiter_l_char;
                    delimiter_r += "\\"+delimiter_r_char;

                    // pour chaque format                                     
                    for(var i in this.check_text_class)
                    {         
                        var class_inst = this.check_text_class[i];
                        var exp_list = class_inst.exp();
                        var this_ = this;
                        // recherche pour chaque format d'expression                                  
                        for(exp in exp_list)
                        {       
                            var func = exp_list[exp];
                            text = text.replace(
                                new RegExp( '\-'+delimiter_l+exp+delimiter_r, "g" ),
                                function() {
                                    var matches=arguments;
                                    //appel la fonction qui va traiter la chene
                                    var value = eval("class_inst."+func+"(this_,select,matches,arg);");
                                    return value;
                                }
                                );
                        }
                    }
                }while(old_text != text);//si aucune modification du text, ne cherche pas de niveau superieur

                return text;
            };

            /*
            check_arguments
            scan les arguments d'un noeud element
            Arguments
            select: recoie le noeud de selection de l'action precedente, NULL si aucune.
            node  : noeud element scaner.
            arg   : recoie les arguments de l'action precedente, tableau vide si aucune.
            func  : nom de la fonction qui traite la valeur. Par defaut 'check_text'
            */
            cXMLTemplate.prototype.check_arguments = function(select,node,arg,func)
            {
                //arguments par defauts
                if(typeof(func)=='undefined')
                    func = 'check_text';
                
                var _this=this;
                if((select!=null||arg!=null) && node!=null)
                {
                    node.get("attributes").each(function(attr){
                        var value = attr.get("text");
                        if(value)
                        {
                            value = eval('_this.'+func+'(select,value,arg);');
                            attr.set("text",value);
                        }
                    });
                }
            };

            /*
                merge_arguments
                importe les attributs existants du noeud en cours depuis la selection
                Arguments
                select: recoie le noeud de selection de l'action precedente, NULL si aucune.
                node  : noeud element scaner.
                arg   : recoie les arguments de l'action precedente, tableau vide si aucune.
            Remarques:
                Attention: sous IE, si un attribut est définit vide (ex: style="") il ne sera pas implenté dans l'objet (et donc non-mergé car inexistant)
                */
            cXMLTemplate.prototype.merge_arguments = function(select,node,arg)
            {
                if(select!=null && node!=null)
                {
                    //importe les arguments
                    node.get("attributes").each(function(attr){
                        wfw.puts("cXMLTemplate.prototype.merge_arguments "+attr.get("name"));
                        
                        var select_att = select.getAttribute(attr.get("name"));
                        if(!empty(select_att)) 
                            attr.set("text", select_att); //remplace
                    });
                }
            };

            /*
                include_arguments
                importe tout les attributs de la selection dans le noeud en cours
                Arguments
                select: recoie le noeud de selection de l'action precedente, NULL si aucune.
                node  : noeud element scaner.
                arg   : recoie les arguments de l'action precedente, tableau vide si aucune.
                */
            cXMLTemplate.prototype.include_arguments = function(select,node,arg)
            {
                if(select!=null && node!=null)
                {
                    //importe les arguments
                    node.get("attributes").each(function(attr){
                        var value = select.getAttribute(attr.get("name"));
                        node.setAttribute(attr.get("name"), value); //remplace
                    });
                    /*
                    //TODO: check for select.attributes or node.attributes ?
                    var attributes = select.attributes; 
                    if(attributes) 
                    { 
                        for(var i=0; i<attributes.length; i++) 
                        {
                            var attr = attributes[i];
                            var value = objGetAtt(select,attr.name);
                            objSetAtt(node,attr.name,value); //remplace
                        } 
                    }      */   
                }
            };

            /*
                verify_node_condition
                        verifie si une condition est vrai
                Retourne:
                        true si la condition est vrai, sinon false
                        null si la condition est invalide ou si la selection est null
                */
            cXMLTemplate.prototype.verify_node_condition = function (select, arg, conditions) {
                if (select == null)
                    return null;

                var f_identifier = cInputName.regExp;
                var f_string = '[^\']*';

                var conditions_list = strexplode(conditions, ";", true);

                var conditions_exp = [
                '(' + f_identifier + ')=\\\'(' + f_string + ')\\\'',
                '(' + f_identifier + ')=#(' + f_string + ')',
                '\\\'(' + f_string + ')\\\'',
                '#(' + f_string + ')'
                ];

                // argument comparaison ...
                for (var x in conditions_list) {
                    var cur_condition = conditions_list[x];
                    var is_find = false;
                    var i = 0;
                    var is_ok = false;
                    while (i < conditions_exp.length && is_find == false) {
                        var exp = new RegExp(conditions_exp[i], 'g');
                        var matches = exp.exec(cur_condition);
                        if (matches) {
                            is_find = true;
                            switch (i) {
                                //compare la valeur d'un attribut    
                                case 0:
                                    //compare un attribut
                                    if (select.getAttribute(matches[1]) == matches[2])
                                        is_ok = true;
                                    break;
                                //compare la valeur d'un argument      
                                case 1:
                                    //compare un attribut
                                    if (typeof (arg[matches[2]]) == "string" && select.getAttribute(matches[1]) == arg[matches[2]])
                                        is_ok = true;
                                    break;
                                //compare la valeur en cours    
                                case 2:
                                    //compare un attribut
                                    if (select.get("text") == matches[1])
                                        is_ok = true;
                                    break;
                                //compare la valeur d'un argument     
                                case 3:
                                    //compare un attribut
                                    if (typeof(arg[matches[1]])=="string" && select.get("text") == arg[matches[1]])
                                        is_ok = true;
                                    break;
                                default:
                                    wfw.puts("cXMLTemplate::verify_node_condition: test ??");
                                    break;
                            }
                        }
                        i++;
                    }
                    if (is_ok == false)
                        return false;
                }
                return true;
            };

            //scan le noeud donné et les noeuds suivants
            cXMLTemplate.prototype.check_node = function(select,node,arg)
            {
                var next;
                //recursivement
                while(node!=null){
                    next=null;
                    switch(node.get("nodeType"))
                    {
                        case XML_ELEMENT_NODE:
                            var cur_select = select;
                            var cur_node = node;

                            //action?
                            var action = node.getAttribute("template:action");
                            if(action!=null)//ok pour cette action. supprime l'attribut pour evite de repeter l'action indefiniment
                                node.removeAttribute("template:action");

                            if((typeof(action)=='string') && !empty(action))  
                            {
                                //procede a la selection
                                var target_path      = node.getAttribute("template:path");
                                var target_condition = node.getAttribute("template:condition");

                                if(!empty(target_path))
                                {
                                    cur_select = this.get_xml_selection(cur_select, arg, target_path, target_condition);
                                }

                                //execute l'action
                                var class_name = "cXMLTemplateAction_"+action;
                                if(method_exists(class_name,"check_node"))//classe static
                                    next = eval(class_name+".check_node(this,cur_select,node,arg);");
                            }
                            else
                            {
                                this.check_arguments(cur_select,node,arg);
                                this.clean_attributes(node);
                                //traite les noeuds enfants
                                var firstChild = wfw.Utils.getChildNode(node);
                                if(firstChild != null)
                                {
                                    this.check_node(cur_select,firstChild,arg);
                                }
                            }
                            break;

                        case XML_TEXT_NODE:
                            var new_node_value = this.check_text(select,node.get("text"),arg);
                            node.set("text",new_node_value);
                            break;
                    }

                    //select = cur_select;
                    //prochain
                    node = ((next==null) ? node.get("nextSibling") : next);
                }
            };

            //clone le contenu d'un element dans un nouvel element de type 'new_type'
            cXMLTemplate.prototype.cloneContentElement = function(doc,node,new_type)
            {
                var new_node = doc.create("<"+new_type+">");

                var child = node.one("> *");
                if(child == null)
                    return;
                while(child != null){
                    var new_child = child.cloneNode(true);
                    new_node.append(new_child);
                    child = child.get("nextSibling");
                }
                return new_node;
            }

            //remplace le contenu d'un element par un autre
            cXMLTemplate.prototype.replaceContentElement = function(doc,node,new_content)
            {
                //texte?
                if(is_string(new_content))
                    new_content = doc.create(new_content);

                //supprime le contenu du noeud
                child.get('childNodes').remove();

                //insert le contenu
                if(new_content!=null)
                    node.append(new_content);

                return node;
            }

            //nettoie le noeud donné et les noeud suivants
            cXMLTemplate.prototype.clean_node = function(node)
            {
                //recursivement
                while(node!=null){
                    var next=null; 

                    next = node.get("nextSibling")

                    //noeuds
                    switch(node.get("nodeType"))
                    {
                        case XML_ELEMENT_NODE:
                            if(node.get("tagName") == "template:container")
                            {
                                // _stderr("clean_node, remove element: ".$node.tagName);
                                this.replaceNodeByContent(node);
                            }   

                            //traite les noeuds enfants
                            var child = node.one("> *");
                            if(child != null)
                                this.clean_node(child);
                            break;

                        case XML_TEXT_NODE:
                            break;
                    }

                    //prochain
                    node = next;
                }
            } 

            //nettoie les attributs
            cXMLTemplate.prototype.clean_attributes = function(node)
            {
                if(node!=null){
                    if(node.get('namespaceURI') == this.wfw_template_uri){
                        //rpost("clean_node","remove element: ".$node.tagName);
                        //$next = $node.firstChild;
                    }
                    else{
                        switch(node.nodeType)
                        {
                            case XML_ELEMENT_NODE:
                                node.get("attributes").each(function(attr){
                                    if(attr.get("name").indexOf(this.wfw_template_uri) != -1){                    
                                        this.post("clean_node","remove attributes: ".attr.get("name"));
                                        node.removeAttribute(attr.get("name")); 
                                    }
                                });
                                break;
                        }
                    }
                }
            };

            /*
                importe le contenu d'un noeud
                    [Document]  input_doc : document qui importe le noeud
                    [Node]      dst_node  : noeud de destination
                    [Node]      src_node  : noeud à importer
                Retourne:
                    rien
            */
            cXMLTemplate.prototype.import_node_content = function (input_doc, dst_node, src_node) {
                var list = [];
                var import_node;
                
                //recursivement
                while (src_node != null) {
                    //TODO: docImportNode replacement
                    import_node = wfw.Utils.importNode(input_doc, src_node,true);
                    list.push(import_node);
                    dst_node.append(import_node);
                    src_node = src_node.get("nextSibling");
                }
                return list;
            };

            /*
                supprime l'element par son contenu (Herite de XMLDocument)
                    [Element]  node  : noeud parent
                Retourne:
                    rien
            */
            cXMLTemplate.prototype.replaceNodeByContent = function(node)
            {
                var parent = node.ancestor();
                if(parent == null){
                    this.post("replaceNodeByContent","node parent not found");
                    return false;
                }  

                //deplace les enfants
                node.get("childNodes").each(function(child){
                    node.append(child,'after');
                });
                
                //supprime le noeud de reference
                node.remove();
            };

            /*
            get_xml_selection
            procede a la selection du curseur a partir d'une chene formate 
            Arguments
            current_select: la selection precedente, NULL si aucune.
            path          : chemin d'acces a la selection (voir en-tete).
            conditions    : conditions de la selection (voir en-tete).
            */
            cXMLTemplate.prototype.get_xml_selection = function (current_select, arg, path, conditions) {
                //	    wfw.puts("get_xml_selection "+path);
                //
                // charge un nouveau fichier...
                //
                if (path.substr(0, 1) == ':') //absolue
                {
                    var exp = new RegExp('^:(.*):(.*)$', 'g');
                    matches = exp.exec(path);

                    if (matches != null) {
                        wfw.puts("get_xml_selection: " + matches[1] + " . " + matches[2]);
                        var varfile;
                        if (varfile = this.load_xml_file(matches[1]))
                            return this.get_xml_selection(varfile.get("documentElement"), arg, matches[2], conditions); //ok, re-selectionne avec le chemin seulement 
                        return null;
                    }
                    else {
                        wfw.puts("get_xml_selection: (" + path + ") path invalid format!");
                        return null;
                    }
                }

                //
                // charge dans le fichier en cours...
                //
                if (current_select == null) {
                    wfw.puts("get_xml_selection: no input file!");
                    return null;
                }

                //obtient le fichier en cours
                var varfile = current_select.get("ownerDocument");

                //TODO: check for using path
                //absolue
                if (path.substr(0, 1) == '/')
                    current_select = varfile.one(path.replace('/','>'));
                //relatif
                else
                    current_select = current_select.one(path.replace('/','>'));

                //verifie la condition
                if ((conditions != null) && (!empty(conditions))) {

                    while (current_select) {
                        if (this.verify_node_condition(current_select, arg, conditions))
                            return current_select;
                        current_select = wfw.Utils.getNextNodeByTagName(current_select, current_select.get("tagName"));
                    }
                    return null;
                }

                return current_select;
            };

            /*
                Debug print 
            */
            this.post = function(title,msg)
            {
                wfw.puts("cXMLTemplate: "+title+", "+msg);
            };
        }
    };  

    //Classe de base 
    function cXMLTemplateMarker(input,arg)
    {
        this.check_text = function (input,select,matches,arg){
            return "";/*texte de remplacement, vide si aucun*/
        }
        this.finalize   = function (file_content){
            return file_content;
        }
        this.exp        = function (){
            return new Array();
        }
    }

    /*
    cXMLTemplateMarker_simple
    remplace les valeurs simple
    Syntaxe:
    -{identifier}
    -{identifier|'default value'}
    */
    function cXMLTemplateMarker_simple(input,arg)
    {
        this.finalize   = function (file_content){
            return file_content;
        };

        this.check_text = function (input, select, matches, arg) {
            var name = matches[1];

            //recherche dans la selection
            if (select != null) {
                //obtient la selection
                var node_select = input.get_xml_selection(select, arg, name);
                if (node_select != null)
                    return node_select.get("text");
            }

            //recherche dans les globales
            if (typeof (arg[name]) == 'string')
                return arg[name];

            //aucune entree trouve, texte de remplacement?
            if (typeof (matches[2]) == 'string')
                return matches[2];

            return "";
        };

        this.check_ip = function (input, select, matches, arg) {
            wfw.puts("------------check_ip--------------");
            return wfw.HTTP.post("wfw/req/hostbyaddr.php", {
                ip: matches[1]
            });
        };

        this.exp        = function (){
            var ar = {};
            ar['('+cInputName.regExp+')']                             = 'check_text';
            ar['(' + cInputName.regExp + ')' + '\\\|' + '\\\'([^\\\']*)\\\''] = 'check_text';
            ar['ip@(' + cInputIPv4.regExp + ')'] = 'check_ip';
            return ar;
        };
    }

    /*
    cXMLTemplateMarker_format
    Formate une valeur
    Syntaxe:
    -{identifier#format}
    -{identifier#format:options}
    */
    function cXMLTemplateMarker_format(input, arg) {
        this.finalize = function (file_content) {
            return file_content;
        };

        this.check_text = function (input, select, matches, arg) {
            var name = matches[1];
            var format = matches[2];
            var options = (typeof (matches[2]) == "string" ? matches[2] : "");

            var value = null;
            //recherche dans les globales
            if (typeof (arg[name]) == 'string')
                value = arg[name];

            //recherche dans la selection
            if (select != null) {
                //obtient la selection
                var node_select = input.get_xml_selection(select, arg, name);
                if (node_select != null)
                    value = node_select.get("text");
            }

            if (empty(value))
                return "";

            switch (format) {
                case "date":
                    if (!empty(options))
                        return date(options, value);
                    return date(RFC822, value);
            }

            return "";
        };

        this.exp = function () {
            var ar = {};
            ar['(' + cInputName.regExp + ')#(' + cInputName.regExp + ')'] = 'check_text';
            ar['(' + cInputName.regExp + ')#(' + cInputName.regExp + '):(' + cInputString.regExp + ')'] = 'check_text';
            return ar;
        };
    }

    /*
    cXMLTemplateMarker_attribute
        remplace les valeurs d'attributs
    Syntaxe:
        @[identifier] 
        [identifier]|'default value'
    */
    function cXMLTemplateMarker_attribute(input,arg)
    {
        this.finalize   = function (file_content){
            return file_content;
        };

        this.check_text = function(input,select,matches,arg)
        {
            var attribute_name = matches[1];

            //recherche dans la selection
            if(select!=null && select.hasAttribute(attribute_name)){
                //obtient la selection
                return select.getAttribute(attribute_name);
            }
            //aucune entree trouve, texte de remplacement?
            if(typeof(matches[2])=='string')
                return matches[2];

            return "";
        };

        this.exp        = function (){
            var ar = {};
            ar['@('+cInputName.regExp+')']                             = 'check_text';
            ar['@('+cInputName.regExp+')'+'\\\|'+'\\\'([^\\\']*)\\\''] = 'check_text';
            return ar;
        };
    }

    /*
    cXMLTemplateMarker_parse
            Syntaxe: -{!identifier}
            Colle un contenu texte

    */  
    function cXMLTemplateMarker_parse(input,arg)
    {
        //globales
        var paste_content;

        //constructeur
        this.__construct = function(input,arg)
        {
            this.paste_content = {};
        };

        this.finalize   = function (file_content){
            //remplace les contenus bruts (check_paste_value())
            if(!empty(this.paste_content))
            {
                for(var key in this.paste_content)
                    file_content = file_content.replace(key,this.paste_content[key]);
            }
            return file_content;
        };


        this.check_text = function(input,select,matches,arg){
            var attribute_name = matches[1];

            var name = matches[1];
            var comment = "-/"+name+"/"; //marqueur temporaire pour un remplacement ulterieur

            //recherche dans les globales
            if(typeof(arg[name])!='undefined')
            {
                this.paste_content[comment] = arg[name];
                return comment;
            }

            //recherche dans la selection
            if(select!=null)
            {
                //obtient la selection
                var node_select = input.get_xml_selection(select, arg, name);
                if(node_select != null)
                {
                    this.paste_content[comment] = node_select.get("text");
                    return comment;
                }
            }

            //parse XML ...

            return "";
        };

        this.exp = function (){
            var ar = {};
            ar['!('+cInputName.regExp+')']                             = 'check_text';
            return ar;
        };

        //construct
        this.__construct.apply(this,arguments);
    }

    /*
    check_default_attribute
            Syntaxe: -{index_identifier:identifier@attribute_identifier }
            Retourne la valeur d'un attribut dans la selection par defaut
    check_default_value
            Syntaxe: -{index_identifier:identifier}
            Retourne la valeur d'un element du fichier defaut.xml
    check_default_uri
            Syntaxe: -{:page_identifier}
            Retourne l'uri complete d'une page

    */  
    function cXMLTemplateMarker_default(input,arg)
    {
        var sitefile;

        this.finalize   = function (file_content){
            return file_content;
        };

        this.exp = function()
        {
            var ar = {};
            ar['\\:'+'('+cInputName.regExp+')'] = 'check_default_uri';
            ar['('+cInputName.regExp+')'+'\\:'+'('+cInputName.regExp+')'] = 'check_default_value';
            ar['('+cInputName.regExp+')'+'\\:'+'('+cInputName.regExp+')'+'\\@'+'('+cInputName.regExp+')'] = 'check_default_attribute';

            return ar;
        }

        //constructeur
        this.__construct = function(input,arg)
        {
            //charge depuis l'extention 'navigator' pour gagner du temps (cache)
            if (typeof (wfw.ext) != "undefined" && (wfw.ext.navigator.doc != null))
            {
                this.sitefile = wfw.Navigator.doc.doc; //xml doc
                var cdef = wfw.Navigator.doc;
            }
            else{
                this.sitefile = new wfw.Xml.DEFAULT_FILE();
                this.sitefile.Initialise("default.xml");
            }
            
            //initialise les parametres globaux
            if(this.sitefile != null){
                //Nom de domaine
                arg["__domain__"]       = this.sitefile.getIndexValue("domain",arg["__hostname__"]); 
                //URI sans protocol
                arg["__uri_nop__"]      = arg["__domain__"]+this.sitefile.getIndexValue("path",arg["__hostname__"])+"/";               
                //URI sans protocol
                arg["__base_uri_nop__"] = arg["__domain__"]+this.sitefile.getIndexValue("base_path",arg["__hostname__"])+"/"; 
                //URI complete
                arg["__uri__"]          = "http://"+arg["__domain__"]+this.sitefile.getIndexValue("path",arg["__hostname__"])+"/";    
                //URI racine complete
                arg["__base_uri__"]     = "http://"+arg["__domain__"]+this.sitefile.getIndexValue("base_path",arg["__hostname__"])+"/";  
                //URI racine complete
                arg["__path__"]         = this.sitefile.getIndexValue("path_root",arg["__hostname__"])+"/";
                //SiteName
                arg["__name__"]         = this.sitefile.getValue("name");
                arg["__title__"]        = this.sitefile.getValue("title");
                //SiteDesc
                arg["__description__"]  = this.sitefile.getValue("description");
                //id
                arg["__id__"]           = this.sitefile.getValue("id");
            }
            else
                wfw.puts("cXMLTemplateMarker_default: can't load default file");
        }

        //obtient une URI 
        this.check_default_uri = function(input,select,matches,arg)
        {
            if(this.sitefile==null)
                return "";

            var pageId = matches[1];

            var pageNode = this.getIndexNode("page", pageId);
            if (pageNode == null)
                return "";

            //protocole  
            var protocol = pageNode.getAttribute("protocol");
            if(empty(protocol))
                protocol="http";

            return protocol+"://"+arg["__uri_nop__"]+pageNode.get("text");
        }

        //obtient une valeur 
        this.check_default_value = function(input,select,matches,arg)
        {
            if(this.sitefile==null)
                return "";

            var linktype  = matches[1];
            var pageId    = matches[2];

            var pageNode = this.getIndexNode(linktype, pageId);
            if (pageNode == null)
                return "";

            return pageNode.get("text");
        }

        //obtient un attribut
        this.check_default_attribute = function(input,select,matches,arg)
        {
            if(this.sitefile==null)
                return "";

            var linktype = matches[1];
            var pageId   = matches[2];
            var attId    = matches[3];

            var pageNode = this.getIndexNode(linktype, pageId);
            if (pageNode == null)
                return "";

            return pageNode.getAttribute(attId);
        }

        //construct
        this.__construct.apply(this,arguments);
    }

    /*
            duplique et transforme en boucle le noeud en correspondance aavec chaque selection trouve
    */
    var cXMLTemplateAction_array =
    {
        check_node : function(input,select,node,arg)
        {
            arg['__array_count__']=0; 

            var condition = node.getAttribute("template:condition");

            var next = node.next();

            //scan le contenu
            while(select!=null)
            {
                if (empty(condition) || (this.verify_node_condition(select, arg, condition) == true)) {
                    arg['__array_count__']++;
                    arg['__inner_text__'] = select.get("text");

                    //copie le noeud
                    var node_new = node.cloneNode(true);

                    //traite les arguments pour ce noeud
                    input.check_arguments(select,node_new,arg);

                    //supprime les attributs inutiles
                    input.clean_attributes(node_new);

                    node.prepend(node_new);

                    //scan le contenu enfant
                    var child = wfw.Utils.getChildNode(node_new);
                    if(child != null)    
                        input.check_node(select,child,arg);
                }

                //obtient le prochain noeud du meme nom
                select = wfw.Utils.getNextNodeByTagName(select,select.tagName);
            }

            //supprime le noeud de reference
            node.remove();

            return next;
        }
    };

    /*
    duplique et transforme en boucle le noeud en correspondance avec toutes les selections suivantes
    Arguments:
        "__count__"          : retourne le compteur d'éléments traités
        "__inner_text__"     : contenu texte de la selection
        "__selection_name__" : nom de la selection (tagName)
    */
    var cXMLTemplateAction_each =
    {
        check_node: function (input, select, node, arg) {
            arg['__count__'] = 0;

            var condition = node.getAttribute("template:condition");

            select = select.one("> *");

            var next = node.next();

            //scan le contenu
            while (select != null) {
                if ((select.get("nodeType") == XML_ELEMENT_NODE) && (empty(condition) || this.verify_node_condition(select, arg, condition))) {
                    arg['__count__']++;
                    arg['__inner_text__'] = select.get("text");
                    arg['__selection_name__'] = select.get("tagName");

                    //copie le noeud
                    var node_new = node.cloneNode(true);

                    //traite les arguments pour ce noeud
                    input.check_arguments(select, node_new, arg);

                    //supprime les attributs inutiles
                    input.clean_attributes(node_new);

                    node.prepend(node_new);

                    //scan le contenu enfant
                    var child = wfw.Utils.getChildNode(node_new);
                    if (child != null)
                        input.check_node(select, child, arg);
                }

                //TODO: next of same tag or next only ?
                //obtient le prochain noeud
                select = select.next();
            }

            //supprime le noeud de reference
            node.remove();

            return next;
        }
    };

    /*
            test une expression reguliere sur la selection
    */
    var cXMLTemplateAction_exp =
    {
        check_node: function (input, select, node, arg) {
            //check les arguments
            input.check_arguments(select, node, arg);

            //obtient les attributs speciaux
            var target_exp = node.getAttribute("template:exp");

            //procède à une selection temporaire
            var target_str = null;
            var target_node = null;
            var target = node.getAttribute("template:target");
            if (!empty(target) && (typeof (arg[target]) == "string"))
                target_str = arg[target];
            if (!empty(target))
                target_node = input.get_xml_selection(select, arg, target, node.getAttribute("template:condition"));

            //supprime les attributs inutiles
            input.clean_attributes(node);

            //suivant		
            var next = node.next();

            //ok? scan le contenu
            if ((select != null || target_node != null || typeof(target_str)=="string") && target_exp) {
                var exp_target_value;
                if (target_node !== null)
                    exp_target_value = target_node.get("text");
                else if (target_str !== null)
                    exp_target_value = target_str;
                else if (select !== null)
                    exp_target_value = select.get("text");

                var reg = new RegExp(target_exp, "g");

                if (reg.test(exp_target_value)) {
                    //                input.post("cXMLTemplateAction_exp", target_exp + " = vrai, ajoute et scan le contenu. (" + exp_target_value + ")");

                    //scan le contenu enfant  
                    var child = wfw.Utils.getChildNode(node);
                    if (child != null)
                        input.check_node(select, child, arg);

                    return next;
                }
                else {
                    //                input.post("cXMLTemplateAction_exp", target_exp + " = faux, supprime le noeud de reference. (" + exp_target_value + ")");
                    node.remove();
                    return next;
                }
            }

            //sinon, supprime ce noeud
            input.post("cXMLTemplateAction_exp", "pas de selection disponible, supprime le noeud de reference.");
            node.remove();

            return next;
        }
    };

    /*
            evalue une expression du langage
    */
    var cXMLTemplateAction_eval =
    {
        check_node: function (input, select, node, arg) {
            //check les arguments
            input.check_arguments(select, node, arg);

            //obtient les attributs speciaux
            var att_eval = node.getAttribute("template:eval");
            var att_target = node.getAttribute("template:target");

            //supprime les attributs inutiles
            input.clean_attributes(node);

            //suivant		
            var next = node.next();

            //verifie le contenu
            if (empty(att_eval) || empty(att_target))
                return next;

            if(cInputEvalString.isValid(att_eval) != ERR_OK)
                return next;

            //evalue l'expression
            arg[att_target] = eval(att_eval);

            //scan le contenu enfant  
            var child = wfw.Utils.getChildNode(node);
            if (child != null)
                input.check_node(select, child, arg);

            return next;
        }
    };

    /*
    Sélectionne un noeud et transforme le contenu, si la sélection échoue le noeud et ses enfants sont supprimés
    Attributs:
            action = "select"
            path   = chemin d'acces a l'element cible.
    */  
    var cXMLTemplateAction_select =
    {
        check_node : function(input,select,node,arg)
        {
            //check les arguments
            input.check_arguments(select,node,arg);

            //supprime les attributs inutiles
            input.clean_attributes(node);

            //suivant
            var next = node.next();

            //ok? scan le contenu
            if(select!=null){
                arg['__inner_text__'] = select.get("text");

                //			input.post("cXMLTemplateAction_select","selection ok, ajoute et scan le contenu.");

                //scan le contenu enfant  
                var child = wfw.Utils.getChildNode(node);
                if(child != null)    
                    input.check_node(select,child,arg);

                return next;
            }    

            //sinon, supprime ce noeud       
            input.post("cXMLTemplateAction_select","selection introuvable, supprime le noeud de reference.");
            node.remove();

            return next;
        }
    };

    /*
    Merge les attributs et le contenu de la selection
    Attributs:
            action = "merge"
            path   = chemin d'acces a l'element cible.
    */  
    var cXMLTemplateAction_merge =
    {
        check_node : function(input,select,node,arg)
        {
            //check les arguments
            input.check_arguments(select,node,arg);

            //supprime les attributs inutiles
            input.clean_attributes(node);

            //suivant		
            var next = node.next();

            if(select!=null)
            {
                //merge les attributs
                input.merge_arguments(select,node,arg);

                //insert le contenu enfant
                input.import_node_content(input.input,node,wfw.Utils.getChildNode(select));

                //scan le contenu enfant  
                var child = wfw.Utils.getChildNode(node);
                if(child != null)    
                    input.check_node(select,child,arg);
            }

            return next;
        }

    };


    /*
    Inclue les attributs et le contenu de la selection
    Attributs:
            action = "include"
            path   = chemin d'acces a l'element cible.
    */
    var cXMLTemplateAction_include =
    {
        check_node: function (input, select, node, arg) {
            //obtient les options
            var opt = strToFlags(node.getAttribute("template:option"), "content_only include_att");

            //check les arguments
            input.check_arguments(select, node, arg);

            //supprime les attributs inutiles
            input.clean_attributes(node);

            //suivant		
            var next = node.next();

            if (select != null) {
                //merge les attributs
                if (opt.include_att)
                    input.include_arguments(select, node, arg);

                //insert le contenu enfant
                if (opt.content_only) {
                    var import_node_list = input.import_node_content(input.input, node, wfw.Utils.getChildNode(select));

                    //scan le contenu 
                    for(var cur in import_node_list){
                        input.check_node(null, cur, arg);  
                    }
                }
                //sinon, insert le noeud
                else {
                    var import_node = wfw.Utils.importNode(input.input, select, true);
                    node.append(import_node);

                    //scan le contenu enfant  
                    var child = wfw.Utils.getChildNode(node);
                    if (child != null)
                        input.check_node(null, child, arg);
                }

            }
            //sinon, supprime ce noeud
            else {
                input.post("cXMLTemplateAction_include", "selection introuvable, supprime le noeud de reference.");
                node.remove();
            }

            return next;
        }
    };

    /*
    Inclue du contenu XML dans la destination
    Attributs:
            action = "ignore"
    */  
    var cXMLTemplateAction_ignore =
    {
        check_node : function(input,select,node,arg)
        {
            //supprime les attributs inutiles
            input.clean_attributes(node);

            return node.next();
        }
    };

    /*
    Formate un texte brut en texte HTML
    Attributs:
            action    = "format"
            transform = Si true, le noeud et ses enfants sont transformés
            preset    = Type de formatage. Si non définit, "text" est utilisé
    Remarques:
        Les types de formatages:
            "script" = Codes et textes exactes
            "text"   = Textes et articles
    */
    var cXMLTemplateAction_format =
    {
        check_node: function (input, select, node, arg) {
            //obtient les options de formatage
            var preset = node.getAttribute("template:preset");
            var transform = node.getAttribute("template:transform");

            //check les arguments
            input.check_arguments(select, node, arg);

            //supprime les attributs inutiles
            input.clean_attributes(node);

            //suivant		
            var next = node.next();

            //scan le contenu avec la selection
            if (transform == "true") {
                var child = wfw.Utils.getChildNode(node);
                if (child != null)
                    input.check_node(select, child, arg);
            }

            //formate le texte    
            var text = node.getHTML();
            if (transform == "true")
                text = input.check_text(select, text, arg);

            var check_value_func = {
                "([&]+)": "sp",//caracteres speciaux
                "([\<]+)": "sp", //caracteres speciaux      
                "([\>]+)": "sp", //caracteres speciaux   
                "^([\\s]+)": "blank_line", //lignes vides en debut de texte                                  
                "([\\s]+)$": "blank_line", //lignes vides en fin de texte                    
                "\\n[ ]+": "spacing", //espacements en debut de ligne
                "\\s(\\')([^\\'\\<\\>]*)\\'": "citation",
                '\\s(\\")([^\\"\\<\\>]*)\\"': "citation",
                "\\s(\\')([^\\'\\<\\>]*)\\'": "string",
                '\\s(\\")([^\\"\\<\\>]*)\\"': "string",
                "\\n": "lf",
                "(http:\\/\\/)([^\\<\\>\\\"\\s\\n\\f\\r]*)[\\s\\n\\f\\r]{0,1}": "uri",
                "(https:\\/\\/)([^\\<\\>\\\"\\s\\n\\f\\r]*)[\\s\\n\\f\\r]{0,1}": "uri",
                "[-]{5,}": "lh"//lignes horizontale        
            };

            //preset ?
            var opt = "";
            switch (preset) {
                case "script":
                    opt = "sp blank_line spacing lf";
                    break;
                case "text":
                    opt = "sp blank_line spacing citation lf uri lh";
                    break;
                default: //text
                    opt = "sp blank_line spacing citation lf uri lh";
                    break;
            }
            var opt_list = strexplode(opt, " ", true);
            opt_list = object_flip(opt_list);

            // pour chaque format                                     
            for (var exp in check_value_func) {
                var func = check_value_func[exp];
                if (typeof (opt_list[func]) == "string") {
                    text = text.replace(
                        new RegExp(exp, "g"),
                        function () {
                            var matches = arguments;
                            //appel la fonction qui va traiter la chaine
                            var value = eval("cXMLTemplateAction_format." + func + "(select,matches,arg);");
                            return value;
                        }
                        );
                }
            }

            //supprime le contenu existant
            node.get("childNodes").remove();

            //importe le nouveau contenu
            text = '<?xml version="1.0" encoding="UTF-8"?>\n<div>' + text + '</div>';
            var doc = xml_parse(text);
            var textNode = input.import_node_content(input.input, node, doc.get("documentElement"));

            return next;
        },

        sp: function (select, matches, arg) {
            switch (matches[0]) {
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
                case "&":
                    return "&amp;";
            }
            return matches[0];
        },

        lf: function (select, matches, arg) {
            return "<br />";
        },

        spacing: function (select, matches, arg) {
            return '<br /><span style="width:' + (strlen(matches[0]) * 8) + 'px; display:inline-block;"></span>';
        },

        blank_line: function (select, matches, arg) {
            return "";
        },

        lh: function (select, matches, arg) {
            return "<hr />";
        },

        citation: function (select, matches, arg) {
            var sep = matches[1];
            var text = matches[2];
            return " " + sep + "<code style=\"font-style:italic;\">" + text + "</code>" + sep;
        },

        string: function (select, matches, arg) {
            var sep = matches[1];
            var text = matches[2];
            return "<span style=\"color:#990000;\">" + sep + text + sep + "</span>";
        },

        uri: function (select, matches, arg) {
            var proto = matches[1];
            var uri = matches[2];
            if (uri.substr(-1) != "/")//file
                return '<a target="_blank" href="' + proto + uri + '">' + basename(uri) + '</a>';
            //path
            return '<a href="' + proto + uri + '">' + uri + '</a>';
        }
    };

}, '1.0', {
    requires:['base','wfw','wfw-http','wfw-request', 'wfw-style', 'wfw-xml', 'wfw-utils']
});


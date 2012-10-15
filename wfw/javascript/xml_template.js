/*
    (C)2011 ID-Informatik. All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    WebFrameWork(R)

    Template XML/XHTML

    Dependences: base.js, dom.js, wfw.js

    Revisions:
        [21-11-2011] Implantation du code principale
        [30-11-2011] Debug cXMLTemplate::load(), restore la fonction d'un test précédent
		[30-11-2011] Update cXMLTemplateAction_format, formate les entités HTML "<" et ">", formate l'intégralité du contenu HTML
        [03-12-2011] Update cXMLTemplateMarker_default, charge le fichier default à partir du cache 'wfw.ext.navigator' si possible
        [03-12-2011] Update cXMLTemplate.Initialise, assigne automatiquement le document 'document' si input_file est null
        [05-12-2011] Debug cXMLTemplateMarker_default, typeof(...)
        [05-12-2011] Update cXMLTemplate.Initialise(), choisi l'element racine de la selection par defaut
        [27-12-2011] Update cXMLTemplateAction_exp, check les arguments avant l'expression
        [27-12-2011] Update cXMLTemplateAction_exp, implente l'utilisation du parametre 'target'
		[28-12-2011] Add cXMLTemplateAction_each
        [28-12-2011] Debug cXMLTemplateMarker_simple, test correctement l'existance du texte de remplacement
        [09-01-2012] Debug cXMLTemplateAction_exp, erreur de syntaxe
        [09-01-2012] Update cXMLTemplateAction_format, ajoute l'option "transform"
		[13-01-2012] cXMLTemplateAction_exp, utilise "target" plutot que "path"
		[13-01-2012] Update cXMLTemplateAction_exp, l'action test dans l'ordre: la selection locale (target), la selection d'argument (target), la selection globale (path)
		[14-01-2012] Update cXMLTemplateAction_format, utilise l'attribut "preset" pour remplacer "option"
		[14-01-2012] Add wfw.template.insert() 
		[16-02-2012] Les documents de selection XML sont rétablie aprés transformation du noeud appellant (cXMLTemplate::varfile et cXMLTemplate::siteFile sont supprimés)
		[23-02-2012] Debug, cXMLTemplate::Make() transforme les éléments suivant l'élément 'input_element' [Resolue] (Seul les noeuds enfants de l'élément 'input_element' sont transformé)
		[27-02-2012] Debug, cXMLTemplateAction_exp::check_node() test les cibles avec une chaine vide 'target_str'
        [02-03-2012] Debug, cXMLTemplate::get_xml_selection(), n'agit plus sur la selection globale
		[02-03-2012] Update, supprime la fonction cXMLTemplate::check_node_condition(), la fonction est obselete
*/

/*
-----------------------------------------------------------------------------------------------
    Template
        Template dynamique.
-----------------------------------------------------------------------------------------------
*/
wfw.template = {
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
        var newElement = nodeCloneNode(template, true);

        //supprime l'id pour eviter une duplication de la valeur
        objRemoveAtt(newElement, "id");

        //remplace un objet existant?
        if ((typeof (replacement) != "undefined") && (replacement != null)) {
            nodeInsertAfter(newElement, replacement);
            nodeRemoveNode(replacement);
        }
        else
            objInsertNode(newElement, insert_into, null, INSERTNODE_END);

        this.make(document, newElement, doc, doc_node, fields);

        wfw.style.removeClass(newElement, "wfw_hidden");

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
        /*obtient la classe
        if(!class_exists("cXMLTemplate"))
        {
        wfw.puts("Please include 'javascript/xml_template.js' file for using this extension");
        return null;
        }*/
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

        //initialise la classe
        if (!template.Initialise(frame.contentWindow.document, element, selectDoc, selectElement, args))
            return null;

        //transforme l'élément
        var content = template.Make();

        delete template;

        //get content
        //var content = template.getContent();

        frame.contentWindow.document.write(content);

        return frame;
    },

    importDoc: function (parent, doc, select) {
        var element_list = $doc(select, doc);
        var node = docImportNode(document, content_element, true);
        objInsertNode(node, parent, null, INSERTNODE_END);
    }
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
                    this.input_element = docGetRootElement(this.input);
            }
            else {
                this.input = ((input_file == null) ? document : input_file);
                this.input_element = ((input_element != null) ? input_element : docGetRootElement(this.input));
            }

            if (this.input == null) {
                this.post("Initialise", "failed load_input_file");
                return false;
            }

            if (this.input_element == null) {
                /*var el = this.input.getElementsByTagName("body");
                alert(el);
                alert(el.length);*/
                this.post("Initialise", "can't get input_element");
                return false;
            }

            //charge/assigne le fichier de selection
            if ((typeof (select_file) == "string")) {
                var varfile = null;
                if (varfile = this.load_xml_file(select_file))
                    this.select = docGetRootElement(varfile);
            }
            else {
                this.select = ((select == null && select_file != null) ? docGetRootElement(select_file) : select);
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
                le format est identique au templates PHP, voir la documentation.
        */
        cXMLTemplate.prototype.Make = function () {
            var first_node = nodeGetChildNode(this.input_element);
            if (first_node != null) {
                this.check_node(this.select, first_node, this.arg);
                this.clean_node(first_node);
            }

            var file_content = "";

            //recontruit le document avec l'element racine (ajouter les attributs de l'object)
            //var file_content = "<"+this.input_element.tagName+">\n"+this.input_element.innerHTML+"\n</"+this.input_element.tagName+">\n";
            if (typeof (this.input_element.innerHTML) != "undefined") {
                file_content = this.input_element.innerHTML;

                //finalise le contenu
                for (var i = 0; i < this.check_text_class.length; i++) {
                    var class_inst = this.check_text_class[i];
                    file_content = class_inst.finalize(file_content);
                }
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
            /*if(this.input =xml_load(path,function(doc){...}))
                return true;
            this.post("load","can't load input file ("+name+")");
            return true;*/
            /*this.input=new ActiveXObject("Microsoft.XMLDOM");
            this.input.async="false";
            this.input.load(path); 
            if(this.input.parseError.errorCode != 0 && typeof(wfw)=="object") {
               var myErr = this.input.parseError;
               wfw.puts("xml_parse: error " + myErr.reason);
               return false;
            }
            return true;*/
            wfw.http_get(path);
        
            if((wfw.nav.httpRequest.readyState == wfw.request.READYSTATE_DONE) && (wfw.nav.httpRequest.status == 200))
            {
                this.input = xml_parse(wfw.http_getResponse());
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
                var content = wfw.http_get(this.var_path+name);
                if(!((wfw.nav.httpRequest.readyState == wfw.request.READYSTATE_DONE) && (wfw.nav.httpRequest.status == 200)))
                {
                    this.post("load_xml_file",this.var_path+name+" file unavailable");
                    return false;
                }
                this.post("load_xml_file",this.var_path+name+" loaded");
                this.xml_files[name] = xml_parse(content);
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

            if((select!=null||arg!=null) && node!=null && (typeof(node.attributes)!="undefined")){
              var attributes = node.attributes; 
              if(attributes) 
              { 
                  for(var i=0; i<attributes.length; i++) 
                  {
                    var attr=attributes[i];
                    var value=attr.value;
                    //var value=objGetAtt(node,attr.name);//!BUG I.E/Safari: avec le nom d'attribut 'class' sur un element cree avec xml_parse()
                    if(value)
                    {
                        value = eval('this.'+func+'(select,value,arg);');
                        //objSetAtt(node,attr.name,value);//!BUG I.E/Safari: avec le nom d'attribut 'class' sur un element cree avec xml_parse()
                        attr.value = value;
                    }
                  }
              }
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
			    var attributes = node.attributes; 
                if(attributes) 
			    { 
				    for(var i=0; i<attributes.length; i++) 
				    {wfw.puts("cXMLTemplate.prototype.merge_arguments "+attributes[i].name);
                        var attr = attributes[i];
                        var select_att = objGetAtt(select,attr.name);
					    if(!empty(select_att)) 
						    attr.value = select_att; //remplace
				    } 
			    }         
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
			    var attributes = select.attributes; 
                if(attributes) 
			    { 
				    for(var i=0; i<attributes.length; i++) 
				    {
                        var attr = attributes[i];
                        var value = objGetAtt(select,attr.name);
					    objSetAtt(node,attr.name,value); //remplace
				    } 
			    }         
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
	                            if (objGetAtt(select, matches[1]) == matches[2])
	                                is_ok = true;
	                            break;
	                        //compare la valeur d'un argument      
	                        case 1:
	                            //compare un attribut
	                            if (typeof (arg[matches[2]]) == "string" && objGetAtt(select, matches[1]) == arg[matches[2]])
	                                is_ok = true;
	                            break;
	                        //compare la valeur en cours    
	                        case 2:
	                            //compare un attribut
	                            if (objGetInnerText(select) == matches[1])
	                                is_ok = true;
	                            break;
	                        //compare la valeur d'un argument     
	                        case 3:
	                            //compare un attribut
	                            if (typeof(arg[matches[1]])=="string" && objGetInnerText(select) == arg[matches[1]])
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
		        switch(node.nodeType)
		        {
			        case XML_ELEMENT_NODE:    
			            var cur_select = select;
			            var cur_node = node;

                        //action?
			            var action = objGetAtt(node,"template:action");
                        if(action!=null)//ok pour cette action. supprime l'attribut pour evite de repeter l'action indefiniment
    			            objRemoveAtt(node,"action");

					    if((typeof(action)=='string') && !empty(action))  
					    {
						    //procede a la selection
                            var target_path      = objGetAtt(node,"template:path");
                            var target_condition = objGetAtt(node,"template:condition");
						
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
                            var firstChild = nodeGetChildNode(node);
                            if(firstChild != null)
                            {
                                this.check_node(cur_select,firstChild,arg);
                            }
					    }
					    break;

				    case XML_TEXT_NODE:
                        if(typeof(node.wholeText)!="undefined")/*wholeText non supporté par I.E*/
                        {
                            var new_node_value = this.check_text(select,node.wholeText,arg);
                            node.replaceData(0,strlen(node.wholeText),new_node_value);
                        }
                        else if(typeof(node.nodeValue)!="undefined")
                        {
                            var new_node_value = this.check_text(select,node.nodeValue,arg);
                            node.replaceData(0,strlen(node.nodeValue),new_node_value);
                        }
                        break;
			    }

                //select = cur_select;
                //prochain
                node = ((next==null) ? node.nextSibling : next);
		    }
	    };
    
	    //clone le contenu d'un element dans un nouvel element de type 'new_type'
	    cXMLTemplate.prototype.cloneContentElement = function(doc,node,new_type)
        {
		    var new_node = doc.createElement(new_type);

		    var child = objGetChild(node);
		    if(child == null)
			    return;
		    while(child != null){
			    var new_child = nodeCloneNode(child,true);
			    objInsertNode(new_child,new_node,null,INSERTNODE_END);
			    child = objGetNext(child);
		    }
		    return new_node;
	    }
    
	    //remplace le contenu d'un element par un autre
	    cXMLTemplate.prototype.replaceContentElement = function(doc,node,new_content)
        {
            //texte?
		    if(is_string(new_content))
			    new_content = doc.createTextNode(new_content);

            //supprime le contenu du noeud
            objRemoveChildNode(child,null,REMOVENODE_ALL);
		
		    //insert le contenu
		    if(new_content!=null)
                objInsertNode(new_content,node,null,INSERTNODE_END);

		    return node;
	    }
	
	    //nettoie le noeud donné et les noeud suivants
	    cXMLTemplate.prototype.clean_node = function(node)
	    {
		    //recursivement
		    while(node!=null){
			    var next=null; 
			
			    next = objGetNext(node);
			
			    //noeuds
			    switch(node.nodeType)
			    {
				    case XML_ELEMENT_NODE:
					    if(node.tagName == "template:container")
					    {
						    // _stderr("clean_node, remove element: ".$node.tagName);
						    this.replaceNodeByContent(node);
					    }   
					
					    //traite les noeuds enfants
                        var child = objGetChild(node);
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
			    if(node.namespaceURI == this.wfw_template_uri){
				    //rpost("clean_node","remove element: ".$node.tagName);
				    //$next = $node.firstChild;
			    }
			    else{
				    switch(node.nodeType)
				    {
					    case XML_ELEMENT_NODE:
                            var attributes = node.attributes;
						    if(attributes)
						    { 
							    for(var i=0; i<attributes.length; i++)
                                {   
                                    var attr=attributes[i];
								    if(attr.name.indexOf(this.wfw_template_uri) != -1){                    
									    this.post("clean_node","remove attributes: ".attr.name);
									    node.removeAttribute(attr.name); 
								    }
							    }
						    } 
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
	            import_node = docImportNode(input_doc, src_node, true);
	            list.push(import_node);
	            objInsertNode(import_node, dst_node, null, INSERTNODE_END);
	            src_node = objGetNext(src_node);
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
            var parent = objGetParent(node);
            if(parent == null){
                this.post("replaceNodeByContent","node parent not found");
                return false;
            }  

            //deplace les enfants
            var children = objGetChildren(node);
            for(var i=0;i<children.length;i++)
                objInsertNode(children[i],parent,node,INSERTNODE_AFTER);
	    
            //supprime le noeud de reference
            nodeRemoveNode(node);
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
                        return this.get_xml_selection(docGetRootElement(varfile), arg, matches[2], conditions); //ok, re-selectionne avec le chemin seulement 
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
            var varfile = nodeGetDocument(current_select);
            
            //absolue
            if (path.substr(0, 1) == '/')
                current_select = docGetNode(varfile, path);
            //relatif
            else
                current_select = objGetNode(current_select, path);

            //verifie la condition
            if ((conditions != null) && (!empty(conditions))) {

                while (current_select) {
                    if (this.verify_node_condition(current_select, arg, conditions))
                        return current_select;
                    current_select = objGetNext(current_select, current_select.tagName);
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
	this.check_text = function (input,select,matches,arg){ return "";/*texte de remplacement, vide si aucun*/ }
	this.finalize   = function (file_content){ return file_content; }
	this.exp        = function (){ return new Array(); }
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
                return objGetInnerText(node_select);
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
        return wfw.http_post("wfw/req/hostbyaddr.php", { ip: matches[1] });
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
                value = objGetInnerText(node_select);
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
        if(select!=null && objHasAtt(select,attribute_name)){
            //obtient la selection
            return objGetAtt(select,attribute_name);
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
				this.paste_content[comment] = node_select.nodeValue;
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
            this.sitefile = wfw.ext.navigator.doc.doc; //xml doc
            var cdef = wfw.ext.navigator.doc;

			//Nom de domaine
			arg["__domain__"]       = cdef.getIndexValue("domain",arg["__hostname__"]); 
			//URI sans protocol
			arg["__uri_nop__"]      = arg["__domain__"]+cdef.getIndexValue("path",arg["__hostname__"])+"/";               
			//URI sans protocol
			arg["__base_uri_nop__"] = arg["__domain__"]+cdef.getIndexValue("base_path",arg["__hostname__"])+"/"; 
			//URI complete
			arg["__uri__"]          = "http://"+arg["__domain__"]+cdef.getIndexValue("path",arg["__hostname__"])+"/";    
			//URI racine complete
			arg["__base_uri__"]     = "http://"+arg["__domain__"]+cdef.getIndexValue("base_path",arg["__hostname__"])+"/";  
			//URI racine complete
			arg["__path__"]         = cdef.getIndexValue("path_root",arg["__hostname__"])+"/";
			//SiteName
			arg["__name__"]         = cdef.getValue("name");
			arg["__title__"]        = cdef.getValue("title");
			//SiteDesc
			arg["__description__"]  = cdef.getValue("description");
			//id
			arg["__id__"]           = cdef.getValue("id");
        }
        //charge le fichier
		else if( this.sitefile = input.load_xml_file("default.xml") )
		{
            var node;
			//Nom de domaine
			arg["__domain__"]       = this.getdefault(input,"domain",arg["__hostname__"]); 
			//URI sans protocol
			arg["__uri_nop__"]      = arg["__domain__"]+this.getdefault(input,"path",arg["__hostname__"])+"/";               
			//URI sans protocol
			arg["__base_uri_nop__"] = arg["__domain__"]+this.getdefault(input,"base_path",arg["__hostname__"])+"/"; 
			//URI complete
			arg["__uri__"]          = "http://"+arg["__domain__"]+this.getdefault(input,"path",arg["__hostname__"])+"/";    
			//URI racine complete
			arg["__base_uri__"]     = "http://"+arg["__domain__"]+this.getdefault(input,"base_path",arg["__hostname__"])+"/";  
			//URI racine complete
			arg["__path__"]         = this.getdefault(input,"path_root",arg["__hostname__"])+"/";
			//SiteName
            node = docGetNode(this.sitefile,"site/name");
            arg["__name__"] = (node != null ? objGetInnerText(node) : "");
            node = docGetNode(this.sitefile, "site/title");
            arg["__title__"] = (node != null ? objGetInnerText(node) : "");
			//SiteDesc
            node = docGetNode(this.sitefile,"site/description");
			arg["__description__"]  = (node!=null ? objGetInnerText(node) : "");
			//id
            node = docGetNode(this.sitefile,"site/id");
			arg["__id__"]           = (node!=null ? objGetInnerText(node) : "");
		}
	}

    /*
    Obtient un noeud de l'index
    Arguments:
    [string] type : type de noeud (nom de balise)
    [string] id   : identificateur
    Retourne:
    [XMLElement] Noeud trouve, null si introuvable
    */
    this.getIndexNode = function (type, id) {
        //recherche
        var entry_node = docGetNode(this.sitefile, 'site/index/' + type);
        while (entry_node) {
            var entry_id = objGetAtt(entry_node, "id");
            if (entry_id == id)
                return entry_node;

            entry_node = objGetNext(entry_node, type);
        }
        return null;
    }
          
	//obtient une valeur du defaut          
	this.getdefault = function(input,type,id){
		
		if(this.sitefile==null)
		{
			return "";
		}


        var pageNode = this.getIndexNode(type, id);
        if (pageNode == null)
			return "";
		
		return objGetInnerText(pageNode);
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
		var protocol = objGetAtt(pageNode,"protocol");
		if(empty(protocol))
			protocol="http";
		
		return protocol+"://"+arg["__uri_nop__"]+objGetInnerText(pageNode);
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
		
		return objGetInnerText(pageNode);
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
		
		return objGetAtt(pageNode,attId);
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

		var condition = objGetAtt(node,"template:condition");

		var next = objGetNext(node);
        
        //scan le contenu
        while(select!=null)
        {
            if (empty(condition) || (this.verify_node_condition(select, arg, condition) == true)) {
                arg['__array_count__']++;
                arg['__inner_text__'] = objGetInnerText(select);
                
                //copie le noeud
                var node_new = nodeCloneNode(node,true);
                
                //traite les arguments pour ce noeud
                input.check_arguments(select,node_new,arg);
                
				//supprime les attributs inutiles
				input.clean_attributes(node_new);
				
                objInsertNode(node_new, objGetParent(node), node, INSERTNODE_BEFORE);
  
                //scan le contenu enfant
                var child = nodeGetChildNode(node_new);
                if(child != null)    
                    input.check_node(select,child,arg);
            }

            //obtient le prochain noeud du meme nom
            select = objGetNext(select,select.tagName);
        }

        //supprime le noeud de reference
        nodeRemoveNode(node);

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

        var condition = objGetAtt(node, "template:condition");

        select = objGetChild(select);

        var next = objGetNext(node);

        //scan le contenu
        while (select != null) {
            if ((select.nodeType == XML_ELEMENT_NODE) && (empty(condition) || this.verify_node_condition(select, arg, condition))) {
                arg['__count__']++;
                arg['__inner_text__'] = objGetInnerText(select);
                arg['__selection_name__'] = select.tagName;

                //copie le noeud
                var node_new = nodeCloneNode(node, true);

                //traite les arguments pour ce noeud
                input.check_arguments(select, node_new, arg);

                //supprime les attributs inutiles
                input.clean_attributes(node_new);

                objInsertNode(node_new, objGetParent(node), node, INSERTNODE_BEFORE);

                //scan le contenu enfant
                var child = nodeGetChildNode(node_new);
                if (child != null)
                    input.check_node(select, child, arg);
            }

            //obtient le prochain noeud du meme nom
            select = objGetNext(select);
        }

        //supprime le noeud de reference
        nodeRemoveNode(node);

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
        var target_exp = objGetAtt(node, "template:exp");

        //procède à une selection temporaire
        var target_str = null;
        var target_node = null;
        var target = objGetAtt(node, "template:target");
        if (!empty(target) && (typeof (arg[target]) == "string"))
            target_str = arg[target];
        if (!empty(target))
            target_node = input.get_xml_selection(select, arg, target, objGetAtt(node, "template:condition"));

        //supprime les attributs inutiles
        input.clean_attributes(node);

        //suivant		
        var next = objGetNext(node);

        //ok? scan le contenu
        if ((select != null || target_node != null || typeof(target_str)=="string") && target_exp) {
            var exp_target_value;
            if (target_node !== null)
                exp_target_value = objGetInnerText(target_node);
            else if (target_str !== null)
                exp_target_value = target_str;
            else if (select !== null)
                exp_target_value = objGetInnerText(select);

            var reg = new RegExp(target_exp, "g");

            if (reg.test(exp_target_value)) {
//                input.post("cXMLTemplateAction_exp", target_exp + " = vrai, ajoute et scan le contenu. (" + exp_target_value + ")");

                //scan le contenu enfant  
                var child = nodeGetChildNode(node);
                if (child != null)
                    input.check_node(select, child, arg);

                return next;
            }
            else {
//                input.post("cXMLTemplateAction_exp", target_exp + " = faux, supprime le noeud de reference. (" + exp_target_value + ")");
                nodeRemoveNode(node);
                return next;
            }
        }

        //sinon, supprime ce noeud
        input.post("cXMLTemplateAction_exp", "pas de selection disponible, supprime le noeud de reference.");
        nodeRemoveNode(node);

        return next;
    }
}

/*
	evalue une expression du langage
*/
var cXMLTemplateAction_eval =
{
    check_node: function (input, select, node, arg) {
        //check les arguments
        input.check_arguments(select, node, arg);

        //obtient les attributs speciaux
        var att_eval = objGetAtt(node, "template:eval");
        var att_target = objGetAtt(node, "template:target");

        //supprime les attributs inutiles
        input.clean_attributes(node);

        //suivant		
        var next = objGetNext(node);

        //verifie le contenu
        if (empty(att_eval) || empty(att_target))
            return next;

        if(cInputEvalString.isValid(att_eval) != ERR_OK)
            return next;

        //evalue l'expression
        arg[att_target] = eval(att_eval);

        //scan le contenu enfant  
        var child = nodeGetChildNode(node);
        if (child != null)
            input.check_node(select, child, arg);

        return next;
    }
}

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
		var next = objGetNext(node);
		
		//ok? scan le contenu
		if(select!=null){
			arg['__inner_text__']=objGetInnerText(select);
       
//			input.post("cXMLTemplateAction_select","selection ok, ajoute et scan le contenu.");
                                 
            //scan le contenu enfant  
            var child = nodeGetChildNode(node);
            if(child != null)    
                input.check_node(select,child,arg);

            return next;
		}    
         
		//sinon, supprime ce noeud       
		input.post("cXMLTemplateAction_select","selection introuvable, supprime le noeud de reference.");
		nodeRemoveNode(node);
		
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
		var next = objGetNext(node);
		
		if(select!=null)
        {
			//merge les attributs
			input.merge_arguments(select,node,arg);

			//insert le contenu enfant
            input.import_node_content(input.input,node,nodeGetChildNode(select));
      
            //scan le contenu enfant  
            var child = nodeGetChildNode(node);
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
        var opt = strToFlags(objGetAtt(node, "template:option"), "content_only include_att");

        //check les arguments
        input.check_arguments(select, node, arg);

        //supprime les attributs inutiles
        input.clean_attributes(node);

        //suivant		
        var next = objGetNext(node);

        if (select != null) {
            //merge les attributs
            if (opt.include_att)
                input.include_arguments(select, node, arg);

            //insert le contenu enfant
            if (opt.content_only) {
                var import_node_list = input.import_node_content(input.input, node, nodeGetChildNode(select));

                //scan le contenu 
				for(var cur in import_node_list){
				    input.check_node(null, cur, arg);  
				}
            }
            //sinon, insert le noeud
            else {
                var import_node = docImportNode(input.input, select, true);
                objInsertNode(import_node, node, null, INSERTNODE_END);

                //scan le contenu enfant  
                var child = nodeGetChildNode(node);
                if (child != null)
                    input.check_node(null, child, arg);
            }

        }
        //sinon, supprime ce noeud
        else {
            input.post("cXMLTemplateAction_include", "selection introuvable, supprime le noeud de reference.");
            nodeRemoveNode(node);
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

		return objGetNext(node);
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
        var preset = objGetAtt(node, "template:preset");
        var transform = objGetAtt(node, "template:transform");

        //check les arguments
        input.check_arguments(select, node, arg);

        //supprime les attributs inutiles
        input.clean_attributes(node);

        //suivant		
        var next = objGetNext(node);

        //scan le contenu avec la selection
        if (transform == "true") {
            var child = nodeGetChildNode(node);
            if (child != null)
                input.check_node(select, child, arg);
        }

        //formate le texte    
        var text = nodeGetInnerHTML(node, true);
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
        nodeRemoveChildNode(node, null, REMOVENODE_ALL);

        //importe le nouveau contenu
        text = '<?xml version="1.0" encoding="UTF-8"?>\n<div>' + text + '</div>';
        var doc = xml_parse(text);
        var textNode = input.import_node_content(input.input, node, docGetRootElement(doc));

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
}

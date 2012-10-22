/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    Liste de champs

    JS  Dependences: base.js
    YUI Dependences: base, node, wfw, wfw-states

    Revisions:
        [19-10-2012] Implementation
*/
            
YUI.add('wfw-fieldlist', function (Y) {
    var wfw = Y.namespace('wfw');
    
    wfw.FieldList = {
        fields : {},//FIELD object array
    
        /*
        * Classe Liste de champ
        * Membres:
        *   [HTMLElement] list  : L'Elément HTML de la liste
        *   [HTMLElement] node  : L'Elément HTML du champ
        *   [HTMLElement] input : L'Elément Input du champ (Valeur du champ)
        *   [String]      name  : Nom du champ (Valeur de l'attribut 'name' dans l'élément 'input')
        */
        FIELD : function(att){
            this.list   = null;
            this.node   = null;
            this.input  = null;
            this.name   = "";
        
            /*
            * Constructeur
            */
            wfw.FieldList.FIELD.superclass.constructor.call(this, att);
        },

        //intialise l'extention
        init : function()
        {
            wfw.Event.SetCallback( // input ( l'utilisateur change le texte)
                "wfw_fieldlist_check",
                "change",
                "eventChangeInput",
                wfw.FieldList.eventChangeInput
            );
        },

        /*
            Recherche un élément Input dans la liste
            Arguments:
                [HTMLElement] inputElement : Noeud de l'élément à rechercher
            Retourne:
                [wfw.ext.fieldlist.FIELD] Le champ trouvé. null si le champ est intouvable
        */
        findInput : function(inputElement)
        {
            //recherche un element libre
            var ret = array_find(this.fields,function(list,key,index){
                return array_find(list,function(field,key,index){
                    if(field.input==inputElement)
                        return field;
                });
            });
            if(typeof(ret)=="undefined")
                return null;
            return ret;
        },
    
        /*
            Obtient les valeurs de champs d'une liste
            Arguments:
                [string] element_id : Identificateur de la liste (l'élément parent)
            Retourne:
                [object] Tableau des valeurs de champs triés par nom. Le tableau est vide si aucun champs n'est trouvé
        */
        getValues : function(element_id){
            wfw.puts("getValues:"+element_id);
            var list = this.getFields(element_id);
            var fields_list = {};
            for(var cur in list)
            {
                var name  = list[cur].name;
                var value = list[cur].input.get("value");
                fields_list[name] = value;
            }
            return fields_list;
        },

        /*
            Obtient les champs d'une liste
            Arguments:
                [string] element_id : Identificateur de la liste (l'élément parent)
            Retourne:
                [object] Tableau des objets wfw.ext.fieldlist.FIELD triés par nom. false si la création échoue
            Remarques:
                Si la liste n'existe pas, elle est créée
                Attention, getFields retourne la référence de la liste, ne modifiez pas son contenu

        */
        getFields : function(element_id){
            if(typeof(this.fields[element_id])=="undefined")
                return this.fields[element_id] = this.list(element_id);
            return this.fields[element_id];
        },
        /*
            Efface le champ d'une liste
            Arguments:
                [Y.Node] element : L'Elément parent de la liste
                [string] name    : Nom du champ à effacer
            Retourne:
                [HTMLElement] L'Elément effacé. null si introuvable
            Remarques:
                remove efface la valeur d'un champ. Le champ n'est pas supprimé de la liste mais invisible à l'utilisateur
        */
        remove : function(element,name)
        {
            var id = element.get("id");

            if(typeof(this.fields[id])=="undefined")
                return false;

            // liste les elements
            var list = this.getFields(id);

            //cache le champ
            if(typeof(list[name])!="undefined"){
                var current = list[name];
                //actualise le champs
                //current.value = "";
                //definit l'input
                current.input.set("value","");
                //rend l'input invisible
                wfw.Style.addClass(current.node,"wfw_hidden");

                return current.input;
            }

            wfw.puts("wfw.ext.fieldlist.remove: "+name+" list is not defined");
            return null;
        },
    
        /*
            Supprime un champ de la liste
            Arguments:
                [Y.Node] element : L'Elément parent de la liste
                [string] name    : Nom du champ à supprimer
            Retourne:
                [bool] true si l'élément est supprimé. false si introuvable
            Remarques:
                deleteField supprime un champ de la liste, le champ est définitivement supprimé de la liste.
        */
        deleteField : function(element,name)
        {
            var id = element.get("id");

            if(typeof(this.fields[id])=="undefined")
                return false;

            // liste les elements
            var list = this.getFields(id);

            //cache le champ
            if(typeof(list[name])!="undefined"){
                list[name].node.remove();
                delete(list[name]);

                return true;
            }

            wfw.puts("wfw.ext.fieldlist.deleteField: "+name+" list is not defined");
            return false;
        },
    
        /*
            Efface tous les champs d'une liste
            Arguments:
                [Y.Node] element : L'Elément parent de la liste
            Retourne:
                [bool] true en cas de succès. false en cas d'échec
            Remarques:
                clearList efface tous les champs de la liste, les champs restes utilisables
        */
        clearList : function(element)
        {
            var id = element.get("id");

            if(typeof(this.fields[id])=="undefined"){
                wfw.puts("wfw.ext.fieldlist.clearList: "+id+" list is not defined");
                return false;
            }
        
            var list = this.getFields(id);

            for(var item in list)
            {
                list[item].input.set("value","");
                //rend l'input invisible
                wfw.Style.addClass(list[item].node,"wfw_hidden");
            }

            return true;
        },
    
        /*
            Supprime une liste et tous ses champs
            Arguments:
                [Y.Node] element : L'Elément parent de la liste
            Retourne:
                [bool] true en cas de succès. false en cas d'échec
            Remarques:
                deleteList supprime définitevement la liste et tous ses champs. Le noeud de l'élément est supprimé.
        */
        deleteList : function(element)
        {
            var id = element.get("id");

            if(typeof(this.fields[id])=="undefined"){
                wfw.puts("wfw.ext.fieldlist.deleteList: "+id+" list is not defined");
                return false;
            }
        
            var list = this.getFields(id);

            for(var item in list)
            {
                list[item].node.remove();
                delete(list[item]);
            }

            return true;
        },
    
        /*
            Insert un élément à la liste
            Arguments:
                [HTMLElement]         element      : L'Elément parent de la liste
                [HTMLFieldSetElement] template     : L'Elément template
                [string]              name         : Nom du champ
                [string]              value        : Valeur a insérer
                [bool]                bInsertLegend: Insert la zone d'édition au champ
            Retourne:
                [HTMLElement] L'Elément INPUT nouvellement initialisé.
                En cas d'erreur:
                    [int]  null  : Aucun champ libre
                    [int]  false : l'argument 'element' n'est pas un élément valide
                    [int]  0     : l'argument 'value' est une chaine vide
                    [int]  1     : la liste ne possède pas d'identificateur
                    [int]  2     : le template ne possède pas de champs input
                    [int]  3     : element n'est pas de type FIELDSET
                    [int]  4     : name n'est pas un identificateur valide
        */
        insertNew : function(element,template,name,value,bInsertLegend)
        {
            //nom valide ?
            name = trim(name);
            if(cInputIdentifier.isValid(name) != ERR_OK)
            {
                wfw.puts("wfw.ext.fieldlist.insertNew: invalid name");
                return 4;
            }

            //fieldset ?
            if(template.get("tagName").toLowerCase() != "fieldset")
            {
                //return $make("ERROR",{code:3,str:"wfw.ext.fieldlist.insertNew: l'element n'est pas de type FIELDSET"});
                wfw.puts("wfw.ext.fieldlist.insertNew: element n'est pas de type FIELDSET");
                return 3;
            }
            //name ?
            if(empty(name))
            {
                //return $make("ERROR",{code:1,str:"wfw.ext.fieldlist.insertNew: name est vide"});
                wfw.puts("wfw.ext.fieldlist.insertNew: name est vide");
                return 1;
            }

            //obtient l'id de l'element
            var element_id = element.get("id");
            if(empty(element_id))
            {
                //return $make("ERROR",{code:1,str:"wfw.ext.fieldlist.insertNew: la liste ne possède pas d'identificateur"});
                wfw.puts("wfw.ext.fieldlist.insertNew: la liste ne possède pas d'identificateur");
                return 1;
            }

            //obtient la liste
            if(typeof(this.fields[element_id])=="undefined")
                this.fields[element_id] = {};
            var list = this.fields[element_id];
        
            //le champ existe deja ?
            var replacement = null;
            if(typeof(list[name])!="undefined")
            {
                replacement = list[name].node;
            }

            //intialise le template
            var new_element = wfw.ListElement.insertFields(template, element, {
                name:(name),
                value:(value)
            }, null, null, replacement);

            //obtient le champ INPUT
            var input_node = new_element.one("input[type='text'], input[type='button']");
            if(input_node==null)
            {
                wfw.puts("wfw.ext.fieldlist.insertNew: INPUT node not found");
                return 2;
            }
            
            //ajoute à la liste
            list[name] = new wfw.FieldList.FIELD({ 
                list  :element,
                node  :new_element,//fieldset
                input :input_node,//input
                name  :name
            });
            //initialise le champ
            this.initField(list[name],bInsertLegend);
        
            return new_element;
        },
        /*
            Insert une valeur à la liste
            Arguments:
                [HTMLElement]   element : L'Elément parent de la liste
                [string]        value   : Valeur a insérer
                [string]        options : Options additionnels, voir remarques
            Retourne:
                [HTMLElement] L'Elément INPUT nouvellement initialisé
                En cas d'erreur:
                    null         : Aucun champ libre
                    false        : L'Argument 'element' n'est n'est pas un élément valide
                    "empty"      : L'Argument 'value' est une chaine vide
                    "duplicated" : La valeur existe dèjà (uniquement si 'options.uniq_value' est définit à 'true')
            Remarques:
                Arguments additionnels:
                    [object] add_fields  = null   : Champs supplémentaires à initiliser dans l'élément
                    [string] insert_into = null   : Définit le nom de l'élément qui reçoit la valeur
                    [bool]   uniq_value  = false  : Insert la valeur uniquement si elle n'existe pas déja
        */
        insert : function(element,value,options)
        {
            var current;

            //options
            var att = {
                add_fields:null,
                insert_into:null,
                uniq_value:false
            };
            if(typeof(options)!="undefined")
                att = object_merge(att,options);

            //check la valeur
            if(empty(value))
                return "empty";
            
            var id = element.get("id");

            // liste les elements
            var fields = this.getFields(id);
        
            // insert uniquement si la valeur n'existe pas déja
            if(att.uniq_value == true){
                for(var item in fields)
                {
                    current = fields[item];
                    if(current.input.get("value") == value)
                        return "duplicated";
                }
            }

            //recherche un champs vide et l'initialise
            for(var item in fields)
            {
                current = fields[item];
                if((att.insert_into!=null && att.insert_into==current.name) || (att.insert_into==null && empty(current.input.get("value"))))
                {
                    //actualise le champs
                    //current.value = value;
                    //definit l'input
                    current.input.set("value",value);
                    //rend l'input visible
                    wfw.Style.removeClass(current.node,"wfw_hidden");

                    //initilise les champs supplementaires
                    if(att.add_fields != null)
                    {
                        wfw.Form.set_fields(current.node,att.add_fields);
                    }
				
                    return current.input;
                }
            }

            return null;
        },
        /*
            Liste les champs d'un élément
            Arguments:
                [HTMLElement] element : L'Elément parent de la liste
            Retourne:
                [object] Tableau indexé des champs (FIELD type)
            Remarques:
                Les éléments enfants doivent être de types FIELDSET
        */
        list : function(element)
        {
            var value;

            var i = 0;
            var fields = {};
        
            element.all("> fieldset").each(function(child){
                var node = child.one("input[type='text'], input[type='button']");
                if(node){
                    fields[i++] = new wfw.FieldList.FIELD( { 
                        list  :element,
                        node  :child,//fieldset
                        input :node,//input
                        name  :node.get("name")
                    });
                }
            });

            return fields;
        },
        /*
            [ PRIVATE ]
        */
        initField : function(new_field,bInsertLegend)
        {
            //visible/invisible
            if(empty(new_field.input.get("value")))
                wfw.Style.addClass(new_field.node,"wfw_hidden");
            else
                wfw.Style.removeClass(new_field.node,"wfw_hidden");
            
            // assigne les evenements a l'element INPUT
            wfw.Event.ApplyTo(new_field.input, "wfw_fieldlist_check");

            //ajoute la legende
            if(bInsertLegend)
            {
                //l'élément legende
                var legend = new_field.node.one("> legend");
                if(legend == null){
                    legend = Y.Node.create("<legend>");
                    new_field.node.prepend(legend);
                }

                //ajoute l'icone de suppression
                var icon = legend.one("> span");
                if(icon == null){
                    icon = Y.Node.create("<span>");
                    wfw.Style.setClass(icon,"wfw_icon delete");
                    icon.on("click",function(e,param){
                        wfw.FieldList.remove(param.list,param.name);
                    }, null, new_field);
                    legend.prepend(icon);
                }
            }
        },
    
        /*
            Initialise les éléments d'une liste de champs
            Arguments:
                [HTMLElement]   element        : L'Elément parent de la liste
                [bool]          bInsertLegend  : Si true, insert la légende aux champs
            Retourne:
                [bool] true en cas de succès, false en cas d'erreur.
            Remarques:
                Les éléments enfants doivent être de types FIELDSET
        */
        initElement : function(element,bInsertLegend)
        {
            if(typeof(bInsertLegend)=="undefined")
                bInsertLegend = true;

            var id = element.get("id");

            //reinitialise les champs
            var fields = this.fields[id] = {};
        
            //scan les elements enfants
            element.all("> fieldset").each(function(child){
                var node = child.one("input[type='text'], input[type='button']");
                if(node){
                    //ajoute l'élément à la liste
                    var name = node.get("name");
                    
                    fields[name] = new wfw.FieldList.FIELD( { 
                        list  :element,
                        node  :child,//fieldset
                        input :node,//input
                        name  :name
                    });
                
                    //
                    wfw.FieldList.initField(fields[name],bInsertLegend);
                }
            });
        
            return true;
        },
        /*
            Actualise les éléments d'une liste de champs
                [array] fields  : Liste des champs (FIELD), obtenu par la fonction wfw.ext.fieldlist.list()
            Return:
                [void]
            Remarques:
                affiche/cache les valeurs de la liste qui ne sont pas initialisees
        */
        update : function(fields)
        {
            array_find(fields,function(field,key,i){
                if(empty(field.value))
                    wfw.Style.addClass(field.node,"wfw_hidden");
                else
                    wfw.Style.removeClass(field.node,"wfw_hidden");
            });
        },
        /*
            eventChangeInput
                Si un élément est vide il sera automatique retiré de la liste

            Applicable:
                Elements INPUT
        */
        eventChangeInput : function(e){
            if(empty(this.get("value")))
                wfw.Style.addClass(this.ancestor("fieldset"),"wfw_hidden");
            else
                wfw.Style.removeClass(this.ancestor("fieldset"),"wfw_hidden");
        }
    };

    /*-----------------------------------------------------------------------------------------------------------------------
    * FIELD_BAR Class Implementation
    *-----------------------------------------------------------------------------------------------------------------------*/

    Y.extend(wfw.FieldList.FIELD, wfw.OBJECT);

    /*-----------------------------------------------------------------------------------------------------------------------
    * Initialise
    *-----------------------------------------------------------------------------------------------------------------------*/

    wfw.FieldList.init();
        
}, '1.0', {
    requires:['base','node', 'wfw' ,'wfw-states' ,'wfw-listelement', 'wfw-style', 'wfw-form']
});

/*
    (C)2008-2011 ID-Informatik. All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    WebFrameWork(R) version: 1.3

    Struture étendu de l'objet WebFrameWork.

    Composants:
        document  - Gestion relative au document
        navigator - Navigation
        fieldlist - Champs en liste
        datalist  - Proposition de champs
        bubble    - Bulles d'informations
        sort      - Tri et filtrage d'elements
        p2d       - (Experimental) Gestion de l'affichage 2D
        placement - (Experimental) Placement des elements
        object    - (Experimental) Objets de l'espace cartesien
        utils     - Fonctions utiles
        lang      - Gestion des langages

    Dependences: base.js, dom.js, wfw.js
    
    Revisions:
        [31-10-2010] change wfw.ext.sort.fieldsFromElement()
        [09-11-2010] debug wfw.ext.sort.fieldsFromElement(), interprete les elements commencant part des chiffres suivit de lettre comme un nombre plutot que du texte [resolue]
        [03-03-2011] Ameliore la fonction wfw.ext.document.printScreen()
        [16-03-2011] Ajout de l'objet wfw.ext.p2d.
        [11-06-2011] Update wfw.ext.navigator.getIndex()
        [11-06-2011] Update les fonctions de dialogues et de verrouillage de l'ecran (wfw.ext.document)
        [16-06-2011] Update wfw.ext.datalist.addsrc()
        [25-06-2011] Update wfw.ext.sort.sortElements()
        [25-06-2011] Add wfw.ext.sort.hideElements(), .filterName(), .filterValue(), .enumValues(), .fieldsType()
        [18-08-2011] Update wfw.ext.fieldlist.insert(), verifie le champ 'value'
        [14-09-2011] Add wfw.ext.sort.insertElements()
        [22-09-2011] Add wfw.ext.sort.showElements()
        [22-09-2011] Modify wfw.ext.sort.hideElements()
        [23-09-2011] Add wfw.ext.document.lockFrame()
        [23-09-2011] Modify wfw.ext.document.printOK()
        [23-09-2011] Add wfw.ext.document.printCancel()
        [03-10-2011] Modify wfw.ext.navigator.getPageIndex()
        [05-10-2011] Modify wfw.ext.document.lockFrame(), supprime l'argument obselete 'title'
        [05-10-2011] Changement de comportement pour wfw.ext.navigator.getPageNode(), la fonction retourne 'null' à la place de 'true' en cas d'echec
        [10-10-2011] Changement de comportement pour wfw.ext.document.lockElement(), l'élément source est restoré aprés vérrouillage
        [10-10-2011] Changement de comportement pour wfw.ext.document: Les dialogues peuvent maintenant être utilisés sur de multiples niveaux d'imbrications
        [10-10-2011] Changement de comportement pour wfw.ext.document.lockElement() et wfw.ext.document.lockFrame(), le bouton "Annuler" est inséré uniquement si un callback est passé
        [10-10-2011] Debug wfw.ext.document.lockElement(), mauvais paramètre pour objInsertNode() ligne 174 et 290
        [27-10-2011] Add wfw.ext.document.newDialog(), tout nouveau dialogue doit etre initialisé avec cette fonction
        [27-10-2011] Add wfw.ext.document.pushDialogAfter()
        [27-10-2011] Update wfw.ext.document.lockElement(), .lockFrame(), .printOK(), .lockFrame()
        [28-10-2011] Debug wfw.ext.document.lockElement(), .printOK(), .printCancel()
        [28-10-2011] Update wfw.ext.document.newDialog(), .LoadingBox(), .messageBox()
        [29-10-2011] Add wfw.ext.navigator.getModule(), wfw.ext.bubble.insertTextToElement()
        [29-10-2011] Debug wfw.ext.datalist.addsrc() et wfw.ext.datalist.loadsrc(), verifie la presence du module client avant de l'utiliser
        [08-11-2011] Modify wfw.ext.document.lockFrame(), ajout de l'argument 'title'
        [17-11-2011] Add wfw.ext.document.extensionToClassName() et wfw.ext.document.toSize()
        [07-12-2011] Modify wfw.ext.navigator.openPage(), ajout de l'argument 'target'
        [08-12-2011] Update wfw.ext.document.LoadingBox(), ajout de l'argument 'att'
        [13-12-2011] Add wfw.ext.document.confirm()
        [17-12-2011] Add wfw.ext.navigator.getId() et wfw.ext.navigator.getName()
        [31-12-2011] Delete wfw.ext.document.printElement() et wfw.ext.document.printScreen() [obselete]
        [31-12-2011] Update wfw.ext.navigator.confirm()
        [02-01-2012] Add wfw.ext.fieldlist.insertNew() et .clear() et .initField()
        [02-01-2012] Update wfw.ext.fieldlist.initElement()
        [03-01-2012] Add wfw.ext.fieldlist.get_fields()
        [07-01-2012] Update wfw.ext.document.lockElement() et .lockFrame(), Ajoute le bouton OK uniquement si un callback est passé
        [11-01-2012] Add wfw.ext.fieldlist.deleteField(), .clearList(), .deleteList()
        [31-01-2012] Add wfw.ext.document.closeDialog()
        [31-01-2012] Update wfw.ext.document.printOK() et wfw.ext.document.printCancel()
        [17-02-2012] Add wfw.ext.sort.filter()
        [02-03-2012] Update, wfw.ext.utils.callRequestListXARG() n'utilise plus de dialogue par défaut
        [05-03-2012] Update, wfw.ext.fieldlist getValues() utilise les noms de champs pour indices du tableau
        [05-03-2012] Update, wfw.ext.fieldlist.insert() ajout de l'option 'add_fields'
        [10-03-2012] Update, wfw.ext.fieldlist.insert() les valeurs de retour
        [02-04-2012] Update, wfw.ext.navigator.openPage() ajout de l'argument 'anchor'
        [06-04-2012] Update, wfw.ext.document.lockFrame(), .lockElement(), .insertDialog(), .newDialog(), .print()
        [25-04-2012] Update, wfw.ext.document, actualise l'usage des dialogues
*/

/*
-----------------------------------------------------------------------------------------------
    Extended object
-----------------------------------------------------------------------------------------------
*/
wfw.ext = {
    //
    initAll : function(){
        wfw.puts('====================================================');
        wfw.puts('------- Initializing Webframework extended ---------');
        wfw.puts('====================================================');
        for(var obj_name in wfw.ext){
            var obj = wfw.ext[obj_name];

            if((typeof(obj)=="object") && (typeof(obj.init)=="function") && (obj.use==true)){
                wfw.puts('------- Initializing '+obj_name+' object');
                obj.init();
            }
        }
    }
};  


/*
-----------------------------------------------------------------------------------------------
    datalist
        Proposition de champs en liste
-----------------------------------------------------------------------------------------------
*/
wfw.ext.datalist = {
	use : true, //initialise le module au chargement ?
	
    datasrc : new Object(), // liste des champs classés par nom
    listElement : null, // l'element liste
    inputFocus : null, // focus sur l'element input
    inputValue : null, // valeur de l'utilisateur pour le focus actif
    maxFieldResult : 6, // maxmimum de champs de propositions dans les listes INPUT

	init : function()
    {
        wfw.event.SetCallback( // input ( l'utilisateur entre du texte)
            "wfw_datalist_check",
            "keyup",
            "eventInputKey",
            wfw.ext.datalist.eventInputKey
        );
        wfw.event.SetCallback( // input ( si un autre input prend le focus)
            "wfw_datalist_check",
            "focus",
            "wfw.ext.datalist update INPUT focus",
            function(e,p){wfw.ext.datalist.inputFocus = this;}
        );
        wfw.event.SetCallback( // input ( si un autre input prend le focus)
            "wfw_datalist_check",
            "focus",
            "wfw.ext.datalist.eventInputKey",
            wfw.ext.datalist.eventInputKey
        );
			
        wfw.event.SetCallback( // input ( si un autre input prend le focus)
            "wfw_datalist_check",
            "blur",
            "wfw.ext.datalist update INPUT focus",
            function(e,p){if(wfw.ext.datalist.inputFocus == this){ wfw.ext.datalist.inputValue = null; wfw.ext.datalist.inputFocus = null;}}
        );
        wfw.event.SetCallback( // precede le click de la selection
            "wfw_datalist_check",
            "blur",
            "wfw.ext.datalist.eventCloseList",
            wfw.ext.datalist.eventCloseList
        );
        wfw.event.SetCallback( // sauvegarde la valeur de l'utilisateur
            "wfw_datalist_check",
            "mouseout",
            "wfw.ext.datalist.mouseout",
            function(e){
                if(wfw.ext.datalist.inputFocus!=this)
                    return;
                wfw.ext.datalist.inputValue = this.value;
            }
        );
    },
    /*
        eventCloseList
            ...

        Applicable:
            Elements INPUT
    */
	filterList : function(search,list)
    {
        var count=0;
        for(var x in list)
        {
            var value = ""+list[x];
            if(!wfw.search.string(search,value,wfw.search.MATCH_WORDS|wfw.search.MATCH_WORDS))
                delete(list[x]);
            else
                count++;
        }
        return count;
    },
    /*
        eventCloseList
            ...

        Applicable:
            Elements INPUT
    */
    eventCloseList : function(e){
        //
        if(wfw.ext.datalist.listElement != null){
            nodeRemoveNode(wfw.ext.datalist.listElement);
            wfw.ext.datalist.listElement=null;
        }
    },
    /*
        Actualise la liste du focus
        fields=liste des champs
        input=l'element input
    */
    updateInputList : function(fields,input)
    {
        //obtient le texte a rechercher
        var search_str = objGetAtt(input,"value");
        
        //cree l'élément liste
        var list = wfw.ext.datalist.createListElement(input);
        if(list==null){
			wfw.puts("wfw.ext.datalist.eventInitList: failed to create element list");
            return;
		}
        objSetEvent(list,"mouseout",
            function(e,input){
                wfw.ext.datalist.inputFocus.value = wfw.ext.datalist.inputValue;
            },
            input
        );
        //filtre la liste
        var data = copy(fields);
        if(!empty(search_str) && (!wfw.ext.datalist.filterList(search_str,data)))
           return;

        //initialise les champs dans l'element liste
        var i=0;
        for(var indice in data)
		{
            if(i >= wfw.ext.datalist.maxFieldResult)
                break;
            var item = document.createElement("div");
            //[selectionne une valeur]
            /*objSetEvent(item,"click",
                function(e,input){
                    objSetAtt(input,"value",objGetInnerText(this));
                    wfw.ext.datalist.eventCloseList();
                },
                input
            );*/
            objSetEvent(item,"mouseover",
                function(e,input){
                    objSetAtt(input,"value",objGetInnerText(this));
                },
                input
            );
            objSetInnerText(item,data[indice]);
            objInsertNode(item,list,null,INSERTNODE_BEGIN);

            i++;
        }
           
        //fermer la liste
        /*var item = document.createElement("div");
        //[selectionne une valeur]
        objSetEvent(item,"click",
            function(e,input){
                wfw.ext.datalist.eventCloseList();
            },
            input
        );
        objSetInnerText(item,"[FERMER]");
        objInsertNode(item,list,null,INSERTNODE_END);
        */
         
        //positionne la liste sous l'input
        objSetW(list,objGetW(input));
        objSetXY(list,objGetX(input),objGetY(input)+objGetH(input));
			
		//affiche la liste
        wfw.style.removeClass(list,"wfw_hidden");
    },
    
    eventInputKey : function(e)
    {
        //Touche entrer?
		if(e.keyCode == 13){
            wfw.ext.datalist.eventCloseList();
            return;
        }

        //texte entree
        var search_str = objGetAtt(this,"value");
        if(empty(search_str))
            return;
        
        //sauvegarde l'entree
        wfw.ext.datalist.inputValue = search_str;

        //datalist name?
        var name = objGetAtt(this,'wfw_datalist');
        if(name==null)
            return;
            
        //la liste est disponible ?
        var src = wfw.ext.datalist.getsrc(name);
        if(src){
            //charge l'element
            wfw.ext.datalist.updateInputList(src,this);
        }
        //charge la liste...
        else{
            //charge la requete
            wfw.ext.datalist.loadsrc(name);
        }
    },

    /*
        Charge une source de données
        Parametres
            name : Identifiant du fichier (voir module client)
        Retourne
            [bool] L'Objet wfw.request.REQUEST du chargement. false si une erreur s'est produite
        Remarques
            loadsrc utilise la requete 'getall' du module client pour obtenir une source de données (si le module n'existe pas la fonction echoue)
    */
    loadsrc : function(name,async)
    {
        if(typeof(async)=="undefined")
            async=true;

        var request_name = "wfw.ext.datalist.loadsrc("+name+")";

        //chargement en cours?
        if(wfw.request.Exists(request_name)){
            wfw.puts("wfw.ext.datalist.loadsrc: la liste de données <"+name+"> est en attente de chargement");
            return wfw.request.GetByName(request_name);
        }

        //deja charger?
        if(typeof(this.datasrc[name])!="undefined")
        {
           delete(this.datasrc[name]);
        }
        
        //module client?
        if(wfw.ext.navigator.getModule("client")==null)
            return false;
        
        var param = {
            //ok, intialise le tableau associatif
            "onsuccess" : function(obj,args)
            {
                var fields={};
                //fields= new Array();
                for(var arg in args){
                    if(arg!="error" && arg!="result" && arg!="info")
                    {
                        //fields.push(args[arg]);
                        fields[arg]=args[arg];
                    }
                }
                wfw.ext.datalist.datasrc[obj.user.datalist_name] = fields;

                //liste en attentes de chargement?
                for(var i=0; i<obj.user.initializeSelectElement.length; i++){
                    var select = obj.user.initializeSelectElement[i];
                    wfw.ext.datalist.attachToSelect(obj.args.wfw_id,select);//actualise le contenu
                }

                //input focus ?
                if(wfw.ext.datalist.inputFocus != null){
                    //le focus utilise cette liste ?
                    var data_type = objGetAtt(wfw.ext.datalist.inputFocus,'wfw_datalist');
                    if(data_type == obj.user.datalist_name){
                        //actualise l'affichage
                        wfw.ext.datalist.updateInputList(fields,wfw.ext.datalist.inputFocus);
                    }
                }

                //callback ?
                if(typeof(this.onLoad)=="function")
                    this.onLoad(fields);
            },
            "onfailed" : function(obj,args)
            {
                wfw.puts("wfw.ext.datalist.loadsrc: cant load <"+obj.user.datalist_name+"> list");
                wfw.ext.datalist.datasrc[obj.user.datalist_name] = {}; //initilise une liste vide
            },
            //pas de mesaage en cas d'erreur
            "no_msg" : 1,
            //liste des elements en attente d'initialisation
            initializeSelectElement : [],
            datalist_name:name,
            onLoad:null//callback
        };
        var fields={
            wfw_id:name
        };
        return wfw.request.Add(request_name,"req/client/getall.php",fields,wfw.utils.onCheckRequestResult_XARG,param,async);
    },
    /*
        Charge une source de données depuis un tableau associatif
        Parametres
            name        : Identifiant de la source
            [fields]    : Tableau associatif des champs de données
            [overwrite] : Si spécifié, la source existante est remplacée
        Retourne
            [bool] true en cas de succès. false si une erreur s'est produite
        Remarques
            Si la source existe déja les données ne son pas chargées
    */
    addsrc : function(name,fields)
    {
        var request_name = "wfw.ext.datalist.addsrc("+name+")";

        //existant ?
        if(typeof(this.datasrc[name])!="undefined"){
            //supprime la source
            delete(this.datasrc[name]);
        }

        //en chargement ?
        /*if(wfw.request.Exists(request_name)){
//            alert("addsrc:"+name+", attente");
            return true;
        }*/

        wfw.ext.datalist.datasrc[name] = copy(fields);

        return true;
    },
    /*
        Obtient une source de données
        Parametres
            name   : Identifiant de la source
        Retourne
            [object] Le tableau associatif des données. null en cas d'erreur
    */
    getsrc : function(name)
    {
        if(typeof(this.datasrc[name])!="undefined")
            return this.datasrc[name];
        return null;
    },
    /*
        Experimental
    */
	createSelectList : function()
    {
        //intialise l'unique liste
        var list = document.createElement("select");
        wfw.style.addClass(list,"wfw_float");
        objInsertNode(list,docGetElement(document,"wfw_ext_content"),null,INSERTNODE_END);
        //
        this.deleteList();
        return wfw.ext.datalist.listElement = list;
    },
    /*
        [privé]
        Cree l'element liste
    */
	createListElement : function(input)
    {
        //intialise l'element de la liste de champs
        var list = document.createElement("div");
        //wfw.style.addClass(list,"hidden");
        wfw.style.addClass(list,"wfw_float");
        wfw.style.addClass(list,"wfw_datalist");
        wfw.style.addClass(input,"wfw_float_content");
        /*nodeInsertAfter(list,input);
        objInsertNode(list,docGetElement(document,"wfw_ext_content"),null,INSERTNODE_END);*/
        objInsertNode(list,objGetParent(input),input,INSERTNODE_AFTER);

        //supprime la liste en cours si existante
        this.deleteList();
		
		//assigne la nouvelle liste 
        return wfw.ext.datalist.listElement = list;
    },
    /*
        [privé]
        Supprime l'element liste
    */
	deleteList : function()
    {
        if(wfw.ext.datalist.listElement != null){
            nodeRemoveNode(wfw.ext.datalist.listElement);
            wfw.ext.datalist.listElement=null;
        }
    },
    /*
        Attache une liste à un champ de texte
        Parametres
            name   : Identifiant de la source de données
            object : L'Elément INPUT[text]
        Remarques
             Si la source de données n'est pas encore chargée, elle le sera automatiquement lorsque l'utilisateur entrera du texte
    */
    attachToInput : function(name,object)
    {
        objSetAtt(object,"autocomplete","off");
        objSetAtt(object,"wfw_datalist",name);
        wfw.event.ApplyTo(object, "wfw_datalist_check");
    },
    /*
        Attache une liste à un élément SELECT
        Parametres
            name   : Identifiant de la source de données
            object : L'Elément SELECT
        Remarques
             La liste est ajoutée aux champs existants. Pour remplacer la liste, supprimez d'abort les champs existants
    */
    attachToSelect : function(name,object)
    {
        //la liste est disponible ?
        var src = this.getsrc(name);
        if(src){
            //charge l'element
            for(var arg in src){
                var option = document.createElement("option");
                objSetAtt(option,"value",arg);
                objSetInnerText(option,src[arg]);
                objInsertNode(option,object,null,INSERTNODE_END);
            }
        }
        //charge la liste...
        else{
            //obtient la requete
            var request = this.loadsrc(name);
            if(!request)
            {
                wfw.puts("wfw.ext.datalist.attachToSelect: create/get request error");
                return null;
            }
            //prepare l'element à être chargé
            request.user.initializeSelectElement.push(object);
        }
    },
    /*
    */
	makeDataList : function(name,template,insertInto,args,values)
    {
        var src = this.getsrc(name);
        if(!args)
            args={};
        if(typeof(values)=="undefined")
            values=null;
        if(src){
            //charge l'element
            for(var arg in src){
                var fields = object_merge(args,{
                    id:arg,
                    name:src[arg],
                    value:((values && typeof(values[arg])=="string") ? values[arg] : "")
                });
                wfw.template.insert(template,insertInto,fields);
            }
        }
        else{
            wfw.puts("wfw.ext.datalist.makeFieldList: source "+name+" not found");
        }
    },
    /*
    */
	makeFieldList : function(name,template,insertInto,args,names,values)
    {
        var src = this.getsrc(name);
        if(!args)
            args={};
        if(typeof(values)=="undefined")
            values=null;
        if(src){
            //charge l'element
            for(var arg in src){
                var fields = object_merge(args,{
                    id:arg,
                    name:((names && typeof(names[arg])=="string") ? names[arg] : arg),
                    type:src[arg],
                    value:((values && typeof(values[arg])=="string") ? values[arg] : "")
                });
                wfw.template.insert(template,insertInto,fields);
            }
        }
        else{
            wfw.puts("wfw.ext.datalist.makeFieldList: source "+name+" not found, load attempt...");
            var req_obj = this.loadsrc(name, true);
            if (req_obj) {
                req_obj.user.template = template;
                req_obj.user.insertInto = insertInto;
                req_obj.user.name = name;
                req_obj.user.args = args;
                req_obj.user.names = names;
                req_obj.user.values = values;
                req_obj.user.onLoad = function (src_fields) {
                    wfw.ext.datalist.makeFieldList(this.name, this.template, this.insertInto, this.args, this.names, this.values);
                };
            }
        }
    }
},

/*
-----------------------------------------------------------------------------------------------
    Bulle d'information
-----------------------------------------------------------------------------------------------
*/
wfw.ext.bubble = {
	use : true,
	bubble_id : "wfw_ext_bubble",

    //initialise
	init : function(){
        //intialise la liste d'evenement
        wfw.event.SetCallback( "wfw_ext_bubble", "mouseover", "eventCreateBullet", wfw.ext.bubble.eventCreateBubble );
        wfw.event.SetCallback( "wfw_ext_bubble", "mousemove", "eventUpdateBullet", wfw.ext.bubble.eventUpdateBullet );
        wfw.event.SetCallback( "wfw_ext_bubble", "mouseout", "eventDestroyBullet", wfw.ext.bubble.eventDestroyBullet);
    },
    
    //détache une information d'un élément
	removeTextToElement : function(obj){
        //cree une instance de la classe WFWBullet dans l'objet
        if (typeof obj._wfw_bullet != "object")
            delete obj._wfw_bullet;

        //definit les evenements pour cet objet
        wfw.event.RemoveTo(obj, "wfw_ext_bubble");
    },

    //attache un texte à un élément
	attachTextToElement : function(obj,text){
        //cree une instance de la classe WFWBullet dans l'objet
        if (typeof obj._wfw_bullet != "object")
            obj._wfw_bullet = { text:"" };

        //assigne le texte
        obj._wfw_bullet.text = text;

        //definit les evenements pour cet objet
        wfw.event.ApplyTo(obj, "wfw_ext_bubble");
    },
    
    //insert un texte à coté d'un élément
	insertTextToElement : function(obj,text){
        var bullet_obj = document.createElement('span');
        if (!bullet_obj)
            return;
        wfw.style.addClass(bullet_obj,"wfw_icon");
        wfw.style.addClass(bullet_obj,"help");
        objInsertNode(bullet_obj,objGetParent(obj),obj,INSERTNODE_AFTER);
        this.attachTextToElement(bullet_obj,text);
    },

    //
    // Evenements
    //

    eventCreateBubble : function(e){
        // cree l'objet bulle
        var bullet_obj = docGetElement(document,wfw.ext.bubble.bubble_id);
        if (!bullet_obj) {
            /* IE 7 
            bullet_obj = document.createElement('<div id="'+wfw.ext.bubble.bubble_id+'">');
            if (!bullet_obj)
                return;*/
            //IE8 +
            bullet_obj = document.createElement('div');
            if (!bullet_obj)
                return;
            document.body.appendChild(bullet_obj);
            objSetAtt(bullet_obj, "id", wfw.ext.bubble.bubble_id); // passer les attributs directement a createElement (ci-dessus), compatible IE7-
            objSetClassName(bullet_obj,"wfw_ext_bubble");
            objSetXY(bullet_obj, getMouseX(), getMouseY() + 10);
            objSetInnerText(bullet_obj, this._wfw_bullet.text);
        }
    },

    eventUpdateBullet : function(e)
    {
        var text = this._wfw_bullet.text;

        var bullet_obj = docGetElement(document,wfw.ext.bubble.bubble_id);
        if (!bullet_obj) return; //si il n'existe pas, ne pas l'afficher
        objSetXY(bullet_obj, getMouseX(), getMouseY() + 10);
    },

    eventDestroyBullet : function(e)
    {
        var bullet_obj = docGetElement(document,wfw.ext.bubble.bubble_id);
        if(bullet_obj!=null) {
            document.body.removeChild(bullet_obj);
        }
    }
};

/*
-----------------------------------------------------------------------------------------------
    Tri de champs
-----------------------------------------------------------------------------------------------
*/
wfw.ext.sort = {
    /*
    Insert des champs de tri dans un élément
	Argument:
        [object]      fields : Tableau associatif des champs à insérer
        [HTMLElement] parent : L'élément qui reçoit les champs
	Retourne:
        [object] Les champs passés en argument
    */
    insertFieldsToElement : function(fields,parent){
        var oItem;
        for(item_name in fields){
            //champ de tri
            oItem = document.createElement('input');
            objSetAtt(oItem,'type','hidden');
            objSetAtt(oItem,'name',item_name);
            objSetAtt(oItem,'value',fields[item_name]);
            objInsertNode(oItem,parent,null,INSERTNODE_END);
        }
        return fields;
    },
    /*
    Obtient les champs de tri d'un ou plusieurs éléments
	Argument:
        [HTMLElement] firstElement : Premier élément de la liste
        [array]       flags        : Drapaux
                                     "visibleOnly" = liste uniquement les elements ne possedant pas la classe de style "wfw_hidden"
                                     "firstOnly"   = liste uniquement le premier element (retourne une liste avec uniquement l'indice 0)
	Retourne:
        [object] fields : Liste des champs (voir remarques)
    Remarques:
        Un champ prend la forme d'un élément:
            <INPUT type="hidden" name="..." value="..." />
        
        Format de la liste des champs:
            fields[n] = {
                [HTMLElement]    node          : noeud de l'élément,
                [string/number] 'field_name_0' : 'field_value_0',
                [string/number] 'field_name_1' : 'field_value_1',
                ...
            }

        fieldsFromElement, parse automatiquement les nombres
    */
    fieldsFromElement : function(firstElement,flags){
        var fields = new Array();
        if(typeof(flags)=="undefined")
            flags="";
        while(firstElement!=null)
        {
            //les objets visibles seulement?
            if((typeof(flags["visibleOnly"])!="undefined") && wfw.style.haveClass(firstElement,"wfw_hidden"))
            {
                firstElement = objGetNext(firstElement,null);
                continue;
            }
            //
            var field = new Object();
            field.node = firstElement;
       //     field.id = objGetAtt(firstElement,'id');
            //scan les criteres, definit dans les elements 'Hidden'
            var type = objGetChild(firstElement,'input');
            while(type!=null){
                if(objGetAtt(type,'type')=='hidden'){
                    var type_name  = objGetAtt(type,'name');//.toLowerCase();
                    var type_value = objGetAtt(type,'value');//.toLowerCase();
                    if(!empty(type_name) && !empty(type_value))
                    {
                        //'type_value' est un nombre?
                        if(is_strof(type_value,"0123456789.,") && !isNaN(parseFloat(type_value)))
                            type_value = parseFloat(type_value);
                        // insert a la liste
                        field[type_name] = type_value;
                    }
                }
                type = objGetNext(type,'input');
            } 
            fields.push(field);  
            //prochaine objet
            if($get("flags.firstOnly"))
                firstElement = null;
            else
                firstElement = objGetNext(firstElement,null);
        }
        return fields;
    },
    
    /*
    Tri une liste de champs
	Argument:
        [object] fields : Liste des champs à trier
        [string] filter : Champ de référence pour le tri
	Retourne:
        [object] uniquement les champs qui possedes le critere 'filter'
    Remarques:
        sortFields tri automatiquement les nombres des textes
    */
	sortFields : function(fields,filter){

        //ne filtre pas les champs manquants
        var unsorted_fields = new Array();
        for(var i=0;i<fields.length;i++){
            if(typeof(fields[i][filter])=='undefined')
                unsorted_fields.push(remove_key(fields,i));
        }

        //tri
        return fields.sort(
            function sortfunction(a, b){
                if(typeof(a[filter])=='number' && typeof(b[filter])=='number'){
                 //   alert("cmp number");
                    return wfw.ext.sort.cmpNum(a[filter],b[filter]);
                }
                if(typeof(a[filter])=='string' && typeof(b[filter])=='string'){
                 //   alert("cmp string");
                    return wfw.ext.sort.cmpStr(a[filter],b[filter]);
                }
                return 0; // vers la fin
            }
        );
    },
    
    /*
    Filtre une liste de champs (obselete ?)
	Argument:
        [object] fields : liste des champs
        [string] filter : le nom du champ de référence pour le filtrage
	Retourne:
        [object] la liste de champs filtré
    Remarques:
        Toutes les listes de champs qui posséde la valeur 'filter' sont éliminées de la liste
    */
	filterFields : function(fields,filter){
        var new_fields = {};

        //ne filtre pas les champs manquant
        var x = 0;
        for(var i=0;i<fields.length;i++)
        {
            if(typeof(fields[i][filter])=='undefined')
            {
                new_fields[x] = fields[i];
                x++;
            }
        }

        return new_fields;
    },
    
    /*
    Filtre une liste de champs par nom
	Argument:
        [object] fields : liste des champs
        [string] name   : Nom du champ
	Retourne:
        [object] Liste des champs filtrés
    Remarques:
        Toutes les listes de champs qui posséde la champs 'name' ne sont pas retenus
    */
	filterName : function(fields,name){
        var new_fields = new Array();

        //ne filtre pas les champs manquant
        var x = 0;
        for(var i=0;i<fields.length;i++)
        {
            if(typeof(fields[i][name])!='undefined')
            {
                new_fields.push(fields[i]);
                x++;
            }
        }

        return new_fields;
    },
    
    /*
    Filtre les champs par valeur
	Argument:
        [object] fields : liste des champs
        [string] name   : nom à filtrer
        [string] value  : valeur à filtrer
	Retourne:
        [object] Liste des champs filtrés
    Remarques:
        Toutes les listes de champs qui posséde le champs 'name' avec la valeur 'value' sont éliminées
    */
	filterValue : function(fields,name,value,exclude){
        var new_fields = new Array();

        if(typeof(exclude)=="undefined")
            exclude=false;

        //ne filtre pas les champs manquants
        var x = 0;
        for(var i=0;i<fields.length;i++)
        {
            if(typeof(fields[i][name])!='undefined' && fields[i][name]==value && (exclude==false))
            {
                new_fields.push(fields[i]);
                x++;
            }
            else if((typeof(fields[i][name])=='undefined' || fields[i][name]!=value) && (exclude==true)){
                new_fields.push(fields[i]);
                x++;
            }
        }

        return new_fields;
    },
    
    /*
    Filtre les champs par callback
	Argument:
        [object]   fields   : liste des champs
        [function] callback : bInsert callback(field)
	Retourne:
        [object] Liste des champs filtrés
    */
	filter : function(fields,callback){
        var new_fields = new Array();

        if(typeof(exclude)=="undefined")
            exclude=false;

        //ne filtre pas les champs manquants
        var x = 0;
        for(var i=0;i<fields.length;i++)
        {
            if(callback(fields[i]))
            {
                new_fields.push(fields[i]);
                x++;
            }
        }

        return new_fields;
    },
    
    /*
    Filtre les champs par valeur
	Argument:
        [object] fields : liste des champs
        [string] name   : nom à filtrer
        [string] value  : valeur à filtrer
	Retourne:
        [object] Liste des champs filtrés
    Remarques:
        Toutes les listes de champs qui posséde la champs 'name' avec la valeur 'value' sont éliminées
    */
	searchFields : function(fields,search,exclude){
        var new_fields = new Array();
        
        //ne filtre pas les champs manquants
        var x = 0;
        for(var i=0;i<fields.length;i++)
        {
            var cur = fields[i];
            for(var name in cur)
            {
                var value = cur[name];
                if(typeof(value)=="string" && wfw.search.string(search,value,wfw.search.MATCH_WORDS|wfw.search.MATCH_WHOLE_WORD))
                {
                    wfw.puts("add "+i);
                    new_fields.push(fields[i]);
                    x++;
                    break;
                    break;
                }
            }
        }

        return new_fields;
    },

    /*
    Enumére les champs par valeurs
	Argument:
        [object] fields : liste des champs
        [string] filter : le nom du champ de référence pour le filtrage
	Retourne:
        [object] Liste des champs trié par valeurs (voir remarques)
    Remarques:
        Format de la liste des champs:
            fields["value"] = {
                [object] fields1,
                [object] fields2,
                [object] fields3,
                ...
            }
    */
	enumByValues : function(fields,filter){
        var values = new Array();

        //ne filtre pas les champs manquant
        var x = 0;
        for(var i=0;i<fields.length;i++)
        {
            if(typeof(fields[i][filter])!='undefined')
            {
                var str_value = fields[x][filter];
                if(typeof(values[str_value])=='undefined')
                    values[str_value] = new Array(); //stock les champs de cette valeur
                values[str_value].push(fields[i]);
                x++;
            }
        }

        return values;
    },
    /*
    Retourne le type d'un champ
	Argument:
        [object] fields : Liste des champs
        [string] name   : Nom du champ à tester
	Retourne:
        [string] Type de champ (voir remarques)
    Remarques:
        Le type de champ peut être une des valeurs suivantes :
            "bool"    : champs avec deux valeurs possible 'yes' ou 'no'
            "numeric" : champs numeriques
            "text"    : champs à choix multiples
    */
    fieldsType : function(fields,name)
    {
        //bool ?
        var selection = this.enumByValues(fields,name);
        if(length(selection) == 2 && (typeof(selection["yes"]) && typeof(selection["no"])))
            return "bool";
            
        var fields = this.filterName(fields,name);

        //numerique ?
        var i=0;
        while(i<fields.length && (typeof(fields[i][name])=="number"))
            i++;
        if(i==fields.length)
            return "numeric";

        //texte
        return "text";
    },
    /*
    Reorganise les éléments
	Argument:
        [HTMLElement] parent   : parent des éléments à trier
        [object]      fields   : liste des champs correspondant aux éléments
        [bool]        bReverse : si true, inverse le tri
	Retourne:
        rien
    */
	sortElements : function(parent,fields,bReverse)
    {
        if(bReverse){
            for(var key=0; key<fields.length; key++){
                objInsertNode(fields[key].node,parent,null,INSERTNODE_BEGIN);
            }
        }
        else{
            for(var key=fields.length-1; key>=0; key--){
                objInsertNode(fields[key].node,parent,null,INSERTNODE_BEGIN);
            }
        }
    },
    
    /*
    Reorganise et insert les éléments
	Argument:
        [HTMLElement] parent   : parent des éléments
        [object]      fields   : liste des champs
        [bool]        bReverse : si true, inverse le tri
	Retourne:
        rien
    */
	insertElements : function(parent,fields,bReverse)
    {
        if(bReverse){
            for(var key=0; key<fields.length; key++){
                objInsertNode(nodeCloneNode(fields[key].node,true),parent,null,INSERTNODE_BEGIN);
            }
        }
        else{
            for(var key=fields.length-1; key>=0; key--){
                objInsertNode(nodeCloneNode(fields[key].node,true),parent,null,INSERTNODE_BEGIN);
            }
        }
    },
    
    
    /*
    Tri les éléments par nom de champs
	Argument:
        [HTMLElement] parent     : parent des éléments à trier
        [object]      field_name : nom des champs à trier
        [bool]        bReverse   : inverse le tri
	Retourne:
        rien
    */
    sortElementsBy : function(parent,field_name,bReverse) {
        //scan les elements a la recherche de criteres de selections
        var fields = wfw.ext.sort.fieldsFromElement(objGetChild(parent,null));
        //tri les champs
        fields = wfw.ext.sort.sortFields(fields,field_name);
        //reorganise les elements
        this.sortElements(parent,fields,bReverse);
    },
    
    /*
    Affiche/Cache les éléments
	Argument:
        [HTMLElement] parent   : parent des éléments à trier
        [object]      fields   : champs correspondant aux éléments
	Retourne:
        rien
    */
	showElements : function(parent,fields)
    {
        var all = this.fieldsFromElement(objGetChild(parent));

        //cache tout les elements
        for(var item in all)
            wfw.style.addClass(all[item].node,"wfw_hidden");

        //affiche uniquement les elements du filtre
        for(var key in fields)
            wfw.style.removeClass(fields[key].node,"wfw_hidden");
    },
    
	hideElements : function(parent,fields)
    {
        var all = this.fieldsFromElement(objGetChild(parent));

        //affiche tout les elements
        for(var item in all)
            wfw.style.removeClass(all[item].node,"wfw_hidden");

        //cache uniquement les elements du filtre
        for(var key in fields)
            wfw.style.addClass(fields[key].node,"wfw_hidden");
    },
    
    //tri une liste de nombre
    //tab=list d'entiers ou float
    //n=taille de la liste a trier
    //methode: tri par insertion
    //procedure: decale chaque element en arriere jusqu a trouver son nombre supperieur
    /*sortNumList : function(tab, ofs, n){
        for(var i=ofs+1; i<n; i++){
            var j = i;
            while( (j > ofs) && (tab[j-1] > tab[j])){
                var save_j = tab[j];
                tab[j] = tab[j-1];
                tab[j-1] = save_j;
                j--;
            }
        }
        return tab;
    },*/
    //tri une liste de nombre
    //tab=list d'entiers ou float
    //n=taille de la liste a trier
    //methode: javascript
    //procedure: par comparaison
    sortNumList : function(tab){
        return tab.sort(wfw.ext.sort.cmpNum);
    },

    //tri une liste de caracteres
    //tab=list de textes
    //n=taille de la liste a trier
    //methode: javascript
    //procedure: par comparaison
    sortAlphaList : function(tab){
        return tab.sort(wfw.ext.sort.cmpStr);
    },

    //compare deux chene
    cmpStr : function(a,b){
        var i=0;
        //compare les caracteres
        while((i<a.length) && (i<b.length)){
            if(a[i] != b[i]){
                if(a[i]>b[i]) return 1;  // a apres b
                else          return -1; // a avant b
            }
            i++;
        }
        // egale
        if(a.length>b.length)      return 1;  // a apres b
        else if(a.length<b.length) return -1; // a avant b

        return 0; // identique en taille et contenu
    },

    //compare deux nombre
    //remarques: pour des nombres a virgule utiliser des points comme separateur, sinon le nombre sera tronque
    cmpNum : function(a,b){
        return (a<b) ? -1 : ((a>b) ? 1 : 0);
    }
};

/*
-----------------------------------------------------------------------------------------------
    (Experimental) Gestion de l'affichage 2D
-----------------------------------------------------------------------------------------------
*/
wfw.ext.p2d = {
    createLinearMove : function(callback,x1,y1,x2,y2)
    {
        var timer = wfw.timer.CreateFrequencyTimer();
        
        //timer.user.element = obj;

        timer.user.onUpdateFrame = function(time,t,frame)
        {
            this.cx = ((1.0-t)*x1) + (t*x2);
            this.cy = ((1.0-t)*y1) + (t*y2);
            //objSetAbsXY(this.element, ((1.0-t)*x1) + (t*x2), ((1.0-t)*y1) + (t*y2));
            callback(this);
        };
        return timer;
    },
    createBezierMove2deg : function(callback,ptsA,ptsB,ptsC,ptsD)
    {
        var timer = wfw.timer.CreateFrequencyTimer();
        
        //timer.user.element = obj;

        timer.user.onUpdateFrame = function(time,t,frame)
        {
            this.cx = (Math.pow((1-t),3) * ptsA.x) + ((3*t) * Math.pow((1-t),2) * ptsB.x) + ((3*Math.pow(t,2)) * (1-t) * ptsC.x) + ( Math.pow(t,3) * ptsD.x);
            this.cy = (Math.pow((1-t),3) * ptsA.y) + ((3*t) * Math.pow((1-t),2) * ptsB.y) + ((3*Math.pow(t,2)) * (1-t) * ptsC.y) + ( Math.pow(t,3) * ptsD.y);
            callback(this);
        };
        return timer;
    }
};

/*
-----------------------------------------------------------------------------------------------
    (Experimental) Placement des elements
-----------------------------------------------------------------------------------------------
*/
wfw.ext.placement = {
    right:1,
    left:2,
    top:3,
    bottom:4,

    /*retourne le plus large des elements de la liste*/
    max_width : function(elements){
        //max largeur
        var width=0;
        for(var i=0;i<elements.length;i++){
            var ow=objGetW(elements[i]);
            if(ow>width){
                width=ow;
            }
        }
        return width;
    },
    /*retourne le plus haut des elements de la liste*/
    max_height : function(elements){
        //max hauteur
        var height=0;
        for(var i=0;i<elements.length;i++){
            var oh=objGetH(elements[i]);
            if(oh>height){
                height=oh;
            }
        }
        return height;
    },
    grid : function(parent,width,height){

        var parentw = objGetW(parent);
        var parenth = objGetH(parent);
        var childList = objGetChildren(parent);

        //max
        if(!width) width=this.max_width(childList);
        if(!height) height=this.max_height(childList);
        
        var max_by_line = parentw/width;

        var grid = wfw.ext.object.grid(max_by_line, childList.length/max_by_line);
        var rectList = grid.get_rectangles(width,height);
        for(var i=0;i<childList.length;i++){
       /* alert(rectList[i].width());
        alert(rectList[i].height());
        alert(rectList[i].left);*/
            objSetW(childList[i],rectList[i].width());
            objSetH(childList[i],rectList[i].height());
            objSetXY(childList[i],rectList[i].left,rectList[i].top);
        }
    },

    // !! experimental !!
    dock : function(desc,element,to,placement){
        var id = objGetAtt(element,"id");
        if(empty(id))
            return null;

        if(typeof(to._wfw_docked)=='undefined')
            to._wfw_docked = new Object();

        //
        var label_element = document.createElement("div");
        label_element.appendChild(document.createTextNode(desc));
        objSetClassName(label_element,"docking_label");
        objSetEvent(label_element,"click",
                    function(e){
                        if(this.attach.style.display=="block")
                            this.attach.style.display="none";
                        else
                            this.attach.style.display="block";
                    }
        );
        objSetEvent(label_element,"mouseover",
                    function(e){
                        this.attach.style.display="block";
        objFireEvent(to,'resize');
                    }
        );
        objSetEvent(label_element,"mouseout",
                    function(e){
                        this.attach.style.display="none";
        objFireEvent(to,'resize');
                    }
        );
        label_element.attach = element;
        label_element.appendChild(element);
        
        //
        element.style.display = "none";

        //
        var dock = new Object();
        dock["label_element"] = label_element;
        dock["element"] = element;

        to._wfw_docked[id]=dock;
        to.appendChild(label_element);

        var listName=((to==window) ? "wfw_window" : "wfw_element");

        wfw.event.SetCallback( // window
            listName,
            "resize",
            "onDockResize",
            wfw.ext.placement.onDockResize
        );
        
        wfw.event.ApplyTo(to, listName);

        objFireEvent(to,'resize');

        return id;
    },
    
    // !! experimental !!
    onDockResize : function(e){
        if(typeof(this._wfw_docked)=='undefined')
            return;
        var docked = this._wfw_docked;
        var x = objGetX(this);
        var y = objGetY(this);
        var w = objGetW(this);
        var h = objGetH(this);

        for(item in docked){
            objSetXY(docked[item].label_element,x,y);
           // x+=4+objGetW(docked[item].label_element);
            y+=4+objGetH(docked[item].label_element);
        }
    }

};
function objFireEvent(self,event){

    //IE
    if(self.fireEvent)
    {
        self.fireEvent('on'+event);
    }
    //Gecko based browsers
    if(document.createEvent)
    {
        var evt = document.createEvent('HTMLEvents');
        if(evt.initEvent)
            evt.initEvent(event, true, true);
        if(self.dispatchEvent)
            self.dispatchEvent(evt);
    }
}
/*
-----------------------------------------------------------------------------------------------
    Objets de l'espace cartesien
-----------------------------------------------------------------------------------------------
*/
wfw.ext.object = {
    //Rectangle
    rectangle : function(left,top,right,bottom){
        var obj=new Object();
        //parametres
        obj["left"]=left;
        obj["top"]=top;
        obj["right"]=right;
        obj["bottom"]=bottom;
        //retourne la largeur
        obj["width"]=function(){
            return this.right-this.left;
        };
        //retourne la hauteur
        obj["height"]=function(){
            return this.bottom-this.top;
        };
        //retourne la hauteur
        obj["x1"]=function(){
            return parseInt(this.left);
        };
        obj["x2"]=function(){
            return parseInt(this.right);
        };
        obj["y1"]=function(){
            return parseInt(this.top);
        };
        obj["y2"]=function(){
            return parseInt(this.bottom);
        };
        obj["w"]=function(){
            return this.x1()-this.x2();
        };
        obj["h"]=function(){
            return this.y1()-this.y2();
        };
        obj["abs_w"]=function(){
            var w = this.x1()-this.x2();
            if(w<0)
                w=-w;
            return w;
        };
        obj["abs_h"]=function(){
            var h = this.y1()-this.y2();
            if(h<0)
                h=-h;
            return h;
        };
        return obj;
    },
    //Cercle
    circle : function(diameter){
        var obj=new Object();
        //parametres
        obj["diameter"]=diameter;
        //retourne la position d'un point sur le cercle
        obj["position_from_radian"]=function(rad,distance){
            return this.position(
                Math.cos(rad)*distance,
                Math.sin(rad)*distance
            );
        };
        return obj;
    },
    //Position a 2 dimensions
    position : function(x,y){
        var obj=new Object();
        //parametres
        obj["x"]=x;
        obj["y"]=y;
        obj["x1"]=function(){
            return parseInt(this.x);
        };
        obj["y1"]=function(){
            return parseInt(this.y);
        };
        return obj;
    },
    //Grille
    grid : function(width,height){
        var obj=new Object();
        //parametres
        obj["width"]=width;
        obj["height"]=height;
        //retourne une liste de toute les cellules de la grille
        obj["get_rectangles"]=function(w,h){
            var array = new Array();
            for(var y=0;y<this.height;y++){
                for(var x=0;x<this.width;x++){
                    array.push(wfw.ext.object.rectangle(w*x,h*y,w*(x+1),h*(y+1)));
                }
            }
            return array;
        };
        //retourne la position d'une des cellules de la grille
        obj["get_index_position"]=function(index){
            var pos = this.position(
                0,
                index/this.width
            );
            pos.x = index-(pos.y*this.width);
            return pos;
        };
        return obj;
    }
};
/*
-----------------------------------------------------------------------------------------------
    Objets de l'espace cartesien
-----------------------------------------------------------------------------------------------
*/
wfw.ext.utils = {
    //deplie un element
    unroll_element : function(element,timeLength)
    {
        //anime le scrolling
        var timer = wfw.timer.CreateFrequencyTimer();
        timer.user.element = element;
        timer.user.start_h = objGetH(element);
        timer.user.end_h = objGetOrgH(element);
        timer.bAutoRemove = true;

        timer.user.onStart = function()
        {
        };
        //cree un movement de haut en bas
        timer.user.onUpdateFrame = function(time,normTime,frame)
        {
            objSetH(this.element,this.start_h+(this.end_h-this.start_h)*normTime);
        };
        //
        timer.user.onFinish = function(time,normTime,frame)
        {
            objSetH(this.element,this.end_h);
        };

        timer.set_frame_per_seconde(100);
        timer.start(timeLength);

        return timer;
    },
    //replie un element
    roll_element : function(element,timeLength)
    {
        //anime le scrolling
        var timer = wfw.timer.CreateFrequencyTimer();
        timer.user.element = element;
        timer.user.start_h = objGetH(element);
        timer.user.end_h = 0;
        timer.bAutoRemove = true;

        timer.user.onStart = function()
        {
        };
        //cree un movement de haut en bas
        timer.user.onUpdateFrame = function(time,normTime,frame)
        {
            objSetH(this.element,this.start_h*(1.0-normTime));
        };
        //
        timer.user.onFinish = function(time,normTime,frame)
        {
            objSetH(this.element,this.end_h);
        };

        timer.set_frame_per_seconde(100);
        timer.start(timeLength);

        return timer;
    },
    auto_roll_element : function(element,timeLength){
        return wfw.ext.utils.is_rolled_element(element) ? wfw.ext.utils.unroll_element(element,timeLength) : wfw.ext.utils.roll_element(element,timeLength);
    },
    is_rolled_element : function(element)
    {
        if(objGetH(element)==0)
            return true;
        return false;
    },
    //
    callRequestListXARG : function(reqList,param,async)
    {
        if(typeof async == "undefined")
            async=false;
        for(var i=0;i<reqList.length;i++)
        {
            var result = true;
            var name = reqList[i].url;
            if(typeof(reqList[i]["name"])=="string")
                name=reqList[i].name;
                    
            //execute ?      
            if(typeof(reqList[i]["check_execution"])=="function" && !reqList[i].check_execution(reqList)){
                wfw.puts("wfw.ext.utils.callRequestListXARG: "+name+" [skip]");
                continue;
            }

            //execute
            wfw.request.Add(
                null,
                reqList[i].url,
                reqList[i].args,
                wfw.utils.onCheckRequestResult_XARG,
                {
                    onsuccess:function(obj,args)
                    {
                        wfw.puts(this.name+" [success]");
                        this.req.response = args;
                        this.req.obj = obj;
                        if(typeof(this.req.onsuccess)=="function")
                            this.req.onsuccess(obj,args);
                    },
                    onfailed:function(obj,args)
                    {
                        wfw.puts(this.name+" [failed]");
                        this.req.response = args;
                        this.req.obj = obj;
                        if(typeof(this.req.onfailed)=="function")
                            this.req.onfailed(obj,args);
                        result = false;
                    },
                    onerror:function(obj)
                    {
                        wfw.puts(this.name+" [error]");
                        if(typeof(this.req.onerror)=="function")
                            this.req.onerror(obj);
                        result = false;
                    },
                    name:name,
                    req:reqList[i]
                },
                async
            );
            if(result==false && !reqList[i].continue_if_failed)
                i=reqList.length;//termine
        }

        //result
        if(param)
        {
            if(result && typeof(param.onsuccess)=="function")
            {
                param.onsuccess(reqList);
            }
            else if(!result && typeof(param.onfailed)=="function")
            {
                param.onfailed(reqList);
            }
        }
    }
};

/*
-----------------------------------------------------------------------------------------------
    modules
-----------------------------------------------------------------------------------------------
*/
wfw.ext.module={
	use : true,
    //
    init : function(){
        for(var obj_name in wfw.ext.module){
            var obj = wfw.ext.module[obj_name];
            if((typeof(obj)=="object") && (typeof(obj["init"])=="function")){
                wfw.puts('------- Initializing '+obj_name+' module');
                obj.init();
            }
        }
    }
};


/*
-----------------------------------------------------------------------------------------------
    languages
-----------------------------------------------------------------------------------------------
*/
wfw.ext.lang={
	use : true,
    //
    init : function(){
    },
    
    //actualise les textes des elements input
    updateStates : function(form){
        wfw.puts("wfw.ext.lang.updateStates: TEST");
        
        //obtient l'element form
        var form = $doc(form);
        if (!form)
            return false;

        //scan les elements
        nodeEnumNodes(
            form,
            function (node, conditions) {
                if (node.nodeType == ELEMENT_NODE) {
                    //
                    // multilangage input
                    //
                    var data_type = objGetAtt(node, 'wfw_lang');
                    if (data_type != null){
                      wfw.puts("wfw.ext.lang.updateStates: check "+objGetAtt(node,"name")+":"+objGetAtt(node,"id")+" data_type="+data_type);
                        //obtient les donnees
                        var states = wfw.states.fromElement(node,null,{exists:true,name:"wfw_ext_lang"});
                        if(states != null){
                            states.text[states.cur_lang]=objGetAtt(node,"value");
                            wfw.puts("wfw.ext.lang.updateStates: update ("+objGetAtt(node,"value")+") to->"+p.lang[p.current]);
                           }
                           else wfw.puts("wfw.ext.lang.updateStates: update NO!");
                    }
                }
                return true; // continue l'enumeration
            },
            false
        );
    },

    //change le langage de tout les input enfants du noeud "form"
    changeLang : function(form,langage){
 //       wfw.puts("wfw.ext.lang.changeLang: TEST , "+langage);
        //obtient l'element form
        var form = $doc(form);
        if (!form)
            return false;

        //scan les elements
        nodeEnumNodes(
            form,
            function (node, conditions) {
                if (node.nodeType == ELEMENT_NODE) {
                    //
                    // multilangage input
                    //
                    var data_type = objGetAtt(node, 'wfw_lang');
  //                  wfw.puts("wfw.ext.lang.changeLang: "+objGetAtt(node,"name")+":"+objGetAtt(node,"id")+" data_type="+data_type);
                    if (data_type != null)
                        wfw.ext.lang.changeInputLang(node, langage);
                }
                return true; // continue l'enumeration
            },
            false
        );
    },

    //definit le texte d'un input
    setInputString : function(element,text,langage){
        //obtient les donnees
        var states = wfw.states.fromElement(element,null,{exists:true,name:"wfw_ext_lang"});
        if(!states)
            return false;

        //recherche le langage et retourne le texte
        for(var i=0; i<states.lang.length; i++){
            if(states.lang[i] == langage){
                states.text[i] = text;
                return true;
            }
        }
        
        return false;
    },
    
    //obtient le texte d'un input
    getInputString : function(element,langage){
        //obtient les donnees
        var states = wfw.states.fromElement(element,null,{exists:true,name:"wfw_ext_lang"});
        if(!states)
            return null;

        //recherche le langage et retourne le texte
        for(var i=0; i<states.lang.length; i++){
            if(states.lang[i] == langage){
                return states.text[i];
            }
        }
        
        return null;
    },
    
    //change le langage d'un input
    changeInputLang : function(element,langage){
        //obtient les donnees
        var states = wfw.states.fromElement(element,null,{exists:true,name:"wfw_ext_lang"});
        if(!states)
            return null;
        //recherche le langage et assigne le texte
        for(var i=0; i<states.lang.length; i++){
            if(states.lang[i] == langage){
                states.current = i;
                objSetAtt(element,"value",states.text[i]);
                wfw.puts("wfw.ext.lang.changeInputLang: "+objGetAtt(element,"id")+", "+langage);
                return true;
            }
        }
        return false;
    },
    /*
        Attache plusieurs textes a un input
        Parametres:
            [HTMLElement] element : Element Input
            [array]       lang    : Tableau indéxé des langages
    */
    attachToInput : function(element,lang,options){
        options = object_merge({
            keyChange : false // change le langage en cours avec la touche ENTER
        },options,false);

        //
        if(!lang.length){
            wfw.puts("wfw.ext.lang.attachToInput: no input langage for Input Element");
            return false;
        }
        //attache les données a l'element
        var states = wfw.states.fromElement(element,{current:0, lang:lang, text:{} },{name:"wfw_ext_lang"});
        objSetAtt(element, 'wfw_lang', strimplode(lang,",",true));

        //initialise les textes
        for(var i=0; i<lang.length; i++)
            states.text[i]="";
        
        //sauve le texte de depart
        states.text[0] = objGetAtt(element,"value");

        //[change] actualise le texte
        objSetEvent(element,"change",function(e,p){
            p.text[p.current] = objGetAtt(element,"value");
            wfw.puts("wfw.ext.lang.attachToInput: update ("+objGetAtt(element,"value")+") to->"+p.lang[p.current]);
        },states);

        //[enter] change de langage
        if(options.keyChange){
            objSetEvent(element,"keypress",function(e,p){
                if(e.keyCode==13)//enter, change de langage
                {
                    //enregistre le texte en cours
                    p.text[p.current] = objGetAtt(element,"value");
                    //change de langage
                    if(++p.current >= p.lang.length)
                        p.current=0;
                    objSetAtt(element,"value",p.text[p.current]);
                    
                    wfw.puts("wfw.ext.lang.attachToInput: change ("+objGetAtt(element,"id")+") to->"+p.lang[p.current]);
                }
                return true;
            },states);
        }

 //       wfw.puts("wfw.ext.lang.attachToInput: create from "+objGetAtt(element,"id"));
            
        return true;
    }
};


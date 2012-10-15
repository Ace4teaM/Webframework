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
    document
-----------------------------------------------------------------------------------------------
*/
wfw.ext.document = {
	use : true,
    contentElement : "wfw_ext_content",
	center : false,
	copyright : false,
    onUnlockScreen : null,//evenement callback pour le dialogue...
	dialogStack : [],
    waitForCloseEvent : false,//indique si le dialogue affiché est en cours de fermeture (si un dialogue est créé durant cette periode, il sera mit en file d'attente)

	init : function()
    {
        if("string"==typeof(this.contentElement))
            this.contentElement = docGetElement(document,this.contentElement);
        
        //centre automatiquement le contenu
        if(this.contentElement && this.center)
        {
            wfw.event.SetCallback( // window
                "wfw_window",
                "resize",
                "eventCenterBodyContent",
                wfw.ext.document.eventCenterContent
            );

          /*  wfw.event.SetCallback( // window
                "wfw_window",
                "load",
                "eventCenterBodyContent",
                wfw.ext.document.eventCenterContent
            );*/
        }

        //ajoute un copyright à la fin du document
        if(this.contentElement && this.copyright)
        {
            wfw.event.SetCallback( // window
                "wfw_window",
                "load",
                "eventCreateCopyright",
                wfw.ext.document.eventCreateCopyright
            );
        }
    },
    
    /*
        Retourne la classe CSS associée à une extension de fichier
        Arguments:
            [string] ext : Extension du fichier sans point, ex: "jpeg"
        Retourne:
            Nom de classe à utiliser avec la classe 'wfw_icon'
        Exemple:
            "JPEG" retourne le nom de classe "fmt_jpg"
    */
	extensionToClassName : function(ext){
        switch(ext.toLowerCase())
        {
            case "jpeg":
            case "jpg":
            case "pdf":
            case "png":
            case "tiff":
            case "wbmp":
            case "bmp":
            case "gif":
            case "txt":
            case "xml":
            case "css":
                return "fmt_"+ext;
        }
        return "file_empty";
    },
    
    /*
        Dialogue simple
        Membres:
            [object]   user     : Données utilisateur
            [bool]     center   : Experimentale. Si true, le dialogue est centré sur l'écran
            [string]   cssClass : Class CSS du dialogue
            [function] onInit   : Callback appelé lors de la création du dialogue
            [function] onPrint  : Callback appelé à chaque affichage du dialogue
            [function] onPop    : Callback appelé lors du dépilement du dialogue vers l'écran (utilisé pour centrer le dialogue)
            [function] onPush   : Callback appelé lors de l'empilement du dialogue en queue (utilisé pour centrer le dialogue)
        Membres Privés:
            [HTMLElement] parent_node   : Reçoit l'élément parent du dialogue
    */
    DIALOG : {
        user : {},
        _base : "wfw.REF",
        name : "wfw.ext.document.DIALOG",//wfw.REF: object base name
        parent_node     : null,
        center          : true,
        cssClass        : "wfw_ext_dialog-content wfw_ext_unselectable",
        onInit          : function(){ },
        onPrint         : function(){ },
        onPop         : function(){
            if(this.center == true){
                this.centerDialog();
            }
        },
        onPush         : function(){
            //Experimentale: centre verticalement le dialogue
            //(Si le dialogue sort de l'ecran il sera coupé verticalement est inaccessible)
            if(this.center == true){
                this.uncenterDialog();
            }
        },
        //constructeur
        _construct : function(obj){
            //obtient l'id de la reference
            /*obj.id = wfw.states.getRefId(obj);
            if(obj.id == null)
            {
                wfw.puts("DIALOG:_construct: obj instance is not a global 'states' variable");
                return;
            }*/
            /*if(empty(obj.id))
                obj.id = "wfw_ext_dialog_"+uniqid();*/
            if(empty(obj.parent_node == null))
                obj.parent_node = document.createElement("div");
        
            objSetAtt(obj.parent_node,"id",obj.id);
            if(!empty(obj.cssClass))
                wfw.style.addClass(obj.parent_node,obj.cssClass);
        },
        
        /*initialise le dialogue*/
        init : function(){
            //insert le contenu
            this.dlg_content = document.createElement('div');
            if(this.dlg_content==null)
                return false;
            objInsertNode(this.dlg_content,this.parent_node,null,INSERTNODE_END);
            objSetAtt(this.dlg_content,"id",this.id+"_content");
            wfw.style.addClass(this.dlg_content,"wfw_ext_dialog_content");
        },
        
        /*ecrit du contenu*/
        print : function(content){
            switch(typeof(content))
            {
                case "string":
                    var text = document.createElement("div");
                    objSetInnerText(text,content);
                    objInsertNode(text,this.dlg_content,null,INSERTNODE_END);
                    return text;
                case "object":
                    if(typeof(content.tagName)!="undefined")//element
                    {
                        objInsertNode(content,this.dlg_content,null,INSERTNODE_END);
                        return content;
                    }
                    break;
            }
            return null;
        },
        
        /*
            Obtient l'élément de contenu du dialogue en cours
            Arguments:
                [string] [find_class] : Optionel. Nom de la classe à rechercher, par défaut "wfw_ext_dialog_content"
            Retourne:
                [HTMLElement] L'Elément DIV, parent du contenu dialogue. Si null, aucun dialogue n'est visible
        */
	    findContent : function(find_class)
        {
            var dlg;

            //par defaut obtient l'element de contenu
            if(typeof(find_class)=="undefined")
                find_class = this.content_class;

            //recherche le contenu
            var cur = objGetChild(this.parent_node);
            while(cur){
                if(wfw.style.haveClass(cur,find_class))
                    return cur;
                cur = objGetNext(cur);
            }

            return null;
        },
        
        //Experimentale: centre verticalement le dialogue
        //(Si le dialogue sort de l'ecran il sera coupé verticalement est inaccessible)
        centerDialog : function(){
            var container = $doc("wfw_ext_dialog");
            var height = objGetH(this.parent_node);
            var demi_height = height/2;
            if(demi_height){
                container.style.marginTop="-"+demi_height+"px";
                container.style.top="50%";
            }
        },

        //Experimentale: centre verticalement le dialogue
        //(Si le dialogue sort de l'ecran il sera coupé verticalement est inaccessible)
        uncenterDialog : function(){
            var container = $doc("wfw_ext_dialog");
            container.style.marginTop="0px";
            container.style.top="0px";
        }
    },
    
    /*
        Dialogue étendu, avec en-tete et pied de page
        Base:
            DIALOG
        Membres:
            [string]          title    : Texte affiché dans la barre de titre
            [function/object] onOK     : Callback appelé lors l'utilisateur clique sur "OK" / Options de la fonction "printOK()"
            [function/object] onCancel : Callback appelé lors l'utilisateur clique sur "Annuler" / Options de la fonction "printCancel()"
    */
    DIALOG_BOX : {
        _base      : "wfw.ext.document.DIALOG",
        //REF options
        name       : "wfw.ext.document.DIALOG_BOX",
        //DIALOG options
        cssClass   : "wfw_ext_dialog-content wfw_ext_dialog_fixed_size wfw_ext_unselectable",
        //Membres
        title      : "",
        onPop      : function(){},
        onPush     : function(){},
        //dialog button callback/options
        onOK       : null,
        onCancel   : null,
        //constructeur
        _construct : function(obj){
        },
        /*initialize*/
        init: function () {
            //insert l'header
            this.dlg_header = document.createElement('div');
            if(this.dlg_header==null)
                return false;
            objInsertNode(this.dlg_header,this.parent_node,null,INSERTNODE_END);
            objSetAtt(this.dlg_header,"id",this.id+"_header");
            wfw.style.addClass(this.dlg_header,"wfw_ext_dialog_box_header");
            objSetInnerText(this.dlg_header,this.title);

            //insert le contenu
            this.dlg_content = document.createElement('div');
            if(this.dlg_content==null)
                return false;
            objInsertNode(this.dlg_content,this.parent_node,null,INSERTNODE_END);
            objSetAtt(this.dlg_content,"id",this.id+"_content");
            wfw.style.addClass(this.dlg_content,"wfw_ext_dialog_box_content");
        
            //insert le footer
            this.dlg_footer = document.createElement('div');
            if(this.dlg_footer==null)
                return false;
            objInsertNode(this.dlg_footer,this.parent_node,null,INSERTNODE_END);
            objSetAtt(this.dlg_footer,"id",this.id+"_footer");
            wfw.style.addClass(this.dlg_footer,"wfw_ext_dialog_box_footer");
            
            //insert le bouton OK
            if(this.onOK == "function")
                this.onOK = {clickEvent: this.onOK};
            if(this.onOK)
            {
                wfw.ext.document.printOK(this,"wfw_ext_dialog_box_footer",this.onOK);

                wfw.event.SetCallback(this.id+"_ok","click","onOK",
                    function(e,dlg)
                    {
                        //callback...
                        wfw.ext.document.waitForCloseEvent = true; //insert les dialogues après la fermeture de celui-ci (utilisé par insertDialog)
                        return false;//ne conserve pas ce callback
                    },
                    true, // exécuter avant 'unlock_screen' (permet la création de dialogues pendant l'événement onOk)
                    this
                );
            }
        
            //insert le bouton Cancel
            if(this.onCancel == "function")
                this.onCancel = {clickEvent: this.onCancel};
            if(this.onCancel)
            {
                wfw.ext.document.printCancel(this,"wfw_ext_dialog_box_footer",this.onCancel);

                wfw.event.SetCallback(this.id+"_cancel","click","onCancel",
                    function(e,dlg)
                    {
                        //callback...
                        wfw.ext.document.waitForCloseEvent = true; //insert les dialogues après la fermeture de celui-ci (utilisé par insertDialog)
                        return false;//ne conserve pas ce callback
                    },
                    true, // exécuter avant 'unlock_screen' (permet la création de dialogues pendant l'événement onCancel)
                    this
                );
            }
        },
        /*print content*/
        print: function (content) {
            switch(typeof(content))
            {
                case "string":
                    var text = document.createElement("div");
                    objSetInnerText(text,content);
                    objInsertNode(text,this.dlg_content,null,INSERTNODE_END);
                    return text;
                case "object":
                    if(typeof(content.tagName)!="undefined")//element
                    {
                        objInsertNode(content,this.dlg_content,null,INSERTNODE_END);
                        return content;
                    }
                    break;
            }
            return null;
        }
    },
    
    /*
        Ajoute un message d'avertissement en tête de document
        Arguments:
            [string] text : Text à insérer
            [string] link : Optionnel, URL à lier au texte
    */
	adversing : function(text,link){
        var copydiv = document.createElement('div'); // passer les attributs directement a createElement, compatible IE7-
        objSetClassName(copydiv,"wfw_ext_adversing");
        objSetInnerText(copydiv,text);
        if(link)
            objSetEvent(copydiv,"click",function(e){window.open(link);});
        objInsertNode(copydiv,document.body,null,INSERTNODE_BEGIN);
    },
    
    /*
        Obtient l'objet dialogue en cours
        Retourne:
            [DIALOG|DIALOG_EX] l'objet du dialogue. Si null, aucun dialogue n'est visible
    */
	getDialog : function()
    {
        var dlg = this.getDialogElement();

        if(dlg)
            return wfw.states.fromElement(dlg);

        return null;
    },
    
    /*
        Obtient l'élément du dialogue visible
        Retourne:
            [HTMLElement] L'Elément DIV, parent du contenu. Si null, aucun dialogue n'est visible
    */
	getDialogElement : function()
    {
        var dlg;

        if(dlg=docGetElement(document,"wfw_ext_dialog"))
        {
            var dlg_content = objGetChild(dlg,"div");
            if(!dlg_content || wfw.style.haveClass(dlg_content,"wfw_hidden"))
                return null;
            return dlg_content;
        }

        return null;
    },
    
    /*
        Obtient un élément de contenu dans le dialogue visible
        Arguments:
            [string] find_class : Nom de la classe à rechercher, par défaut "wfw_ext_dialog_content"
        Retourne:
            [HTMLElement] L'Elément DIV, parent du contenu dialogue. Si null, aucun dialogue n'est visible
    */
	getDialogContent : function(find_class)
    {
        var dlg;

        if(dlg=$doc("wfw_ext_dialog"))
        {
            //obtient le premier dialogue
            var dlg_content = objGetChild(dlg,"div");
            if(!dlg_content || wfw.style.haveClass(dlg_content,"wfw_hidden"))
                return null;
            //recherche dans le contenu
            var cur = objGetChild(dlg_content,"div");
            while(cur){
                if(wfw.style.haveClass(cur,find_class))
                    return cur;
                cur = objGetNext(cur);
            }
        }

        return null;
    },
    
    /*
        [ PRIVATE ]
        Insert un nouveau dialogue dans la pile
        Arguments:
            [DIALOG]      dialog   : L'Objet dialogue à insérer
            [DIALOG]      ref      : L'Objet dialogue de référence (si introuvable l'element est placé en fin de pile: équivaut à "first"). Ignoré, si "position" est égale à "first" ou "last"
            [int/string]  position : Position dans l'index ou "after", "last", "first", "visible"
    */
	insertDialog : function(dialog,ref,position)
    {
        //verouille l'ecran
        wfw.ext.document.lockScreen();
        
        //obtient le conteneur
        var container = $doc("wfw_ext_dialog");
        if(!container)
        {
            //crée l'élément dialogue
            if((container = document.createElement('div'))==null)
                return false;
            objSetAtt(container,"id","wfw_ext_dialog");
            objInsertNode(container,$doc("wfw_ext_lock"),null,INSERTNODE_BEGIN);
        }
        
        //Si le dialogue doit etre afficher en premier, pousse le dialogue existant (si le dialogue existant est en cours de fermeture, le nouveau dialogue est placé en tête de pile "first")
        var cur_dialog = this.getDialogElement();
        if(position == "visible"){
            if((cur_dialog != null) && (this.waitForCloseEvent==false))
            {
                this.pushDialog();
                wfw.puts("wfw.ext.document.newDialog: Pousse le dialogue existant");
            }
            //si en cours de fermeture, place le dialogue en attente
            if(this.waitForCloseEvent){
                position = "first";
            }
        }
        if(position == "first" && (cur_dialog == null))
            position = "visible";

        //obtient l'objet du dialogue
        var states = wfw.states.fromId(dialog.id);
        
        //initialise l'id
        objSetAtt(dialog.parent_node,"id",dialog.id);
        
        //initialise le dialogue
        dialog.init();
        //[user callback]
        if(typeof(dialog.onInit)=="function")
            dialog.onInit(this);

        //[push event]
        if(typeof(dialog.onPush) == "function")
            dialog.onPush();
            
        //cache l'élément
        wfw.style.addClass(dialog.parent_node,"wfw_hidden");

        //repositionne le dialogue dans la pile
        switch(position){
            //après l'élément choisi
            case "after":
                //Positionne l'élément
                objInsertNode(dialog.parent_node,container,ref.parent_node,INSERTNODE_AFTER);
                //recherche l'element "ref"dans la pile
                var index=0;
                while(index<this.dialogStack.length && this.dialogStack[index]!=ref.parent_node)
                    index++;
                this.dialogStack.splice(index,0,dialog.parent_node);
                break;
            //dernier dialogue à afficher (début de pile)
            case "last":
                objInsertNode(dialog.parent_node,container,null,INSERTNODE_END);
                this.dialogStack.unshift(dialog.parent_node);
                break;
            //premier dialogue à afficher (fin de pile)
            case "first":
                objInsertNode(dialog.parent_node,container,cur_dialog,INSERTNODE_AFTER);
                this.dialogStack.push(dialog.parent_node);
                break;
            //visible (en dehors de la pile)
            case "visible":
                objInsertNode(dialog.parent_node,container,null,INSERTNODE_BEGIN);
                this.dialogStack.push(dialog.parent_node);
                this.popDialog();//affiche ce dialogue
                break;
        }
        
        return dialog;
    },
    /*
        [ PRIVATE ]
        Déplace le dialogue visible en fin de pile (invisible)
        Retourne:
            [bool] true, si le dialogue en cours à été empilé. false, si aucun dialogue n'existe
    */
	pushDialog : function()
    {
        var dlg;
        if(dlg=docGetElement(document,"wfw_ext_dialog"))
        {
            var dlg_content = objGetChild(dlg,"div");
            if(!dlg_content)
                return false;
            this.dialogStack.push(dlg_content);
            wfw.style.addClass(dlg_content,"wfw_hidden");
            
            //callback
            var states = wfw.states.fromElement(dlg_content);
            if(typeof(states.onPush) == "function")
                states.onPush();

            return true;
        }

        return false;
    },
    /*
        [ PRIVATE ]
        Insert le dernier dialogue en pile à l'écran
        Remarques:
            Si un dialogue visible est présent il est supprimé
    */
	popDialog : function()
    {
        //supprime le dialogue visible si present
        var cur = this.getDialogElement();
        if(cur){
            //objet et callback
            var states = wfw.states.fromElement(cur);
            if(typeof(states.onPop) == "function")
                states.onPop();
            //noeud HTML
            nodeRemoveNode(cur);
            //objet
            states.remove();
            //wfw.states.remove(objGetAtt(cur,"id"));
        }

        //affiche le dialogue suivant
        if(this.dialogStack.length)
        {
            var element = this.dialogStack[this.dialogStack.length-1];
            wfw.style.removeClass(element,"wfw_hidden");
            this.dialogStack.pop();
            //initialise le contenu
            var dialog = wfw.states.fromElement(element);
            if(typeof(dialog.onPrint)=="function")
                dialog.onPrint();
            //callback
            if(typeof(dialog.onPop) == "function")
                dialog.onPop();
            return true;
        }

        //aucun dialogue en attente
        return false;
    },
    
    /*
        [ PRIVATE ]
        retourne l'identifiant du dialogue visible
    */
	getDialogID : function()
    {
        var dlg;
        if(dlg=docGetElement(document,"wfw_ext_dialog"))
        {
            dlg_content = objGetChild(dlg,"div");
            return objGetAtt(dlg_content,"id");
        }

        return false;
    },

    /*
        [ PRIVATE ]
        ferme le dialogue visible et affiche le suivant
    */
	closeDialog : function(){
        this.waitForCloseEvent = false;
        //ferme le dialogue en cours et affiche le precedent ?
        if(this.popDialog() == true)
            return;
        //supprime le contenu restant
        this.unprintScreen();
        //dévérouille l'écran
        this.unlockScreen();
        //UnlockScreen callback...
        if(typeof(this.onUnlockScreen) == "function")
            this.onUnlockScreen();
        //ne conserve pas les callbacks une fois exécutés
        this.onUnlockScreen=null;
    },
    
    /*
        [ PRIVATE ]
        ferme un dialogue de la pile ou le dialogue visible
    */
	removeDialog : function(dialog){
        var index = this.dialogStack.indexOf(dialog.parent_node);
        //dans la pile ?
        if(index!=-1){
            this.dialogStack.splice(index, 1);
            //noeud HTML
            nodeRemoveNode(dialog.parent_node);
            //objet
            dialog.remove();
        }
        //visible ?
        else{
            if(dialog.parent_node == this.getDialogElement())
                this.closeDialog();
        }
    },
    
    /*
        [ PRIVATE ]
        retourne l'index d'un dialogue dans la pile
    */
	findDialogIndex : function(dialog){
        return this.dialogStack.indexOf(dialog.parent_node);
    },
    
    /*
        Vérrouille un élément du document et l'affiche dans un dialogue
        Arguments:
            [HTMLElement] element  : L'Elément à vérrouiller
            [string]      options  : Paramétres du dialogue (DIALOG_BOX)
        Options:
            [function]  onOK(element)     : Optionnel, callback lorsque l'utilisateur clique sur OK
            [function]  onCancel(element) : Optionnel, callback lorsque l'utilisateur clique sur Annuler
        Remarques:
            lockElement initialise un objet "wfw.ext.document.DIALOG_BOX"
            L'Elément vérrouiller est passé en argument au callback onOK et onCancel
            Après la fermeture du dialogue l'élément est restoré à son emplacement d'origine dans le document (l'élément n'est pas dupliqué)
    */
    lockElement : function(element,options)
    {
        var dlg = $new(wfw.ext.document.DIALOG_BOX, object_merge(options,{
            user:{
                element : element,
                old_parent : objGetParent(element)//obtient l'ancien parent de l'element
            },
            onInit: function () {
                this.print(this.user.element);
                //insert les boutons
                if(typeof(this.onOK)=="function")
                {
                    wfw.event.SetCallback(this.id+"_ok","click","onOK",//remplace le callback par defaut de DIALOG_BOX.init()
                        function(e,dlg)
                        {
                            wfw.ext.document.waitForCloseEvent = true;
                            //callback...
                            dlg.onOK(dlg.user.element);
                            //restore l'element à son emplacement d'orginie
                            objInsertNode(dlg.user.element,dlg.user.old_parent,null,INSERTNODE_END);
                            return false;//ne conserve pas ce callback
                        },
                        true, // exécuter avant 'unlock_screen' (permet la creation de dialogues pendant l'événement onOK)
                        this
                    );
                }
        
                if(typeof(this.onCancel)=="function")
                {
                    wfw.event.SetCallback(this.id+"_cancel","click","onCancel",//remplace le callback par defaut de DIALOG_BOX.init()
                        function(e,dlg)
                        {
                            wfw.ext.document.waitForCloseEvent = true;
                            //callback...
                            dlg.onCancel(dlg.user.element);
                            //restore l'element a son emplacement d'orginie
                            objInsertNode(dlg.user.element,dlg.user.old_parent,null,INSERTNODE_END);
                            return false;//ne conserve pas ce callback
                        },
                        true, // exécuter avant 'unlock_screen' (permet la creation de dialogues pendant l'événement onCancel)
                        this
                    );
                }

                //ajuste la taille du dialogue au contenu
                //objSetAtt(dlg,"width",objGetW(this.element)+"px");
                //objSetAtt(dlg,"height",objGetH(this.element)+"px");

            }
        }));

        return wfw.ext.document.insertDialog(dlg,null,"visible");
    },
    
    /*
        Vérrouille un document HTML dans un dialogue
        Arguments:
            [string]    file_name  : Chemin du fichier HTML à vérrouiller
            [string]    onPrint    : Print callback (voir wfw.ext.document.newDialog)
        Options:
            [function]  onOK       : Optionnel, callback lorsque l'utilisateur clique sur OK
            [function]  onCancel   : Optionnel, callback lorsque l'utilisateur clique sur Annuler
        Remarques:
            lockFrame ajoute automatiquement le bouton 'Ok' et 'Annuler'
            Format du callback 'onOK' et 'onCancel':
                function (frame_document, frame_window );
    */
    lockFrame : function(file_name,options)
    {
        var dlg = $new(wfw.ext.document.DIALOG_BOX, object_merge(options,{
            user:{
                file_name : file_name,
                doc_frame : null,
                wnd_frame : null,
                frame_obj : null
            },
            onInit: function () {
                //cree la frame
                var frame_obj = document.createElement("iframe");

                if(frame_obj==null)
                {
                    wfw.puts("wfw.ext.document.lockFrame : iframe element creation failed !");
                    return false;
                }
                objSetAtt(frame_obj,"src",this.user.file_name);
                objSetAtt(frame_obj,"id",this.id+"_frame");
                objSetAtt(frame_obj,"name",filename(this.user.file_name));
                wfw.style.addClass(frame_obj,"wfw_ext_dialog_frame");
        
                //insert le contenu
                this.print(frame_obj);
        
                //insert les boutons
                if(typeof(this.onOK)=="function")
                {
                    wfw.event.SetCallback(this.id+"_ok","click","onOK",
                        function(e,dlg)
                        {
                            //callback...
                            wfw.ext.document.waitForCloseEvent = true; //utilisé par newDialog
                            dlg.onOK(dlg.user.doc_frame, dlg.user.wnd_frame);

                            return false;//ne conserve pas ce callback
                        },
                        true, // exécuter avant 'unlock_screen' (permet la creation de dialogues pendant l'événement onOK)
                        this
                    );
                }
        
                if(typeof(this.onCancel)=="function")
                {
                    wfw.event.SetCallback(this.id+"_cancel","click","onCancel",
                        function(e,dlg)
                        {
                            //callback...
                            wfw.ext.document.waitForCloseEvent = true;
                            dlg.onCancel(dlg.user.doc_frame, dlg.user.wnd_frame);

                            return false;//ne conserve pas ce callback
                        },
                        true, // exécuter avant 'unlock_screen' (permet la creation de dialogues pendant l'événement onCancel)
                        this
                    );
                }
            
                //fonction de redimentionnement de la frame
                var resize_event = function(dlg)
                {
                    //ajuste la taille de la frame à son contenu
                    var frame_content = docGetElement(dlg.user.doc_frame, "wfw_ext_content");
                    if(frame_content)
                    {
                        //utilise l'element 'wfw_ext_content'
                        var w,h;
                        //if(w=objGetW(frame_content))
                        //    objSetAtt(frame,"width",w+"px");
                        if(h = objGetH(frame_content))
                            objSetAtt(dlg.user.frame_obj,"height",h+"px");
                        //centre le dialogue sur l'ecran
                        //wfw.ext.document.centerDialog(w);
                    }
                    else
                    {
                        //utilise les dimentions du 'body' 
                        //objSetAtt(frame,"width",doc.body.scrollWidth+"px");
                        objSetAtt(dlg.user.frame_obj,"height",doc.body.scrollHeight+"px");
                        //centre le dialogue sur l'ecran
                        //wfw.ext.document.centerDialog(doc.body.scrollWidth);
                    }
                };

                //au chargement du document ...
                objSetEvent(frame_obj,"load",function(e,dlg)
                {
                    //assigne le document au globales
                    dlg.user.doc_frame = this.contentWindow.document;
                    dlg.user.wnd_frame = this.contentWindow;
                    dlg.user.frame_obj = this;

                    //ajuste la taille de la frame à son contenu
                    resize_event(dlg);
                    /*var frame_content = docGetElement(this.contentWindow.document, "wfw_ext_content");
                    if(!frame_content)
                        wfw.puts("wfw.ext.document.lockFrame : can't get 'wfw_ext_content' element !");
                    else
                    {
                        //var body = docGetNode(this.contentWindow.document,"html/body");
                        var w,h;
                        if(w=objGetW(frame_content))
                            objSetAtt(this,"width",w+"px");
                        if(h = objGetH(frame_content))
                            objSetAtt(this,"height",h+"px");
                    }*/

                    //initialise le titre
                    if(empty(dlg.title)){
                        var title_node = docGetNode(this.contentWindow.document,"html/head/title");
                        if(title_node)
                            objSetInnerText($doc(dlg.id+"_header"),objGetInnerText(title_node));
                    }

                    // si le contenu change..
                    objSetEvent(this.contentWindow.document,"change",function(e,dlg)
                    {
                        //redimentionne
                        resize_event(dlg);
                    },dlg);
                },this);
            }
        }));
        
        return wfw.ext.document.insertDialog(dlg,null,"visible");
    },
    
    lockImage : function(image_path,options){
    
        var dlg = $new(wfw.ext.document.DIALOG, object_merge(options,{
        center:true,
            onInit: function () {
                var dlg = this;

                var image = document.createElement('img');
                if(image==null)
                    return false;
                objSetAtt(image,"src",image_path);
        
                var resize = function(image){

                    var timer = wfw.timer.CreateFrequencyTimer({
                        frame_per_second : 24,
                        duration: 500,
                        bAutoRemove : true,
                        user: {
                            dialog : dlg,
                            image : image,
                            org_width : 0,
                            org_height : 0,
                            max_h : objGetH($doc("wfw_ext_lock"))-10,
                            max_w : objGetW($doc("wfw_ext_lock"))-10
                        },
                        onStart    : function(){
                            this.user.org_width = this.user.image.width;
                            this.user.org_height = this.user.image.height;
//                            wfw.puts("org_width="+this.user.org_width);
//                            wfw.puts("org_height="+this.user.org_height);
                        },
                        onUpdateFrame    : function(time,normTime,frame){
                            var w = this.user.org_width;
                            var h = this.user.org_height;

                            if(h>this.user.max_h){
                                h = this.user.max_h;
                                w = parseInt((this.user.org_width/this.user.org_height)*h);
                            }
                            this.user.image.width = parseInt(normTime*w);
                            this.user.image.height = parseInt(normTime*h);
                            /*
                            this.user.image.style.marginLeft = "-"+parseInt(this.user.image.width/2.0)+"px";
                            this.user.image.style.marginTop = "-"+parseInt(this.user.image.height/2.0)+"px";
*/
                            this.user.dialog.centerDialog();
                        }
                    });

                    timer.start();
                };
        

                //
                //wfw.event.SetCallback( "wfw_window", "resize", "lockImageResize", function(event,p){ resize(p.image,p.parent); } , false, { image:image, parent:div } );
                //wfw.event.ApplyTo(window,"wfw_window");

                //[chargement]
                objSetEvent(image,"load",function(e,dlg){
                    resize(this);
                    dlg.print(this);
                },this);
        
                //[chargement]
                objSetEvent(image,"error",function(e,p){
                    wfw.puts("Can't load image");
                },null);
        
                //[click]
                objSetEvent(image,"click",function(e,p){
                    //wfw.event.UnSetCallback( "wfw_window", "resize", "lockImageResize" );
                    //objRemoveChildNode($doc("wfw_ext_lock"),null,REMOVENODE_ALL);
                    wfw.ext.document.unlockScreen();
                },null);
        
                //[click]
                objSetEvent($doc("wfw_ext_lock"),"click",function(e,p){
                    //wfw.event.UnSetCallback( "wfw_window", "resize", "lockImageResize" );
                    //objRemoveChildNode($doc("wfw_ext_lock"),null,REMOVENODE_ALL);
                    wfw.ext.document.unlockScreen();
                },null);
            }
        }));

        return wfw.ext.document.insertDialog(dlg,null,"visible");
    },

    /*
        [ PRIVATE ]
        Obtient l'élément de vérrouillage de l'écran
    */
	getLock : function()
    {
        return docGetElement(document,"wfw_ext_lock");
    },

    /*
        [ PRIVATE ]
        Insert l'élément de vérrouillage de l'écran
    */
	insertLock : function()
    {
        var dlg,black;

        if(dlg=docGetElement(document,"wfw_ext_lock"))
            return dlg;

        //crée l'élément
        if((dlg = document.createElement('div'))==null)
            return false;
        objSetAtt(dlg,"id","wfw_ext_lock");
        objInsertNode(dlg,document.body,null,INSERTNODE_BEGIN);
        
        //crée l'élément
        /*if((black = document.createElement('div'))==null)
            return false;
        objInsertNode(black,dlg,null,INSERTNODE_BEGIN);*/
        
        return dlg;
    },

    /*
        Insert un élément ou un texte au dialogue en cours
        Arguments:
            [string/HTMLElement]  obj  : Texte ou élément à insérer
        Remarques:
            Si le dialogue n'existe pas il est créé, 'print' n'ajoute pas de bouton 'Ok' ou 'Annuler'
        Retourne:
            [DIALOG] L'objet dialog qui reçoit le contenu
    */
	print : function(obj)
    {
        var dlg = this.getDialog();
        if(!dlg && !(dlg = wfw.ext.document.insertDialog($new(wfw.ext.document.DIALOG),null,"visible"))){
            return false;
        }
        
        dlg.print(obj);
        
        return dlg;
    },

    /*
        [ PRIVATE ]
        vérrouille l'écran
    */
	lockScreen : function()
    {
        return this.insertLock();
    },
    
    /*
        [ PRIVATE ]
        déverouille l'écran
    */
	unlockScreen : function(){
        var lock = this.getLock();
        if(lock)
            nodeRemoveNode(lock);
    },
    
    /*
        Vérifie si un dialogue est actuellement affiché
        Retourne:
            [bool] true si un dialogue existe sinon false
    */
	isPrintedScreen : function(){
        if(this.getDialogElement()!=null)
            return true;
        return false;
    },
    
    /*
        Insert un bouton 'OK' au dialogue
        Parametres:
            [DIALOG] dialog              : L'Objet dialogue
            [string] insertIntoClassName : Class CSS de l'élément qui reçoit le bouton
            [object] options             : Optionnel, Paramètres du bouton (voir Options)
        Options:
            [string]   buttonText : Text du bouton OK
            [string]   classCSS   : Class CSS de l'élément input[button]
            [function] clickEvent : Callback "click"
            [bool]     autoClose  : Ferme le dialogue lorsque l'utilisateur click sur le bouton
        Remarques:
            L'Identificateur du bouton est initialisé avec (wfw.ext.document.getDialogID()+"_ok")
            La liste d'événements multiples est initialisé avec l'id du bouton (ci-dessus), utilisez wfw.event.SetCallback pour ajouter un événement
        Retourne:
            [HTMLElement] L'Elément INPUT du bouton
    */
	printOK : function(dialog, insertIntoClassName,options)
    {
        options = object_merge({
            buttonText : "OK",
            classCSS   : "wfw_ext_dialog_ok wfw_ext_button_text",
            clickEvent : null,
            autoClose : true//ferme le dialogue après l'événement "click"
        },options);
        
        var button_obj;
        var content = dialog.findContent(insertIntoClassName);
        if(!content){
            wfw.puts("printOK can't found content with class :"+insertIntoClassName);
            return null;
        }

        //identificateur du bouton ( utilisé aussi pour la liste d'evenements )
        var btn_id = dialog.id+"_ok";

        //boutton existant ?
        if(button_obj = $doc(btn_id))
            return button_obj;

        //ajoute le bouton OK
        button_obj = document.createElement("input");
        objSetAtt(button_obj,"id",btn_id);
        objSetAtt(button_obj,"type","button");
        objSetAtt(button_obj,"value",options.buttonText);
        wfw.style.addClass(button_obj,options.classCSS);

        //[clickEvent]
        if(typeof options.clickEvent == "function")
            wfw.event.SetCallback(btn_id,"click","clickEvent",options.clickEvent,false,dialog);

        //[Fermeture du dialogue]
        if(options.autoClose)
            wfw.event.SetCallback(btn_id,"click","unlock_screen",
                function(e,dlg)
                {
                    wfw.puts("printOK: fermeture...");
                    wfw.ext.document.closeDialog();

                    return false;//ne pas conserver pas ce callback
                },
                false,
                dialog
            );

        wfw.event.ApplyTo(button_obj,btn_id);

        //insert a la fin
        return objInsertNode(button_obj,content,null,INSERTNODE_END);
    },
    
    /*
        Insert un bouton 'Annuler' au dialogue
        Parametres:
            [DIALOG] dialog              : L'Objet dialogue
            [string] insertIntoClassName : Class CSS de l'élément qui reçoit le bouton
            [object] options             : Optionnel, Paramètres du bouton (voir Options)
        Options:
            [string]   buttonText : Text du bouton OK
            [string]   classCSS   : Class CSS de l'élément input[button]
            [function] clickEvent : Callback "click"
            [bool]     autoClose  : Ferme le dialogue lorsque l'utilisateur click sur le bouton
        Remarques:
            L'Identificateur du bouton est initialisé avec (wfw.ext.document.getDialogID()+"_cancel")
            La liste d'événements multiples est initialisé avec l'id du bouton (ci-dessus), utilisez wfw.event.SetCallback pour ajouter un événement
        Retourne:
            [HTMLElement] L'Elément INPUT du bouton
    */
	printCancel : function(dialog, insertIntoClassName,options)
    {
        options = object_merge({
            buttonText : "Annuler",
            classCSS   : "wfw_ext_dialog_ok wfw_ext_button_text",
            clickEvent : null,
            autoClose : true//ferme le dialogue après l'événement "click"
        },options);
        
        var button_obj;
        var content = dialog.findContent(insertIntoClassName);
        if(!content)
            return null;

        //identificateur du bouton ( utilise aussi pour la liste d'evenements )
        var btn_id = dialog.id+"_cancel";

        //boutton existant ?
        if(button_obj=$doc(btn_id))
            return button_obj;

        //ajoute le bouton
        button_obj=document.createElement("input");
        objSetAtt(button_obj,"id",btn_id);
        objSetAtt(button_obj,"type","button");
        objSetAtt(button_obj,"value",options.buttonText);
        wfw.style.addClass(button_obj,options.classCSS);
        
        //[clickEvent]
        if(typeof options.clickEvent == "function")
            wfw.event.SetCallback(btn_id,"click","clickEvent",options.clickEvent,false,dialog);

        //[Fermeture du dialogue]
        if(options.autoClose)
            wfw.event.SetCallback(btn_id,"click","unlock_screen",
                function(e,dlg)
                {
                    wfw.puts("printCancel: fermeture...");
                    wfw.ext.document.closeDialog();

                    return false;//ne pas conserver pas ce callback
                },
                false,
                dialog
            );

        wfw.event.ApplyTo(button_obj,btn_id);

        //insert a la fin
        return objInsertNode(button_obj,content,null,INSERTNODE_END);
    },
    
    /*
        Supprime le dialogue en cours
    */
	unprintScreen : function()
    {
        var dlg = docGetElement(document,"wfw_ext_dialog");
        if(dlg)
            nodeRemoveNode(dlg);
    },
    
    /*
        Supprime le dialogue en cours et déverrouille l'écran
    */
	clearScreen : function()
    {
        this.unprintScreen();
        this.unlockScreen();
    },
    
    /*
        Affiche un dialogue de confirmation
        Arguments:
            [string]    text     : Texte de la question
            [function]  onOK     : Optionnel, callback lorsque l'utilisateur clique sur OK
            [function]  onCancel : Optionnel, callback lorsque l'utilisateur clique sur Annuler
            [object]    options  : Paramétres du dialogue
        Remarques:
            Les boutons 'OK' et 'Annuler' sont ajoutés
    */
	confirm : function(text,onOK,onCancel,options){
        var dlg = $new(wfw.ext.document.DIALOG_BOX, object_merge({
            title : text,
            onOK : {
                clickEvent : onOK,
                buttonText : "Oui"
            },
            onCancel : {
                clickEvent : onCancel,
                buttonText : "Non"
            }
        },options, false));
        return wfw.ext.document.insertDialog(dlg,null,"visible");
    },
    

    /*
        Affiche un dialogue avec un contenu et un bouton 'OK'
        Arguments:
            [string/HTMLElement]   content : Texte de la question
            [object]               options : Paramétres du dialogue
    */
	messageBox : function(content,options){
        var dlg = $new(wfw.ext.document.DIALOG, object_merge({
            onInit: function () {
                this.print(content);
                wfw.ext.document.printOK(this,"wfw_ext_dialog_content",options);
            }
        },options));
        return wfw.ext.document.insertDialog(dlg,null,"visible");
    },
    
	openLoadingBox : function(options){
        if($doc("&wfw_ext_document_LoadingBox") != null)
            return;
        var dlg = $new(wfw.ext.document.DIALOG_BOX, object_merge({
            title : "Merci de patienter",
            id:"wfw_ext_document_LoadingBox",
            onInit : function(){
                var image = document.createElement('span');
                if(image!=null)
                {
                    wfw.style.addClass(image,"wfw_icon_loading");
                    //insert
                    this.print(image);
                }
            }
        },options, false));
        return wfw.ext.document.insertDialog(dlg,null,"visible");
    },
    
	closeLoadingBox : function(){
        var dialog = $doc("&wfw_ext_document_LoadingBox");
        if(dialog == null)
            return;
        wfw.ext.document.removeDialog(dialog);
    },
        
    // Evenements

	eventCenterContent : function(e){
        if(wfw.ext.document.contentElement){
            var win_width  = docGetClientW(document);
            var body_width = objGetW(wfw.ext.document.contentElement);
            if(win_width>body_width)
                wfw.ext.document.contentElement.style.marginLeft = ((win_width - body_width) / 2)+'px';
            else
                wfw.ext.document.contentElement.style.marginLeft = '0px';
        }
    },

	eventCreateCopyright : function(e){
        var copydiv = document.createElement('div'); // passer les attributs directement a createElement, compatible IE7-
        
        objSetClassName(copydiv,"wfw_ext_copyright");
        objSetInnerText(copydiv,wfw.copyright);
        objSetEvent(copydiv,"click",wfw.ext.document.eventOpenIDInformatik);
        document.body.appendChild(copydiv);
    },

	eventOpenIDInformatik : function(e){
        var wnd = window.open(wfw.url);
    }
};


/*
-----------------------------------------------------------------------------------------------
    Page Navigator
-----------------------------------------------------------------------------------------------
*/
wfw.ext.navigator = {
	use     : true,
	doc     : null,//instance de cXMLDefault
	navDoc  : "default.xml",
	navNode : "site/index",
	modNode : "site/config/module",
    bOk         : false,// si true les membres, pageId, pageNode et pageIndex sont initialises
    pageId      : null, // identificateur du document en cours
    pageNode    : null, // noeud de la page qui a charger le document (arbre)
    pageIndex   : null, // noeud de la page qui a charger le document (index)
    location    : null, // noeud de la page qui a charger le document (index)
    probablyMobileNavigator : false, // si true, le navigateur est probablement executé sur un téléphone mobile ou une tablette

    /*
        Initialise le composant
        Remarque:
			Cette fonction est appelée par wfw.ext.initAll()
    */
	init : function()
    {
        if (!/android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)) {
            this.probablyMobileNavigator = true;
        }
		
        //
        if(class_exists("cXMLDefault"))
        {
            this.doc = new cXMLDefault();
            this.doc.Initialise("default.xml");
        }
        else
            wfw.puts("warning cXMLDefault class not exists");

        //charge le sitemap "default.xml"
        if("string"==typeof(this.navDoc)){
            wfw.puts("load navigation doc..."+this.navDoc);
            try{
                var doc = wfw.http_get(this.navDoc);
                if(!doc){
                    wfw.puts("can't load navigation doc: "+this.navDoc);
                    return false;
                }
                if(!(doc = xml_parse(doc))){
                    wfw.puts("can't parse xml navigation doc: "+this.navDoc);
                    return false;
                }
                this.navDoc = doc;
            }
            catch(e){
                switch(e.name){
                    case "NS_ERROR_DOM_BAD_URI":
                        wfw.puts("can't load navigation doc: "+this.navDoc);
                        break;
                    default:
                        wfw.puts("can't load navigation doc: Unexpected error");
                        break;
                }
                //return wfw.checkError(e);
            }
        }
        
        if(typeof(this.navDoc)=='object')
        {
            //obtient le noeud module
            if("string"==typeof(this.modNode))
                this.modNode = docGetNode(this.navDoc,this.modNode);

            //obtient le noeud d'index
            if("string"==typeof(this.navNode))
                this.navNode = docGetNode(this.navDoc,this.navNode);

            //ok ajoute l'événement de chargement
            if(typeof(this.navNode)=='object')
            {
                wfw.event.SetCallback( // window
                    "wfw_window",
                    "load",
                    "eventLoadNavigation",
                    wfw.ext.navigator.onLoad
                );
                return true;
            }
            else
                wfw.puts("wfw.ext.navigator.init: navigation doc/node not ready");
        }  
        return false;
    },
    
    /*
        Retourne l'identifiant du site
        Retourne:
            [string] identifiant du site
    */
    getId : function(name){
        //document ?
        if((typeof(this.navDoc)!='object')){
            wfw.puts("wfw.ext.navigator.getId: no document");
            return null;
        }
        //obtient le noeud des modules
        var cur = this.modNode = docGetNode(this.navDoc,"/site/id");
        //recherche le module
        if(cur!=null)
            return trim(objGetInnerText(cur));

        return null;
    },
    
    /*
        Retourne le nom du site
        Retourne:
            [string] identifiant du site
    */
    getName : function(name){
        //document ?
        if((typeof(this.navDoc)!='object')){
            wfw.puts("wfw.ext.navigator.getName: no document");
            return null;
        }
        //obtient le noeud des modules
        var cur = this.modNode = docGetNode(this.navDoc,"/site/name");
        //recherche le module
        if(cur!=null)
            return trim(objGetInnerText(cur));

        return null;
    },

    /*
        Vérifie la presence d'un module
        Arguments:
            [string] name : Nom du module
        Retourne:
            [XMLElement] Noeud sur la configuration du module. Si null, le module n'existe pas 
    */
    getModule : function(name){
        //document ?
        if((typeof(this.navDoc)!='object')&&(typeof(this.modNode)!='object')){
            wfw.puts("wfw.ext.navigator.getModule: no document or module node");
            return null;
        }
        //obtient le noeud des modules
        var cur = this.modNode;
        //recherche le module
        while(cur!=null)
        {
            if(objGetAtt(cur,"id") == name)
                return cur;

            cur = objGetNext(cur,"module");
        }
        return null;
    },
    
    /*
        Retourne un tableau de données sur la page actuelle
        Retourne:
            [object] Tableau associatif (voir remarques)
        Remarques:
            Valeur de retour:
                [objet]  treeNode  : Noeud XML correspondant dans l'arbre de navigation
                [objet]  indexNode : Noeud XML correspondant dans l'index
                [string] pageId    : Identificateur de la page
    */
    getPageInfos : function(){
        if(!this.bOk){
            wfw.puts("getPageInfos not ready:"+this.bOk);
            return null;
        }
        var obj=new Object();
        obj["treeNode"]  = this.pageNode;
        obj["indexNode"] = this.pageIndex;
        obj["pageId"]    = this.pageId;
        return obj;
    },
    
    /*
        Obtient un noeud de l'index
        Parametres:
            [string] type : Nom de balise de l'élément désiré (ex: "page")
            [string] id   : Identificateur de l'élément. Si null, le premier élément est retourné
        Retourne:
            [XMLElement] Noeud trouvé. null, si introuvable.
    */
    getIndex : function(type,id)
    {
        //obtient le premier noeud
        type = type.toLowerCase();
        var node = objGetNode(this.navDoc.documentElement,"index/"+type);
        if(id == null)
            return node;

        //obtient par id
        id = id.toLowerCase();
        while(node!=null){
            var node_id = objGetAtt(node,'id');
            if((typeof(node_id)=='string') && (node_id.toLowerCase() == id))
                return node;
            node = objGetNext(node,'page'); // obtient le prochaine element
        }
        return null;
    },
    
    /*
        Obtient l'URI d'une page
        Parametres:
            [string] id   : Identificateur de la page
        Retourne:
            [string] URI de la page, null si introuvable.
    */
    getURI : function(id){
        var node;
        if((node = this.getIndex("page",id))==null)
            return null;
        return objGetInnerText(node);
    },
    
    /*
        Obtient la valeur d'un noeud de l'index
        Parametres:
            [string] type : Nom de balise de l'élément désiré (ex: "page")
            [string] id   : Identificateur de la balise (ex: "index")
        Retourne:
            [string] Valeur du noeud, null si introuvable.
    */
    getIndexValue : function(type,id){
        var node = this.getIndex(type,id);
        if(node!=null)
            return objGetInnerText(node);
        return null;
    },
    
	/*
		Obtient une page de l'index
        Parametres:
            [string]      page_id : Identificateur de la page. Si null, retourne le noeud de la page en cours
            [XMlDocument] [doc]   : Optionnel, document XML à utiliser pour la recherche.
		Retourne:
			[XMLElement] Noeud de l'élément 'page', null si introuvable.
	*/
    getPageIndex : function(page_id,doc){
        if(page_id==null)
            return this.pageIndex;

        if(typeof(doc)=="undefined")
            doc = this.navDoc.documentElement;
        else
            doc = doc.documentElement;

        page_id = page_id.toLowerCase();

        var node = objGetNode(doc,"index/page");
        while(node!=null)
		{
            var node_id = objGetAtt(node,'id');
            if((typeof(node_id)=='string') && (node_id.toLowerCase() == page_id))
                return node;
            /*else
                wfw.puts("find in "+node_id);*/
            node = objGetNext(node,'page'); // obtient le prochaine element
        }
        return null;
    },

	/*
		Obtient une noeud de l'arbre de navigation
        Parametres:
            [string]      page_id : Identificateur de la page. Si null, retourne le noeud de la page en cours
            [XMLDocument] doc     : Optionnel, document de navigation
		Retourne:
			[XMLElement] Noeud de l'élément 'page', null si introuvable.
	*/
    getPageNode : function(page_id,doc){
        if(page_id==null)
            return this.pageNode;

        if(typeof(doc)=="undefined")
            doc = this.navDoc.documentElement;
        else
            doc = doc.documentElement;

        page_id = page_id.toLowerCase();
        
        var node = objGetChild(doc,"tree");
        var result = nodeEnumNodes(
            node,
            function(node){
                if((node.nodeType == ELEMENT_NODE) && (node.tagName.toLowerCase() == page_id)){
                    return node;
                }
                return true;
            }
        );
        //echec?
        if(result==true)
            return null;
        return result;
    },
    
	/*
		Ouvre une page de l'abrorescence actuel
        Parametres:
            [string] name   : L'Identificateur de la page ou un des choix suivants: "#previous", "#next", "#index", "#parent", "#child"
            [string] target : Optionnel, fenêtre cible. Par défaut "_self"
            [object] args   : Optionnel, tableau associatif des arguments à passer à l'URL
            [string] anchor : Optionnel, ancre à ajouter à l'url
		Retourne:
			[bool] true en cas de succès, false si la page est introuvable.
	*/
    openPage : function(name,target,args,anchor)
    {
        var uri=null;
        var cur,find;
        if(typeof(target)!="string")
            target="_self";

        if(name.substr(0,1)=="#" && (cur=this.getPageNode(null)))
        {
            switch(name)
            {
                case "#previous":
                    if(find=objGetPrev(cur))
                        uri=this.getIndexValue("page",find.tagName);
                    break;
                case "#next":
                    if(find=objGetNext(cur))
                        uri=this.getIndexValue("page",find.tagName);
                    break;
                case "#parent":
                    if(find=objGetParent(cur))
                        uri=this.getIndexValue("page",find.tagName);
                    break;
                case "#child":
                    if(find=objGetChild(cur))
                        uri=this.getIndexValue("page",find.tagName);
                    break;
                case "#index":
                    uri=this.getIndexValue("page","index");
                    break;
            }
        }
        else
        {
            uri = this.getURI(name);
        }

        if(uri==null)
            return false;

        if(typeof(args)!="undefined")
            uri += "?"+wfw.uri.object_to_query(args,true);
        if(typeof(anchor)!="undefined")
            uri += "#"+anchor;

        window.open(uri,target);

        return true;
    },

    // events...

	onLoad : function(e){
        // recupere l'id de la page actuel
        var meta_tag = docGetElements(document,"meta");
        if(meta_tag==null)
            return;
        var i=0;
        while((i<meta_tag.length) && (objGetAtt(meta_tag[i],"http-equiv")!="wfw.page-id")){
            i++;
        }
        //introuvable?
        if(i==meta_tag.length){
            wfw.puts("this page as not meta-tag: wfw.page-id");
            return;
        }

        //obtient l'id
        wfw.ext.navigator.pageId = objGetAtt(meta_tag[i],"content");
        wfw.puts('page_id = '+wfw.ext.navigator.pageId);
        if(empty(wfw.ext.navigator.pageId))
            { wfw.puts('pageId not specified'); return; }

        // recherche les noeuds
        wfw.ext.navigator.pageIndex   = wfw.ext.navigator.getPageIndex(wfw.ext.navigator.pageId);
        if(!wfw.ext.navigator.pageIndex)
            { wfw.puts(wfw.ext.navigator.pageId+', index node is not found'); return; }
   
        wfw.ext.navigator.pageNode    = wfw.ext.navigator.getPageNode(wfw.ext.navigator.pageId);
        if(!wfw.ext.navigator.pageNode)
            { wfw.puts(wfw.ext.navigator.pageId+', tree node is not found'); return; }
        
        wfw.puts('navigation tree OK');
        wfw.ext.navigator.bOk = true;
    }
};

/*
-----------------------------------------------------------------------------------------------
    fieldlist
        Champs en liste
-----------------------------------------------------------------------------------------------
*/
wfw.ext.fieldlist = {
	use : true, //initialise le module au chargement
    fields : {},//list[wfw.ext.fieldlist.FIELD]
    
    /*
        Objet de champ
        Membres:
            [HTMLElement] list  : L'Elément HTML de la liste
            [HTMLElement] node  : L'Elément HTML du champ
            [HTMLElement] input : L'Elément Input du champ (Valeur du champ)
            [String]      name  : Nom du champ (Valeur de l'attribut 'name' dans l'élément 'input')
    */
    FIELD : {
        list   :null,
        node   :null,
        input  :null,
        name   :""
    },

    //intialise l'extention
	init : function()
    {
        wfw.event.SetCallback( // input ( l'utilisateur change le texte)
            "wfw_fieldlist_check",
            "change",
            "eventChangeInput",
            wfw.ext.fieldlist.eventChangeInput
        );
    },
    
    /*
        Recherche un élément vide
        Arguments:
            [HTMLElement] element      : L'Elément liste
            [HTMLElement] inputElement : Noeud de l'élément à rechercher
        Retourne:
            [wfw.ext.fieldlist.FIELD] Le champ trouvé. null si le champ est intouvable
    
    //retourne l'indice de l'element vide
	find_empty : function(element,fields)
    {
        if((element = $doc(element)) == null)
            return false;

        //recherche un element libre
        return $all(fields,function(field,key){
            if(empty(objGetAtt(field,"value")))
                return key;
        });

        return null;
    },*/
    
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
        var ret = $all(this.fields,function(list,key){
            return $all(list,function(field,key){
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
            var value = objGetAtt(list[cur].input,"value");
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
            [string/object] element : L'Elément/L'Identificateur parent de la liste
            [string] name           : Nom du champ à effacer
        Retourne:
            [HTMLElement] L'Elément effacé. null si introuvable
        Remarques:
            remove efface la valeur d'un champ. Le champ n'est pas supprimé de la liste mais invisible à l'utilisateur
    */
	remove : function(element,name)
    {
        if((element = $doc(element)) == null)
            return false;
            
        var id = objGetAtt(element,"id");

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
            objSetAtt(current.input,"value","");
            //rend l'input invisible
            wfw.style.addClass(current.node,"wfw_hidden");

            return current.input;
        }

        wfw.puts("wfw.ext.fieldlist.remove: "+name+" list is not defined");
        return null;
    },
    
    /*
        Supprime un champ de la liste
        Arguments:
            [string/object] element : L'Elément/L'Identificateur parent de la liste
            [string] name           : Nom du champ à supprimer
        Retourne:
            [bool] true si l'élément est supprimé. false si introuvable
        Remarques:
            deleteField supprime un champ de la liste, le champ est définitivement supprimé de la liste.
    */
	deleteField : function(element,name)
    {
        if((element = $doc(element)) == null)
            return false;
            
        var id = objGetAtt(element,"id");

        if(typeof(this.fields[id])=="undefined")
            return false;

        // liste les elements
        var list = this.getFields(id);

        //cache le champ
        if(typeof(list[name])!="undefined"){
            nodeRemoveNode(list[name].node);
            delete(list[name]);

            return true;
        }

        wfw.puts("wfw.ext.fieldlist.deleteField: "+name+" list is not defined");
        return false;
    },
    
    /*
        Efface tous les champs d'une liste
        Arguments:
            [string/object] element : L'Elément/L'Identificateur parent de la liste
        Retourne:
            [bool] true en cas de succès. false en cas d'échec
        Remarques:
            clearList efface tous les champs de la liste, les champs restes utilisables
    */
	clearList : function(element)
    {
        if((element = $doc(element)) == null)
            return false;
            
        var id = objGetAtt(element,"id");

        if(typeof(this.fields[id])=="undefined"){
            wfw.puts("wfw.ext.fieldlist.clearList: "+id+" list is not defined");
            return false;
        }
        
        var list = this.getFields(id);

        for(var item in list)
        {
            objSetAtt(list[item].input,"value","");
            //rend l'input invisible
            wfw.style.addClass(list[item].node,"wfw_hidden");
        }

        return true;
    },
    
    /*
        Supprime une liste et tous ses champs
        Arguments:
            [string/object] element : L'Elément/L'Identificateur parent de la liste
        Retourne:
            [bool] true en cas de succès. false en cas d'échec
        Remarques:
            deleteList supprime définitevement la liste et tous ses champs. Le noeud de l'élément est supprimé.
    */
	deleteList : function(element)
    {
        if((element = $doc(element)) == null)
            return false;
            
        var id = objGetAtt(element,"id");

        if(typeof(this.fields[id])=="undefined"){
            wfw.puts("wfw.ext.fieldlist.deleteList: "+id+" list is not defined");
            return false;
        }
        
        var list = this.getFields(id);

        for(var item in list)
        {
            nodeRemoveNode(list[item].node);
            delete(list[item]);
        }

        return true;
    },
    
    /*
        Insert un élément à la liste
        Arguments:
            [string/HTMLElement]  element      : L'Elément/L'Identificateur parent de la liste
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

        if((element = $doc(element)) == null)
            return false;

        //fieldset ?
        if(template.tagName.toLowerCase() != "fieldset")
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
        var element_id = objGetAtt(element,"id");
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
            //supprime
            //nodeRemoveNode(list[name].node);
            //delete(list[name]);
        }

        //intialise le template
        var new_element = wfw.ext.listElement.insertFields(template, element, {name:(name),value:(value)}, null, null, replacement);

        //obtient le champ INPUT
        var input_node = nodeEnumNodes(new_element,function(node){
            if((node.nodeType==ELEMENT_NODE) && (node.tagName.toLowerCase() == "input") && (objGetAtt(node,"type")=="text" || objGetAtt(node,"type")=="checkbox"))
                return node;
            return true;
        });
        if(input_node==true)
        {
            wfw.puts("wfw.ext.fieldlist.insertNew: INPUT node not found");
            return 2;
        }
        //ajoute à la liste
        /*list[name] = {
            "node":new_element,//fieldset
            "input":input_node,//input
            "name":name,
            "value":value,
            "list":element
        };*/
        list[name] = $new(wfw.ext.fieldlist.FIELD, { 
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
            [string/object] element : L'Elément/L'Identificateur parent de la liste
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
            att=object_merge(att,options);
        //
        if((element = $doc(element)) == null)
            return false;

        //check la valeur
        if(empty(value))
            return "empty";

        var id = objGetAtt(element,"id");

        // liste les elements
        var fields = this.getFields(id);
        
        // insert uniquement si la valeur n'existe pas déja
        if(att.uniq_value == true){
            for(var item in fields)
            {
                current = fields[item];
                if(objGetAtt(current.input,"value") == value)
                    return "duplicated";
            }
        }

        //recherche un champs vide et l'initialise
        for(var item in fields)
        {
            current = fields[item];
            if((att.insert_into!=null && att.insert_into==current.name) || (att.insert_into==null && empty(objGetAtt(current.input,"value"))))
            {
                //actualise le champs
                //current.value = value;
                //definit l'input
                objSetAtt(current.input,"value",value);
                //rend l'input visible
                wfw.style.removeClass(current.node,"wfw_hidden");

                //initilise les champs supplementaires
                if(att.add_fields != null)
                {
                    wfw.form.set_fields(current.node,att.add_fields);
                }
				
                return current.input;
            }
        }

        return null;
    },
    /*
        Liste les champs d'un élément
        Arguments:
            [string/object] element : L'Elément/L'Identificateur parent de la liste
        Retourne:
            [object] Tableau indexé des champs (FIELD type)
        Remarques:
            Les éléments enfants doivent être de types FIELDSET
    */
	list : function(element)
    {
        var value;

        if((element = $doc(element)) == null)
            return false;

        var i = 0;
        var fields = {};
        
        var child = objGetChild(element,"fieldset");
        while(child!=null){
            nodeEnumNodes(child,function(node){
                if((node.nodeType==ELEMENT_NODE) && (node.tagName.toLowerCase() == "input") && (objGetAtt(node,"type")=="text" || objGetAtt(node,"type")=="checkbox")){
                    fields[i++] = $new(wfw.ext.fieldlist.FIELD, { 
                        list  :element,
                        node  :child,//fieldset
                        input :node,//input
                        name  :objGetAtt(node,"name")
                    });

                    return false;
                }
                return true;
            },false);

            child = objGetNext(child,"fieldset");
        }

        return fields;
    },
    /*
        [ PRIVATE ]
    */
	initField : function(new_field,bInsertLegend)
    {
        //visible/invisible
        if(empty($value(new_field.input)))
            wfw.style.addClass(new_field.node,"wfw_hidden");
        else
            wfw.style.removeClass(new_field.node,"wfw_hidden");
            
        // assigne les evenements a l'element INPUT
        wfw.event.ApplyTo(new_field.input, "wfw_fieldlist_check");

        //ajoute la legende
        if(bInsertLegend)
        {
            //l'élément legende
            var legend = objGetChild(new_field.node,"legend");
            if(legend == null){
                legend = document.createElement("legend");
                objInsertNode(legend,new_field.node,null,INSERTNODE_BEGIN);
            }

            //ajoute l'icone de suppression
            var icon = objGetChild(legend,"span");
            if(icon == null){
                icon = document.createElement("span");
                objSetClassName(icon,"wfw_icon delete");
                objSetEvent(icon,"click",function(e,param){
                    wfw.ext.fieldlist.remove(param.list,param.name);
                }, new_field);
                objInsertNode(icon,legend,null,INSERTNODE_BEGIN);
            }
        }
    },
    
    /*
        Initialise les éléments d'une liste de champs
        Arguments:
            [string/object] element        : L'Elément/L'Identificateur parent de la liste
            [bool]          bInsertLegend  : Si true, insert la légende aux champs
        Retourne:
            [bool] true en cas de succès, false en cas d'erreur.
        Remarques:
            Les éléments enfants doivent être de types FIELDSET
    */
	initElement : function(element,bInsertLegend)
    {
        if((element = $doc(element)) == null)
            return false;

        if(typeof(bInsertLegend)=="undefined")
            bInsertLegend = true;

        var id = objGetAtt(element,"id");

        //reinitialise les champs
        var fields = this.fields[id] = {};
        
        //scan les elements enfants
        var child = objGetChild(element,"fieldset");
        while(child!=null)
        {
            //recherche le champ INPUT
            var new_fields = nodeEnumNodes(child,function(node){
                if((node.nodeType==ELEMENT_NODE) && (node.tagName.toLowerCase() == "input") && (objGetAtt(node,"type")=="text" || objGetAtt(node,"type")=="checkbox"))
                {
                    //ajoute l'élément à la liste
                    var name = objGetAtt(node,"name");
                    /*var value = objGetAtt(node,"value");
                    fields[name] = {
                        "node":child,//fieldset
                        "input":node,//input
                        "name":name,
                        "list":element
                    };*/
                    fields[name] = $new("ext.fieldlist.FIELD", { 
                        list  :element,
                        node  :child,//fieldset
                        input :node,//input
                        name  :name
                    });

                    return fields[name];
                }
                return true;
            },false);

            //
            this.initField(new_fields,bInsertLegend);

            //prochain item
            child = objGetNext(child,"fieldset");
        }
        
        return true;
    },
    /*
        Vide/Supprime une liste
        Return:
            [bool] true en cas de succès, false en cas d'échec
    
	clear : function(element,bClearOnly)
    {
        if((element = $doc(element)) == null)
            return false;

        var id = objGetAtt(element,"id");
        
        var list = this.fields[id];

        if(bClearOnly){
            for(item in list)
                objSetAtt(item.input,"value","");
        }
        else
        {
            for(item in list)
                nodeRemoveNode(item.node);
            list = {};
        }
        return true;
    },*/
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
        $all(fields,function(field,key,i){
            if(empty(field.value))
                wfw.style.addClass(field.node,"wfw_hidden");
            else
                wfw.style.removeClass(field.node,"wfw_hidden");
        });
    },
    /*
        eventChangeInput
            Si un élément est vide il sera automatique retiré de la liste

        Applicable:
            Elements INPUT
    */
    eventChangeInput : function(e){
        if(empty(objGetAtt(this,"value")))
            wfw.style.addClass(objGetParent(this,"fieldset"),"wfw_hidden");
        else
            wfw.style.removeClass(objGetParent(this,"fieldset"),"wfw_hidden");
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


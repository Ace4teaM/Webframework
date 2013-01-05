/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        Author: AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    DataType
    Verification des formats de données

    JS  Dependences: base.js
    YUI Dependences: base, node, wfw, wfw-style, wfw-request, wfw-states

    Implementation: 16-10-2012
*/

YUI.add('wfw-document', function (Y) {
    var wfw = Y.namespace('wfw');

    wfw.Document = {
        /*
            Données Membres
        */
        dialogContainerId : "#wfw_ext_dialog",
        contentElement    : "html > body",
        //contentElement  : "#wfw_ext_content",
        center            : false,
        copyright         : false,
        onUnlockScreen    : null,//evenement callback pour le dialogue...
        dialogStack       : [],
        waitForCloseEvent : false,//indique si le dialogue affiché est en cours de fermeture (si un dialogue est créé durant cette periode, il sera mit en file d'attente)

        /*
            Classe Dialogue
        
            Implémente:
                WFW.OBJECT
            
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
        DIALOG : function(att){
            //OBJECT
            this.ns              = "wfw_document_dialog";
            //DIALOG
            this.user            = {};
            this.parent_node     = null;
            this.center          = true;
            this.cssClass        = "wfw_ext_dialog-content wfw_ext_unselectable";
            this.onInit          = function(){ };
            this.onPrint         = function(){ };
            this.onPop           = function(){ };
            this.onPush          = function(){ };

            /*
             * Constructeur
             */
            wfw.Document.DIALOG.superclass.constructor.call(this, att);
            
              
            if(this.parent_node == null)
                this.parent_node = Y.Node.create("<div>");

            this.parent_node.set("id",this.id);
            if(!empty(this.cssClass))
                wfw.Style.addClass(this.parent_node,this.cssClass);
        },

        /*
            Dialogue étendu, avec en-tête et pied de page
        
            Implémente:
                Document.DIALOG
            Membres:
                [string]          title    : Texte affiché dans la barre de titre
                [function/object] onOK     : Callback appelé lors l'utilisateur clique sur "OK" / Options de la fonction "printOK()"
                [function/object] onCancel : Callback appelé lors l'utilisateur clique sur "Annuler" / Options de la fonction "printCancel()"
        */
        DIALOG_BOX : function(att){
            //DIALOG options
            this.cssClass   = "wfw_ext_dialog-content wfw_ext_dialog_fixed_size wfw_ext_unselectable";
            //Membres
            this.title      = "";
            this.onPop      = function(){};
            this.onPush     = function(){};
            //dialog button callback/options
            this.onOK       = null;
            this.onCancel   = null;
            
            /*
             * Constructeur
             */
            wfw.Document.DIALOG_BOX.superclass.constructor.call(this, att);
              
        },

        /*
            Initialise l'extension
        */
        init : function()
        {
            
            /**/
            if("string"==typeof(this.contentElement))
                this.contentElement = Y.Node.one(this.contentElement);

            //centre automatiquement le contenu
            if(this.contentElement != null && this.center)
            {
                wfw.Event.SetCallback( // window
                    "wfw_window",
                    "resize",
                    "eventCenterBodyContent",
                    this.eventCenterContent
                );

            /*  wfw.Event.SetCallback( // window
                    "wfw_window",
                    "load",
                    "eventCenterBodyContent",
                    this.eventCenterContent
                );*/
            }

            //ajoute un copyright à la fin du document
            if(this.contentElement != null && this.copyright)
            {
                wfw.Event.SetCallback( // window
                    "wfw_window",
                    "load",
                    "eventCreateCopyright",
                    this.eventCreateCopyright
                );
            }
        },

        /*
            * Affiche un message de rêquete en interne
            */ 
        showRequestMsg : function (obj, msg, debug) {
            var bMsg = (obj.user != null && typeof (obj.user["no_msg"]) == "undefined") ? 1 : 0;

            if (bMsg)
                this.messageBox(msg);

            //debug
            wfw.puts("[" + obj.url + "] " + msg);
            if (typeof (debug) == "string")
                wfw.puts(debug);

            return true;
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
            Ajoute un message d'avertissement en tête de document
            Arguments:
                [string] text : Text à insérer
                [string] link : Optionnel, URL à lier au texte
        */
        adversing : function(text,link){
            var copydiv = Y.Node.create('<div>');
            wfw.Style.setClass(copydiv,"wfw_ext_adversing");
            copydiv.set("text",text);
            if(link)
                copydiv.on("click",function(e){window.open(link);})
            Y.Node.one("body").prepend(copydiv);
        },

        /*
            Obtient l'objet du dialogue en cours
            Retourne:
                [DIALOG|DIALOG_EX] l'objet du dialogue. Si null, aucun dialogue n'est visible
        */
        getDialog : function()
        {
            var dlg = this.getDialogElement();

            if(dlg)
                return wfw.States.fromElement(dlg);

            return null;
        },

        /*
            Obtient l'élément du dialogue visible
            Retourne:
                [HTMLNode] L'Elément parent du contenu. Si null, aucun dialogue n'est visible
        */
        getDialogElement : function()
        {
            var container = this.getDialogContainer();

            if(container)
            {
                var dlg = container.one("> div");
                if(wfw.Style.haveClass(dlg,"wfw_hidden"))
                    return null;
                return dlg;
            }

            return null;
        },

        /*
            Obtient un élément de contenu dans le dialogue visible
            Arguments:
                [string] find_class : Nom de la classe à rechercher, par défaut "wfw_ext_dialog_content"
            Retourne:
                [YUI.Node] L'Elément DIV, parent du contenu dialogue. Si null, aucun dialogue n'est visible
        */
        getDialogContent : function(find_class)
        {
            var container = this.getDialogContainer();

            if(container)
            {
                return container.one("> div[class~='"+find_class+"']");
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
            this.lockScreen();

            //obtient le conteneur
            var container = Y.Node.one("#"+this.dialogContainerId);
            if(!container)
            {
                //crée l'élément dialogue
                if((container = Y.Node.create('<div>'))==null)
                    return false;
                container.set("id",this.dialogContainerId);
                Y.Node.one("#wfw_ext_lock").prepend(container);
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
            var states = wfw.States.fromId(dialog.id);

            //initialise l'id
            dialog.parent_node.set("id",dialog.id);

            //initialise le dialogue
            dialog.init();
            //[user callback]
            if(typeof(dialog.onInit)=="function")
                dialog.onInit(this);

            //[push event]
            if(typeof(dialog.onPush) == "function")
                dialog.onPush();

            //cache l'élément
            wfw.Style.addClass(dialog.parent_node,"wfw_hidden");

            //repositionne le dialogue dans la pile
            switch(position){
                //après l'élément choisi
                case "after":
                    //Positionne l'élément
                    ref.parent_node.insert(dialog.parent_node,'after');
//                    objInsertNode(dialog.parent_node,container,ref.parent_node,INSERTNODE_AFTER);
                    //recherche l'element "ref"dans la pile
                    var index=0;
                    while(index<this.dialogStack.length && this.dialogStack[index]!=ref.parent_node)
                        index++;
                    this.dialogStack.splice(index,0,dialog.parent_node);
                    break;
                //dernier dialogue à afficher (début de pile)
                case "last":
                    container.append(dialog.parent_node);
//                    objInsertNode(dialog.parent_node,container,null,INSERTNODE_END);
                    this.dialogStack.unshift(dialog.parent_node);
                    break;
                //premier dialogue à afficher (fin de pile)
                case "first":
                    cur_dialog.insert(dialog.parent_node,'after');
                    //objInsertNode(dialog.parent_node,container,cur_dialog,INSERTNODE_AFTER);
                    this.dialogStack.push(dialog.parent_node);
                    break;
                //visible (en dehors de la pile)
                case "visible":
                    container.prepend(dialog.parent_node);
//                    objInsertNode(dialog.parent_node,container,null,INSERTNODE_BEGIN);
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
            if(dlg = Y.Node.one("#"+this.dialogContainerId))
            {
                var dlg_content = dlg.one("> div");
                if(!dlg_content)
                    return false;
                this.dialogStack.push(dlg_content);
                wfw.Style.addClass(dlg_content,"wfw_hidden");

                //callback
                var states = wfw.States.fromElement(dlg_content);
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
                var states = wfw.States.fromElement(cur);
                if(typeof(states.onPop) == "function")
                    states.onPop();
                //noeud HTML
                cur.remove();
                //objet
                states.remove();
                //wfw.States.remove(cur.get("id"));
            }

            //affiche le dialogue suivant
            if(this.dialogStack.length)
            {
                var element = this.dialogStack[this.dialogStack.length-1];
                wfw.Style.removeClass(element,"wfw_hidden");
                this.dialogStack.pop();
                //initialise le contenu
                var dialog = wfw.States.fromElement(element);
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
            if(dlg = Y.Node.one("#"+this.dialogContainerId))
            {
                dlg_content = dlg.one("> div");
                return dlg_content.get("id");
            }

            return false;
        },

        /*
            [ PRIVATE ]
            ferme le dialogue visible et affiche le suivant
        */
        closeDialog : function()
        {
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
                dialog.parent_node.remove();
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
                [YUI.Node]    element  : L'Elément à vérrouiller
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
            var dlg = new wfw.Document.DIALOG_BOX(object_merge(options,{
                user:{
                    element : element,
                    old_parent : element.ancestor()//obtient l'ancien parent de l'element
                },
                onInit: function () {
                    this.print(this.user.element);
                    //insert les boutons
                    if(typeof(this.onOK)=="function")
                    {
                        wfw.Event.SetCallback(this.id+"_ok","click","onOK",//remplace le callback par defaut de DIALOG_BOX.init()
                            function(e,dlg)
                            {
                                wfw.Document.waitForCloseEvent = true;
                                //callback...
                                dlg.onOK(dlg.user.element);
                                //restore l'element à son emplacement d'orginie
                                dlg.user.old_parent.append(dlg.user.element);
//                                objInsertNode(dlg.user.element,dlg.user.old_parent,null,INSERTNODE_END);
                                return false;//ne conserve pas ce callback
                            },
                            true, // exécuter avant 'unlock_screen' (permet la creation de dialogues pendant l'événement onOK)
                            this
                        );
                    }

                    if(typeof(this.onCancel)=="function")
                    {
                        wfw.Event.SetCallback(this.id+"_cancel","click","onCancel",//remplace le callback par defaut de DIALOG_BOX.init()
                            function(e,dlg)
                            {
                                wfw.Document.waitForCloseEvent = true;
                                //callback...
                                dlg.onCancel(dlg.user.element);
                                //restore l'element a son emplacement d'orginie
                                dlg.user.old_parent.append(dlg.user.element);
//                                objInsertNode(dlg.user.element,dlg.user.old_parent,null,INSERTNODE_END);
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

            return wfw.Document.insertDialog(dlg,null,"visible");
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
            var dlg = new wfw.Document.DIALOG_BOX(object_merge(options,{
                user:{
                    file_name : file_name,
                    doc_frame : null,
                    wnd_frame : null,
                    frame_obj : null,
                    width : null,
                    height:null
                },
                onInit: function () {
                    //cree la frame
                    var frame_obj = Y.Node.create("<iframe>");

                    if(frame_obj==null)
                    {
                        wfw.puts("wfw.ext.document.lockFrame : iframe element creation failed !");
                        return false;
                    }
                    frame_obj.setAttribute("src",this.user.file_name);
                    frame_obj.setAttribute("id",this.id+"_frame");
                    frame_obj.setAttribute("name",filename(this.user.file_name));
                    wfw.Style.addClass(frame_obj,"wfw_ext_dialog_frame");

                    //insert le contenu
                    this.print(frame_obj);

                    //insert les boutons
                    if(typeof(this.onOK)=="function")
                    {
                        wfw.Event.SetCallback(this.id+"_ok","click","onOK",
                            function(e,dlg)
                            {
                                //callback...
                                wfw.Document.waitForCloseEvent = true; //utilisé par newDialog
                                dlg.onOK(dlg.user.doc_frame, dlg.user.wnd_frame);

                                return false;//ne conserve pas ce callback
                            },
                            true, // exécuter avant 'unlock_screen' (permet la creation de dialogues pendant l'événement onOK)
                            this
                        );
                    }

                    if(typeof(this.onCancel)=="function")
                    {
                        wfw.Event.SetCallback(this.id+"_cancel","click","onCancel",
                            function(e,dlg)
                            {
                                //callback...
                                wfw.Document.waitForCloseEvent = true;
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
                        if(dlg.user.width != null)
                            wfw.Utils.setWidth(dlg.user.frame_obj,dlg.user.width);
                        if(dlg.user.height != null)
                            wfw.Utils.setHeight(dlg.user.frame_obj,dlg.user.height);
                        //ajuste la taille de la frame à son contenu
                        //var frame_content = dlg.user.doc_frame.one("#wfw_ext_content");
                        else if(wfw.Document.contentElement)
                        {
                            //utilise l'element 'wfw_ext_content'
                            var h = wfw.Utils.getHeight(wfw.Document.contentElement);
                            if(h)
                                wfw.Utils.setHeight(dlg.user.frame_obj,h);
                        }
                        else
                        {
                            //utilise les dimentions du 'body' 
                            wfw.Utils.setHeight(dlg.user.frame_obj, dlg.user.doc_frame.one("body").get("scrollHeight"));
                        }
                    };

                    //au chargement du document ...
                    frame_obj.on("load",function(e,dlg)
                    {
                        //assigne le document au globales
                        dlg.user.wnd_frame = this.get("contentWindow");
                        dlg.user.doc_frame = this.get("contentWindow").get("document");
                        dlg.user.frame_obj = this;

                        //ajuste la taille de la frame à son contenu
                        resize_event(dlg);

                        //initialise le titre
                        if(empty(dlg.title)){
                            var title_node = dlg.user.doc_frame.one("html > head > title");
                            if(title_node)
                                Y.Node.one("#"+dlg.id+"_header").set("text",title_node.get("text"));
                        }

                        // si le contenu change..
                        dlg.user.doc_frame.on("change",function(e,dlg)
                        {
                            //redimentionne
                            resize_event(dlg);
                        },null,dlg);
                    },null,this);
                }
            }));

            return wfw.Document.insertDialog(dlg,null,"visible");
        },

        /*
            Vérrouille une image dans un dialogue
        */
        lockImage : function(image_path,options){

            var dlg = new wfw.Document.DIALOG( object_merge(options,{
                center:true,
                onInit: function () {
                    var dlg = this;

                    var image = Y.Node.create('<img>');
                    if(image==null)
                        return false;
                    image.set("src",image_path);

                    var resize = function(image){

                        var timer = wfw.Timer.CreateFrequencyTimer({
                            frame_per_second : 24,
                            duration: 500,
                            bAutoRemove : true,
                            user: {
                                dialog : dlg,   // Document.DIALOG Object
                                image : image,  // <IMG> Element
                                org_width : 0,  // Largeur originale
                                org_height : 0, // Hauteur originale
                                // Largeur et Hauteur maximale
                                max_h : wfw.Utils.getHeight(Y.Node.one("#wfw_ext_lock"))-10,
                                max_w : wfw.Utils.getWidth(Y.Node.one("#wfw_ext_lock"))-10
                            },
                            onStart    : function(){
                                this.user.org_width = this.user.image.get("width");
                                this.user.org_height = this.user.image.get("height");
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
                                this.user.image.set("width", parseInt(normTime*w));
                                this.user.image.set("height", parseInt(normTime*h));
                                /*
                                this.user.image.style.marginLeft = "-"+parseInt(this.user.image.width/2.0)+"px";
                                this.user.image.style.marginTop = "-"+parseInt(this.user.image.height/2.0)+"px";
    */
                                this.user.dialog.centerDialog();
                            }
                        });

                        timer.start();
                    };

                    //[chargement]
                    image.on("load",function(e,dlg){
                        resize(this);
                        dlg.print(this);
                    },null,this);

                    //[chargement]
                    image.on("error",function(e){
                        wfw.puts("Can't load image");
                    });

                    //wfw_ext_lock [click]
                    image.on("click",function(e){
                        wfw.Document.unlockScreen();
                    });

                    //wfw_ext_lock [click]
                    Y.Node.one("#wfw_ext_lock").on("click",function(e){
                        wfw.Document.unlockScreen();
                    });
                }
            }));

            return wfw.Document.insertDialog(dlg,null,"visible");
        },

        /*
            [ PRIVATE ]
            Obtient l'élément de vérrouillage de l'écran
        */
        getLock : function()
        {
            return Y.Node.one("#wfw_ext_lock");
        },

        /*
            [ PRIVATE ]
            Insert l'élément de vérrouillage de l'écran
        */
        insertLock : function()
        {
            var dlg;

            if(dlg = Y.Node.one("#wfw_ext_lock"))
                return dlg;

            //crée l'élément
            if((dlg = Y.Node.create('<div>'))==null)
                return false;
            dlg.set("id","wfw_ext_lock");
            Y.Node.one("document").one("body").prepend(dlg);

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
            if(!dlg && !(dlg = wfw.Document.insertDialog(new wfw.Document.DIALOG(),null,"visible"))){
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
                lock.remove();
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
                autoClose  : true//ferme le dialogue après l'événement "click"
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
            if(button_obj = Y.Node.one("#"+btn_id))
                return button_obj;

            //ajoute le bouton OK
            button_obj = Y.Node.create("<input>");
            button_obj.set("id",btn_id);
            button_obj.set("type","button");
            button_obj.set("value",options.buttonText);
            wfw.Style.addClass(button_obj,options.classCSS);

            //[clickEvent]
            if(typeof options.clickEvent == "function")
                wfw.Event.SetCallback(btn_id,"click","clickEvent",options.clickEvent,false,dialog);

            //[Fermeture du dialogue]
            if(options.autoClose)
                wfw.Event.SetCallback(btn_id,"click","unlock_screen",
                    function(e,dlg)
                    {
                        wfw.puts("printOK: fermeture...");
                        wfw.Document.closeDialog();

                        return false;//ne pas conserver pas ce callback
                    },
                    false,
                    dialog
                );

            wfw.Event.ApplyTo(button_obj,btn_id);

            //insert a la fin
            return content.append(button_obj);
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
            if(button_obj = Y.Node.one("#"+btn_id))
                return button_obj;

            //ajoute le bouton
            button_obj = Y.Node.create("<input>");
            button_obj.set("id",btn_id);
            button_obj.set("type","button");
            button_obj.set("value",options.buttonText);
            wfw.Style.addClass(button_obj,options.classCSS);

            //[clickEvent]
            if(typeof options.clickEvent == "function")
                wfw.Event.SetCallback(btn_id,"click","clickEvent",options.clickEvent,false,dialog);

            //[Fermeture du dialogue]
            if(options.autoClose)
                wfw.Event.SetCallback(btn_id,"click","unlock_screen",
                    function(e,dlg)
                    {
                        wfw.puts("printCancel: fermeture...");
                        wfw.Document.closeDialog();

                        return false;//ne pas conserver pas ce callback
                    },
                    false,
                    dialog
                );

            wfw.Event.ApplyTo(button_obj,btn_id);

            //insert a la fin
            return content.append(button_obj);
        },

        /*
            Supprime le dialogue en cours
        */
        unprintScreen : function()
        {
            var dlg = this.getDialogContainer();
            if(dlg)
                dlg.remove();
        },

        /*
            Obtient le conteneur des dialogues
        */
        getDialogContainer : function()
        {
            return Y.Node.one("#"+this.dialogContainerId);
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
            var dlg =  new wfw.Document.DIALOG_BOX( object_merge({
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
            return wfw.Document.insertDialog(dlg,null,"visible");
        },


        /*
            Affiche un dialogue avec un contenu et un bouton 'OK'
            Arguments:
                [string/HTMLElement]   content : Texte de la question
                [object]               options : Paramétres du dialogue
        */
        messageBox : function(content,options){
            var dlg = new wfw.Document.DIALOG( object_merge({
                onInit: function () {
                    this.print(content);
                    wfw.Document.printOK(this,"wfw_ext_dialog_content",options);
                }
            },options));
            return wfw.Document.insertDialog(dlg,null,"visible");
        },

        /*
            Ouvre le dialogue de chargement
        */
        openLoadingBox : function(options){
            var dialog = wfw.States.fromId("wfw_ext_document_LoadingBox",null,{exists:true});
            if(dialog != null)
                return null;
            var dlg = new wfw.Document.DIALOG_BOX( object_merge({
                title  : "Merci de patienter",
                id     : "wfw_ext_document_LoadingBox",
                onInit : function(){
                    var image = Y.Node.create('<span>');
                    if(image!=null)
                    {
                        wfw.Style.addClass(image,"wfw_icon_loading");
                        //insert
                        this.print(image);
                    }
                }
            },options, false));
            return wfw.Document.insertDialog(dlg,null,"visible");
        },

        /*
            Ouvre le dialogue de chargement
        */
        closeLoadingBox : function(){
            var dialog = wfw.States.fromId("wfw_ext_document_LoadingBox",null,{exists:true});
            if(dialog == null)
                return;
            wfw.Document.removeDialog(dialog);
        },

        // Evenements
        eventCenterContent : function(e){
            if(wfw.Document.contentElement != null){
                var win_width  = wfw.Utils.getClientWidth();
                var body_width = wfw.Utils.getWidth(wfw.Document.contentElement);
                if(win_width>body_width)
                    wfw.Document.contentElement.set("style.marginLeft",((win_width - body_width) / 2)+'px');
                else
                    wfw.Document.contentElement.set("style.marginLeft", '0px');
            }
        },

        eventCreateCopyright : function(e){
            var copydiv = Y.Node.create('<div>');

            wfw.Style.setClass(copydiv,"wfw_ext_copyright");
            copydiv.set("text",wfw.copyright);
            copydiv.on("click",wfw.Document.eventOpenIDInformatik);
            Y.Node.one("document").one("body").appendChild(copydiv);
        },

        eventOpenIDInformatik : function(e){
            window.open(wfw.url);
        }
    };
    
    /*-----------------------------------------------------------------------------------------------------------------------
     * DIALOG Class Implementation
     *-----------------------------------------------------------------------------------------------------------------------*/
    
    // heritages
    Y.extend(wfw.Document.DIALOG,wfw.OBJECT);

    wfw.Document.DIALOG.prototype.onInit          = function(){ };
    
    wfw.Document.DIALOG.prototype.onPrint         = function(){ };
    
    wfw.Document.DIALOG.prototype.onPop           = function(){
        if(this.center == true){
            this.centerDialog();
        }
    };
    
    wfw.Document.DIALOG.prototype.onPush         = function(){
        //Experimentale: centre verticalement le dialogue
        //(Si le dialogue sort de l'ecran il sera coupé verticalement est inaccessible)
        if(this.center == true){
            this.uncenterDialog();
        }
    };
    
    /*
        * Initialise le dialogue
        * Retourne:
        *  [bool] false si la fonction à échouée, sinon true.
        * */
    wfw.Document.DIALOG.prototype.init = function(){
        //insert le contenu
        this.dlg_content = Y.Node.create("<div>");
        if(this.dlg_content==null)
            return false;
        this.parent_node.append(this.dlg_content);
        
        this.dlg_content.set("id",this.id+"_content");
        wfw.Style.addClass(this.dlg_content,"wfw_ext_dialog_content");

        return true;
    };

    /*
        * Ecrit du contenu
        * Retourne:
        *  [void]
        * */
    wfw.Document.DIALOG.prototype.print = function(content){
        this.dlg_content.append(content);
    };

    /*
        Recherche un élément de contenu
        Arguments:
            [string]    find_class : Optionel, nom de la classe à rechercher, par défaut "wfw_ext_dialog_content"
        Retourne:
            [YIU.Element] L'Elément DIV, parent du contenu dialogue. Si null, aucun dialogue n'est visible
    */
    wfw.Document.DIALOG.prototype.findContent = function(find_class)
    {
        //par defaut obtient l'element de contenu
        if(typeof(find_class)=="undefined")
            find_class = this.content_class;

        //recherche le contenu
        var cur = null;
        this.parent_node.all("> *").some(function(node){
            if(wfw.Style.haveClass(node,find_class)){
                cur = node;
                return false;
            }
            return true;
        });

        return cur;
    };

    //Experimentale: centre verticalement le dialogue
    //(Si le dialogue sort de l'ecran il sera coupé verticalement est inaccessible)
    wfw.Document.DIALOG.prototype.centerDialog = function(){
        var container = wfw.Document.getDialogContainer();
        var height = wfw.Utils.getHeight(this.parent_node);
        var demi_height = height/2;
        if(demi_height){
            container.set("style.marginTop","-"+demi_height+"px");
            container.set("style.top","50%");
        }
    };

    //Experimentale: centre verticalement le dialogue
    //(Si le dialogue sort de l'ecran il sera coupé verticalement est inaccessible)
    wfw.Document.DIALOG.prototype.uncenterDialog = function(){
        var container = wfw.Document.getDialogContainer();
        container.set("style.marginTop","0px");
        container.set("style.top","0px");
    };



    /*-----------------------------------------------------------------------------------------------------------------------
     * DIALOG_BOX Class Implementation
     *-----------------------------------------------------------------------------------------------------------------------*/
    
    Y.extend(wfw.Document.DIALOG_BOX,wfw.Document.DIALOG);

    /*
    * Initialize
    */
    wfw.Document.DIALOG_BOX.prototype.init = function () {
        //insert l'header
        this.dlg_header = Y.Node.create('<div>');
        if(this.dlg_header==null)
            return false;
        this.parent_node.append(this.dlg_header);
        this.dlg_header.set("id",this.id+"_header");
        wfw.Style.addClass(this.dlg_header,"wfw_ext_dialog_box_header");
        this.dlg_header.set("text",this.title);

        //insert le contenu
        this.dlg_content = Y.Node.create('<div>');
        if(this.dlg_content==null)
            return false;
        this.parent_node.append(this.dlg_content);
        this.dlg_content.set("id",this.id+"_content");
        wfw.Style.addClass(this.dlg_content,"wfw_ext_dialog_box_content");

        //insert le footer
        this.dlg_footer = Y.Node.create('<div>');
        if(this.dlg_footer==null)
            return false;
        this.parent_node.append(this.dlg_footer);
        this.dlg_footer.set("id",this.id+"_footer");
        wfw.Style.addClass(this.dlg_footer,"wfw_ext_dialog_box_footer");

        //insert le bouton OK
        if(this.onOK == "function")
            this.onOK = {clickEvent: this.onOK};
        if(this.onOK)
        {
            wfw.Document.printOK(this,"wfw_ext_dialog_box_footer",this.onOK);

            wfw.Event.SetCallback(this.id+"_ok","click","onOK",
                function(e,dlg)
                {
                    //callback...
                    wfw.Document.waitForCloseEvent = true; //insert les dialogues après la fermeture de celui-ci (utilisé par insertDialog)
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
            wfw.Document.printCancel(this,"wfw_ext_dialog_box_footer",this.onCancel);

            wfw.Event.SetCallback(this.id+"_cancel","click","onCancel",
                function(e,dlg)
                {
                    //callback...
                    wfw.Document.waitForCloseEvent = true; //insert les dialogues après la fermeture de celui-ci (utilisé par insertDialog)
                    return false;//ne conserve pas ce callback
                },
                true, // exécuter avant 'unlock_screen' (permet la création de dialogues pendant l'événement onCancel)
                this
            );
        }
    };

    /*
     * Print content
     **/
    wfw.Document.DIALOG_BOX.prototype.print = function (content) {
        this.dlg_content.append(content);
    };
    
    /*-----------------------------------------------------------------------------------------------------------------------
     * Initialise
     -----------------------------------------------------------------------------------------------------------------------*/
    wfw.Document.init();
    
}, '1.0', {
      requires:['base', 'node', 'wfw', 'wfw-style', 'wfw-request', 'wfw-event', 'wfw-states']
});

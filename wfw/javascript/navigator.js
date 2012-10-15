/*
    (C)2011 ID-Informatik. All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    WebFrameWork(R) version: 1.3

    XML Default File Class

    Dependences: base.js, dom.js, wfw.js
*/

/*
-----------------------------------------------------------------------------------------------
    navigator extension
-----------------------------------------------------------------------------------------------
*/
wfw.ext.navigator = {
	defaultFile : null,  // [cXMLDefault] instance du document
    ready       : false, // [bool]        si true le document est initialise
    pageId      : null,  // [string]      identificateur du document en cours
    pageNode    : null,  // [XMLElement]  noeud d'index de la page qui a charger le document
    pageIndex   : null,  // [XMLElement]  noeud de l'arbre de la page qui a charger le document
    
    /*
        Initialise le composant [ appelé automatiquement wfw.ext.initAll() ]
    */
	init : function()
    {
        //charge le document
        this.defaultFile = new cXMLDefault();
        if(!this.defaultFile.Initialise("default.xml"))
        {
            wfw.puts("wfw.ext.navigator: can't load navigation doc");
            return false;
        }
        
        //ok, ajoute l'événement de chargement
        wfw.event.SetCallback( // window
            "wfw_window",
            "load",
            "eventLoadNavigation",
            wfw.ext.navigator.onLoad
        );

        this.ready = true;

        return true;
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
        if(!this.ready){
            wfw.puts("wfw.ext.navigator.getModule: document not ready");
            return null;
        }
        //obtient le premier noeud de module
        var cur = this.modNode = this.defaultFile.getModuleConfigNode(null);
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
        //document ?
        if(!this.ready){
            wfw.puts("wfw.ext.navigator.getPageInfos: document not ready");
            return null;
        }
        //
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
        //document ?
        if(!this.ready){
            wfw.puts("wfw.ext.navigator.getIndex: document not ready");
            return null;
        }

        return this.defaultFile.getIndexNode(type,id);
    },
    
    /*
        Obtient l'URI d'une page
        Parametres:
            [string] id   : Identificateur de la page
        Retourne:
            [string] URI de la page, null si introuvable.
    */
    getURI : function(id){
        var node = this.getIndex("page",id);
        if(node==null)
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
        if(node==null)
            return null;
        return objGetInnerText(node);
    },
    
	/*
		Obtient une page de l'index
        Parametres:
            [string]      page_id : Identificateur de la page. Si null, retourne le noeud de la page en cours
		Retourne:
			[XMLElement] Noeud de l'élément 'page', null si introuvable.
	*/
    getPageIndex : function(page_id)
    {
        //document ?
        if(!this.ready){
            wfw.puts("wfw.ext.navigator.getPageIndex: document not ready");
            return null;
        }

        if(page_id==null)
            return this.pageIndex;
        
        return this.defaultFile.getIndexNode("page",id);
    },
    
	/*
		Obtient une noeud de l'arbre de navigation
        Parametres:
            [string]      page_id : Identificateur de la page. Si null, retourne le noeud de la page en cours
		Retourne:
			[XMLElement] Noeud de l'élément 'page', null si introuvable.
	*/
    getPageNode : function(page_id)
    {
        //document ?
        if(!this.ready){
            wfw.puts("wfw.ext.navigator.getPageNode: document not ready");
            return null;
        }

        if(page_id==null)
            return this.pageNode;
            
        return this.defaultFile.getTreeNode(id);
    },
    
	/*
		Ouvre une page de l'abrorescence actuel
        Parametres:
            [string]      name : Page id, "#previous", "#next", "#index", "#parent", "#child"
		Retourne:
			[boll] true en cas de succès, false si la page est introuvable.
	*/
    openPage : function(name)
    {
        //document ?
        if(!this.ready){
            wfw.puts("wfw.ext.navigator.openPage: document not ready");
            return null;
        }

        var uri=null;
        var cur,find;

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

        window.open(uri,"_self");

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
        wfw.ext.navigator.ready = true;
    }
};

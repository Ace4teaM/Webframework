/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    Navigation

    JS  Dependences: base.js
    YUI Dependences: base, wfw, wfw-event, wfw-xml

    Implementation: [18-10-2012]
*/

YUI.add('wfw-navigator', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class Navigator
     * @memberof wfw
     * @brief Fonctions relatives à la navigation HTTP
     * */
    wfw.Navigator = {
        use         : true,
        doc         : null,//instance de wfw.Xml.DEFAULT_FILE
        basePath    : "",//chemin de base au fichier default. Modifie également les URI du fichier default.xml
        navDoc      : "default.xml",//xml document
        navNode     : "> index", // noeud parent de l'index
        cfgNode     : "> config", // noeud parent de la configuration
        modNode     : "> config > module", // premier noeud de module
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
        init : function(config)
        {
            object_merge(this,config,false);
            
            if (!/android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test( navigator.userAgent)) {
                this.probablyMobileNavigator = true;
            }
            
            // Initialise le document xml
            this.doc = new wfw.Xml.DEFAULT_FILE();
            //this.doc.Initialise("default.xml");

            //charge le sitemap "default.xml"
            if("string"==typeof(this.navDoc)){
                var uri = this.basePath+this.navDoc;
                wfw.puts("Navigator.init: load navigation doc... ["+uri+"]");
                try{
                    var doc = wfw.HTTP.get(uri);
                    if(!doc){
                        wfw.puts("Navigator.init: can't load navigation doc: "+uri+" (HTTP Status: "+wfw.HTTP.getResponseStatus()+")");
                        return false;
                    }
                    if(!(doc = xml_parse(doc))){
                        wfw.puts("Navigator.init: can't parse xml navigation doc: "+uri);
                        return false;
                    }
                    this.navDoc = doc;
                }
                catch(e){
                    switch(e.name){
                        case "NS_ERROR_DOM_BAD_URI":
                            wfw.puts("Navigator.init: can't load navigation doc: "+uri+" (NS_ERROR_DOM_BAD_URI)");
                            break;
                        default:
                            wfw.puts("Navigator.init: can't load navigation doc: "+uri+" (Unexpected error)");
                            break;
                    }
                //return wfw.checkError(e);
                }
            }
        
            if(typeof(this.navDoc)=='object')
            {
                //applique le chemin de base aux URI
                if(!empty(this.basePath))
                    this.applyBasePath(this.basePath);
                
                //obtient le noeud module
                if("string" == typeof(this.modNode))
                    this.modNode = Y.Node(this.navDoc.documentElement).one(this.modNode);

                //obtient le noeud d'index
                if("string" == typeof(this.navNode))
                    this.navNode = Y.Node(this.navDoc.documentElement).one(this.navNode);

                //obtient le noeud de configuration
                if("string" == typeof(this.cfgNode))
                    this.cfgNode = Y.Node(this.navDoc.documentElement).one(this.cfgNode);

                //ok ajoute l'événement de chargement
                if(typeof(this.navNode)=='object')
                {
                    Y.Event.attach('load',wfw.Navigator.onLoad,Y.one('window'),Y.one('window'));
                    /*
                    wfw.Event.SetCallback( // window
                        "wfw_window",
                        "load",
                        "eventLoadNavigation",
                        wfw.Navigator.onLoad
                        );
                    wfw.Event.ApplyTo(Y.one('window'),"wfw_window");*/
                    return true;
                }
                else
                    wfw.puts("Navigator.init: navigation doc/node not ready");
            }  
            return false;
        },
    
        /*
        Retourne l'identifiant du site
        Retourne:
            [string] identifiant du site
        */
        getId : function(){
            //document ?
            if((typeof(this.navDoc)!='object')){
                wfw.puts("Navigator.getId: no document");
                return null;
            }
            //obtient le noeud des modules
            var cur = this.modNode = Y.Node.one("> id",this.navDoc);
            //recherche le module
            if(cur!=null)
                return trim(cur.get("text"));

            return null;
        },
    
        /*
        Retourne le nom du site
        Retourne:
            [string] identifiant du site
        */
        getName : function(){
            //document ?
            if((typeof(this.navDoc)!='object')){
                wfw.puts("Navigator.getName: no document");
                return null;
            }
            //obtient le noeud des modules
            var cur = this.modNode = Y.Node.one("> name",this.navDoc);
            //recherche le module
            if(cur!=null)
                return trim(cur.get("text"));

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
            if((typeof(this.navDoc)!='object') || (typeof(this.cfgNode)!='object')){
                wfw.puts("Navigator.getModule: no document or module node");
                return null;
            }

            //recherche le module
            var cur = null;
            this.cfgNode.all("> module").some(function(n){
                if(n.get("id") == name){
                    cur = n;
                    return false;
                }
                return true;
            });
            
            return cur;
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
                wfw.puts("Navigator.getPageInfos: not ready:"+this.bOk);
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
        Remarque:
            L'Argument 'id' est sensible à la case.
    */
        getIndex : function(type,id)
        {
            //obtient le premier noeud
            if(id == null)
                return this.navNode.one("> "+type.toLowerCase());

            //obtient par id
            return this.navNode.one("> "+type.toLowerCase()+"[id='"+id+"']");
        },
    
       /**
        * @brief Obtient l'URI d'une page
        * @param string id Identificateur de la page
        * @param object remakeAtt Optionnel, attributs utilisés pour modifier l'URI de base
        * @return URI de la page
        * @retval null La page est introuvable dans l'index
        * @remarks L'Argument 'id' est sensible à la case
        * @remarks Le membre 'basePath' influe sur le retour de la fonction
        * 
        * ## Exemple d'utilisation du paramètre 'remakeAtt'
        * Les paramétres suivants sont passés à la méthode 'wfw.URI.remakeURI()'.
        * @code{.js}
        * var remakeAtt = {
        *   add_fields : { id:'465', type:'foo' },
        *   att        : null,
        *   anchor     : 'sectionB'
        * }
        * @endcode
        * */
        getURI : function(id,remakeAtt){
            //obtient l'URI depuis le fichier default
            var node;
            if((node = this.getIndex("page",id))==null)
                return null;
            var uri = /*this.basePath+*/node.get("text");

            //refabrique l'URI ?
            if(remakeAtt instanceof Object){
                remakeAtt = object_merge({add_fields:null, att:null, anchor:null},remakeAtt,false);
                if(uri != null)
                    uri = wfw.URI.remakeURI(uri,remakeAtt.add_fields,remakeAtt.att,remakeAtt.anchor);
            }
            
            //
            return uri;
        },
    
        /*
        Obtient la valeur d'un noeud de l'index
        Parametres:
            [string] type : Nom de balise de l'élément désiré (ex: "page")
            [string] id   : Identificateur de la balise (ex: "index")
        Retourne:
            [string] Valeur du noeud, null si introuvable.
        Remarque:
            L'Argument 'id' est sensible à la case.
        */
        getIndexValue : function(type,id){
            var node = this.getIndex(type,id);
            if(node!=null)
                return node.get("text");
            return null;
        },
    
        /*
            Obtient une page de l'index
            Parametres:
                [string]      page_id : Identificateur de la page. Si null, retourne le noeud de la page en cours
                [XMlDocument] [doc]   : Optionnel, document XML à utiliser pour la recherche.
            Retourne:
                [XMLElement] Noeud de l'élément 'page', null si introuvable.
        Remarque:
            L'Argument 'page_id' est sensible à la case.
	*/
        getPageIndex : function(page_id,doc){
            if(page_id==null)
                return this.pageIndex;

            if(typeof(doc)=="undefined")
                doc = this.navDoc.documentElement;
            else
                doc = doc.documentElement;
            
            return Y.Node(doc).one("> index > page[id='"+page_id+"']");
        },

        /*
            Obtient une noeud de l'arbre de navigation
            Parametres:
                [string]      page_id : Identificateur de la page. Si null, retourne le noeud de la page en cours
                [XMLDocument] doc     : Optionnel, document de navigation
            Retourne:
		[XMLElement] Noeud de l'élément 'page', null si introuvable.
            Remarque:
                L'Argument 'page_id' est sensible à la case.
	*/
        getPageNode : function(page_id,doc){
            if(page_id==null)
                return this.pageNode;

            if(typeof(doc)=="undefined")
                doc = this.navDoc.documentElement;
            else
                doc = doc.documentElement;

            return Y.Node(doc).one("> tree "+page_id);
        },
    
        /*
            Applique un chemin d'accès aux noeuds contenant une URI
            @param string  basePath  Chemin de base (terminé par un slash)
            @remarks Les noeuds suivant sont affectés: [ '> index > page' ]
	*/
        applyBasePath : function(basePath){
            return Y.Node(this.navDoc.documentElement).all("> index > page").each(function (node) {
                node.set("text",basePath+node.get("text"));
            });
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
                        if(find=cur.previous())
                            uri=this.getIndexValue("page",find.get("tagName"));
                        break;
                    case "#next":
                        if(find=cur.next())
                            uri=this.getIndexValue("page",find.get("tagName"));
                        break;
                    case "#parent":
                        if(find=cur.ancestor())
                            uri=this.getIndexValue("page",find.get("tagName"));
                        break;
                    case "#child":
                        if(find=cur.one("> *"))
                            uri=this.getIndexValue("page",find.get("tagName"));
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
                uri += "?"+wfw.URI.object_to_query(args,true);
            if(typeof(anchor)!="undefined")
                uri += "#"+anchor;

            window.open(uri,target);

            return true;
        },

        
        // events...

        onLoad : function(e){
            // recupere l'id de la page actuel
            var meta_tag = Y.Node.one("meta[http-equiv='wfw.page-id']");
 
            //introuvable?
            if(!meta_tag){
                wfw.puts("Navigator.onLoad: this page as not meta-tag: wfw.page-id");
                return;
            }

            //obtient l'id
            wfw.Navigator.pageId = meta_tag.get("content");
            wfw.puts('Navigator.onLoad: page_id = '+wfw.Navigator.pageId);
            if(empty(wfw.Navigator.pageId))
            {
                wfw.puts('Navigator.onLoad: pageId not specified');
                return;
            }

            // recherche les noeuds
            wfw.Navigator.pageIndex   = wfw.Navigator.getPageIndex(wfw.Navigator.pageId);
            if(!wfw.Navigator.pageIndex)
            {
                wfw.puts("Navigator.onLoad: "+wfw.Navigator.pageId+', index node is not found');
                return;
            }
   
            wfw.Navigator.pageNode    = wfw.Navigator.getPageNode(wfw.Navigator.pageId);
            if(!wfw.Navigator.pageNode)
            {
                wfw.puts("Navigator.onLoad: "+wfw.Navigator.pageId+', tree node is not found');
                return;
            }
        
            wfw.puts('Navigator.onLoad: navigation tree OK');
            wfw.Navigator.bOk = true;
        },

        /**
         *   @brief Vérifie et maintient l'état de la connexion
        */
        ctrl: function(page,args,user) {
            var url = this.getURI(page);
            
            object_merge(args,{output:"xarg"},false);//make sure XARG return
            
            if(typeof user == "function")
                user = {onsuccess : user};
            
            var req = new wfw.Request.REQUEST(
                {
                    url: url,
                    args: args,
                    callback : wfw.XArg.onCheckRequestResult_XARG,
                    user : user,
                    async:false
                }
            );

            return wfw.Request.Insert(req);
        }

    };
    /*-----------------------------------------------------------------------------------------------------------------------
     * Initialise
     -----------------------------------------------------------------------------------------------------------------------*/
    //wfw.Navigator.init(Y.config.groups.js.modules['wfw-navigator']['defaults']);
    
}, '1.0', {
    requires:['base','wfw','wfw-event','wfw-xml']
});

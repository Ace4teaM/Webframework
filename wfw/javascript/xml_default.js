/*
	(C)2011-2012 ID-INFORMATIK - WebFrameWork(R)
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------


    Classe de fichier XML-Default

    Dependences: base.js, dom.js, wfw.js
    
	Revisions:
		[06-06-2011] Add, getConfigNode()
		[06-06-2012] Update, getModuleConfigNode()
*/

/*
-----------------------------------------------------------------------------------------------
    cXMLDefault class
-----------------------------------------------------------------------------------------------
*/
function cXMLDefault()
{
	//le document "default.xml"
	this.doc;

	if (typeof this._initialized == "undefined")
    {
        this._initialized = true;

	    cXMLDefault.prototype.Initialise = function(doc)
	    {
            //Initialise les membres
	        this.doc = null;
            
            //charge le document
            if(typeof(doc)=="string")
            {
                wfw.http_get(doc);
        
                if((wfw.nav.httpRequest.readyState == wfw.request.READYSTATE_DONE) && (wfw.nav.httpRequest.status == 200))
                    this.doc = xml_parse(wfw.http_getResponse());
                else
    			    this.post("Initialise","can't load file "+doc);
            }
            else
                this.doc = doc;
                
		    if(this.doc == null){
			    this.post("Initialise","failed load doc file");
			    return false;
		    }
		
		    return true;
	    };
    
        /*
          Obtient un noeud de l'index des modules (obselete, utiliser getConfigNode)
          Arguments:
            [string] id   : identificateur du module. Si null, retourne le premier noeud 
          Retourne:
            [XMLElement] Noeud trouve, null si introuvable
        */
        cXMLDefault.prototype.getModuleConfigNode = function(id)
        {
            //obtient le noeud des modules
           /* var entry_node = docGetNode(this.doc,'site/config/module');

            //premier noeud ?
            if(id==null)
                return entry_node;

            //recherche le module
		    while(entry_node != null){   
			    var entry_id = objGetAtt(entry_node,"id");
			    if(entry_id == id)
				    return entry_node;
    
			    entry_node = objGetNext(entry_node,"module");
		    }
		    return null;*/
		    return this.getConfigNode("module",id);
        };
  
        /*
          Obtient un noeud de la configuration
          Arguments:
	        [string] type : nom de balise de l'élément enfant
	        [string] id   : identificateur du module. Si null, retourne le premier noeud 
          Retourne:
            [XMLElement] Noeud trouve, null si introuvable
        */
        cXMLDefault.prototype.getConfigNode = function(type,id)
        {
            //obtient le noeud des modules
            var entry_node = docGetNode(this.doc,'site/config/'+type);

            //premier noeud ?
            if(id==null)
                return entry_node;

            //recherche le module
		    while(entry_node != null){   
			    var entry_id = objGetAtt(entry_node,"id");
			    if(entry_id == id)
				    return entry_node;
    
			    entry_node = objGetNext(entry_node,type);
		    }
		    return null;
        };
  
        /*
          Obtient la valeur d'un noeud
          Arguments:
            [string] nodeName : nom du noeud (nom de balise)
          Retourne:
            [string] Text du noeud trouve. Une chaine vide est retourné si le noeud est introuvable
        */
        cXMLDefault.prototype.getValue = function(nodeName)
        {
            var node = docGetNode(this.doc,'site/'+nodeName);
            //recherche
            if(node) return objGetInnerText(node);
            return "";
        };
          
        /*
          Obtient la valeur d'un noeud de l'index
          Arguments:
            [string] type : type de noeud (nom de balise)
            [string] id   : identificateur
          Retourne:
            [string] Text du noeud trouve. Une chaine vide est retourné si le noeud est introuvable
        */
        cXMLDefault.prototype.getIndexValue = function(type,id)
        {
            //recherche
            var node = this.getIndexNode(type,id);
            if(node) return objGetInnerText(node);
            return "";
        };
          
        /*
          Obtient un noeud de l'index
          Arguments:
            [string] type : type de noeud (nom de balise)
            [string] id   : identificateur
          Retourne:
            [XMLElement] Noeud trouve, null si introuvable
        */
        cXMLDefault.prototype.getIndexNode = function(type,id)
        {
            //recherche
            var entry_node = docGetNode(this.doc,'site/index/'+type);
            while(entry_node){   
                var entry_id = objGetAtt(entry_node,"id");
                if(entry_id == id)
                    return entry_node;
    
                entry_node = objGetNext(entry_node,type);
            }
            return null;
        };
          
        /*
          Ajoute un noeud à l'index
          Arguments:
            [string] type : type de noeud (nom de balise)
            [string] id   : identificateur
          Retourne:
            [XMLElement] Noeud inséré, null en cas d'erreur
        */
        cXMLDefault.prototype.addIndexNode = function(type,id)
        {
            //obtient le noeud de l'index
            var index_node;
            if((index_node = docGetNode(this.doc,'site/index')) == null)
                return null;

            //cree l'element
            var node = this.doc.createElement(type);
            if(node == null){
                this.post("Initialise","failed create node "+type);
                return null; 
            }

            objSetAtt(node,"id",id);
            objInsertNode(node,index_node,null,INSERTNODE_END);
      
            return node;
        };
             
        /*
          Obtient un noeud de l'arbre de navigation
          Arguments:
            [string] page_id   : identificateur. Si null retourne le noeud parent de l'arbre 'site/tree'
          Retourne:
            [XMLElement] Noeud trouve, null si introuvable
        */
        cXMLDefault.prototype.getTreeNode = function(page_id)
        {
            var tree_node;
            if((tree_node = docGetNode(this.doc,'site/tree')) == null)
                return null;
            if(page_id==null)
                return tree_node;
            //enumere les noeud
            var ret = nodeEnumNodes(tree_node,function(node,condition){
                if(node.nodeType == XML_ELEMENT_NODE && node.tagName == page_id )
                    return node;
                return true;
            },false);

            if(ret == true)
                return null;

            return ret;
        };
        
        /*
          Ajoute un noeud a l'arbre de navigation
          Arguments:
            [string] parent_id : identificateur de la page du parent. Si null, le neud est placé à la racine de l'arbre
            [string] page_id   : identificateur de la page à inserer
          Retourne:
            [XMLElement] Noeud insere, null en cas d'erreur
        */
        cXMLDefault.prototype.addTreeNode = function(parent_id,page_id)
        {
            var tree_node;
            if((tree_node = docGetNode(this.doc,'site/tree')) == null)
                return null;
            //obtient le parent
            var parent_node;
            if(parent_id == null)
                parent_node = tree_node;
            else if( (parent_node = this.getTreeNode(parent_id)) == null)
                return null;
            //initialise l'enfant
            var page_node = this.getTreeNode(page_id);
            if(page_node == null)   
            {                   
                if((page_node = this.doc.createElement(page_id)) == null)
                return null; 
            }
            //insert le noeud
            if(objInsertNode(page_node,parent_node,null,INSERTNODE_END)==null)
                return null;
      
            return page_node;
        };

        /*
            Debug print 
        */
        cXMLDefault.prototype.post = function(title,msg)
        {
            wfw.puts("cXMLDefault: "+title+", "+msg);
        };
	}
};  

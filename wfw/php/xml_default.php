<?php
/*
	(C)2011-2012 ID-INFORMATIK - WebFrameWork(R)
	Classe de fichier XML-Default

	AUTHOR: Auguey Thomas
	MAIL  : dev@aceteam.fr

	Revisions:
		[05-12-2011] Implentation
		[06-06-2011] Add, getConfigNode()
		[06-06-2012] Update, getModuleConfigNode()
*/
class cXMLDefault
{
	//le document XMLDocument "default.xml"
	public $doc = NULL;
	
	public function Initialise($doc)
	{
            //Initialise les membres
	    $this->doc = NULL;
            
            //charge le document
            if(is_string($doc))
            {
                $this->doc = new XMLDocument();
                if( !$this->doc->load($doc) )
                    return proc_result (ERR_FAILED, 'cant_load_file');
            }
            else if(($this->doc = $doc) == NULL){
                    return proc_result(ERR_FAILED, 'invalid_arg');
            }

            return proc_result(ERR_OK);
	}
	
    /*
        Obtient un noeud de l'index des modules (obselete, utiliser getConfigNode)
        Arguments:
        [string] id   : identificateur du module. Si null, retourne le premier noeud 
        Retourne:
        [XMLElement] Noeud trouve, null si introuvable
    */
    public function getModuleConfigNode($id)
    {
        //obtient le noeud des modules
      /*  $entry_node = $this->doc->getNode('site/config/module');

        //premier noeud ?
        if($id==NULL)
            return $entry_node;

        //recherche le module
		while($entry_node != NULL){   
			$entry_id = $this->doc->getAtt($entry_node,"id");
			if($entry_id == $id)
				return $entry_node;
    
			$entry_node = $this->doc->getNext($entry_node,"module");
		}
		return null;*/
		return $this->getConfigNode("module",$id);
    }
  
    /*
        Obtient un noeud de la configuration
        Arguments:
        [string] type : nom de balise de l'element enfant
        [string] id   : identificateur du module. Si null, retourne le premier noeud 
        Retourne:
        [XMLElement] Noeud trouve, null si introuvable
    */
    public function getConfigNode($type,$id)
    {
        //obtient le noeud des modules
        $entry_node = $this->doc->getNode('site/config/'.$type);

        //premier noeud ?
        if($id==NULL)
            return $entry_node;

        //recherche le noeud
		while($entry_node != NULL){   
			$entry_id = $this->doc->getAtt($entry_node,"id");
			if($entry_id == $id)
				return $entry_node;
    
			$entry_node = $this->doc->getNext($entry_node,$type);
		}
		return null;
    }
  
    /*
        Obtient la valeur d'un noeud
        Arguments:
        [string] nodeName : nom du noeud (nom de balise)
        Retourne:
        [string] Text du noeud trouve. Une chaine vide est retourné si le noeud est introuvable
    */
    public function getValue($nodeName)
    {
		$node = $this->doc->getNode('site/'.$nodeName);
        //recherche
		if($node) return $node->nodeValue;
        return "";
    }
	
    /*
        Obtient la valeur d'un noeud de l'index
        Arguments:
        [string] type : type de noeud (nom de balise)
        [string] id   : identificateur
        Retourne:
        [string] Text du noeud trouve. Une chaine vide est retourné si le noeud est introuvable
    */
    public function getIndexValue($type,$id)
    {
        //recherche
		$node = $this->getIndexNode($type,$id);
		if($node) return $node->nodeValue;
        return "";
    }
	 
    /*
        Obtient un noeud de l'index
        Arguments:
        [string] type : type de noeud (nom de balise)
        [string] id   : identificateur
        Retourne:
        [XMLElement] Noeud trouve, null si introuvable
    */
    public function getIndexNode($type,$id)
	{
        //recherche
		$entry_node = $this->doc->getNode('site/index/'.$type);
        while($entry_node){
            $entry_id = $this->doc->getAtt($entry_node,"id");
            if($entry_id == $id)
                return $entry_node;
    
			$entry_node = $this->doc->getNext($entry_node,$type);
        }
        return NULL;
    }
	
    /*
        Ajoute un noeud à l'index
        Arguments:
        [string] type : type de noeud (nom de balise)
        [string] id   : identificateur
        Retourne:
        [XMLElement] Noeud inséré, null en cas d'erreur
    */
    public function addIndexNode($type,$id)
    {
        //obtient le noeud de l'index
        $index_node;
        if(($index_node = $this->doc->getNode('site/index')) == NULL)
            return NULL;

        //cree l'element
		$node = $this->doc->createElement($type);
		if($node == NULL){
			$this->post("Initialise","failed create node ".$type);
			return NULL; 
        }

		$this->doc->setAtt($node,"id",$id);
		$index_node->appendChild($node);
      
        return $node;
    }
	/*
        Obtient un noeud de l'arbre de navigation
        Arguments:
        [string] page_id   : identificateur. Si null retourne le noeud parent de l'arbre 'site/tree'
        Retourne:
        [XMLElement] Noeud trouve, null si introuvable
    */
    public function getTreeNode($page_id)
    {
        $tree_node;
        if(($tree_node = $this->doc->getNode('site/tree')) == NULL)
			return NULL;
        if($page_id==NULL)
            return $tree_node;
		//enumere les noeud
		$ret = $this->doc->enumNodes($tree_node->firstChild,
			function($node,&$condition) use ($page_id){
				if($node->nodeType == XML_ELEMENT_NODE && $node->tagName == $page_id )
				{
					return $node;
				}
				return TRUE;
			},
			true
		);

		if($ret === TRUE)
            return NULL;

        return $ret;
    }
	
    /*
        Ajoute un noeud a l'arbre de navigation
        Arguments:
        [string] parent_id : identificateur de la page du parent. Si null, le neud est placé à la racine de l'arbre
        [string] page_id   : identificateur de la page à inserer
        Retourne:
        [XMLElement] Noeud insere, null en cas d'erreur
    */
    public function addTreeNode($parent_id,$page_id)
    {
        $tree_node;
        if(($tree_node = $this->doc->getNode('site/tree')) == NULL)
            return NULL;
        //obtient le parent
        $parent_node;
        if($parent_id == NULL)
            $parent_node = $tree_node;
        else if( ($parent_node = $this->getTreeNode($parent_id)) == NULL)
            return NULL;
        //initialise l'enfant
        $page_node = $this->getTreeNode($page_id);
        if($page_node == NULL)   
        {                   
			if(($page_node = $this->doc->createElement($page_id)) == NULL)
            return NULL; 
        }
        //insert le noeud
        if($parent_node->appendChild($page_node)==NULL)
            return NULL;
      
        return $page_node;
    }
};
?>

<?php
/*

	WebFrameWork(R) - XML Catalog file class
	xml_catalog.php
	(C)2011 ID-INFORMATIK, Tout droits reserver
	PHP Code
	
	AUTHOR: Auguey Thomas
	MAIL  : contact@id-informatik.com
	PHP   : 5+
	
	Revisions:
		[05-12-2011] Implentation
*/
class cXMLCatalog
{
	//le document "XMLDocument"
	public $doc = NULL;
	//att
	public $guid = NULL;
	
	public function Initialise($doc)
	{
        //Initialise les membres
	    $this->doc = NULL;
            
        //charge le document
        if(is_string($doc))
        {
            $this->doc = new XMLDocument();
			if( !$this->doc->load($doc) )
			{
				$this->post("Initialise","can't load file ".$doc);
				return false;
			}
        }
        else
            $this->doc = $doc;
                
		if($this->doc == NULL){
			$this->post("Initialise","failed load doc file");
			return false;
		}
		
		//obtient le GUID
		$node = $this->doc->getNode("data/guid");
		if(!$node){
			$this->post("Initialise","catalog has not guid");
			return false;
		}
		$this->guid = trim($node->nodeValue);
		
		return true;
	}
	
    /*
        Obtient le noeud de l'item désiré
	    Arguments:
			[string] guid : Guide de l'item. Si NULL le premier noeud est retourné
			[string] id   : Optionnel, identificateur de l'item désiré
        Retourne:
			[cXMLCatalogItem] Classe de l'objet item, null si introuvable
    */
	public function getItem($guid,$id)
    {
        //obtient le noeud des modules
		$entry_node = $this->doc->getNode('data/item');

        //premier noeud ?
		if($guid==NULL)
			return new cXMLCatalogItem($this,$entry_node);

        //recherche le module
		while($entry_node != NULL){   
			$entry_guid = $this->doc->getAtt($entry_node,"guid");
			$entry_id = $this->doc->getAtt($entry_node,"id");
			if($entry_guid == $guid)
			{
				if(($id!=NULL && $entry_id == $id) || ($id==NULL))
					return new cXMLCatalogItem($this,$entry_node);
			}
    
			$entry_node = $this->doc->getNext($entry_node,"item");
		}
		return null;
    }
  
	public function getItemObj($guid,$id)
    {
        //obtient le noeud des modules
		$entry_node = $this->doc->getNode('data/item');

        //premier noeud ?
		if($guid==NULL)
			return new cXMLCatalogItem($this,$entry_node);

        //recherche le module
		while($entry_node != NULL){   
			$entry_guid = $this->doc->getAtt($entry_node,"guid");
			$entry_id = $this->doc->getAtt($entry_node,"id");
			if($entry_guid == $guid)
			{
				if(($id!=NULL && $entry_id == $id) || ($id==NULL))
					return new cXMLGenericObject($entry_node);
			}
    
			$entry_node = $this->doc->getNext($entry_node,"item");
		}
		return null;
    }
	
    /*
        Debug print 
    */
    public function post($title,$msg)
    {
		echo("cXMLCatalog $title, $msg");
    }
};

class cXMLCatalogItem
{
	//class catalogue
	public $catalog = NULL;
	//noeud de l'item
	public $item_node = NULL;
	//att
	public $guid = NULL;
	public $id = NULL;
	
	function __construct($cCatalog,$item_node)
	{
		//Initialise les membres
		$this->catalog = $cCatalog;
		$this->item_node = $item_node;

		//obtient le GUID et l'id
		$this->guid = $this->catalog->doc->getAtt($item_node,"guid");
		$this->id   = $this->catalog->doc->getAtt($item_node,"id");
		
		return true;
	}
	
	function getParamNode($name)
	{
		//reservé ?
		if($name == "set")
			return NULL;
		//obtient le noeud
		$child = $this->catalog->doc->getNextChildNode($this->item_node,$name);
		if(!$child)
		{
			if($child = $this->catalog->doc->createElement($name))
				$this->item_node->appendChild($child);
		}
		return $child;
		/*
		$node = $this->catalog->doc->getChild($this->item_node);
		while($node)
		{
			if($name != "set" && $name==$node->tagName)
				return $node;
			$node = $this->catalog->doc->getNext($node,NULL);
		}*/
	}
	
	function getParam($name)
	{
		$node = $this->getParamNode($name);
		if($node!=NULL)
			return $node->nodeValue;
		return "";
	}
	
	function getFieldNode($name,$prev)
	{
		if($prev==NULL)
		{
			return $this->catalog->doc->objGetNode($this->item_node,'set/'.$name);
		}
		
		return $this->catalog->doc->getNext($prev,$name);
	}
	
	function getField($name,$prev)
	{
		$node = $this->getFieldNode($name,$prev);
		if($node!=NULL)
			return $node->nodeValue;
		return "";
	}
	
	function getFirstFieldNode()
	{
		$node = $this->catalog->doc->getNextChildNode($this->item_node,'set');
		if($node)
			return $this->catalog->doc->getChild($node);
		return null;
	}
	
}


class cXMLGenericObject
{
	public $_att_ref = array(); // references sur les membres qui sont des attributs
	public $_elm_ref = array(); // references sur les membres qui sont des elements
	
	function __construct($item_node)
	{
		$this->insertElement($item_node,$this);
		
		return true;
	}
	
	//recherche le prochain element enfant
	public static function getChild($curNode)
	{
		$children = $curNode->childNodes;
		for($i=0; $i<$children->length; $i++) {
			$child = $children->item($i);
			if($child->nodeType == XML_ELEMENT_NODE) // ignore les noeuds qui ne sont pas des elements
			{
				return $child;
			}
		}
		return NULL;
	}
	
	/*
	 Insert les données de l'élément XML à la classe
	 Paramètres:
	 	[DOMElement]        item_node : L'Element XML à insérer
	 	[cXMLGenericObject] obj       : Classe recevant les données
	 Retourne:
	 	[Bool] true.
	*/
	function insertElement($item_node,$obj){
	
		$child;
		
		//Initialise les membres (attributs)
		$attributes = $item_node->attributes;
		foreach ($attributes as $index=>$attr){
			$member_name = $attr->name;
			$obj->$member_name = $attr->value;
			$obj->_att_ref[$member_name] = &$obj->$member_name;
		}
		
		//Initialise les membres (elements)
		$node = $item_node->firstChild;
		while($node!=NULL){
			if($node->nodeType == XML_ELEMENT_NODE){
				$member_name = $node->tagName;
				if($child = $this->getChild($node)){
					$obj->$member_name = new cXMLGenericObject($node);
				}
				else{
					$obj->$member_name = $node->nodeValue;
				}
				$obj->_elm_ref[$member_name] = &$obj->$member_name;
			}
			$node = $node->nextSibling;
		}
		
		return true;
	}
	
	/*
	 Convertie l'objet en élément XML
	 Paramètres:
	 	[DOMDocument]       doc     : Document parent de l'élément créé
	 	[cXMLGenericObject] obj     : L'Objet à convertir en élément
	 	[string]            tagName : Optionnel, nom de l'élément a créé. Par défaut "item".
	 Retourne:
	 	[DOMElement] Le nouvel élément.
	*/
	public function toNode($doc,$obj,$tagName="item")
	{
		if(is_string($obj))
			return $doc->createTextNode($obj);
		
		$node = $doc->createElement($tagName);
		foreach($obj->_att_ref as $name=>$value)
			$node->setAttribute($name,$value);
		foreach($obj->_elm_ref as $name=>$value)
		{
			if(!is_string($value))
				$node->appendChild($this->toNode($doc,$value,$name));
			else{
				$node->appendChild($doc->createTextNode($value));
			}
		}
		return $node;
	}
}

?>

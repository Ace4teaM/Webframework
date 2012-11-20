<?php
/*
	(C)2012 ID-INFORMATIK - WebFrameWork(R)
	XML Document-Object-Model
	
	PHP Code
	AUTHOR: Auguey Thomas
	MAIL  : dev@aceteam.fr
	Requis: PHP5+, extention DOM 
	
	Revisions:
	[20-05-2010], mise a jour XMLDocument::getNode(). resoud le probleme de la creation du noeud racine. la fonction retournait NULL au lieu de -1 sur la verification du noeud racine.
	[28-05-2010], mise a jour XMLDocument::getNode(). accept un chemin de noeud commencant par un slash '/' celui ci etant ignore si il est rencontre.
	[30-05-2010], ajout de la methode XMLDocument::getNodeValue().
	[09-10-2010], ajout le constructeur de classe XMLDocument.
	[16-10-2010], ajout la methode objGetNode et objGetChildrenByTagName.
	[14-06-2011], ajoute getAtt() et replaceNodeByContent() 
	[05-12-2011], modify getNext(), supprime getNextNode()
	[05-12-2011], Add setAtt()
	[05-12-2011], Add setNodeValue()
	[27-12-2011], Update XMLDocument::replaceNodeByContent(), retourne le premier noeud deplacé
	[05-12-2011], Add XMLDocument::make()
	[26-03-2012], Update, Renomme XMLDocument::removeChild() par XMLDocument::removeChildNodes()
*/

$libdir = realpath(dirname(__FILE__) . "/..");

require_once("$libdir/php/base.php");
require_once("$libdir/php/regexp.php");
require_path("$libdir/php/class/bases/");
require_path("$libdir/php/inputs/");

class XMLDocument extends DOMDocument
{
	function make($content)
	{
		return $this->loadHTML( $content );
	}

        /**
         * @brief Enumére les enfants d'un noeud XML
         * @param type $node Noeud de base
         * @param type $callback Fonction de rappel
         * @param boolean $bNext Si true, suit les noeuds suivant '$node'
         * @return Résultat retourné par la fonction de rappel '$callback'
         * 
         * @remarks La fonction de rappel bool Callback(Node node,String condition), tant que la fonction retourne true l'énumération continue.
         */
	function enumNodes($node,$callback,$bNext)
	{
		$result = true;
		if(!is_bool($bNext))
			$bNext = true;
		while($node !== NULL){
 //                   echo("check $node->tagName\n");
                    
                    $cond = array();
                    if(($result=$callback($node,$cond)) !== TRUE)
                            return $result;
                    //recherche dans les enfants
                    $child = $node->firstChild;
                    if(($child != null) && (!isset($cond["ignore_child"]))){
 //                   echo("check >> $child->tagName\n");
                            $result = $this->enumNodes($child,$callback,TRUE);
                            if($result !== TRUE)
                                    return $result;
                    }
                    //noeud suivant ...
                    if($bNext==TRUE)
                        $node = $node->nextSibling;
                    else
                        $node = NULL;
		}
		return $result;
	}

	function mergeArguments($select,$node,$merge_type){     
		//importe les arguments
		$attributes = $node->attributes; 
		if(!is_null($attributes)) 
		{ 
			foreach ($attributes as $index=>$attr) 
			{
				if($select_att_value = $select->getAttribute($attr->name))
				{
					if(is_callable($merge_type))
						$attr->value=$merge_type($attr->value,$select_att_value);
					else
					{
						switch($merge_type)
						{
							case "replace":
								$attr->value=$select_att_value;
								break;
							case "after":
								$attr->value=$attr->value.$select_att_value;
								break;
							case "before":
								$attr->value=$select_att_value.$attr->value;
								break;
						}  
					}  
				}                                                                       
			} 
		}
	}    
	/*  function XMLDocument() {
	     $this->formatOutput=true;
	   }   */
	//obtient le contenu d'un noeud specifique
	// retourne: le valeur du noeud trouvé (DOMNode), -1 si introuvable, NULL en cas d'erreur
	public function getNodeValue($path,$bcreate_missing=FALSE)
	{
		$node = $this->getNode($path,$bcreate_missing);
		if($node!==NULL && $node!==-1)
			return $node->nodeValue;
		return NULL;
	}   
	//definit le contenu d'un noeud specifique
	// retourne: le valeur du noeud trouvé (DOMNode), -1 si introuvable, NULL en cas d'erreur
	public function setNodeValue($path,$value,$bcreate_missing=FALSE)
	{
		$node = $this->getNode($path,$bcreate_missing);
		if($node!==NULL && $node!==-1)
			return ($node->nodeValue=$value);
		return NULL;
	}   
	//obtient la valeur d'un attribut
	public function getAtt($node,$name)
	{
		if(!$node || !$node->attributes)
			return "";
		
		$att = $node->attributes->getNamedItem($name); 
		if(!$att)
			return "";
		
		return $att->nodeValue;
	}
	//définit la valeur d'un attribut
	public function setAtt($node,$name,$value)
	{
		if(!$node)
			return "";
		
		return $node->setAttribute($name,$value); 
	}
	
	
	/*
         * @brief Obtient un élément du document
         * @param selector Sélecteur, de style CSS (voir Remarques)
         * @return Retourne le noeud trouvé (DOMNode), NULL si introuvable
         * 
         * @remarks Le selecteur peut prendre la forme suivante ( > TAGNAME [ATT_NAME=ATT_VALUE,...] )
         */
	public function one($selector,$context=NULL)
	{
            $cur = ($context===NULL) ? $this->documentElement : $context;
            
            //analyse le selecteur
            preg_match_all('/(\>|\/?)\s*(\w+)\s*(?:\[(\w+\=\w+(?:\,\w+\=\w+)*)\])?/i',$selector,$matches);

 //         echo("begin ($selector)\n");
           // print_r($matches);
            foreach($matches[2] as $key=>$tag){
//                echo("find ($tag)....");

                $cur = $this->enumNodes($cur->firstChild,function($node,&$cond) use ($key,$matches, $tag){
                    //enfant direct ?
 //                   echo("child ".trim($matches[1][$key])."\n");
                    if(trim($matches[1][$key]) == '>')
                        $cond["ignore_child"] = true;
                    //tagname
                    if($node->tagName != $tag)
                        return TRUE;
                    //attributs ?
                    if(!empty($matches[3][$key])){
                        $att_selector = $matches[3][$key];
                        $att_list = strexplode($att_selector, ',', true);
                        foreach($att_list as $att_pair){
                            $att = strexplode($att_pair, '=', true);
                            if($att[1] != $node->getAttribute($att[0]))
                                return TRUE;
                        }
                    }
                    //ok
                    return $node;
                }, true);
                
                //slection ok ?
                if ($cur === TRUE){
 //                   echo("not found\n");
                    return NULL;
                }
//                else echo("ok\n");
            }

 //               echo("end ($cur->tagName)\n");
            //retourne la nouvelle selection
            return $cur;
	}
	
	//obtient un noeud specifique
	// retourn: retourne le noeud trouvé (DOMNode), -1 si introuvable, NULL en cas d'erreur
	public function objGetNode($cur,$path,$bcreate_missing=FALSE)
	{  
		//explose le chemin d'acces en un tableau
		$path_ar = explode('/',$path);
		
		//si la chaine commence par un slash '/' et donc un element vide, l'element est ignore
		if(empty($path_ar[0]))
			array_shift($path_ar);
		
		//cherche dans l'arboresence
		for ($i = 0; $i < count($path_ar); $i++) {
			//	        echo("find in: " . $cur->tagName.", for: ".$path_ar[$i]."\n");
			$last = $cur;
			$cur = $this->getNextChildNode($cur, $path_ar[$i]);
			if ($cur == NULL) {
				//	            echo("can't find: " . $path_ar[$i]);
				// termine ici le noeud est introuvable
				if(!$bcreate_missing){
					return NULL; 
				}
				// sinon, cree le noeud manquant
				else{
					if(($cur = $this->createElement($path_ar[$i])) == NULL)
						return NULL; 
					$last->appendChild($cur);
				}
			}
		}
		//	    echo("objGetNode: $path=" . gettype($cur));
		return $cur;
	}
	
	
	//obtient un noeud specifique
	// retourn: retourne le noeud trouve (DOMNode), -1 si introuvable, NULL en cas d'erreur
	public function getNode($path,$bcreate_missing=FALSE)
	{    
		//explose le chemin d'acces en tableau et compare le premier noeud
		$path_ar = explode('/',$path);
		
		//si la chaine commence par un slash '/' et donc un element vide, l'element est ignore
		if(empty($path_ar[0]))
			array_shift($path_ar);
		
		//verifie l'existance d'un premier noeud
		if (!$this->documentElement){
			//rpost("getNode","no documentElement");
			// cree le noeud manquant?
			if($bcreate_missing){  
				//rpost("getNode","create documentElement");
				if(($cur = $this->createElement($path_ar[0])) == NULL)
					return NULL; 
				$this->appendChild($cur);
			}
			else         
				return -1; // introuvable
		}
		//verifie le premier noeud
		else if ($path_ar[0] != $this->documentElement->tagName) {    
			//rpost("getNode","premier noeud invalid!!");
			return -1;
		}
		//cherche dans l'arboresence 
		$cur = $this->documentElement;   
		for ($i = 1; $i < count($path_ar); $i++) {
			//echo("find in: " . $cur->tagName.", for: ".$path_ar[$i]."\n");
			$last = $cur;
			$cur = $this->getNextChildNode($cur, $path_ar[$i]);
			if ($cur == NULL) {
				//echo("can't find: " . $path_ar[$i]);
				// termine ici le noeud est introuvable
				if(!$bcreate_missing){
					return NULL; 
				}
				// sinon, cree le noeud manquant
				else{
					if(($cur = $this->createElement($path_ar[$i])) == NULL)
						return NULL; 
					$last->appendChild($cur);
				}
			}
		}
		return $cur;
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
	
	//recherche le prochain noeud enfant depuis son nom de balise
	public static function getNextChildNode($curNode, $tagName)
	{
		//	    echo($curNode->tagName . " as...\n");
		$children = $curNode->childNodes;
		for($i=0; $i<$children->length; $i++) {
			$child = $children->item($i);
			if($child->nodeType == XML_ELEMENT_NODE) // ignore les noeuds qui ne sont pas des elements
			{
				//            echo($child->tagName."\n");
				if($child->tagName == $tagName)
					return $child;
			}
		}
		return NULL;
	}
	
	//recherche le prochain noeud d'element
	public static function getNext($curNode, $tagName)
	{
		while(NULL!=($curNode = $curNode->nextSibling)){
			if($curNode->nodeType==XML_ELEMENT_NODE)
			{
				if(is_string($tagName) && ($curNode->tagName!=$tagName))
					continue;
				return $curNode;
			}
		}
		return NULL;
	}
	
	public static function appendSibling($newnode, $ref) 
	{ 
		if ($ref->nextSibling) { 
			// $ref has an immediate brother : insert newnode before this one 
			return $ref->parentNode->insertBefore($newnode, $ref->nextSibling); 
		} else { 
			// $ref has no brother next to him : insert newnode as last child of his parent 
			return $ref->parentNode->appendChild($newnode); 
		} 
	} 
	
	/*    public static function appendPrevious($newnode, $ref) 
	    { 
	      if ($ref->previousSibling) {                      
	        return $ref->parentNode->insertBefore($newnode, $ref);
	      } else {                                    
	        return $ref->parentNode->appendChild($newnode);   
	      } 
	    }    */
	
	//
	public static function checkConditionalNode($node, $cond)
	{
		$id = cInputIdentifier::regExp();
		if(!preg_match("/^([$id='.*';]*)/",$cond,$match)){
			return ERR_REQ_INVALID_ARG;
		}
		//print_r($match);
		return true;
	}
	
	//supprime l'element par son contenu
	//node:noeud parent a remplacer par son contenu
	// retourne: premier noeud enfant deplace, NULL si aucun
	public function replaceNodeByContent($node)
	{    
		$parent = $node->parentNode;
		if(!$parent){
			_stderr("XMLDocument::replaceNodeByContent(): node parent not found");
			return false;
		}  

		//deplace les enfants
		$first_child = NULL;
		$children = $node->childNodes;
		//	     _stderr("XMLDocument::replaceNodeByContent(): children ".$children->length);
		while($children->length) {
			$child = $children->item(0);
			if($first_child===NULL)
				$first_child=$child;
			//          if($child->nodeType==XML_ELEMENT_NODE)                
			//	           _stderr("XMLDocument::replaceNodeByContent(): move ".$child->tagName);                    
			$parent->insertBefore($child,$node);                             
		}
		
		//supprime le noeud de reference
		$parent->removeChild($node);
		
		//retourne le premier enfant
		return $first_child;
	}
	
	//supprime les noeuds enfants
	public function removeChildNodes($node)
	{
		//supprime les enfants
		$children = $node->childNodes;
		while($children->length) {
			$child = $children->item(0);
			$node->removeChild($child);                             
		}
		
		return true;
	}
}
?>

<?php
/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2011-2013 Thomas AUGUEY <contact@aceteam.org>
    ---------------------------------------------------------------------------------------------------------------------------------------
    This file is part of WebFrameWork.

    WebFrameWork is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WebFrameWork is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WebFrameWork.  If not, see <http://www.gnu.org/licenses/>.
    ---------------------------------------------------------------------------------------------------------------------------------------
*/

/**
 * Parser de fichier XML
 */

require_once("base.php");
require_once("regexp.php");
require_path("class/bases/");
require_path("inputs/");

class XMLDocument extends DOMDocument {
    
    const loadFile = "CANT_LOAD_HTML_FILE";
    const loadHTML = "CANT_LOAD_HTML_CONTENT";
    
    //attribute
    const Replace = "replace";
    const Ignore  = "ignore";
    const Merge   = "replace";
    
    //compareNode attribute
    const SameNode    = 0;
    const ArgDiffer   = 0x1;
    const ValueDiffer = 0x2;
    const TypeDiffer  = 0x4;
    const TagDiffer   = 0x8;
    const NSDiffer    = 0x10;
    
    function make($content) {
        return $this->loadHTML($content);
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
    function enumNodes($node, $callback, $bNext) {
        $result = true;
        if (!is_bool($bNext))
            $bNext = true;
        while ($node !== NULL) {
            //                   echo("check $node->tagName\n");

            $cond = array();
            if (($result = $callback($node, $cond)) !== TRUE)
                return $result;
            //recherche dans les enfants
            $child = $node->firstChild;
            if (($child != null) && (!isset($cond["ignore_child"]))) {
                //                   echo("check >> $child->tagName\n");
                $result = $this->enumNodes($child, $callback, TRUE);
                if ($result !== TRUE)
                    return $result;
            }
            //noeud suivant ...
            if ($bNext == TRUE)
                $node = $node->nextSibling;
            else
                $node = NULL;
        }
        return $result;
    }

    /*
     * @brief Fusionne recursivement deux éléments
     * @param XMLElement $select     Elément source
     * @param XMLElement $node       Elément de destination
     * @param string     $merge_type Type de fusion. Callback ou l'une des valeurs suivantes: "replace", "after", "before"
     * @return XMLElement Noeud modifié
     */
    public static function mergeNodesByTagName($in, $out, $src, $dst) {
        //merge les messages
        foreach($in->all(">*",$src) as $child_key=>$child_node)
        {
    //                    echo("test $child_node->tagName\n");

            $out_child_node  = $out->one('>'.$child_node->tagName,$dst);
            // si il n'existe pas, clone
            if($out_child_node == null){
    //                        echo("clone $child_node->tagName\n");
                $dst->appendChild( $out->importNode($child_node,TRUE) );
                continue;
            }
            else{
                XMLDocument::mergeNodesByTagName($in,$out,$child_node, $out_child_node);
            }
        }
        return TRUE;
    }
    
    /*
     * @brief Compare deux noeuds
     * @param XMLElement $src     Elément source
     * @param XMLElement $dst     Elément de destination
     * @return int Masque de bits définissant les differences entre les deux noeuds
     * @retval XMLDocument::SameNode Les deux noeuds sont identiques
     * 
     * ## Masque de différence
     * Le masque de retour peut prendre l'une des valeurs suivantes:
     * @code{.php}
     * ArgDiffer   = 0x1;   // Un ou plusieurs arguments différes
     * ValueDiffer = 0x2;   // La valeur du noeud différe
     * TypeDiffer  = 0x4;   // Le type du noeud différe
     * TagDiffer   = 0x8;   // Le nom de balise du noeud différe
     * NSDiffer    = 0x10;  // L'espace de nom différe
     * @endcode
     */
    function compareNode($src, $dst) {
        $dif = XMLDocument::SameNode;
        if($src->nodeType != $dst->nodeType)
            return XMLDocument::TypeDiffer;
        if($src->nodeType == XML_ELEMENT_NODE){
            //compare les arguments
            if (!is_null($src->attributes)) {
                foreach ($src->attributes as $index => $attr) {
                    if(!$dst->hasAttribute($attr)){
                        $dif |= XMLDocument::ArgDiffer;
                        break;
                    }
                }
            }
            //compare le nom de balise
            if($src->tagName != $dst->tagName)
                $dif |= XMLDocument::TagDiffer;
        }
        //compare le contenu
        if($src->nodeValue != $dst->nodeValue)
            $dif |= XMLDocument::ArgDiffer;
        //compare le namespace
        if($src->namespaceURI != $dst->namespaceURI)
            $dif |= XMLDocument::NSDiffer;
        
        return $dif;
    }
    
    /*
     * @brief Fusionne les arguments de deux éléments
     * @param XMLElement $select     Elément source
     * @param XMLElement $node       Elément de destination
     * @param string     $merge_type Type de fusion. Callback ou l'une des valeurs suivantes: "replace", "after", "before"
     * @return XMLElement Noeud modifié
     */
    function mergeArguments($select, $node, $merge_type) {
        //importe les arguments
        $attributes = $node->attributes;
        if (!is_null($attributes)) {
            foreach ($attributes as $index => $attr) {
                if ($select_att_value = $select->getAttribute($attr->name)) {
                    if (is_callable($merge_type))
                        $attr->value = $merge_type($attr->value, $select_att_value);
                    else {
                        switch ($merge_type) {
                            case "replace":
                                $attr->value = $select_att_value;
                                break;
                            case "after":
                                $attr->value = $attr->value . $select_att_value;
                                break;
                            case "before":
                                $attr->value = $select_att_value . $attr->value;
                                break;
                        }
                    }
                }
            }
        }
        return $node;
    }

    //obtient le contenu d'un noeud specifique
    // retourne: le valeur du noeud trouvé (DOMNode), -1 si introuvable, NULL en cas d'erreur
    public function getNodeValue($path, $bcreate_missing = FALSE) {
        $node = $this->getNode($path, $bcreate_missing);
        if ($node !== NULL && $node !== -1)
            return $node->nodeValue;
        return NULL;
    }

    //definit le contenu d'un noeud specifique
    // retourne: le valeur du noeud trouvé (DOMNode), -1 si introuvable, NULL en cas d'erreur
    public function setNodeValue($path, $value, $bcreate_missing = FALSE) {
        $node = $this->getNode($path, $bcreate_missing);
        if ($node !== NULL && $node !== -1){
            $this->setValue($value);
            return $value;
        }
        return NULL;
    }

    /*
     * Définit la valeur (texte) d'un élément
     * @param DOMElement $node Element a modifier
     * @param string $value Valeur à insérer
     * @remarks Le contenu de l'élément '$node' est remplacé
     * 
     * @return L'Element modifié
     */
    public function setValue($node, $value) {
        $valueEl = $this->createTextNode($value);
        $this->removeChildNodes($node);
        $node->appendChild($valueEl);
        return $node;
    }

    //obtient la valeur d'un attribut
    public function getAtt($node, $name) {
        if (!$node || !$node->attributes)
            return "";

        $att = $node->attributes->getNamedItem($name);
        if (!$att)
            return "";

        return $att->nodeValue;
    }

    //définit la valeur d'un attribut
    public function setAtt($node, $name, $value) {
        if (!$node)
            return "";

        return $node->setAttribute($name, $value);
    }

    /*
     * @brief Obtient plusieurs éléments du document
     * @param selector Sélecteur, de style CSS (voir Remarques)
     * @return Liste des noeuds trouvés (DOMNode), tableau vide si introuvable
     * 
     * @remarks Le selecteur peut prendre la forme suivante ( > TAGNAME [ATT_NAME=ATT_VALUE,...] )
     */

    public function all($selector, $context = NULL) {
        $list = array();

        $func = function($node) use(&$list) {
            //deja en liste ?
            if (!in_array($node, $list, true)) {
                return $node;
            }
            return TRUE;
        };

        //trouve le premier
        do {
            $cur = $this->one($selector, $context, $func);

            if ($cur != NULL)
                array_push($list, $cur);
        }while ($cur != NULL);

        //retourne la nouvelle selection
        return $list;
    }

    /*
     * @brief Obtient un élément du document
     * @param selector Sélecteur, de style CSS (voir Remarques)
     * @param addCheck Fonction de verification additionnel
     * @return Retourne le noeud trouvé (DOMNode), NULL si introuvable
     * 
     * @remarks Le selecteur peut prendre la forme suivante ( > TAGNAME [ATT_NAME=ATT_VALUE,...] )
     */

    public function one($selector, $context = NULL, $addCheck = NULL) {
        $cur = ($context === NULL) ? $this->documentElement : $context;

        //analyse le selecteur
        $value_att = '(?:\w+[\~]?\=(?:\'?[^\'\n\r\,\]]+\'?))';
        $exists_att = '(?:\w+)';
        preg_match_all('/(\>|\/?)\s*(\w+|\*)\s*(?:\[((?:'.$value_att.'|'.$exists_att.')(?:\,'.$value_att.'|\,'.$exists_att.')*)\])?/i', $selector, $matches);

 //                   print_r($selector."\n");
//          echo("begin ($selector)\n");
        foreach ($matches[2] as $key => $tag) {
            //               echo("find ($tag)....");

            //énumére les noeuds à la recherche 
            $cur = $this->enumNodes($cur->firstChild, function($node, &$cond) use ($addCheck, $key, $matches, $tag)
            {
                //enfant direct ?
                //echo("child $node->tagName\n");
                if (trim($matches[1][$key]) == '>')
                    $cond["ignore_child"] = true;
                //élément seulement
                if ($node->nodeType != XML_ELEMENT_NODE)
                    return TRUE;
                //tagname
                if ($tag != '*' && $node->tagName != $tag)
                    return TRUE;
                //attributs ?
                if (!empty($matches[3][$key])) {
                    $att_selector = $matches[3][$key];
                    $att_selector = str_replace("'",'',$att_selector);//remplace des éventuelles quotes contenus dans la regex
                    $att_list = strexplode($att_selector, ',', true);//éclate les selecteurs
 //                   print_r($att_list);
                    foreach ($att_list as $att_pair) {
                        //E[foo~=warning]
                        //Matches any E element whose "foo" attribute value is a list of space-separated values, one of which is exactly equal to "warning"
                        if(strstr($att_pair, '~=')){
                            $att = strexplode($att_pair, '~=', true);
                            $exp = '/((?:\s'.$att[1].'\s)|(?:^'.$att[1].'\s)|(?:\s'.$att[1].'$)|(?:^'.$att[1].'$))/i';
                            if (!preg_match($exp,$node->getAttribute($att[0])))
                                return TRUE;
                        }
                        //E[foo=warning]
                        //Matches any E element whose "foo" attribute value is exactly equal to "warning".
                        else if(strstr($att_pair, '=')){
                            $att = strexplode($att_pair, '=', true);
                            if ($att[1] != $node->getAttribute($att[0]))
                                return TRUE;
                        }
                        //E[foo]
                        //Matches any E element have "foo" attribute
                        else{
                            if (!$node->hasAttribute($att_pair))
                                return TRUE;
                        }
                    }
                }
                if (is_callable($addCheck)) {
                    return $addCheck($node);
                }
                //ok
                return $node;
            }, true);

            //slection ok ?
            if ($cur === TRUE) {
//                   echo("not found\n");
                return NULL;
            }
            //               else echo("found $cur->tagName\n");
        }

        //               echo("end ($cur->tagName)\n");
        //retourne la nouvelle selection
        return $cur;
    }

    //obtient un noeud specifique
    // retourn: retourne le noeud trouvé (DOMNode), -1 si introuvable, NULL en cas d'erreur
    public function objGetNode($cur, $path, $bcreate_missing = FALSE) {
        //explose le chemin d'acces en un tableau
        $path_ar = explode('/', $path);

        //si la chaine commence par un slash '/' et donc un element vide, l'element est ignore
        if (empty($path_ar[0]))
            array_shift($path_ar);

        //cherche dans l'arboresence
        for ($i = 0; $i < count($path_ar); $i++) {
            //	        echo("find in: " . $cur->tagName.", for: ".$path_ar[$i]."\n");
            $last = $cur;
            $cur = $this->getNextChildNode($cur, $path_ar[$i]);
            if ($cur == NULL) {
                //	            echo("can't find: " . $path_ar[$i]);
                // termine ici le noeud est introuvable
                if (!$bcreate_missing) {
                    return NULL;
                }
                // sinon, cree le noeud manquant
                else {
                    if (($cur = $this->createElement($path_ar[$i])) == NULL)
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
    public function getNode($path, $bcreate_missing = FALSE) {
        //explose le chemin d'acces en tableau et compare le premier noeud
        $path_ar = explode('/', $path);

        //si la chaine commence par un slash '/' et donc un element vide, l'element est ignore
        if (empty($path_ar[0]))
            array_shift($path_ar);

        //verifie l'existance d'un premier noeud
        if (!$this->documentElement) {
            //rpost("getNode","no documentElement");
            // cree le noeud manquant?
            if ($bcreate_missing) {
                //rpost("getNode","create documentElement");
                if (($cur = $this->createElement($path_ar[0])) == NULL)
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
                if (!$bcreate_missing) {
                    return NULL;
                }
                // sinon, cree le noeud manquant
                else {
                    if (($cur = $this->createElement($path_ar[$i])) == NULL)
                        return NULL;
                    $last->appendChild($cur);
                }
            }
        }
        return $cur;
    }

    //recherche le prochain element enfant
    public static function getChild($curNode) {
        $children = $curNode->childNodes;
        for ($i = 0; $i < $children->length; $i++) {
            $child = $children->item($i);
            if ($child->nodeType == XML_ELEMENT_NODE) { // ignore les noeuds qui ne sont pas des elements
                return $child;
            }
        }
        return NULL;
    }

    //recherche le prochain noeud enfant depuis son nom de balise
    public static function getNextChildNode($curNode, $tagName) {
        //	    echo($curNode->tagName . " as...\n");
        $children = $curNode->childNodes;
        for ($i = 0; $i < $children->length; $i++) {
            $child = $children->item($i);
            if ($child->nodeType == XML_ELEMENT_NODE) { // ignore les noeuds qui ne sont pas des elements
                //            echo($child->tagName."\n");
                if ($child->tagName == $tagName)
                    return $child;
            }
        }
        return NULL;
    }

    //recherche le prochain noeud d'element
    public static function getNext($curNode, $tagName) {
        while (NULL != ($curNode = $curNode->nextSibling)) {
            if ($curNode->nodeType == XML_ELEMENT_NODE) {
                if (is_string($tagName) && ($curNode->tagName != $tagName))
                    continue;
                return $curNode;
            }
        }
        return NULL;
    }

    public static function appendSibling($newnode, $ref) {
        if ($ref->nextSibling) {
            // $ref has an immediate brother : insert newnode before this one 
            return $ref->parentNode->insertBefore($newnode, $ref->nextSibling);
        } else {
            // $ref has no brother next to him : insert newnode as last child of his parent 
            return $ref->parentNode->appendChild($newnode);
        }
    } 

    public static function prependNode($newnode, $ref) {
        $ref->insertBefore($newnode, $ref->firstChild);
    } 

    /*    public static function appendPrevious($newnode, $ref) 
      {
      if ($ref->previousSibling) {
      return $ref->parentNode->insertBefore($newnode, $ref);
      } else {
      return $ref->parentNode->appendChild($newnode);
      }
      } */

    //
    public static function checkConditionalNode($node, $cond) {
        $id = cInputIdentifier::regExp();
        if (!preg_match("/^([$id='.*';]*)/", $cond, $match)) {
            return ERR_REQ_INVALID_ARG;
        }
        //print_r($match);
        return true;
    }

    /**
     * Remplace l'element par son contenu
     * @param DOMNode $node noeud à remplacer
     * @return Premier noeud enfant deplacé
     * @retval false L'élément est l'élément racine (il ne peut pas être remplacé
     */
    public function replaceNodeByContent($node) {
        $parent = $node->parentNode;
        if (!$parent) {
            _stderr("XMLDocument::replaceNodeByContent(): node parent not found");
            return false;
        }

        //deplace les enfants
        $first_child = NULL;
        $children = $node->childNodes;
        //	     _stderr("XMLDocument::replaceNodeByContent(): children ".$children->length);
        while ($children->length) {
            $child = $children->item(0);
            if ($first_child === NULL)
                $first_child = $child;
            //          if($child->nodeType==XML_ELEMENT_NODE)                
            //	           _stderr("XMLDocument::replaceNodeByContent(): move ".$child->tagName);                    
            $parent->insertBefore($child, $node);
        }

        //supprime le noeud de reference
        $parent->removeChild($node);

        //retourne le premier enfant
        return $first_child;
    }

    //supprime les noeuds enfants
    public function removeChildNodes($node) {
        //supprime les enfants
        $children = $node->childNodes;
        while ($children->length) {
            $child = $children->item(0);
            $node->removeChild($child);
        }

        return true;
    }

    /**
     * @brief Crée un élément simple avec un texte en contenu
     * @param type $tagName Nom de la balise
     * @param type $value Text à insérer
     * @return DOMElement Element créé
     */
    function createTextElement($tagName,$value) {
        $node = $this->createElement( $tagName );
        $node->appendChild( $this->createTextNode( self::parseValue($value) ) );
        return $node;
    }

    /**
     * @brief Convertie un objet PHP en type TEXT/XML
     * @param  mixed  $value Objet à convertir
     * @return string Valeur texte
     */
    public static function parseValue($value){
        if(is_object($value))
            $value = serialize($value);
       /* try{
            $value = @(string)$value;
        }
        catch (Exception $e){
            $value = serialize($value);
        }*/
        return $value;
    }
    
    /**
     * @brief Ajoute un ensemble d'éléments depuis un tableau associatif
     * @param type $parentNode Elément recevant les éléements créés
     * @param type $assocArray Tableau associatif conenant les valeurs à ajouter
     * @return DOMElement L'Element parent
     */
    function appendAssocArray($parentNode,$assocArray) {
        foreach($assocArray as $name=>$value)
            $parentNode->appendChild( $this->createTextElement($name, $value) );
        return $parentNode;
    }

    /**
     * @brief Ajoute un ensemble d'élément depuis un tableau associatif
     * @param type $parentNode Elément recevant les éléements créés
     * @param type $assocArray Tableau associatif conenant les valeurs à ajouter
     * @return DOMElement L'Element parent
     */
    function out() {
        header("content-type:text/xml");
        echo($this->saveXML());
    }

}

?>

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
 * Classe de fichier XML-Default
 */

class cXMLDefault {
    //errors
    const InvalidArg        = "XML_DEFAULT_INVALID_FUNCTION_ARG";
    const CantLoadFile      = "XML_DEFAULT_CANT_LOAD_FILE";
    const UnknownField      = "XML_UNKNOWN_FIELD";
    const PageNotFound      = "XML_PAGE_NOT_FOUND";
    const NoFileName        = "XML_SAVE_NO_FILENAME";
    const CantSaveFile      = "XML_CANT_SAVE_FILE";
    //options
    const FieldFormatClassName = 1;
    const FieldFormatName = 2;

    /** @ brief Instance de la classe XMLDocument */
    public $doc = NULL;
    public $fileName = NULL;

    /**
     * @brief Charge le document XML
     * @param $doc Chemin d'accès au fichier ou instance d'une classe XMLDocument
     * @return Résultat de procédure
     */
    public function Initialise($doc) {
        //Initialise les membres
        $this->doc = NULL;

        //charge le document
        if (is_string($doc)) {
            $this->fileName = $doc;
            $this->doc = new XMLDocument();
            if (!$this->doc->load($doc))
                return RESULT(cResult::Failed, cXMLDefault::CantLoadFile);
        }
        else if (($this->doc = $doc) === NULL) {
            return RESULT(cResult::Failed, cXMLDefault::InvalidArg);
        }

        return RESULT_OK();
    }

    /**
     * @brief SAuvegarde le document dans son fichier d'origine
     * @return Résultat de procédure
     */
    public function save() {
        if(!is_string($this->fileName))
            return RESULT_OK(cResult::Failed, cXMLDefault::NoFileName);
        if(FALSE===$this->doc->save($this->fileName))
            return RESULT(cResult::Failed, cXMLDefault::CantSaveFile);
        return RESULT_OK();
    }

    /*
      Obtient un noeud de l'index des modules (obselete, utiliser getConfigNode)
      Arguments:
      [string] id   : identificateur du module. Si null, retourne le premier noeud
      Retourne:
      [XMLElement] Noeud trouve, null si introuvable
     */

    public function getModuleConfigNode($id) {
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
          return null; */
        return $this->getConfigNode("module", $id);
    }

    /*
      Obtient un noeud de la configuration
      Arguments:
      [string] type : nom de balise de l'element enfant
      [string] id   : identificateur du module. Si null, retourne le premier noeud
      Retourne:
      [XMLElement] Noeud trouve, null si introuvable
     */

    public function getConfigNode($type, $id) {
        //obtient le noeud des modules
        $entry_node = $this->doc->getNode('site/config/' . $type);

        //premier noeud ?
        if ($id == NULL)
            return $entry_node;

        //recherche le noeud
        while ($entry_node != NULL) {
            $entry_id = $this->doc->getAtt($entry_node, "id");
            if ($entry_id == $id)
                return $entry_node;

            $entry_node = $this->doc->getNext($entry_node, $type);
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

    public function getValue($nodeName) {
        $node = $this->doc->getNode('site/' . $nodeName);
        //recherche
        if ($node)
            return $node->nodeValue;
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

    public function getIndexValue($type, $id) {
        //recherche
        $node = $this->getIndexNode($type, $id);
        if ($node)
            return $node->nodeValue;
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

    public function getIndexNode($type, $id) {
        //recherche
        $entry_node = $this->doc->getNode('site/index/' . $type);
        while ($entry_node) {
            $entry_id = $this->doc->getAtt($entry_node, "id");
            if ($entry_id == $id)
                return $entry_node;

            $entry_node = $this->doc->getNext($entry_node, $type);
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

    public function addIndexNode($type, $id) {
        //obtient le noeud de l'index
        $index_node;
        if (($index_node = $this->doc->getNode('site/index')) == NULL)
            return NULL;

        //cree l'element
        $node = $this->doc->createElement($type);
        if ($node == NULL) {
            $this->post("Initialise", "failed create node " . $type);
            return NULL;
        }

        $this->doc->setAtt($node, "id", $id);
        $index_node->appendChild($node);

        return $node;
    }

    /**
     * @brief Définit un noeud de l'index
     * @param string $type  Type de noeud (nom de balise)
     * @param string $id    Identificateur
     * @param string $value Valeur du noeud
     * @return DOMElement Noeud inséré, null en cas d'erreur
     * @remarks Si le noeud n'existe pas il est créé
     */
    public function setIndex($type, $id, $value)
    {
        $node = $this->doc->one(">index>$type"."[id=$id]");
        if(!$node)
            $node = $this->addIndexNode($type, $id);

        return $this->doc->setValue($node,$value);
    }

    /*
      Obtient un noeud de l'arbre de navigation
      Arguments:
      [string] page_id   : identificateur. Si null retourne le noeud parent de l'arbre 'site/tree'
      Retourne:
      [XMLElement] Noeud trouve, null si introuvable
     */

    public function getTreeNode($page_id) {
        $tree_node;
        if (($tree_node = $this->doc->getNode('site/tree')) == NULL){
            RESULT(cResult::Failed,  cXMLDefault::PageNotFound);
            return NULL;
        }
        if ($page_id == NULL)
            return $tree_node;
        //enumere les noeuds
        $ret = $this->doc->enumNodes($tree_node->firstChild, function($node, &$condition) use ($page_id) {
                    if ($node->nodeType == XML_ELEMENT_NODE && $node->tagName == $page_id) {
                        return $node;
                    }
                    return TRUE;
                }, true
        );

        if ($ret === TRUE){
            RESULT(cResult::Failed,  cXMLDefault::PageNotFound);
            return NULL;
        }
        RESULT_OK();
        return $ret;
    }

    /*
      Ajoute un noeud a l'arbre de navigation
      Arguments:
      [string] parent_id : identificateur de la page du parent. Si null, le neud est placé à la racine de l'arbre
      [string] page_id   : identificateur de la page à inserer
      Retourne:
      [XMLElement] Noeud insere, null en cas d'erreur
     * @remarks Si le noeud existe dans l'arbre, il est déplacé
     */

    public function addTreeNode($parent_id, $page_id) {
        $tree_node;
        if (($tree_node = $this->doc->getNode('site/tree')) == NULL){
            RESULT(cResult::Failed,  cXMLDefault::PageNotFound);
            return NULL;
        }
        //obtient le parent
        $parent_node;
        if ($parent_id == NULL)
            $parent_node = $tree_node;
        else if (($parent_node = $this->getTreeNode($parent_id)) == NULL){
            RESULT(cResult::Failed,  cXMLDefault::PageNotFound);
            return NULL;
        }
        //initialise l'enfant
        $page_node = $this->getTreeNode($page_id);
        if ($page_node == NULL) {
            if (($page_node = $this->doc->createElement($page_id)) == NULL){
                RESULT(cResult::Failed,  cXMLDefault::PageNotFound);
                return NULL;
            }
        }
        //insert le noeud
        if ($parent_node->appendChild($page_node) == NULL){
            RESULT(cResult::Failed,  cXMLDefault::PageNotFound);
            return NULL;
        }

        RESULT_OK();
        return $page_node;
    }

    /*
      Obtient le texte associé à un code de résultat
      @param string $code Code de résultat désiré
      @param string $lang Code du langage désiré
      @return Traduction du code. Si le texte est introuvable, $code est retourné.
     */
    public function getResultText($type, $code, $lang="fr")
    {
        $entry_node = $this->doc->one("results[lang=$lang]>$type>$code");
        if($entry_node === NULL){
            //echo("code $code not found");
            return $code;
        }

        return trim($entry_node->nodeValue);
    }

    /*
      Obtient le texte associé à une définition de champs
      @param string $id Identificateur du champs
      @param string $text Référence recevant le texte
      @param string $lang Langage utilisé
      @return Résultat de procédure
     */
    public function getFiledText($id, &$text, $lang="fr")
    {
        $entry_node = $this->doc->one("results[lang=$lang]>fields>$id");
        if($entry_node === NULL){
            return RESULT(cResult::Failed,cXMLDefault::UnknownField);
        }

        $text = trim($entry_node->nodeValue);
        
        return RESULT_OK();
    }

}

?>

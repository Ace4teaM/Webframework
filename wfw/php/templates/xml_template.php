<?php
/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2012-2014 Thomas AUGUEY <contact@aceteam.org>
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


require_once("base.php");
require_once("templates/template_markers.php");
require_once("xdocument.php");
require_once("regexp.php");
require_path("class/bases/");
require_path("inputs/");
  
/*?
	Template XML

	- Ajouter l'espace de nommage "http://www.webframework.fr/last/xmlns/template" à l'en-tête du fichier XML
	- Le template agit par "transformation" applicable aux éléments et leurs enfants
	- Tous les fichiers chargés dynamiquement durant une transformation sont relatifs à l'URL du document [input]
	- Les éléments sont analysés comme suit: si une action est définit -> sélection des données -> traitement des arguments -> transformation de l'élément

	## Actions
	SELECT   : Déplace le curseur de sélection. Si introuvable, l'élément est ignoré.
	EXIST    : Vérifie si une valeur existe dans la sélection, les arguments ou les paramètres. Si introuvable, l'élément est ignoré (le curseur de sélection est déplacé).
	ARRAY    : Transforme n fois un élément.
	MERGE    : Fusionne les attributs et le contenu texte de la source dans la destination.
	INCLUDE  : Inclue le contenu XML de la source dans la destination.
	IGNORE   : Ignore le contenu de l'élément concerné
	FORMAT   : Formate le contenu texte au format HTML
	EXP      : Test une expression réguliere sur la sélection

	## Éléments
	container : Utilisé pour contenir une action, 'container' est supprimé après génération (seul les enfants sont conservés)

	## Attributs
	* path      : chemin d'accès à la sélection.
		fichier+cible = [:FileName:[/xml_path]]
		absolue       = [/xml_path]
		relative      = [xml_path]
		noeud         = [identifier]
	* action    : identifiant de l'action à entreprendre sur l'élément.
	* condition : conditions dans une sélection SELECT ou ARRAY, une ou plusieurs des conditions ci-dessous:
		[attribut_name='value';] = condition d'egalite
	* exp       : expression réguliere utilisé avec l'action "EXP".

	## Marqueurs
	-{!Identifier}                   : insert un texte brut au document sans formatage XML (insére apres transformation du document)
	-{Identifier}                    : insert un texte passé en argument ou en sélection.
	-{Identifier|'ReplacementText'}  : insert un texte passé en argument ou en sélection, si introuvable insert le texte de remplacement.
	-{SectionId:Id}                  : insert un texte contenu dans l'index (default.xml): page, mail, uri, etc...
	-{SectionId:Id@Attribute}        : insert un attribut contenu dans l'index (default.xml): page, mail, uri, etc...
	-{:Page_Id}                      : insert un lien de page contenu dans l'index (default.xml). URI complète avec protocole.

	## Marqueurs prédéfinies
	-{__array_count__}               : dans une action ARRAY, retourne le compteur de boucle.
	-{__inner_text__}                : dans une action ARRAY ou SELECT, retourne le texte interne du noeud.
	-{__date_rfc822__}               : date actuelle au format RFC822.
	-{__date_w3c__}                  : date actuelle au format du W3C.
	-{__timpestamp__}                : timestamp UNIX en cours.
	-{__uri__}                       : nom de domaine spécifié dans "default.xml", vide si inexistant.
*/

/**
  @brief Classe de template XML
*/
class cXMLTemplate
{
    //--------------------------------------------------------
    // Constantes des erreurs
    // @class cXMLTemplate
    //--------------------------------------------------------
    
    const NoInputFile       = "XML_TEMPLATE_NO_INPUT_FILE";
    const NoInputElement    = "XML_TEMPLATE_NO_INPUT_ELEMENT";
    const CantLoadInputFile = "XML_TEMPLATE_CANT_LOAD_INPUT_FILE";
    const CantLoadSelectFile= "XML_TEMPLATE_CANT_LOAD_SELECTION_FILE";
	
    //--------------------------------------------------------
    // Membres
    // @class cXMLTemplate
    //--------------------------------------------------------
    
    // URI utilise par l'extention XML template
    public $wfw_template_uri = "http://www.webframework.fr/last/xmlns/template";
    // Instances des classes Marker
    public $check_text_class = NULL;
    // Instances des fichiers XML chargés
    public $xml_files = array();
    // Chemin d'acces aux fichiers chargeables
    public $var_path;
    // Arguments globales
    public $arg;
    // Element de selection
    public $select = NULL;
    // Fichier à transformer (entrée)
    public $doc = NULL;
    // Element de selection principale (entrée)
    public $input_element = NULL;
    // Décodes les entites HTML lors du chargement d'un document (load_xml_file)
    public $resolve_html_entites = true;
    // Evénement: apres transformation (cEvent class)
    public $transformed_event = NULL;
	
    //--------------------------------------------------------
    // Méthodes
    // @class cXMLTemplate
    //--------------------------------------------------------
    
    /**
     * @brief Constructeur
     */
    function __construct() {
        $this->transformed_event = new cEvent();
    }
    
    /**
     * @brief Définit le chemin racine
     */
    public function setRootPath($path) {
        $this->var_path = $path;
    }
    
    
    /**
     * @brief Prépare un template à être transformé
     * @param string/XMLDocument $input_file Nom ou instance du document à charger
     * @param XMLElement $input_element Elément de départ à transformer. Si NULL, l'élément racine du document $input_file est selectionné.
     * @param type $select_file Nom ou instance du document à charger en selection
     * @param type $select_element Elément de selection par défaut. Si NULL, l'élément racine du document $select_file est selectionné.
     * @param type $arg Tableau associatif des attributs de selection
     * @return boolean Résultat de procédure
     */
    public function Initialise($input_file, $input_element, $select_file, $select_element, $arg)
    {
        $timestamp = time();
        $this->arg = $arg;
        
        //obtient le chemin d'accès au template
        if (is_string($input_file)) {
            $input_pathinfo = pathinfo($input_file);
            $this->var_path = $input_pathinfo["dirname"] . "/";
        } else {
            $this->var_path = "";
        }
        $this->doc = NULL;

        // hostname  
        $hostname = "";
        {
            exec("hostname", $hostname, $return);
            if ($return == 0)
                $hostname = strtolower($hostname[0]);
            else
                $hostname = ""; //introuvable
        }

        // arguments predefinits
        $this->arg["__date_rfc822__"] = (date(DATE_RFC822, $timestamp));
        $this->arg["__date_w3c__"] = (date("Y-m-d", $timestamp));
        $this->arg["__timestamp__"] = $timestamp;
        $this->arg["__hostname__"] = $hostname;

        //charge le fichier en entrée
        if (is_string($input_file)) {
            if ($this->load($input_file)) {
                $this->input_element = $this->doc->documentElement;

                //stat sur le fichier
                $fstat = stat($input_file);
                if ($fstat) {
                    $this->arg["__file_ctime__"] = $fstat['ctime'];
                    $this->arg["__file_mtime__"] = $fstat['mtime'];
                    $this->arg["__file_ctime_rfc822__"] = date(DATE_RFC822, $fstat['atime']);
                    $this->arg["__file_mtime_rfc822__"] = date(DATE_RFC822, $fstat['mtime']);
                }
            }
            else
                return RESULT(cResult::Failed,cXMLTemplate::CantLoadInputFile);
        }
        //assigne le fichier en entrée
        else if($input_file!==NULL){
            $this->doc = $input_file;
            $this->input_element = (($input_element != NULL) ? $input_element : $this->doc->documentElement);
        }

        //pas de fichier en entrée ?
        if (!$this->doc)
            return RESULT(cResult::Failed,cXMLTemplate::NoInputFile);

        //pas d'élément en entrée ?
        if (!$this->input_element)
            return RESULT(cResult::Failed,cXMLTemplate::NoInputElement);

        //charge la selection
        if (is_string($select_file)) {
            if ($varfile = $this->load_xml_file($select_file))
                $this->select = $varfile->documentElement;
        }
        //assigne la selection
        else {
            $this->select = (($select_element == NULL && $select_file != NULL) ? $select_file->documentElement : $select_element);
        }

        //cree les instances de classes Marker
        $check_text_class = get_declared_classes_of("cTemplateMarker");
        foreach ($check_text_class as $i => $class_name) {
            $this->check_text_class[$i] = new $class_name($this, $this->arg);
        }

        return RESULT_OK();
    }

    /**
     * @brief Transforme le document
     * @return this Le template
     */
    public function Transform() {
        $first_child = $this->input_element->firstChild;
        if ($first_child !== NULL) {
            $this->check_node($this->select, $first_child, $this->arg);
            $this->clean_node($first_child);
        }
        return $this;
    }

    /**
     * @brief Fabrique le texte XML
     * @return string Contenu du document
     */
    public function Output() {
        //$file_content = $this->doc->saveHTML();

        $file_content = $this->doc->saveXML();
        //supprime la balise xml en tete de page
        $file_content = strstr($file_content, "\n");
        $file_content = ltrim($file_content, "\n\r");

        //finalise le contenu      
        foreach ($this->check_text_class as $i => $class) {
            $file_content = $class->finalize($file_content);
        }

        //supprime les lignes multiples
        $file_content = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $file_content);

        return $file_content;
    }

    /**
     * @brief Transforme puis fabrique le texte XML du document
     * @return string Contenu du document
     */

    public function Make() {
        $this->Transform();
        $this->transformed_event->call();
        return $this->Output();
    }

    /*
      Charge le document en cours (Herite de XMLDocument)
      [string]  path  : chemin du document à charger
      Retourne:
      true, false si le document 'input_file' ne peut pas etre charge.
     */
    public function load($path) {
        $this->doc = new XMLDocument("1.0", "utf-8");

        if ($this->doc->load($path) === FALSE)
            return false;
        /* 		//loadHTML permet le chargement des entitées HTML_ENTITIES "&"
          $ext = strtolower(file_ext($path));
          /*if($ext=="html" || $ext=="htm")
          {
          if(!@$this->doc->loadHTML($path))
          return false;
          }
          //load pour charger un fichier XML quelconque
          else if(!@$this->doc->load($path))
          return false; */
        return true;
        /* wfw.http_get(path);

          if((wfw.nav.httpRequest.readyState == wfw.request.READYSTATE_DONE) && (wfw.nav.httpRequest.status == 200))
          {
          this.input = xml_parse(wfw.http_getResponse());
          return true;
          }

          this.post("load","can't load input file ("+name+")");
          return false; */
    }

    /*
      Scan un texte a la recherche de marqueurs predefinit

      Arguments
      select: recoie le noeud de selection de l'action precedente, NULL si aucun.
      text  : la chaine a scaner.
      arg   : recoie les arguments de l'action precedente, tableau vide si aucune.
      [string]  delimiter_l_char : delimiteur gauche du marqueur
      [string]  delimiter_r_char : delimiteur droit du marqueur
      Retourne
      la valeur correspondante, si introuvable une chene vide.
     */
    public function check_text($select, $text, $arg, $delimiter_l_char = '{', $delimiter_r_char = '}') {
        $identifier = cInputName::regExp();
        $string = "[^\']*";
        $delimiter_l = "";
        $delimiter_r = "";
        $level = 0;

        //pour chaque niveaux d'imbriquations
        do {
            $old_text = $text;
            $level++;

            $delimiter_l .= "\\" . $delimiter_l_char;
            $delimiter_r .= "\\" . $delimiter_r_char;

            $this_ = $this; //requis pour etre appele dans le context de 'preg_replace_callback'
            // test chaques classes marker                                     
            foreach ($this->check_text_class as $i => $class) {
                // test chaque format
                $exp_list = $class::exp();
                foreach ($exp_list as $exp => $func) {
                    $text = preg_replace_callback(
                            '/\-' . $delimiter_l . $exp . $delimiter_r . '/', function ($matches) use ($this_, $arg, $select, $class, $func) {
                                //appel la fonction qui va traiter la chene
                                $value = $class->$func($this_, $select, $matches, $arg);

                                return $value;
                            }, $text
                    );
                }
            }
        } while ($old_text != $text); //si aucune modification du text, ne cherche pas de niveau superieur

        return $text;
    }

    /*
      check_arguments
      scan les arguments d'un noeud element
      Arguments
      select: recoie le noeud de selection de l'action precedente, NULL si aucune.
      node  : noeud element scaner.
      arg   : reçoie les arguments de l'action precedente, tableau vide si aucune.
     */
    public function check_arguments($select, $node, $arg, $func = "check_text") {
        if ($node != NULL) {
            $attributes = $node->attributes;
            if (!is_null($attributes)) {
                foreach ($attributes as $index => $attr) {
                    $new_value = $this->$func($select, $attr->value, $arg);
                    if ($attr->namespaceURI)
                        $node->setAttributeNS($this->wfw_template_uri, $attr->name, $new_value); //remplace (avec encodage des entites HTML)
                    else
                        $node->setAttribute($attr->name, $new_value); //encode les entites HTML (cause: sans effet dans un namespace)

                        
//$attr->value = @htmlentities($new_value);//encode les entites HTML (cause: warning message)
                }
            }
        }
    }

    /*
      merge_arguments
      importe les attributs existants du noeud en cours depuis la selection
      Arguments
      select: recoie le noeud de selection de l'action precedente, NULL si aucune.
      node  : noeud element scanne.
      arg   : recoie les arguments de l'action precedente, tableau vide si aucune.
     */
    public function merge_arguments($select, $node, $arg) {
        if ($select != NULL && $node != NULL) {
            //importe les arguments
            $attributes = $node->attributes;
            if (!is_null($attributes)) {
                foreach ($attributes as $index => $attr) {
                    if ($select_att = $select->getAttribute($attr->name)) {
                        if (!empty($select_att)) {
                            if ($attr->namespaceURI)
                                $node->setAttributeNS($this->wfw_template_uri, $attr->name, $select_att); //remplace (avec encodage des entites HTML)
                            else
                                $node->setAttribute($attr->name, $select_att); //encode les entites HTML (cause: sans effet dans un namespace)

                                
//$attr->value=@htmlentities($select_att); //remplace
                        }
                    }
                    //else rpost("merge_arguments","select as not attribute: ".$attr->name);
                }
            }
        }
    }

    /*
      include_arguments
      importe tout les attributs de la selection dans le noeud en cours
      Arguments
      select: recoie le noeud de selection de l'action precedente, NULL si aucune.
      node  : noeud element scaner.
      arg   : recoie les arguments de l'action precedente, tableau vide si aucune.
     */
    public function include_arguments($select, $node, $arg) {
        if ($select != NULL && $node != NULL) {
            //importe les arguments
            $attributes = $select->attributes;
            if (!is_null($attributes)) {
                foreach ($attributes as $index => $attr) {
                    $node->setAttribute($attr->name, $attr->value);
                }
            }
        }
    }

    /**
     * @brief  Importe le contenu d'un noeud dans un autre document
     * @param $input_doc Document recevant le noeud
     * @param $dst_node  Noeud de destination parent
     * @param $src_node  Noeud à importer
     */
    public static function import_node_content($input_doc, $dst_node, $src_node) {
        $list = array();
        //recursivement
        while ($src_node != NULL) {
            $import_node = $input_doc->importNode($src_node, TRUE);
            array_push($list, $import_node);
            $dst_node->appendChild($import_node);
            $src_node = $src_node->nextSibling;
        }
        return $list;
    }

    /**
     * @brief Vérifie si une condition est vrai
     * @deprecated since version 1.7
     *
     * @param $select     Noeud de la sélection active
     * @param $arg        Arguments en cours
     * @param $conditions Syntaxe de la condition
     *
     * @returns TRUE si la condition est vrai. FALSE si la condition est fausse ou invalide
     * 
     */
    public function verify_node_condition($select, $arg, $conditions) {
        if ($select == NULL)
            return NULL;

        $f_identifier = cInputName::regExp();
        $f_string = "[^\']*";

        $conditions_list = strexplode($conditions, ";", true);

        $conditions_exp = array(
            '(' . $f_identifier . ')=\'(' . $f_string . ')\'',
            '(' . $f_identifier . ')=#(' . $f_string . ')',
            '\'(' . $f_string . ')\'',
            '#(' . $f_string . ')'
        );

        // argument comparaison ...
        foreach ($conditions_list as $x => $cur_condition) {
            $is_find = false;
            $test = false;
            $i = 0;
            $is_ok = false;
            while ($i < sizeof($conditions_exp) && $is_find == false) {
                if (preg_match("/" . $conditions_exp[$i] . "/", $cur_condition, $matches)) {
                    $is_find = true;
                    switch ($i) {
                        //compare la valeur d'un attribut    
                        case 0:
                            //compare un attribut
                            if ($select->getAttribute($matches[1]) == $matches[2])
                                $is_ok = true;
                            break;
                        //compare la valeur d'un argument      
                        case 1:
                            //compare un attribut
                            if (isset($arg[$matches[2]]) && is_string($arg[$matches[2]]) && $select->getAttribute($matches[1]) == $arg[$matches[2]])
                                $is_ok = true;
                            break;
                        //compare la valeur en cours    
                        case 2:
                            //compare un attribut
                            if ($select->nodeValue == $matches[1])
                                $is_ok = true;
                            break;
                        //compare la valeur d'un argument     
                        case 3:
                            //compare un attribut
                            if (isset($arg[$matches[1]]) && is_string($arg[$matches[1]]) && $select->nodeValue == $arg[$matches[1]])
                                $is_ok = true;
                            break;
                        default:
                            $this->post("verify_node_condition", "test ??");
                            break;
                    }
                }
                $i++;
            }
            if ($is_ok === false)
                return false;
        }
        return true;
    }

    /**
     * @brief Transforme un noeuds, ses enfants et tout les noeuds suivants
     * @param $select Curseur sur le noeud en cours de sélection
     * @param $node Curseur sur le noeud en cours de transformation
     * @param $arg Pointeur sur le tableau associatif des arguments
     */
    public function check_node($select, $node, &$arg) {
        //scan recursivement
        while ($node != NULL) {
            $next = NULL;
            switch ($node->nodeType) {
                case XML_ELEMENT_NODE:
 //                   $this->post("cXMLTemplate::check_node", $node->tagName);
                    
                    $cur_select = $select;
                    $cur_node = $node;

                    //action?
                    $action = $node->getAttributeNS($this->wfw_template_uri, "action");
                    $node->removeAttributeNS($this->wfw_template_uri, "action"); //supprime l'attribut pour evite de repeter l'action indefiniment

                    if (!empty($action)) {
                        //procede a la selection
                        $target_path = $node->getAttributeNS($this->wfw_template_uri, "path");
                        $target_condition = $node->getAttributeNS($this->wfw_template_uri, "condition");

                        if (!empty($target_path))
                            $cur_select = $this->get_xml_selection($select, $arg, $target_path, $target_condition);

                        //execute l'action
                        $class_name = "cXMLTemplateAction_" . $action;
                        if (class_exists($class_name))
                            $next = $class_name::check_node($this, $cur_select, $node, $arg);
                        else
                            $this->post('action class not exists',$class_name);
                    }
                    else {
                        $this->check_arguments($cur_select, $node, $arg);
                        $this->clean_attributes($node);
                        
                        if ($node->firstChild != NULL)
                            $this->check_node($cur_select, $node->firstChild, $arg);
                    }
                    break;

                /* case XML_CDATA_SECTION_NODE:  
                  rpost("XML_CDATA_SECTION_NODE",$node->nodeValue);
                  break; */

                case XML_TEXT_NODE:
                    //attention avec $node->wholeText, XML_TEXT_NODE renvoie le contenu des noeuds de types XML_CDATA_SECTION_NODE (utiliser plutot $node->nodeValue) pour ignorer ce contenu
                    /* $new_node_value = check_text($select,$node->wholeText,$arg);
                      $node->replaceData(0,strlen($node->wholeText),$new_node_value); */
                    $new_node_value = $this->check_text($select, $node->nodeValue, $arg);
                    //	echo("replace ".$node->nodeValue." by ".$new_node_value);
                    $node->replaceData(0, strlen($node->nodeValue), $new_node_value);
                    break;
            }

            $node = ($next == NULL) ? $node->nextSibling : $next;
        }
    }

    //clone le contenu d'un element dans un nouvel element de type 'new_type'
    public function cloneContentElement($doc, $node, $new_type) {
        $new_node = $doc->createElement($new_type);

        $child = $node->firstChild;
        if (!$child)
            return;
        while ($child != NULL) {
            $new_child = $child->cloneNode(TRUE);
            $new_node->appendChild($new_child);
            $child = $child->nextSibling;
        }
        return $new_node;
    }

    //remplace le contenu d'un element par un autre
    public function replaceContentElement($doc, $node, $new_content) {
        //texte?
        if (is_string($new_content))
            $new_content = $doc->createTextNode($new_content);

        //supprime le contenu du noeud
        $child = $node->firstChild;
        while ($child != NULL) {
            $next = $child->nextSibling;
            $node->removeChild($child);
            $child = $next;
        }

        //insert le contenu
        if ($new_content != NULL)
            $node->appendChild($new_content);
        return $node;
    }

    //retourne le contenu HTML d'un noeud
    function getInnerHTML($node) {
        $innerHTML = '';
        $children = $node->childNodes;
        foreach ($children as $child) {
            $innerHTML .= $child->ownerDocument->saveXML($child);
        }

        return $innerHTML;
    }

    //scan le noeud donne et les noeuds suivants
    public function post($title, $msg) {
        //rpost($title,$msg);
        //echo("$title: $msg\n");
    }

    //nettoie les noeuds
    public function clean_node($node) {
        //recursivement
        while ($node != NULL) {
            $next = $node->nextSibling;

            //noeuds
            switch ($node->nodeType) {
                case XML_ELEMENT_NODE:
                    //if($node->namespaceURI == $this->wfw_template_uri)
                    if ($node->tagName == "template:container") {
                        // _stderr("clean_node, remove element: ".$node->tagName);
                        $new_node = $this->doc->replaceNodeByContent($node);
                        if ($new_node != NULL) {
                            $next = $new_node;
                            continue; //fin du switch
                        }
                    }

                    // supprime les attributs de templates
                    /* $attributes = $node->attributes; 
                      if(!is_null($attributes))
                      {
                      $i=0;
                      while(($attr=$attributes->item($i))!=NULL){
                      if($attributes->getNamedItemNS($this->wfw_template_uri,$attr->name) != NULL){
                      _stderr("clean_node, remove attributes: ".$attr->name);
                      $node->removeAttributeNS($this->wfw_template_uri,$attr->name);
                      }
                      else
                      $i++;//avance au prochain
                      }
                      } */

                    //traite les noeuds enfants
                    if ($node->firstChild != NULL)
                        $this->clean_node($node->firstChild);

                    break;

                case XML_TEXT_NODE:
                    break;
            }

            $node = $next;
        }
    }

    //nettoie les attributs
    public function clean_attributes($node) {
        if ($node != NULL) {
            if ($node->namespaceURI == $this->wfw_template_uri) {
                //rpost("clean_node","remove element: ".$node->tagName);
                //$next = $node->firstChild;
            } else {
                switch ($node->nodeType) {
                    case XML_ELEMENT_NODE:
                        $attributes = $node->attributes;
                        if (!is_null($attributes)) {
                            $i = 0;
                            while (($attr = $attributes->item($i)) != NULL) {
                                if ($attributes->getNamedItemNS($this->wfw_template_uri, $attr->name) != NULL) {
                                    $this->post("clean_node", "remove attributes: " . $attr->name);
                                    $node->removeAttributeNS($this->wfw_template_uri, $attr->name);
                                }
                                else
                                    $i++; //avance au prochain
                            }
                        }
                        break;
                }
            }
        }
    }
    
    /**
     * @brief Convertie les entités HTML seulement, les entités XML sont ignorées
     * @param string $myHTML Text à convertir
     * @return Text à convertie
     * @remarks Les entités (amp, lt, gt, quot, apos) ne sont pas converties
     */
    function htmlentities_only($myHTML) {
       return preg_replace_callback("/&([A-Za-z]{0,4}\w{2,3}|#[0-9]{2,3});/",function($matches){
           //ignore les entites XML
           switch(strtolower($matches[1])){
               case "amp":
               case "lt":
               case "gt":
               case "quot":
               case "apos":
                return $matches[0];
           }
 //          echo($matches[1]."=".html_entity_decode($matches[0])." , ");
           return html_entity_decode($matches[0]);
       } , $myHTML); 
    } 
    
    /**
     * @brief Charge un contenu XML en séléction
     * @param string $name Nom du fichier (sans chemin)
     * @param string $content Contenu du document XML
     * @return Instance du document XML
     * @retval NULL Le chargement du contenu a échoué
     */
    public function load_xml_content($name, $content) {
        
        //charge le fichier ?
        if (!isset($this->xml_files[$name])) {
            $file = new XMLDocument("1.0", "utf-8");

            //@todo: ne pas utiliser loadHTML() ou loadHTMLFile() car les espaces de noms (namespace) ne sont pas résolues et empéche le bon fonctionnement du template
            //@todo: la suppression des warning est indispensable pour ignorer les entités HTML non reconnues par le standard XML
            if(!$file->loadXML($content)){
                $error = libxml_get_last_error();
                $this->post("load_xml_file", "$filename can't load");
                RESULT(cResult::Failed,cXMLTemplate::CantLoadSelectFile,array("libxml_error"=>$error->message));
                return NULL;
            }
            
            $this->post("load_xml_content", "OK");
            $this->xml_files[$name] = $file;
        }

        RESULT_OK();
        return $this->xml_files[$name];
    }

    /**
     * @brief Charge un fichier de selection
     * @param string $name Nom du fichier (sans chemin)
     * @param string $path Chemin d'accès au fichier
     * @return Instance du fichier XML passé en argument
     * @retval NULL Le chargement du fichier a échoué
     */
    public function load_xml_file($name, $path = NULL) {
        //construit le chemin
        if ($path === NULL)
            $path = $this->var_path;

        //supprime le slash de fin
        if (substr($path, -1) == '/' || substr($path, -1) == '\\')
            $path = substr($path, 0, -1);
        $filename = $path . "/" . $name;


        //charge le fichier ?
        if (!isset($this->xml_files[$name])) {
            
            /* ! retourne false avec les fichiers distants (suivant configuration !
-             if (!file_exists($filename)) {
-                $this->post("load_xml_file", "$filename does not exists");
-                return NULL;
-            }*/
            $file = new XMLDocument("1.0", "utf-8");

            if(!($content = @file_get_contents($filename))){
                $this->post("load_xml_file", "$filename can't load");
                RESULT(cResult::Failed,cXMLTemplate::CantLoadInputFile,array("filename"=>$filename));
                return NULL;
            }
            //résoud les entités HTML, la methode loadXML() ne le fait pas
            if($this->resolve_html_entites)
            {
                $ext = strtolower(file_ext($filename));
                if($ext=="html"||$ext=="xhtml"||$ext=="htm"){
                    $content = $this->htmlentities_only($content);
                }
            }
            //@todo: ne pas utiliser loadHTML() ou loadHTMLFile() car les espaces de noms (namespace) ne sont pas résolues et empéche le bon fonctionnement du template
            //@todo: la suppression des warning est indispensable pour ignorer les entités HTML non reconnues par le standard XML
            if(!$file->loadXML($content)){
                $error = libxml_get_last_error();
                $this->post("load_xml_file", "$filename can't load");
                RESULT(cResult::Failed,cXMLTemplate::CantLoadSelectFile,array("libxml_error"=>$error->message));
                return NULL;
            }
            
            $this->post("load_xml_file", "$filename OK");
            $this->xml_files[$name] = $file;
        }

        RESULT_OK();
        return $this->xml_files[$name];
    }

    /**
     * @brief Assigne un fichier de selection
     * @param string $name Nom du fichier (sans chemin)
     * @param XMLDocument $file Instance du fichier XML
     * @return Instance du fichier XML passé en argument
     */
    public function push_xml_file($name, XMLDocument $file) {
        $this->xml_files[$name] = $file;
        $this->post("push_xml_file", "$name OK");

        return $file;
    }

    /**
     * @brief Obtient un fichier de selection
     * @param string $name Nom du fichier (sans chemin)
     * @return Instance du fichier XML
     * @retval NULL Fichier introuvable
     */
    public function get_xml_file($name) {
        if(isset($this->xml_files[$name]))
            return $this->xml_files[$name];

        return NULL;
    }

    /*
      get_xml_selection
      obtient une nouvelle selection
      Arguments
      current_select: la selection precedente, NULL si aucune.
      path          : chemin d'acces a la selection (voir en-tete).
      conditions    : conditions de la selection (voir en-tete).
      Retourne:
      La nouvelle selection, NULL si introuvable
      Remarques:
      cXMLTemplate::select n'est pas affecté
     */

    public function get_xml_selection($current_select, $arg, $path, $conditions = NULL) {

        //
        // charge un nouveau fichier...
        //
	if (substr($path, 0, 1) == ':') { //absolue
            $filename = cRegExpFmt::filename();
            if (preg_match("'^:(.*):(.*)$'", $path, $matches)) {
                //   if(preg_match("'^:($filename){1}:(.*)$'",$path,$matches)){
                $this->post("get_xml_selection", $matches[1] . " -> " . $matches[2]);
                if ($varfile = $this->load_xml_file($matches[1]))
                    return $this->get_xml_selection($varfile->documentElement, $arg, $matches[2], $conditions); //ok, re-selectionne avec le chemin seulement 
                $this->post("get_xml_selection", "cant load $matches[1]");
                return NULL;
            }
            else {
                $this->post("get_xml_selection", "($path) path invalid format!");
                return NULL;
            }
        }

        //
        // recherche dans le fichier en cours...
        //         

        if ($current_select == NULL) {
            $this->post("get_xml_selection", "no input file!");
            return NULL;
        }

        //obtient le fichier en cours
        $varfile = $current_select->ownerDocument;
        
        if(empty($path))
            return $varfile->documentElement;

        //convertie en classe XMLDocument
        /** @fixme Convertion de classe incertaine: (empty print_r($varfile->documentElement) ?!) */
        if(!($varfile instanceof XMLDocument) && ($varfile instanceof DOMDocument)){
            $varfile = new XMLDocument();
            cast($varfile, $current_select->ownerDocument);
            //print_r($varfile->documentElement);
        }

        //obtient la selection
        return $varfile->one($path, $current_select);
    }
    
    public function get_xml_selection_old($current_select, $arg, $path, $conditions = NULL) {

        //
        // charge un nouveau fichier...
        //
	if (substr($path, 0, 1) == ':') { //absolue
            $filename = cRegExpFmt::filename();
            if (preg_match("'^:(.*):(.*)$'", $path, $matches)) {
                //   if(preg_match("'^:($filename){1}:(.*)$'",$path,$matches)){
                $this->post("get_xml_selection", $matches[1] . " -> " . $matches[2]);
                if ($varfile = $this->load_xml_file($matches[1]))
                    return $this->get_xml_selection($varfile->documentElement, $arg, $matches[2], $conditions); //ok, re-selectionne avec le chemin seulement 
                return NULL;
            }
            else {
                $this->post("get_xml_selection", "($path) path invalid format!");
                return NULL;
            }
        }

        //
        // recherche dans le fichier en cours...
        //         

        if ($current_select == NULL) {
            $this->post("get_xml_selection", "no input file!");
            return NULL;
        }

        //obtient le fichier en cours
        $varfile = $current_select->ownerDocument;

        //chemin absolue dans le document en cours
        if (substr($path, 0, 1) == '/')
            $current_select = $varfile->getNode($path);
        //chemin relatif a la selection
        else
            $current_select = $varfile->objGetNode($current_select, $path);

        //attention, forcer le retour à NULL, car objGetNode peut retourner -1 en cas d'echec
        if ($current_select === -1)
            $current_select = NULL;

        if (!$current_select) {
            $this->post("get_xml_selection ($path)", "failed");
        }

        //verifie la condition
        if (($conditions != null) && (!empty($conditions))) {
            while ($current_select != null) {
                if ($this->verify_node_condition($current_select, $arg, $conditions))
                    return $current_select;
                $current_select = $varfile->getNext($current_select, $current_select->tagName);
            }
            return null;
        }

        //retourne la nouvelle selection
        return $current_select;
    }

}

/*
  Action de base
 */
class cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {
        return NULL; /* noeud suivant ou NULL si auto */
    }

}

/*
  Duplique et transforme en boucle les noeuds enfants
 */
class cXMLTemplateAction_each extends cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {
        $arg['__count__'] = 0;

        $condition = $node->getAttributeNS($input->wfw_template_uri, "condition");

        $select = $select->firstChild;

        $next = $node->nextSibling;
        //scan le contenu
        while ($select != NULL) {
            if (($select->nodeType == XML_ELEMENT_NODE) && (empty($condition) || $input->verify_node_condition($select, $arg, $condition))) {
                $arg['__count__']++;
                $arg['__inner_text__'] = $select->nodeValue;
                $arg['__selection_name__'] = $select->tagName;

                //$this->post("check_node","add array item");
                //copie le noeud
                $node_new = $node->cloneNode(TRUE);

                //traite les arguments pour ce noeud
                $input->check_arguments($select, $node_new, $arg);

                //supprime les attributs inutiles
                $input->clean_attributes($node_new);

                $node->parentNode->insertBefore($node_new, $node);
                //scan le contenu enfant
                if ($node_new->firstChild != NULL)
                    $input->check_node($select, $node_new->firstChild, $arg);
            }

            //obtient le prochain noeud du meme nom
            $select = $select->ownerDocument->getNext($select, NULL);
        }

        //supprime le noeud de reference
        if ($node->parentNode)
            $node->parentNode->removeChild($node);

        return $next;
    }

}

/*
	Duplique et transforme en boucle le noeud en correspondance avec chaque selection trouve
 */
class cXMLTemplateAction_array extends cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {
        $arg['__array_count__'] = 0;

        $condition = $node->getAttributeNS($input->wfw_template_uri, "condition");

        $next = $node->nextSibling;
        //scan le contenu
        while ($select != NULL) {
            if ((empty($condition) || $input->verify_node_condition($select, $arg, $condition))) {
                $arg['__array_count__']++;
                $arg['__inner_text__'] = $select->nodeValue;

                //$this->post("check_node","add array item");
                //copie le noeud
                $node_new = $node->cloneNode(TRUE);

                //traite les arguments pour ce noeud
                $input->check_arguments($select, $node_new, $arg);

                //supprime les attributs inutiles
                $input->clean_attributes($node_new);

                $node->parentNode->insertBefore($node_new, $node);
                //scan le contenu enfant
                if ($node_new->firstChild != NULL)
                    $input->check_node($select, $node_new->firstChild, $arg);
            }

            //obtient le prochain noeud du meme nom
            $select = $select->ownerDocument->getNext($select, $select->tagName);
        }

        //supprime le noeud de reference
        if ($node->parentNode)
            $node->parentNode->removeChild($node);

        return $next;
    }

}

/*
  Déplace le curseur de sélection sur un ou plusieurs éléments
  Transformation:
     Si l'action ne peut pas être appliquée, l'élément et ses enfants sont supprimés.
     L'Élément est dupliqué autant de fois qu'il y a de transformation à éffectuées (méthode cXMLTemplate::check_node)

  Attributs:
     action   = "all"
     selector = Sélecteur CSS vers les éléments cibles

  Arguments générés:
     __array_count__ = Index de l'élément en cours (débute à 1)
     __inner_text__  = Valeur de l'élément sélectionné (texte)
     __tag_name__    = Nom de la balise sélectionnée

  Exemples:
     <li template:action="all" template:selector="books > "> Book #-{__array_count__} is -{__inner_text__}</li>
 */
class cXMLTemplateAction_all extends cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {
        $arg['__array_count__'] = 0;

        $next = $node->nextSibling;
        
        $selector = $node->getAttributeNS($input->wfw_template_uri, "selector");

        $all = $input->doc->all($selector,$select);

        //scan le contenu
        foreach($all as $key=>$select) {
            $arg['__array_count__']++;
            $arg['__inner_text__'] = $select->nodeValue;
            $arg['__tag_name__'] = $select->tagName;

            //$this->post("check_node","add array item");
            //copie le noeud
            $node_new = $node->cloneNode(TRUE);

            //traite les arguments pour ce noeud
            $input->check_arguments($select, $node_new, $arg);

            //supprime les attributs inutiles
            $input->clean_attributes($node_new);

            $node->parentNode->insertBefore($node_new, $node);
            //scan le contenu enfant
            if ($node_new->firstChild != NULL)
                $input->check_node($select, $node_new->firstChild, $arg);
        }

        //supprime le noeud de reference
        if ($node->parentNode)
            $node->parentNode->removeChild($node);

        return $next;
    }

}


/*
  Déplace le curseur de sélection sur un élément
  Transformation:
     Si l'action ne peut pas être appliquée, l'élément et ses enfants sont supprimés.
     L'Élément est transformé (méthode cXMLTemplate::check_node)

  Attributs:
     action   = "one"
     selector = Sélecteur CSS vers l'élément cible

  Arguments générés:
     __inner_text__  = Valeur de l'élément sélectionné (texte)
     __tag_name__    = Nom de la balise séléctionnée

  Exemples:
     <li template:action="one" template:selector="books > ">First Book is -{__inner_text__}</li>
 */
class cXMLTemplateAction_one extends cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {

        $next = $node->nextSibling;
        
        $selector = $node->getAttributeNS($input->wfw_template_uri, "selector");

        $select = $input->doc->one($selector,$select);
//        print_r($all);
        //scan le contenu
        if($select) {
            $arg['__inner_text__'] = $select->nodeValue;
            $arg['__tag_name__'] = $select->tagName;

            //traite les arguments pour ce noeud
            $input->check_arguments($select, $node, $arg);

            //supprime les attributs inutiles
            $input->clean_attributes($node);

            //scan le contenu enfant
            if ($node->firstChild != NULL)
                $input->check_node($select, $node->firstChild, $arg);
        }
        //sinon, supprime ce noeud
        else {
            $input->post("cXMLTemplateAction_one", "selection introuvable, supprime le noeud de reference.");
            if ($node->parentNode)
                $node->parentNode->removeChild($node);
        }

        return $next;
    }

}

/*
	Test une expression reguliere sur la selection
 */
class cXMLTemplateAction_exp extends cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {
        //check les arguments
        $input->check_arguments($select, $node, $arg);

        //obtient les attributs speciaux
        $target_exp = $node->getAttributeNS($input->wfw_template_uri, "exp");

        //procède à une selection temporaire
        $target_str = null;
        $target_node = null;
        $target = $node->getAttributeNS($input->wfw_template_uri, "target");
        if (!empty($target) && isset($arg[$target]))
            $target_str = $arg[$target];
        if (!empty($target))
            $target_node = $input->get_xml_selection($select, $arg, $target, $node->getAttributeNS($input->wfw_template_uri, "condition"));

        //supprime les attributs inutiles
        $input->clean_attributes($node);

        //suivant		
        $next = $node->nextSibling;

        //ok? scan le contenu
        if (($select != null || $target_node != null || is_string($target_str)) && is_string($target_exp)) {
            if ($target_node !== NULL)
                $exp_target_value = $target_node->nodeValue;
            else if ($target_str !== NULL)
                $exp_target_value = $target_str;
            else if ($select !== NULL)
                $exp_target_value = $select->nodeValue;

            if (preg_match('/' . $target_exp . '/', $exp_target_value)) {
                $input->post("cXMLTemplateAction_exp", "$target_exp = vrai, ajoute et scan le contenu. (" . $exp_target_value . ")");

                //scan le contenu avec la nouvelle selection   
                if ($node->firstChild != NULL)
                    $input->check_node($select, $node->firstChild, $arg);

                return $next;
            }
            else {
                $input->post("cXMLTemplateAction_exp", "$target_exp = faux, supprime le noeud de reference. (" . $exp_target_value . ")");
                if ($node->parentNode)
                    $node->parentNode->removeChild($node);

                return $next;
            }
        }

        //sinon, supprime ce noeud
        $input->post("cXMLTemplateAction_exp", "pas de selection disponible, supprime le noeud de reference.");
        if ($node->parentNode)
            $node->parentNode->removeChild($node);

        return $next;
    }

}

/*
	Evalue une expression du langage
 */
class cXMLTemplateAction_eval extends cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {
        //check les arguments
        $input->check_arguments($select, $node, $arg);

        //obtient les attributs speciaux
        $att_eval = $node->getAttributeNS($input->wfw_template_uri, "eval");
        $att_target = $node->getAttributeNS($input->wfw_template_uri, "target");

        //supprime les attributs inutiles
        $input->clean_attributes($node);

        //suivant		
        $next = $node->nextSibling;

        if (empty($att_eval) || empty($att_target))
            return $next;

        if (!cInputEvalString::isValid($att_eval)) {
            $arg[$att_target] = "not";
            return $next;
        }

        //evalue l'expression
        $eval_value = @eval("return ''.($att_eval);");
        if (is_string($eval_value))
            $arg[$att_target] = $eval_value;
        else
            $arg[$att_target] = "no";

        //scan le contenu
        if ($node->firstChild != NULL)
            $input->check_node($select, $node->firstChild, $arg);

        return $next;
    }

}

/*
  Déplace le curseur de sélection sur l'élément choisi
  Transformation:
     Si l'action ne peut pas être appliquée, l'éléments et ses enfants sont supprimés.
     Sinon l'élément est transformé (méthode cXMLTemplate::check_node)

  Attributs:
     action = "select"
     path   = Chemin d'accès à l'élément cible

  Arguments générés:
     __inner_text__ = Valeur de l'élément sélectionné (texte)

  Exemples:
     <div template:action="select" template:path="/root/element"> Si l'élément 'book' est sélectionné</div>
 */
class cXMLTemplateAction_select extends cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {
        //traite les arguments pour ce noeud      
        $input->check_arguments($select, $node, $arg);

        //clean
        $input->clean_attributes($node);

        //sauve le noeud suivant		
        $next = $node->nextSibling;

        //ok? scan le contenu
        if ($select != NULL) {
            $arg['__inner_text__'] = $select->nodeValue;

            $input->post("cXMLTemplateAction_select", "sélection ok, ajoute et scan le contenu.");

            //scan le contenu avec la nouvelle selection   
            if ($node->firstChild != NULL)
                $input->check_node($select, $node->firstChild, $arg);
        }
        //sinon, supprime ce noeud
        else {
            $input->post("cXMLTemplateAction_select", "sélection introuvable, supprime le noeud de référence.");
            if ($node->parentNode)
                $node->parentNode->removeChild($node);
        }

        return $next;
    }

}

/*
  Test l’existence d'un argument

  Transformation:
     Si l'action ne peut pas être appliquée, l'éléments et ses enfants sont supprimés.
     Sinon l'élément est transformé (méthode cXMLTemplate::check_node)

  Attributs:
     action = "exists"
     name   = Nom de l'argument

  Exemples:
     <div template:action="exists" template:name="my_arg"> Si 'my_arg' existe</div>
     <div template:action="exists" template:name="!my_arg"> Si 'my_arg' n'existe pas</div>
 */
class cXMLTemplateAction_exists extends cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {
        //traite les arguments pour ce noeud      
        $input->check_arguments($select, $node, $arg);

        $name = $node->getAttributeNS($input->wfw_template_uri, "name");
        
        // si le nom est précédé de '!', test un argument qui n'existe pas
        $not_exist = false;
        if(!empty_string($name) && $name[0]=='!'){//negtive
            $name = substr($name,1);
            $not_exist = true;
        }
        
        //clean
        $input->clean_attributes($node);

        //sauve le noeud suivant		
        $next = $node->nextSibling;

        //ok? scan le contenu
        if (!empty_string($name) && $not_exist && !isset($arg[$name])) {
            $arg['__inner_text__'] = "";

            $input->post("cXMLTemplateAction_select", "attribut ok, ajoute et scan le contenu.");

            //scan le contenu avec la nouvelle selection   
            if ($node->firstChild != NULL)
                $input->check_node($select, $node->firstChild, $arg);
        }
        //ok? scan le contenu
        else if (!empty_string($name) && !$not_exist && isset($arg[$name])) {
            $arg['__inner_text__'] = $arg[$name];

            $input->post("cXMLTemplateAction_select", "attribut ok, ajoute et scan le contenu.");

            //scan le contenu avec la nouvelle selection   
            if ($node->firstChild != NULL)
                $input->check_node($select, $node->firstChild, $arg);
        }
        //sinon, supprime ce noeud
        else {
            $input->post("cXMLTemplateAction_select", "attribut introuvable, supprime le noeud de reference.");
            if ($node->parentNode)
                $node->parentNode->removeChild($node);
        }

        return $next;
    }

}

/*
  Fusionne le contenu XML de la sélection dans le nœud en cours
  Attributs:
	  action = "merge"
	  path   = Chemin d'accès à l'élément cible
 */
class cXMLTemplateAction_merge extends cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {
        //traite les arguments pour ce noeud      
        $input->check_arguments($select, $node, $arg);

        //clean
        $input->clean_attributes($node);

        //sauve le noeud suivant		
        $next = $node->nextSibling;

        if ($select != NULL) {
            //    _stderr("check_node_mergeNS(): ".$input->getAtt($select,"href"));           
            //merge les attributs
            $input->check_arguments($select, $node, $arg);
            $input->merge_arguments($select, $node, $arg);
            //merge le contenu text
            //  $node->nodeValue = $node->nodeValue.$select->nodeValue;
            $input->import_node_content($input->doc, $node, $select->firstChild);
        }
        
        //scan les enfants meme si la selection échoue
        if ($node->firstChild != NULL)
            $input->check_node(NULL, $node->firstChild, $arg);

        return $next;
    }
}

/*
  Inclue contenu XML de la sélection dans le nœud en cours.
  Attributs:
	  action = "include"
	  path   = Chemin d'accès à l'élément cible.
	  option = Une combinaison des valeurs suivantes:
			   - "include_att"  = Inclue les attributs
			   - "content_only" = Inclue uniquement le contenu du noeud
 */
class cXMLTemplateAction_include extends cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {
        //obtient les options de formatage
        $opt = $node->getAttributeNS($input->wfw_template_uri, "option");
        //options
        if (!empty($opt)) {
            $opt_list = explode(" ", $opt);
            $opt_list = array_flip($opt_list);
        }
        else
            $opt = null; //tout

        //traite les arguments pour ce noeud
        $input->check_arguments($select, $node, $arg);

        //clean
        $input->clean_attributes($node);

        //sauve le noeud suivant
        $next = $node->nextSibling;

        if ($select != NULL) {
            if (isset($opt_list["include_att"]))
                $input->include_arguments($select, $node, $arg);

            //insert le contenu seulement
            if (isset($opt_list["content_only"])) {
                $import_node_list = $input->import_node_content($input->doc, $node, $select->firstChild);

                //scan le contenu
                foreach ($import_node_list as $i => $cur) {
                    $input->check_node(NULL, $cur, $arg);
                }
            }
            //insert le noeud + son contenu
            else {
                $import_node = $input->doc->importNode($select, TRUE);
                $node->appendChild($import_node);

                //scan le contenu                    
                if ($import_node->firstChild != NULL)
                    $input->check_node(NULL, $import_node->firstChild, $arg);
            }
        }
        //sinon, supprime ce noeud
        else {
            $input->post("cXMLTemplateAction_include", "selection introuvable, supprime le noeud de reference.");
            if ($node->parentNode)
                $node->parentNode->removeChild($node);
        }

        return $next;
    }

}

/*
  Fabrique un sous contenu dans la destination
  Attributs:
	  action = "make"
	  path   = selection en cours.
	  import = chemin d'acces a l'element cible.
 */
class cXMLTemplateAction_make extends cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {
        
        //obtient la selection a importer
        $import = $node->getAttributeNS($input->wfw_template_uri, "import");
        if(empty($import))
            return;
        
        $import = $input->get_xml_selection($select, $arg, $import);
        
        //echo("import=");print_r($import);
        //obtient les options de formatage
        $opt = $node->getAttributeNS($input->wfw_template_uri, "option");
        //options
        if (!empty($opt)) {
            $opt_list = explode(" ", $opt);
            $opt_list = array_flip($opt_list);
        }
        else
            $opt = null; //tout


        //traite les arguments pour ce noeud
        $input->check_arguments($select, $node, $arg);

        //clean
        $input->clean_attributes($node);

        //sauve le noeud suivant
        $next = $node->nextSibling;

        if ($import != NULL) {
            if (isset($opt_list["include_att"]))
                $input->include_arguments($import, $node, $arg);

            //insert le contenu seulement
            if (isset($opt_list["content_only"])) {
                $import_node_list = $input->import_node_content($input->doc, $node, $import->firstChild);

                //scan le contenu
                foreach ($import_node_list as $i => $cur) {
                    $input->check_node($select, $cur, $arg);
                }
            }
            //insert le noeud + son contenu
            else {
                $import_node = $input->doc->importNode($import, TRUE);
                $node->appendChild($import_node);

                //scan le contenu                    
                if ($import_node->firstChild != NULL)
                    $input->check_node($select, $import_node->firstChild, $arg);
            }
        }
        //sinon, supprime ce noeud
        else {
            $input->post("cXMLTemplateAction_make", "selection introuvable, supprime le noeud de reference.");
            if ($node->parentNode)
                $node->parentNode->removeChild($node);
        }

        return $next;
    }

}

/*
  Inclue du contenu XML dans la destination
  Attributs:
	  action = "ignore"
	  path   = chemin d'acces a l'element cible.
 */
class cXMLTemplateAction_ignore extends cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {
        //clean
        $input->clean_attributes($node);

        return $node->nextSibling;
    }

}

/*
  Formate un texte brut en texte HTML
  Attributs:
	  action = "format"
	  transform = si true, les elements enfants sont transformés par checkNode()
	  preset = type de formatage ("script", "text"). Si non définit tous les formatages sont éffectués
 */
class cXMLTemplateAction_format extends cXMLTemplateAction {

    public static function check_node($input, $select, $node, $arg) {
        //obtient les options de formatage
        $preset = $node->getAttributeNS($input->wfw_template_uri, "preset");
        $transform = $node->getAttributeNS($input->wfw_template_uri, "transform");

        //traite les arguments pour ce noeud      
        $input->check_arguments($select, $node, $arg);

        //clean
        $input->clean_attributes($node);

        //sauve le noeud suivant	
        $next = $node->nextSibling;

        //scan le contenu avec la selection
        if ($transform == "true") {
            if ($node->firstChild != NULL)
                $input->check_node($select, $node->firstChild, $arg);
        }
        //formate le texte
        $text = $input->getInnerHTML($node);
        if ($transform == "true")
            $text = $input->check_text($select, $input->getInnerHTML($node), $arg);

        $check_value_func = array(
            ("([&]+)") => "sp", //caracteres speciaux
            ("([\<]+)") => "sp", //caracteres speciaux
            ("([\>]+)") => "sp", //caracteres speciaux
            ("^([\s]+)") => "blank_line", //lignes vides en debut de texte
            ("([\s]+)$") => "blank_line", //lignes vides en fin de texte
            ("\n[ ]+") => "spacing", //espacements en debut de ligne
            ("\s(\')([^\'\<\>]*)\'") => "citation",
            ("\s(\")([^\"\<\>]*)\"") => "citation",
            ("\s(\')([^\'\<\>]*)\'") => "string",
            ("\s(\")([^\"\<\>]*)\"") => "string",
            //("\s(break|continue|do|for|import|new|this|void|case|default|else|function|in|return|comment|delete|export|if|label|switch|var|with)\s") => "js_keyword",
            ("\n") => "lf",
            ("(http:\/\/)([^\<\>\"\s\n\f\r]*)[\s\n\f\r]{0,1}") => "uri",
            ("(https:\/\/)([^\<\>\"\s\n\f\r]*)[\s\n\f\r]{0,1}") => "uri",
            ("[-]{5,}") => "lh", //lignes horizontale
        );

        //preset ?
        switch ($preset) {
            case "script":
                $opt = "sp blank_line spacing lf";
                break;
            case "text":
                $opt = "sp blank_line spacing citation lf uri lh";
                break;
            default://tout
                $opt = "sp blank_line spacing citation lf uri lh";
                break;
        }
        $opt_list = explode(" ", $opt);
        $opt_list = array_flip($opt_list);

        // pour chaque format                                     
        foreach ($check_value_func as $exp => $func) {
            if (isset($opt_list[$func]))
                $text = preg_replace_callback(
                        '/' . $exp . '/', function ($matches) use ($arg, $select, $func) {
                            //appel la fonction qui va traiter la chene
                            $value = cXMLTemplateAction_format::$func($select, $matches, $arg);
                            return $value;
                        }, $text
                );
        }

        //cree le fragment de code XML
        $textNode = $input->doc->createDocumentFragment();
        $textNode->appendXML($text);

        //remplace le noeud de reference
        $input->replaceContentElement($input->doc, $node, $textNode);

        return $next;
    }

    //caracteres speciaux
    public static function sp($select, $matches, $arg) {
        switch ($matches[0]) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
        }
        return $matches[0];
    }

    public static function lf($select, $matches, $arg) {
        return "<br />";
    }

    public static function spacing($select, $matches, $arg) {
        return '<br /><span style="width:' . (strlen($matches[0]) * 8) . 'px; display:inline-block;"></span>';
    }

    public static function blank_line($select, $matches, $arg) {
        return "";
    }

    public static function lh($select, $matches, $arg) {
        return "<hr />";
    }

    public static function citation($select, $matches, $arg) {
        $sep = $matches[1];
        $text = $matches[2];
        return " " . $sep . "<code style=\"font-style:italic;\">$text</code>" . $sep;
    }

    public static function string($select, $matches, $arg) {
        $sep = $matches[1];
        $text = $matches[2];
        return '<span style="color:#990000;">' . $sep . $text . $sep . '</span>';
    }

    /*
      public static function js_keyword($select,$matches,$arg){
      $keyword = $matches[1];
      return ' <span style="color:#000099;">' . $keyword . '</span> ';
      } */

    public static function uri($select, $matches, $arg) {
        $proto = $matches[1];
        $uri = $matches[2];
        if (substr($uri, -1) != "/")//file
            return '<a target="_blank" href="' . $proto . $uri . '">' . basename($uri) . '</a>';
        //path
        return '<a href="' . $proto . $uri . '">' . $uri . '</a>';
    }

}

?>
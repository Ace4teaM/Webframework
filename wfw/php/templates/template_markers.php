<?php
/*

	(C)2012 ID-INFORMATIK - WebFrameWork(R)
	Classes de marqueurs de template
	PHP Code
	
	AUTHOR: Auguey Thomas
	MAIL  : contact@id-informatik.com

    Marqueurs:
      -{!Identifier}                   : insert un texte depuis la selection XML ou un argument (insere apres transformation du document)
      -{Identifier}                    : insert un texte depuis la selection XML ou un argument
      -{Identifier|'ReplacementText'}  : insert le texte passe en argument ou en selection, si introuvable insert le texte de remplacement.  
      -{SectionId:Id}                  : insert le texte de l'index (default.xml): page, mail, uri, etc...      
      -{SectionId:Id@Attribute}        : insert le texte d'un attribut de l'index (default.xml): page, mail, uri, etc...
      -{:Page_Id}                      : insert un lien de page de l'index (default.xml). URI complete avec protocole. 

    Marqueurs predefinies:
      -{__array_count__}               : dans une action ARRAY, retourne le compteur de boucle.   
      -{__inner_text__}                : dans une action ARRAY ou SELECT, retourne le texte interne du noeud.
      -{__date_rfc822__}               : date actuelle au format RFC822.
      -{__date_w3c__}                  : date actuelle au format du W3C.
      -{__timpestamp__}                : timestamp UNIX en cours. 
      -{__uri__}                       : nom de domaine specifie dans "default.xml", vide si inexistant.

	Revisions:
		[16-03-2012] Implentation
*/

class cTemplateMarker
{
	public function check_text($input,$select,$matches,&$arg){ return "";/*texte de remplacement, vide si aucun*/ }
	public function finalize($file_content){ return $file_content; }
	public static function exp(){ return array(); }
}

/*
check_simple_value
  argument de second niveau
Exemple:
	Un argument de type -{|blablabal|} sera transformé en -{blablabal} est éxecuté a la prochaine transformation du template
Syntaxe:
  -{identifier}
  -{identifier|'default value'}
*/
class cTemplateMarker_superclass extends cTemplateMarker
{
	function __construct($input,&$arg){}
		
	public static function exp()
	{
		return array(
			('\\|([^\\|]*)\\|') => 'check_text',
		);
	}
	
	public function check_text($input,$select,$matches,&$arg)
	{
		return "-{".$matches[1]."}";
	}
}
/*
check_simple_value
  appele par check_text(), retourne la valeur d'un argument / argument de requete / dans la selection en cours
Syntaxe:
  -{identifier}
  -{identifier|'default value'}
*/
class cTemplateMarker_simple extends cTemplateMarker
{
	public static function exp()
	{
		return array(
			('('.cInputName::regExp().')')                     => 'check_text',
			('('.cInputName::regExp().')'.'\|'.'\'([^\']*)\'') => 'check_text',
			('ip\@('.cInputIPv4::regExp().')')                 => 'check_ip'
			);
	}
	
	public function check_ip($input,$select,$matches,&$arg)
	{
		$remote_ip = $matches[1];
		return @gethostbyaddr($remote_ip);
	}
	
	public function check_text($input,$select,$matches,&$arg)
	{
		$name = $matches[1];

		//recherche dans la selection
		if($select!=NULL){
			//obtient la selection
			$node_select = $input->get_xml_selection($select,$arg,$name);
			if($node_select!=NULL)
				return $node_select->nodeValue;
		}
		
		//recherche dans les globales
		if(isset($arg[$name]))
			return $arg[$name];

		//aucune entree trouve, texte de remplacement?
		if(isset($matches[2]))
			return $matches[2];
		
		return "";
	}
}

/*
check_attribute_value
  appeler par check_text(), retourne la valeur d'un attribut de la selection
Syntaxe:
  -{@identifier}
  -{@identifier|'default value'}
*/
class cTemplateMarker_attribute extends cTemplateMarker
{
	public static function exp()
	{
		return array(
			('\@('.cInputName::regExp().')')                     => 'check_text',
			('\@('.cInputName::regExp().')'.'\|'.'\'([^\']*)\'') => 'check_text',
			);
	}
	
	public function check_text($input,$select,$matches,&$arg)
	{
		$attribute_name = $matches[1];

		//recherche dans la selection
		if($select!=NULL && $select->hasAttribute($attribute_name)){
			//obtient la selection
			return $select->getAttribute($attribute_name);
		}
		
		//aucune entree trouve, texte de remplacement?
		if(isset($matches[2]))
			return $matches[2];
		
		return "";
	}
}

/*
check_attribute_parse
  insert le contenu d'un texte sans formatage
Syntaxe:
  -{!identifier}
*/
class cTemplateMarker_parse extends cTemplateMarker
{
	public $paste_content;
	
	public static function exp()
	{
		return array(
			('\!('.cInputName::regExp().')') => 'check_text',
			);
	}
	
	function __construct($input,&$arg)
	{
		$paste_content = array();
	}
	
	public function finalize($file_content) {
		//remplace les contenus bruts (check_paste_value())
		if(!empty($this->paste_content))
			return str_replace(array_keys($this->paste_content), $this->paste_content, $file_content);
		return $file_content;
	}
	
	public function check_text($input,$select,$matches,&$arg)
	{
		$name = $matches[1];
		$comment = "-/$name/"; //marqueur temporaire pour un remplacement ulterieur
		
		//recherche dans les globales
		if(isset($arg[$name]))
		{
			$this->paste_content[$comment] = $arg[$name];
			return $comment;
		}

		//recherche dans les parametres de la requete
		/*if(isset($_REQUEST[$name]))
		{
			$this->paste_content[$comment] = $_REQUEST[$name];
			return $comment;
		}*/

		//recherche dans la selection
		if($select!=NULL)
		{
			//obtient la selection
			$node_select = $input->get_xml_selection($select,$arg,$name);
			if($node_select!=NULL)
			{
				$this->paste_content[$comment] = $node_select->nodeValue;
				return $comment;
			}
		}
		
		return "";
	}
}

/*
check_default_attribute
	Syntaxe: -{index_identifier:identifier@attribute_identifier }
	Retourne la valeur d'un attribut dans la selection par defaut
check_default_value
	Syntaxe: -{index_identifier:identifier}
	Retourne la valeur d'un element du fichier defaut.xml
check_default_uri
	Syntaxe: -{:page_identifier}
	Retourne l'uri complete d'une page

*/  
class cTemplateMarkerdefault extends cTemplateMarker
{
	public $sitefile;
	
	public static function exp()
	{
		return array(
			('\:'.'('.cInputName::regExp().')')                                                                => "check_default_uri",
			('('.cInputName::regExp().')'.'\:'.'('.cInputName::regExp().')')                                   => 'check_default_value',
			('('.cInputName::regExp().')'.'\:'.'('.cInputName::regExp().')'.'\@'.'('.cInputName::regExp().')') => 'check_default_attribute',
		);
	}
	
	function __construct($input,&$arg)
	{
		if( $this->sitefile = $input->load_xml_file("default.xml") )
		{
                    //host config
                    $hostname = $arg["__hostname__"];
                    if(!empty($hostname)){
                        //Nom de domaine
                        $node = $this->sitefile->one(">host[id=$hostname]>domain");
                        $arg["__domain__"]       = ($node ? $node->nodeValue : "");
                        //URI sans protocol
                        $node = $this->sitefile->one(">host[id=$hostname]>path");
                        $arg["__uri_nop__"]      = ($node ? $node->nodeValue : "");             
                        //URI sans protocol
                        $node = $this->sitefile->one(">host[id=$hostname]>base_path");
                        $arg["__base_uri_nop__"] = ($node ? $node->nodeValue : ""); 
                        //URI complete
                        $node = $this->sitefile->one(">host[id=$hostname]>path");
                        $arg["__uri__"]          = "http://".$arg["__domain__"].($node ? $node->nodeValue : "")."/";    
                        //URI racine complete
                        $node = $this->sitefile->one(">host[id=$hostname]>base_path");
                        $arg["__base_uri__"]     = "http://".$arg["__domain__"].($node ? $node->nodeValue : "")."/";  
                        //URI racine complete
                        $node = $this->sitefile->one(">host[id=$hostname]>path_root");
                        $arg["__path__"]         = ($node ? $node->nodeValue : "")."/";
                    }
                    //SiteName
                    $node = $this->sitefile->one(">name");
                    $arg["__name__"]         = ($node ? $node->nodeValue : "");
                    $node = $this->sitefile->one(">title");
                    $arg["__title__"]        = ($node ? $node->nodeValue : "");
                    //SiteDesc
                    $node = $this->sitefile->one(">description");
                    $arg["__description__"]  = ($node ? $node->nodeValue : "");
                    //id
                    $node = $this->sitefile->one(">id");
                    $arg["__id__"]           = ($node ? $node->nodeValue : "");
		}
	}
	
	//[private]
	//obtient un noeud de l'index
	public function getIndexNode($type,$id)
	{
		if($this->sitefile==NULL)
			return NULL;
		//recherche
		$entry_node = $this->sitefile->getNode('site/index/'.$type);
		while($entry_node){
			$entry_id = $this->sitefile->getAtt($entry_node,"id");
			if($entry_id == $id)
				return $entry_node;
			
			$entry_node = $this->sitefile->getNext($entry_node,$type);
		}
		return NULL;
	}
	
	//obtient une valeur du defaut          
	public function getdefault($input,$type,$id){
		$pageNode = $this->getIndexNode($type,$id);
		if($pageNode==NULL)
			return "";
		
		return $pageNode->nodeValue;
	}

	public function check_default_uri($input,$select,$matches,&$arg)
	{
		if($this->sitefile==NULL)
			return "";
		
		$pageId    = $matches[1];
		
		$pageNode = $this->getIndexNode("page",$pageId);
		if($pageNode==NULL)
			return "";
		
		//protocole  
		$protocol = $pageNode->getAttribute("protocol");
		if(empty($protocol))
			$protocol="http";
		
		return $protocol."://".$arg["__uri_nop__"].$pageNode->nodeValue;
	}
	
	public function check_default_value($input,$select,$matches,&$arg)
	{
		if($this->sitefile==NULL)
			return "";
		
		$linktype  = $matches[1];
		$pageId    = $matches[2];

		$pageNode = $this->getIndexNode($linktype,$pageId);
		if($pageNode==NULL)
			return "";

		return $pageNode->nodeValue;
	}
	
	public function check_default_attribute($input,$select,$matches,&$arg)
	{
		if($this->sitefile==NULL)
			return "";
		
		$linktype = $matches[1];
		$pageId   = $matches[2];
		$attId    = $matches[3];
		
		$pageNode = $this->getIndexNode($linktype,$pageId);
		if($pageNode==NULL)
			return "";

		return $pageNode->getAttribute($attId);
	}
}

/*
 * @brief selection avancé de noeuds
 * @remarks
 *   - check_default_attribute
 *           Syntaxe: -{[index_identifier]:[identifier]@[attribute_name] }
 *           Retourne la valeur d'un attribut dans la sélection active
 *   - check_default_value
 *           Syntaxe: -{[index_identifier]:[identifier]}
 *           Retourne la valeur d'un élement du fichier defaut.xml
 *   - check_default_uri
 *           Syntaxe: -{:[page_identifier]}
 *           Retourne l'URI compléte d'une page
*/ 

class cTemplateMarker_node extends cTemplateMarker
{
	public $sitefile;
	
	public static function exp()
	{
		return array(('(\>?)\s*(\w+)\s*(?:\[(\w+|\w+\=\w+)\])?') => 'find_node');
	//	return array(('('.cInputName::regExp().')'.'((>|\s+)'.cInputName::regExp().'(\['.cInputName::regExp().'|'.cInputName::regExp().'='.cInputString::regExp().'\]))*)') => 'find_node');
	}
	
	function __construct($input,&$arg)
	{
	}
	
	public function find_node($input,$select,$matches,&$arg)
	{echo("find_node");
            print_r($matches);
	/*	$type  = $matches[1];
		$Id    = $matches[2];
                
                $first = XMLDocument::getNextChildNode($select,$type);
                while($first != NULL){
                    if($first->getAttribute("id") == $Id)
                        return $first->nodeValue;
                    $first = XMLDocument::getNext($first,$type);
                }*/
            return "";
	}
        
	public function check_value($input,$select,$matches,&$arg)
	{
		$type  = $matches[1];
		$Id    = $matches[2];
                
                $first = XMLDocument::getNextChildNode($select,$type);
                while($first != NULL){
                    if($first->getAttribute("id") == $Id)
                        return $first->nodeValue;
                    $first = XMLDocument::getNext($first,$type);
                }
                return "";
	}

	public function check_attribute($input,$select,$matches,&$arg)
	{
		$type = $matches[1];
		$Id   = $matches[2];
		$attId    = $matches[3];
		
                $first = XMLDocument::getNextChildNode($select,$type);
                while($first != NULL){
                    if($first->getAttribute("id") == $Id)
        		return $first->getAttribute($attId);
 
                    $first = XMLDocument::getNext($first,$type);
                }
                return "";
	}
} 

?>

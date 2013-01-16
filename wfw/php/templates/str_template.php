<?php
/*

	(C)2012 ID-INFORMATIK - WebFrameWork(R)
	Classe de template Text
	PHP Code
	
	AUTHOR: Auguey Thomas
	MAIL  : contact@id-informatik.com


    - Utilisez l'espace de nommage "http://www.webframework.fr/last/xmlns/template" pour inserer des commandes dans un fichier XML
    - Le template agit sous forme 'd'actions' applicable a un element et ses enfants
    - Tous les fichiers charges dynamiquement durant la transformation sont relatifs à l'URL du document [input]
    - Les elements sont analyses comme suit: si une action est trouve -> proceder à la selection -> traiter les arguments -> executer l'action
    
    Actions:
        SELECT   : Deplace le curseur de selection. si introuvable, l'element est ignore.
		EXIST    : Verifie si une valeur existe soit: dans la selection, dans les arguments ou dans les parametres. si introuvable, l'element est ignore. (le curseur de selection est deplace)
        ARRAY    : Transforme n fois un element.
        MERGE    : Fond les attributs et le contenu texte de la source dans la destination.
        INCLUDE  : Inclue directement le contenu XML de la source dans la destination.
        IGNORE   : Ignore le contenu de l'element concerne  
        FORMAT   : Formate le contenu texte au format HTML
		EXP      : Test une expression reguliere sur la selection
		
    Elements:
       container : Utilise pour contenir une action, 'container' est supprime apres generation (seul les enfants sont conserves)
	
    Attributs:
      path      : chemin d'acces a la selection.
                  fichier+cible = [:FileName:[/xml_path]]
                  absolue       = [/xml_path]
                  relative      = [xml_path]
                  noeud         = [identifier]
      action    : identifiant de l'action a entreprendre sur l'element.
      condition : conditions dans une selection SELECT ou ARRAY, une ou plusieurs des conditions ci-dessous:
                  [attribut_name='value';] = condition d'egalite
      exp       : expression reguliere utilise avec l'action "EXP".
	
    Marqueurs:
      -{!Identifier}                   : insert un texte brut au document sans formatage XML (insere apres transformation du document)
      -{Identifier}                    : insert le texte passe en argument ou en selection.
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
		[15-03-2012] Implentation
*/
require_once("template_markers.php");

class cStringTemplate
{
	//instances des classes Marker
	public $check_text_class = array();
	//instances des fichiers XML chargés
	public $xml_files = array();
	//chemin d'acces aux fichiers chargeables
	public $var_path;
	//arguments globales
	public $arg;
	//Element de selection
	public $select = NULL;
	//text à transformer (entrée)
	public $text = NULL;
	
	public function Initialise($input_file,$bInputFile,$select_file,$select_element,$arg)
	{
		$timestamp      = time();
		$this->arg      = $arg;
		if($bInputFile)
		{
			$input_pathinfo = pathinfo($input_file);
			$this->var_path = $input_pathinfo["dirname"]."/";
		}
		else
		{
			$this->var_path = "";
		}
		$this->text = NULL;
		
		// hostname  
		$hostname = "";
		{                                    
			exec("hostname",$hostname,$return);
			if($return==0)     
				$hostname = strtolower($hostname[0]);
			else
				$hostname="";//introuvable
		}    

		// arguments predefinits
		$this->arg["__date_rfc822__"] = (date(DATE_RFC822,$timestamp)); 
		$this->arg["__date_w3c__"]    = (date("Y-m-d",$timestamp));
		$this->arg["__timestamp__"]   = $timestamp;
		$this->arg["__hostname__"]    = $hostname; 

		//charge le texte a transformer
		if($bInputFile)
		{
			$this->text = file_get_contents($input_file);
			if($this->text !== FALSE){
				//stat sur le fichier
				$fstat = stat($input_file);
				if($fstat){
					$this->arg["__file_ctime__"]        = $fstat['ctime'];
					$this->arg["__file_mtime__"]        = $fstat['mtime'];
					$this->arg["__file_ctime_rfc822__"] = date(DATE_RFC822, $fstat['atime']); 
					$this->arg["__file_mtime_rfc822__"] = date(DATE_RFC822, $fstat['mtime']);
				}
			}
			else{
				$this->post("load_input_file","failed");
				return FALSE;
			}
		}
		else
		{
			$this->text = $input_file;
		}
		
		if(!$this->text){
			$this->post("load_input_file","failed");
			return FALSE;
		}

		//charge/assigne la selection
		if(is_string($select_file))
        {
			if($varfile = $this->load_xml_file($select_file))
				$this->select = $varfile->documentElement;
        }
        else
        {
			$this->select  = (($select_element==NULL && $select_file!=NULL) ? $select_file->documentElement : $select_element);
        }

		//cree les instances de classes Marker
		$check_text_class = get_declared_classes_of("cTemplateMarker");           
		foreach($check_text_class as $i=>$class_name)
		{
			$this->check_text_class[$i] = new $class_name($this,$this->arg);
		}

		return TRUE;
	}
	
	/*
	Make
	  transforme le document
	Retourne
	  Corps du document
	*/
	public function Make()
	{
		$file_content = $this->check_text($this->select,$this->text,$this->arg);
		
		//finalise le contenu      
		foreach($this->check_text_class as $i=>$class)
		{
			$file_content = $class->finalize($file_content);
		}
		
		return $file_content;
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
	public function check_text($select,$text,$arg,$delimiter_l_char='{',$delimiter_r_char='}')
	{            
		$identifier = cInputName::regExp();
		$string = "[^\']*";
		$delimiter_l = "";
		$delimiter_r = ""; 
		$level = 0;         

		//pour chaque niveaux d'imbriquations
		do
		{                                         
			$old_text = $text;
			$level++;            

			$delimiter_l .= "\\".$delimiter_l_char;
			$delimiter_r .= "\\".$delimiter_r_char;

			$this_=$this; //requis pour etre appele dans le context de 'preg_replace_callback'

			// test chaques classes marker                                     
			foreach($this->check_text_class as $i=>$class)
			{
				// test chaque format
				$exp_list = $class::exp();                           
				foreach($exp_list as $exp=>$func)
				{
					$text = preg_replace_callback(
						'/\-'.$delimiter_l.$exp.$delimiter_r.'/',
						/*function ($matches) use ($this_,$arg,$select,$class,$func)
						{
							print_r($matches);

							return "";
						},*/
						function ($matches) use ($this_,$arg,$select,$class,$func)
						{
							//appel la fonction qui va traiter la chene
							$value = $class->$func($this_,$select,$matches,$arg);  

							return $value;
						},
						$text
					);
				}
			}
		}while($old_text != $text);//si aucune modification du text, ne cherche pas de niveau superieur

		return $text;
	}
	
	
	/*
	check_arguments
	  scan les arguments d'un noeud element
	Arguments
	  select: recoie le noeud de selection de l'action precedente, NULL si aucune.
	  node  : noeud element scaner.
	  arg   : recoie les arguments de l'action precedente, tableau vide si aucune.
	
	public function check_action($select,$node,$arg,$func="check_text"){  
		if($node!=NULL){
			$attributes = $node->attributes; 
			if(!is_null($attributes)) 
			{ 
				foreach ($attributes as $index=>$attr) 
				{
					$new_value = $this->$func($select,$attr->value,$arg);
          if($attr->namespaceURI)
            $node->setAttributeNS($this->wfw_template_uri,$attr->name,$new_value); //remplace (avec encodage des entites HTML)
          else
            $node->setAttribute($attr->name,$new_value);//encode les entites HTML (cause: sans effet dans un namespace)
            
					//$attr->value = @htmlentities($new_value);//encode les entites HTML (cause: warning message)
				}
			}         
		}
	}*/

	/*
	verify_node_condition
		verifie si une condition est vrai
	Argument:
		select     : Noeud de la selection active
		arg        : Arguments en cours
		conditions : Syntaxe de la condition
	Retourne:
		TRUE si la condition est vrai. FALSE si la condition est fausse ou invalide
	*/
	public function verify_node_condition($select,$arg,$conditions){ 
		if($select==NULL)
			return NULL;
		
		$f_identifier = cInputName::regExp();
		$f_string     = "[^\']*";

	    $conditions_list = strexplode($conditions, ";", true);

	    $conditions_exp = array(
	        '(' . $f_identifier . ')=\'(' . $f_string . ')\'',
	        '(' . $f_identifier . ')=#(' . $f_string . ')',
	        '\'(' . $f_string . ')\'',
	        '#(' . $f_string . ')'
	    );

		// argument comparaison ...
	    foreach($conditions_list as $x=>$cur_condition) {
			$is_find = false;
			$test = false;
	        $i = 0;
			$is_ok = false;
	        while ($i < sizeof($conditions_exp) && $is_find == false) {
				if (preg_match("/".$conditions_exp[$i]."/",$cur_condition,$matches)){
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
	                        $this->post("verify_node_condition","test ??");
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

	//scan le noeud donne et les noeuds suivants
	public function post($title,$msg)
	{
		//rpost($title,$msg);
		//echo($title." ".$msg."\n");
	}

	//charge un fichier de selection
	public function load_xml_file($name)
	{
		if(!isset($this->xml_files[$name])){
			if(!file_exists($this->var_path.$name)){
				$this->post("load_xml_file","$name does not exists");
				return NULL;
			}
			$file = new XMLDocument();
			if($file->load($this->var_path.$name)==NULL){
				$this->post("load_xml_file","$name can't load");
				return NULL;
			}
			$this->xml_files[$name] = $file;
		}
		
		return $this->xml_files[$name];
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
	public function get_xml_selection($current_select,$arg,$path,$conditions=NULL){
		
		//
		// charge un nouveau fichier...
		//
		if(substr($path,0,1)==':') //absolue
		{
			$filename   = cRegExpFmt::filename();     
			if(preg_match("'^:(.*):(.*)$'",$path,$matches)){
				//   if(preg_match("'^:($filename){1}:(.*)$'",$path,$matches)){
				$this->post("get_xml_selection",$matches[1]." -> ".$matches[2]);
				if($varfile = $this->load_xml_file($matches[1]))      
					return $this->get_xml_selection($varfile->documentElement,$arg,$matches[2],$conditions); //ok, re-selectionne avec le chemin seulement 
				return NULL;
			}
			else{
				$this->post("get_xml_selection","($path) path invalid format!");
				return NULL;
			}
		}
		
		//
		// recherche dans le fichier en cours...
		//         
		
		if($current_select==NULL){
			$this->post("get_xml_selection","no input file!");
			return NULL;
		}
		
		//obtient le fichier en cours
		$varfile = $current_select->ownerDocument;
		
		//chemin absolue dans le document en cours
		if(substr($path,0,1)=='/')
			$current_select = $varfile->getNode($path);
		//chemin relatif a la selection
		else
			$current_select = $varfile->objGetNode($current_select,$path);  

		//attention, forcer le retour à NULL, car objGetNode peut retourner -1 en cas d'echec
		if($current_select === -1)
			$current_select=NULL;   

		if(!$current_select){
			$this->post("get_xml_selection ($path)","failed");
		}

		//verifie la condition
		if (($conditions != null) && (!empty($conditions))) {
			while ($current_select!=null) {
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

class cStringTemplateAction
{
	public function check_node($input,$select,$node,$arg){ return NULL;/*noeud suivant ou NULL si auto*/ }
}

/*
	duplique et transforme en boucle lee noeud enfants

class cStringTemplateAction_each extends cStringTemplateAction
{
	public function check_node($input,$select,$node,&$arg)
	{
		$arg['__count__']=0; 

		$condition = $node->getAttributeNS($input->wfw_template_uri,"condition");
		
		$select = $select->firstChild;
		
		$next = $node->nextSibling;
		//scan le contenu
		while($select!=NULL)
		{
			if(($select->nodeType==XML_ELEMENT_NODE) && (empty($condition) || $input->verify_node_condition($select,$arg,$condition)))
			{
				$arg['__count__']++;
				$arg['__inner_text__'] = $select->nodeValue;
				$arg['__selection_name__'] = $select->tagName;
				
				//$this->post("check_node","add array item");
				
				//copie le noeud
				$node_new = $node->cloneNode(TRUE);
				
				//traite les arguments pour ce noeud
				$input->check_arguments($select,$node_new,$arg);
				
				//supprime les attributs inutiles
				$input->clean_attributes($node_new);
				
				$node->parentNode->insertBefore($node_new, $node);
				//scan le contenu enfant
				if($node_new->firstChild != NULL)    
					$input->check_node($select,$node_new->firstChild,$arg);
			}
			
			//obtient le prochain noeud du meme nom
			$select = $select->ownerDocument->getNext($select,NULL);
		}

		//supprime le noeud de reference
		if($node->parentNode)
			$node->parentNode->removeChild($node);

		return $next;
	}
}*/

/*
	duplique et transforme en boucle le noeud en correspondance avec chaque selection trouve

class cStringTemplateAction_array extends cStringTemplateAction
{
	public function check_node($input,$select,$node,&$arg)
	{
		$arg['__array_count__']=0; 

		$condition = $node->getAttributeNS($input->wfw_template_uri,"condition");
		
		$next = $node->nextSibling;
		//scan le contenu
		while($select!=NULL)
		{
			if((empty($condition) || $input->verify_node_condition($select,$arg,$condition)))
			{
				$arg['__array_count__']++;
				$arg['__inner_text__'] = $select->nodeValue;
				
				//$this->post("check_node","add array item");
				
				//copie le noeud
				$node_new = $node->cloneNode(TRUE);
				
				//traite les arguments pour ce noeud
				$input->check_arguments($select,$node_new,$arg);
				
				//supprime les attributs inutiles
				$input->clean_attributes($node_new);
				
				$node->parentNode->insertBefore($node_new, $node);
				//scan le contenu enfant
				if($node_new->firstChild != NULL)    
					$input->check_node($select,$node_new->firstChild,$arg);
			}
			
			//obtient le prochain noeud du meme nom
			$select = $select->ownerDocument->getNext($select,$select->tagName);
		}

		//supprime le noeud de reference
		if($node->parentNode)
			$node->parentNode->removeChild($node);

		return $next;
	}
}*/

/*
	test une expression reguliere sur la selection

class cStringTemplateAction_exp extends cStringTemplateAction
{
	public function check_node($input,$select,$node,&$arg)
	{
		//check les arguments
		$input->check_arguments($select,$node,$arg);

		//obtient les attributs speciaux
		$target_exp  = $node->getAttributeNS($input->wfw_template_uri,"exp");
		
		//procède à une selection temporaire
        $target_str = null;
        $target_node = null;
		$target      = $node->getAttributeNS($this->wfw_template_uri,"target");
		if(!empty($target) && isset($arg[$target]))
            $target_str = $arg[$target];
		if(!empty($target))
			$target_node = $this->get_xml_selection($select,$arg,$target,$node->getAttributeNS($this->wfw_template_uri,"condition"));
		
		//supprime les attributs inutiles
		$input->clean_attributes($node);
		
		//suivant		
		$next = $node->nextSibling;
		
		//ok? scan le contenu
		if(($select!=null || $target_node!=null || is_string($target_str)) && $target_exp)
		{
			if($target_node!==NULL)
				$exp_target_value=$target_node->nodeValue;
			else if($target_str!==NULL)
				$exp_target_value=$target_str;
			else if($select!==NULL)
				$exp_target_value=$select->nodeValue;
		
			if(preg_match('/'.$target_exp.'/', $exp_target_value))
			{
				$input->post("cXMLTemplateAction_exp","$target_exp = vrai, ajoute et scan le contenu. (" . $exp_target_value . ")");
				
				//scan le contenu avec la nouvelle selection   
				if($node->firstChild != NULL)
					$input->check_node($select,$node->firstChild,$arg);
			
				return $next;
			}
			else{
				$input->post("cXMLTemplateAction_exp","$target_exp = faux, supprime le noeud de reference. (" . $exp_target_value . ")");
				if($node->parentNode)
					$node->parentNode->removeChild($node);
				
				return $next;
			}
		}     

		//sinon, supprime ce noeud
		$input->post("cXMLTemplateAction_exp","pas de selection disponible, supprime le noeud de reference.");
		if($node->parentNode)
			$node->parentNode->removeChild($node);

		return $next;
	}
}*/

/*
	evalue une expression du langage

class cStringTemplateAction_eval extends cStringTemplateAction
{
	public function check_node($input,$select,$node,&$arg)
	{
		//check les arguments
		$input->check_arguments($select,$node,$arg);

		//obtient les attributs speciaux
		$att_eval    = $node->getAttributeNS($input->wfw_template_uri,"eval");
		$att_target  = $node->getAttributeNS($input->wfw_template_uri,"target");
		
		//supprime les attributs inutiles
		$input->clean_attributes($node);
		
		//suivant		
		$next = $node->nextSibling;
		
		if(empty($att_eval) || empty($att_target))
			return $next;

		if(!cInputEvalString::isValid($att_eval)){
			$arg[$att_target]="not";
			return $next;
     }

		//evalue l'expression
		$eval_value = @eval("return ''.($att_eval);");
		if(is_string($eval_value))
			$arg[$att_target]=$eval_value;
     else
			$arg[$att_target]="no";
		
		//scan le contenu
		if($node->firstChild != NULL)
			$input->check_node($select,$node->firstChild,$arg);

		return $next;
	}
}*/

/*
Selectionne un noeud et scan le contenu, si la selection echoue le noeud et ses enfants est supprime
Attributs:
	action = "select"
	path   = chemin d'acces a l'element cible.

class cStringTemplateAction_select extends cStringTemplateAction
{
	public function check_node($input,$select,$node,&$arg)
	{
		//traite les arguments pour ce noeud      
		$input->check_arguments($select,$node,$arg);
		
		//clean
		$input->clean_attributes($node);

		//sauve le noeud suivant		
		$next = $node->nextSibling;
	   
		//ok? scan le contenu
		if($select!=NULL){
			$arg['__inner_text__']=$select->nodeValue;
       
			$input->post("cXMLTemplateAction_select","selection ok, ajoute et scan le contenu.");
                                 
			//scan le contenu avec la nouvelle selection   
			if($node->firstChild != NULL)
				$input->check_node($select,$node->firstChild,$arg);
		}               
		//sinon, supprime ce noeud
		else{         
			$input->post("cXMLTemplateAction_select","selection introuvable, supprime le noeud de reference.");
			if($node->parentNode)
				$node->parentNode->removeChild($node);
		}
		
		return $next;
	}
}*/  


/*
Fond les attributs et le contenu texte de la source dans la destination.
Attributs:
	action = "merge"
	path   = chemin d'acces a l'element cible.

class cStringTemplateAction_merge extends cStringTemplateAction
{
	public function check_node($input,$select,$node,&$arg)
	{
		//traite les arguments pour ce noeud      
		$input->check_arguments($select,$node,$arg);
		
		//clean
		$input->clean_attributes($node);

		//sauve le noeud suivant		
		$next = $node->nextSibling;
		
		if($select!=NULL) {  
			//    _stderr("check_node_mergeNS(): ".$input->getAtt($select,"href"));           
			//merge les attributs
			$input->check_arguments($select,$node,$arg);
			$input->merge_arguments($select,$node,$arg);
			//merge le contenu text
			//  $node->nodeValue = $node->nodeValue.$select->nodeValue;
			$input->import_node_content($input->doc,$node,$select->firstChild);    
			if($node->firstChild != NULL)
				$input->check_node(NULL,$node->firstChild,$arg); 
		}
		return $next;
	}
}*/  

/*
Inclue du contenu XML dans la destination
Attributs:
	action = "include"
	path   = chemin d'acces a l'element cible.
 
class cStringTemplateAction_include extends cStringTemplateAction
{
	public function check_node($input,$select,$node,&$arg)
	{
		//obtient les options de formatage
		$opt = $node->getAttributeNS($input->wfw_template_uri,"option");
		//options
		if(!empty($opt))
		{
			$opt_list = explode(" ",$opt);
			$opt_list = array_flip($opt_list);
		}
		else $opt=null;//tout
		
		
		//traite les arguments pour ce noeud
		$input->check_arguments($select,$node,$arg);
		
		//clean
		$input->clean_attributes($node);

		//sauve le noeud suivant
		$next = $node->nextSibling;
		
		if($select!=NULL) {   
			if(isset($opt_list["include_att"]))
				$input->include_arguments($select,$node,$arg);
			
			//insert le contenu seulement
			if(isset($opt_list["content_only"])){
				$import_node_list = $input->import_node_content($input->doc,$node,$select->firstChild); 
				
				//scan le contenu
				foreach ($import_node_list as $i => $cur){
					$input->check_node(NULL,$cur,$arg);  
				}
			}
			//insert le noeud + son contenu
            else
    		{
				$import_node = $input->doc->importNode($select,TRUE);
				$node->appendChild($import_node);   

				//scan le contenu                    
				if($import_node->firstChild != NULL)
					$input->check_node(NULL,$import_node->firstChild,$arg);   
            }
                          
		}            
		//sinon, supprime ce noeud
		else{         
			$input->post("check_node_includeNS","selection introuvable, supprime le noeud de reference.");
			if($node->parentNode)
				$node->parentNode->removeChild($node);
		}
		
		return $next;
	}
}*/ 

/*
Inclue du contenu XML dans la destination
Attributs:
	action = "ignore"
	path   = chemin d'acces a l'element cible.

class cStringTemplateAction_ignore extends cStringTemplateAction
{
	public function check_node($input,$select,$node,&$arg)
	{
		//clean
		$input->clean_attributes($node);

		return $node->nextSibling;
	}
}*/  

/*
Formate un texte brut en texte HTML
Attributs:
	action = "format"
	transform = si true, les elements enfants sont transformés par checkNode()
	preset = type de formatage ("script", "text"). Si non définit tous les formatages sont éffectués

class cStringTemplateAction_format extends cStringTemplateAction
{
	public function check_node($input,$select,$node,&$arg)
	{
		//obtient les options de formatage
		$preset = $node->getAttributeNS($input->wfw_template_uri,"preset");
		$transform = $node->getAttributeNS($input->wfw_template_uri,"transform");
		
		//traite les arguments pour ce noeud      
		$input->check_arguments($select,$node,$arg);

		//clean
		$input->clean_attributes($node);

		//sauve le noeud suivant	
		$next = $node->nextSibling;     
	
		//scan le contenu avec la selection
		if($transform=="true")
		{
			if($node->firstChild != NULL)    
				$input->check_node($select,$node->firstChild,$arg);
		}
		//formate le texte
		$text = $input->getInnerHTML($node);
		if($transform=="true")
			$text = $input->check_text($select,$input->getInnerHTML($node),$arg);
		
		$check_value_func = array(      
			("([&]+)") => "sp",//caracteres speciaux
			("([\<]+)") => "sp",//caracteres speciaux
			("([\>]+)") => "sp",//caracteres speciaux
			("^([\s]+)") => "blank_line",//lignes vides en debut de texte
			("([\s]+)$") => "blank_line",//lignes vides en fin de texte
			("\n[ ]+") => "spacing",//espacements en debut de ligne
			("\s(\')([^\'\<\>]*)\'") => "citation",
			("\s(\")([^\"\<\>]*)\"") => "citation",
			("\s(\')([^\'\<\>]*)\'") => "string",
			("\s(\")([^\"\<\>]*)\"") => "string",
			//("\s(break|continue|do|for|import|new|this|void|case|default|else|function|in|return|comment|delete|export|if|label|switch|var|with)\s") => "js_keyword",
			("\n") => "lf",
			("(http:\/\/)([^\<\>\"\s\n\f\r]*)[\s\n\f\r]{0,1}") => "uri",
			("(https:\/\/)([^\<\>\"\s\n\f\r]*)[\s\n\f\r]{0,1}") => "uri",
			("[-]{5,}") => "lh",//lignes horizontale
		);
		
		//preset ?
		switch($preset)
		{
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
		$opt_list = explode(" ",$opt);
		$opt_list = array_flip($opt_list);
		
		// pour chaque format                                     
		foreach($check_value_func as $exp=>$func)
		{
			if(isset($opt_list[$func]))
				$text = preg_replace_callback(
					'/'.$exp.'/',
					function ($matches) use ($arg,$select,$func)
					{
						//appel la fonction qui va traiter la chene
						$value = cXMLTemplateAction_format::$func($select,$matches,$arg);  
						return $value;
					},
					$text
				);
		}
		
		//cree le fragment de code XML
		$textNode = $input->doc->createDocumentFragment();
		$textNode->appendXML($text);
		
		//remplace le noeud de reference
		$input->replaceContentElement($input->doc,$node,$textNode);

		return $next;
	}
	
	//caracteres speciaux
	public static function sp($select,$matches,&$arg){
		switch($matches[0])
		{
			case "<":
				return "&lt;";
			case ">":
				return "&gt;";
			case "&":
				return "&amp;";
		}
		return $matches[0];
	}  
	
	public static function lf($select,$matches,&$arg){
		return "<br />";
	}  
	
	public static function spacing($select,$matches,&$arg){
		return '<br /><span style="width:'.(strlen($matches[0])*8).'px; display:inline-block;"></span>';
	}
	
	public static function blank_line($select,$matches,&$arg){
		return "";
	}  
	
	public static function lh($select,$matches,&$arg){
		return "<hr />";
	} 

	public static function citation($select,$matches,&$arg){  
		$sep = $matches[1];
		$text = $matches[2];
		return " ".$sep."<code style=\"font-style:italic;\">$text</code>".$sep;
	}  
	
	public static function string($select,$matches,&$arg){  
		$sep = $matches[1];
		$text = $matches[2];
		return '<span style="color:#990000;">' . $sep . $text . $sep . '</span>';
	}
	
	public static function uri($select,$matches,&$arg){    
		$proto = $matches[1];
		$uri = $matches[2];
		if(substr($uri,-1) != "/")//file
			return '<a target="_blank" href="'.$proto.$uri.'">'.basename($uri).'</a>'; 
		//path
		return '<a href="'.$proto.$uri.'">'.$uri.'</a>';
	}
}*/  

?>

<?php
/*
  (C)2008-2010 WebFrameWork 1.3
	Fabrique un fichier template XML/XHTML

  Arguments:
	  input        : Chemin absolue au fichier template
	  [inputdata]  : Chemin relatif aux donnees XML a charger en entree
	  [defaultdata]: Chemin relatif au fichier de configuration XML, a utiliser pour place de 'default.xml'
	  [output]     : Chemin relatif au fichier a produire, si non specifie le contenu est retourne
	  [...]        : Arguments a passer au template ( les noms doivent etre obligatoirement au format d'un identificateur )
  
  Retourne:
    result : Resultat de la requete si [output] est specifie, sinon retourne le document transforme.
    
  Remarques:
    Utilisez l'espace de nommage "http://www.webframework.fr/last/xmlns/template" pour inserer des commandes dans un fichier XML
    Le template agit sous forme 'd'actions' applicable a un element et ses enfants
    Tous les fichiers charges dynamiquement durant la transformation sont relatifs à l'URL du document [input]
    Les elements sont analyses comme suit: si une action est trouve -> proceder à la selection -> traiter les arguments -> executer l'action
    
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
        
  Exemple:  
    test.html:
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:template="http://www.webframework.fr/last/xmlns/template">
      <head>
      <title>-{titre}</title>
      </head>
      <body>
      <div template:action="array" template:path=":mon_fichier.xml:/root/element">-{sub_element}</div> 
      </body>
      </html>
      
    mon_fichier.xml:
      <root>
        <element> 
          <sub_element>Item1</sub_element>
          <sub_element>Item2</sub_element>
          <sub_element>Item3</sub_element>
          <sub_element>Item4</sub_element>
        </element>
      </root>
      
    URL:
      "wfw/req/template?input=test.html&title=Exemple+de+fichier+Template"

  Revisions:
    [15-10-2010] Ajoute a la syntaxe du marqueur de selection {...} la possibilite d'inserer un texte de remplacement optionnel
    [15-10-2010] Implente la nouvelle action: "request"
    [16-10-2010] Debug check_node_arrayNS() et check_node_selectNS(), ces fonctions debordees leurs scans sur les elements suivants! [resolue]
    [16-10-2010] Implente l'argument 'condition' aux parametres de get_xml_selection().
    [16-10-2010] get_xml_selection() accept maintenant un chemin d'acce relatif sur plusieurs niveaux de profondeurs.
    [18-10-2010] Ajoute verify_node_condition().  
    [18-10-2010] Implente la nouvelle action: "include" et "merge"
    [18-10-2010] Modifie check_node_arrayNS(), verifie les conditions de selection recursivement.
    [19-10-2010] Debug get_xml_selection(), la fonction cree une boucle infinie lorsqu'elle charge un nouveau fichier et se re-execute en repassant le chemin complet (:nom_fichier:path) au lieu du chemin seul (path)! [resolue]
    [22-10-2010] Ajoute clean_node().
    [22-10-2010] Debug merge_arguments(), assigne correctement la valeur de l'attribut source dans l'attribut destination.
    [22-10-2010] merge_arguments(), ne merge pas les attribut avec le meme contenu texte.
    [22-10-2010] Effectue directement les selections dans check_node() avant toutes actions.
    [22-10-2010] Ajoute import_node_content().
    [22-10-2010] check_node_mergeNS utilise maintenant import_node_content().
    [31-10-2010] les arguments passes aux fonctions sont maintenants persistantes tout au long de l'execution du script. 
    [31-10-2010] ajout des marqueurs predefinit {__date_*__} et {__timestamp__}.
    [02-11-2010] Debug, check_node() test une variable non definit a la place du contenu avec les noeuds de types XML_TEXT_NODE. [resolue]
    [12-11-2010] Debug, check_node() et check_node_arrayNS(), array traite lui meme ses attributs de noeud recursivement.
    [18-11-2010] check_default_text(), verify_node_condition(), check_node_condition(), utilise maintenant le type cInputName au lieu de cInputIdentifier. 
    [23-11-2010] Debug, check_node() ne test pas les noeud de type texte si aucune selection. (bloque l'acces aux arguments hors selection). [resolue]
    [23-11-2010] Debug, check_text() accede a la variable $select potentielement NULL. [resolue]    
    [25-11-2010] Change, check_text() la fonction a ete reecrite pour supporter le balisage imbrique ex: "-{{b_-{a}_b}}".
    [25-11-2010] Le balisage prend maintenant le format "-{identifier}" au lieu de "{identifier}"   
    [25-11-2010] Ajout des fonction  check_simple_value() et check_default_value().   
    [25-11-2010] Les balises par defauts style: '|class:id|' et la fonction check_default_text() sont obseletes. Remplace par le balisage standard.
    [25-11-2010] Debug, check_arguments() ne s'execute pas si $select est a NULL. [resolue]
    [26-11-2010] Debug, check_node_includeNS() accept de faire passer l'attribut $arg a check_node() pour conserver les arguments par default.
    [26-11-2010] Debug, check_node() ne test pas les textes parent d'un noeud XML_CDATA_SECTION_NODE.
    [04-12-2010] Ajoute le type d'action "ignore", qui ignore le contenu d'un noeud (utile pour concerver un fragment de template a utiliser cote client).
    [04-12-2010] Ajout de la fonction clean_attributes()
    [04-12-2010] Depuis l'implentation de l'action "ignore", clean_node() ne peut plus etre execute sur l'ensemble du document, sous peine de supprimer les attributs conserver par les noeud ignorer. Maintenant seul les attributs des actions differentes de type "array" et "ignore" serons 'nettoyes' de leurs attributs inutiles. 
    [04-12-2010] Debug, $_SERVER['HTTP_HOST'] retourne parfois l'adresse URI au lieu du nom d'hote. [resolue] Utilise la commande "hostname" pour obtenir le nom d'hote
    [28-02-2011] Si l'argument 'inputdata' est specifie et que le fichier ne peut etre ouvert, la requete echoue.
    [28-02-2011] Utilise la fonction rcheck() pour scanner les arguments.
    [08-03-2011] Ajout de check_default_uri();
    [11-03-2011] Ajout des arguments "__uri__", "__base_uri__", "__path__";
    [28-05-2011] Ajout des arguments "__file_ctime__", "__file_mtime__", "__file_ctime_rfc822__", "__file_mtime_rfc822__"
    [10-06-2011] Exporte le contenu final en XML ou HTML suivant l'extension du fichier
    [14-06-2011] Integration de l'element 'template:container' comme element de contenu
    [16-06-2011] Debug l'export du contenu final HTML
	[09-11-2011] Ajout de check_paste_value()
	[09-11-2011] Ajout de l'action "exist"
*/
$doc_root = "../";
include($doc_root.'php/base.php');
include_path($doc_root.'php/');
include_path($doc_root.'php/class/bases/');
include_path($doc_root.'php/inputs/');
include($doc_root.'php/templates/xml_template.php');

if(isset($_REQUEST["output"]))   
  useFormRequest();
    
$_req_post_func = "wfw_request_output_var";

//
// Arguments
//
rcheck(
  //requis
  array('input'=>''), 
  //optionnels  
  array('inputdata'=>'','output'=>'','defaultdata'=>'')
);

//     
//path
//
$input_pathinfo = pathinfo($_REQUEST["input"]);
$input_path = $input_pathinfo["dirname"]."/";
$input_file = $input_pathinfo["basename"];
if(isset($_REQUEST["output"])){ 
	$output_pathinfo = pathinfo($_REQUEST["output"]);
	if($output_pathinfo["dirname"]!=".")
		$output_path = $input_path.$output_pathinfo["dirname"]."/";
	else
		$output_path = $input_path;
	$output_file = $output_pathinfo["basename"];
}

//
// Transforme le document
//

$select    = NULL;
$inputdata = isset($_REQUEST['inputdata']) ? $_REQUEST['inputdata'] : NULL;

//transforme 
$template = new cXMLTemplate();
if(!$template->Initialise($input_path.$input_file,NULL,$inputdata,NULL,$_REQUEST)){
	rpost_result(ERR_FAILED, "load_input_file");
}

$file_content =  $template->Make();

// sortie brut du document ?
if(!isset($_REQUEST["output"])){  
	switch(file_ext($input_file))
	{
		case "html":
		case "htm":
			header('Content-Type:text/html');   
			echo $file_content; 
			break;
      
		default:
			header('Content-Type:text/xml'); 
			echo '<?xml version="1.0" encoding="UTF-8"?>';
			echo $file_content;
			break;
	}
	exit(0);
}

// sauvegarde le document
switch(file_ext($input_file))
{
	case "html":
	case "htm":
		//ecrit le fichier
		if(file_put_contents($output_path.$output_file,$file_content)===FALSE)  
			rpost_result(ERR_FAILED, "save_output_file");
		break;
    
	default://xml
		//ecrit le fichier
		$header = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
		if(file_put_contents($output_path.$output_file,$header.$file_content)===FALSE)  
			rpost_result(ERR_FAILED, "save_output_file");
		break;
}

//global $_req_output;
//echo $_req_output;
rpost("output",$output_path.$output_file);
rpost("output_path",$output_path);
rpost("output_file",$output_file);
rpost_result(ERR_OK);
?>
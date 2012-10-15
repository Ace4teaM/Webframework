<?php
/*
	(C)2010-2011 ID-INFORMATIK - WebFrameWork(R)
	Actualise/Cree la page d'un flux de diffusion RSS

	Arguments:
		filename  : nom de fichier RSS
		title     : Optionnel, titre du document
		desc      : Optionnel, description du document
		parent_id : Optionnel, ID de la page parent
    
	Retourne:
		result   : resultat de la requete.
		info     : détails sur l'erreur en cas d'échec.
		filename : nom du fichier HTML
		fileid   : identificateur de la page
    
	Remarques:
		Le nom de fichier utilise pour la page est le suivant : "rss_[filename].html"
		L'identificateur de page utilise est le suivant       : "rss_[filename]"
    
		Exemple pour le fichier "actu.xml" cela donne "rss_actu.html" avec l'id "rss_actu"
		
	Revisions:
		[30-01-2012] Update, Remplace l'utilisation de la classe DefaultFile par cXMLDefault
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');
include(ROOT_PATH.'/wfw/php/templates/xml_template.php');
include('path.php');

//
// Arguments
//
rcheck(
	//requis
	array('filename'=>'cInputUNIXFileName'), 
	//optionnels  
	array('title'=>'','desc'=>'','parent_id'=>'cInputName')
);
   
//
// Globales
//                 
$inputdata          = RSS_DATA_PATH."/".$_REQUEST["filename"];
$filename_info      = pathinfo($_REQUEST["filename"]);
$template_file_name = "rss_".$filename_info['filename'].".html";
$file_id            = "rss_".$filename_info['filename'];
$output_dir         = ROOT_PATH."/private/template/pages";
$default_file       = ROOT_PATH."/default.xml";
$parent_id          = (isset($_REQUEST["parent_id"]) ? $_REQUEST["parent_id"] : "index");
$file_desc          = (isset($_REQUEST["title"]) ? $_REQUEST["title"] : "Actu");

//
// Cree le fichier template
//  
$arg = array(
	'_desc' => ($_REQUEST["desc"]),
	'_title' => ($_REQUEST["title"]),
	'_file_path' => (RSS_LOCAL_DATA_PATH."/".$_REQUEST["filename"]),
	'_page_id_' => "$file_id" // wfw-page.id
);
$template = new cXMLTemplate();
if($template->Initialise(ROOT_PATH."/private/_rss_viewer.html",NULL,RSS_LOCAL_DATA_PATH."/".$_REQUEST["filename"],NULL,$arg)){
	$content = $template->Make();
}
else
	rpost_result(ERR_FAILED,"can't create template");

//verifie l'existance du dossier de sortie
if(!file_exists($output_dir))
	rpost_result(ERR_FAILED,"Output directory ($output_dir) not exist");

//sauve le template
file_put_contents("$output_dir/$template_file_name",$content);

// actualise les templates
if(($ret=run(ROOT_PATH."/private/sh/","./make-all.sh",$out))!=0)
     rpost_result(ERR_FAILED,"system error [make-all] ($ret) ".print_r($out,TRUE));

//
// ajoute l'entree au fichier defaut.xml
//

//charge le fichier default 
$default = new cXMLDefault();
if(!$default->Initialise($default_file)){
	rpost_result(ERR_FAILED, "cant_open_default_file");
}

//initialise dans l'index  
$index = $default->getIndexNode("page",$file_id);
if($index == NULL)
	$index = $default->addIndexNode("page",$file_id);  
if($index == NULL)   
	rpost_result(ERR_FAILED,"addIndexNode");  
$index->setAttribute("name",$file_desc);  
$index->nodeValue = $template_file_name;

//initialise dans l'arbre  
if(NULL==($default->addTreeNode($parent_id,$file_id)))
  rpost_result(ERR_FAILED,"addTreeNode");
 
//sauvegarde
if(!$default->doc->save($default_file)){
  rpost_result(ERR_FAILED, "can't save default file: ".$default_file);
}

rpost("filename",$template_file_name);
rpost("fileid",$file_id);
rpost_result(ERR_OK);
?>

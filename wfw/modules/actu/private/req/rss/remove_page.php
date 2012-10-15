<?php
/*
	(C)2010-2011 ID-INFORMATIK - WebFrameWork(R)
	Supprime la page HTML d'un flux de diffusion RSS

	Arguments:
		filename : nom de fichier RSS
    
	Retourne:
		result  : resultat de la requete.
		info    : détails sur l'erreur en cas d'échec.
    
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
include('path.php');
  
//
// Arguments
//
rcheck(
  //requis
  array('filename'=>'cInputUNIXFileName'), 
  //optionnels  
  null
);
   
//
// Globales
//
$default_file = ROOT_PATH."/default.xml";
$filename_info      = pathinfo($_REQUEST["filename"]);
$template_file_name = "rss_".$filename_info['filename'].".html";
$page_id            = "rss_".$filename_info['filename'];
$output_dir         = ROOT_PATH."/private/template/pages";

//charge le fichier default
$default = new cXMLDefault();
if($default->Initialise($default_file))
{
	//supprime de l'index  
	$index = $default->getIndexNode("page",$page_id);
	if($index != NULL)
		$index->parentNode->removeChild($index);  

	//supprime de l'arbre  
	$tree = $default->getTreeNode($page_id);
	if($tree != NULL)
		$tree->parentNode->removeChild($tree);
	
	//supprime le fichier en cache
	$cache_file_path = ROOT_PATH."/$template_file_name";
	if(file_exists($cache_file_path))
		unlink($cache_file_path);

	//supprime le template
	$temp_file_path = "$output_dir/$template_file_name";
	if(file_exists($temp_file_path))
		unlink($temp_file_path);
	
	//sauvegarde
	if(!$default->doc->save($default_file))
		rpost_result(ERR_FAILED, "can't save default file: ".$default_file);
}

rpost_result(ERR_OK);
?>

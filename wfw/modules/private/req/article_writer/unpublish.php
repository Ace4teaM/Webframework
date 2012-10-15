<?php
/*
  (C)2011 ID-INFORMATIK, WebFrameWork(R)
	Depublie un document
  
  Arguments:
    id           : identifiant de l'article

  Retourne:
    result  : resultat de la requete.
    info    : details sur l'erreur en cas d'echec.

	Revisions:
		[30-01-2012] Update, Remplace l'utilisation de la classe DefaultFile par cXMLDefault
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

//
// Prepare la requete pour repondre a un formulaire
//
             
useFormRequest();

//
// Arguments
//

//
//verifie les champs obligatoires
//
rcheck(
  //requis
  array(     
    'client_id'=>'cInputName',
  ),
  //optionnels
  null
);

// obtient les infos 
if(!($result=xarg_req(ROOT_PATH."/private/req/client/","getall",array("wfw_id"=>($_REQUEST["client_id"]),"get_private"=>"1"))))   
	rpost_result(ERR_FAILED,"xarg_req error");  

//ini_set("display_errors","on");
$default_file = ROOT_PATH."/default.xml";

//charge le fichier default 
$default = new cXMLDefault();
if($default->Initialise($default_file))
{
	$page_id    = $result["id"];
	$output_dir = $result["output_dir"];

	//supprime de l'index  
	$index = $default->getIndexNode("page",$page_id);
	if($index != NULL)
		$index->parentNode->removeChild($index);  

	//supprime de l'arbre  
	$tree = $default->getTreeNode($page_id);
	if($tree != NULL)
		$tree->parentNode->removeChild($tree);
	
	//supprime le fichier en cache
	$cache_file_path = ROOT_PATH."/$page_id.html";
	if(file_exists($cache_file_path))
		unlink($cache_file_path);

	//supprime le template
	$temp_file_path = ROOT_PATH."/private/template/$output_dir/$page_id.html";
	if(file_exists($temp_file_path))
		unlink($temp_file_path);
	
	//sauvegarde
	if(!$default->doc->save($default_file))
		rpost_result(ERR_FAILED, "can't save default file: ".$default_file);
}
rpost_result(ERR_OK);
?>

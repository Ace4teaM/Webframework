<?php
/*
	(C)2011 ID-INFORMATIK. WebFrameWork(R)
	Supprime un dossier client et ses fichiers

	Arguments:
		[Name]       wfw_id     : Identificateur du dossier à vérfier
    
	Retourne:
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec
	
	Revisions:
		[08-12-2011] Supprime le dossier d'upload associe au fichier XML (si existant)
		[08-12-2011] Update, path (ROOT_PATH)
		[17-12-2011] Debug, utilise 'rrmdir' au lieu de 'rmdir' pour supprimer le contenu de l'upload
		[09-01-2012] Update
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

include(ROOT_PATH.'/req/client/path.inc');
include(ROOT_PATH.'/req/client/client.inc');

//
// Prepare la requete pour repondre a un formulaire
//
useFormRequest();
         
//
// verifie les champs obligatoires
//
rcheck(
	//requis
	array('wfw_id'=>'cInputName'),
	//optionnels
	NULL
);

//
// globales
//     
$id  = $_REQUEST["wfw_id"];    
$file_name = CLIENT_DATA_PATH."/$id.xml";
$dir_name = CLIENT_DATA_PATH."/$id/";

//
// supprime le fichier de donnees XML
//
if(!file_exists($file_name))
  rpost_result(ERR_FAILED, "invalid_id");

if(!unlink($file_name))
	rpost_result(ERR_FAILED,"cant_remove_data");

//
// supprime le dossier de donnees
//
if(is_dir($dir_name))
	if(!rrmdir($dir_name))//supprime recursivement
		rpost_result(ERR_FAILED,"cant_remove_upload");

rpost_result(ERR_OK);
?>

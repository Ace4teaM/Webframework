<?php

/*
	(C)2010-2011 ID-INFORMATIK. WebFrameWork(R)
	Supprime un fichier d'un dossier client

	Arguments:
		[Name]         wfw_id     : Identificateur du dossier à vérfier
		[Password]     [wfw_pwd]  : Optionnel, mot de passe du dossier (si définit)
		[UNIXFileName] filename   : Nom du fichier a supprimer
    
	Retourne:         
		id         : Identificateur du dossier
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec
	
	Revisions:
		[13-12-2011] Update, ROOT_PATH
		[09-01-2012] Update
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

include(ROOT_PATH.'/req/client/path.inc');
include(ROOT_PATH.'/req/client/client.inc');


//
// Prepare la requete pour repondre a un formulaire
//
  
//useFormRequest();
 
//
//verifie les champs obligatoires
//
rcheck(
	//requis
	array('wfw_id'=>'cInputName','filename'=>'cInputUNIXFileName'),
	//optionnels
	array('wfw_pwd'=>'cInputPassword')
);

//
//globales
//     
$id  = $_REQUEST["wfw_id"];
$pwd = isset($_REQUEST["wfw_pwd"])?$_REQUEST["wfw_pwd"]:"";    
$file_name = CLIENT_DATA_PATH."/$id.xml";
$file_dir = CLIENT_DATA_PATH."/$id/";
$remove_file_name = $_REQUEST["filename"];

//
// charge le fichier xml
//
$doc = clientOpen($id);

//
// verifie le mot de passe
//
clientCheckPassword($doc,$pwd);
    
//
// existe?
//  
if(!file_exists($file_dir.$remove_file_name)){ 
  rpost_result(ERR_FAILED, "file do not exist");
}
    
//
// supprime!
//  
if(!unlink($file_dir.$remove_file_name)){ 
  rpost_result(ERR_FAILED, "can't delete file");
}

//
rpost("id",$_REQUEST["wfw_id"]);  
rpost_result(ERR_OK);
?>

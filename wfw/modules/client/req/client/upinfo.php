<?php

/*
	(C)2010-2011 ID-INFORMATIK. WebFrameWork(R)
	Obtient des informations sur l'upload

	Arguments:
		[Name]         [wfw_id]  : Optionnel, identificateur du dossier à vérfier
		[Password]     [wfw_pwd] : Optionnel, mot de passe du dossier (si définit)

	Retourne:         
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec.
		file_count : Nombre de fichiers présents (uniquement si l'argument wfw_id est spécifié)
		max_size   : Taille maximum d'un fichier uploadable
		max_file   : Nombre maximum de fichier uploadable

	Remarques:
		Le nombre et la taille des fichiers peuvent varier suivant le dossier choisi
		Si l'argument wfw_id n'est pas spécifié, upinfo retourne les limites applicable par défaut
	
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
// Prepare la requete pour repondre à un formulaire
//

useFormRequest();                         

//
//verifie les champs
//
rcheck(
  //requis
  null,
  //optionnels
	array('wfw_id'=>'cInputName','wfw_pwd'=>'cInputPassword')
);
  
//
//globales
//     
$max_size=CLIENT_MAX_UPLOAD_SIZE;
$max_file=CLIENT_MAX_UPLOAD_FILE;

//dossier ?
if(isset($_REQUEST["wfw_id"]))
{
	$id        = $_REQUEST["wfw_id"];  
	$pwd       = isset($_REQUEST["wfw_pwd"])?$_REQUEST["wfw_pwd"]:""; 
	 
	//
	// charge le fichier xml
	//
	$doc = clientOpen($id);
	
	//
	// verifie le mot de passe
	//
	clientCheckPassword($doc,$pwd);

	//
	// limitation du dossier
	//   
	$max_file = clientGetMaxFile($doc);
	$max_size = clientGetMaxFileSize($doc);
	
	//
	// compte le nombre de fichiers presents 
	//
	$file_count = clientGetFileCount($id);
	rpost("file_count",$file_count);
}

//
rpost("max_size",$max_size);
rpost("max_file",$max_file);
rpost_result(ERR_OK);
?>

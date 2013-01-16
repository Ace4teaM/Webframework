<?php

/*
	(C)2010-2011 ID-INFORMATIK. WebFrameWork(R)
	Stock un fichier

	Arguments:
		[Name]         wfw_id    : Identificateur du dossier à vérfier
		[Password]     [wfw_pwd] : Optionnel, mot de passe du dossier (si définit)
		[]             file      : Données du fichier
    
	Retourne:         
		id         : Identificateur du dossier
		filename   : Nom du fichier uploadé
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
// Prepare la requete pour repondre à un formulaire
//

useFormRequest();                         

if(!isset($_FILES['file'])){
	rpost_result(ERR_REQ_MISSING_ARG, "file");
//	print_r($_FILES,TRUE)
}
 
if($_FILES['file']['error'] != UPLOAD_ERR_OK) 
  rpost_result(ERR_FAILED, "UPLOAD_ERR_".$_FILES['file']['error']);

if(!cInputUNIXFileName::isValid($_FILES['file']['name']))
	rpost_result(ERR_FAILED, "invalid_file_name");

//
//verifie les champs obligatoires
//
rcheck(
  //requis
	array('wfw_id'=>'cInputName'),
  //optionnels
  array('wfw_pwd'=>'cInputPassword')
);
  
//
//globales
//     
$id  = $_REQUEST["wfw_id"];
$file_name = CLIENT_DATA_PATH."/$id.xml";
$file_dir = CLIENT_DATA_PATH."/$id/";
$up_file = $_FILES['file'];
$size  = $_FILES['file']['size'];

//
// charge le fichier xml
//     
$doc = clientOpen($id);

//
// vérifie le mot de passe
//
clientCheckPassword($doc,$pwd);

//
// verifie la taille du fichier
//   
$max_size = clientGetMaxFileSize($doc);
if($size>$max_size)
	rpost_result(ERR_FAILED, "file_too_big");

//
// dossier de donnees 
//
if(!file_exists($file_dir) && (cmd("mkdir ".$file_dir,$cmd_out)!=0))
  rpost_result(ERR_SYSTEM, "cant_create_folder");

//
// vérifie le nombre de fichiers présents 
//    
$max_file = clientGetMaxFile($doc);
$file_count = clientGetFileCount($id);
if($file_count>=$max_file) 
	rpost_result(ERR_FAILED, "max_file_count");

//
// deplace le fichier temporaire 
//
if(!is_uploaded_file($_FILES['file']['tmp_name']))
  rpost_result(ERR_SYSTEM, "file_copy");

if(!move_uploaded_file($_FILES['file']['tmp_name'],$file_dir.$_FILES['file']['name']))
  rpost_result(ERR_SYSTEM, "file_copy");

//
rpost("id",$id);
rpost("filename",$_FILES['file']['name']);
rpost_result(ERR_OK);
?>

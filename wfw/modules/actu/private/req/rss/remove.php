<?php
/*
	(C)2010-2011 ID-INFORMATIK - WebFrameWork(R)
	Supprime un fichier RSS

	Arguments:
		filename : nom du fichier
    
	Retourne:
		result  : resultat de la requete.
		info    : détails sur l'erreur en cas d'échec.
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');
include('path.php');

//
// Prepare la requete pour repondre a un formulaire
//
useFormRequest(); 

//
// Arguments
//
rcheck(
  //requis
  array('filename'=>'cInputUNIXFileName'), 
  //optionnels  
  NULL
);

//
//globales
//
$file_name = RSS_DATA_PATH."/".$_REQUEST["filename"];

if(!file_exists($file_name))
	rpost_result(ERR_FAILED, "file not exist");

if(!unlink($file_name))
	rpost_result(ERR_FAILED, "can't remove file");
//             
rpost("file_name",$file_name);
rpost("name",$_REQUEST["filename"]);
rpost_result(ERR_OK);
?>

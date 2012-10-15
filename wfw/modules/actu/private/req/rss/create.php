<?php
/*
	(C)2010-2011 ID-INFORMATIK - WebFrameWork(R)
	Ajoute un fichier RSS

	Arguments:
		filename : nom du fichier a creer
    
	Retourne:
		result    : resultat de la requete.
		info      : détails sur l'erreur en cas d'échec.
		file_name : chemin complet vers le fichier cree
		name      : nom du fichier cree
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

$file_content = <<<EOT
<?xml version="1.0"?>
<rss version="2.0">
</rss>
EOT;

if(file_exists($file_name))
	rpost_result(ERR_FAILED, "file_exist");

//
//sauve au format XML
//
if(file_put_contents($file_name,utf8_encode($file_content)) == FALSE){
  rpost_result(ERR_FAILED, "can't create file ".$file_name);
}

//             
rpost("file_name",$file_name);
rpost("name",$_REQUEST["filename"]);
rpost_result(ERR_OK);
?>

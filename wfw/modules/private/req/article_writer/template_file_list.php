<?php

/*
  (C)2011 ID-INFORMATIK, WebFrameWork(R)
  Retourne la liste des dossiers templates
  
  Arguments:
    Aucun
    
  Retourne:        
    id        : Identificateurs, separes par des points virgules ';'                  
    result    : resultat de la requete.
    info      : details sur l'erreur en cas d'echec.
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

rcheck(
	//requis
	NULL,
	//optionnels
	array(     
		'prefix'=>'cInputIdentifier'
	)
);


//
//globales
//        
$file_dir = ROOT_PATH."/private/";
$file_prefix = (isset($_REQUEST["prefix"]) ? "_".$_REQUEST["prefix"] : "_");

rpost("file_dir",$file_dir);              
$id = "";   

//
if(is_dir($file_dir)) {
	if($dh = opendir($file_dir)) {
		while (($file = readdir($dh)) !== false)
		{
			if(is_file($file_dir.$file) && (substr($file,0,1)!='.') && (substr($file,0,strlen($file_prefix))==$file_prefix)){
				$id .= $file.";";
			}
		}
		closedir($dh);
	}
}

rpost("id",$id);    

//
rpost_result(ERR_OK);
?>

<?php

/*
	(C)2010-2011 ID-INFORMATIK. WebFrameWork(R)
	T�l�charge un fichier

	Arguments:
		[Name]         wfw_id     : Identificateur du dossier � v�rfier 
		[Password]     [wfw_pwd]  : Optionnel, mot de passe du dossier  
		[UNIXFileName] filename   : Nom du fichier.  
    
	Retourne:
		result     : R�sultat de la requ�te
		info       : D�tails sur l'erreur en cas d'echec
		path       : chemin relatif du fichier t�l�chargeable
	
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
$items = array();
$file_dir = CLIENT_DATA_PATH."/$id/";
  
//
// charge le fichier xml
//  
$doc = clientOpen($id);

//
// verifie le mot de passe
//
clientCheckPassword($doc,$pwd);

//
// verifie que le fichier existe
//
if(!file_exists($file_dir.$_REQUEST["filename"])){ 
	rpost_result(ERR_FAILED, "filename_not_exists");
}      

//cree un lien symbolique pour acceder au fichier
$slink_name = tempnam_s(ROOT_PATH."/tmp/",".".file_ext($_REQUEST["filename"]));
if(!symlink( $file_dir.$_REQUEST["filename"] , ROOT_PATH."/tmp/".$slink_name )){
	rpost("sys_error",error_get_last_str());
	rpost_result(ERR_FAILED, "cant_link_data");
}
//
//echo(file_get_contents($file_dir.$_REQUEST["filename"])); 
//retourne le lien temporaire au fichier ( recycle par la tache "clear_tmp" )
rpost("path","tmp/".$slink_name);//chemin relatif
rpost_result(ERR_OK);
?>

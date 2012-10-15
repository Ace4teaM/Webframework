<?php

/*
  (C)2012 ID-INFORMATIK, WebFrameWork(R)
  Test l'existance d'un fichier
  
  Arguments:
    [Name]         pageId   : Optionnel, Identificateur de la page à tester
	[UNIXFileName] pageName : Optionnel, Nom du fichier à tester
    
  Retourne:        
    file_exist   : true si le fichier existe, sinon false (pageName doit être définit)
    pageid_exist : true si la page existe, sinon false (pageId doit être définit)
    id           : Identificateurs, separes par des points virgules ';'
    result       : Résultat de la requête
    info         : Détails sur l'erreur en cas d'échec
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
// Globales
//
$default_file  = ROOT_PATH."/default.xml";

//charge le fichier default 
$default = new cXMLDefault();
if(!$default->Initialise($default_file)){
	rpost_result(ERR_FAILED, "cant_open_default_file");
}

//test l'existance dans l'index
isset($_REQUEST["pageId"]){
	if($default->getIndexNode("page",$_REQUEST["pageId"]))
		rpost("pageid_exist","true");
	else
		rpost("pageid_exist","false");
}

//test l'existance du fichier
isset($_REQUEST["pageName"]){
	if(!file_exists(ROOT_PATH."/".$_REQUEST["pageName"]))
		rpost("file_exist","true");
	else
		rpost("file_exist","false");
}

//
rpost_result(ERR_OK);
?>

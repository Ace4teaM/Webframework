<?php

/*
	(C)2012 ID-INFORMATIK. WebFrameWork(R)
	Verrouille/Déverouille publiquement les fichiers d'un dossier

	Arguments:
		[Name]  wfw_id     : Identificateur du dossier
		[Bool]  link       : true/false
    
	Retourne:         
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec
	
	Revisions:
		[27-02-2012] Implentation
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
//verifie les champs obligatoires
//
rcheck(
	//requis
	array('wfw_id'=>'cInputName','link'=>'cInputBool'),
	NULL
);

//
//globales
//     
$id   = $_REQUEST["wfw_id"];  
$link = cInputBool::toBool($_REQUEST["link"]);

//
// charge le fichier xml
//
$doc = clientOpen($id);

//
// crée/supprime le lien
//
if($link)
	clientPushData($id);
else
	clientPopData($id);

//OK
rpost_result(ERR_OK);
?>

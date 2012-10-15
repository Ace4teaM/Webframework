<?php

/*
	(C)2010-2011 ID-INFORMATIK. WebFrameWork(R)
	Test l'existence d'un dossier

	Arguments:
		[Name]         wfw_id    : Identificateur du dossier à vérfier
    
	Retourne: 
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec
		type       : Retourne le type de dossier
		date       : Retourne le date de création du dossier
		timestamp  : Retourne le date de création du dossier (timestamp)
		id         : Identificateur du dossier
		
	Revisions:
		[13-12-2011] Update, ROOT_PATH
		[09-01-2012] Update
		[10-03-2012] Update, valeurs de retour
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

useFormRequest();
 
//
//verifie les champs obligatoires
//
rcheck(
	//requis
	array('wfw_id'=>'cInputName'),
	//optionnels
	null
);

//
//globales
//     
$id  = $_REQUEST["wfw_id"];

//
// charge le fichier xml
//     
$doc = clientOpen($id);

rpost("date",$doc->getNodeValue("data/wfw_date"));
rpost("timestamp",$doc->getNodeValue("data/wfw_timestamp"));
rpost("type",$doc->getNodeValue("data/wfw_type"));
rpost("id",$doc->getNodeValue("data/wfw_id"));

//
rpost_result(ERR_OK);
?>

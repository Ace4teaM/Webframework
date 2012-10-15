<?php

/*
	(C)2012 ID-INFORMATIK - WebFrameWork(R)
	Supprime l'événement attaché a un dossier

	Arguments:
		[Identifier]   wfw_id               : Optionnel, Spécifie l'identifiant du dossier. Si le dossier éxiste, le dossier est remplacé
		[Password]     wfw_pwd              : Optionnel, Mot de passe
		[Identifier]   wfw_type             : Optionnel, Type de dossier. Par defaut: 'form'
		
	Retourne:         
		id         : Identificateur du dossier
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec

	Revisions:
		[10-03-2012] Implentation
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

//
// supprime le lien
//
clientPopEvent($id);

//
rpost("id",$id);
rpost_result(ERR_OK);
?>

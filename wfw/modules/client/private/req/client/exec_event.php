<?php

/*
	(R)WebFrameWork - (C)2012 Avalanche, Tout droits reserver.
	Execute un evenement

	Arguments:
    wfw_id    : identificateur du dossier <event> 
    
	Retourne:         
    result     : Résultat de la requête.
    info       : Détails sur l'erreur en cas d'échec.
	
	Revisions:
	[04-02-2012] Implentation
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
// Prepare la requete pour repondre à un formulaire
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

$i=1;
$cur = $doc->getNode("/data/req$i",false);
while($cur!=null)
{
	print_r("execute req: ".$cur->nodeValue);
	$cur = $doc->getNext($cur,"req$i");
}

//termine
rpost("id",$id);
rpost_result(ERR_OK);
?>

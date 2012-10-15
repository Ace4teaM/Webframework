<?php
/*
	(C)2012 ID-INFORMATIK - WebFrameWork(R)
	Obtient les champs d'un item
	
	Arguments:
		wfw_client_id : Id du catalogue
		item_guid     : Guid de l'item
    
	Retourne:
		id      : id du catalogue
		result  : resultat de la requete.
		info    : détails sur l'erreur en cas d'échec.
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
// Arguments
//
rcheck(
	//requis
	array('wfw_client_id'=>'cInputName','item_guid'=>''), 
	//optionnels  
	null
);

//
// Globales
//                 
$item_guid = $_REQUEST["item_guid"];
$catalog_doc = null;
$catalog_infos = null;

//
//charge le catalogue
//
$catalog_infos  = clientOpen($_REQUEST["wfw_client_id"]);
clientCheckType($catalog_infos,"catalog");

switch($catalog_infos->getNodeValue("data/type")){
	case 'xml':
		$catalog_doc = new cXMLCatalog();
		if(!$catalog_doc->Initialise(CLIENT_DATA_PATH."/".$_REQUEST["wfw_client_id"]."/catalog.xml"))
			rpost_result(ERR_FAILED,"cant_load_catalog");
		break;
	case 'sql':
		$catalog_doc = new cSQLCatalog();
		if(!$catalog_doc->Initialise($catalog_infos->guid,$catalog_infos->server_adr,$catalog_infos->server_usr,$catalog_infos->server_pwd))
			rpost_result(ERR_FAILED,"cant_load_catalog");
		break;
}

//
//obtient l'item
//
$item = $catalog_doc->getItemObj($item_guid,NULL);
if(!$item)
	rpost_result(ERR_FAILED,"cant_get_item");

/*print_r($item);
print_r($item->toNode($catalog_doc->doc,$item));
*/
//
// liste les champs 
//
if(property_exists($item,"set"))
	foreach($item->set as $name=>$value)
		if(is_string($value))
			rpost($name, trim($value));

// Terminé
rpost_result(ERR_OK, NULL);
?>

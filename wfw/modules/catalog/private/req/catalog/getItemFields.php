<?php
/*
	(C)2012 ID-INFORMATIK - WebFrameWork(R)
	Obtient les champs d'un item (/data/set)
	
	Arguments:
		wfw_client_id : Id du catalogue
		wfw_item_guid : GUID de l'item
    
	Retourne:
		id      : id du catalogue
		result  : resultat de la requete.
		info    : détails sur l'erreur en cas d'échec.
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

//
// Arguments
//
rcheck(
	//requis
	array('wfw_client_id'=>'cInputName','wfw_item_guid'=>''), 
	//optionnels  
	null
);

//
// Globales
//                 
$catalog_filename  = ROOT_PATH."/private/clients/data/".$_REQUEST["wfw_client_id"]."/catalog.xml";
$item_guid = $_REQUEST['wfw_item_guid'];

//
//charge le catalogue
//
$catalog_doc = new cXMLCatalog();
if(!$catalog_doc->Initialise($catalog_filename))
	rpost_result(ERR_FAILED,"can not load catalog");

//
//obtient l'item
//
$itemNode = $catalog_doc->getItem($item_guid,NULL);
if(!$itemNode)
	rpost_result(ERR_FAILED,"can not get item");
$item_set = $catalog_doc->doc->objGetNode($itemNode->item_node,'set',true);
if(!$item_set)
	rpost_result(ERR_FAILED,"can not get item set");

//
// liste les champs 
//
$cur = $item_set->firstChild;
while($cur){
	if($cur->nodeType == XML_ELEMENT_NODE){
		rpost($cur->tagName, trim($cur->nodeValue));
	}
	$cur = $cur->nextSibling;
}

// Terminé
rpost_result(ERR_OK, NULL);
?>

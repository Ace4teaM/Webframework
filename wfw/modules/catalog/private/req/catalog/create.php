<?php
/*
	(C)2012 ID-INFORMATIK - WebFrameWork(R)
	Ajoute un item au catalogue item
	Arguments:
		wfw_client_id        : id du catalogue
		wfw_item_id          : id de l'item
		wfw_item_guid        : Optionnel, GUID de l'item
		wfw_item_template_id : Optionnel, Identificateur du template
		[...]                : Champs à définirs
    
	Retourne:
		guid    : GUID de l'item
		result  : resultat de la requete.
		info    : détails sur l'erreur en cas d'échec.
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

include(ROOT_PATH.'/req/catalog/catalog.inc');

//
// Arguments
//
rcheck(
	//requis
	array('wfw_client_id'=>'cInputName','wfw_item_id'=>'cInputIdentifier'), 
	//optionnels  
	array('wfw_item_guid'=>'','wfw_item_template_id'=>'cInputName')
);

//
// Globales
//           
$catalog_filename  = ROOT_PATH."/private/clients/data/".$_REQUEST["wfw_client_id"]."/catalog.xml";

//
//charge le catalogue
//
$catalog_doc = new cXMLCatalog();
if(!$catalog_doc->Initialise($catalog_filename))
	rpost_result(ERR_FAILED,"can not load catalog");

//
// Globales
//
$item_guid    = (isset($_REQUEST['wfw_item_guid']) ? $_REQUEST['wfw_item_guid'] : uniqid("citem_"));
$item_id      = $_REQUEST['wfw_item_id'];
$item_pageId  = (isset($_REQUEST['wfw_item_template_id']) ? $_REQUEST['wfw_item_template_id'] : "catalog_".$catalog->guid."_".$item_guid);   

//
// L'Item existe ?
//
if($catalog_doc->getItem($item_guid,NULL))
	rpost_result(ERR_FAILED,"item exists");

//
// Cree le noeud de l'item
//

//item
$node = $catalog_doc->doc->createElement("item");
$node->setAttribute("guid",$item_guid);
$node->setAttribute("id",$item_id);
$catalog_doc->doc->documentElement->appendChild($node);

//params
$param = $catalog_doc->doc->createElement("template_id");
$param->nodeValue = $item_pageId;
$node->appendChild($param);

$param = $catalog_doc->doc->createElement("template");
$param->nodeValue = "_catalog_$item_id.html";
$node->appendChild($param);

$param = $catalog_doc->doc->createElement("content_type");
$param->nodeValue = "template";
$node->appendChild($param);

//sets
foreach($_REQUEST as $item=>$item_value){
	if(substr($item,0,4)!='wfw_'){
		//verifie l'identificateur
		if(cInputIdentifier::isValid($item) != ERR_OK)
			continue;
		//obtient le noeud
		$item_node = $catalog_doc->doc->objGetNode($node,"set/$item",true);
		if($item_node){
			$item_value = str_replace(array('<','>','&'),array('&lt;','&gt;','&amp;'),$item_value);
			$item_node->nodeValue = $item_value;
		}
	}
}

//
// sauvegarde 
//
if(!$catalog_doc->doc->save($catalog_filename)){ 
	rpost_result(ERR_FAILED, "cant_save");
}

// Terminé
rpost("guid",$item_guid);
rpost_result(ERR_OK, NULL);
?>

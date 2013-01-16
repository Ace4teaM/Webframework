<?php
/*
	(C)2012 ID-INFORMATIK - WebFrameWork(R)
	Clone un noeud du catalogue
	Arguments:
		wfw_client_id        : id du catalogue
		wfw_item_guid        : GUID de l'item
		wfw_item_id          : Optionnel, id de l'item
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

include('path.inc');

//
// Arguments
//
rcheck(
	//requis
	array('wfw_client_id'=>'cInputName','wfw_item_guid'=>'cInputName'), 
	//optionnels  
	array('wfw_item_id'=>'cInputIdentifier','wfw_item_template_id'=>'cInputName')
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
//$item_guid    = (isset($_REQUEST['wfw_item_guid']) ? $_REQUEST['wfw_item_guid'] : uniqid("citem_"));
$item_guid    = $_REQUEST['wfw_item_guid'];
$item_pageId  = (isset($_REQUEST['wfw_item_template_id']) ? $_REQUEST['wfw_item_template_id'] : "catalog_".$catalog_doc->guid."_".$item_guid);   
$new_guid     = uniqid("citem_");

//
// Cree le noeud de l'item
//

$model=$catalog_doc->getItem($item_guid,NULL);
if(!$model)
	rpost_result(ERR_FAILED,"item not exists");

$node = $model->item_node->cloneNode(true);

$item_id      = isset($_REQUEST['wfw_item_id']) ? $_REQUEST['wfw_item_id'] : $node->getAttribute("id");
	
$node->setAttribute("guid",$new_guid);
$node->setAttribute("id",$item_id);
$catalog_doc->doc->documentElement->appendChild($node);

//params
$param = $catalog_doc->doc->objGetNode($node,"template_id",true);
$param->nodeValue = $item_pageId;
$node->appendChild($param);

$param = $catalog_doc->doc->objGetNode($node,"template",true);
$param->nodeValue = "_catalog_$item_id.html";
$node->appendChild($param);

$param = $catalog_doc->doc->objGetNode($node,"content_type",true);
$param->nodeValue = "template";
$node->appendChild($param);

//sets
foreach($_REQUEST as $item=>$item_value){
	if(substr($item,0,4)!='wfw_'){
		//verifie l'identificateur
		if(!cInputIdentifier::isValid($item))
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
rpost("guid",$new_guid);
rpost_result(ERR_OK, NULL);
?>

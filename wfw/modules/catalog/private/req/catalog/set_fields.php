<?php
/*
	(C)2012 ID-INFORMATIK - WebFrameWork(R)
	Définit un ou plusieurs champs
	
	Arguments:
		[Name]       wfw_client_id : id du catalogue
		[Identifier] wfw_list_name : nom de la liste de champs
		[Bool]       wfw_replace   : Optionnel, remplace la liste existante. 'false' par défaut
		[ ]          ...           : Champs à définirs

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

include(ROOT_PATH.'/req/catalog/catalog.inc');

//
// Arguments
//
rcheck(
	//requis
	array('wfw_client_id'=>'cInputName','wfw_list_name'=>'cInputIdentifier'), 
	//optionnels  
	array('wfw_replace'=>'cInputBool')
);

//
// Globales
//
$id                = $_REQUEST["wfw_client_id"];
$catalog_filename  = ROOT_PATH."/private/clients/data/$id/catalog.xml";
$list_name         = $_REQUEST["wfw_list_name"];
$replace           = isset($_REQUEST["wfw_replace"]) ? cInputBool::toBool($_REQUEST["wfw_replace"]) : false;

//
//charge le catalogue
//
$catalog_doc = new cXMLCatalog();
if(!$catalog_doc->Initialise($catalog_filename))
	rpost_result(ERR_FAILED,"cant_load_catalog");

//
// verifie le nom de la liste 
//
switch($list_name){
	case "category":
	case "set":
	case "fields":
		break;
	default:
		rpost_result(ERR_FAILED,"unknown_list_name");
		exit;
}

//
//obtient le noeud de la liste
//
$fieldsNode = $catalog_doc->doc->getNode("data/$list_name",true);
if(!$fieldsNode)
	rpost_result(ERR_FAILED,"cant_create_fields");

//
//supprime les champs existants ?
//
if($replace){
	$catalog_doc->doc->removeChildNodes($fieldsNode);
}

//
// definit les champs 
//
foreach($_REQUEST as $item=>$item_value){
	if(substr($item,0,4)!='wfw_'){
		//verifie l'identificateur
		if(cInputIdentifier::isValid($item) != ERR_OK)
			continue;
		//obtient le noeud
		$node = $catalog_doc->doc->objGetNode($fieldsNode,$item,true);
		if($node){
			$item_value = str_replace(array('<','>','&'),array('&lt;','&gt;','&amp;'),$item_value);
			$node->nodeValue = $item_value;
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
rpost("id",$id);
rpost_result(ERR_OK, NULL);
?>

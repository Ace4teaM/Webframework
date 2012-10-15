<?php
/*
	(C)2012 ID-INFORMATIK - WebFrameWork(R)
	Obtient une liste de champs du catalogue
	
	Arguments:
		wfw_client_id : Id du catalogue
		list_name     : Nom de la liste des champs ("set", "category", "fields")
    
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

//
// Arguments
//
rcheck(
	//requis
	array('wfw_client_id'=>'cInputName','list_name'=>'cInputIdentifier'), 
	//optionnels  
	null
);

//
// Globales
//                 
$catalog_filename  = ROOT_PATH."/private/clients/data/".$_REQUEST["wfw_client_id"]."/catalog.xml";
$list_name = $_REQUEST["list_name"];

//
//charge le catalogue
//
$catalog_doc = new cXMLCatalog();
if(!$catalog_doc->Initialise($catalog_filename))
	rpost_result(ERR_FAILED,"can not load catalog");

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
// liste les champs 
//
$fieldsNode = $catalog_doc->doc->getNode("data/$list_name",false);
if($fieldsNode){
	$cur = $fieldsNode->firstChild;
	while($cur){
		if($cur->nodeType == XML_ELEMENT_NODE){
			rpost($cur->tagName, trim($cur->nodeValue));
		}
		$cur = $cur->nextSibling;
	}
}

// Terminé
rpost_result(ERR_OK, NULL);
?>

<?php
/*
	(C)2012 ID-INFORMATIK - WebFrameWork(R)
	Recherche et liste les items d'un catalogue selon plusieurs critères
	
	Arguments:
		wfw_client_id       : Id du catalogue
		[wfw_item_id]       : Optionnel, Identificateur à filtrer
		[wfw_item_category] : Optionnel, Liste des catégories "category" à filtrer séparé par des ';' (si l'item fait partie d'au moins une de ses catégorie, il est ajouté)
		[...]               : Optionnel, Liste des paramètres "set" à filtrer, "nom=expression réguliére". (si l'item satisfait toutes les expressions, il est ajouté)

	Retourne:
		id         : id du catalogue
		result     : resultat de la requete.
		info       : détails sur l'erreur en cas d'échec.
		
		item_count : Nombre d'item trouvé
		[item_X]   : Guide de l'énième item trouvé ('X' est remplacé par l'indice de l'item). Le compteur d'indices débute à zéro
		[...]      : Guides des items trouvés
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
	array('wfw_client_id'=>'cInputName'), 
	//optionnels  
	array('wfw_item_id'=>'cInputName','wfw_item_category'=>'')
);

$wfw_client_id     = $_REQUEST["wfw_client_id"];
$catalog_filename  = ROOT_PATH."/private/clients/data/$wfw_client_id/catalog.xml";
$wfw_item_id       = isset($_REQUEST["wfw_item_id"]) ? $_REQUEST["wfw_item_id"] : null;
$wfw_item_category = isset($_REQUEST["wfw_item_category"]) ? $_REQUEST["wfw_item_category"] : null;
$item_count        = 0;
if($wfw_item_category!=null)
	$wfw_item_category = strexplode($wfw_item_category, ";", true);

//
//liste les champs additionnels
//
$fields_list = array();
foreach($_REQUEST as $item=>$item_value){
	if(substr($item,0,4)!='wfw_'){
		//verifie l'identificateur
		if(!cInputIdentifier::isValid($item))
			continue;
		$fields_list[$item] = $item_value;
	}
}

//
//charge le catalogue
//
$catalog_doc = new cXMLCatalog();
if(!$catalog_doc->Initialise($catalog_filename))
	rpost_result(ERR_FAILED,"cant_load_catalog");

//
//obtient le premier item
//
$item = $catalog_doc->getItem(NULL,NULL);
//Acun items ?
if(!$item)
	goto end;

$cur = $item->item_node;
while($cur){
	// le noeud est un element ?
	if(	($cur->nodeType != XML_ELEMENT_NODE) ){
		$cur = $cur->nextSibling;
		continue;
	}
	// identificateur OK ?
	if(	$wfw_item_id != null && $wfw_item_id != $cur->getAttribute("id") ){
		$cur = $cur->nextSibling;
		continue;
	}
	// categorie OK ?
	$cur_category = $catalog_doc->doc->getNextChildNode($cur,"category");
	if(	($wfw_item_category != null && $cur_category==null) ){
		$cur = $cur->nextSibling;
		continue;
	}
	if($wfw_item_category != null){
		$cur_category = strexplode($cur_category->nodeValue, ";", true);
		if(!array_find($wfw_item_category, $cur_category)){
			$cur = $cur->nextSibling;
			continue;
		}
	}
	
	// test les autres champs
	$set_node = $catalog_doc->doc->getNextChildNode($cur,"set");
	foreach($fields_list as $field_name=>$field_exp){
		//param?
		if($set_node===null){
			$cur = $cur->nextSibling;
			continue 2;
		}
		//test le parametre
		$node = $catalog_doc->doc->getNextChildNode($set_node,$field_name);
		if($node===null || !preg_match("/$field_exp/",$node->nodeValue)){
			$cur = $cur->nextSibling;
			continue 2;
		}
	}
	
	//post l'item
	rpost($cur->getAttribute("guid"),"1");

	//suivant
	$cur = $cur->nextSibling;
}

// Terminé
end:
rpost_result(ERR_OK, NULL);
?>

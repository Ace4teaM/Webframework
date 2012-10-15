<?php
/*
	(C)2012 ID-INFORMATIK - WebFrameWork(R)
	Supprime un item au catalogue
	Arguments:
		wfw_client_id        : id du catalogue
		wfw_item_guid        : GUID de l'item
    
	Retourne:
		guid    : GUID de l'item supprimé
		result  : resultat de la requete.
		info    : détails sur l'erreur en cas d'échec.
		
	Remarques:
		Si l'item utilise un contenu de template, la page sera supprimée de l'index web
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
	null
);

//
// Globales
//           
$catalog_filename  = ROOT_PATH."/private/clients/data/".$_REQUEST["wfw_client_id"]."/catalog.xml";
$default_file  = ROOT_PATH."/default.xml";
$item_guid    = $_REQUEST['wfw_item_guid'];

//
//charge le catalogue
//
$catalog_doc = new cXMLCatalog();
if(!$catalog_doc->Initialise($catalog_filename))
	rpost_result(ERR_FAILED,"can not load catalog");

//
// obtient le noeud
//
if(!($item=$catalog_doc->getItem($item_guid,NULL)))
	rpost_result(ERR_FAILED,"item not exists");

$node = $item->item_node;

$template_id = $catalog_doc->doc->getNextChildNode($node,"template_id");
if($template_id)
	$template_id = $template_id->nodeValue;

$content_type = $catalog_doc->doc->getNextChildNode($node,"content_type");
if($content_type)
	$content_type = $content_type->nodeValue;

//
// supprime du catalogue
//

$node->parentNode->removeChild($node);

//
// supprime de l'index
//
if($content_type == "template")
{
	//charge le fichier default 
	$default = new cXMLDefault();
	if($default->Initialise($default_file)){
		//index
		$index = $default->getIndexNode("page",$template_id);
		if($index)
			$index->parentNode->removeChild($index);
		//arbre
		$tree = $default->getTreeNode($template_id);
		if($tree)
			$tree->parentNode->removeChild($tree);
		//sauve le fichier
		$default->doc->save($default_file);
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

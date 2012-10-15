<?php
/*
	(C)2011-2012 ID-INFORMATIK, WebFrameWork(R)
	Actualise/Cree le template

	Arguments:
		[Name] client_id      : Identifiant du catalogue
		[Name] item_guid      : Guid de l'item
		[Bool] update_default : Actualise le fichier defaut ?
    
	Retourne:
		result  : resultat de la requete.
		info    : détails sur l'erreur en cas d'échec.
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

include(ROOT_PATH.'/req/client/path.inc');

include(ROOT_PATH.'/wfw/php/templates/xml_template.php');

function text($value,$default_file){
	return (empty($value) ? $default_file : $value);
}

//
// Arguments
//
rcheck(
	//requis
	array('client_id'=>'cInputName','item_guid'=>'cInputName'), 
	//optionnels  
	array('update_default'=>'cInputBool')
);

//
// charge les infos
//
if(!($catalog_args=xarg_req(ROOT_PATH."/private/req/client/","getall",array("wfw_id"=>($_REQUEST["client_id"])))))   
	rpost_result(ERR_FAILED,"xarg_req error");  

//
// Globales
//                 
$catalog_filename  = ROOT_PATH."/private/clients/data/".$_REQUEST["client_id"]."/catalog.xml";
$update_default = (isset($_REQUEST["update_default"]) ? cInputBool::toBool($_REQUEST["update_default"]) : false);

//
//charge le catalogue
//
$catalog_doc = new cXMLCatalog();
if(!$catalog_doc->Initialise($catalog_filename))
	rpost_result(ERR_FAILED,"cant_load_catalog");

//
//obtient l'item
//
$item = $catalog_doc->getItem($_REQUEST['item_guid'],NULL);
if(!$item)
	rpost_result(ERR_FAILED,"cant_get_item");

//
// Globales
//
$catalog_page_id = $catalog_args["page_id"];
$catalog_guid  = $catalog_doc->guid;
$item_guid     = $item->guid;
$template_file = text($item->getParam("template"), "_catalog_".$item->id.".html");
$output_dir    = ROOT_PATH."/private/template/".text($item->getParam("out_dir"), "pages");
$id_file_name  = text($item->getParam("template_id"),"catalog_".$catalog_guid."_".$item_guid);
$out_file_name = "$id_file_name.html";
$out_dynamic_filename  = "catalog_item.php?client_id=".$_REQUEST["client_id"]."&amp;item_guid=".$_REQUEST["item_guid"];
$parent_id     = text($item->getParam("parent_id"), "index");
$default_file  = ROOT_PATH."/default.xml";
$item_title    = text($item->getField("name",NULL), "Catalog item");
$item_desc     = text($item->getField("name",NULL), "Catalog description");

//
// Fabrique le template intermediaire
//
if($item->getParam("content_type") == "template"){
	//verifie l'existance du template
	if(!file_exists(ROOT_PATH."/private/$template_file"))
		rpost_result(ERR_FAILED,"Template file ($template_file) not exist");

	//verifie l'existance du dossier de sortie
	if(!file_exists($output_dir))
		rpost_result(ERR_FAILED,"Output directory ($output_dir) not exist");

	// Fabrique le template intermediaire
	$arg = array(
		'_desc_' => ($item_desc),
		'_title_' => ($item_title),
		'_page_id_' => ($id_file_name), // wfw-page.id
		'_catalog_page_id_' => ($catalog_page_id),
		'_catalog_guid_' => ($catalog_guid),
		'_item_guid_' => ($item_guid),
		'_cur_guid_' => ($item_guid),
		'_data_path_' => (CLIENT_PUBLIC_DIR."/".$_REQUEST["client_id"])
		);
	$template = new cXMLTemplate();
	if($template->Initialise(ROOT_PATH."/private/$template_file",NULL,$catalog_doc->doc,$item->item_node,$arg)){
		$content = $template->Make();
	}
	else
		rpost_result(ERR_FAILED,"can't create template");

	//sauve le template
	file_put_contents("$output_dir/$out_file_name",$content);

	//
	// actualise les templates
	//
	if(($ret=run(ROOT_PATH."/private/sh/","./make-all.sh",$out))!=0)
		rpost_result(ERR_FAILED,"system error [make-all] ($ret) ".print_r($out,TRUE));

	//
	// ajoute l'entree au fichier defaut.xml
	//
	if($update_default){
		//charge le fichier default 
		$default = new cXMLDefault();
		if(!$default->Initialise($default_file)){
			rpost_result(ERR_FAILED, "can't open default file ".$default_file);
		}

		//initialise dans l'index  
		$index = $default->getIndexNode("page",$id_file_name);
		if($index == NULL)
			$index = $default->addIndexNode("page",$id_file_name);  
		if($index == NULL)   
			rpost_result(ERR_FAILED,"addIndexNode");  
		$index->setAttribute("name",$item_title);  
		$index->nodeValue = $out_dynamic_filename;

		//initialise dans l'arbre  
		if(!$default->addTreeNode($parent_id,$id_file_name))
			rpost_result(ERR_FAILED,"addTreeNode $id_file_name->$parent_id");

		//sauvegarde
		if(!$default->doc->save($default_file)){
			rpost_result(ERR_FAILED, "can't save default file: ".$default_file);
		}
	}
}
rpost("filename",$out_file_name);
rpost_result(ERR_OK);
?>

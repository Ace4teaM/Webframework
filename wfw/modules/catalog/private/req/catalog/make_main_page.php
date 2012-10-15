<?php
/*
	(C)2011-2012 ID-INFORMATIK, WebFrameWork(R)
	Actualise/Cree le template principale du catalogue

	Arguments:
		[Name] client_id      : Identifiant du catalogue
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
	array('client_id'=>'cInputName'), 
	//optionnels  
	array('update_default'=>'cInputBool')
);
   
//
// Globales
//                 
$catalog_filename  = ROOT_PATH."/private/clients/data/".$_REQUEST["client_id"]."/catalog.xml";
$update_default = (isset($_REQUEST["update_default"]) ? cInputBool::toBool($_REQUEST["update_default"]) : false);

//
// charge les infos
//
if(!($catalog_args=xarg_req(ROOT_PATH."/private/req/client/","getall",array("wfw_id"=>($_REQUEST["client_id"])/*,"get_private"=>"1"*/))))   
	rpost_result(ERR_FAILED,"xarg_req error");  

//
//charge le catalogue
//
$catalog_doc = new cXMLCatalog();
if(!$catalog_doc->Initialise($catalog_filename))
	rpost_result(ERR_FAILED,"can not load catalog");

//
// Globales
//
$template_file = $catalog_args["template"];
$input_dir     = ROOT_PATH."/private";
$output_dir    = ROOT_PATH."/private/template/".$catalog_args["out_dir"];
$id_filename   = $catalog_args["page_id"];
$out_filename  = "$id_filename.html";
$out_dynamic_filename  = "catalog.php?client_id=".$_REQUEST["client_id"];
$update_default = (isset($_REQUEST["update_default"]) ? cInputBool::toBool($_REQUEST["update_default"]) : false);

$parent_id     = $catalog_args["parent_id"];
$default_file  = ROOT_PATH."/default.xml";
$catalog_guid  = $catalog_doc->guid;


//verifie l'existance du template
if(!file_exists(ROOT_PATH."/private/$template_file"))
	rpost_result(ERR_FAILED,"Template file ($template_file) not exist");

//verifie l'existance du dossier de sortie
if(!file_exists($output_dir))
	rpost_result(ERR_FAILED,"Output directory ($output_dir) not exist");

//
// Fabrique le template intermediaire
//
$args = $catalog_args;
$args['_page_id_'] = ($id_filename); // wfw-page.id
$args['_catalog_guid_'] = ($catalog_guid);
$args['_data_path_'] = (CLIENT_PUBLIC_DIR."/".$_REQUEST["client_id"]);
$args['_client_id_'] = $_REQUEST["client_id"];

$template = new cXMLTemplate();
if(!$template->Initialise("$input_dir/$template_file",NULL,$catalog_doc->doc,NULL,$args))
	rpost_result(ERR_FAILED,"can't create template");
$content = $template->Make();
if(empty($content)){
	$error = error_get_last();
	rpost_result(ERR_FAILED,$error["message"]);
}

//sauve le template
file_put_contents("$output_dir/$out_filename",$content);

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
	$index = $default->getIndexNode("page",$id_filename);
	if($index == NULL)
		$index = $default->addIndexNode("page",$id_filename);  
	if($index == NULL)   
		rpost_result(ERR_FAILED,"addIndexNode");  
	$index->setAttribute("name",$catalog_args["name"]);  
	$index->nodeValue = $out_dynamic_filename;

	//initialise dans l'arbre  
	if(!$default->addTreeNode($parent_id,$id_filename))
		rpost_result(ERR_FAILED,"addTreeNode $id_filename->$parent_id");

	//sauvegarde
	if(!$default->doc->save($default_file)){
		rpost_result(ERR_FAILED, "can't save default file: ".$default_file);
	}
}

rpost("filename",$out_filename);
rpost_result(ERR_OK);
?>

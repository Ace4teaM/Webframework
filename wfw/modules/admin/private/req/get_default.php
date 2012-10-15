<?php

/*
  (C)2012 ID-INFORMATIK, WebFrameWork(R)
  Obtient une valeur du fichier défaut
  
  Arguments:
	[Bool]       private : Si true, le fichier privé est modifié
    [Identifier] id      : Identifiant de la valeur à modifier
    [Identifier] name    : Nom de la valeur à modifier
  Retourne:        
    id           : Identifiant de la valeur
    name         : Nom de la valeur
    value        : Valeur
    result       : Résultat de la requête
    info         : Détails sur l'erreur en cas d'échec
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

include(ROOT_PATH.'/private/req/admin.inc');

//
// Prepare la requete pour repondre a un formulaire
//
  
useFormRequest();

//
//verifie les champs obligatoires
//
rcheck(
	//requis
	array('private'=>'cInputBool','id'=>'cInputIdentifier','name'=>'cInputIdentifier'),
	//optionnels
	null
	);

//
//globales
//
$bPrivate    = cInputBool::toBool($_REQUEST['private']);
$node_id     = $_REQUEST['id'];
$node_name   = $_REQUEST['name'];
$default_file= ($bPrivate) ? ROOT_PATH."/private/default.xml" : ROOT_PATH."/default.xml";

//charge le fichier default 
$default = new cXMLDefault();
if(!$default->Initialise($default_file)){
	rpost_result(ERR_FAILED, "cant_open_default_file");
}

//initialise dans l'index  
rpost("id", $node_id);
rpost("name", $node_name);
rpost("value", $default->getIndexValue($node_name,$node_id));
 
//
rpost_result(ERR_OK);
?>

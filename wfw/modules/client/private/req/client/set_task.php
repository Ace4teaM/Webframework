<?php

/*
  (C)2011 WebFrameWork 1.3
  Initialise une tache cron depuis un dossier <request>

  Arguments:
		[Name]       wfw_id     : Identificateur du dossier <request>
		[]           cron_time  : Temps cron
		[Name]       task_name  : Nom de la tache
    
  Retourne:         
		result     : R�sultat de la requete
		info       : Details sur l'erreur en cas d'echec
	
  Revisions:
	[13-12-2011] Update, ROOT_PATH
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

include(ROOT_PATH.'/req/client/path.inc');
include(ROOT_PATH.'/req/client/client.inc');

//
//verifie les champs obligatoires
//
rcheck(
	//requis
	array('wfw_id'=>'cInputName','cron_time'=>'','task_name'=>'cInputName'),
	NULL
);

//
//globales
//     
$id  = $_REQUEST["wfw_id"];  
$file_name = CLIENT_DATA_PATH."/$id.xml";
$items = array(); 
$www_dir = ROOT_PATH;
$web_name = basename($www_dir); 
$task_name = $_REQUEST["task_name"];
$cron_time = $_REQUEST["cron_time"];

//
// charge le fichier xml
//
$doc = clientOpen($id);

//
// verifie le type de dossier
//
if("request" != $doc->getNodeValue("data/wfw_type"))
    rpost_result(ERR_FAILED, "invalid_type");

//
// ajoute la tache cron
//
$out = array(); 
$cmd = "$www_dir/wfw/sh/add_cron_task.sh '$web_name' '$task_name' '$cron_time' 'php $www_dir/private/req/client/exec_task.php wfw_id=\"$id\"'";
exec($cmd,$out,$cmd_ret); 
if($cmd_ret != 0)
	rpost_result(ERR_FAILED, "add_cron_task_ret_$cmd_ret");

//OK
rpost_result(ERR_OK);
?>

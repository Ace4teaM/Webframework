<?php
/*
	(C)2011 ID-Informatik, WebFrameWork(R). All rights reserved.
	 Supprime une tache planifiee
  
	Arguments:
		sitename   : nom du site
		taskname   : nom de la requête

	Retourne:
		result  : resultat de la requete.

	Revisions:
		[20-12-2011] Implentation
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../")); //racine du site
include(ROOT_PATH.'/php/base.php');
include_path(ROOT_PATH.'/php/');
include_path(ROOT_PATH.'/php/class/bases/');
include_path(ROOT_PATH.'/php/inputs/');

//
// Verifie les arguments
//
rcheck(
	//requis
	array(     
			'sitename'=>'cInputName',
			'taskname'=>'cInputName',
		),
	//optionnels
	NULL
);

//recupere la crontab
$out = array(); 
exec(ROOT_PATH."/sh/rem_cron_task.sh '".$_REQUEST["sitename"]."' '".$_REQUEST["taskname"]."'",$out,$cmd_ret);
if($cmd_ret != 0)
	rpost_result(ERR_FAILED, "rem_cron_task.sh error ($cmd_ret)");


rpost_result(ERR_OK);
?>
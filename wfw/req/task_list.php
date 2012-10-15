<?php

/*
	(C)2011 ID-Informatik, WebFrameWork(R). All rights reserved.
	Liste les taches planifiées

	Arguments:
		sitename  : Nom du site

	Retourne:        
		result    : resultat de la requete.
		info      : details sur l'erreur en cas d'echec.
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../")); //racine du site
include(ROOT_PATH.'/php/base.php');
include_path(ROOT_PATH.'/php/');
include_path(ROOT_PATH.'/php/class/bases/');
include_path(ROOT_PATH.'/php/inputs/');

//
// Prepare la requete pour repondre a un formulaire
//

useFormRequest();

//
// Verifie les arguments
//
rcheck(
	//requis
	array(     
		'sitename'=>'cInputName',
	),
	//optionnels
	NULL
);

//recupere la crontab
$out = array(); 
exec("crontab -l > /tmp/cron",$out,$cmd_ret);
if($cmd_ret != 0)
	rpost_result(ERR_FAILED, "exec error ($cmd_ret)");

//out
rpost("content",file_get_contents("/tmp/cron"));

//
rpost_result(ERR_OK);
?>
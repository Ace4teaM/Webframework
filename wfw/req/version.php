<?php
/*
	(C)2011 ID-Informatik, WebFrameWork(R). All rights reserved.
	Retourne la version du framework
  
	Arguments:
		aucun

	Retourne:
		version  : resultat de la requete. 
		high     : resultat de la requete.
		low      : resultat de la requete.

	Revisions:
		[20-12-2011], Met a jour 'ROOT_PATH'
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../")); //racine du site
include(ROOT_PATH.'/php/base.php');
include_path(ROOT_PATH.'/php/');
include_path(ROOT_PATH.'/php/class/bases/');
include_path(ROOT_PATH.'/php/inputs/');

$ver = explode('.',WFW_VERSION);
rpost("version",WFW_VERSION); 
rpost("high",$ver[0]);   
rpost("low",$ver[1]);
if(isset($ver[2]))
	rpost("rev",$ver[2]); 
else
	rpost("rev","0"); 
rpost_result(ERR_OK);
?>
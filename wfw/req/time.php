<?php
/*
	(C)2012 ID-Informatik, WebFrameWork(R). All rights reserved.
	Retourne le timestamp UNIX en cours
  
	Arguments:
		aucun

	Retourne:
		time  : timestamp UNIX en cours

	Revisions:
		[24-05-2011], Implentation
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../")); //racine du site
include(ROOT_PATH.'/php/base.php');
include_path(ROOT_PATH.'/php/');
include_path(ROOT_PATH.'/php/class/bases/');
include_path(ROOT_PATH.'/php/inputs/');


rpost("time",time()); 
rpost_result(ERR_OK);
?>
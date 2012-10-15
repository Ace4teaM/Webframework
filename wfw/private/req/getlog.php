<?php
/*
	(C)2011 ID-Informatik, WebFrameWork(R). All rights reserved.
	Lit un fichier log
  
	Arguments:
		sitename : nom du site

	Retourne:
		Contenu du fichier log

	Revisions:
		[17-12-2011] Implentation du script
*/
define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../")); //racine du site
include(ROOT_PATH.'/php/base.php');
include_path(ROOT_PATH.'/php/');
include_path(ROOT_PATH.'/php/class/bases/');
include_path(ROOT_PATH.'/php/inputs/');
include('path.php');

//
// verifie les champs
//
rcheck(
	//requis
	array('sitename'=>'cInputName'),
	//optionnels
	null
);

header("content-type: text/plain");
header('Content-Disposition: attachment; filename="'.$_REQUEST["sitename"].'.log"');

$file_name  = WFW_LOG_PATH."/".$_REQUEST["sitename"].".log";

if(!file_exists($file_name))
	exit;
readfile($file_name);
//echo(file_get_contents($file_name));
?>
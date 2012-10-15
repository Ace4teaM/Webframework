<?php

/*
  (C)2010 WebFrameWork 1.3
  Update les templates
  
  Retourne:        
    result    : resultat de la requete.
    info      : details sur l'erreur en cas d'echec.
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

//clear
if(($ret=run(ROOT_PATH."/private/sh/","./clear-all.sh"." > ".ROOT_PATH."/private/clear-all.log 2>&1",$out))!=0)
	rpost_result(ERR_FAILED,"system error [clear-all.sh] ($ret) ".print_r($out,TRUE));

//update
if(($ret=run(ROOT_PATH."/private/sh/","./make-all.sh"." > ".ROOT_PATH."/private/make-all.log 2>&1",$out))!=0)
	rpost_result(ERR_FAILED,"system error [make-all.sh] ($ret) ".print_r($out,TRUE));

//
rpost_result(ERR_OK);
?>
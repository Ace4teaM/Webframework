<?php

/*
  (C)2010 WebFrameWork 1.3
  Reconfigure le site
  
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

//update
if(($ret=run(ROOT_PATH."/private/sh/","./configure.sh"." > ".ROOT_PATH."/private/configure.log 2>&1",$out))!=0)
	rpost_result(ERR_FAILED,"system error [configure.sh] ($ret) ".print_r($out,TRUE));

//
rpost_result(ERR_OK);
?>
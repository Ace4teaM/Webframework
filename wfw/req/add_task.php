<?php
/*
  (C)2010 WebFrameWork
	  Ajoute une tache planifie
  
  Arguments:
  	cmd    : commande a executer
  	date   : date au format timestamp unix

  Retourne:
    result  : resultat de la requete.

  Revisions:
*/
define("ROOT_PATH", "../");
include('../local/path.php');

include(ROOT_PATH.'include/base.php');
include_path(ROOT_PATH.'include/');
include_path(ROOT_PATH.'include/class/bases/');
include_path(ROOT_PATH.'include/inputs/');

//
// Arguments
//

if(!isset($_REQUEST["cmd"])){
  rpost_result(ERR_REQ_MISSING_ARG,"argument cmd");
}
if(!cInputIdentifier::isValid($_REQUEST["cmd"])){
  rpost_result(ERR_REQ_INVALID_ARG,"argument cmd");
}

if(!isset($_REQUEST["date"])){
  rpost_result(ERR_REQ_MISSING_ARG"argument date");
}
if(!cInputInteger::isValid($_REQUEST["date"])){
  rpost_result(ERR_REQ_INVALID_ARG,"argument date");
}

if( function_exists("exec") ){
  rpost("used_function","exec");
  $crontab = Array();
  exec('crontab -l', $crontab);
  print_r($crontab);
}
/*else if( function_exists("shell_exec") ){
  $ret=shell_exec('crontab -l');

  print_r($ret);
}
else if( function_exists("system") ){
  rpost("used_function","system");
  $crontab = Array();
  system('crontab -l', $crontab);
  print_r($crontab);
}
else if( function_exists("passthru") ){
  rpost("used_function","passthru");
}*/
else{
  rpost_result(ERR_FAILED,"no method available for command execution");
}

rpost_result(ERR_OK);
?>
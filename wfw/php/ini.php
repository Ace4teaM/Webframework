<?php
/*
  Configuration php.ini
*/
error_reporting(E_ALL/*E_ERROR|E_WARNING*/);
ini_set('display_errors', '1');
//ini_set('display_errors', stderr);

ini_set('date.timezone', 'Europe/Paris');
//ini_set('include_path',ini_get('include_path').':'+pwd()+':');


/** hostname */
$_hostname_ = "";
{                                    
  exec("hostname",$_hostname_,$return);
  if($return==0)     
    $_hostname_ = strtolower($_hostname_[0]);
  else
    $_hostname_="";//introuvable
} 

/** version */
define('WFW_VERSION','1.7');

?>
<?php

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH)); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');
/*
// utilise le cache ?
if(catalog->lastUpdate <= file->lastUpdate)
{
	echo default->getFile($result["filename"]);
	exit;
}*/

//
// actualise le cache
//
$result = xarg_req(ROOT_PATH.'/private/req/catalog/','make_main_page',$_REQUEST);

if($result===NULL)
	rpost_result(ERR_FAILED, "sub_request_error ".ROOT_PATH.'/private/req/client/');

if($result["result"] != ERR_OK)
	rpost_result($result["result"], $result["info"]);

echo file_get_contents($result["filename"]);

?>
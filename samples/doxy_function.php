<?php
require_once("inc/globals.php");
global $app;
$ref = $_REQUEST["ref"];
$file = substr($ref, 0, strrpos($ref,'_'));
$app->showXMLView("../doc/php/xml/$file.xml",NULL,array("id" => $ref),"view/doxy_function.html");

?>
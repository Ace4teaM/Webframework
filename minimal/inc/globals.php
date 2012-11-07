<?php

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../")); //racine du site

require_once("inc/Application.php");

//instancie l'application
global $app;
$app = new Application(ROOT_PATH);

set_include_path(get_include_path() . PATH_SEPARATOR . $app->getLibPath('wfw'));

require_once("php/templates/cHTMLTemplate.php");
require_once("php/templates/xml_template.php");

?>
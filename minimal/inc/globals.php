<?php

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../")); //racine du site

include("model/Application.php");

//instancie l'application
global $app;
$app = new Application(ROOT_PATH);

?>
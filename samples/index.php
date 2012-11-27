<?php
require_once("inc/globals.php");
global $app;

//print_r($app);

// exemples JS
if(isset($_REQUEST["page"])){
    $app->showXMLView("view/pages/".$_REQUEST["page"].".html",NULL,array());
    exit;
}

// accueil
$app->showXMLView("view/pages/index.html",NULL,array());

?>
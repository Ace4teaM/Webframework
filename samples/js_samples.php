<?php
require_once("inc/globals.php");
global $app;

//print_r($app);

// exemples JS
if(isset($_REQUEST["sample"])){
    $app->showXMLView("view/js_samples/".$_REQUEST["sample"].".html",NULL,array());
    exit;
}

// accueil
$app->showXMLView("view/js_samples/index.html",NULL,array());

?>
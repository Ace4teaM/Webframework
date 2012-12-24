<?php
require_once("inc/globals.php");
global $app;

//print_r($app);

// exemples JS
if(cInputFields::checkArray(array("sample"=>"cInputIdentifier")))
{
    $app->showXMLView("view/js_samples/".$_REQUEST["sample"].".html",array());
    exit;
}

// accueil
$app->showXMLView("view/js_samples/index.html",array());

?>
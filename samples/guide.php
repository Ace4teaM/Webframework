<?php
require_once("inc/globals.php");
global $app;

//print_r($app);

// page
if(cInputFields::checkArray(array("page"=>"cInputIdentifier")))
{
    //arguments 
    $param = array();
    //construit le template
    $app->showXMLView("view/guides/".$_REQUEST["page"].".html",$param);
    exit;
}

//construit le template d'accueil
$app->showXMLView("view/guides/index.html",array());

?>
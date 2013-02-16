<?php
require_once("inc/globals.php");
global $app;

//print_r($app);

// page
if(cInputFields::checkArray(array("page"=>"cInputIdentifier")))
{
    //arguments 
    $param = array();
    switch($_REQUEST["page"]){
        case "licence":
            //mon age depuis ma naissance
            date_default_timezone_set('Europe/Paris');
            $begin = mktime(3, 0, 0, 25, 12, 1983);
            $end = date(DATE_RFC822);
            $param["age"] = "28";
            break;
    }
    //construit le template
    $app->showXMLView("view/pages/".$_REQUEST["page"].".html",$param);
    exit;
}

//construit le template d'accueil
$app->showXMLView("view/pages/index.html",array());

?>
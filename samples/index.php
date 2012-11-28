<?php
require_once("inc/globals.php");
global $app;

//print_r($app);

// exemples JS
if(isset($_REQUEST["page"])){
    $param = array();
    switch($_REQUEST["page"]){
        case "licence":
            //mon age depuis ma naissance
            date_default_timezone_set('France/Paris');
            $begin = mktime(3, 0, 0, 25, 12, 1983);
            $end = date(DATE_RFC822);
            $param["age"] = "28";
            break;
    }
    $app->showXMLView("view/pages/".$_REQUEST["page"].".html",NULL,$param);
    exit;
}

// accueil
$app->showXMLView("view/pages/index.html",NULL,array());

?>
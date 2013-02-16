<?php
require_once("inc/globals.php");
global $app;

//si la reference n'est pas definit, retour à l'index des fonctions
if(!cInputFields::checkArray(array("ref"=>"cInputIdentifier"))){
    header("Location: doxy_index.php");
    exit;
}

//
$ref = $_REQUEST["ref"];
$cache_file = "view/tmp/$ref.html";

//------------------------------------------------------------------
//fabrique le template intermediaire
//------------------------------------------------------------------
$file = substr($ref, 0, strrpos($ref,'_'));
$template = new cXMLTemplate();

//charge le contenu en selection
$select = new XMLDocument("1.0", "utf-8");
$select->load($app->getRootPath()."/".$app->getCfgValue("path","php_api_doc")."/$file.xml");
$attributes = array("id" => $ref);

//transforme le fichier
if(!$template->Initialise(
            $app->getRootPath().'/view/doxy_function.html',
            NULL,
            $select,
            NULL,
            $attributes ) )
    $app->processLastError();

file_put_contents($app->getRootPath().'/'.$cache_file, $template->Make());

//------------------------------------------------------------------
//fabrique la vue
//------------------------------------------------------------------

$app->showXMLView($cache_file,array());

?>
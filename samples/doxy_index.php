<?php
require_once("inc/globals.php");
global $app;

$cache_file = "view/tmp/doxy_index.html";
//------------------------------------------------------------------
//fabrique le template intermediaire
//------------------------------------------------------------------

$template = new cXMLTemplate();

//charge le contenu en selection
$select = new XMLDocument("1.0", "utf-8");

$select->load($app->getRootPath()."/".$app->getCfgValue("path","php_api_doc")."/index.xml");
$attributes = array();

//transforme le fichier
if(!$template->Initialise(
        $app->getRootPath().'/view/doxyindex.html',
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
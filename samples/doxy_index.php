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
$select->load($app->root_path."/../doc/php/xml/index.xml");
$attributes = array();

//ajoute le fichier de configuration
//$template->load_xml_file("default.xml',$this->root_path);

//transforme le fichier
if(!$template->Initialise(
            $app->root_path.'/view/doxyindex.html',
            NULL,
            $select,
            NULL,
            array_merge($attributes,$app->template_attributes) ) )
        return false;

file_put_contents($app->root_path.'/'.$cache_file, $template->Make());

//------------------------------------------------------------------
//fabrique la vue
//------------------------------------------------------------------

$app->showXMLView($cache_file,array());

?>
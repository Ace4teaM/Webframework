<?php
require_once("inc/globals.php");
global $app;

$ref = $_REQUEST["ref"];
$cache_file = "view/tmp/$ref.html";

//------------------------------------------------------------------
//fabrique le template intermediaire
//------------------------------------------------------------------
$file = substr($ref, 0, strrpos($ref,'_'));
$template = new cXMLTemplate();

//charge le contenu en selection
$select = new XMLDocument("1.0", "utf-8");
$select->load($app->root_path."/../doc/php/xml/$file.xml");
$attributes = array("id" => $ref);

//ajoute le fichier de configuration
//$template->load_xml_file("default.xml',$this->root_path);

//transforme le fichier
if(!$template->Initialise(
            $app->root_path.'/view/doxy_function.html',
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
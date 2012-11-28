<?php
require_once("inc/globals.php");
global $app;

    $template = new cXMLTemplate();
    $filename = "view/pages/template.html";
    $attributes = array();
    
    //charge le contenu en selection
    $select = new XMLDocument("1.0", "utf-8");
    $select->load($app->root_path.'/view/pages/test.html');

    //charge le fichier de configuration
    $template->load_xml_file('default.xml',$app->root_path);

    //initialise la classe template 
    if(!$template->Initialise(
                $app->root_path.'/'.$filename,
                NULL,
                $select,
                NULL,
                array_merge($attributes,$app->template_attributes) ) )
            return false;

    //transforme le fichier
    echo $template->Make();
?>
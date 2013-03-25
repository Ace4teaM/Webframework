<?php

//inclue le model de l'application
require_once("php/class/bases/cApplication.php");


class Application extends cApplication
{
    function makeFooterTemplate($select,$att)
    {
        //charge le contenu en selection
        $doc = new XMLDocument("1.0", "utf-8");
        $content = file_get_contents("css/footer/footer.html");
        $content = str_replace('images/', 'css/footer/images/', $content);//fix images path
        $doc->loadHTML($content);

        //initialise le template 
        $template = new cXMLTemplate();
        
        //ajoute le fichier de configuration
        $template->load_xml_file('default.xml', $this->getRootPath());
        //if($this->getDefaultFile($default))
        //    $template->push_xml_file('default.xml', $default);
        
        if (!$template->Initialise( $doc, NULL, $select, NULL, $att ))
            return false;

        //sortie
        $template->Make();
        
        return $doc;
    }
    
    function makeHeaderTemplate($select,$att)
    {
        //charge le contenu en selection
        $doc = new XMLDocument("1.0", "utf-8");
        $content = file_get_contents("css/header/header.html");
        $content = str_replace('images/', 'css/header/images/', $content);//fix images path
        $doc->loadHTML($content);

        //initialise le template 
        $template = new cXMLTemplate();
        
        //ajoute le fichier de configuration
        $template->load_xml_file('default.xml', $this->getRootPath());
        //if($this->getDefaultFile($default))
        //    $template->push_xml_file('default.xml', $default);
        
        if (!$template->Initialise( $doc, NULL, $select, NULL, $att ))
            return false;

        //sortie
        $template->Make();
        
        return $doc;
    }
    
    function onMakeXMLTemplate(&$template,&$select,&$attributes)
    {
        //ajoute le template Header
        $template->push_xml_file('header.xml',$this->makeHeaderTemplate($select,$attributes));
        $template->push_xml_file('footer.xml',$this->makeFooterTemplate($select,$attributes));
    }
    
    
}

?>

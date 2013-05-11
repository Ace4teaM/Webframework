<?php

//inclue le model de l'application
require_once("class/bases/cApplication.php");


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
    
    /**
     * Initialise un template avec le contenu d'un chapitre
     * @param type $chapter Nom de l'ancre identifiant le titre du chapitre
     * @param type $select
     * @param type $att
     * @return boolean|\XMLDocument
     */
    function makeGuideTemplate($filename,$chapter,$select,$att)
    {
        $path = dirname ($filename);
        
        //charge le contenu en selection
        $doc = new XMLDocument("1.0", "utf-8");
        $content = file_get_contents($filename);
        if($content === FALSE)
            return RESULT(cResult::Failed,cApplication::ResourceNotFound,array("message"=>true,"FILE"=>$filename));
        $content = str_replace('src="', "src=\"$path/", $content);//fix images path
        if($doc->loadHTML($content) === FALSE)
            return RESULT(cResult::Failed,XMLDocument::loadHTML);
        $body = $doc->one("body");
        
        //obtient le titre de l"ancre
        $anchor = $doc->one("a[name=$chapter]");
        if(is_null($anchor)){
            //echo("chapter not found (a[name=$chapter])");
            return RESULT(cResult::Failed,"CHAPTER_NOT_FOUND");
        }
        $title = $anchor->parentNode;
        $parent = $title->parentNode;

        //
        // initialise le contenu
        //
        
        //supprime les noeuds precedents
        while($node = $title->previousSibling){
            $parent->removeChild($node);
        }
        
        //recheche le titre suivant
        $node = $title->nextSibling;
        while($node){
            if($node->nodeType == XML_ELEMENT_NODE && $node->tagName == $title->tagName)
                break;
            $node = $node->nextSibling;
        }
        
        //supprime les noeuds restants
        while($node){
            $next = $node->nextSibling;
            $parent->removeChild($node);
            $node = $next;
        }
        
        //
        // initialise le sommaire
        //
        $toc = $doc->createElement('div');
        $toc->setAttribute('id','toc');
        $toc->appendChild($doc->createTextElement('label','Sommaire'));
        $toc->appendChild($doc->createElement('hr'));
        $node = $title->nextSibling;
        $header_level = intval(substr($title->tagName,1));

        $cnt = 0;
        while($node){
            if($node->nodeType == XML_ELEMENT_NODE && $node->tagName == $title->tagName)
                break;
            if($node->nodeType == XML_ELEMENT_NODE && $node->tagName == "h".($header_level+1)){
                $link = $doc->createTextElement('a',$node->nodeValue);
                $link->setAttribute("href","#title_$cnt");
                $toc->appendChild($link);
                $anchor = $doc->createElement('a');
                $anchor->setAttribute("name","title_$cnt");
                $doc->prependNode($anchor,$node);
                $cnt++;
            }
            $node = $node->nextSibling;
        }
        $doc->prependNode($toc,$body);
        
        //
        // transforme le template
        // 

        //initialise le template 
        $template = new cXMLTemplate();
        
        //ajoute le fichier de configuration
        $template->load_xml_file('default.xml', $this->getRootPath());
        
        if (!$template->Initialise( $doc, NULL, $select, NULL, $att ))
            return false;

        //sortie
        $template->Make();
        
        RESULT_OK();
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

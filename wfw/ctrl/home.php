<?php
/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2013 Thomas AUGUEY <contact@aceteam.org>
    ---------------------------------------------------------------------------------------------------------------------------------------
    This file is part of WebFrameWork.

    WebFrameWork is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WebFrameWork is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WebFrameWork.  If not, see <http://www.gnu.org/licenses/>.
    ---------------------------------------------------------------------------------------------------------------------------------------
*/

/*
  Affiche la page d'accueil
  
  Role : Tous
  UC   : Home
  Module : wfw
  Output : "text/html"
 */

class wfw_home_ctrl extends cApplicationCtrl
{
    // required fields
    // public $fields    = array("filed_name",...);
    
    // optional fields
    // public $op_fields = array("filed_name",...);

    // others data
    //protected $data = null;
    
    function __construct()
    {
        // super call
        parent::__construct();
    }
    
    function main(iApplication $app, $app_path, $p) {

        // liste les controleurs
        /*if($app->getDefaultFile($defaultDoc)){
            $this->ctrlList = array();
            $pagesNodes = $defaultDoc->doc->all("index page[id]");
            foreach($pagesNodes as $node){
                print_r($node);
                if($node)
            }
            exit;
        }*/

        return RESULT_OK();
    }
    
    function output(iApplication $app, $format, $att, $result)
    {
        switch($format)
        {
            // HTML output
            case "text/html":
                // make from main template
                $home_page = $app->getCfgValue ("application", "home_page");
                $template_file = $app->getCfgValue ("application", "config_template");
                $att["system"] = ucwords(strtolower(constant("SYSTEM")));
                $template = $app->createXMLView($home_page,$att,$template_file);
                if(!$template)
                    return false;
                
                // ajoute les données de la configuration
                $doc = new XMLDocument();
                $doc->appendChild($doc->createElement("data"));
                foreach($app->getCfg() as $key=>$section){
                    $sectionNode = $doc->createElement($key);
                    $doc->documentElement->appendChild($sectionNode);
                    $doc->appendAssocArray($sectionNode,$section);
                }
                $template->push_xml_file('config.xml', $doc);

                //sortie
                return $template->Make();
        }
        
        // return result if possible
        return parent::output($app, $format, $att, $result);
    }
};

?>
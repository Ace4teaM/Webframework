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
 * Affiche la page d'accueil
 * Rôle : All
 * UC   : home
 */

class application_home_ctrl extends cApplicationCtrl
{
    // required fields
    // public $fields    = array("filed_name",...);
    
    // optional fields
    // public $op_fields = array("filed_name",...);

    // others data
    // [put your data here]
    
    function Ctrl()
    {
        // super call
        parent::__construct();
        
        // this, add cookies to entry fields 
        // $this->att = array_merge($this->att,$_COOKIE);
        
        // initalize...
        // [add your initialization code here]
    }
    
    function main(iApplication $app, $app_path, $p) {

        // [add your execution code here]

        return true;
    }
    
    function output(iApplication $app, $format, $att, $result)
    {
        switch($format)
        {
            // HTML output
            case "text/html":
                // make from main template
                $att["system"] = ucwords(strtolower(constant("SYSTEM")));
                $template = $app->createXMLView("view/pages/index.html",$att);
                if(!$template)
                    return false;
                
                // add your own data
                // $template->push_xml_file('my_resource.xml', $this->my_resource_xml);

                //sortie
                return $template->Make();
        }
        
        // return result if possible
        return parent::output($app, $format, $att, $result);
    }
};

?>
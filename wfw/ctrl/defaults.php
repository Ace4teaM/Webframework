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

/**
 * @page defaults Fusionne les fichiers defaults de tous les modules puis affiche le contenu
 * 
 */
class Ctrl extends cApplicationCtrl{
    public $fields    = null;
    public $op_fields = null;
//    public $role      = Role::Administrator;

    function main(iApplication $app, $app_path, $p)
    {
        // Initialise le document de sortie
        $out = new XMLDocument("1.0", "utf-8");
        if(!$out->load("default.xml"))
            return false;
        
        foreach($app->getCfgSection("defaults") as $key=>$filename){
            // Initialise le document de sortie
            $in = new XMLDocument("1.0", "utf-8");
            if(!$in->load($filename))
                return false;

            //pages
        
            //results
            foreach($in->all(">results") as $key=>$node){
                $lang = $node->getAttribute("lang");
                
                // si il n'existe pas, clone
                $out_node  = $out->one(">results[lang=$lang]");
                if($out_node == null){
                    $out->documentElement->appendChild( $out->importNode($node,TRUE) );
                    continue;
                }
                
                //fusionne le restant
                XMLDocument::mergeNodesByTagName($in, $out, $node, $out_node);
            }
        }

        //sortie XML
        header("content-type: text/xml");
        echo '<?xml version="1.0" encoding="UTF-8" ?>' . $out->saveXML($out->documentElement);

        //termine ici
        exit(0);
    }
}

?>
<?php

/*
  ---------------------------------------------------------------------------------------------------------------------------------------
  (C)2012-2013 Thomas AUGUEY <contact@aceteam.org>
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
  Configuration

  Role : Tous
  UC: config
  Module: wfw
  Remarque: Retourne les champs de configuration
 */

class wfw_config_ctrl extends cApplicationCtrl{
    public $fields    = null;
    public $op_fields = null;
    
    protected $doc = null;

    function getXML() {
        return $this->doc;
    }
    
    /*function acceptedRole(){
        return cApplication::AdminRole;
    }*/

    function main(iApplication $app, $app_path, $p) {
        // Initialise le document de sortie
        $doc = new XMLDocument("1.0", "utf-8");
        $rootEl = $doc->createElement('data');
        $doc->appendChild($rootEl);

        $def=null;
        $app->getDefaultFile($def);

        //types et ids
        foreach ($app->getCfg() as $section => $values) {
            $node = $doc->createElement($section);
            foreach ($values as $id => $value) {
                $node->appendChild($doc->createTextElement(strtolower($id), $value));
            }
            $rootEl->appendChild($node);
        }

        //termine ici
        $this->doc = $doc;
        return RESULT_OK();
    }
    
    // output
    function output(iApplication $app, $format, $att, $result)
    {
        if(!$result->isOk())
            return parent::output($app, $format, $att, $result);

        switch($format){
            case "text/xml":
                return '<?xml version="1.0" encoding="UTF-8" ?>' . $this->doc->saveXML($this->doc->documentElement);
        }
        return parent::output($app, $format, $att, $result);
    }
};

?>
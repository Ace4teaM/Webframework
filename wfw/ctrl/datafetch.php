<?php

/*
  ---------------------------------------------------------------------------------------------------------------------------------------
  (C)2013,2015 Thomas AUGUEY <contact@aceteam.org>
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
  Retourne les données d'une table
  
  Role : Tous
  UC   : DataFetch
  Module : wfw
  Output : "text/xml"
 
  Champs:
    table_name : Nom de la table SQL

  Champs complémentaires:
    cols_names : Nom des colonnes séparé par des virgules
    row_offset : Index de la première entrée retournée
    row_count  : Nombre d'entrées retournées
 */
class wfw_datafetch_ctrl extends cApplicationCtrl{
    public $fields    = array('table_name');
    public $op_fields = array('cols_names','row_offset','row_count');

    protected $doc = null;

    function acceptedRole(){
        return cApplication::AdminRole;
    }

    function main(iApplication $app, $app_path, $p) {
        $lang = "fr";
        
        if(!$app->getDB($db))
            return false;
        
        if(!$p->row_offset)
            $p->row_offset = 0;
        
        if(!$p->row_count)
            $p->row_count = 9999;

        // Initialise le document de sortie
        $doc = new XMLDocument("1.0", "utf-8");
        $rootEl = $doc->createElement('data');
        $doc->appendChild($rootEl);

        //initialise la requete SQL
        if(!$p->cols_names)
            $p->cols_names = "*";
        $query = "SELECT $p->cols_names FROM $p->table_name";

        //execute la requete
        if(!$db->execute($query, $result))
            return false;
        
        //offset
        if(!$result->seek($p->row_offset,iDatabaseQuery::Origin))
            return false;
        
        //extrait les instances
        $i=0;
        while( $p->row_count-- ){
            $el = $doc->createElement(strtolower($p->table_name));
            $doc->appendAssocArray($el, $result->fetchRow());
            $rootEl->appendChild($el);
            if(!$result->seek(1,iDatabaseQuery::Current))
                break;
        }

        //sortie XML
        $this->doc = $doc;
        return RESULT_OK();
    }
    
    function output(iApplication $app, $format, $att, $result) {
        if($result->isOk())
        {
            switch($format){
                case "text/xml":
                    return '<?xml version="1.0" encoding="UTF-8" ?>' . $this->doc->saveXML($this->doc->documentElement);
            }
        }
        return parent::output($app, $format, $att, $result);
    }
}

?>
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
 * @page datafetch Extrait des données d'une table
 * 
 * # Retourne les données d'une table
 * 
 * | Informations |                          |
 * |--------------|--------------------------|
 * | PageId       | -
 * | Rôle         | Administrateur
 * | UC           | datafetch
 * 
 */
class Ctrl extends cApplicationCtrl{
    public $fields    = array('table_name');
    public $op_fields = array('cols_names','row_offset','row_count');
//    public $role      = Role::Administrator;

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
        header("content-type: text/xml");
        echo '<?xml version="1.0" encoding="UTF-8" ?>' . $doc->saveXML($doc->documentElement);

        //termine ici
        exit(0);
    }
}

?>
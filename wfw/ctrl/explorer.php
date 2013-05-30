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

/**
 * @page wfw_explorer_ctrl File explorer
 * 
 * # Explore le disque de données
 * 
 * | Informations |                          |
 * |--------------|--------------------------|
 * | PageId       | -
 * | Rôle         | Administrateur
 * | UC           | explorer
 * 
 * @param path Chemin d'accès à explorer
 */
class wfw_explorer_ctrl extends cApplicationCtrl {
    
    public $fields    = array("path");
    public $op_fields = null;
    
    public $dirArray = null;
    
    function acceptedRole(){
        return cApplication::AdminRole;
    }

    function main(iApplication $app, $app_path, $p) {
        // open this directory 
        $myDirectory = opendir($p->path);
        $dirArray = array();
        
        // get each entry
        while ($entryName = readdir($myDirectory)) {
            $dirArray[] = $entryName;
        }

        // close directory
        closedir($myDirectory);

        // sort 'em
        sort($dirArray);
        
        $this->dirArray = $dirArray;
        
        return RESULT_OK();
    }

    function showHTML($dirArray) {
        $content = "";
        //	count elements in array
        $indexCount = count($dirArray);
        $content .= ("$indexCount files<br>\n");

        // print 'em
        $content .= ("<TABLE border=1 cellpadding=5 cellspacing=0 class=whitelinks>\n");
        $content .= ("<TR><TH>Filename</TH><th>Filetype</th><th>Filesize</th></TR>\n");
        // loop through the array of files and print them all
        for ($index = 0; $index < $indexCount; $index++) {
            if (substr("$dirArray[$index]", 0, 1) != ".") { // don't list hidden files
                $content .= ("<TR><TD><a href=\"$dirArray[$index]\">$dirArray[$index]</a></td>");
                $content .= ("<td>");
                $content .= (@filetype($dirArray[$index]));
                $content .= ("</td>");
                $content .= ("<td>");
                $content .= (@filesize($dirArray[$index]));
                $content .= ("</td>");
                $content .= ("</TR>\n");
            }
        }
        $content .= ("</TABLE>\n");

        return $content;
    }

    function output(iApplication $app, $format, $att, $result) {
        if(!$result->isOk())
            return parent::output($app, $format, $att, $result);

        switch ($format) {
            case "text/html":
                return $this->showHTML($this->dirArray);
        }
        
        return parent::output($app, $format, $att, $result);
    }

}

?>
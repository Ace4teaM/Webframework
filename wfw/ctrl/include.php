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
  Concaténe le contenu de plusieurs scripts d'inclusion
 
  Role   : Tous
  UC     : Include
  Module : wfw
  Output : "text/javascript", "text/css"
 
  Champs:
    script_type  : Type de script. Une des valeurs suivants: "jquery", "yui", "extjs", "bootstrap", "javascript"
 
 */

class wfw_include_ctrl extends cApplicationCtrl{
    
    public $op_fields = array('script_type');
    
    public $filelist = array();

    function main(iApplication $app, $app_path, $p) {
        
        switch($p->script_type){
            case "jquery":
            case "yui":
            case "extjs":
            case "bootstrap":
                break;
            case "javascript":
            default:
                $p->script_type  = "javascript";
                break;
        }

        //scripts additionnels
        $scripts = $app->getCfgSection($p->script_type);
        if($scripts){
            foreach($scripts as $key=>$path){
                $dir = resolve_path($path);
                if(is_dir($dir)){
                    if($dh = opendir($dir)){
                        while (($file = readdir($dh)) !== false) {
                            if($file == '.' || $file=='..')
                                continue;
                            $ext = file_ext($file);
                            if(!isset($this->filelist[$ext]))
                                $this->filelist[$ext] = array();
                            
                            array_push($this->filelist[$ext],path($dir,$file));
                        }
                        closedir($dh);
                    }
                }
                else{
                    $ext = file_ext($path);
                    if(!isset($this->filelist[$ext]))
                        $this->filelist[$ext] = array();

                    array_push($this->filelist[$ext],$path);
                }
            }
        }

        return RESULT_OK();
    }
    
    function output(iApplication $app, $format, $att, $result)
    {
        switch($format){
            case "text/javascript":
                $text = "";
                foreach($this->filelist["js"] as $key=>$path){
                    $text .= file_get_contents($path)."\n";
                }
                //concaténe les fichiers
                return $text;
                
            case "text/css":
                $text = "";
                foreach($this->filelist["css"] as $key=>$path){
                    $text .= file_get_contents($path)."\n";
                }
                //concaténe les fichiers
                return $text;
        }
        return parent::output($app, $format, $att, $result);
    }
};
?>
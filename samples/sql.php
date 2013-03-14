/*
    Generated File
*/

<?php
include("../wfw/php/file.php");
header("content-type: text/plain; charset=utf-8");
if(isset($_REQUEST["dir_names"]))
{
    //
    // Recherche les fichiers de configuration
    //
    $files = array("init"=>array(),"tables"=>array(),"func"=>array(),"jeu_essai"=>array());
    $dirs = explode(";", $_REQUEST["dir_names"]);
    $base_path="../../";
    foreach($dirs as $key=>$dir){
        if(@filetype($base_path . $dir)=='dir'){
            $file=array();
            file_search($base_path.$dir,"/^.*\.sql$/i",'file','/^\w+[\.\-\w]*$/i',$file);
            print_r($file);
        }
    }
    
    //
    // Recherche les fichiers de configuration
    //
}
else echo ("please specify <dir_names> URL attributes");
?>
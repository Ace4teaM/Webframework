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
    $ini_files = array();
    $dirs = explode(";", $_REQUEST["dir_names"]);
    $filename="config.ini";
    $base_path="../../";
    foreach($dirs as $key=>$dir){
        if(@filetype($base_path . $dir)=='dir'){
            $file=file_find($base_path.$dir,"config.ini",'/^\w+[\.\-\w]*$/i');
            if(@filetype($file)=='file'){
                $config = parse_ini_file($file, true);
                $config = array_change_key_case($config, CASE_UPPER);
                if(isset($config["SQL_PATH"])){
                    $ini_files[$file] = array_change_key_case($config["SQL_PATH"], CASE_UPPER);
                }
                echo $file."\n";
            }
        }
    }
    
    //
    // Exporte les fichiers
    //
    foreach($ini_files as $file=>$cfg){
        if(isset($cfg["TABLES"])){
            echo("/* ********************************************************************************************* */\n");
            echo("/* INCLUDE FROM $sql_file */\n");
            echo("/* ********************************************************************************************* */\n");
            echo(file_get_contents($cfg["TABLES"])."\n\n");
        }
    }
}
else echo ("please specify <dir_names> URL attributes");
?>
<?php

/*
	(C)2010-2011 ID-INFORMATIK - WebFrameWork(R)
	Retourne la liste des fichiers RSS
  
	Arguments:
		Aucun
    
	Retourne:        
		id        : Identificateurs, separes par des points virgules ';'
		size      : Tailles en bytes des fichiers, separes par des points virgules ';'
		result    : resultat de la requete.
		info      : details sur l'erreur en cas d'echec.
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');
include('path.php');

//
//globales
//        
$file_dir = RSS_DATA_PATH."/";

    
$size = ""; 
$id = "";   

//
if(is_dir($file_dir)) {
    if($dh = opendir($file_dir)) {
        while (($file = readdir($dh)) !== false)
        {
			if(filetype($file_dir.$file)=='file' && file_ext($file)=="xml"){
            $id   .= $file.";";
            $size .= filesize($file_dir.$file).";";
          }
        }
        closedir($dh);
    }
}
          
rpost("id",$id);
rpost("size",$size);
               
//
rpost_result(ERR_OK);
?>

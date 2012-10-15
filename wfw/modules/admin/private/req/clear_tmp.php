<?php

/*
  (C)2010 WebFrameWork 1.3
  Efface les fichiers temporaires
  
  Arguments:
    [int] time_limit : Temps limite d'existance en milliseconde
    
  Retourne:        
    result    : resultat de la requete.
    info      : details sur l'erreur en cas d'echec.
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

//
//globales
//        
$file_dir = ROOT_PATH."/tmp/";
$lifetime = 60*60;//sec (1H)
$time = intval(time());//temps en cours en secondes

//scan les fichier et supprime ceux dont la durée de vie à dépassé
if(is_dir($file_dir)) {
	if($dh = opendir($file_dir)) { 
		while (($file = readdir($dh)) !== false)
		{
			switch(filetype($file_dir.$file)){
				case "link":
				case "file":
					$last_modtime = intval(filemtime( $file_dir.$file ));
					if(($time-$last_modtime) >= $lifetime)
						unlink($file_dir.$file);
					break;
			}
		}
		closedir($dh);
	}
}
              
//
rpost_result(ERR_OK);
?>
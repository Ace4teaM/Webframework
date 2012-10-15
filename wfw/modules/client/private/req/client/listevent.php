<?php

/*
	(C)2012 ID-INFORMATIK. WebFrameWork(R)
	Retourne la liste des dossiers clients attaché à un événement
  
	Arguments:
		Aucun
    
	Retourne:        
		id        : Identificateurs, separés par des points virgules ';'
		name      : Noms des fichiers, separés par des points virgules ';'
		type      : Types de dossiers, separés par des points virgules ';'
		size      : Tailles en bytes des fichiers, separés par des points virgules ';'
		date      : Date de création des dossiers (format lisible), separés par des points virgules ';'
		time      : Date de création des dossiers (format timstamp UNIX), separés par des points virgules ';'
		result    : résultat de la requête.
		info      : details sur l'erreur en cas d'échec.
	
	Revisions
		[08-12-2011] Update, ROOT_PATH
		[09-01-2012] Update
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

include(ROOT_PATH.'/req/client/path.inc');
include(ROOT_PATH.'/req/client/client.inc');


//
// Prepare la requete pour repondre a un formulaire
//
  
useFormRequest();
 

//
//globales
//        

    
$files = "";
$types = "";
$sizes = ""; 
$ids = "";   
$dates = ""; 
$times = "";

//
if(is_dir(CLIENT_EVENT_PATH)) {
	if($dh = opendir(CLIENT_EVENT_PATH)) {
		while (($file = readdir($dh)) !== false) {
			$filename = CLIENT_EVENT_PATH."/".$file;
			if(filetype($filename)=='link'){  
				$client_id = basename(readlink($filename));
				$doc = new XMLDocument();
				if(@$doc->load($filename)){ 
					$ids .= $doc->getNodeValue("data/wfw_id").";";     
					$types .= $doc->getNodeValue("data/wfw_type").";"; 
					$files .= $file.";";
					$sizes .= filesize($filename).";";      
					$dates .= $doc->getNodeValue("data/wfw_date").";";
					$times .= $doc->getNodeValue("data/wfw_timestamp").";";
				}
			}
		}
		closedir($dh);
	}
}
          
rpost("id",$ids);
rpost("name",$files);
rpost("type",$types);
rpost("size",$sizes);
rpost("date",$dates); 
rpost("time",$times);
               
//
rpost_result(ERR_OK);
?>

<?php

/*
	(C)2010-2012 ID-INFORMATIK. WebFrameWork(R)
	Retourne la liste des dossiers clients
  
	Arguments:
		[...]     : Champs additionnels à obtenir pour chaque dossier
    
	Retourne:        
		id          : Identificateurs, separés par des points virgules ';'
		name        : Noms des fichiers, separés par des points virgules ';'
		type        : Types de dossiers, separés par des points virgules ';'
		size        : Tailles en bytes des fichiers, separés par des points virgules ';'
		date        : Date de création des dossiers (format lisible), separés par des points virgules ';'
		time        : Date de création des dossiers (format timstamp UNIX), separés par des points virgules ';'
		public_link : Liens de données public actif ?, separés par des points virgules ';'
		event_link  : Liens d'événement actif ?, separés par des points virgules ';'
		result      : Résultat de la requête.
		info        : Details sur l'erreur en cas d'échec.public_link
		warning     : dossiers corrompus ou de format invalide,  separés par des points virgules ';'
		[...]       : Autres champs obtenu, separés par des points virgules ';'
	
	Revisions
		[08-12-2011] Update, ROOT_PATH
		[09-01-2012] Update
		[21-02-2012] Update, Previent le listage de fichier invalide
		[27-02-2012] Update, Accepte des arguments supplémentaires en retour
		[27-02-2012] Update, Retourne les états du dossier (données public, événement)
		[29-03-2012] Update, Retourne l'argument warning avec les dossiers invalides
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
$file_dir = CLIENT_DATA_PATH."/";

    
$files = "";
$types = "";
$sizes = ""; 
$ids = "";   
$dates = ""; 
$times = "";
$public_links = "";
$event_links = "";
$warning = "";//dossiers corrompus

//liste les champs additionnels
$private_field=array();
foreach($_REQUEST as $item=>$item_value){
	//verifie l'identificateur
	if(cInputIdentifier::isValid($item))
		$private_field[$item]="";
}

//
if(is_dir($file_dir)) {
	if($dh = opendir($file_dir)) {
		while (($file = readdir($dh)) !== false) {
			if(filetype($file_dir.$file)=='file'){  
				$doc = new XMLDocument();
				if(@$doc->load($file_dir.$file)){
					//ajoute les infos
					$id   = $doc->getNodeValue("data/wfw_id");     
					$type = $doc->getNodeValue("data/wfw_type"); 
					$size = filesize($file_dir.$file);      
					$date = $doc->getNodeValue("data/wfw_date");
					$time = $doc->getNodeValue("data/wfw_timestamp");
					$public_link = (file_exists(CLIENT_PUBLIC_PATH."/$id") ? "true" : "false");
					$event_link = (file_exists(CLIENT_EVENT_PATH."/$id") ? "true" : "false");
					if(!empty($file) && !empty($id) && !empty($type) && !empty($size) && !empty($date) && !empty($time)){
						$files .= $file.";";
						$ids   .= $id.";";
						$types .= $type.";"; 
						$sizes .= $size.";";      
						$dates .= $date.";";
						$times .= $time.";";
						$public_links .= $public_link.";";
						$event_links .= $event_link.";";
						//liste les champs additionnels
						foreach($private_field as $item=>$item_value){
							//obtient la valeur   
							$value = $doc->getNodeValue("data/$item");
							//add
							$private_field[$item] .= (!is_string($value) ? ("") : (str_replace(";","",$value))).";";
						}
					}
				}
				else{
					$warning .= "$file;";
				}
			}
		}
		closedir($dh);
	}
}

//retourne
rpost("id",$ids);
rpost("name",$files);
rpost("type",$types);
rpost("size",$sizes);
rpost("date",$dates);
rpost("time",$times);
rpost("public_link",$public_links);
rpost("event_link",$event_links);
foreach($private_field as $i=>$v)
	rpost($i,$v);
if(!empty($warning))
	rpost("warning",$warning);
//
rpost_result(ERR_OK);
?>

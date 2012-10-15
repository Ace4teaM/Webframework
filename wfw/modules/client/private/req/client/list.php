<?php

/*
  (C)2010 WebFrameWork 1.3
  Liste les fichiers disponnibles d'un dossier

  Arguments:
		[Name]       wfw_id     : Identificateur du dossier à vérfier
    
  Retourne:         
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec
    name       : Noms des fichiers separes par des points virgules   
    type       : Types MIME des fichiers separes par des points virgules
    size       : Tailles des fichiers en bytes separes par des points virgules
	
  Revisions
	[08-12-2011] Update, ROOT_PATH
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
  
//useFormRequest();
 
//
//verifie les champs obligatoires
//
rcheck(
  //requis
	array('wfw_id'=>'cInputName'),
  //optionnels
  null
);

//
//globales
//     
$id  = $_REQUEST["wfw_id"];
$file_name = CLIENT_DATA_PATH."/$id.xml";  
$file_dir = CLIENT_DATA_PATH."/$id";
$file_path = CLIENT_DATA_DIR."/$id";
 
$files = "";
$types = "";
$sizes = "";
  
//
// liste les fichiers 
//
if(is_dir($file_dir)) {
	if($dh = opendir($file_dir)) {
		while (($file = readdir($dh)) !== false) {
			if(filetype("$file_dir/$file")=='file'){
				$files .= $file.";";
				$types .= mime_content_type("$file_dir/$file").";";
				$sizes .= filesize("$file_dir/$file").";";
			}
		}
		closedir($dh);
	}
}

rpost("name",$files);
rpost("type",$types);
rpost("size",$sizes);
rpost("path",$file_path);
               
//
rpost_result(ERR_OK);
?>

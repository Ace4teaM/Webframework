<?php

/*
	(C)2010-2011 ID-INFORMATIK. WebFrameWork(R)
	Liste les fichiers disponnibles d'un dossier

	Arguments:
		[Name]         wfw_id     : Identificateur du dossier à vérfier
		[Password]     [wfw_pwd]  : mot de passe du dossier 
    
	Retourne:         
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec
		name       : Noms des fichiers separes par des points virgules   
		type       : Types MIME des fichiers separes par des points virgules
		size       : Tailles des fichiers en bytes separes par des points virgules
	
	Revisions:
		[13-12-2011] Update, ROOT_PATH
		[09-01-2012] Update
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../")); //racine du site
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
	array('wfw_pwd'=>'cInputPassword')
);

//
//globales
//     
$id  = $_REQUEST["wfw_id"];
$pwd = isset($_REQUEST["wfw_pwd"])?$_REQUEST["wfw_pwd"]:"";    
$file_name = CLIENT_DATA_PATH."/$id.xml";
$file_dir = CLIENT_DATA_PATH."/$id/";

//
// charge le fichier xml
//
$doc = clientOpen($id);
  
//
// verifie le mot de passe
//
clientCheckPassword($doc,$pwd);
    
$files = "";
$types = "";
$sizes = "";
  
//
// liste les fichiers 
//
if(is_dir($file_dir)) {
    if($dh = opendir($file_dir)) {
        while (($file = readdir($dh)) !== false) {
            if(filetype($file_dir.$file)=='file'){
              $files .= $file.";";
              $types .= mime_content_type($file_dir.$file).";";
              $sizes .= filesize($file_dir.$file).";";
            }
        }
        closedir($dh);
    }
}

rpost("name",$files);
rpost("type",$types);
rpost("size",$sizes);
               
//
rpost_result(ERR_OK);
?>

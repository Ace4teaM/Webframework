<?php

/*
  (C)2010-2011 WebFrameWork 1.3
  Debute le stockage d'un fichier

  Arguments:
    wfw_id    : identificateur du dossier.  
    size      : taille du fichier
    
  Retourne:         
    token      : jeton de l'upload
    result     : resultat de la requete.
    info       : details sur l'erreur en cas d'echec.
	
  Remarques:
	beginUpload crer un fichier temporaire de la taille demandé dans le dossier.
	Les fragments de fichiers sont ensuite envoyés à la requête packetUpload qui va écrire le fichier.

  Revisions:
	[29-12-2011] Implentation
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
// Prepare la requete pour repondre à un formulaire
//

useFormRequest();                         

//
//verifie les champs obligatoires
//
rcheck(
	//requis
	array('wfw_id'=>'','size'=>'cInputInteger'),
	//optionnels
	null
	);

//
//globales
//     
$id  = $_REQUEST["wfw_id"];
$file_name = CLIENT_DATA_PATH."/$id.xml";
$file_dir = CLIENT_DATA_PATH."/$id/";
$size  = intval($_REQUEST["size"]);
$token  = uniqid();
$upload_file_name  = upload_path($token);

//
// charge le fichier xml
//     
$doc = clientOpen($id);

//
// cree le dossier d'upload si besoin
//
if(!file_exists($file_dir) && (cmd("mkdir ".$file_dir,$cmd_out)!=0))
	rpost_result(ERR_SYSTEM, "cant_create_folder");

//
// cree le fichier dummy
//

if($fp = fopen($upload_file_name, "wb"))
{
	fseek($fp, $size-1, SEEK_SET);
	fwrite($fp, 0xFF, 1);//dernier block
	fclose($fp);
}
else
	rpost_result(ERR_FAILED, "file_create");

//termine
rpost("id",$id);
rpost("token",$token);
rpost("size",$size);
rpost_result(ERR_OK);
?>

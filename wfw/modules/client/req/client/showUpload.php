<?php

/*
  (C)2010-2011 WebFrameWork 1.3
  Debute le stockage d'un fichier

  Arguments:
    wfw_id    : identificateur du dossier.  
	[wfw_pwd] : mot de passe du dossier
    size      : taille du fichier
    name      : nom du fichier
    
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
define("ROOT_PATH", realpath(THIS_PATH."/../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

include(ROOT_PATH.'/req/client/path.inc');
include(ROOT_PATH.'/req/client/client.inc');


//decode ?
if(isset($_REQUEST["encoded"]) && ($_REQUEST["encoded"]=="base64"))
{
	/*$data=split(",",$_REQUEST["data"]);
	$data=base64_decode($data[1]);*/
	$data=base64_decode($_REQUEST["data"]);
}
else{
	$data=$_REQUEST["data"];
}
file_put_contents(ROOT_PATH."/tmp/".$_REQUEST["filename"],$data);
/*
//fileRead
$data=base64_decode($_REQUEST["data"]);
file_put_contents(ROOT_PATH."/tmp/".$_REQUEST["filename"],$data);*/
?>

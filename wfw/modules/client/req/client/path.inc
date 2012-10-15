<?php      
/*
	(C)2011 ID-INFORMATIK, WebFrameWork(R)
	Definition des Chemin d'acces globaux

	Remarques:
		Utiliez par defaut des chemins absolues a l'aide de la constante 'ROOT_PATH' qui pointe sur la racine du site
		N'Ajoutez pas de slash en fin de chemin
*/

//Event path
define('CLIENT_EVENT_PATH',ROOT_PATH.'/private/clients/event');

//Public path
define('CLIENT_PUBLIC_DIR','data/clients');//relatif au dossier racine
define('CLIENT_PUBLIC_PATH',ROOT_PATH.'/'.CLIENT_PUBLIC_DIR);

//Private path
define('CLIENT_DATA_PATH',ROOT_PATH.'/private/clients/data');
define('CLIENT_DATA_DIR','clients/data');//relatif au dossier 'private'

//Private Upload
define('CLIENT_PRIVATE_UPLOAD_PATH',ROOT_PATH.'/private/clients/data/private_upload');

//Public Upload
define('CLIENT_PUBLIC_UPLOAD_PATH',ROOT_PATH.'/data/public_upload');

//Taille maximum des fichiers uploadables (en bytes)
$post_max_size = sizeToByte(ini_get('post_max_size'));
if(empty($post_max_size))
	$post_max_size=1024*1024*5; //5Mo par default
define("CLIENT_MAX_UPLOAD_SIZE",$post_max_size); 

//Maximum de fichiers uploadables
define("CLIENT_MAX_UPLOAD_FILE",5); 

//upload temporaire
define("CLIENT_TEMP_UPLOAD_PATH",ROOT_PATH."/tmp");

?>

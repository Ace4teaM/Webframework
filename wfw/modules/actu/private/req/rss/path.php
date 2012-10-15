<?php
/*
	(C)2011 ID-INFORMATIK, WebFrameWork(R)
	Definition des Chemin d'acces globaux

	Remarques:
		Utiliez par defaut des chemins absolues a l'aide de la constante 'ROOT_PATH' qui pointe sur la racine du site
		N'Ajoutez pas de slash en fin de chemin
*/

define("RSS_LOCAL_DATA_PATH", "data/var/rss"); 
define("RSS_DATA_PATH", ROOT_PATH."/".RSS_LOCAL_DATA_PATH);  
define("RSS_REQ_PATH", ROOT_PATH."/private/req/rss"); 
?>

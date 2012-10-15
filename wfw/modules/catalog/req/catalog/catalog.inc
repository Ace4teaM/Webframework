<?php

/*
	(C)2012 ID-INFORMATIK. WebFrameWork(R)
	Fonctions utiles
*/

//erreurs strings
global $_req_err_str;
$_req_err_str = array_merge($_req_err_str,array(
	"cant_load_catalog"=>"Le chargement du catalogue à échoué",
	"unknown_list_name"=>"L'Identifiant de la liste de champs est invalide",
	"cant_create_fields"=>"Impossible de créé la liste champs",
	"cant_save"=>"Le fichier ne peut pas être sauvegardé"
	));

?>

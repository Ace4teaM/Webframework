<?php
/*
	(C)2012 ID-INFORMATIK. WebFrameWork(R)
	PHP Code
	
	AUTHOR: Auguey Thomas
	
	Revisions:
	 [22-10-2010] Inverse les codes d'erreurs ERR_OK et ERR_FAILED, pour concorder avec le "standard" des processus unix
*/
require_once 'error.php';

// liste des codes et de leurs défintions
global $_err_codes;
$_err_codes=array(            
	(ERR_SYSTEM)           =>"Oups c'est embarrassant... une erreur système est survenue",
	(ERR_FAILED)           =>"La requête à échoué",
	(ERR_OK)               =>"Succès",
	(ERR_TEXT)             =>"Format de text invalide",
	(ERR_REQ)              =>"Erreur de requête",
	(ERR_TEXT_EMPTY)       =>"Text vide",
	(ERR_TEXT_INVALIDCHAR) =>"Caractères invalides",    
	(ERR_TEXT_INVALIDFORMAT)=>"Format de chaine invalide",
	(ERR_REQ_OPEN_URL)     =>"Impossible d'ouvrir l'URL",
	(ERR_REQ_MISSING_ARG)  =>"Argument manquant",
	(ERR_REQ_INVALID_ARG)  =>"Argument invalide",
);

?>

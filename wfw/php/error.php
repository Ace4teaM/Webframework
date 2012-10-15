<?php
/*
	(C)2012 ID-INFORMATIK. WebFrameWork(R)
	PHP Code
	
	AUTHOR: Auguey Thomas
	
	Revisions:
	 [22-10-2010] Inverse les codes d'erreurs ERR_OK et ERR_FAILED, pour concorder avec le "standard" des processus unix
*/
global $_err_callback;  // callaback appelé si result_check échoue
global $_last_err_code; // le dernier code d'erreur ex: ERR_FAILED
global $_last_err_str;  // le dernier sous-code d'erreur  ex: DATABASE_CONNECTION_FAILED
global $_err_codes;     // liste des codes et de leurs défintions

//Resultats
define("ERR_SYSTEM",               2);
define("ERR_FAILED",               1);
define("ERR_OK",                   0);

//Bases
define("ERR_TEXT",                 1000);
define("ERR_REQ",                  2000);

//Text Format
define("ERR_TEXT_EMPTY",           ERR_TEXT+1);
define("ERR_TEXT_INVALIDCHAR",     ERR_TEXT+2);
define("ERR_TEXT_INVALIDFORMAT",   ERR_TEXT+3);

//Requete
define("ERR_REQ_OPEN_URL",         ERR_REQ+1);
define("ERR_REQ_MISSING_ARG",      ERR_REQ+2);
define("ERR_REQ_INVALID_ARG",      ERR_REQ+3);

/**
 * Définit le dernier résultat en cours
 * @param int    $err_code   Code de l'erreur
 * @param string $err_string Identifiant de l'erreur
 * @return bool true si le code d'erreur est égale à ERR_OK, sinon false
 */
function proc_result($err_code,$err_str="") {
	global $_last_err_code;
	global $_last_err_str;

	if(is_string($err_code))
		eval('$_last_err_code='.$err_code.';');//convertie en entier
	else
		$_last_err_code = $err_code;

	$_last_err_str  = $err_str;
//	print_r($_last_err_code.':'.$_last_err_str."\n");
	return ($_last_err_code == ERR_OK) ? true : false;
}

/**
 * Retourne le dernier identifiant de l'erreur produit par la fonction 'proc_result'
 * @return string Identifiant de l'erreur
 */
function last_err_str() {
	global $_last_err_str;
	return $_last_err_str;
}

/**
 * Retourne le dernier code d'erreur produit par la fonction 'proc_result'
 * @return int Code numérique de l'erreur
 */
function last_err_code() {
	global $_last_err_code;
	return $_last_err_code;
}

/**
 * Verifie le dernier code d'erreur
 * Si une erreur survient, l'erreur est traité par la fonction '$_err_callback'
 */
function result_check($min_code=ERR_OK) {
	global $_err_callback;
	global $_last_err_code;
	global $_last_err_str;
        
	if($_last_err_code > $min_code && is_callable($_err_callback)){
		$_err_callback($_last_err_code,$_last_err_str);
                return false;
        }
        return true;
}

?>
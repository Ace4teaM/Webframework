<?php
header('Content-Type:text/plain'); // text plein, returne directement une chaine de caracteres

/*
  (C)2008-2010 WebFrameWork 1.3
	Retourne le texte associer a un code d'erreur standard
	code: code de l'erreur
	Retourne: le texte associer a l'erreur, "NaE" si le code est introuvable ou invlide
  [rev 1.1]
*/
$doc_root = "../";//$_SERVER['DOCUMENT_ROOT'];
include($doc_root.'php/base.php');
include_path($doc_root.'php/');
include_path($doc_root.'php/class/bases/');
include_path($doc_root.'php/inputs/');

$code  = $_REQUEST["code"];
global $_err_codes;

//echo "($code) ";
if(isset($_err_codes[$code])){
	echo $_err_codes[$code];
	exit;
}

echo 'NaE';//Not an Error
?>
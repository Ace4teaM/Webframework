<?php
require_once("int.php");
require_once("float.php");
require_once("name.php");
// numerique 
// Aucun Standard
class cInputEvalString extends cInput
{
	public static function isValid($value){
		if( empty($value) )
			return ERR_TEXT_EMPTY;
		
		// chaine valide ?
		if(preg_match("/^".cInputEvalString::regExp()."$/",$value)==0)
			return ERR_TEXT_INVALIDCHAR;

		return ERR_OK;
	}     
	public static function regExp(){
		return '[^\$\(\)\=]+';//pas de caracteres succeptible de modifier des variables ou appeler des fonctions
	}
	public static function getMaxLength(){
		return 128;
	}
}

?>

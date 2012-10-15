<?php
require_once("int.php");
require_once("float.php");
// numerique 
// Aucun Standard
class cInputNumeric extends cInput
{
	public static function isValid($value){
		if( empty($value) )
			return ERR_TEXT_EMPTY;
		
		// chaine valide ?
		if(preg_match("/^".cInputNumeric::regExp()."$/",$value)==0)
			return ERR_TEXT_INVALIDCHAR;

		return ERR_OK;
	}     
	public static function regExp(){
		return cInputInteger::regExp().'|'.cInputFloat::regExp();
	}
	public static function getMaxLength(){
		return 128;
	}
}

?>

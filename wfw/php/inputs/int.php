<?php
// Entier numerique 
// Aucun Standard
class cInputInteger extends cInput
{
	public static function isValid($value){
		if( empty_string($value) )
			return ERR_TEXT_EMPTY;
		
		// chaine valide ?
		if(preg_match("/^".cInputInteger::regExp()."$/",$value)==0)
			return ERR_TEXT_INVALIDCHAR;

		return ERR_OK;
	}     
	public static function regExp(){
		return '0|[1-9]{1}[0-9]*';
	}
	public static function getMaxLength(){
		return 128;
	}
}

?>

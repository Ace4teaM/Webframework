<?php
// Facteur de 0 à 1 
// Aucun Standard
class cInputFactor extends cInput
{
	public static function isValid($value){
		//if( empty_string($value) )
		//	return ERR_TEXT_EMPTY;
		if(!preg_match('/(0|1)(\.[0-9]*)?/', $value))
			return ERR_TEXT_INVALIDCHAR;

		return ERR_OK;
	}     
	public static function regExp(){
		return '(0|1)(\\.[0-9]*)?';
	}
	public static function getMaxLength(){
		return 128;
	}
}

?>

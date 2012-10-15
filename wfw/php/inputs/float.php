<?php
// Nombre a virgule 
// Aucun Standard
class cInputFloat extends cInput
{
	public static function isValid($value){
		if( empty($value) )
			return ERR_TEXT_EMPTY;
		
		// chaine valide ?
		if(preg_match("/^".cInputFolat::regExp()."$/",$value)==0)
			return ERR_TEXT_INVALIDCHAR;

		return ERR_OK;
	}     
	public static function regExp(){
		return '(?:[1-9]{1}[0-9]*)(?:[\.\,][0-9]*)?';
	}
	public static function getMaxLength(){
		return 128;
	}
}

?>

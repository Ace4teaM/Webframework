<?php
// Nom ASCII 
// Aucun Standard
class cInputName extends cInput
{
	public static function isValid($value){
		if( empty($value) )
			return ERR_TEXT_EMPTY;
		
		// carateres valides
		if(!is_strof($value,"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-."))
			return ERR_TEXT_INVALIDCHAR;

		return ERR_OK;
	}
	public static function regExp(){
		return '[a-zA-Z_]{1}[a-zA-Z0-9_\-\.]*';  
	}
	public static function getMaxLength(){
		return 128;
	}
}

?>

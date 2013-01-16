<?php

$libdir = realpath(dirname(__FILE__)."/../..");

require_once("$libdir/php/class/bases/input.php");
require_once("$libdir/php/string.php");

// Nom ASCII 
// Aucun Standard
class cInputName extends cInput
{
	public static function isValid($value){
		if( empty($value) )
			return RESULT(cResult::Failed, cInput::EmptyText);
		
		// carateres valides
		if(!is_strof($value,"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-."))
			return RESULT(cResult::Failed, cInput::InvalidChar);

		return RESULT_OK();
	}
	public static function regExp(){
		return '[a-zA-Z_]{1}[a-zA-Z0-9_\-\.]*';  
	}
	public static function getMaxLength(){
		return 128;
	}
}

?>

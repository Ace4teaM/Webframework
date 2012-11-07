<?php

$cwd = realpath(dirname(__FILE__));
$libdir = realpath("$cwd/../..");

require_once("$libdir/php/class/bases/input.php");

// Chaine de carcteres 
// Aucun Standard
class cInputString extends cInput
{
	public static function isValid($value){
		if( empty($value) )
			return ERR_TEXT_EMPTY;
		
		// chaine valide ?
		if(preg_match("/^".cInputString::regExp()."$/",$value)==0)
			return ERR_TEXT_INVALIDCHAR;

		return ERR_OK;
	}
	public static function regExp(){
		return '[^"\n\r]*';  
	}
	public static function getMaxLength(){
		return 128;
	}
}

?>

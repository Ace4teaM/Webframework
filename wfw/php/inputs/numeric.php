<?php

$cwd = realpath(dirname(__FILE__));
$libdir = realpath("$cwd/../..");

require_once("$libdir/php/class/bases/input.php");
require_once("$cwd/int.php");
require_once("$cwd/float.php");
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

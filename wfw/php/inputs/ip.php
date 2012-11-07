<?php

$libdir = realpath(dirname(__FILE__)."/../..");

require_once("$libdir/php/class/bases/input.php");
// Chaine de carcteres 
// Aucun Standard
class cInputIPv4 extends cInput
{
	public static function isValid($value){
		if( empty($value) )
			return ERR_TEXT_EMPTY;
		
		// chaine valide ?
		if(preg_match("/^".cInputIPv4::regExp()."$/",$value)==0)
			return ERR_TEXT_INVALIDCHAR;

		return ERR_OK;
	}
	public static function regExp(){
		return '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}';  
	}
	public static function getMaxLength(){
		return (3*4)+4;
	}
}

?>

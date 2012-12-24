<?php
/*
  (C)2012 WebFrameWork 1.3
	La classe cInputBool test une valeur booleen
*/

$libdir = realpath(dirname(__FILE__)."/../..");

require_once("$libdir/php/class/bases/input.php");
require_once("$libdir/php/string.php");

class cInputBool extends cInput
{
	public static function isValid($value){
		if( empty_string($value) )
			return ERR_TEXT_EMPTY;
		
		// carateres valides
		switch(strtolower($value)){
			case "0":
			case "1":
			case "yes":
			case "no":
			case "on":
			case "off":
			case "true":
			case "false":
				return ERR_OK;
		}

		return ERR_TEXT_INVALIDCHAR;
	}     
	public static function regExp(){
		return 'on|off|0|1|yes|no|true|false';
	}
	public static function getMaxLength(){
		return 128;
	}
	//extra
	public static function toBool($value){
		switch(strtolower($value)){
			case "1":
			case "yes":
			case "on":
			case "true":
				return true;
		}
		return false;
	}
        
        public static function toString($value){
            return ($value ? "true" : "false");
	}
}


?>

<?php
/*
  (C)2012 WebFrameWork 1.3
	La classe cInputBool test une valeur booleen
*/

$libdir = realpath(dirname(__FILE__)."/../..");

require_once("$libdir/php/class/bases/input.php");
require_once("$libdir/php/string.php");
require_once("$libdir/php/base.php");

class cInputBool extends cInput
{
	public static function isValid($value){
		if( empty_string($value) )
                    return RESULT(cResult::Failed,cInput::EmptyText);
		
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
                            return RESULT_OK();
		}

                return RESULT(cResult::Failed,cInput::InvalidChar);
	}
	public static function regExp(){
		return 'on|off|0|1|yes|no|true|false';
	}
	public static function getMaxLength(){
		return 128;
	}
	public static function toObject($value){
		return cInputBool::toBool($value);
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

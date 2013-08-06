<?php

require_once("class/bases/input.php");

// Chaine de carcteres 
// Aucun Standard
class cInputIPv4 extends cInput
{
	public static function isValid($value){
		if( empty_string($value) )
			return RESULT(cResult::Failed, cInput::EmptyText);
		
		// chaine valide ?
		if(preg_match("/^".cInputIPv4::regExp()."$/",$value)==0)
			return RESULT(cResult::Failed, cInput::InvalidChar);

		return RESULT_OK();
	}
	public static function regExp(){
		return '(?:0|1[0-9]{0,2}|2[0-4][0-9]|25[0-5])'.'\.'
                        .'(?:0|1[0-9]{0,2}|2[0-4][0-9]|25[0-5])'.'\.'
                        .'(?:0|1[0-9]{0,2}|2[0-4][0-9]|25[0-5])'.'\.'
                        .'(?:0|1[0-9]{0,2}|2[0-4][0-9]|25[0-5])';
	}
	public static function getMaxLength(){
		return (3*4)+4;
	}
}

?>

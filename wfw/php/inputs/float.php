<?php

$libdir = realpath(dirname(__FILE__)."/../..");

require_once("$libdir/php/class/bases/input.php");

// Nombre a virgule 
// Aucun Standard
class cInputFloat extends cInput
{
	public static function isValid($value){
		if( empty($value) )
			return RESULT(cResult::Failed,cInput::EmptyText);
		
		// chaine valide ?
		if(preg_match("/^".cInputFolat::regExp()."$/",$value)==0)
			return RESULT(cResult::Failed,cInput::InvalidChar);

		return RESULT_OK();
	}     
	public static function regExp(){
		return '(?:[1-9]{1}[0-9]*)(?:[\.\,][0-9]*)?';
	}
	public static function getMaxLength(){
		return 128;
	}
}

?>

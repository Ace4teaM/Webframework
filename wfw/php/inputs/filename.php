<?php
/*
  (C)2010 WebFrameWork 1.3
	La classe cInputFileName valide le format d'un nom de fichier
*/

require_once("class/bases/input.php");
require_once("string.php");

class cInputWindowsFileName extends cInput
{
	public static function isValid($value){
		if( empty_string($value) )
                    return RESULT(cResult::Failed,cInput::EmptyText);

		//
		//Valide la part local:
		//
		// 1. non vide
		if( empty($value) )
                    return RESULT(cResult::Failed,cInput::InvalidChar);
		// 2. carateres invalides
		if(!is_not_strof($value,'\/\\:*?"<>|'))
                    return RESULT(cResult::Failed,cInput::InvalidChar);
		// 3. pas de point '.' ni au debut, ni a la fin, ni de double point
		if((substr($value,0,1)=='.') || (substr($value,-1,1)=='.') || (strpos($value,'..')!==FALSE))
                    return RESULT(cResult::Failed,cInput::InvalidChar);

		return RESULT_OK();
	}
	public static function toHTML($id,$value){
		return '<input lang="en-us" size="20" maxlength="'.($this->getMaxLength()).'" name="'.$id.'" id="'.$id.'" type="text" value="'.$value.'" wbfw="mail" >';
	}
	public static function getMaxLength(){
		return 256;
	}
}

class cInputUNIXFileName extends cInput
{
	public static function isValid($value){
		if( empty($value) )
			return RESULT(cResult::Failed,cInput::EmptyText);

		//
		//Valide la part local:
		//
		// 1. non vide
		if( empty($value) )
                    return RESULT(cResult::Failed,cInput::InvalidChar);
		// 2. carateres invalides
		if(!is_not_strof($value,'\/\\:*?"<>|'))
                    return RESULT(cResult::Failed,cInput::InvalidChar);
		// 3. pas de point '.' ni au debut, ni a la fin, ni de double point
		if((substr($value,0,1)=='.') || (substr($value,-1,1)=='.') || (strpos($value,'..')!==FALSE))
                    return RESULT(cResult::Failed,cInput::InvalidChar);

		return RESULT_OK();
	}
	public static function toHTML($id,$value){
		return '<input lang="en-us" size="20" maxlength="'.($this->getMaxLength()).'" name="'.$id.'" id="'.$id.'" type="text" value="'.$value.'" wbfw="mail" >';
	}
	public static function getMaxLength(){
		return 256;
	}
}

?>

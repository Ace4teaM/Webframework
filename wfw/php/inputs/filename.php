<?php
/*
  (C)2010 WebFrameWork 1.3
	La classe cInputFileName valide le format d'un nom de fichier
*/

class cInputWindowsFileName extends cInput
{
	public static function isValid($value){
		if( empty($value) )
			return ERR_TEXT_EMPTY;

		$error = ERR_TEXT_INVALIDCHAR;
		//
		//Valide la part local:
		//
		// 1. non vide
		if( empty($value) ) return $error;
		// 2. carateres invalides
		if(!is_not_strof($value,'\/:*?"<>|'))
			return $error;
		// 3. pas de point '.' ni au debut, ni a la fin, ni de double point
		if((substr($value,0,1)=='.') || (substr($value,-1,1)=='.') || (strpos($value,'..')!==FALSE))
			return $error;

		return ERR_OK;
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
			return ERR_TEXT_EMPTY;

		$error = ERR_TEXT_INVALIDCHAR;
		//
		//Valide la part local:
		//
		// 1. non vide
		if( empty($value) ) return $error;
		// 2. carateres invalides
		if(!is_not_strof($value,'\/:*?"<>|'))
			return $error;
		// 3. pas de point '.' ni au debut, ni a la fin, ni de double point
		if((substr($value,0,1)=='.') || (substr($value,-1,1)=='.') || (strpos($value,'..')!==FALSE))
			return $error;

		return ERR_OK;
	}
	public static function toHTML($id,$value){
		return '<input lang="en-us" size="20" maxlength="'.($this->getMaxLength()).'" name="'.$id.'" id="'.$id.'" type="text" value="'.$value.'" wbfw="mail" >';
	}
	public static function getMaxLength(){
		return 256;
	}
}

?>

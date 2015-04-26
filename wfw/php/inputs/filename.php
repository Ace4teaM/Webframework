<?php
/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2008-2007, 2012-2013 Thomas AUGUEY <contact@aceteam.org>
    ---------------------------------------------------------------------------------------------------------------------------------------
    This file is part of WebFrameWork.

    WebFrameWork is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WebFrameWork is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WebFrameWork.  If not, see <http://www.gnu.org/licenses/>.
    ---------------------------------------------------------------------------------------------------------------------------------------
*/

require_once("class/bases/input.php");
require_once("string.php");

/**
 * @brief Test un nom de fichier Windows
 */
class cInputWindowsFileName extends cInput
{
    //--------------------------------------------------------
    // Méthodes
    // @class cInputWindowsFileName
    //--------------------------------------------------------
    
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

/**
 * @brief Test un nom de fichier UNIX
 */
class cInputUNIXFileName extends cInput
{
    //--------------------------------------------------------
    // Méthodes
    // @class cInputUNIXFileName
    //--------------------------------------------------------
    
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
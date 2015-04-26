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
require_once("inputs/integer.php");
require_once("inputs/float.php");
require_once("inputs/name.php");

/**
 * @brief Test une chaine executable
 * @remarks La chaine ne doit pas avoir de caractères succeptible de modifier des variables ou appeler des fonctions
 */
class cInputEvalString extends cInput
{
    //--------------------------------------------------------
    // Méthodes
    // @class cInputEvalString
    //--------------------------------------------------------
    
	public static function isValid($value){
            if( empty_string($value) )
                return RESULT(cResult::Failed,cInput::EmptyText);

            // chaine valide ?
            if(preg_match("/^".cInputEvalString::regExp()."$/",$value)==0)
                return RESULT(cResult::Failed,cInput::InvalidChar);

            return RESULT_OK();
	}     
	public static function regExp(){
		return '[^\$\(\)\=]+';//pas de caracteres succeptible de modifier des variables ou appeler des fonctions
	}
	public static function getMaxLength(){
		return 128;
	}
}

?>
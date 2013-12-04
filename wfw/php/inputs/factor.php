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

/**
 * @file factor.php
 *
 * @defgroup Inputs
 * @{
 */

/**
 * @brief Test un facteur de 0 à 1 
 */
class cInputFactor extends cInput
{
    /** @copydoc cInput::isValid */
	public static function isValid($value){
            // chaine valide ?
            if(preg_match("/^".cInputFactor::regExp()."$/",$value)==0)
                    return RESULT(cResult::Failed,cInput::InvalidChar);

            return RESULT_OK();
	}    
    /** @copydoc cInput::toObject */ 
    public static function toObject($string) {
        return floatval($string);
    }
    /** @copydoc cInput::regExp */
	public static function regExp(){
            return '(?:0|1)(?:\\.[0-9]+)?';
	}
    /** @copydoc cInput::getMaxLength */
	public static function getMaxLength(){
            return 128;
	}
}

/** @} */ // end of group
?>

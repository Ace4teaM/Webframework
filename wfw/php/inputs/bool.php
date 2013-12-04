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
require_once("base.php");

/**
 * @file bool.php
 *
 * @defgroup Inputs
 * @{
 */

/**
 * @brief Test une valeur booleen
 */
class cInputBool extends cInput
{
    /** @copydoc cInput::isValid */
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
    /** @copydoc cInput::regExp */
	public static function regExp(){
		return 'on|off|0|1|yes|no|true|false';
	}
    /** @copydoc cInput::getMaxLength */
	public static function getMaxLength(){
		return 128;
	}
    /** @copydoc cInput::toObject */
	public static function toObject($value){
		return cInputBool::toBool($value);
	}

	// extra //

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

/** @} */ // end of group
?>

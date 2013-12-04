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
 * @file name.php
 *
 * @defgroup Inputs
 * @{
 */

/**
 * @brief Test un Nom ASCII
 * @remarks Ce type est un peut moin restrictif qu'un identificateur. Il est généralement utilisé pour nommé une application
 */
class cInputName extends cInput
{
    /** @copydoc cInput::isValid */
	public static function isValid($value){
		if( empty_string($value) )
			return RESULT(cResult::Failed, cInput::EmptyText);
		
		// carateres valides
		if(!is_strof($value,"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-."))
			return RESULT(cResult::Failed, cInput::InvalidChar);

		return RESULT_OK();
	}
    /** @copydoc cInput::regExp */
	public static function regExp(){
		return '[a-zA-Z_]{1}[a-zA-Z0-9_\-\.]*';  
	}
    /** @copydoc cInput::getMaxLength */
	public static function getMaxLength(){
		return 128;
	}
}

/** @} */ // end of group
?>

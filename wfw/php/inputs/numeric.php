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

/**
 * @file numeric.php
 *
 * @defgroup Inputs
 * @{
 */

/**
 * @brief Test un nombre
 * @remarks Accepte les nombres entier ou à virgule 
 */
class cInputNumeric extends cInput {

    /** @copydoc cInput::isValid */
    public static function isValid($value) {
        if (empty_string($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        // chaine valide ?
        if (preg_match("/^" . cInputNumeric::regExp() . "$/", $value) == 0)
            return RESULT(cResult::Failed, cInput::InvalidChar);

        return RESULT_OK();
    }

    /** @copydoc cInput::toObject */
    public static function toObject($string) {
        if(strstr($string, ",."))
            return cInputFloat::toObject($string);
        return cInputInteger::toObject($string);
    }

    /** @copydoc cInput::regExp */
    public static function regExp() {
        return cInputInteger::regExp() . '|' . cInputFloat::regExp();
    }

    /** @copydoc cInput::getMaxLength */
    public static function getMaxLength() {
        return 128;
    }

}

/** @} */ // end of group
?>

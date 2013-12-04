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
 * @file password.php
 *
 * @defgroup Inputs
 * @{
 */

/**
 * @brief Test un Mot de passe ASCII
 */
class cInputPassword extends cInput
{
    const MIN_CHAR_COUNT = 6;

    /** @copydoc cInput::isValid */
    public static function isValid($value)
    {
        if (empty_string($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        if(strlen($value) < cInputPassword::MIN_CHAR_COUNT)
            return RESULT(cResult::Failed, cInput::TooSmallString, array("message"=>"WFW_MSG_TOO_SMALL_PASSWORD", "MIN_CHAR_COUNT"=>cInputPassword::MIN_CHAR_COUNT));
        
        // carateres valides
        if (!is_strof($value, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-@#&+~"))
            return RESULT(cResult::Failed, cInput::InvalidChar);

        return RESULT_OK();
    }

    /** @copydoc cInput::regExp */
    public static function regExp() {
        return '[a-zA-Z0-9_\-\@\#\&\+\~]+';
    }

    /** @copydoc cInput::toHTML */
    public static function toHTML($id, $value) {
        return '<input lang="en-us" size="20" maxlength="' . ($this->getMaxLength()) . '" name="' . $id . '" id="' . $id . '" type="text" value="' . $value . '" wbfw="edit" >';
    }

    /** @copydoc cInput::getMaxLength */
    public static function getMaxLength() {
        return 128;
    }

}

/** @} */ // end of group
?>

<?php
/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2008-2007, 2012-2014 Thomas AUGUEY <contact@aceteam.org>
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
 * @brief Test une Adresse eMail RFC-2822 ( non-certifié)
 * @remarks RFC-2822 ( non-certifié)
 */
class cInputMail extends cInput {

    //--------------------------------------------------------
    // Méthodes
    // @class cInputMail
    //--------------------------------------------------------
    
    public static function isValid($value) {
        if( empty_string($value) )
            return RESULT(cResult::Failed, cInput::EmptyText);

        $name = strtok($value, "@");
        $domain = strtok("@");


        //
        //Valide la part local:
        //
                //
		// 1. non vide
        if (empty_string($name))
            return RESULT(cResult::Failed, cInput::InvalidChar);
        // 2. carateres valides
        if (!is_strof($name, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._!#$%*/?|^{}`~&'+-="))
            return RESULT(cResult::Failed, cInput::InvalidChar);
        // 3. pas de point '.' ni au debut, ni a la fin, ni de double point
        if ((substr($name, 0, 1) == '.') || (substr($name, -1, 1) == '.') || (strpos($name, '..') !== FALSE))
            return RESULT(cResult::Failed, cInput::InvalidChar);

        //
        //Valide la part du domaine:
        //
                //
		// 1. non vide
        if (empty_string($domain))
            return RESULT(cResult::Failed, cInput::InvalidChar);
        // 2. carateres valides
        if (!is_strof($domain, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-"))
            return RESULT(cResult::Failed, cInput::InvalidChar);
        // 3. pas de point '.' ni au debut, ni a la fin, ni de double point
        if ((substr($domain, 0, 1) == '.') || (substr($domain, -1, 1) == '.') || (strpos($domain, '..') !== FALSE))
            return RESULT(cResult::Failed, cInput::InvalidChar);

        return RESULT_OK();
    }

    public static function toHTML($id, $value) {
        return '<input lang="en-us" size="20" maxlength="' . ($this->getMaxLength()) . '" name="' . $id . '" id="' . $id . '" type="text" value="' . $value . '" wbfw="mail" >';
    }

    public static function getMaxLength() {
        return 255 + 64 + 1;
    }
}

?>
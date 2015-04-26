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
 * @brief Test une date
 */
class cInputDate extends cInput {

    //--------------------------------------------------------
    // Méthodes
    // @class cInputDate
    //--------------------------------------------------------
    
    public static function isValid($value/*,&$output*/) {
        if ( empty_string($value) )
            return RESULT(cResult::Failed, cInput::EmptyText);

        // chaine valide ?
        if(!preg_match("/^".cInputDate::regExp()."$/",$value))
            return RESULT(cResult::Failed,cInput::InvalidChar);

        return RESULT_OK();
    }

    public static function toObject($string) {
        $date = new DateTime($string);
        return $date;
    }
    
    public static function regExp() {
        $sep = '[\-\/\\\s]';

        return "(?:([0-9]{1,2})".$sep."([0-9]{1,2})".$sep."([0-9]+))" // DMY
                ."|"
                ."(?:([0-9]+)".$sep."([0-9]{1,2})".$sep."([0-9]{1,2}))" // YMD
        ;
    }

    public static function getMaxLength() {
        return -1;
    }
}

?>
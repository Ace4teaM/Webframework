<?php

/*
  ---------------------------------------------------------------------------------------------------------------------------------------
  (C)2013 Thomas AUGUEY <contact@aceteam.org>
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

/**
 * @brief Entier numérique 32bits signée
 * @author Thomas AUGUEY
 */
$libdir = realpath(dirname(__FILE__) . "/../..");

require_once("$libdir/php/class/bases/input.php");
require_once("$libdir/php/base.php");

// Entier numerique 
// Aucun Standard
class cInputInteger extends cInput {

    public static function isValid($value) {
        // vide ?
        if (empty_string($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        // vérifie le nombre de caractères min
        if (cInputInteger::getMinLength() && strlen($value) < cInputInteger::getMinLength())
            return RESULT(cResult::Failed, cInput::Undersized);

        // vérifie le nombre de caractères max
        if (cInputInteger::getMaxLength() && strlen($value) > cInputInteger::getMaxLength())
            return RESULT(cResult::Failed, cInput::Oversized);

        // vérifie le rang de valeur
        if (intval($value) < cInputInteger::min() || intval($value) > cInputInteger::max())
            return RESULT(cResult::Failed, cInput::InvalidRange);

        // vérifie le format
        if (preg_match("/^" . cInputInteger::regExp() . "$/", $value) == 0)
            return RESULT(cResult::Failed, cInput::InvalidChar);

        return RESULT_OK();
    }

    public static function toObject($string) {
        return intval($string);
    }

    public static function regExp() {
        return '(?:0|[1-9]{1}[0-9]*)';
    }

    public static function getMaxLength() {
        return 11;
    }

    public static function getMinLength() {
        return 1;
    }

    public static function min() {
        return -2147483648; //2^31
    }

    public static function max() {
        return 2147483647; //2^31-1
    }

}

?>

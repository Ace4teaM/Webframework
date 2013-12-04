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
 * @file url.php
 *
 * @defgroup Inputs
 * @{
 */

/**
 * @brief Test une URL
 * @todo Classe non implémentée
 */
class cInputUrl extends cInput {

    /** @copydoc cInput::isValid */
    public static function isValid($value) {
        if (empty_string($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        return RESULT_OK();
    }

    /** @copydoc cInput::regExp */
    public static function regExp() {
        //compositions
        $scheme   = '[A-Za-z]{1}[A-Za-z0-9+\.\-]*';
        $port     = '[0-9]+';
        $domain   = '[A-Za-z]{1}[A-Za-z0-9_\.:\-]*'; //Registry-based
        $path     = '[A-Za-z0-9_\.+%\-]*';
        $query    = '[A-Za-z0-9_\.&=+;%\-\(\)\:\/]*';
        $fragment = '[A-Za-z0-9_+%\-]*';
        //var fragment = '(?:'.$alpha.'|'.$digit.'|'.$safe.'|'.$extra.'|'.$escape.')';
 
        return '((' . $scheme . '):/+)?'
                +'(' . $domain . ')?'
                +'^([/' . $path . ']*)([?' . $query . ']?)([#' . $fragment . ']?)';
    }

    /** @copydoc cInput::getMaxLength */
    public static function getMaxLength() {
        return -1;
    }

}

/** @} */ // end of group
?>

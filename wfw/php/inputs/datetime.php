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
 * @brief Test une date + temps
 */
class cInputDateTime extends cInput {

    //--------------------------------------------------------
    // Méthodes
    // @class cInputDateTime
    //--------------------------------------------------------
    
    public static function isValid($value/*,&$output*/) {
        if ( empty_string($value) )
            return RESULT(cResult::Failed, cInput::EmptyText);

        // chaine valide ?
        if(!preg_match("/^".cInputDateTime::regExp()."$/",$value))
            return RESULT(cResult::Failed,cInput::InvalidChar);

        return RESULT_OK();
        /*
        $fmt = cInputDateTime::regExp();
        foreach($fmt as $fmt=>$regex){
            if (preg_match($regex, $value, $matches)){
                //$output = new DateTime($value);
                return RESULT_OK();
            }
        }

        return RESULT(cResult::Failed, cInput::InvalidFormat);*/
    }

    public static function toObject($string) {
        $date = new DateTime($string);
        return $date;
    }
    
    public static function regExp() {
        $tsep = '[\:\s]';//time separator
        $dsep = '[\-\/\\s]';//date separator
        
        return 
                "(?:([0-9]{1,2})$dsep([0-9]{1,2})$dsep([0-9]+)\s*([0-2]{1}[0-9]{1})$tsep([0-6]{1}[0-9]{1})$tsep([0-6]{1}[0-9]{1}))" //DMY-HMS
                ."|"
                ."(?:([0-9]+)$dsep([0-9]{1,2})$dsep([0-9]{1,2})\s*([0-6]{1}[0-9]{1})$tsep([0-6]{1}[0-9]{1})$tsep([0-2]{1}[0-9]{1}))"//YMD-SMH
        ;
/*        return array(
            "DMY-HMS"=>"/^([0-9]{1,2})$dsep([0-9]{1,2})$dsep([0-9]+)\s*([0-2]{1}[0-9]{1})$tsep([0-6]{1}[0-9]{1})$tsep([0-6]{1}[0-9]{1})$/",
            "YMD-SMH"=>"/^([0-9]+)$dsep([0-9]{1,2})$dsep([0-9]{1,2})\s*([0-6]{1}[0-9]{1})$tsep([0-6]{1}[0-9]{1})$tsep([0-2]{1}[0-9]{1})$/"
        );*/
    }

    public static function getMaxLength() {
        return -1;
    }
}

?>
<?php

require_once("class/bases/input.php");

/**
 * @brief Test une date
 */
class cInputDate extends cInput {

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

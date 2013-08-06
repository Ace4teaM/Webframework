<?php

require_once("class/bases/input.php");
require_once("inputs/integer.php");
require_once("inputs/float.php");

// numerique 
// Aucun Standard
class cInputNumeric extends cInput {

    public static function isValid($value) {
        if (empty_string($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        // chaine valide ?
        if (preg_match("/^" . cInputNumeric::regExp() . "$/", $value) == 0)
            return RESULT(cResult::Failed, cInput::InvalidChar);

        return RESULT_OK();
    }

    public static function toObject($string) {
        if(strstr($string, ",."))
            return cInputFloat::toObject($string);
        return cInputInteger::toObject($string);
    }
    public static function regExp() {
        return cInputInteger::regExp() . '|' . cInputFloat::regExp();
    }

    public static function getMaxLength() {
        return 128;
    }

}

?>

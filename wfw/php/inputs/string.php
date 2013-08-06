<?php

require_once("class/bases/input.php");

// Chaine de carcteres 
// Aucun Standard
class cInputString extends cInput {

    public static function isValid($value) {
        if (empty_string($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        // chaine valide ?
        if (preg_match("/^" . cInputString::regExp() . "$/", $value) == 0)
            return RESULT(cResult::Failed, cInput::InvalidChar);

        return RESULT_OK();
    }

    public static function regExp() {
        return '[^"\n\r]*';
    }

    public static function getMaxLength() {
        return 128;
    }

}

?>

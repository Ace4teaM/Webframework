<?php

$cwd = realpath(dirname(__FILE__));
$libdir = realpath("$cwd/../..");

require_once("$libdir/php/class/bases/input.php");

// Chaine de carcteres 
// Aucun Standard
class cInputText extends cInput {

    public static function isValid($value) {
        if (empty($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        return RESULT_OK();
    }

    public static function regExp() {
        return '.*';
    }

    public static function getMaxLength() {
        return -1;
    }

}

?>

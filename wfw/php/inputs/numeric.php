<?php

$cwd = realpath(dirname(__FILE__));
$libdir = realpath("$cwd/../..");

require_once("$libdir/php/class/bases/input.php");
require_once("$cwd/int.php");
require_once("$cwd/float.php");

// numerique 
// Aucun Standard
class cInputNumeric extends cInput {

    public static function isValid($value) {
        if (empty($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        // chaine valide ?
        if (preg_match("/^" . cInputNumeric::regExp() . "$/", $value) == 0)
            return RESULT(cResult::Failed, cInput::InvalidChar);

        return RESULT_OK();
    }

    public static function regExp() {
        return cInputInteger::regExp() . '|' . cInputFloat::regExp();
    }

    public static function getMaxLength() {
        return 128;
    }

}

?>

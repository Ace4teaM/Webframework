<?php

$cwd = realpath(dirname(__FILE__));
$libdir = realpath("$cwd/../..");

require_once("$libdir/php/class/bases/input.php");

/**
 * @brief Test une date
 * @todo Classe non implémentée
 */
class cInputDate extends cInput {

    public static function isValid($value) {
        if (empty($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        return RESULT_OK();
    }

    public static function toObject($string) {
        return date('d-m-Y', strtotime($string));
    }
    
    public static function regExp() {
        return '.*';
    }

    public static function getMaxLength() {
        return -1;
    }

}

?>

<?php

require_once("class/bases/input.php");

/**
 * @brief Test une chaine de caractéres 
 * @todo Classe non implémentée
 */
class cInputText extends cInput {

    public static function isValid($value) {
        if (empty_string($value))
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

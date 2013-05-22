<?php

require_once("class/bases/input.php");

// Mime type
class cInputMime extends cInput {

    public static function isValid($value) {
        if (empty($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        if (!preg_match("/^" . cInputIdentifier::regExp() . "$/", $value))
            return RESULT(cResult::Failed, cInput::InvalidFormat);

        return RESULT_OK();
    }

    public static function regExp() {
        return '\w+/\w+';
    }

    public static function getMaxLength() {
        return 256;
    }

}

?>

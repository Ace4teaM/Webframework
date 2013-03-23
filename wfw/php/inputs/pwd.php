<?php

$cwd = realpath(dirname(__FILE__));
$libdir = realpath("$cwd/../..");

require_once("$libdir/php/class/bases/input.php");
require_once("$libdir/php/string.php");

// Mot de passe ASCII 
// Aucun Standard
class cInputPassword extends cInput
{
    const MIN_CHAR_COUNT = 6;

    public static function isValid($value)
    {
        if (empty($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        if(strlen($value) < cInputPassword::MIN_CHAR_COUNT)
            return RESULT(cResult::Failed, cInput::TooSmallString, array("message"=>"WFW_MSG_TOO_SMALL_PASSWORD", "MIN_CHAR_COUNT"=>cInputPassword::MIN_CHAR_COUNT));
        
        // carateres valides
        if (!is_strof($value, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-@#&+~"))
            return RESULT(cResult::Failed, cInput::InvalidChar);

        return RESULT_OK();
    }

    public static function regExp() {
        return '[a-zA-Z0-9_\-\@\#\&\+\~]+';
    }

    public static function toHTML($id, $value) {
        return '<input lang="en-us" size="20" maxlength="' . ($this->getMaxLength()) . '" name="' . $id . '" id="' . $id . '" type="text" value="' . $value . '" wbfw="edit" >';
    }

    public static function getMaxLength() {
        return 128;
    }

}

?>

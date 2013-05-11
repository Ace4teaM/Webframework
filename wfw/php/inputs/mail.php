<?php

/*
  (C)2008-2010 WebFrameWork 1.3
  La classe cInputMail valide le format d'une adresse eMail

  Revisions:
  [xx-xx-2010], corrige la methode ::isValid().
  [23-11-2010], Debug isValid(), accept le caractere '-' dans le format du nom de domaine.
 */

require_once("class/bases/input.php");
require_once("string.php");

// Adresse eMail
// RFC-2822 ( non-certifié)
class cInputMail extends cInput {

    public static function isValid($value) {
        if (empty($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        $name = strtok($value, "@");
        $domain = strtok("@");


        //
        //Valide la part local:
        //
                //
		// 1. non vide
        if (empty($name))
            return RESULT(cResult::Failed, cInput::InvalidChar);
        // 2. carateres valides
        if (!is_strof($name, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._!#$%*/?|^{}`~&'+-="))
            return RESULT(cResult::Failed, cInput::InvalidChar);
        // 3. pas de point '.' ni au debut, ni a la fin, ni de double point
        if ((substr($name, 0, 1) == '.') || (substr($name, -1, 1) == '.') || (strpos($name, '..') !== FALSE))
            return RESULT(cResult::Failed, cInput::InvalidChar);

        //
        //Valide la part du domaine:
        //
                //
		// 1. non vide
        if (empty($domain))
            return RESULT(cResult::Failed, cInput::InvalidChar);
        // 2. carateres valides
        if (!is_strof($domain, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-"))
            return RESULT(cResult::Failed, cInput::InvalidChar);
        // 3. pas de point '.' ni au debut, ni a la fin, ni de double point
        if ((substr($domain, 0, 1) == '.') || (substr($domain, -1, 1) == '.') || (strpos($domain, '..') !== FALSE))
            return RESULT(cResult::Failed, cInput::InvalidChar);

        return RESULT_OK();
    }

    public static function toHTML($id, $value) {
        return '<input lang="en-us" size="20" maxlength="' . ($this->getMaxLength()) . '" name="' . $id . '" id="' . $id . '" type="text" value="' . $value . '" wbfw="mail" >';
    }

    public static function getMaxLength() {
        return 255 + 64 + 1;
    }

}

?>

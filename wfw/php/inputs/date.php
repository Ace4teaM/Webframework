<?php

require_once("class/bases/input.php");

/**
 * @brief Test une date
 * @todo Classe non implémentée
 */
class cInputDate extends cInput {

    public static function isValid($value/*,&$output*/) {
        if (empty($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        $fmt = cInputDate::regExp();
        foreach($fmt as $fmt=>$regex){
            if (preg_match($regex, $value, $matches)){
                /*$output = new DateTime($value);*/
                return RESULT_OK();
            }
        }

        return RESULT(cResult::Failed, cInput::InvalidFormat);
    }

    public static function toObject($string) {
        $date = new DateTime ($string);
        return $date;
    }
    
    public static function regExp() {
        $sep = '[\-\/\\\s]';
        
        return array(
            "DMY"=>"/^([0-9]{1,2})$sep([0-9]{1,2})$sep([0-9]+)$/",
            "YMD"=>"/^([0-9]+)$sep([0-9]{1,2})$sep([0-9]{1,2})$/"
        );
    }

    public static function getMaxLength() {
        return -1;
    }

}

?>

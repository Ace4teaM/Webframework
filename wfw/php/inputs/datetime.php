<?php

require_once("class/bases/input.php");

/**
 * @brief Date + Temps
 */
class cInputDateTime extends cInput {

    public static function isValid($value/*,&$output*/) {
        if (empty($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        $fmt = cInputDateTime::regExp();
        foreach($fmt as $fmt=>$regex){
            if (preg_match($regex, $value, $matches)){
                /*$output = new DateTime($value);*/
                return RESULT_OK();
            }
        }

        return RESULT(cResult::Failed, cInput::InvalidFormat);
    }

    public static function toObject($string) {
        $date = new DateTime($string);
        return $date;
    }
    
    public static function regExp() {
        $tsep = '[\:\s]';//time separator
        $dsep = '[\-\/\\\s]';//date separator
        
        return array(
            "DMY-HMS"=>"/^([0-9]{1,2})$dsep([0-9]{1,2})$dsep([0-9]+)\s*([0-2]{1}[0-9]{1})$tsep([0-6]{1,2})$tsep([0-6]{1,2})$/",
            "YMD-SMH"=>"/^([0-9]+)$dsep([0-9]{1,2})$dsep([0-9]{1,2})\s*([0-6]{1,2})$tsep([0-6]{1,2})$tsep([0-2]{1}[0-9]{1})$/"
        );
    }

    public static function getMaxLength() {
        return -1;
    }

}

?>

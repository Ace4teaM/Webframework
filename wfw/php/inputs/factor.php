<?php

require_once("class/bases/input.php");

// Facteur de 0 à 1 
// Aucun Standard
class cInputFactor extends cInput
{
	public static function isValid($value){
            // chaine valide ?
            if(preg_match("/^".cInputFloat::regExp()."$/",$value)==0)
                    return RESULT(cResult::Failed,cInput::InvalidChar);

            return RESULT_OK();
	}     
        public static function toObject($string) {
            return floatval($string);
        }
	public static function regExp(){
            return '(?:0|1)(?:\\.[0-9]+)?';
	}
	public static function getMaxLength(){
            return 128;
	}
}

?>

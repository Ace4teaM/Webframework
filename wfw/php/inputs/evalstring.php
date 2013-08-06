<?php

require_once("class/bases/input.php");
require_once("inputs/integer.php");
require_once("inputs/float.php");
require_once("inputs/name.php");

// numerique 
// Aucun Standard
class cInputEvalString extends cInput
{
	public static function isValid($value){
            if( empty_string($value) )
                return RESULT(cResult::Failed,cInput::EmptyText);

            // chaine valide ?
            if(preg_match("/^".cInputEvalString::regExp()."$/",$value)==0)
                return RESULT(cResult::Failed,cInput::InvalidChar);

            return RESULT_OK();
	}     
	public static function regExp(){
		return '[^\$\(\)\=]+';//pas de caracteres succeptible de modifier des variables ou appeler des fonctions
	}
	public static function getMaxLength(){
		return 128;
	}
}

?>

<?php

/**
 * Description of cInput
 *
 * @author developpement
 */
class cInputFields {
    //erreurs
    const NoInputFileds = "NO_INPUT_FIELD";
    const MissingArg = "MISSING_FIELD";
    //messages
    const MsgInvalidInput = "INPUT_MSG_INVALID_FIELD";

    /*
     * @brief Check format of inputs fields
     * @return Result success boolean
     * @retval true Function succed, all input fields is valid
     * @retval false Function failed, check cResult::getLast() for more informations
     */
    public static function checkArray($required_arg, $optionnal_arg=NULL, $fields=NULL) {

        if($fields===NULL && isset($_REQUEST))
            $fields = $_REQUEST;

        //aucun champs ?
        if($fields===NULL)
            return RESULT(cInputFields::NoInputFileds);

        //verifie les elements requis...
        //ils doivent exister, etre valide et ne pas etre une chaine vide
        if (is_array($required_arg)) {
            foreach ($required_arg as $arg_name => $arg_type) {
                //existe?
                if (!isset($fields[$arg_name]) || empty_string($fields[$arg_name])) {
                    return RESULT( cResult::Failed, cInputFields::MissingArg, array("message"=>cInputFields::MsgInvalidInput,"field_name"=>$arg_name) );
                }
                //verifie le format si besoin    
                if (!empty($arg_type)) {
                    if (!$arg_type::isValid($fields[$arg_name])){
                        RESULT_PUSH("message", cInputFields::MsgInvalidInput);
                        RESULT_PUSH("field_name", $arg_name);
                        return false; // conserve le resultat de la fonction
                    }
                }
            }
        }
        
        //verifie les elements optionnels... 
        //si il existes ils doivent etre valide
        if (is_array($optionnal_arg)) {
            foreach ($optionnal_arg as $arg_name => $arg_type) {
                //existe?
                if (isset($fields[$arg_name]) && !empty($fields[$arg_name]) && !empty($arg_type)) {
                    if (!$arg_type::isValid($fields[$arg_name])){
                        RESULT_PUSH("message", cInputFields::MsgInvalidInput);
                        RESULT_PUSH("field_name", $arg_name);
                        return false; // conserve le resultat de la fonction
                    }
                }
            }
        }

        //ok
        return RESULT_OK();
    }

}

?>

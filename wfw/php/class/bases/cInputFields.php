<?php

/**
 * Description of cInput
 *
 * @author developpement
 */
class cInputFields {
    /** Aucun champ reçu */
    const NoInputFileds = "NO_INPUT_FIELD";
    /**
     * Champ Manquant
     * @param FIELD_NAME Nom du champ manquant
     */
    const MissingArg = "MISSING_FIELD";

    /*
     * @brief Test les formats d'un tableau de champs
     * @param array $required_arg  Liste des défintions de champs requis. Si NULL, aucun.
     * @param array $optionnal_arg Liste des défintions de champs optionnels. Si NULL, aucun.
     * @param array $fields        Tableau associatif des valeurs de champs. Si NULL, $_REQUEST est utilisé
     * @param array $output        Référence sur l'objet recevant l'ensemble des valeurs converties en objets PHP 
     * @return bool Succès de la procédure. Voir cResult::getLast() pour plus d'informations le résultat
     */
    public static function checkArray($required_arg, $optionnal_arg=NULL, $fields=NULL, &$output=NULL) {

        if($fields===NULL && isset($_REQUEST))
            $fields = $_REQUEST;

        //aucun champs ?
        if($fields===NULL)
            return RESULT(cInputFields::NoInputFileds);

        //vérifie les elements requis...
        //ils doivent existés, être valide et ne pas être une chaine vide
        if (is_array($required_arg)) {
            foreach ($required_arg as $arg_name => $arg_type) {
                //existe?
                if (!isset($fields[$arg_name]) || empty_string($fields[$arg_name])) {
                    return RESULT( cResult::Failed, cInputFields::MissingArg, array("message"=>true,"field_name"=>$arg_name) );
                }
                //verifie le format si besoin    
                if (!empty($arg_type)) {
                    if (!$arg_type::isValid($fields[$arg_name])){
                        RESULT_PUSH("message", cInputFields::MissingArg);
                        RESULT_PUSH("field_name", $arg_name);
                        return false; // conserve le resultat de la fonction
                    }
                }
            }
        }
        
        //verifie les elements optionnels... 
        //si ils existent, ils doivent être valide
        if (is_array($optionnal_arg)) {
            foreach ($optionnal_arg as $arg_name => $arg_type) {
                //existe ?
                if (isset($fields[$arg_name]) && !empty_string($fields[$arg_name]) && !empty_string($arg_type)) {
                    if (!$arg_type::isValid($fields[$arg_name])){
                        RESULT_PUSH("message", cInputFields::MsgInvalidInput);
                        RESULT_PUSH("field_name", $arg_name);
                        return false; // conserve le resultat de la fonction
                    }
                }
            }
        }

        //convertie les valeurs en objets ?
        if(is_array($output))
        {
            $all = array_merge(
                    is_array($optionnal_arg) ? $optionnal_arg : array(),
                    is_array($required_arg) ? $required_arg : array()
            );
            if (is_array($all)) {
                foreach ($all as $arg_name => $arg_type) {
                    //existe ?
                    if (isset($fields[$arg_name]) && !empty_string($fields[$arg_name]) && !empty_string($arg_type))
                        $all[$arg_name] = $arg_type::toObject($fields[$arg_name]);
                    else
                        $all[$arg_name] = NULL;
                }
            }
            $output = (object) $all;
 //           print_r($output);
        }

        //ok
        return RESULT_OK();
    }

}

?>

<?php

/*
  (C)2010-2012 ID-INFORMATIK - WebFrameWork(R)
  XArg encoder/decoder

  AUTHOR: Auguey Thomas
 */


define("XARG_START_OF_TEXT_CODE", 0x02);
define("XARG_END_OF_TEXT_CODE", 0x03);
define("XARG_START_OF_TEXT_CHAR", chr(XARG_START_OF_TEXT_CODE));
define("XARG_END_OF_TEXT_CHAR", chr(XARG_END_OF_TEXT_CODE));

/**
 * @brief Encode un champ dans le format XARG
 * 
 * @param string $title Titre du paramétre (Format identifier recommandé)
 * @param string $title Valeur du paramétre
 * @return chaine au format XARG
 */
function xarg_encode_field($title, $msg) {
    $msg = str_replace(array(XARG_START_OF_TEXT_CHAR, XARG_END_OF_TEXT_CHAR), array('', ''), $msg); //Les caracteres de controle de debut et de fin de valeur sont interdits
    return $title . XARG_START_OF_TEXT_CHAR . $msg . XARG_END_OF_TEXT_CHAR;
}

/**
 * @brief Encode les champs d'un tableau associatif dans le format XARG
 * 
 * @param string $array Tableau associatif
 * @return chaine au format XARG
 */
function xarg_encode_array($array) {
    $text="";
    foreach($array as $name=>$value)
        $text .= xarg_encode_field($name, $value);
    return $text;
}

/**
 * @brief Convertie une chaine au format XARG en tableau associatif
 * @param string $text     Corps du document XARG
 * @param string $bencoded true si la chaine est encodé au format d'une URI, sinon false
 * @return Tableau associatif des paramètres
 */
function xarg_parse($text, $bencoded) {//v4
    $rslt = array();
    $begin_pos = 0;
    $pos;
    $separator = XARG_START_OF_TEXT_CHAR;
    $end = XARG_END_OF_TEXT_CHAR;

    if ($bencoded) {
        $separator = "%02"; //STX
        $end = "%03"; //ETX
    }

    while (($pos = strpos($text, $separator, $begin_pos)) !== FALSE) {
        $pos2 = strpos($text, $end, $pos);
        if ($pos2 === FALSE) { // fin anticipe
            print_d("x_request_arguments_parse(), attention: fin anormale de requete!");
            return $rslt;
        }

        $name = substr($text, $begin_pos, $pos - $begin_pos);
        $value = substr($text, $pos + strlen($separator), $pos2 - ($pos + strlen($separator)));

        $begin_pos = $pos2 + strlen($end); //prochaine position de depart

        $rslt[$name] = $value;
    }
    return $rslt;
}
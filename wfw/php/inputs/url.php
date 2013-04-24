<?php

$cwd = realpath(dirname(__FILE__));
$libdir = realpath("$cwd/../..");

require_once("$libdir/php/class/bases/input.php");

/**
 * @brief Test une URL
 * @todo Classe non implémentée
 */
class cInputUrl extends cInput {

    public static function isValid($value) {
        if (empty($value))
            return RESULT(cResult::Failed, cInput::EmptyText);

        return RESULT_OK();
    }

    public static function regExp() {
        //compositions
        $scheme   = '[A-Za-z]{1}[A-Za-z0-9+\.\-]*';
        $port     = '[0-9]+';
        $domain   = '[A-Za-z]{1}[A-Za-z0-9_\.:\-]*'; //Registry-based
        $path     = '[A-Za-z0-9_\.+%\-]*';
        $query    = '[A-Za-z0-9_\.&=+;%\-\(\)\:\/]*';
        $fragment = '[A-Za-z0-9_+%\-]*';
        //var fragment = '(?:'.$alpha.'|'.$digit.'|'.$safe.'|'.$extra.'|'.$escape.')';
 
        return '((' . $scheme . '):/+)?'
                +'(' . $domain . ')?'
                +'^([/' . $path . ']*)([?' . $query . ']?)([#' . $fragment . ']?)';
    }

    public static function getMaxLength() {
        return -1;
    }

}

?>

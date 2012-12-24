<?php

/**
 * Interface de l'application
 * @remark doit être implémenté par l'application pour utiliser les modules Webframework
 * @author Thomas AUGUEY
 */
interface iApplication {
    public static function processLastError();
    function getLibPath($name,$relatif);
    function getTmpPath();
    function getRootPath();
    function getDB(&$db_iface);
    function applyErrorDefinition($code,$message);
}

?>

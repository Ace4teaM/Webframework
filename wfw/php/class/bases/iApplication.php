<?php

/**
 * Interface de l'application
 * @remark doit être implémenté par l'application pour utiliser les modules Webframework
 * @author Thomas AUGUEY
 */
interface iApplication {
    //interfaces
    function getTaskMgr(&$iface);
    function getDB(&$db_iface);
    //path
    function getLibPath($name,$relatif);
    function getTmpPath();
    function getRootPath();
    //cfg
    function getCfgSection($name);
    function getCfgValue($section_name,$item_name);
    //view
    function makeHTMLView($filename,$attributes);
    function makeXMLView($filename,$attributes,$template_file);
    static function processLastError();
    static function translateResult($result);
}

?>

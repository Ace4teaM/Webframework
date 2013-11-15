<?php
/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2013 Thomas AUGUEY <contact@aceteam.org>
    ---------------------------------------------------------------------------------------------------------------------------------------
    This file is part of WebFrameWork.

    WebFrameWork is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WebFrameWork is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WebFrameWork.  If not, see <http://www.gnu.org/licenses/>.
    ---------------------------------------------------------------------------------------------------------------------------------------
*/

/**
 * @file cApplicationCtrl.php
 *
 * @defgroup Application
 * @brief Interface de l'application
 * @{
 */

/**
 * Interface de l'application
 * @remark Doit être implémenté par l'application pour utiliser les modules Webframework
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
    function processLastError();
    function translateResult($result);
}

/** @} */
?>

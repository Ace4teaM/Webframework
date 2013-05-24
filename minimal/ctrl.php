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

/*
 * Point d'entree des controleurs principaux
 */

// include bootstrap
require_once("inc/globals.php");

// use initialised application
global $app;

// make required fields list
if(!$app->makeFiledList(
        $fields,
        array( 'ctrl' ),
        cXMLDefault::FieldFormatClassName )
   ) $app->processLastError();

// make optionals fields list
if(!$app->makeFiledList(
        $op_fields,
        array( 'app' ),
        cXMLDefault::FieldFormatClassName )
   ) $app->processLastError();

// check fields
$p = array();
if(!cInputFields::checkArray($fields,$op_fields,$_REQUEST,$p))
    $app->processLastError();

// execute controller
$app->execCtrl($p->ctrl,$p->app,$app->getRole());


?>
<?php

/*
  ---------------------------------------------------------------------------------------------------------------------------------------
  (C)2012-2013 Thomas AUGUEY <contact@aceteam.org>
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
namespace wfw\yui_config;

use \cApplicationCtrl as cApplicationCtrl;
use \iApplication     as iApplication;

/**
 * @page wfw_data_model Data Model
 * 
 * # Retourne le modèle de données (dictionnaire)
 * 
 * | Informations |                          |
 * |--------------|--------------------------|
 * | PageId       | -
 * | Rôle         | Visiteur
 * | UC           | wfw_datamodel
 * 
 * @param lang Langage pour les textes
 */
class Ctrl extends cApplicationCtrl{
    public $fields    = null;
    public $op_fields = null;

    function output(iApplication $app, $format, $att, $result) {
        switch($format){
            case "text/javascript":
                return 'var wfw_yui_base_path = "'.$app->getCfgValue('path','wfw').'/javascript/yui/";';
        }
        return parent::output($app, $format, $att, $result);
    }
}

?>
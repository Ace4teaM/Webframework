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

class cApplicationCtrl{
    public $fields    = null; /**< Identifiants des champs requis */
    public $op_fields = null; /**< Identifiants des champs optionnels */
    public $att       = null; /**< Source des champs en entrées, si NULL $_REQUEST est utilisé */
//  public $role      = Role::Visitor | Role::User;
    
    /**
     * Point d'entree du controleur
     * @param iApplication $app       Instance de l'application
     * @param string       $app_path  Chemin d'accés à l'application qui à définit le controleur
     * @param StdClass     $p         Paramétres d'entrée
     * @return bool Résutat de procédure
     */
    function main(iApplication $app, $app_path, $p) {
        return RESULT_OK();
    }
};

?>

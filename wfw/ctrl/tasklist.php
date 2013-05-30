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

/**
 * @page wfw_tasklist_ctrl Liste les tâches système
 * 
 * 
 * | Informations |                          |
 * |--------------|--------------------------|
 * | PageId       | -
 * | Rôle         | Administrateur
 * | UC           | maketask
 * 
 * @param lang Langage pour les textes
 */

class wfw_tasklist_ctrl extends cApplicationCtrl{
    public $fields    = null;
    public $op_fields = null;
    
    function acceptedRole(){
        return cApplication::AdminRole;
    }

    function main(iApplication $app, $app_path, $p) {
        if(!$app->getTaskMgr($taskMgr))
            return false;
        
        return $taskMgr->create($p->task_name,$p->task_date,$p->task_cmd);
    }
};

?>
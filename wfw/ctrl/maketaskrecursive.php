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
 * @page wfw_maketaskrecursive_ctrl Initialise une tâche système (recursive)
 * 
 * 
 * | Informations |                          |
 * |--------------|--------------------------|
 * | PageId       | -
 * | Rôle         | Administrateur
 * | UC           | maketaskrecursive
 * 
 * @param task_name  Nom de la tâche
 * @param task_delay Déalis d'exécution en minutes
 * @param task_cmd   Commande système
 */

class wfw_maketaskrecursive_ctrl extends cApplicationCtrl{
    public $fields    = array("task_name","task_delay","task_cmd");
    public $op_fields = null;
    
    function acceptedRole(){
        return cApplication::AdminRole;
    }

    function main(iApplication $app, $app_path, $p) {
        if(!$app->getTaskMgr($taskMgr))
            return false;
        
        return $taskMgr->createRecursive($p->task_name,$p->task_delay,$p->task_cmd);
    }
};

?>
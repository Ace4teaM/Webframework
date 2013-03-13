<?php

/**
 * Implémente l'interface de tâches planifiées pour WINDOWS/NT
 * Remarques:
 * Le logiciel SCHTASKS est requis sur le système
 */
require_once('php/class/bases/iTask.php');

class cSysTask implements iSysTask {

    var $name;
    var $id;
    var $cmd;

    public function cSysTask($name, $cmd) {
        return $name;
    }

    public function getName() {
        return $name;
    }

    public function getCmdLine() {
        return $cmd;
    }

    public function getId() {
        return $id;
    }

}

class cSchTasksMgr implements iSysTaskMgr {

    /**
     * Obtient une tâche par son identificateur (AT spécifique)
     */
    public static function getById(int $id) {
        return new cSysTask($name, "at $id" . $task->getId());
    }

    /**
     * Obtient une tâche par son nom (iSysTaskMgr implémentation)
     */
    public static function get($name) {
        return new cSysTask($name, "at $id" . $task->getId());
    }

    /**
     * Actualise une tâche existante (iSysTaskMgr implémentation)
     */
    public static function set(cSysTask $task) {
        return 0;
    }

    /**
     * Supprime une tâche existante (iSysTaskMgr implémentation)
     */
    public static function delete(cSysTask $task) {
        return 0;
    }

    /**
     * Crée une tâche système
     * 
     * @param $name Nom de la tâche. Si la tâche existe, elle sera remplaée
     * @param $date Date d'execution (temps système)
     * @param $cmd Ligne de commande à exécuter (spécifique au système)
     * 
     * @return Succès de la procédure
     * @retval false La procédure à échouée (voir cResult::getlast)
     * @retval true  La procédure à réussit
     * 
     * @remarks create utilise la global g_app pour obtenir le nom d'utilisateur (SCHTASKS=>USER) et le mot-de-passe (SCHTASKS=>PWD) utilisé pour créer la tâche
     */
    public static function create($name, DateTime $date, $cmd) {
        return RESULT_OK();
    }

    /**
     * Crée une tâche appelant une requête PHP (iSysTaskMgr impl�mentation)
     */
    public static function createPHPRequest($name, DateTime $date, $reqName, $reqName) {
        return NULL;
    }

}

?>
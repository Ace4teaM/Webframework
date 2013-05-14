<?php

/**
 * Implémente l'interface de tâches planifiées pour WINDOWS/NT
 * Remarques:
 * Le logiciel SCHTASKS est requis sur le système
 */
require_once('class/bases/iTask.php');

// initialise les constantes
global $app;
if (isset($app)/* && ($app instanceof Application) */) {
    $user = $app->getCfgValue("SCHTASKS", "USER");
    if (!empty($user))
        define("SCHTASKS_USER", $user);
    $pwd = $app->getCfgValue("SCHTASKS", "PWD");
    if (!empty($pwd))
        define("SCHTASKS_PWD", $pwd);
}

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
        system($task->getCmdLine(), $return_var);
        return $return_var;
    }

    /**
     * Supprime une tâche existante (iSysTaskMgr implémentation)
     */
    public static function delete(cSysTask $task) {
        system("schtasks /delete /u www /tn \"" . $task->getName() . "\"", $return_var);
        //if($return_var!=0)
        //	return procResult(ERR_FAILED,"SYSTEM_ERROR");
        //return procResult(ERR_OK,"DELETE_TASK");
        return $return_var;
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
        //initalise la commande
        $cmd = addcslashes($cmd, '"');
        $cmd = 'schtasks /create /f /tn "' . $name . '" /tr "' . $cmd . '" /sc once /st ' . $date->format("H:i:s");

        // ajoute le mot-de-passe et le nom d'utilisateur
        if (defined("SCHTASKS_USER"))
            $cmd .= ' /ru "' . SCHTASKS_USER . '"';
        if (defined("SCHTASKS_PWD"))
            $cmd .= ' /rp "' . SCHTASKS_PWD . '"';

        //execute la commande
        exec($cmd, $output, $return_var);

//            if(defined("SCHTASKS_USER")) print_r(SCHTASKS_USER);
//            if(defined("SCHTASKS_PWD")) print_r(SCHTASKS_PWD);
//            print_r($output);
//            print_r($cmd."\n[0x".hexdec(intval($return_var))."]\n");
        //ok?
        if (intval($return_var) != 0)
            return RESULT(cResult::System, "SYS_TASK_CREATE", array("type" => "schtasks", "rval" => "0x" . hexdec(intval($return_var)), "cmd" => $cmd, "output" => print_r($output, true)));

        return RESULT_OK();
    }

    /**
     * Crée une tâche appelant une requête PHP (iSysTaskMgr impl�mentation)
     */
    public static function createPHPRequest($name, DateTime $date, $reqName, $reqName) {
        return create($name, $date, "php $reqName ...");
    }

}

?>
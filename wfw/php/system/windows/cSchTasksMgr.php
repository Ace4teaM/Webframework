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
        return RESULT(cResult::Failed,'UNSUPORTED_FEATURE',array('FEATURE'=>'cSchTasksMgr::getById'));
    }

    /**
     * Obtient une tâche par son nom (iSysTaskMgr implémentation)
     */
    public static function get($name) {
        return RESULT(cResult::Failed,'UNSUPORTED_FEATURE',array('FEATURE'=>'cSchTasksMgr::get'));
    }

    /**
     * Actualise une tâche existante (iSysTaskMgr implémentation)
     */
    public static function set(cSysTask $task) {
        return RESULT(cResult::Failed,'UNSUPORTED_FEATURE',array('FEATURE'=>'cSchTasksMgr::set'));
    }

    /**
     * Supprime une tâche existante (iSysTaskMgr implémentation)
     */
    public static function delete(cSysTask $task) {
        return RESULT(cResult::Failed,'UNSUPORTED_FEATURE',array('FEATURE'=>'cSchTasksMgr::delete'));
        
        //initalise la commande
        /*$cmd = 'schtasks /delete /tn '.$task->name;
        
        if (defined("SCHTASKS_USER"))
            $cmd .= ' /u "' . SCHTASKS_USER . '"';

        //execute la commande
        exec($cmd, $output, $return_var);

        //ok?
        if (intval($return_var) != 0)
            return RESULT(cResult::System, "SYS_TASK_DELETE", array("type" => "schtasks", "rval" => "0x" . hexdec(intval($return_var)), "cmd" => $cmd, "output" => print_r($output, true)));

        if(defined("DEBUG")){
            RESULT_OK();
            RESULT_PUSH("cmd",$cmd);
            return true;
        }
        return RESULT_OK();*/
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
        $cmd = 'schtasks /create /f /tn "' . $name . '" /tr "' . $cmd . '" /sc once /sd '.$date->format("d/m/Y").' /st ' . $date->format("H:i:s");

        // ajoute le mot-de-passe et le nom d'utilisateur
        if (defined("SCHTASKS_USER"))
            $cmd .= ' /ru "' . SCHTASKS_USER . '"';
        if (defined("SCHTASKS_PWD"))
            $cmd .= ' /rp "' . SCHTASKS_PWD . '"';
/*
        print_r($cmd);
        print_r($date);
        exit;
 */
        //execute la commande
        exec($cmd, $output, $return_var);

//            if(defined("SCHTASKS_USER")) print_r(SCHTASKS_USER);
//            if(defined("SCHTASKS_PWD")) print_r(SCHTASKS_PWD);
 //           print_r($output);
 //           print_r($cmd."\n[0x".hexdec(intval($return_var))."]\n");
        //ok?
        if (intval($return_var) != 0)
            return RESULT(cResult::System, "SYS_TASK_CREATE", array("type" => "schtasks", "rval" => "0x" . hexdec(intval($return_var)), "cmd" => $cmd, "output" => print_r($output, true)));

        if(defined("DEBUG")){
            RESULT_OK();
            RESULT_PUSH("cmd",$cmd);
            return true;
        }
        return RESULT_OK();
    }

    /**
     * Crée une tâche système recursive
     * 
     * @param $name  Nom de la tâche. Si la tâche existe, elle sera remplaée
     * @param $min   Délais de rappel en minutes
     * @param $cmd   Ligne de commande à exécuter (spécifique au système)
     * 
     * @return Succès de la procédure
     * @retval false La procédure à échouée (voir cResult::getlast)
     * @retval true  La procédure à réussit
     * 
     */
    public static function createRecursive($name, $min, $cmd)
    {
        return RESULT_FAILED(cResult::Failed,"UNSUPORTED_FEATURE",array("FEATURE"=>"cCronTasksMgr::createRecursive"));
    }

    /**
     * Crée une tâche appelant une requête PHP (iSysTaskMgr implementation)
     */
    public static function createPHPRequest($name, DateTime $date, $reqName, $reqName) {
        return create($name, $date, "php $reqName ...");
    }

}

?>
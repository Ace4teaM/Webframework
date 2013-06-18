<?php

/**
 * Implémente l'interface de tâches planifiées pour WINDOWS/NT
 * Remarques:
 * Le logiciel SCHTASKS est requis sur le système
 */
require_once('class/bases/iTask.php');

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

class cCronTasksMgr implements iSysTaskMgr {

    /**
     * Obtient une tâche par son identificateur (AT spécifique)
     */
    public static function getById(int $id) {
        return RESULT(cResult::Failed,cResult::UnsuportedFeature,array('FEATURE'=>'cSchTasksMgr::getById'));
    }

    /**
     * Obtient une tâche par son nom (iSysTaskMgr implémentation)
     */
    public static function get($name) {
        return RESULT(cResult::Failed,cResult::UnsuportedFeature,array('FEATURE'=>'cSchTasksMgr::get'));
    }

    /**
     * Actualise une tâche existante (iSysTaskMgr implémentation)
     */
    public static function set(cSysTask $task) {
        return RESULT(cResult::Failed,cResult::UnsuportedFeature,array('FEATURE'=>'cSchTasksMgr::set'));
    }

    /**
     * Supprime une tâche existante (iSysTaskMgr implémentation)
     */
    public static function delete($name) {
        return RESULT(cResult::Failed,cResult::UnsuportedFeature,array('FEATURE'=>'cSchTasksMgr::delete'));
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
    public static function create($name, DateTime $date, $cmd)
    {
        $this_path = realpath(dirname(__FILE__));
        
        //initialise le nom de l'application
        global $app;
        $web_name=null;
        if(isset($app)){
            $web_name = $app->getCfgValue("application","name");
        }
        if(empty($web_name))
            $web_name = "application";
        
        //initialise la date (Cron format)
        $day_of_month  = $date->format("j"); // Day of the Month  (range: 1-31)
        $month_of_year = $date->format("n"); // Month of the Year (range: 1-12)
        $day_of_week   = $date->format("w"); // Day of the Week   (range: 1-7, 1 standing for Monday)
        $year          = $date->format("Y");           // Year (range: 1900-3000)
        $h             = $date->format("G");           // Hour (range: 0-23)
        $m             = intval($date->format("i"));   // Minute (range: 0-59)
        $cron_time = "$m $h $day_of_month $month_of_year $day_of_week $year";
        
        // execute le script d'initialisation de la tache
        $out = array(); 
        $cmd = addcslashes($cmd, '"');
        $cmd = $this_path."/add_cron_task.sh '$web_name' '$name' '$cron_time' '$cmd'";
        /*
        print_r($cmd);
        exit;
*/
        exec($cmd,$out,$retval); 

        if (intval($retval) != 0)
            return RESULT(cResult::System, "SYS_TASK_CREATE", array("type" => "schtasks", "rval" => "0x" . hexdec(intval($retval)) ."(".$retval.")", "cmd" => $cmd, "cmd_out" => print_r($out, true)));

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
        return RESULT(cResult::Failed,cResult::UnsuportedFeature,array("FEATURE"=>"cCronTasksMgr::createRecursive"));
    }

    /**
     * Crée une tâche appelant une requête PHP (iSysTaskMgr impl�mentation)
     */
    public static function createPHPRequest($name, DateTime $date, $reqName, $reqName) {
        return NULL;
    }

}

?>
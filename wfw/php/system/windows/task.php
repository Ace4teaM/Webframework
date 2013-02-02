<?php
/**
 * Implémente l'interface de tâches planifiées pour WINDOWS/NT
 * Remarques:
 * Le logiciel SCHTASKS est requis sur le système
 */

require_once 'php/class/bases/iTask.php';


class cSysTask implements iSysTask{
	var $name;
	var $id;
	var $cmd;
	public function cSysTask($name,$cmd){return $name;}
	public function getName(){return $name;}
	public function getCmdLine(){return $cmd;}
	public function getId(){return $id;}
}

class cSysTaskMgr implements iSysTaskMgr{
	
	/**
	 * Obtient une tâche par son identificateur (AT sp�cifique)
	 */
	public static function getById(int $id){
		return new cSysTask($name,"at $id".$task->getId());
	}
	/**
	 * Obtient une tâche par son nom (iSysTaskMgr impl�mentation)
	 */
	public static function get( $name){
		return new cSysTask($name,"at $id".$task->getId());
	}
	/**
	 * Actualise une tâche existante (iSysTaskMgr impl�mentation)
	 */
	public static function set(cSysTask $task){
		system ( $task->getCmdLine(), $return_var);
		return $return_var;
	}
	/**
	 * Supprime une tâche existante (iSysTaskMgr impl�mentation)
	 */
	public static function delete(cSysTask $task){
		system ( "schtasks /delete /u www /tn \"".$task->getName()."\"", $return_var);
		//if($return_var!=0)
		//	return procResult(ERR_FAILED,"SYSTEM_ERROR");
		//return procResult(ERR_OK,"DELETE_TASK");
		return $return_var;
	}
	/**
	 * Crée une tâche appelant une commande système (iSysTaskMgr impl�mentation)
	 */
	public static function create( $name,DateTime $date, $cmd){
            $cmd = 'schtasks /create /tn "'.$name.'" /tr "\"'.$cmd.'\"" /sc once /st '.$date->format("H:i:s").' /sd '.$date->format("m/d/Y");
	    return $cmd;
            //return new cSysTask($name,"schtasks /create /tn \"$name\" ".$date->format("H:i")." /tr $cmd");
	}
	/**
	 * Crée une tâche appelant une requête PHP (iSysTaskMgr impl�mentation)
	 */
	public static function createPHPRequest($name,DateTime $date,$reqName,$reqName){
		return create($name,$date,"php $reqName ...");
	}
}

?>
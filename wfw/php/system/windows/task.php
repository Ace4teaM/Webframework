<?php
/**
 * Implémente l'interface de tâches planifiées pour WINDOWS/NT
 * Remarques:
 * Le logiciel SCHTASKS est requis sur le système
 */
class cSysTaskMgr implements iSysTaskMgr{
	
	/**
	 * Obtient une tâche par son identificateur (AT spécifique)
	 */
	public function getById(int $id){
		return new cSysTask($name,"at $id".$task->getId());
	}
	/**
	 * Obtient une tâche par son nom (iSysTaskMgr implémentation)
	 */
	public function get(String $name){
		return new cSysTask($name,"at $id".$task->getId());
	}
	/**
	 * Actualise une tâche existante (iSysTaskMgr implémentation)
	 */
	public function set(cSysTask $task){
		system ( $task->getCmdLine(), &$return_var);
		return $return_var;
	}
	/**
	 * Supprime une tâche existante (iSysTaskMgr implémentation)
	 */
	public function delete(cSysTask $task){
		system ( "schtasks /delete /u www /tn \"".$task->getName()."\"", &$return_var);
		/*if($return_var!=0)
			return procResult(ERR_FAILED,"SYSTEM_ERROR");
		return procResult(ERR_OK,"DELETE_TASK");*/
		return $return_var;
	}
	/**
	 * Crée une tâche appelant une commande système (iSysTaskMgr implémentation)
	 */
	public function create(String $name,DateTime $date,String $cmd){
		return new cSysTask($name,"schtasks /create /tn \"$name\"".$date->format("H:i")." /tr $cmd");
	}
	/**
	 * Crée une tâche appelant une requête PHP (iSysTaskMgr implémentation)
	 */
	public function createPHPRequest($name,DateTime $date,$reqName,$reqName){
		return create($name,$date,"php $reqName ...");
	}
}

class cSysTask implements iSysTask{
	var $name;
	var $id;
	var $cmd;
	public function cSysTask($name,$cmd){return $name;}
	public function getName(){return $name;}
	public function getCmdLine(){return $cmd;}
	public function getId(){return $id;}
}

?>
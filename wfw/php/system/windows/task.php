<?php
/**
 * Impl�mente l'interface de t�ches planifi�es pour WINDOWS/NT
 * Remarques:
 * Le logiciel SCHTASKS est requis sur le syst�me
 */
class cSysTaskMgr implements iSysTaskMgr{
	
	/**
	 * Obtient une t�che par son identificateur (AT sp�cifique)
	 */
	public function getById(int $id){
		return new cSysTask($name,"at $id".$task->getId());
	}
	/**
	 * Obtient une t�che par son nom (iSysTaskMgr impl�mentation)
	 */
	public function get(String $name){
		return new cSysTask($name,"at $id".$task->getId());
	}
	/**
	 * Actualise une t�che existante (iSysTaskMgr impl�mentation)
	 */
	public function set(cSysTask $task){
		system ( $task->getCmdLine(), &$return_var);
		return $return_var;
	}
	/**
	 * Supprime une t�che existante (iSysTaskMgr impl�mentation)
	 */
	public function delete(cSysTask $task){
		system ( "schtasks /delete /u www /tn \"".$task->getName()."\"", &$return_var);
		/*if($return_var!=0)
			return procResult(ERR_FAILED,"SYSTEM_ERROR");
		return procResult(ERR_OK,"DELETE_TASK");*/
		return $return_var;
	}
	/**
	 * Cr�e une t�che appelant une commande syst�me (iSysTaskMgr impl�mentation)
	 */
	public function create(String $name,DateTime $date,String $cmd){
		return new cSysTask($name,"schtasks /create /tn \"$name\"".$date->format("H:i")." /tr $cmd");
	}
	/**
	 * Cr�e une t�che appelant une requ�te PHP (iSysTaskMgr impl�mentation)
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
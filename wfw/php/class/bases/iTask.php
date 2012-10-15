<?php
/**
 * Interface de gestion des tâches planifiées
 */
interface iSysTask{
	public function getName();
	public function getCmdLine();
}

interface iSysTaskMgr{
	/**
	 * Obtient une tâche par son nom 
	 */
	public function get(String $name);
	/**
	 * Actualise une tâche existante
	 */
	public function set(cSysTask $task);
	/**
	 * Supprime une tâche existante
	 */
	public function delete(cSysTask $task);
	/**
	 * Crée une tâche appelant une commande système 
	 */
	public function create(String $name,DateTime $date,String $cmd);
	/**
	 * Crée une tâche appelant une requête PHP 
	 */
	public function createPHPRequest($name,DateTime $date,$reqName,$reqArg);
}

?>
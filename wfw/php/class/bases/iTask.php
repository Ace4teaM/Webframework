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
	public static function get( $name);
	/**
	 * Actualise une tâche existante
	 */
	public static function set(cSysTask $task);
	/**
	 * Supprime une tâche existante
	 */
	public static function delete($name);
	/**
	 * Crée une tâche système 
	 */
	public static function create( $name,DateTime $date, $cmd);
	/**
	 * Crée une tâche système (recursif)
	 */
        public static function createRecursive($name, $min, $cmd);
	/**
	 * Crée une tâche appelant une requête PHP 
	 */
	public static function createPHPRequest($name,DateTime $date,$reqName,$reqArg);
}

?>
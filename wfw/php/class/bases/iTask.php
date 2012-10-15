<?php
/**
 * Interface de gestion des t�ches planifi�es
 */
interface iSysTask{
	public function getName();
	public function getCmdLine();
}

interface iSysTaskMgr{
	/**
	 * Obtient une t�che par son nom 
	 */
	public function get(String $name);
	/**
	 * Actualise une t�che existante
	 */
	public function set(cSysTask $task);
	/**
	 * Supprime une t�che existante
	 */
	public function delete(cSysTask $task);
	/**
	 * Cr�e une t�che appelant une commande syst�me 
	 */
	public function create(String $name,DateTime $date,String $cmd);
	/**
	 * Cr�e une t�che appelant une requ�te PHP 
	 */
	public function createPHPRequest($name,DateTime $date,$reqName,$reqArg);
}

?>
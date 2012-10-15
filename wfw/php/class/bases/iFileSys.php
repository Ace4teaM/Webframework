<?php
/**
 * Interface de gestion des tâches planifiées
 */
interface iFile{
	public function getName();
	public function getPath();
	public function getFileName();
}

interface iFileSysMgr{
	/**
	 * Crée un lien symbolique vers un fichier
	 */
	public function createSymbolicFile(String $src_filename,String $dst_filename);
	/**
	 * Supprime un fichier
	 */
	public function removeFile(String $filename);
	/**
	 * Crée un fichier
	 */
	public function createFile(String $filename);
	/**
	 * Crée un fichier temporaire
	 */
	public function createTempFile(String $filename);
}

?>
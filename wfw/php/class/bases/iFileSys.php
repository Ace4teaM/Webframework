<?php
/**
 * Interface de gestion des fichiers
 */
interface iFile{
	public function getName();
	public function getPath();
	public function getFileName();
}

interface iFileSysMgr{
	/**
	 * Cr�e un lien symbolique vers un fichier
	 */
	public function createSymbolicFile(String $src_filename,String $dst_filename);
	/**
	 * Supprime un fichier
	 */
	public function removeFile(String $filename);
	/**
	 * Cr�e un fichier
	 */
	public function createFile(String $filename);
	/**
	 * Cr�e un fichier temporaire
	 */
	public function createTempFile(String $filename);
}

?>
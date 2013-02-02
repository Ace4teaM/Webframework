<?php
/**
 * Implémente l'interface de tâches planifiées pour UNIX
 * Remarques:
 * Le logiciel CRON est requis sur le système
 */
class cSysTaskMgr implements iSysTaskMgr{
	public function get($name){}
	public function set(iSysTask $task){}
	public function makeCmd($name,$cmd){}
	public function makePHPRequest($name,$reqName,$reqArg){}
}

class cSysTask implements iSysTask{
	var $name;
	var $cmd;
	public function cSysTask($name,$cmd){return $name;}
	public function getName(){return $name;}
	public function getCmdLine(){return $cmd;}
}

?>
<?php
/*
  (C)2012 WebFrameWork
	 Retourne le domain d'une ip
*/
if(!isset($_REQUEST["ip"]))
	exit;
echo @gethostbyaddr($_REQUEST["ip"]);
?>
<?php
/*

	WebFrameWork, v1.3 - Definitions des codes d'erreurs standard
	error.php
	(C)2007-2008 Avalanche, Tout droits reserver
	PHP Code
	
	AUTHOR: Auguey Thomas
	MAIL  : admin@aceteam.fr
	
*/

$_debug = Array();

function print_d($text){
	global $_debug;
	$_debug[] = '['.$_SERVER['SCRIPT_NAME'].'] '.$text;
}

function debug_lines(){
	global $_debug;
	return $_debug;
}

?>

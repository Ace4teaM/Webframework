<?php
/*

	(C)2008-2010 - WebFrameWork 1.3
	Fonctions diverses
	template.php
	(C)2007-2009 Avalanche, Tout droits reserver
	PHP Code
	
	AUTHOR: Auguey Thomas
	MAIL  : admin@aceteam.fr

Fonctions:
	in_array_i
	array_choices
	webfw_Mail
	include_path
	isinit
	array_union

*/

function in_array_i($needle,$ar){
	foreach($ar as $key=>$item){
		if(strcasecmp($needle,$item)==0)
			return $key;
	}
	return false;
}

//string array_choices ( string needle, string default, array ar_choices, [, array search] )
//recherche la valeur d'une clef dans un ou plusieurs tableau(x),
//si non trouver retourne '$default'
function array_choices($key,$default,$ar_choices){
	$numargs = func_num_args();
	for($i=3;$i<$numargs;$i++){ // 3 = premier tableau
		$ar = func_get_arg($i);
		if(is_array($ar)){
			if(isset($ar[$key]) && in_array($ar[$key],$ar_choices))
				return $ar[$key];
		}
	}
	return $default;
}

function key_choices($ar,$key,$default,$choices){
	if(!isset($ar[$key]))
		return $default;
		
	foreach($choices as $key=>$value){
		if($ar[$key] == $value)
			return $value;
	}

	return $default;
}

function choices($src,$default,$choices){

	foreach($choices as $key=>$value){
		if($src == $value)
			return $value;
	}

	return $default;
}

function isinit($first){
	$numargs = func_num_args();
	for($i=0;$i<$numargs;$i++){
		$arg = func_get_arg($i);
		if( !isset($arg) || empty($arg) )
			return false;
	}
	return true;
}

function array_union($array1, $array2) {
	$inter = array_intersect_key($array1, $array2);
	$new   = array_merge($array2 ,$array1);
    foreach($inter as $key=>$item){
		// si texte, colle a la suite!
		if(isset($array2[$key]) && is_string($array2[$key]) && is_string($item))
			$new[$key] = $item.$array2[$key];
	}
	return $new;
}

function wfw_log($str){
  //$file_path = "/var/log/wfw.log";
  $file_path = "wfw.log";
  if($fp = @fopen($file_path,"a")){
    fputs($fp,date().":".$str."\n");
    fclose($fp);
    return TRUE;
  } 
  return FALSE;
}

?>

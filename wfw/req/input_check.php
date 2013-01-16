<?php
/*
	(C)2011 ID-Informatik, WebFrameWork(R). All rights reserved.
	Valide le format d'une chaine de caracteres
  
	Arguments:
		type    : type de format ( voir noms de classes "/include/inputs/..." ) 
		value   : texte a analyser

	Retourne:
		result  : resultat de la requete.

	Revisions:
		[rev 1.1], met a jour le changement du format de reponse des requetes
		[rev 1.2], met a jour le changement de format des requetes, utilise rpost()
		[rev 1.2], filtre l'argument "type"
		[20-12-2011], Met a jour 'ROOT_PATH'
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../")); //racine du site
include(ROOT_PATH.'/php/base.php');
include_path(ROOT_PATH.'/php/');
include_path(ROOT_PATH.'/php/class/bases/');
include_path(ROOT_PATH.'/php/inputs/');

//
// verifie les champs
//
rcheck(
  //requis
  array('type'=>'cInputIdentifier','value'=>''),
  //optionnels
  null
);
  
//
//

//obtient les classes de filtrage
$inputs = get_declared_classes_of("cinput");

$type  = $_REQUEST["type"];
$value = $_REQUEST["value"];
$i     = 0;
$cnt   = count($inputs);
$input;


//recherche la classe type
while(($i<$cnt) && (strtolower($inputs[$i]) != strtolower('cInput'.$type))){
	$i++;
}

if($i>=$cnt){
	rpost_result(ERR_FAILED,"unknown format type: $type");
}

//cree une instance et valide le format
$input_name = $inputs[$i];
$input = new $input_name;

$input->isValid($value);
rpost_result(cResult::getLast()->info);
?>
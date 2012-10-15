<?php
/*

	WebFrameWork, v1.3 - Fonctions utiles pour les tableaux
	array.php
	(C)2010-2011 ID-INFORMATIK, All right reserved
	PHP Code

	AUTHOR: Auguey Thomas
	MAIL  : admin@aceteam.fr

	Revisions:
		[12-12-2011] Ajout de array_length()
*/

//	array_to_tree
//		Convertie un tableau associatif en arboresence
//	Arguments :
//		$simple_array, 
//	Retourne :
//		Tableau associatif des instances de classes trouvées
//	Remarques :
//		Le tableau associatif doit contenir un ou plusieur elements. pour chaque clef est associe une valeur. la clef est un chemain d'accees de noms separe par des points.
//		ex:
//			( "ceci.est.un_chemin"=>"ceci est la valeur 1", "ceci.est.un_autre_chemin"=>"ceci est la valeur 2" )
//		le resultat de sortie sera un tableau comme ceci:
//			+-- "ceci"
//			|      +-- "est"
//			|      |     +-- "un_chemin" => "ceci est la valeur 1"
//			|      |     +-- "un_autre_chemin" => "ceci est la valeur 2"
//			+ ...
//
function array_to_tree($simple_array)
{
	$xml_tree = "";

	//scan chaque element du tableau
	foreach($simple_array as $key=>$value)
	{
	  //explose le chemain d'accees en tableau d'indice
	  $indices = explode('.',$key);
  
	  //cree l'arboresence en tableau 
	  $xml_ptr = &$xml_tree;
	  foreach($indices as $i_name){
		  //si l'indice n'existe pas ajoute...
		  if(!isset($xml_ptr[$i_name]))
		    $xml_ptr[$i_name] = array();
		  //si l'indice precedemment inserer n'est pas un indice, ecrase l'entree par celui-ci
		  else if(!is_array($xml_ptr[$i_name]))
		    $xml_ptr[$i_name] = array();

		  //actualise le pointeur en cours
		  $xml_ptr = &$xml_ptr[$i_name];
	  }
  
	  //assigne la valeur final du texte
	  $xml_ptr = $value;
	  //print_r($xml_tree);
	}

	return $xml_tree;
}

function tree_to_array($tree_array)
{
	$xml_tree = "";

	//scan chaque element du tableau
	foreach($simple_array as $key=>$value)
	{
	  //explose le chemain d'accees en tableau d'indice
	  $indices = explode('.',$key);
  
	  //cree l'arboresence en tableau 
	  $xml_ptr = &$xml_tree;
	  foreach($indices as $i_name){
		  //si l'indice n'existe pas ajoute...
		  if(!isset($xml_ptr[$i_name]))
		    $xml_ptr[$i_name] = array();
		  //si l'indice precedemment inserer n'est pas un indice, ecrase l'entree par celui-ci
		  else if(!is_array($xml_ptr[$i_name]))
		    $xml_ptr[$i_name] = array();

		  //actualise le pointeur en cours
		  $xml_ptr = &$xml_ptr[$i_name];
	  }
  
	  //assigne la valeur final du texte
	  $xml_ptr = $value;
	  //print_r($xml_tree);
	}

	return $xml_tree;
}

function array_length($ar)
{
	$i=0;
	foreach($ar as $item)
		$i++;
	return $i;
}

function array_cmp($ar1,$ar2)
{
	foreach($ar1 as $key=>$value)
	{
		$find_key = array_search($value, $ar2);
		if($find_key===FALSE)
			return false;
	}
	return true;
}

function array_find($ar1,$ar2)
{
	foreach($ar1 as $key=>$value)
	{
		$find_key = array_search($value, $ar2);
		if($find_key!==FALSE)
			return true;
	}
	return false;
}

?>

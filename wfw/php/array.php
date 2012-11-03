<?php
/**
 *******************************************************************************************************
 * 
 * @brief    Fonctions utiles aux tableaux
 * @name  Tableaux
 * 
 * @author   AUGUEY Thomas ( dev@aceteam.fr )
 * @date     12/12/2012
 * 
 *******************************************************************************************************
 */

/**
 * @brief       Convertie un tableau simple en tableau d'arborescence
 * @param       [in] array $simple_array Tableau à convertir 
 * 
 * @return      Tableau en arborescence
 * @retval      array  Tableau en arborescence
 * 
 * @remark      Chaque clé du tableau correspond à un chemin de noms séparé par des points (.)
 * 
 * @par         Exemple
 *              Utilisation de la fonction array_to_tree()
 * @code{.php}
 *              $ar = array(
 *                 "ceci.est.un_chemin"=>"ceci est la valeur 1",
 *                 "ceci.est.un_autre_chemin"=>"ceci est la valeur 2"
 *              );
 * 
 *              print_r( array_to_tree($ar) );
 * @endcode
 *              Sortie:
 * @code
 * Array
 * (
 *     [ceci] => Array
 *         (
 *             [est] => Array
 *                 (
 *                     [un_chemin] => ceci est la valeur 1
 *                     [un_autre_chemin] => ceci est la valeur 2
 *                 )
 * 
 *         )
 * 
 * )
 * @endcode
*/
function array_to_tree($simple_array)
{
	$xml_tree = array();

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

/**
 * @attention   Cette fonction n'est pas implémenté, elle retournera toujours NULL
 * 
 * @brief       Convertie un tableau d'arborescence en tableau simple
 * @param       [in] array $tree_array Tableau à convertir 
 * 
 * @return      Tableau
 * @retval      array  Tableau associatif
*/
function tree_to_array($tree_array)
{
	return null;
}

/**
 * @brief       Obtient la taille d'un tableau
 * @param       [in] array $ar Tableau à examiner
 * 
 * @return      Taille du tableau
 * @retval      int  Nombre d'élément(s) dans le tableau
*/
function array_length($ar)
{
	$i=0;
	foreach($ar as $item)
		$i++;
	return $i;
}

/**
 * @brief       Compare deux tableaux
 * @param       [in] array $ar1 Tableau à comparer
 * @param       [in] array $ar2 Tableau à examiner
 * 
 * @return      Différence entre les deux tableaux
 * @retval      false une ou plusieur clés de \c $ar1 est introuvable dans \c $ar2
 * @retval      true toutes les clés de \c $ar1 sont existantes dans \c $ar2
*/
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

/**
 * @brief       Alias de la fonction \link array_cmp
*/
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

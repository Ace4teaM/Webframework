<?php
/*

	(C)2008-2010 - WebFrameWork 1.3
	Fonctions utiles a la recherche dans un texte
	str_search.php
	Avalanche, Tout droits reserver
	PHP Code
	
	AUTHOR: Auguey Thomas
	MAIL  : augueyace@wanadoo.fr

	Fonction       PHP   
	               4.0  5.0 
	strfnd         [?]  [?]

*/


/*
	Versions: PHP(5)

	strfnd
	  Recherche d'un texte dans un autre.
	parametres:
	  [str]        string : Texte a scaner
	  [words]      string : Texte rechercher
	  [sameCase]   bool   : si true, la case des caracteres rechercher doit etre identique au texte 
	  [wholeWords] bool   : si true, le texte doit etre exactement le meme, sinon au moins un mot est rechercher
    retourne:
	  [bool] 1 si le texte est trouver, sinon 0
*/
function strfnd($str,$words,$sameCase=false,$wholeWords=false){
	//recherche le texte exacte
	if($sameCase&&$wholeWords){
		if(strpos($str,$words)===false)
			return 0;
		return 1;
	}
	//recherche le texte exacte sans comparaisons de majuscules et minuscules
	if($wholeWords){
		if(stripos($str,$words)===false)
			return 0;
		return 1;
	}
	$str_size = strlen($str);
	//convertie le texte en mots
	$words_ar = strw_to_array($words);
	//recherche une partie du texte avec comparaisons de majuscules et minuscules
	if($sameCase){
		//recherche un des mots dans le texte
		/*foreach($words_ar as $key=>$word){
			if(strpos($str,$word)!==false)
				return 1;
		}*/
		foreach($words_ar as $key=>$word){
			$pos = strpos($str,$word);
			if($pos!==false){
				//obtient le caractere suivant du mot
				$c = ' ';
				if($pos+strlen($word)<$str_size)
					$c = substr($str,$pos+strlen($word),1);
				//obtient le caractere precedent du mot
				$lc = ' ';
				if($pos)
					$lc = substr($str,$pos-1,1);
				//si le caractere suivant et precedent marque la fin et le debut d'un mot, Ok
				if((($c==' ')||($c=='\n'))&&(($lc==' ')||($lc=='\n')))
					return 1;
			}
		}
		return 0;
	}
	//recherche une partie du texte sans comparaisons de majuscules et minuscules

	//recherche un des mots dans le texte
	foreach($words_ar as $key=>$word){
		$pos = stripos($str,$word);
		if($pos!==false){
			//obtient le caractere suivant du mot
			$c = ' ';
			if($pos+strlen($word)<$str_size)
				$c = substr($str,$pos+strlen($word),1);
			//obtient le caractere precedent du mot
			$lc = ' ';
			if($pos)
				$lc = substr($str,$pos-1,1);
			//si le caractere suivant et precedent marque la fin et le debut d'un mot, Ok
			if((($c==' ')||($c=='\n'))&&(($lc==' ')||($lc=='\n')))
				return 1;
		}
	}
	return 0;
}


?>

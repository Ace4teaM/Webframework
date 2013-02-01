<?php
/*

	WebFrameWork, v1.1 - Fonctions de textes utiles
	string.php
	(C)2007-2008 Avalanche, Tout droits reserver
	PHP Code
	
	AUTHOR: Auguey Thomas
	MAIL  : augueyace@wanadoo.fr

Fonctions:
	str_nextline
	str_insert
	strl_to_array
	strw_to_array

	webfw_StringParamsToTable
	webfw_StringValuesParamsToTable
	webfw_StringTableToValuesParams
	webfw_StringValidate
	webfw_StringValidateValues
	webfw_StringValidateSession

Revisions:
  [26-09-2011] Add str_explode()
  [12-10-2011] Debug str_explode(), empty considere "0" comme une chaine vide [resolue]
*/

///////////////////////////////////////////////////////
// STRING FONCTIONS
///////////////////////////////////////////////////////

/*
	Versions: PHP(4,5)

	str_nextline
	  Lit le texte jusqu'a la prochaine ligne marquer par un 'line feed' [\n] et retourne la chaine
	parametres:
	  [string]  string   : Texte de base (ASCII)
	  [int]     max      : Taille max de "string" en nombre de caracteres
	  [&int]    ofs      : Reference sur l'offset en cours dans "string".
	                       L'offset est incrementer automatiquement a chaque appel de la fonction.
					       Initialiser lors du premiere appel, zero pour commencer du debut
	  [bool]    btrim    : si true supprime les espaces en debut de ligne si present, true par defaut
	  [bool]    btrim_cr : si true supprime le 'carriage return' en fin de ligne si present, true par defaut
    retourne:
	  [string] chaine de la ligne, false si la fin du texte a ete attiend
	remarques:
	  Compatible ASCII seulement
*/
function str_nextline($string,$max,&$ofs,$btrim=true,$btrim_cr=true){
	$linesize=strpos(substr($string,$ofs), 10);
	//echo $linesize.", ";
	if($linesize===false){
		//derniere ligne
		if($ofs<$max){
			$line = substr($string,$ofs);
			$ofs=$max;
		}
		else//fin de texte
			return false;
	}
	else{
		//extrer la ligne
		$line = substr($string,$ofs,$linesize);
		$ofs+=$linesize+1;
	}
		
	//si un "carriage return" '\r' est present en fin de ligne, supprime!
	if(($btrim_cr) && ($linesize) && (ord($line[$linesize-1])==13))
		$line=substr_replace($line,"",$linesize-1,1);
/*
	if(PHP_MAJOR_VERSION<5){
		$line = substr($string,$ofs,$linesize);
		$ofs+=$linesize+1;
	}
	else{
		$line = substr($string,$ofs,$linesize-1);
		$ofs+=$linesize+1;
	}*/
	
	//supprime les espaces en debut de ligne
	if($btrim)
		$line=ltrim($line, " ");
	//while(($i<$linesize)&&($line[$i]==" "))
	return $line;
}

/*
	Versions: PHP(4,5)

	str_insert
	  Insert un fragement de texte dans une chaine a l'offset donnée
	parametres:
	  [string] string : Texte de base
	  [int]    start  : Offset dans "string" en nombre de caracteres
	  [string] insert : Texte a inserer
    retourne:
	  [string] nouvelle chaine
	remarques:
	  Compatible ASCII seulement
*/
function str_insert($string,$start,$insert){
	$size  = strlen($string);
	$left  = substr($string,0,$start);
	$right = substr($string,$start,$size-$start+1);
	return $left.$insert.$right;
}

/*
	Versions: PHP(4,5)

	strl_to_array
	  Convertie les lignes d'un texte en tableau.
	parametres:
	  [string] string : Texte
    retourne:
	  [array] tableau des lignes de textes au format:
	              array( [0]=>"Ligne 1", [1]=>"Ligne 2", ... , [n]=>"Ligne n" )
	remarques:
	  Compatible ASCII seulement
*/
function strl_to_array($string){
	$ar=array();
	$max = strlen($string);
	$ofs = 0;
	$line=false;
	do{
		$line=str_nextline($string,$max,$ofs);
		if($line!==false){
			$ar[]=$line;
		}
	}while($line!==false);
	return $ar;
}

/*
	Versions: PHP(3,4,5)

	strw_to_array
	  Convertie les mots d'un texte en tableau.
	parametres:
	  [string] string : Texte
	  [sep]    string : Chaine des caracteres de separations des mots, ' \n' par defaut
    retourne:
	  [array] tableau des mots de textes au format:
	            array( [0]=>"Mot 1", [1]=>"Mot 2", ... , [n]=>"Mot n" )
	remarques:
	  Compatible ASCII seulement
*/
function strw_to_array($string,$sep=" \n"){
	$ar=array();
	$max = strlen($string);
	$max_sep = strlen($sep);
	$ofs = 0;
	$word = "";
	for($x=0;$x<$max;$x++){
		$c = substr($string,$x,1);
		//
		$bfind = false;
		for($s=0;$s<$max_sep;$s++){
			if($c == substr($sep,$s,1)){
				$bfind = true;
				$s=$max_sep;
			}
		}
		if($bfind){
			if(!empty($word))
				$ar[] = $word;
			$word = "";
		}
		else
			$word .= $c;
	}
	if(!empty($word)){
		$ar[] = $word;
	}
	if(empty($ar))
		return false;
	return $ar;
}


/*
 * @brief Convertie une chaine de paramétres en tableau associatif
 * 
 * @param string $string Chaine à convertir
 * @param string $septag Caractère(s) de separation nom/valeur, ':' par défaut
 * @param string $endtag Caractère(s) de fin de paramétre, ';' par défaut
 * @return Tableau associatif des paramétres
*/
function stra_to_array($string,$septag=":",$endtag=";"){
	$table=array();
	$tok = strtok($string, $septag.$endtag);
	$name=$tok;
	$value=false;
	while ($tok !== false) {
		$tok = strtok($septag.$endtag);
		if($name===false)
			$name=$tok;
		else{
			$value=$tok;
			$table[$name] = $value;
			$name=false;
			$value=false;
		}
	}
	return $table;
}

function is_strchar($str,$chr){
	for($i=0;$i<strlen($str);$i++){
		if(strstr($chr,substr($str,$i,1))===false)
			return false;
	}
	return true;
}

function is_strof($str,$chr){
	for($i=0;$i<strlen($str);$i++){
		$ok=0;
		for($x=0;$x<strlen($chr);$x++){
			if($chr[$x]==$str[$i]){
				$ok=1;
				$x=strlen($chr);//termine la boucle
			}
		}
		if(!$ok)
			return false;
	}
	return true;
}

function is_not_strof($str,$chr){
	for($i=0;$i<strlen($str);$i++){
		for($x=0;$x<strlen($chr);$x++){
			if($chr[$x]==$str[$i]){
				return false;
			}
		}
	}
	return true;
}

/*
	Versions: PHP(3,4,5)

	webfw_StringParamsToTable
	  Découpe les zones d'un texte séparés par le caractere specifier.
	parametres:
	  [string] item_name : Texte
	  [char]   sep       : Caractere de separation, par defaut un point '.'
	  [bool]   blower    : Si true le texte est convertie en minuscule avant d'etre inserer au tableau
    retourne:
	  [array] tableau indexé des chaines de caracteres.
	remarques:
	  Compatible ASCII seulement

	exemple:
		print_r( webfw_StringParamsToTable("First.Second.Last", '.') );
		output:
			Array
			(
				[0] => "First",
				[1] => "Second",
				[2] => "Last"
			)
*/
function webfw_StringParamsToTable($item_name,$sep=".",$blower=true){
	$table=array();
	$tok = strtok($item_name,$sep);
	while ($tok !== false) {
		if($blower===true || $blower===false)
			$tok = (($blower)?(strtolower($tok)):($tok));
		$table[]=$tok;
		$tok = strtok($sep);
	}
	return $table;
}
function webfw_StringParamsToTable2($item_name,$sep=".",$parse_func="strtolower"){
	$table=array();
	$tok = strtok($item_name,$sep);
	while ($tok !== false) {
		if(function_exists($parse_func))
			$tok = $parse_func($tok);
		$table[$tok]="";
		$tok = strtok($sep);
	}
	return $table;
}

/*
	Versions: PHP(3,4,5)

	webfw_StringValuesParamsToTable
	  Découpe les zones d'un texte par paire séparés par les caracteres specifiés.
	parametres:
	  [string] string : Texte
	  [char]   septag : Caractere de separation entre le nom et la valeur, par defaut ':'
	  [char]   endtag : Caractere de fin de valeur, par defaut ';'
    retourne:
	  [array] tableau des paires 'nom' => 'valeur'.
	remarques:
	  Compatible ASCII seulement

	exemple:
		print_r( webfw_StringValuesParamsToTable("a:First;b:Second;c:Last", ':' ,';') );
		output:
			Array
			(
				"a" => "First",
				"b" => "Second",
				"c" => "Last"
			)
*/
function webfw_StringValuesParamsToTable($string,$septag=":",$endtag=";"){
	$table=array();
	$tok = strtok($string, $septag.$endtag);
	$name=$tok;
	$value=false;
	while ($tok !== false) {
		$tok = strtok($septag.$endtag);
		if($name===false)
			$name=$tok;
		else{
			$value=$tok;
			$table[] = array($name=>$value);
			$name=false;
			$value=false;
		}
	}
	return $table;
}
function webfw_StringValuesNamedToTable($string,$septag=":",$endtag=";"){
	$table=array();
	$tok = strtok($string, $septag.$endtag);
	$name=$tok;
	$value=false;
	while ($tok !== false) {
		$tok = strtok($septag.$endtag);
		if($name===false)
			$name=$tok;
		else{
			$value=$tok;
			$table[$name] = $value;
			$name=false;
			$value=false;
		}
	}
	return $table;
}

/*
	Versions: PHP(5)

	webfw_StringTableToValuesParams
	  Assemble dans un texte par paire les elements d'un tableau.
	parametres:
	  [array]  table : Tableau des elements de texte
	  [char]   septag : Caractere de separation entre le nom et la valeur, par defaut ':'
	  [char]   endtag : Caractere de fin de valeur, par defaut ';'
    retourne:
	  [string] Texte assemblé
	remarques:
	  Cette fonction execute l'inverse de webfw_StringValuesParamsToTable.
	  Compatible ASCII seulement.
*/
function webfw_StringTableToValuesParams($table,$septag=":",$endtag=";"){
	$string="";
	foreach($table as $key=>$ar){
		if($endtag===false)
			$string .= $key.$septag;
		else if($septag===false)
			$string .= $ar.$endtag;
		else
			$string .= key($ar).$septag.$ar[key($ar)].$endtag;
	}
	return $string;
}

/*
	Versions: PHP(3,4,5)

	webfw_StringValidate
	  Valide le texte en remplacent les caracteres de syntaxe HTML avec leurs codes respectifs.
	Parametres:
	  [string] text  : Texte a valider.
	Retourne:
	  [string] La nouvelle chaine 'text' une fois valider.
*/
function webfw_StringValidateHTML($text,$tagOnly=false){

	if($tagOnly){
		$search  = array("&"    , "<"   , ">" );
		$replace = array("&amp;", "&lt;", "&gt;" );
		$text    = str_replace($search, $replace, $text);
	}
	else{
		$search  = array("&"    , "<"   , ">" );
		$replace = array("&amp;", "&lt;", "&gt;" );
		$text    = str_replace($search, $replace, $text);
		$search  = array("'"    , "\\"   , "\n"   , "  "     , "	" );
		$replace = array("&#39;", "&#92;", "<br/>", "&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;" );
		$text    = str_replace($search, $replace, $text);
	}
	return $text;
}
function webfw_StringValidate($text){
	$text = webfw_StringValidateHTML($text);
	return webfw_ConvertBytesString_To_Unicode($text,1);//convertion UTF-8 des caractere non ASCII
/*	return htmlspecialchars($text);*/
}

/*
	Versions: PHP(4,5)

	webfw_StringValidateValues
	  Remplace les zones de textes délimités avec les balises specifier par les elements associatif du tableau.
	Parametres:
	  [string&]      string  : Chaine de caractere a traité
	  [string array] values  : Tableau contenent les valeurs associatif
	  [char]         c_enter : Texte indiquant le debut d'une balise
	  [char]         c_close : Texte indiquant la fin d'une balise
    Retourne:
	  [string]  la chaine 'string' passé en argument une fois modifier.
    Remarques:
	  Toutes les références de noms compris entre les textes 'c_enter' et 'c_close' sont remplacé par leurs elements associatif du tableau 'values'.

	exemple:
		$string = "MyValue = {myvalue}";
		$values = array( "myvalue"=>"HelloWorld" );
		echo webfw_StringValidateValues($string,$values);

		output:
			"MyValue = HelloWorld"
*/
function webfw_StringValidateValues($string,$values,$c_enter="{",$c_close="}"){
	//print_r($values);
//	echo("<textarea style='width:100%'>".webfw_StringValidateHTML($string)."</textarea>");
	$start = 0;
	
	//obtient l'offset du debut de la balise
	$last_ofs=strpos($string,$c_enter);
	if($last_ofs===false) return $string;
	//obtient l'offset de fin de la balise
	$ofs=strpos($string,$c_close,$last_ofs+strlen($c_enter));
	if($ofs===false) return $string;
	
	while(($ofs!==false)&&($last_ofs!==false)){
		//extrer le texte entre les balises de debut et fin '$c_enter' '$c_close'
		$sub = substr($string,$last_ofs+strlen($c_enter),($ofs-($last_ofs+strlen($c_enter))));
	//	echo "<p>$sub</p>";
	//	echo($sub." (test)<br/>");
		//remplace le texte par la valeur associer si existante
		if(isset($values[$sub])){
		//	echo($values[$sub]." (repl) for $sub<br/>");
			//remplace les balises avec le texte par la valeur associer
			$string = substr_replace($string,$values[$sub],$last_ofs,($ofs-$last_ofs)+strlen($c_close));
			//avance le pointeur apres le texte nouvellement inserer
			$start = $last_ofs+strlen($values[$sub]);
//			echo("size ".strlen($values[$sub])." '".$values[$sub]."' <br/>");
		}
		//sinon, deplace l'offset du debut de la recherche apres cette item pour empecher de retomber dessus indefiniment
		else
			$start=$ofs;//saute la balise en cours
//		echo("start $start '$sub' size <br/>");
//		echo("<textarea style='width:100%'>".webfw_StringValidateHTML($string)."</textarea>");
		//continue la recherche
		$last_ofs=strpos($string,$c_enter,$start);
		if($last_ofs===false) return $string;
	//	echo("webfw_StringValidateValues: $string ## '$c_close', ofs: ".($last_ofs+strlen($c_enter))."<br/>");
		$ofs=strpos($string,$c_close,$last_ofs+strlen($c_enter));
	}
	return $string;
}

function wefw_SearchChar($str,$char,$sameCase){
	if($sameCase){
		if(strpos($str,$char)===false)
			return false;
		return true;
	}
	if(stripos($str,$char)===false)
		return false;
	return true;
}

/*
	Versions: PHP(4,5)

	webfw_StringEnumRef
	  Enumere les balises contenu dans un tampon texte.
	Parametres:
	  [string&]      string  : Chaine de caractere a traité
	  [string array] values  : Tableau contenent les valeurs associatif
	  [char]         c_enter : Texte indiquant le debut d'une balise
	  [char]         c_close : Texte indiquant la fin d'une balise
    Retourne:
	  [string]  la chaine 'string' passé en argument une fois modifier.
    Remarques:
	  Toutes les références de noms compris entre les textes 'c_enter' et 'c_close' sont remplacé par leurs elements associatif du tableau 'values'.
*/
function webfw_StringEnumRef($string,$refs,$ar_key=true,$c_enter="{",$c_close="}",$acceptchar="0123456789abcdefghijklmnopqrstuvwxyz:_&|<>=!#-;.'?@/\\"){
	$start = strpos($string,$c_enter);
	//$length = 0;
	$ofs = $start+strlen($c_enter);
	$find = "";
	if($ofs===false)
		return $string;
	while($ofs<strlen($string)){
		$c = substr($string,$ofs,1);
		if( !wefw_SearchChar($acceptchar,$c,0)){
			//fin de tag
			if(substr($string,$ofs,strlen($c_close))==$c_close){
//				echo "fin de tag<br/>";
				$ofs += strlen($c_close);
				if($ar_key)
					$refs[] .= $find;
				else 
					$refs[$find] = "";
				return webfw_StringEnumRef(substr($string,$ofs),$refs,$ar_key,$c_enter,$c_close,$acceptchar);
			}
			//debut de tag
			if(substr($string,$ofs,strlen($c_enter))==$c_enter){
//				echo "debut de tag<br/>";
				$ofs += strlen($c_enter);
				return webfw_StringEnumRef(substr($string,$ofs),$refs,$ar_key,$c_enter,$c_close,$acceptchar);
			}
//			echo "!wefw_SearchChar ($c) <br/>";
			return webfw_StringEnumRef(substr($string,$ofs+1),$refs,$ar_key,$c_enter,$c_close,$acceptchar);
		}
		else{
			$find .= $c;
			$ofs++;
		}
	}
//	print_r($refs);
	return $refs;
}


function webfw_StringEnumRef2($string,$refs,$c_enter="{",$c_close="}"){

	//print_r($values);
//	echo("<textarea style='width:100%'>".webfw_StringValidateHTML($string)."</textarea>");
	$start = 0;

	//obtient l'offset du debut de la balise
	$last_ofs = strpos($string,$c_enter);
	if($last_ofs===false) return $string;
	//obtient l'offset de fin de la balise
	$ofs = strpos($string,$c_close,$last_ofs+strlen($c_enter));
	if($ofs===false) return $string;

	while(($ofs!==false)&&($last_ofs!==false)){
		//extrer le texte entre les balises de debut et fin '$c_enter' '$c_close'
		$sub = substr($string,$last_ofs+strlen($c_enter),($ofs-($last_ofs+strlen($c_enter))));
	/*	echo("<textarea style='width:100%'>");
		echo($sub);
		echo("</textarea>");*/
		$refs[] = $sub;
		$start = $ofs+strlen($c_close);//avance le pointeur du texte nouvellement extrer
		//continue la recherche
		$last_ofs=strpos($string,$c_enter,$start);
		if($last_ofs===false) return $refs;
		$ofs=strpos($string,$c_close,$last_ofs+strlen($c_enter));
	}
	return $refs;
}


/*
	Versions: PHP(4,5)

	webfw_StringValidateSession
		Appel webfw_StringValidateValues avec les valeurs de refrences $_SESSION délimités par des diéses '#"
	Parametres:
	  [string&] string  : Chaine de caractere a traité
	Retourne:
	  [string]  la chaine 'string' passé en argument une fois modifier.
	Remarques:
	  Voir la fonction webfw_StringValidateValues
*/
function webfw_StringValidateSession(&$string){
	return webfw_StringValidateValues($string,$_SESSION,"#","#");
}

/*
	Versions: PHP(4,5)

	str_explode
	  Explose une chaine en morceaux
	parametres:
	  [string] text      : Texte 
	  [string] separator : Texte de separation
	  [string] bTrim     : Si true les espaces blanc sont supprimes en debut est fin de chaine
    retourne:
	  [array] tableau des elements de la chaine
	remarques:
	  Les elements vides sont ignores
*/
function str_explode($text,$separator,$bTrim){
	$ar = explode($separator,$text);

  $ar2 = array();
  foreach($ar as $value)
  {
    if($bTrim)
      $value=trim($value);
    if(strlen($value))
      array_push($ar2,$value);
  }
	return $ar2;
}               
 
    
?>

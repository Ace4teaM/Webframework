<?php
/*
	(C)2010-2012 ID-INFORMATIK - WebFrameWork(R)
	Fonctions utiles aux requêtes 
	
	AUTHOR: Auguey Thomas

	Revisions:
		[22-10-2010] rpost_result() ajout de l'argument optionnel $info.
		[22-10-2010] rpost_result() termine le script par la fonction exit avec le code d'erreur donne.   
		[25-10-2010] Debug wfw_request_post_xarg_v2_urlencoded() et wfw_request_post_xarg_v3_urlencoded(), mauvais code de caractere retourne pour '/' [resolue].
		[02-02-2011] Ajout de rcheck()
		[02-02-2011] Ajoute l'encodage des caracteres 'espace', '.' et '-' aux fonctions wfw_request_post_xarg_v2_urlencoded() et wfw_request_post_xarg_v3_urlencoded() 
		[16-02-2011] exitFormRequest() prend en charge la taille maximum alloue pour une URL, en cas de depassement, la fonction retourne une chaine d'erreur.
		[17-02-2011] Ajout de wfw_request_post_xarg_v4() et des constantes XARG_START_OF_TEXT_CODE, XARG_END_OF_TEXT_CODE, XARG_START_OF_TEXT_CHAR, XARG_END_OF_TEXT_CHAR
		[25-02-2011] rexec() securise la construction de la ligne de commande.
		[03-06-2011] detection automatique du format de requete depuis l'argument 'wfw_req_response_type'
		[03-06-2011] Ajoute le format de sortie XML : useXMLRequest()
		[20-10-2011] Ajout de xarg_req() et x_request_arguments_parse()
		[12-01-2012] Debug, xarg_req(), mauvaise interpretation du code de retour de la commande [resolue]
		[21-01-2012] Debug, wfw_request_post_xarg_v4_urlencoded() utilise rawurlencode() pour encoder les caracteres speciaux
		[21-01-2012] Update wfw_request_post_xarg_v4() et wfw_request_post_xarg_v4_urlencoded(), vérifie la présence des caracteres de controles interdit
*/
global $_req_output;
global $_req_log;
global $_req_post_fmt;
global $_req_post_func;  
global $_req_exit_func;
global $_req_err_str;    // tableau associatif des descriptions des erreurs
global $_err_callback;   // appelé par result_check(). Définit dans "error.php"

$_req_post_fmt  = "wfw_request_post_xarg_v4";
$_req_post_func = "wfw_request_output";   
$_req_exit_func = NULL;
$_req_log       = "req_log.txt";
$_req_err_str   = array("coucou"=>"c'est nous");
$_err_callback  = "req_err_callback";

/////////////////////////////////////////////////////////////////////////////
// Test le format de sortie de la requete          
if(isset($_REQUEST["wfw_req_response_type"])){
	switch($_REQUEST["wfw_req_response_type"]){
		case "form":
			useFormRequest();
			break; 
		case "hidden":
			useHiddenRequest();
			break;   
		case "xml":
			useXMLRequest();
			break;    
		case "xarg": //defaut
			useXARGRequest();
			break;
	}
}

define("MAX_URI_LENGTH",2083);

define("XARG_START_OF_TEXT_CODE",0x02);
define("XARG_END_OF_TEXT_CODE",0x03); 
define("XARG_START_OF_TEXT_CHAR",chr(XARG_START_OF_TEXT_CODE));
define("XARG_END_OF_TEXT_CHAR",chr(XARG_END_OF_TEXT_CODE));


//verifie le code retoure d'une procedure
function req_err_callback($err_code,$err_str) {
	return rpost_result($err_code,$err_str);
}

/*
 x_request_arguments_parse
    Convertie le corps d'un texte 'text/wfw.xra' en object
    Parametres:
        [string] text    : corps du document
        [bool] bencoded  : si positif, scan le texte avec l'encodage d'une URL
    Retourne:
       L'Objet nouvellement creer
*/
function x_request_arguments_parse($text,$bencoded) {//v4
	$rslt = array();
	$begin_pos = 0;
	$pos;
	$separator = XARG_START_OF_TEXT_CHAR;
	$end       = XARG_END_OF_TEXT_CHAR;

	if($bencoded){
		$separator = "%02";//STX
		$end       = "%03";//ETX
	}

	while(($pos=strpos($text,$separator,$begin_pos)) !== FALSE)
	{
		$pos2  = strpos($text,$end,$pos);
		if($pos2 === FALSE){ // fin anticipe
			print_d("x_request_arguments_parse(), attention: fin anormale de requete!");
			return $rslt;
		}                                               

		$name  = substr($text,$begin_pos,$pos-$begin_pos);
		$value = substr($text,$pos+strlen($separator),$pos2-($pos+strlen($separator)));

		$begin_pos = $pos2+strlen($end); //prochaine position de depart

		$rslt[$name]=$value;
	}
	return $rslt;
}

/////////////////////////////////////////////////////////////////////////////
// Verifie l'existance et le format des champs d'une requete
function rcheck($required_arg,$optionnal_arg)
{
	
	//verifie les elements requis...
	if(is_array($required_arg)){
		foreach($required_arg as $arg_name=>$arg_type)
		{
			//existe?
			if(!isset($_REQUEST[$arg_name]) || empty_string($_REQUEST[$arg_name])){
				rpost_result(ERR_REQ_MISSING_ARG, $arg_name);
			}
			//verifie le format si besoin    
			if(!empty($arg_type))
			{
				$result=$arg_type::isValid($_REQUEST[$arg_name]);
				if($result!=ERR_OK)
					rpost_result($result, "$arg_name = \"".$_REQUEST[$arg_name]."\"");
			}
		}
	} 
	//verifie les elements optionnels...  
	if(is_array($optionnal_arg)){
		foreach($optionnal_arg as $arg_name=>$arg_type)
		{
			//existe?
			if(isset($_REQUEST[$arg_name]) && !empty($arg_type)){
				//verifie le format
				$result=$arg_type::isValid($_REQUEST[$arg_name]);
				if($result!=ERR_OK)
					rpost_result($result, "argument = $arg_name, $result, value = ".$_REQUEST[$arg_name]);
			}
		}
	}
	return true;
}
/////////////////////////////////////////////////////////////////////////////
// Execute une requete PHP (XARG)

function xarg_req($base_path,$request_name,$arg)
{
	$cmd_ret = rexec($base_path,$request_name,$arg,$cmd_out);
	//termine
	$xarg = x_request_arguments_parse(implode("\n",$cmd_out),FALSE);
	if(empty($xarg))
		return null;
	//if($cmd_ret != 0)//xarg retourne le code de resultat
	//	return NULL;
	return $xarg;
}

/////////////////////////////////////////////////////////////////////////////
// Execute une requete PHP avec retour de resultat (XARG)

function xarg_req_result($base_path,$request_name,$arg,&$out_arg)
{
	$cmd_ret = rexec($base_path,$request_name,$arg,$cmd_out);
	//termine
	$xarg = x_request_arguments_parse(implode("\n",$cmd_out),FALSE);
	if(empty($xarg))
		return rpost_result(ERR_REQ, "PATH=".ROOT_PATH.'/private/req/client/'."\nREQ=$request_name\nARG=".print_r($arg,true)."\nOUT=".print_r($cmd_out,true));
	$out_arg = $xarg;
	return proc_result($xarg["result"], (isset($xarg["info"]) ? $xarg["info"] : ""));
}

/////////////////////////////////////////////////////////////////////////////
// Execute une requete PHP

function rexec($base_path,$request_name,$arg,&$cmd_out)
{   
	//construit la ligne de commande avec ses arguments
	$cmd="php $request_name.php";
	foreach($arg as $key=>$value){   
		//verifie l'identificateur
		if(cInputIdentifier::isValid($key) != ERR_OK)
			continue;
		//remplace les quotes de la valeur
		$value=str_replace('"','\"',$value);
		//ajoute l'argument a la ligne de commande
		$cmd.=' '.$key.'="'.$value.'"';
	}
	//change le dossier de travail en cours (essentiel pour le bon fonctionnement des chemins relatifs sous php en ligne de commande)      
	$cwd = getcwd();
	chdir($base_path);    
	//execute la commande
	$out = array(); 
	exec($cmd,$out,$cmd_ret);    
	$cmd_out = $out;
	//restore le repertoire de travail precedent   
	chdir($cwd);
	//termine
	return $cmd_ret;   
}

/////////////////////////////////////////////////////////////////////////////
// Execute une commande systeme et retourne le resultat

function run($base_path,$cmd,&$cmd_out)
{        
	//sauve le repertoire de travail       
	$cwd = getcwd();
	//change le dossier de travail en cours (essentiel pour le bon fonctionnement de certain script)   
	chdir($base_path); 
	//       
	$out = array(); 
	exec($cmd,$out,$cmd_ret);  
	$cmd_out = $out;
	//restore le repertoire de travail  
	chdir($cwd);   
	//termine
	return $cmd_ret;
}

function cmd($cmd,&$cmd_out)
{
	$out = array();     
	exec($cmd,$out,$cmd_ret);
	$cmd_out = $out; 
	//termine
	return $cmd_ret;
}

/////////////////////////////////////////////////////////////////////////////
// Formats de sortie

function wfw_request_output_log($text){
	global $_req_log;
	file_put_contents($_req_log,$text,FILE_APPEND);
}

function wfw_request_output_var($text){
	global $_req_output;
	$_req_output .= $text;
}

function wfw_request_output($text){
	echo $text;
}


/////////////////////////////////////////////////////////////////////////////
// Formats de syntaxe

function wfw_request_post_xarg_v1($title,$msg){
	return "$title:$msg;";
}

function wfw_request_post_xarg_v2($title,$msg){
	return "$title\n$msg\r";
}

function wfw_request_post_xarg_v3($title,$msg){  
	return "$title\n$msg\n\r";
}

function wfw_request_post_xarg_v4($title,$msg){  
	$msg = str_replace(array(XARG_START_OF_TEXT_CHAR,XARG_END_OF_TEXT_CHAR),array('',''),$msg); //Les caracteres de controle de debut et de fin de valeur sont interdits
	return $title.XARG_START_OF_TEXT_CHAR.$msg.XARG_END_OF_TEXT_CHAR;
}

function wfw_request_post_xarg_v2_urlencoded($title,$msg){
	$LF = '%0A';
	$CR = '%0D';
	$msg = str_replace(array("!","'"," ",".","-","\n","\r",";","/","?",":","@","=","&"/*,"%"*/),array('%21','%27','%20','%2E','%2D','%0A','%0D','%3B','%2F','%3F','%3A','%40','%3D','%26'/*,'%25'*/),$msg); //rfc1738
	return "$title$LF$msg$CR";
}

function wfw_request_post_xarg_v3_urlencoded($title,$msg){
	$LF = '%0A';
	$CR = '%0D';        
	$msg = str_replace(array("!","'"," ",".","-","\n","\r",";","/","?",":","@","=","&"/*,"%"*/),array('%21','%27','%20','%2E','%2D','%0A','%0D','%3B','%2F','%3F','%3A','%40','%3D','%26'/*,'%25'*/),$msg); //rfc1738
	return "$title$LF$msg$LF$CR";
}

function wfw_request_post_xarg_v4_urlencoded($title,$msg){
	$S = '%02';//STX
	$E = '%03';//ETX
	$msg = str_replace(array(XARG_START_OF_TEXT_CHAR,XARG_END_OF_TEXT_CHAR),array('',''),$msg); //Les caracteres de controle de debut et de fin de valeur sont interdits
	$msg = rawurlencode($msg);//encode les caracteres speciaux
	//$msg = str_replace(array("+","!","'"," ",".","-","\n","\r",";","/","?",":","@","=","&"/*,"%"*/),array('%2B','%21','%27','%20','%2E','%2D','%0A','%0D','%3B','%2F','%3F','%3A','%40','%3D','%26'/*,'%25'*/),$msg); //rfc1738
	return "$title$S$msg$E";
}

/////////////////////////////////////////////////////////////////////////////
// Fonctions standards

// version actuellement utilise
function rpost($title,$msg) {  
	global $_req_post_fmt;
	global $_req_post_func;
	$_req_post_func($_req_post_fmt($title,$msg)); 
}

// post le code d'erreur ("result") et le texte qu'il lui est associe ("error")
// rpost_result termine automatiquement le script et retourne le code d'erreur
function rpost_result($code,$info=NULL) {  
	global $_err_codes;
	global $_req_exit_func;   //
	global $_req_err_str;     //liste des textes d'erreurs

	//le code de resultat
	rpost("result",$code);
	//le texte de resultat 
	rpost("error",$_err_codes[$code]);
	if(is_string($info) && isset($_req_err_str[$info]))
		rpost("error_str",$_req_err_str[$info]);
	//les infos supplementaires 
	if($info) rpost("info",$info);
	
	if($code == ERR_SYSTEM)
		wfw_log($_err_codes[$code].$info);
	
	//callback avant fin de script
	if($_req_exit_func)
		$_req_exit_func($code);

	//termine le script 
	exit($code);
}

/////////////////////////////////////////////////////////////////////////////
// XARG request type

function useXARGRequest(){  
	//redirige la sortie vers un tampon 
	global $_req_post_fmt;
	global $_req_post_func;
	global $_req_exit_func;  
	global $_req_log; 
	
	//header('Content-Type:text/html');
	
	$_req_post_fmt  = "wfw_request_post_xarg_v4";
	$_req_post_func = "wfw_request_output";   
	$_req_exit_func = NULL;
	$_req_log       = "req_log.txt"; 
}

/////////////////////////////////////////////////////////////////////////////
// Form request type

function useFormRequest(){  
	//redirige la sortie vers un tampon 
	global $_req_post_fmt;
	global $_req_post_func;
	global $_req_exit_func; 
	
	header('Content-Type:text/html');
	
	if(isset($_REQUEST["wfw_redirection"]) || isset($_REQUEST["wfw_redirection_failed"]))
		$_req_post_fmt = "wfw_request_post_xarg_v4_urlencoded";

	$_req_post_func = "wfw_request_output_var"; 
	$_req_exit_func = "exitFormRequest";   
}

function exitFormRequest($result_code){    
	global $_req_output; 
	
	//redirige si necessaire
	if(isset($_REQUEST["wfw_redirection"]) || isset($_REQUEST["wfw_redirection_failed"])){
		
		$args = "";
		//
		// Les arguments re�us dans l'URL de redirection
		//
		foreach($_REQUEST as $name=>$value){
			if(substr($name,0,4)!="wfw_"){ 
				//supprime les anti slash et decode l'unicode recu par le formulaire HTML
				//$value=utf8_encode($value);
				//$value=utf8_decode(stripslashes($value));
				//verifie l'identificateur
				if(cInputIdentifier::isValid($name) != ERR_OK)
					continue;
				//ajoute a l'url de redirection
				$args .= "&$name=".rawurlencode($value);
			} 
			else{
				rpost($name,$value);
			}
		}
		// fabrique l'url
		$location;  
		if(($result_code!=ERR_OK) && isset($_REQUEST["wfw_redirection_failed"]))          
			$location = $_REQUEST["wfw_redirection_failed"].'?_xarg_='.$_req_output.$args;
		else      
			$location = $_REQUEST["wfw_redirection"].'?_xarg_='.$_req_output.$args;
		//
		//URL de redirection trop longue ?  
		//
		if(strlen($location)>=MAX_URI_LENGTH)
		{
			//essai sans arguments...                                                  
			if(($result_code!=ERR_OK) && isset($_REQUEST["wfw_redirection_failed"]))          
				$location = $_REQUEST["wfw_redirection_failed"].'?_xarg_='.$_req_output;
			else      
				$location = $_REQUEST["wfw_redirection"].'?_xarg_='.$_req_output;
			
			//URL toujours trop long pour redirection?   
			if(strlen($location)>=MAX_URI_LENGTH)
			{
				//pas de solution...
				echo "error: URI string length too big for redirecting to the target (".strlen($location)." bytes)";
				exit;
			}
		} 
		//
		// redirige  
		//
		header("Location: $location");
		return;
	}
	
	if(isset($_REQUEST["wfw_post_arg"])){
		//
		// post les arguments
		//
		foreach($_REQUEST as $name=>$value){
			if(substr($name,0,4)!="wfw_"){ 
				//supprime les anti slash et decode l'unicode recu par le formulaire HTML
				//$value=utf8_decode(stripslashes($value));
				//verifie l'identificateur
				if(cInputIdentifier::isValid($name) != ERR_OK)
					continue;
				//ajoute a l'url de redirection
				rpost($name,$value);
			}
		}
	}
	//pas de redirection? retourne le resultat
	echo $_req_output;  
	return;
} 

/////////////////////////////////////////////////////////////////////////////
// Hidden request type

function useHiddenRequest(){    
	//redirige la sortie vers le fichier log 
	global $_req_post_func;
	global $_req_exit_func;
	
	header('Content-Type:text/html');
	
	$_req_post_func = "wfw_request_output_var";
	$_req_exit_func = "exitHiddenRequest";
}

function exitHiddenRequest($result_code){    
	global $_req_output;
	
	//redirige si necessaire
	if(isset($_REQUEST["redirect"])){
		//enregistre les erreurs dans le fichier LOG (hote, date, resultats)
		if($result_code!=ERR_OK) {
			//    $_req_output
		}
		//   chdir($_SERVER["DOCUMENT_ROOT"]);
		//echo getcwd();
		//  echo file_get_contents(substr($_SERVER["REQUEST_URI"],1));
		// echo $_REQUEST["redirect"];  
		header('Location: '.$_REQUEST["redirect"]);
		return;
	}
	
	//pas de redirection? affiche le resultat a l'ecran
	echo $_req_output;  
	return;
} 

/////////////////////////////////////////////////////////////////////////////
// XML request type

function useXMLRequest(){  
	//redirige la sortie vers un tampon 
	global $_req_post_fmt;
	global $_req_post_func;
	global $_req_exit_func;  
	global $_req_log; 
	
	//header('Content-Type:text/html');
	
	$_req_post_fmt  = "wfw_request_post_xml";
	$_req_post_func = "wfw_request_output_var";   
	$_req_exit_func = "wfw_request_output_xml";
	$_req_log       = "req_log.txt"; 
}

function wfw_request_post_xml($title,$msg){
	return "<$title>$msg</$title>";
}

function wfw_request_output_xml($text){      
	global $_req_output;
	echo '<?xml version="1.0"?>'."\n<data>".$_req_output.'</data>';
}

?>

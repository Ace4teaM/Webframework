<?php

/*
	(C)2010-2012 ID-INFORMATIK. WebFrameWork(R)
	Crée un nouveau dossier de données

	Arguments:
		[Name]         [wfw_id]             : Optionnel, Identificateur du dossier. Si le dossier éxiste la fonction échoue
		[Password]     [wfw_pwd]            : Optionnel, mot de passe du dossier  
		[Identifier]   [wfw_type]           : Optionnel, type de dossier. Par défaut: 'form'
		[Mail]         [wfw_notify_mail]    : Optionnel, Addresse mail de notification  
		[]             [wfw_notify_subject] : Optionnel, Sujet de la notification
		[]             [wfw_use_data]       : Optionnel, si true crée le dossier de données
		[Bool]         [wfw_readonly]       : Optionnel, si true, les données une fois créé ne sont plus modifiables par l'utilisateur
		[Bool]         [wfw_event]          : Optionnel, si true, le dossier créé est lié à un nouvelle événement
	Retourne:
		id         : Identificateur du nouveau dossier
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec
	
	Revisions:
		[28-11-2011] Implentation de l'argument 'wfw_id'
		[13-12-2011] Update, ROOT_PATH
		[19-12-2011] Update, Formate les valeurs au format UTF-8
		[23-12-2011] Update, Ne supprime pas les anti-slash des parametres
		[09-01-2012] Update
		[12-01-2012] Update, Ajoute l'argument "wfw_use_data"
		[20-02-2012] Update, Ajoute l'argument "wfw_readonly"
		[02-04-2012] Update, utilise le module mailling pour envoyer des notifications
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

include(ROOT_PATH.'/req/client/path.inc');
include(ROOT_PATH.'/req/client/client.inc');

//
// Prepare la requete pour repondre a un formulaire
//
useFormRequest();         
//
//verifie les champs obligatoires
//
rcheck(
	//requis
	NULL,
	//optionnels
	array('wfw_readonly'=>'cInputBool','wfw_id'=>'cInputName','wfw_type'=>'cInputIdentifier','wfw_pwd'=>'cInputPassword','wfw_notify_mail'=>'cInputMail'/*,'wfw_notify_subject'=>''*/,'wfw_use_data'=>'','wfw_event'=>'cInputBool','wfw_note'=>'cInputString')
	);

//
//globales
//  
$timestamp = time();
$pwd = isset($_REQUEST["wfw_pwd"])?$_REQUEST["wfw_pwd"]:NULL;
$type = isset($_REQUEST["wfw_type"])?$_REQUEST["wfw_type"]:"form";
$notify_mail = isset($_REQUEST["wfw_notify_mail"])?$_REQUEST["wfw_notify_mail"]:NULL;   
$id  = (isset($_REQUEST["wfw_id"]) ? $_REQUEST["wfw_id"] : (rand(100,900).'-'.$timestamp));
$file_name = CLIENT_DATA_PATH."/$id.xml";
$file_dir = CLIENT_DATA_PATH."/$id/";
$file_content = '<?xml version="1.0" ?>'."\n<data>\n";
$use_data = (isset($_REQUEST["wfw_use_data"]) ? $_REQUEST["wfw_use_data"] : "false");
$readonly = isset($_REQUEST["wfw_readonly"])?$_REQUEST["wfw_readonly"]:"false";

//
// vérifie que le dossier n'existe pas
//
if(file_exists($file_name))
	rpost_result(ERR_FAILED, "file_exist");

//
// construit automatiquement le fichier XML avec les arguments recus
//
foreach($_REQUEST as $item=>$item_value){
	if(substr($item,0,4)!='wfw_'){
		//decode la valeur pour la traiter (re-encode a la sauvegarde)
//		$item_value=utf8_decode($item_value);
		//verifie l'identificateur
		if(cInputIdentifier::isValid($item) != ERR_OK)
			continue;
		//formate la valeur
		//$item_value = utf8_encode($item_value);
		$item_value = str_replace(array('<','>','&'),array('&lt;','&gt;','&amp;'),$item_value);
		//ajoute au contenu XML
		$file_content .= "\t<$item>$item_value</$item>\n";
	}
}        

//
// ajoute les informations d'indentification (IP-client,date)
//                          
$file_content .= "\t<wfw_id>$id</wfw_id>\n"; 
$file_content .= "\t<wfw_type>$type</wfw_type>\n";
$file_content .= "\t<wfw_readonly>$readonly</wfw_readonly>\n";
if(isset($_REQUEST["wfw_pwd"])) 
	$file_content .= "\t<wfw_pwd>$pwd</wfw_pwd>\n";  
$remote_ip = (getenv('HTTP_X_FORWARDED_FOR'))? getenv('HTTP_X_FORWARDED_FOR') : getenv('REMOTE_ADDR'); 
// $host = isset($_SERVER['REMOTE_HOST']) ? $_SERVER['REMOTE_HOST'] : @gethostbyaddr($remote_ip);    /* ralenti considerablement la requete */
$file_content .= "\t<wfw_remote_ip>$remote_ip</wfw_remote_ip>\n";
//  $file_content .= "\t<wfw_host>$host</wfw_host>\n";
$file_content .= "\t<wfw_timestamp>$timestamp</wfw_timestamp>\n";
$file_content .= "\t<wfw_date>".date("d/m/Y H:i:s",$timestamp)."</wfw_date>\n";
$file_content .= "\t<wfw_filename>".basename($file_name)."</wfw_filename>\n";
if(isset($_REQUEST["wfw_note"])){
	//$item_value = utf8_encode($item_value);
	$item_value = str_replace(array('<','>','&'),array('&lt;','&gt;','&amp;'),$_REQUEST["wfw_note"]);
	//ajoute au contenu XML
	$file_content .= "\t<wfw_note>$item_value</wfw_note>\n";
}

// termine le fichier XML
$file_content .= "</data>\n";

//
// Sauve au format XML
//                  
if(file_put_contents($file_name,/*utf8_encode($file_content)*/$file_content) == FALSE){
	rpost_result(ERR_FAILED, "cant_create");
} 
chmod($file_name,0644);

//
// Crée le dossier de données?
//      
if(($use_data=="true") && !file_exists($file_dir) && (cmd("mkdir ".$file_dir,$cmd_out)!=0))
	rpost("warning", "cant_create_data_folder");

//
//envoie un mail de notification
//
if($notify_mail!=NULL){
	//utilise le module mailling...
	$req_base_path = ROOT_PATH."/private/req/mailling/"; 
	$mail = array();   
	$mail["to"]                = $notify_mail;
	$mail["wfw_id"]            = "355-1333354825";
	//if(isset($_REQUEST['wfw_notify_subject']))
	//	$mail["subject"]       = $_REQUEST['wfw_notify_subject'];
	//template args
	$mail["transform_content"] = "true";
	$mail["notify_msg"]        = "Le dossier: '$id' a été généré sur le serveur.";
	if(isset($_REQUEST["wfw_note"]))
		$mail["notify_msg"] .= "\n(".$_REQUEST["wfw_note"].")";
	//
	$ret = rexec($req_base_path,"send_client",$mail,$output);
	if($ret!=0){
		wfw_log(__FILE__.": can't send notification mail to $notify_mail. ($ret)");   
		wfw_log(print_r($output,true));
	}
	/*
	//utilise la requete wfw standard
	$req_base_path = ROOT_PATH."/wfw/req"; 
	$mail = array();   
	$mail["to"]            = $notify_mail;
	$mail["from"]          = "$notify_mail";
	$mail["fromname"]      = "system";
	$mail["subject"]       = (isset($_REQUEST['wfw_notify_subject']) ? $_REQUEST['wfw_notify_subject'] : "Nouveau dossier $id");
	$mail["msg"]           = "Le dossier: $id a été généré sur le serveur.";
	if(isset($_REQUEST["wfw_note"]))
		$mail["msg"] .= "\n(".$_REQUEST["wfw_note"].")";
	
	$ret = rexec($req_base_path,"mail",$mail,$output);
	if($ret!=0){
		wfw_log(__FILE__.": can't send notification mail to $notify_mail. ($ret)");   
		wfw_log(print_r($output,true));
	}*/
}


//
//attache le dossier à un événement
//
if(isset($_REQUEST['wfw_event']) && (cInputBool::toBool($_REQUEST['wfw_event'])==true)){
	clientPushEvent($id);
}

//
rpost("id",$id);
rpost_result(ERR_OK);
?>

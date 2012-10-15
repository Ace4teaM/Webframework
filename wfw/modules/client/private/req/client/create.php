<?php

/*
	(C)2010-2011 ID-INFORMATIK - WebFrameWork(R)
	Cree un nouveau dossier de données (autorise l'insertion de membres prives 'wfw_*')

	Arguments:
		[Identifier]   wfw_id               : Optionnel, Spécifie l'identifiant du dossier. Si le dossier éxiste, le dossier est remplacé
		[Password]     wfw_pwd              : Optionnel, Mot de passe
		[Identifier]   wfw_type             : Optionnel, Type de dossier. Par defaut: 'form'
		[Mail]         [wfw_notify_mail]    : Optionnel, Addresse mail de notification  
		[]             [wfw_notify_subject] : Optionnel, Sujet de la notification
		
	Retourne:         
		id         : Identificateur du nouveau dossier
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec

	Revisions:
		[28-11-2011] Implentation de l'argument 'wfw_id'
		[08-12-2011] Update, ROOT_PATH
		[19-12-2011] Update, Formate les valeurs au format UTF-8
		[23-12-2011] Update, Ne supprime pas les anti-slash des parametres
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
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
	array('wfw_id'=>'cInputName','wfw_type'=>'cInputIdentifier','wfw_pwd'=>'cInputPassword','wfw_notify_mail'=>'cInputMail'/*,'wfw_notify_subject'=>''*/)
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

//
//Existe ?
//
if(file_exists($file_name))
{
	rpost_result(ERR_FAILED, "file_exist");
}

//
// construit automatiquement le fichier XML avec les arguments recus
//
foreach($_REQUEST as $item=>$item_value){
	//decode la valeur pour la traiter (re-encode a la sauvegarde)
//	$item_value=utf8_decode($item_value);
	//verifie l'identificateur
	if(cInputIdentifier::isValid($item) != ERR_OK)
		continue;
	//formate la valeur
	$item_value = str_replace(array('<','>','&'),array('&lt;','&gt;','&amp;'),$item_value);
	//ajoute au contenu XML
	$file_content .= "\t<$item>$item_value</$item>\n";
}        

//
// ajoute les informations d'indentification (IP-client,date)
//
$file_content .= "\t<wfw_id>$id</wfw_id>\n"; 
$file_content .= "\t<wfw_type>$type</wfw_type>\n";
if(isset($_REQUEST["wfw_pwd"])) 
	$file_content .= "\t<wfw_pwd>$pwd</wfw_pwd>\n";  
$remote_ip = (getenv('HTTP_X_FORWARDED_FOR'))? getenv('HTTP_X_FORWARDED_FOR') : getenv('REMOTE_ADDR'); 
// $host = isset($_SERVER['REMOTE_HOST']) ? $_SERVER['REMOTE_HOST'] : @gethostbyaddr($remote_ip);    /* ralenti considerablement la requete */
$file_content .= "\t<wfw_remote_ip>$remote_ip</wfw_remote_ip>\n";
//  $file_content .= "\t<wfw_host>$host</wfw_host>\n";
$file_content .= "\t<wfw_timestamp>$timestamp</wfw_timestamp>\n";
$file_content .= "\t<wfw_date>".date("d/m/Y H:i:s",$timestamp)."</wfw_date>\n";
$file_content .= "\t<wfw_filename>".basename($file_name)."</wfw_filename>\n";

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
	$req_base_path = ROOT_PATH."/wfw/req"; 
	$mail = array();
	$mail["to"]            = $notify_mail;
	$mail["from"]          = "system-$notify_mail";
	$mail["fromname"]      = "system";
	$mail["subject"]       = (isset($_REQUEST['wfw_notify_subject']) ? $_REQUEST['wfw_notify_subject'] : "Nouveau dossier $id");
	$mail["msg"]           = "Le dossier: $id a ete genere sur le serveur web";
	
	$ret = rexec($req_base_path,"mail",$mail,$output);
	if($ret!=0){
		wfw_log(__FILE__.": can't send notification mail to $notify_mail. ($ret)");   
		wfw_log(print_r($output,true));
	}
}

//
rpost("id",$id);
rpost_result(ERR_OK);
?>

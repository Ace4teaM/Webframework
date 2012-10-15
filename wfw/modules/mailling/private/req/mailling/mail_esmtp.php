<?php
/*
	(C)2008-2012 ID-Informatik, WebFrameWork(R). All rights reserved.
	Envoie un mail au serveur ESMTP specifie (les pieces jointes sont acceptees)
  
	Arguments:
		[Mail]    from         : expediteur
		[Mail]    to           : destinataires (separe par des points-virgules)
		[string]  subject      : subject du message
		[string]  msg|html_msg : corps du message
    
	Arguments optionnels:   
		[string]       use_template : si specifie, un fichier [template] est utilise
		[UNIXFileName] template     : path du fichier template a utiliser comme modele
		[Name]         name         : nom de l'expediteur
		[string]       notify       : adresse recevant la notification
		[string]       server       : adresse du server SMTP a utiliser
		[int]          port         : port du server SMTP a utiliser
		[UNIXFileName] attachments  : noms des pieces jointes separees par des points virgules (les fichiers sont charges depuis le dossier client 'private_upload')
    
	Retourne:
		[string]  result  : resultat de la requete.
		[string]  info    : details sur l'erreur en cas d'echec.

	Remarques:
		Si un ou plusieurs envoies on �chou�s, la requ�te retoure une erreur

	Revisions:
		[26-09-2011] Update, envoie de pieces jointes multiples
		[29-10-2011] Update, l'argument 'fromname' utilise maintenant le type 'cInputString'
		[11-11-2011] Debug,  mauvais appel a mime_content_type()
		[30-11-2011] Debug,  mauvaise utilisation de la classe cXMLTemplate
		[08-12-2011] Update, path (ROOT_PATH)
		[08-12-2011] Update, gestion des destinataires multiples
		[19-12-2011] Debug,  accepte que le parametre 'msg' peut etre vide si 'html_msg' est utilise
		[20-12-2011] Debug,  definit l'encodage UTF8 dans l'en-tete 'Subject' et 'From'
		[21-01-2012] Update, retoure une erreur si un ou plusieurs envoies �choues
		[20-02-2012] Update, mise a jour des codes erreurs
		[20-02-2012] Update, si les arguments 'fromname', 'from', 'server', 'port' ne sont pas definits, ils sont obtenu automatiquement depuis les defauts
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');
include(ROOT_PATH.'/wfw/php/templates/xml_template.php');
include(ROOT_PATH.'/req/client/path.inc'); //chemins d'acces du module 'client'
include(ROOT_PATH.'/req/mailling/mailling.inc');

//
// Prepare la requete pour repondre a un formulaire
//
  
useFormRequest();

//
// Arguments
//

//
//verifie les champs obligatoires
//
rcheck(
  //requis
  array(     
    'to'=>'',//multiple mail possible
	//'msg'=>'',//cette valeur peut etre vide (voir plus bas)
    'subject'=>'',
  ),
  //optionnels
  array(
    'from'=>'cInputMail',
    'fromname'=>'cInputString',
    'server'=>'',
    'port'=>'cInputInteger',
    'template'=>'cInputUNIXFileName',    
    'attachments'=>'cInputUNIXFileName',
  )
);

//
// decompose les adresses des expediteurs
//

$address = str_explode($_REQUEST['to'],";",true);
foreach($address as $cur_address)
{
    $result=cInputMail::isValid($cur_address);
    if($result!=ERR_OK){
        rpost("exinfos", "\"$cur_address\" is not a valid address mail in 'to' argument field");
        rpost_result($result, "invalid_address");
	}
}

//
// Globales
//

$default_infos = getDefaultInfos("contact");

$mail_server = isset($_REQUEST['server']) ? $_REQUEST['server'] : $default_infos["server"];
$mail_port   = isset($_REQUEST['port']) ? $_REQUEST['port'] : $default_infos["port"];
$from        = isset($_REQUEST['from']) ? $_REQUEST['from'] : $default_infos["from"];

$content = "";
$subject = '=?UTF-8?B?'.base64_encode($_REQUEST['subject']).'?=';
$fromname = '';
if(isset($_REQUEST['fromname']))
	$fromname = '=?UTF-8?B?'.base64_encode($_REQUEST['fromname']).'?=';
else if(!empty($default_infos["fromname"]))
	$fromname = '=?UTF-8?B?'.base64_encode($default_infos["fromname"]).'?=';
$content_type = "text/plain";
$boundary_keyword = "end-of-body";

/*
  Utilise un template?
*/
if(isset($_REQUEST['template']) && isset($_REQUEST['use_template']) && isset($_REQUEST['html_mode']) && cInputBool::toBool($_REQUEST['html_mode'])==true)
{
	//transforme le document 
	$template = new cXMLTemplate();
	if(!$template->Initialise(ROOT_PATH."/private/".$_REQUEST['template'],NULL,NULL,NULL,$_REQUEST))
		rpost_result(ERR_FAILED,"cant_load_template");
	$content = $template->Make();
	$content_type = "text/html";
}
else if(isset($_REQUEST['msg']))
	$content = $_REQUEST['msg'];
else
	rpost_result(ERR_FAILED,"message_not_found");


$sock = new cSocket();
$rsp  = "";

//
//
//
                  
/*
  puts
  Envoie une commande et verifie si c'est un succees, dans le cas echeant prepare la fin de la communication avec le socket
*/
function puts($cmd){
  global $sock;
  global $rsp;

  $rsp = $sock->Puts($cmd);
//  echo($rsp);
  //verifie le code de retourne, accept les messages 2xx et 3xx. retourne le reste comme erreur
  $code_char = substr($rsp,0,1);
  if($code_char != "2" && $code_char != "3"){
	rpost("exinfos","Socket failed ($rsp)");
	return 0;
  }
  return $rsp;
}

/*
  prepare le contenu du message
*/

//message texte 
$text_msg = "--$boundary_keyword\n";
$text_msg .= 'Content-Type: '.$content_type.'; charset="utf-8"'."\n";
$text_msg .= 'Content-Transfer-Encoding: 8bit'."\n";
$text_msg .= "\n";
$text_msg .= $content."\n";
$text_msg .= "\n\n"; // fin de corps du message
 
//pieces jointes
$attachments_msg = array();
if(isset($_REQUEST['attachments']))
{
	$attachments = str_explode($_REQUEST['attachments'],";",true);

	foreach($attachments as $filename)
	{   
		$filepath = CLIENT_PRIVATE_UPLOAD_PATH."/$filename"; 

		if(!file_exists($filepath))
		{
			rpost("exinfos","$filename attachment file do not exist"); 
			rpost_result(ERR_FAILED,"attachment_file_not_exist");  
		}
		
		$filedata = file_get_contents($filepath);   
		
		$msg = "";
		$msg .= "--$boundary_keyword\n";
		$msg .= 'Content-Type: '.mime_content_type($filepath).'; name="'.$filename.'"'."\n";
		$msg .= 'Content-Transfer-Encoding: base64'."\n"; 
		$msg .= 'Content-Description: '.$filename."\n";
		$msg .= 'Content-Disposition: attachment; filename="'.$filename.'"'."\n";      
		$msg .= "\n";
		$msg .= chunk_split(base64_encode($filedata))."\n";
		$msg .= "\n\n"; // fin de corps du message
		
		array_push($attachments_msg,$msg);
	}
}


//envoie le(s) mail(s)
$i=0;
$error=false;
foreach($address as $to)
{
	$i++;
	
	/*
	  ouvre la connexion
	*/
	if($sock->Open($mail_server,$mail_port)!=ERR_OK)
	{
	  rpost("exinfos","socket open error: (".$sock->errno.")".$sock->errstr);
	  rpost_result(ERR_FAILED,"socket_error");
	}

	//authentification (ESMTP)
	if(!puts("EHLO ".(isset($_SERVER['SERVER_ADDR'])?$_SERVER['SERVER_ADDR']:"noname")."\n")) goto onerror;
 
	//expediteur
	if(!puts('MAIL FROM: <'.$from.">\n")) goto onerror;

	//destinataire
	if(!puts("RCPT TO: <$to>\n")) goto onerror;

	//passe en mode data pour ecrire le contenu du mail
	if(!puts("DATA\n")) goto onerror;


	//en-tete multipart    
	$msg = "";                  
	$msg .= "To: $to\n";
	if(!empty($fromname))
	  $msg .= 'From: "'.$fromname.'" <'.$from.">\n"; 
	else
	  $msg .= 'From: '.$from."\n";
	$msg .= 'Subject: '.$subject."\n";
	$msg .= 'MIME-Version: 1.0'."\n";
	$msg .= 'Content-Type: multipart/mixed; boundary="'.$boundary_keyword.'"'."\n";
	$msg .= "\r\n";
	if(!puts($msg)) goto onerror;

	//message texte
	if(!puts($text_msg)) goto onerror;
              
	//ajoute les pieces jointes
	foreach($attachments_msg as $msg)
		if(!puts($msg)) goto onerror;

	// fin du mail  
	if(!puts("--$boundary_keyword--\n")) goto onerror;
	if(!puts("\r\n.\r\n")) goto onerror;

	// quit 
	$sock->Puts("QUIT\n");
	$sock->Close();
	rpost("send_$i","$to OK");
	continue;
	
	// erreur 
onerror:
	// quit 
	$sock->Puts("QUIT\n");
	$sock->Close();
	rpost("send_$i","$to FAILED ($rsp)");
	$error=true;
	continue;
}

//erreur?
if($error)
	rpost_result(ERR_FAILED,"send");

rpost_result(ERR_OK);
?>

<?php
/*
  (C)2008-2010 WebFrameWork 1.3
	Envoie un mail au serveur SMTP specifie
  
  Arguments:
    from         : expediteur
    to           : destinataire
    msg          : corps du message  
    subject      : subject du message
    
  Arguments optionnels:   
    use_template : si specifie, un fichier [template] est utilise
    template     : path du fichier template a utiliser comme modele
    fromname     : nom de l'expediteur
    notify       : adresse recevant la notification
    server       : adresse du server SMTP a utiliser
    port         : port du server SMTP a utiliser

  Retourne:
    result  : resultat de la requete.
    info    : details sur l'erreur en cas d'echec.

  Revisions:
   [xx-xx-2010], met a jour le changement du format de reponse des requetes
   [xx-xx-2010], bug resolue, test correctement les classes de base 'cInput' avec la valeur 'ERR_OK'
   [xx-xx-2010], met a jour le changement de format des requetes, utilise rpost()     
   [25-02-2011], encode 'subject' et 'content' au format UTF-8.     
   [25-02-2011], utilise rcheck pour tester les parametres.
*/

define("ROOT_PATH", "../");  
include(ROOT_PATH.'php/base.php');
include_path(ROOT_PATH.'php/');
include_path(ROOT_PATH.'php/class/bases/');
include_path(ROOT_PATH.'php/inputs/');
  
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
    'from'=>'cInputMail',
    'to'=>'cInputMail',
    'msg'=>'',
    'subject'=>'',
  ),
  //optionnels
  array(
    'fromname'=>'cInputName',
    'server'=>'',
    'port'=>'cInputInteger',
    'template'=>'',    
  )
);

//
// Globales
//

$mail_server = isset($_REQUEST['server']) ? $_REQUEST['server'] : 'localhost';
$mail_port   = isset($_REQUEST['port']) ? $_REQUEST['port'] : 25;

$content = $_REQUEST['msg'];  
$subject = $_REQUEST['subject'];
$content_type = "text/plain";
                    
// Utilise un template?
if(isset($_REQUEST['template']) && isset($_REQUEST['use_template']))
{
  $base_path = dirname($_SERVER['SCRIPT_FILENAME']);
  $options=$_REQUEST;
  $options["input"]=$_REQUEST['template'];
  if(rexec($base_path,"template",$options,$temp_msg)==0){
    $content = "";
    $content_type = "text/html";
    foreach($temp_msg as $line)
      $content .= $line."\n";
  }
  else
    rpost("warning","can't create template! mail will be sent in text format.");  
}


$sock = new cSocket();
$rsp  = "";

//
//
//

// puts
// envoie une commande et verifie si c'est un succees, dans le cas echeant prepare la fin de la communication avec le socket
//
function puts($cmd){
  global $sock;
  global $rsp;

  $rsp = $sock->Puts($cmd);
//  echo($rsp);
  //verifie le code de retourne, accept les messages 2xx et 3xx. retourne le reste comme erreur
  $code_char = substr($rsp,0,1);
  if($code_char != "2" && $code_char != "3")
  {
    $sock->Puts("QUIT\n");
    rpost_result(ERR_FAILED,$rsp);
  }
  
  return $rsp;
}


//ouvre la connection
if($sock->Open($mail_server,$mail_port)!=ERR_OK)
{
  rpost_result(ERR_FAILED,"socket open error: (".$sock->errno.")".$sock->errstr);
}

//authentification
puts("HELO ".(isset($_SERVER['SERVER_ADDR'])?$_SERVER['SERVER_ADDR']:"noname")."\n");
  
//expediteur
puts('MAIL FROM: <'.$_REQUEST['from'].">\n");

//destinataire
puts("RCPT TO: <".$_REQUEST['to'].">\n");

//passe en mode data pour ecrire le contenu du mail
puts("DATA\n");

//construit et envoie le corps du message     
$msg = "";
$msg .= 'Content-Type: '.$content_type.'; charset="utf-8"'."\n"; //pas d'utf-8, les caracteres speciaux sont deja encodes par le format xml
$msg .= 'Content-Transfer-Encoding: 8bit'."\n";
$msg .= 'To: '.$_REQUEST['to']."\n";
if(!empty($_REQUEST['fromname']))
  $msg .= 'From: "'.$_REQUEST['fromname'].'" <'.$_REQUEST['from'].">\n"; 
else
  $msg .= 'From: '.$_REQUEST['from']."\n";
$msg .= 'Subject: '.$subject."\n";
$msg .= "\n";
$msg .= $content."\n";
$msg .= "\r\n.\r\n"; // fin de corps du message
puts($msg); 

//fin 
$sock->Puts("QUIT\n");
$sock->Close();

rpost_result(ERR_OK);
?>
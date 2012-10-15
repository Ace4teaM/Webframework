<?php
/*
	(C)2012 ID-Informatik, WebFrameWork(R). All rights reserved.
	Envoie un mail depuis un dossier client
  
	Arguments:
		[Mail]         to                  : destinataires (separe par des points-virgules)
		[Name]         wfw_id              : identificateur du dossier client 'mail'
		[Mail]         [from]              : expediteur
		[string]       [subject]           : subject du message
		[string]       [use_template]      : si specifie, un fichier [template] est utilise
		[UNIXFileName] [template]          : path du fichier template a utiliser comme modele
		[Name]         [name]              : nom de l'expediteur
		[string]       [notify]            : adresse recevant la notification
		[string]       [server]            : adresse du server SMTP a utiliser
		[int]          [port]              : port du server SMTP a utiliser
		[UNIXFileName] [attachments]       : noms des pieces jointes separees par des points virgules (les fichiers sont charges depuis le dossier client 'private_upload')
		[Bool]         [transform_content] : Si true, transforme le contenu avec les arguments
    
	Retourne:
		[string]  result  : resultat de la requete.
		[string]  info    : details sur l'erreur en cas d'echec.

	Revisions:
		[20-02-2012] Implementation
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');
include_path(ROOT_PATH.'/wfw/php/templates/');
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
	'wfw_id'=>'cInputName',//client data id 'mail'
    'to'=>'',//multiple mail possible
  ),
  //optionnels
  array(
    'subject'=>'cInputString',
    'from'=>'cInputMail',
    'fromname'=>'cInputString',
    'server'=>'',
    'port'=>'cInputInteger',
    'template'=>'cInputUNIXFileName',    
    'attachments'=>'cInputUNIXFileName',
    'transform_content'=>'cInputBool',
  )
);

//
// obtient les arguments
//

$args = xarg_req(ROOT_PATH.'/private/req/client/','getall',array("wfw_id"=>$_REQUEST["wfw_id"],"wfw_noempty"=>"true"));

if($args===null || $args["result"]!=ERR_OK)
{
	if(isset($args["result"])){
		foreach($args as $index=>$value)
			rpost($index,$value);
		rpost_result($args["result"],$args["info"]);
	}
	rpost("info", "getall");
	rpost_result(ERR_FAILED, "sub_request");
}

//
// transforme le message ?
//
if(isset($_REQUEST["transform_content"]) && cInputBool::toBool($_REQUEST["transform_content"])){
	//HTML
	if(cInputBool::toBool($args["html_mode"])){
		$input = new XMLDocument( "1.0", "utf-8" );
		
		if(!$input->make('<?xml encoding="UTF-8">' . $args["html_msg"]))
			rpost_result(ERR_FAILED,"cant_parse_html_template");

		// dirty fix (UTF8)
		foreach ($input->childNodes as $item)
			if ($item->nodeType == XML_PI_NODE)
				$input->removeChild($item); // remove hack
		$input->encoding = 'UTF-8'; // insert proper
		
		//fabrique le template
		$template = new cXMLTemplate();
		if(!$template->Initialise($input,NULL,NULL,NULL,$_REQUEST))
			rpost_result(ERR_FAILED,"cant_initialize_template");
		$args["html_msg"] = $template->Make();
	}
	//TEXT
	else{
		//fabrique le template
		$template = new cStringTemplate();
		if(!$template->Initialise($args["msg"],false,NULL,NULL,$_REQUEST))
			rpost_result(ERR_FAILED,"cant_initialize_template");
		$args["msg"] = $template->Make();
	}
}

//
// envoie le mail
//
$args = array_merge($args,$_REQUEST);

$args = xarg_req(ROOT_PATH.'/private/req/mailling/','mail_esmtp',$args);

if($args===null || $args["result"]!=ERR_OK)
{
	if(isset($args["result"])){
		foreach($args as $index=>$value)
			rpost($index,$value);
		rpost_result($args["result"],$args["info"]);
	}
	rpost("info", "mail_esmtp");
	rpost_result(ERR_FAILED, "sub_request");
}

rpost_result(ERR_OK);
?>

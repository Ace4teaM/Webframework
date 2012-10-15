<?php
/*
	(C)2008-2011 ID-INFORMATIK - WebFrameWork(R)
	Ajoute/Modifie un canal de diffusion RSS

	Arguments:
		title    : titre
		desc     : description
		link     : lien HTTP vers la page associee
		filename : nom du fichier a modifier
		[guid]   : Optionnel, GUID du canal a modifier. Si non specifier un nouveau canal est insere
    
	Retourne:
		result  : resultat de la requete.
		info    : détails sur l'erreur en cas d'échec.
		guid    : GUID du nouveau canal
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');
include('path.php');

//recherche un canal existant
function getChannel($input,$find_guid){
  $channel_node = $input->getNode('rss/channel');
  while($channel_node){
    $guid = $input->getNextChildNode($channel_node,"guid"); 
    if($guid->nodeValue == $find_guid){
      return $channel_node;
    }
    $channel_node = $input->getNext($channel_node,"channel");
  }
  return NULL;
}

//
// Arguments
//
rcheck(
  //requis
  array('title'=>'','desc'=>'','link'=>'','filename'=>'cInputUNIXFileName'), 
  //optionnels  
  array('guid'=>'')
);

//
//globales
//
$file_name = RSS_DATA_PATH."/".$_REQUEST["filename"];
$channel_node = NULL;
$guid = (isset($_REQUEST["guid"]) && (!empty($_REQUEST["guid"]))) ? $_REQUEST["guid"] : NULL;
$channel_name = NULL;
$channel_desc = NULL;
$channel_link = NULL;
$channel_guid = NULL;
global $_hostname_;
//$url = $_REQUEST["wfw_redirection"];

//
// charge le document
//
$input = new XMLDocument();
if(!$input->load($file_name)){
    rpost_result(ERR_FAILED, "can't open input file ".$file_name);
}

//
// modifie une entree existante
//
if($guid){
  $channel_node = getChannel($input,$guid);
  
  if(!$channel_node){
    rpost_result(ERR_FAILED, "can't get channel");
  }
  
  $channel_name=$input->getNextChildNode($channel_node,"title");
  $channel_desc=$input->getNextChildNode($channel_node,"description");
  $channel_link=$input->getNextChildNode($channel_node,"link");
  $channel_guid=$input->getNextChildNode($channel_node,"guid");
}         
//
// insert une nouvelle entree
//
else{  
  $guid = uniqid();
  
  $channel_node=$input->createElement("channel");
  
  if(!$channel_node){
    rpost_result(ERR_FAILED, "can't create channel");
  }

  $channel_name=$input->createElement("title");
  $channel_desc=$input->createElement("description");
  $channel_link=$input->createElement("link");
  $channel_guid=$input->createElement("guid");
  
  $channel_node->appendChild($channel_name);
  $channel_node->appendChild($channel_desc);
  $channel_node->appendChild($channel_link);
  $channel_node->appendChild($channel_guid);
  
  $input->documentElement->appendChild($channel_node);
}
        
//
// insert une nouvelle entree
//   
$channel_link->nodeValue = $_REQUEST["link"];                                                                              
$channel_name->nodeValue = $_REQUEST["title"];
$channel_desc->nodeValue = $_REQUEST["desc"];
$channel_guid->nodeValue = $guid;

if(!$input->save($file_name)){
  rpost_result(ERR_FAILED, "can't save input file ".$file_name);
}
//             
rpost("guid",$guid);
rpost_result(ERR_OK, NULL);
?>

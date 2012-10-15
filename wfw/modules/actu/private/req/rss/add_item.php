<?php
/*
	(C)2010-2011 ID-INFORMATIK - WebFrameWork(R)
  Ajoute/Modifie un flux de diffusion RSS

  Arguments:
		title    : titre
		desc     : description 
		link     : lien uri
		filename : fichier à modifier
		date     : Optionnel, Date de création. Si non definit, la date en cours est utilise
		[guid]   : Optionnel, GUID de l'item a modifier. Si non definit, un nouvel article est ajouter
		[channel]: Optionnel, GUID du canal qui va recevoir le nouvel item. Ignorer si 'guid' est definit
    
  Retourne:
    result  : resultat de la requete.
    info    : détails sur l'erreur en cas d'échec.
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');
include('path.php');

//
// Fonctions
//

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

//recherche un item existant
function getItem($input,$find_guid){
  $channel_node = $input->getNode('rss/channel');
  while($channel_node){     
    $item_node = $input->getNextChildNode($channel_node,"item");
    while($item_node){                   
      $guid = $input->getNextChildNode($item_node,"guid");  
      if($guid->nodeValue == $find_guid){
        return $item_node;
      }                 
      $item_node = $input->getNext($item_node,"item");
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
  array('guid'=>'','channel'=>'','date'=>'')
);

//
//globales
//
$file_name = RSS_DATA_PATH."/".$_REQUEST["filename"];
$guid = (isset($_REQUEST["guid"]) && ($_REQUEST["guid"]!="")) ? $_REQUEST["guid"] : NULL;  
$channel_guid = (isset($_REQUEST["channel"]) && ($_REQUEST["channel"]!="")) ? $_REQUEST["channel"] : NULL; 
$date = (isset($_REQUEST["date"]) ? $_REQUEST["date"] : date(DATE_RFC822,time()));
$node = NULL;
$node_name = NULL;
$node_desc = NULL;
$node_link = NULL;
$node_guid = NULL;
       
//
// Arguments
//

if(!$guid && !$channel_guid){
  rpost_result(ERR_REQ_MISSING_ARG, "please specify channel or item guid");
}
            
//
// charge le document
//
$input = new XMLDocument();
if(!$input->load($file_name)){
    rpost_result(ERR_FAILED, "can't open input file ".$file_name);
}

//modifie une entree existante
if($guid){
  $node = getItem($input,$guid);
  
  if(!$node){
    rpost_result(ERR_FAILED, "can't get item node ($guid)");
  }
  
  $node_name=$input->getNextChildNode($node,"title");
  $node_desc=$input->getNextChildNode($node,"description");
  $node_link=$input->getNextChildNode($node,"link");    
  $node_date=$input->getNextChildNode($node,"pubDate");
  $node_guid=$input->getNextChildNode($node,"guid");
}
//insert une nouvelle entree
else{   
  $channel = getChannel($input,$channel_guid);
  $guid = uniqid();
  
  $node=$input->createElement("item");
  
  if(!$node){
    rpost_result(ERR_FAILED, "can't create item node");
  }

  $node_name=$input->createElement("title");
  $node_desc=$input->createElement("description");
  $node_link=$input->createElement("link");    
  $node_date=$input->createElement("pubDate");
  $node_guid=$input->createElement("guid");
  
  $node->appendChild($node_name);
  $node->appendChild($node_desc);
  $node->appendChild($node_link);  
  $node->appendChild($node_date);
  $node->appendChild($node_guid);
  
  $channel->appendChild($node);
}
      
$node_link->nodeValue = $_REQUEST["link"];                                                                                
$node_name->nodeValue = $_REQUEST["title"];
$node_desc->nodeValue = $_REQUEST["desc"];   
$node_date->nodeValue = $date;
$node_guid->nodeValue = $guid;

if(!$input->save($file_name)){
  rpost_result(ERR_FAILED, "can't save input file ".$file_name);
}
//             
rpost("guid",$guid);
rpost_result(ERR_OK, NULL);
?>

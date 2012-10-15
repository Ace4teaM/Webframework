<?php
/*
  (C)2008-2010 ID-Informatik, (R)WebFrameWork-1.3
	Recupere l'agent et l'index dans un fichier
  
  Arguments:
  	index_file : path jusqu'au fichier d'index 
  	redirect   : redirection apres indexation (HiddenRequest argument)

  Retourne:
    rien.

  Remarque:
    Le script n'est pas bloquant, il redirige meme en cas d'erreur.
    Les resultats d'erreurs sont redirige vers le fichier wfw/log/php.log
*/

$doc_root = "../";//$_SERVER['DOCUMENT_ROOT'];
include($doc_root.'php/base.php');
include_path($doc_root.'php/');
include_path($doc_root.'php/class/bases/');
include_path($doc_root.'php/inputs/');

//requete transparente
useHiddenRequest();

//
// Arguments
//
 
if(!isset($_REQUEST["index_file"])){
  rpost_result(ERR_REQ_INVALID_ARG,"index_file not specified");
}

$file_name = $_REQUEST["index_file"];
        
//obtient le nom de l'agent
$agent = $_SERVER['HTTP_USER_AGENT'];


$input = new XMLDocument();
//ouvre le fichier XML
if(!@$input->load($file_name)){
    //nouveau?
    if(!@$input->loadXML('<statistics><agents></agents></statistics>')){     
      rpost_result(ERR_REQ_INVALID_ARG,"can't load and create XML file: $file_name");
    }
}

//obtient le noeud
  $node=NULL;
  $agentsNode = $input->getNode('statistics/agents');
  if(!$agentsNode){
    $agentsNode=$input->createElement("agents");
    $input->documentElement->appendChild($agentsNode);
  }
  else
    $node=$input->getNextChildNode($agentsNode,"agent");
    
  //recherche l'agent
  while($node){
    $node_name = $node->getAttribute("name");
    //ok
    if($node_name == $agent){
      goto register_agent;
    }
    $node = $input->getNext($node,"agent");
  }
  
//introuvable? ajoute
$node=$input->createElement("agent");
$agentsNode->appendChild($node);

//enregistre les donnees  
register_agent:
$hits=$node->getAttribute("hits");
if($hits=="") $hits=0;
$node->setAttribute("name",$agent);
$node->setAttribute("date",time());
$node->setAttribute("hits",$hits+1);
$node->setAttribute("ip",$_SERVER['REMOTE_ADDR']);

//sauve le fichier
if(!$input->save($file_name)){
  rpost_result(ERR_FAILED, "can't save input file $file_name");
}

//redirige. 
rpost_result(ERR_OK, NULL);
?>
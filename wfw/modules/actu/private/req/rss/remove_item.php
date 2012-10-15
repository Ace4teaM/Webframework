<?php
/*
	(C)2010-2011 ID-INFORMATIK - WebFrameWork(R)
	Supprime un item de l'actualite RSS

	Arguments:
		guid : GUID de l'item a supprimer
		filename : fichier à modifier
    
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
// Prepare la requete pour repondre a un formulaire
//
  
useFormRequest();

//
// Arguments
//
rcheck(
  //requis
  array('guid'=>'','filename'=>'cInputUNIXFileName'), 
  //optionnels  
  null
);

//
//globales
//
$file_name = RSS_DATA_PATH."/".$_REQUEST["filename"];

//
// charge le document
//
$input = new XMLDocument();
if(!$input->load($file_name)){
	  rpost_result(ERR_FAILED,"can't open input file ".$file_name);
}

//
// recherche dans les noeuds
//      
$channel_node = $input->getNode('rss/channel');
while($channel_node){     
  $item_node = $input->getNextChildNode($channel_node,"item");
  while($item_node){                  
    $guid = $input->getNextChildNode($item_node,"guid");
    //ok?                    
    if(($guid!=NULL) && ($guid->nodeValue == $_REQUEST['guid'])){ 
      //supprime
      $item_node->parentNode->removeChild($item_node);
      //re-sauve le fichier
      if(!$input->save($file_name)){
      	  rpost_result(ERR_FAILED,"can't save input file ".$file_name);
      }
      rpost("guid",$_REQUEST["guid"]);
      rpost_result(ERR_OK);
    }          
		$item_node = $input->getNext($item_node,"item");
  }      
	$channel_node = $input->getNext($channel_node,"channel");
}
//
rpost_result(ERR_FAILED,"item guid not found: ".$_REQUEST['guid']);
?>

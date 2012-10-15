<?php

/*
  (C)2010 WebFrameWork 1.3
  Supprime un ou plusieurs champs d'un dossier

  Arguments:
    wfw_id     : identificateur du dossier. 
	  [wfw_type] : specifie le type de dossier, si different la requete echoue 
    [...]      : champs a inserer ou modifier
    
  Retourne:
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec
    
  Revisions:
    [12-10-2011] Debug, les items de type 'wfw_' ne sont pas supprimes sous caution de perdre des informations indispensables
	[08-12-2011] Update, ROOT_PATH
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

include(ROOT_PATH.'/req/client/path.inc');
include(ROOT_PATH.'/req/client/client.inc');

// print_r($_REQUEST);

//
// Prepare la requete pour repondre a un formulaire
//
  
useFormRequest();
             
// print_r($_REQUEST);
// exit;
//
//verifie les champs obligatoires
//
rcheck(
  //requis
	array('wfw_id'=>'cInputName'),
  //optionnels
  array('wfw_type'=>'cInputIdentifier')
);

//
//globales
//     
$id  = $_REQUEST["wfw_id"];  
$file_name = CLIENT_DATA_PATH."/$id.xml"; 
$items = array();
  
//
// charge le fichier xml
//
$doc = clientOpen($id);

//
// verifie le type de dossier
//
if(isset($_REQUEST["wfw_type"]))
{
  if($_REQUEST["wfw_type"] != $doc->getNodeValue("data/wfw_type"))
  { 
    rpost_result(ERR_FAILED, "invalid_type");
  }
}

//
// supprime les items 
//
foreach($_REQUEST as $item=>$item_value)
{
    //verifie l'identificateur (les arguments prives ne doit pas etre supprimes)
    if(cInputIdentifier::isValid($item) != ERR_OK)
  	 continue;
  	 
    //obtient la valeur   
    $node = $doc->getNode("data/$item",FALSE);
    if($node){
      $node->parentNode->removeChild($node);
    }
}

if(!$doc->save($file_name)){ 
  rpost_result(ERR_FAILED, "cant_save");
}

//
rpost_result(ERR_OK);
?>

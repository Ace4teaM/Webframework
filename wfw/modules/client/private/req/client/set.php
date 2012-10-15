<?php

/*
	(C)2010-2011 ID-INFORMATIK. WebFrameWork(R)
	Définit les champs d'un dossier

	Arguments:
		[Name]         wfw_id     : Identificateur du dossier à vérfier
		[]             [...]      : Optionnel, Champs à insérer ou à modifier
    
	Retourne:
		id         : Identificateur du dossier
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec
	
	Revisions:
		[13-12-2011] Update, ROOT_PATH
		[09-01-2012] Update
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
	array('wfw_id'=>'cInputName'),
	//optionnels
	null
	);

//
//globales
//     
$id  = $_REQUEST["wfw_id"];
$file_name = CLIENT_DATA_PATH."/$id.xml";
$items = array();

//protege 'wfw_id' contre une modification
unset($_REQUEST["wfw_id"]);

//
// charge le fichier xml
//
$doc = clientOpen($id);

//
// ecrire la liste des items 
//
foreach($_REQUEST as $item=>$item_value){
	//verifie l'identificateur
	if(cInputIdentifier::isValid($item) != ERR_OK)
		continue;
	//obtient la valeur   
	$node = $doc->getNode("data/$item",TRUE);
	if($node){
		//formate les symboles XML
		$item_value = str_replace(array('<','>','&'),array('&lt;','&gt;','&amp;'),$item_value);
		$node->nodeValue = $item_value;
		//rpost($item,$item_value);
	}
}

if(!$doc->save($file_name)){ 
	rpost_result(ERR_FAILED, "cant_save");
}

//        
rpost("id",$id);              
rpost_result(ERR_OK);  
?>

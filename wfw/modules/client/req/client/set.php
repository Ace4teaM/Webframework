<?php

/*
	(C)2010-2011 ID-INFORMATIK. WebFrameWork(R)
	Définit les champs d'un dossier

	Arguments:
		[Name]         wfw_id     : Identificateur du dossier à vérfier
		[Password]     [wfw_pwd]  : Optionnel, mot de passe du dossier (si définit)
		[Identifier]   [wfw_type] : Optionnel, type de dossier. Si différent, la requête échoue 
		[]             [...]      : Optionnel, Champs à insérer ou à modifier
    
	Retourne:
		id         : Identificateur du dossier
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec
	
	Revisions:
		[13-12-2011] Update, ROOT_PATH
		[09-01-2012] Update
		[20-02-2012] Update, test si le dossier est en lecture seule
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../")); //racine du site
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
	array('wfw_pwd'=>'cInputPassword', 'wfw_type'=>'cInputIdentifier')
	);

//
//globales
//     
$id  = $_REQUEST["wfw_id"];
$pwd = isset($_REQUEST["wfw_pwd"])?$_REQUEST["wfw_pwd"]:"";    
$file_name = CLIENT_DATA_PATH."/$id.xml";
$items = array();

//
// charge le fichier xml
//
$doc = clientOpen($id);

//
// verifie le mot de passe
//
clientCheckPassword($doc,$pwd);

//
// verifie les permissions
//
clientCheckReadOnly($doc);

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
//print_r($_REQUEST);exit;
//
// ecrire la liste des items 
//
foreach($_REQUEST as $item=>$item_value){
	if(substr($item,0,4)!='wfw_'){
		//supprime les anti slash et decode l'unicode reçu par le formulaire HTML
//		$item_value=utf8_decode(stripslashes($item_value));
		//verifie l'identificateur
		if(cInputIdentifier::isValid($item) != ERR_OK)
			continue;
		//obtient la valeur   
		$node = $doc->getNode("data/$item",TRUE);
		if($node){
			//formate les symboles XML
			//$node->nodeValue = utf8_encode($item_value);
			$item_value = str_replace(array('<','>','&'),array('&lt;','&gt;','&amp;'),$item_value);
			$node->nodeValue = $item_value;
			//rpost($item,$item_value);
		}
	}
}

if(!$doc->save($file_name)){ 
	rpost_result(ERR_FAILED, "cant_save");
}

//        
rpost("id",$id);              
rpost_result(ERR_OK);  
?>

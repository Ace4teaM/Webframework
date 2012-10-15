<?php

/*
	(C)2010-2012 ID-INFORMATIK. WebFrameWork(R)
	Obtient tous les champs d'un dossier

	Arguments:
		[Name]         wfw_id        : Identificateur du dossier à vérfier
		[Password]     [wfw_pwd]     : Optionnel, mot de passe du dossier  
		[Identifier]   [wfw_type]    : Optionnel, type de dossier. Si différent, la requête échoue 
		[Bool]         [wfw_noempty] : Optionnel, ignore les champs vides
	Retourne:         
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec
	
	Revisions:
		[13-12-2011] Update, ROOT_PATH
		[09-01-2012] Update
		[20-02-2012] Update, ajout de l'argument 'wfw_noempty'
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
//useFormRequest();   
//
//verifie les champs obligatoires
//
rcheck(
	//requis
	array('wfw_id'=>'cInputName'),
	//optionnels
	array('wfw_pwd'=>'cInputPassword', 'wfw_type'=>'cInputIdentifier', 'wfw_noempty'=>'cInputBool')
	);

//
//globales
//     
$id  = $_REQUEST["wfw_id"];
$pwd = isset($_REQUEST["wfw_pwd"])?$_REQUEST["wfw_pwd"]:"";    
$file_name = CLIENT_DATA_PATH."/$id.xml";
$items = array();
$noempty = isset($_REQUEST["wfw_noempty"])?cInputBool::toBool($_REQUEST["wfw_noempty"]):false;

//
// charge le fichier xml
//
$doc = clientOpen($id);

//
// verifie le mot de passe
//
clientCheckPassword($doc,$pwd);

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
// liste les items a retourner
//
$node = $doc->getChild($doc->documentElement);
while($node!=NULL){
	$item = $node->tagName;
	if(substr($item,0,4)!='wfw_'){  
		//obtient la valeur
		$value = $node->nodeValue;
		if(!is_string($value))
			$value="";
		//pas de champs vide ?
		if($noempty==true && empty($value))
		{
			$node = $doc->getNext($node,NULL);
			continue;
		}
		//post
		rpost($item,$value);
	}                           
	$node = $doc->getNext($node,NULL);
}

//
rpost_result(ERR_OK);
?>

<?php

/*
	(C)2010-2012 ID-INFORMATIK. WebFrameWork(R)
	Obtient les champs d'un dossier [prive]

	Arguments:
		[Name]         wfw_id        : Identificateur du dossier à vérfier
		[Bool]         [wfw_noempty] : Optionnel, ignore les champs vides
		[]             [...]         : champs a initialiser
    
	Retourne:         
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec
	
	Revisions
		[08-12-2011] Update, ROOT_PATH
		[19-12-2011] Debug, Decode les caracteres speciaux XML pour chaque valeur
		[20-02-2012] Update, ajout de l'argument 'wfw_noempty'
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
//useFormRequest();   
//
//verifie les champs obligatoires
//
rcheck(
	//requis
	array('wfw_id'=>'cInputName'),
	//optionnels
	array('wfw_noempty'=>'cInputBool')
	);

//
//globales
//     
$id  = $_REQUEST["wfw_id"];
$file_name = CLIENT_DATA_PATH."/$id.xml";  
$items = array();
$noempty = isset($_REQUEST["wfw_noempty"])?cInputBool::toBool($_REQUEST["wfw_noempty"]):false;

//
// charge le fichier xml
//
$doc = clientOpen($id);

//
// lit la liste des items a retourner
//
foreach($_REQUEST as $item=>$item_value){
	//supprime les anti slash et decode l'unicode recu par le formulaire HTML
	//$item_value=utf8_decode(stripslashes($item_value));
	//verifie l'identificateur
	if(cInputIdentifier::isValid($item) != ERR_OK)
		continue;
	//obtient la valeur   
	$value = $doc->getNodeValue("data/$item");
	if(!is_string($value))
		$value="";
	else
		$value = str_replace(array('&lt;','&gt;','&amp;'),array('<','>','&'),$value);
	//pas de champs vide ?
	if($noempty==true && empty($value))
	{
		continue;
	}
	//post
	rpost($item,$value);
}

//
rpost_result(ERR_OK);
?>

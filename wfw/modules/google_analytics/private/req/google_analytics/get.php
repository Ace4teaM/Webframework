<?php

/*
  (C)2012 ID-INFORMATIK, WebFrameWork(R)
  Obtient des statistiques Analytics sous forme de fichier XML
  
  Arguments:
	[String] auth   : Token d'authorisation
    [String] id     : Site Profile ID (ga:"xxxx")
    [...]           : Autres parametres a passer a la requete "https://www.google.com/analytics/feeds/data"
  Retourne:        
    Contenu XML 'Feed'
    
  Remarques:
    Script essentiellement utilisé par le document "private/index.html" 
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

include(ROOT_PATH.'/private/req/admin.inc');

//
// Prepare la requete pour repondre a un formulaire
//
  
useFormRequest();

//
//verifie les champs obligatoires
//
rcheck(
	//requis
	array('auth'=>'cInputString','id'=>'cInputString'),
	//optionnels
	null
	);

//
//globales
//
$auth   = $_REQUEST['auth'];
$ids    = $_REQUEST['id'];

//ajoute les options additionnels
unset($_REQUEST['auth']);
unset($_REQUEST['id']);
$cmd="";
foreach($_REQUEST as $name=>$value)
	$cmd.="&$name=$value";

$ch1 = curl_init("https://www.google.com/analytics/feeds/data?ids=ga:$ids$cmd");

$header[] = 'Authorization: GoogleLogin auth=' . $auth;

curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch1, CURLOPT_HTTPHEADER, $header);
curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch1, CURLOPT_HEADER, false);

$response = curl_exec($ch1);
curl_close($ch1);

//retourne le contenu XML
print_r($response);
exit;

//rpost_result(ERR_OK);
?>

<?php

/*
  (C)2012 ID-INFORMATIK, WebFrameWork(R)
  Obtient un token d'authorisation à un compte google Analytics
  
  Arguments:
	[Mail]   email  : eMail de connection
    [String] passwd : Mot-de-passe de connection
    [String] id     : Site Profile ID (ga:"xxxx")
  Retourne:
	auth         : Token d'authorisation
    id           : Identifiant de la valeur modifiée
    result       : Résultat de la requête
    info         : Détails sur l'erreur en cas d'échec
    
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
	array('email'=>'cInputMail','passwd'=>'cInputString','id'=>'cInputString'),
	//optionnels
	null
	);

//
//globales
//
$email    = $_REQUEST['email'];
$passwd   = $_REQUEST['passwd'];
$ids      = 'ga:'.$_REQUEST['id'];
/*
$email = 'dev@aceteam.org';
$passwd = 'nikiball';
$ids = 'ga:45035016';
*/
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://www.google.com/accounts/ClientLogin");
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$data = array('accountType' => 'GOOGLE',
	'Email' => $email,
	'Passwd' => $passwd,
	'source'=>'CLI_GAnalytics',
	'service'=>'analytics');

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

$hasil = curl_exec($ch);
$hasil = @split("Auth=", $hasil);
$auth = $hasil[1];
rpost("auth",$auth);

curl_close($ch);

//
rpost_result(ERR_OK);
?>

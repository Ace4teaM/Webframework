<?php

/*
  (C)2011 WebFrameWork 1.3
  Execute une tache cron depuis un dossier <request>

  Arguments:
    wfw_id     : identificateur du dossier. 
    
  Retourne:         
		result     : Résultat de la requête
		info       : Détails sur l'erreur en cas d'echec
	
  Remarques:
	La sortie standard et les erreurs sont redirigees vers le fichier log definit par la contante 'LOG_FILE' de 'base.php'
	
  Revisions:
	[08-12-2011] Update, path (ROOT_PATH)
	[19-12-2011] Update, utilise xarg_req() pour obtenir les champs decodes du dossier 'request'
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
//verifie les champs obligatoires
//
rcheck(
	//requis
	array('wfw_id'=>'cInputName'),
	NULL
);

//
//globales
//     
$id  = $_REQUEST["wfw_id"];  
$cmd_line = "php ".ROOT_PATH."/";

// obtient les infos 
if(!($result=xarg_req(ROOT_PATH."/private/req/client/","getall",array("wfw_id"=>"$id","wfw_type"=>"request","get_private"=>"1"))))   
	rpost_result(ERR_FAILED,"xarg_req error (client/getall)");  

// initialise la ligne de commande
$cmd_line .= $result["wfw_req_uri"];

// ajoute les arguments
foreach($result as $key=>$value){
	if(substr($key,0,4)!='wfw_'){  
		$value = utf8_decode($value);//decode l'utf8 pour passer dans la ligne de commande
		$cmd_line .= " \"$key=".urlencode($value).'"';
	}
}

//
// redirection de la sortie standard et des erreurs vers le fichier log
//
$cmd_line .= " >> ".ROOT_PATH."/".LOG_FILE." 2>&1";

//
// execute la requete
//

$out = array(); 
exec($cmd_line,$out,$cmd_ret);
if($cmd_ret != 0)
	rpost_result(ERR_FAILED, "exec error ($cmd_ret) details in (".LOG_FILE.")");

//
// decremente le nombre d'execution
//
$count = $result["wfw_exec_count"];

if($count <= 1)
{
	//supprime le dossier
	if(!xarg_req(ROOT_PATH."/private/req/client/","remove",array("wfw_id"=>"$id")))   
		rpost_result(ERR_FAILED,"xarg_req error (client/remove)");  

	//supprime la tache
	$task_id   = basename(ROOT_PATH);
	$task_name = $result["wfw_task_name"];
	exec(ROOT_PATH."/wfw/sh/rem_cron_task.sh '$task_id' '$task_name'",$out,$cmd_ret);
	if($cmd_ret != 0)
		rpost_result(ERR_FAILED, "can't remove task");
}
else{
	//sauve les modifications
	if(!xarg_req(ROOT_PATH."/private/req/client/","set",array("wfw_id"=>"$id","wfw_exec_count"=>($count-1))))   
		rpost_result(ERR_FAILED,"xarg_req error (client/set)");  
}

//
rpost_result(ERR_OK);
?>

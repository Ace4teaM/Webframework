<?php

/*
  (C)2011 ID-INFORMATIK, WebFrameWork(R)
  Publie un article sur le site
  
  Arguments:
    client_id : Identificateur  
    
  Retourne:        
    result    : resultat de la requete.
    info      : details sur l'erreur en cas d'echec.
	
	Revisions:
		[30-01-2012] Update, Remplace l'utilisation de la classe DefaultFile par cXMLDefault
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');


//
// Prepare la requete pour repondre a un formulaire
//
  
useFormRequest();

//
// Arguments
//

rcheck(
  //requis
  array(     
    'client_id'=>'cInputName'
  ),
  //optionnels
  null    
);

// obtient les infos 
if(!($result=xarg_req(ROOT_PATH."/private/req/client/","getall",array("wfw_id"=>($_REQUEST["client_id"]),"get_private"=>"1"))))   
     rpost_result(ERR_FAILED,"xarg_req error");  

//arguments      
$file_path          = ROOT_PATH."/private/clients/data/".$_REQUEST['client_id']."/".$result['file'];
$template_file_name = $result["id"].".html";
$default_file       = ROOT_PATH."/default.xml";
    
// obtient le contenu du document
if(!file_exists($file_path))
   rpost_result(ERR_FAILED,"file_not_exitst");

$arg_content = file_get_contents($file_path);
if(FALSE === $arg_content) 
   rpost_result(ERR_ERR,"file_get_contents_error");  

// fabrique le template intermediaire
$arg_title   = $result["name"]; 
$arg_page_id = $result["id"];
$arg_date    = $result["wfw_date"];
$arg_author  = $result["author"];
$output_dir  = $result["output_dir"];
$desc        = $result["desc"];
$keywords    = $result["keywords"];

$template = <<<EOT
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  
<!--
    (C)2011-ID-Informatik
     *********************************************************************************************************************** 
     Attention:                                                                                                             
     Ce document intermediaire est genere par le module "article_writer", toutes modifications manuelle risques d'etre perdu
     ***********************************************************************************************************************
-->

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:template="http://www.webframework.fr/last/xmlns/template" xml:lang="fr" lang="fr" dir="ltr">
<head>
<title>$arg_title</title>
<meta name="description" content="$desc" />
<meta name="keywords" content="$keywords" />

<meta http-equiv="wfw.page-id" content="$arg_page_id" /><!-- page identifier -->
<meta name="date" content="$arg_date" /><!-- Date de creation -->
<meta name="author" content="$arg_author" /><!-- Auteur -->

<!-- Includes -->
<script type="text/javascript" language="javascript" src="wfw/javascript/base.js"></script>
<script type="text/javascript" language="javascript" src="wfw/javascript/dom.js"></script>
<script type="text/javascript" language="javascript" src="wfw/javascript/dom-func-compatible.js"></script>
<script type="text/javascript" language="javascript" src="wfw/javascript/wfw.js"></script>
<script type="text/javascript" language="javascript" src="wfw/javascript/wfw-extends.js"></script>

</head>
<!-- Document -->
<body>

<div name="content">
    $arg_content
</div>

</body>

</html>
EOT;

//verifie l'existance du dossier de sortie
if(!file_exists(ROOT_PATH."/private/template/$output_dir/"))
     rpost_result(ERR_FAILED,"Output directory ($output_dir) not exist");

//$template = mb_convert_encoding($template, 'UTF-8', 'OLD-ENCODING');
if(FALSE===file_put_contents(ROOT_PATH."/private/template/$output_dir/$template_file_name",$template))
     rpost_result(ERR_FAILED,"Can't write output file");

chmod(ROOT_PATH."/private/template/$output_dir/$template_file_name",0664);

// actualise les templates
if(($ret=run(ROOT_PATH."/private/sh/","./make-all.sh",$out))!=0)
     rpost_result(ERR_FAILED,"system error [make-all] ($ret) ".print_r($out,TRUE));

//charge le fichier default 
$default = new cXMLDefault();
if(!$default->Initialise($default_file)){
	rpost_result(ERR_FAILED, "cant_open_default_file");
}

//initialise dans l'index  
$index = $default->getIndexNode("page",$result["id"]);
if($index == NULL)
  $index = $default->addIndexNode("page",$result["id"]);  
if($index == NULL)   
  rpost_result(ERR_FAILED,"addIndexNode");  
$index->setAttribute("name",$result["name"]);  
$index->nodeValue = $template_file_name;

//initialise dans l'arbre  
if(NULL==($default->addTreeNode($result["parent_id"],$result["id"])))
  rpost_result(ERR_FAILED,"addTreeNode");
 
//sauvegarde
if(!$default->doc->save($default_file)){
  rpost_result(ERR_FAILED, "can't save default file: ".$default_file);
}
        
//
rpost_result(ERR_OK);
?>

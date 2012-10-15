<?php

/*
	(C)2012-ID-INFORMATIK. WebFrameWork(R)
	Fonctions utiles
*/

//erreurs strings
global $_req_err_str;
$_req_err_str = array_merge($_req_err_str,array(
	"invalid_address"=>"L'adresse mail est invalide",
	"cant_initialize_template"=>"Le template ne peut pas être chargé",
	"message_not_found"=>"Aucun contenu au message",
	"attachment_file_not_exist"=>"Le fichier à joindre n'existe pas",
	"socket_error"=>"La connexion au serveur de mail à échoué",
	"send"=>"L'Envoie à échoué",
	"cant_parse_html_template"=>"Le contenu HTML ne peut pas être transformé",
	"text_transform_unsuported_feature"=>"La transformation de contenu text n'est pas supporté pour le moment (contactez votre administrateur pour plus de renseignements)"
));

class cMailling
{
    public static function getDefaultInfos($id)
    {
            global $_hostname_;
            $infos = array(
                    "server"=>"localhost",
                    "port"=>"21",
                    "from"=>"",
                    "fromname"=>""
            );
            
            $def = new cXMLDefault();
            if( $def->Initialise(ROOT_PATH."/default.xml")){
                    $infos["server"]    = $def->getIndexValue("smtp_server",$_hostname_);
                    $infos["port"]      = $def->getIndexValue("smtp_port",$_hostname_);
                    $infos["from"]      = $def->getIndexValue("mail",$id);
                    $infos["fromname"]  = $def->getIndexValue("title",$id);
            }
            
            return $infos;
    }

    public static function sendClient($client_id,$to,$args,$transform)
    {
        $args["to"]                = $to;
        $args["transform_content"] = cInputBool::toString($transform);
        $args["wfw_id"]            = $client_id;
        
        // appel la requete
        xarg_req_result(ROOT_PATH.'/private/req/mailling/','send_client',$args,$result);
        result_check();
        
        //test le resultat de la requete
        proc_result($result["result"], (isset($result["info"]) ? $result["info"] : ""));
        result_check();
    }
}

function getDefaultInfos($id)
{
	global $_hostname_;
	$infos = array(
		"server"=>"localhost",
		"port"=>"21",
		"from"=>"",
		"fromname"=>""
	);
	$def = new cXMLDefault();
	if( $def->Initialise(ROOT_PATH."/default.xml")){
		$infos["server"]    = $def->getIndexValue("smtp_server",$_hostname_);
		$infos["port"]      = $def->getIndexValue("smtp_port",$_hostname_);
		$infos["from"]      = $def->getIndexValue("mail",$id);
		$infos["fromname"]  = $def->getIndexValue("title",$id);
	}
	return $infos;
}

?>

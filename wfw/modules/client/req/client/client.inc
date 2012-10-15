<?php

/*
	(C)2010-2012 ID-INFORMATIK. WebFrameWork(R)
	Fonctions utiles
*/

//erreurs strings
global $_req_err_str;
if(!isset($_req_err_str))
    $_req_err_str=null;

$_req_err_str = array_merge($_req_err_str,
        array(
            "invalid_pwd"=>"Le mot de passe est invalide",
            "invalid_id"=>"L'identifiant est invalide",
            "invalid_file"=>"Le fichier est corrompu ou inaccessible",
            "cant_save"=>"Le fichier ne peut pas être sauvegardé",
            "invalid_type"=>"Le type de dossier est invalide",
            "client_not_found"=>"Le dossier est introuvable",
            "cant_link_event"=>"L'Evénement ne peut pas être créé",
            "cant_unlink_event"=>"L'Evénement ne peut pas être supprimê",
            "readonly"=>"Le dossier est en lecture seule",
            "cant_link_data"=>"Le lien de données public ne peut pas être créé",
            "cant_unlink_data"=>"Le lien de données public ne peut pas être libéré"
	)
);

//ClientFactory
class cClient {
    static function upload_path($token)
    {
            $filename = ".$token.upload";
            return CLIENT_TEMP_UPLOAD_PATH."/".$filename;
    }

    static function upload_exists($token)
    {
            $path = $this.upload_path($token);
            return (file_exists($path) ? true : false);
    }

    /**
     * Cree un nouveau dossier client
     * @param string $type     Type de dossier utilisateur
     * @param bool   $use_data Crée le dossier de données ?
     * @param array  $args     Tableau associatif des champs à inserer par défaut
     * @return array tableau associatif du resultat (voir requete "/private/req/client/create")
     */
    static function create($args,$type,$use_data)
    {
            //parametres...
            if(isset($type))
                $args['wfw_type']      = $type;
            if(isset($use_data))
                $args['wfw_use_data']  = cInputBool::toString($use_data);
            
            // appel la requete
            xarg_req_result(ROOT_PATH.'/private/req/client/','create',$args,$result);
            result_check();
            
            //test la requete
            if($result===NULL)
                    return proc_result(ERR_FAILED, "sub_request_error ".ROOT_PATH.'/private/req/client/create');

            //test le resultat de la requete
            proc_result($result["result"], (isset($result["info"]) ? $result["info"] : ""));
            result_check();

            //retourne les infos de la requete
            proc_result(ERR_OK);
            return $result;
    }
    
    /**
     * Ouvre le document XML du dossier client
     * @param string $id Identificateur du dossier
     * @return XMLDocument Document XML du dossier client, false si une erreur est survenu
     * @remark La fonction implémente les codes d'erreur
     */
    static function openXML($id)
    {
            $file_name = CLIENT_DATA_PATH."/$id.xml";

            if(!file_exists($file_name)){ 
                    return proc_result(ERR_FAILED, "invalid_id");
            }

            $doc = new XMLDocument();
            if(!$doc->load($file_name)){ 
                    return proc_result(ERR_SYSTEM, "invalid_file");
            }

            // OK
            proc_result(ERR_OK);
            
            return $doc;
    }

    //
    // sauve le fichier xml
    // clientSave
    //
    static function saveXML($id,$doc)
    {   
            $file_name = CLIENT_DATA_PATH."/$id.xml";

            if(!$doc->save($file_name)){ 
                    return proc_result(ERR_SYSTEM, "cant_save");
            }
            
            // OK
            return proc_result(ERR_OK);
    }

    /**
    * verife le type de dossier
     * @param XMLDocument $doc Document du dossier client
     * @param string $type Type de dossier voulu
     * @return bool true si le type correspond au dossier, sinon false
    */
    static function checkType($doc,$type)
    {
            if($doc->getNodeValue("data/wfw_type",false) != $type){ 
                    return proc_result(ERR_FAILED, "invalid_type");
            }

            return proc_result(ERR_OK);
    }

    //
    // verifie le mot de passe
    //
    static function checkPassword($doc,$pwd)
    {   
            $file_pwd = $doc->getNodeValue("data/wfw_pwd");
            if(is_string($file_pwd)){ 
                    if($file_pwd!=$pwd)
                    { 
                            return proc_result(ERR_FAILED, "invalid_pwd");
                    }
            }
            return proc_result(ERR_OK);
    }

    //
    // vérifie la permission d'ecriture
    // clientCheckReadOnly
    //
    static function checkReadOnly($doc)
    {   
            $readonly = $doc->getNodeValue("data/wfw_readonly");
            if(is_string($readonly) && cInputBool::toBool($readonly)==true){ 
                    return proc_result(ERR_FAILED, "readonly");
            }
            return proc_result(ERR_OK);
    }

    // retourne la taille maximum d'un fichier uploadable
   // clientGetMaxFileSize
    static function getMaxFileSize($doc){
            $max_size = CLIENT_MAX_UPLOAD_SIZE;

            $tmp = $doc->getNodeValue("data/wfw_max_upload_size");
            if(!empty($tmp))
                    $max_size=intval($tmp);

            return $max_size;
    }

    // retourne le nombre maximum de fichier uploadable
   // clientGetMaxFile
    static function getMaxFile($doc){
            $max_file = CLIENT_MAX_UPLOAD_FILE;

            $tmp = $doc->getNodeValue("data/wfw_max_upload");
            if(!empty($tmp))
                    $max_file=intval($tmp);

            return $max_file;
    }

    // retourne le nombre de fichier uploadé
    static function getFileCount($id){
            $file_dir = CLIENT_DATA_PATH."/$id/";

            $file_count = 0;
            if(is_dir($file_dir)) {
                    if($dh = opendir($file_dir)) {
                            while (($file = readdir($dh)) !== false) {
                                    if(filetype($file_dir.$file)=='file'){
                                            $file_count++;
                                    }
                            }
                            closedir($dh);
                    }
            }

            return $file_count;
    }

    // active un événement
    static function pushEvent($id){
            $link_filename = CLIENT_EVENT_PATH."/$id";
            $link_target   = CLIENT_DATA_PATH."/$id.xml";

            if(file_exists($link_filename))
                    unlink($link_filename);

            if(!file_exists($link_target))
                    return proc_result(ERR_FAILED, "client_not_found");

            if(!symlink($link_target, $link_filename)) 
                    return proc_result(ERR_SYSTEM, "cant_link_event");

            proc_result(ERR_OK);
            return $link_filename;
    }

    // désactive un événement
    static function popEvent($id){
            $link_filename = CLIENT_EVENT_PATH."/$id";

            if(!file_exists($link_filename))
                    return proc_result(ERR_OK);

            if(!unlink($link_filename))
                    return proc_result(ERR_SYSTEM, "cant_unlink_event");

            proc_result(ERR_OK);
            return $link_filename;
    }

    // lie un dossier aux données
    static function pushData($id){
            $link_filename = CLIENT_PUBLIC_PATH."/$id";
            $link_target   = CLIENT_DATA_PATH."/$id";

            if(file_exists($link_filename))
                    unlink($link_filename);

            if(!file_exists($link_target))
                    return proc_result(ERR_FAILED, "client_not_found");

            if(!symlink($link_target, $link_filename)) 
                    return proc_result(ERR_SYSTEM, "cant_link_data");

            proc_result(ERR_OK);
            return $link_filename;
    }

    // libére un lien de dossier aux données
    static function popData($id){
            $link_filename = CLIENT_PUBLIC_PATH."/$id";

            if(!file_exists($link_filename))
                    return proc_result(ERR_OK);

            if(!unlink($link_filename))
                    return proc_result(ERR_SYSTEM, "cant_unlink_data");

            proc_result(ERR_OK);
            return $link_filename;
    }

}

?>

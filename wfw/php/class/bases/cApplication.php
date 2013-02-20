<?php
/*
  ---------------------------------------------------------------------------------------------------------------------------------------
  (C)2012-2013 Thomas AUGUEY <contact@aceteam.org>
  ---------------------------------------------------------------------------------------------------------------------------------------
  This file is part of WebFrameWork.

  WebFrameWork is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  WebFrameWork is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with WebFrameWork.  If not, see <http://www.gnu.org/licenses/>.
  ---------------------------------------------------------------------------------------------------------------------------------------
 */

/* Systeme */
if(PHP_OS == "WINNT"){
    define('WINDOWS',true);
    define('SYSTEM','WINDOWS');
}
else{
    define('LINUX',true);
    define('SYSTEM','LINUX');
}

require_once("iApplication.php");
require_once("php/file.php");
require_once("php/xarg.php");
require_once("php/class/bases/cResult.php");
require_once("php/templates/cHTMLTemplate.php");
require_once("php/templates/xml_template.php");

class FormField
{
    public $title;
    public $format;
    public $value;
}

/**
 * @brief Interface principale de l'application 
 * La classe Application propose une implémentation minimale de l'interface iApplication requise par la librairie.
 * L'implémentation propose la gestion :
 * - Base de données
 * - Fabrication des templates
 * - Message d'erreurs (traductions et affichage)
 * - Gestion de la configuration
 */
class cApplication implements iApplication{
    //errors class
    const Configuration              = "CONFIGURATION";
    const ModuleClassNotFound        = "MODULE_NOT_FOUND";
    const DatabaseConnectionNotFound = "DATABASE_CONNECTION_NOT_FOUND";
    const UnsuportedFeature          = "UNSUPORTED_FEATURE";
    const CreateTemporaryFile        = "CREATE_TMP_FILE";
    const Information                = "INFORMATION";
    const Success                    = "SUCCESS";
    const UnknownHostname            = "UNKNOWN_HOSTNAME";
    const NoDatabaseConfigured       = "NO_DATABASE_CONFIGURED";
    //
    private $template_attributes;
    private $config;
    private $root_path;
    private $default;
    private $hostname;
    
    /** 
     * @brief Pointeur sur la base de données par défaut
     * @var iDataBase
     */
    public $db;
    
    function cApplication($root_path,$config)
    {
        //enregistre la globale utilisée par les includes de ce construction
        global $app;
        $app = $this;
        
        //initialise les memebres
        $this->root_path = $root_path;
        $this->config = $config;
        $this->template_attributes = array();

        // initialise la base de données à null
        //( la fonction getDB initialise la connexion si besoin )
        $this->db = null;
        
        // initialise le gestionnaire de tache
        //( la fonction getTaskMgr initialise l'instance si besoin )
        $this->task = null;
        
        // initialise le fichier defaut
        //( la fonction getDefaultFile initialise l'instance si besoin )
        $this->default = null;
        
        //nom d'hôte
        //( la fonction getHostName initialise l'instance si besoin )
        $this->hostname = NULL;
        
        // Configuration par défaut
        /*$this->config = array(
            "TMP_DIR" => "tmp",
            "UPLOAD_DIR" => "tmp"
        );
        array_merge($this->config, parse_ini_file($this->root_path."/cfg/config.ini", true));*/
        
        // Charge la configuration
        //$this->config = parse_ini_file($this->root_path."/cfg/config.ini", true);
        $this->config = array_change_key_case($this->config, CASE_UPPER);
        foreach($this->config as $section=>&$params)
            $params = array_change_key_case($params, CASE_UPPER);
        
        //ajoute les chemins d'accès aux attributs de template
        $path_section = $this->getCfgSection("path");
        if(isset($path_section)){
            foreach($path_section as $name=>$path){
                $this->template_attributes["_LIB_PATH_".strtoupper($name)."_"] = $path;
                if(file_exists($path))
                    require_path($path);
                //else
                //    echo($this->getRootPath()."/$path not exists\n");
            }
        }

        //charge la classe de la base de données
        $db_classname = $this->getCfgValue("database", "class");
        if(!empty($db_classname))
            require_once($this->getLibPath("wfw")."/php/$db_classname.php");

        //charge la classe du gestionnaire de taches
        $classname = $this->getCfgValue(constant("SYSTEM"), "taskmgr_class");
        if(!empty($classname))
            require_once($this->getLibPath("wfw")."/php/system/windows/$classname.php");
    }

    /**
     * @brief Obtient le gestionnaire de tache par défaut
     * @return Résultat de la procédure
     * @retval true La fonction à réussit, $iface contient un pointeur vers une interface iTaskMgr initialisée
     * @retval false La fonction à échouée, voir cResult::getLast() pour plus d'informations
     */
    function getTaskMgr(&$iface)
    {
        //initialise
        if($this->task===NULL){
            $className = $this->getCfgValue(constant("SYSTEM"), "taskmgr_class");
            $this->task = new $className();
        }
        //ok, retourne l'interface
        $iface = $this->task;
        return RESULT_OK();
    }
    
    /**
     * @brief Obtient la connexion à la base de données par défaut
     * @return Résultat de la procédure
     * @retval true La fonction à réussit, $db_iface contient un pointeur vers une interface iDataBase initialisée
     * @retval false La fonction à échouée, voir cResult::getLast() pour plus d'informations
     */
    function getDB(&$db_iface)
    {
        //obtient le nom de la classe à instancier
        $db_classname = $this->getCfgValue("database","class");
        if(!isset($db_classname) || empty($db_classname))
            return RESULT(cResult::Failed,cApplication::NoDatabaseConfigured);

        //initialise l'instance
        if($this->db == null){
            //initialise la connexion
            $db = new $db_classname();
            $user   = $this->getCfgValue("database","user");
            $name   = $this->getCfgValue("database","name");
            $pwd    = $this->getCfgValue("database","pwd");
            $server = $this->getCfgValue("database","server");
            $port   = $this->getCfgValue("database","port");
            if(!$db->connect($user,$name,$pwd,$server,$port))
                return false;//passe le message d'erreur
            
            $this->db = $db; // ok
        }
        
        //ok, retourne l'interface
        $db_iface = $this->db;
        return RESULT_OK();
    }
    
    /** 
     * Obtient le fichier default
     * @return Résultat de la procédure
     * @retval true La fonction à réussit, $iface contient un pointeur vers une classe cXMLDefault initialisée
     * @retval false La fonction à échouée, voir cResult::getLast() pour plus d'informations
     */
    function getDefaultFile(&$iface)
    {
        if($this->default instanceof cXMLDefault){
            $iface = $this->default;
            return RESULT_OK();
        }

        //si la tentative a deja echoue
        if($this->default === FALSE)
            return RESULT(cResult::Failed,cApplication::CantLoadDefaultFile);

        //tente le chargement
        $this->default = new cXMLDefault();
        if(!$this->default->Initialise("default.xml")){
            $this->default = FALSE;
            return FALSE;//passe le résultat
        }

        $iface = $this->default;
        
        return RESULT_OK();
    }
    
    /** 
     * Obtient le nom de l'hote
     * @return Résultat de la procédure
     * @retval true La fonction à réussit, $hostname contient le nom de l'hôte (ex: localhost)
     * @retval false La fonction à échouée, voir cResult::getLast() pour plus d'informations
     */
    function getHostName(&$hostname)
    {
        //si la tentative a deja echoue
        if(is_string($this->hostname)){
            $hostname = $this->hostname;
            return RESULT_OK();
        }

        //si la tentative a deja echoue
        if($this->hostname === FALSE)
            return RESULT(cResult::Failed,cApplication::UnknownHostname);

        //test avec la commande 'hostname'
        exec("hostname", $output, $return);
        if ($return != 0){
            $this->default = FALSE;
            return RESULT(cResult::Failed,cApplication::UnknownHostname,array("cmd_return"=>print_r($return,true)));
        }
        
        $hostname = $this->hostname = strtolower($output[0]);

        return RESULT_OK();
    }
        
    /** 
     * Obtient l'e nom de l'hote'adresse de base de l'application
     * @return URI avec le chemin d'accès (ex: foo.com/bar)
     */
    function getBaseURI()
    {
        $uri = $this->getCfgValue("application","base_uri");
        if(empty($uri)){
            $uri = "http://";
            
            //hote
            $server = $_SERVER["SERVER_NAME"];
            if(substr($server,-1)=='/')
               $server = substr($server,0,strlen($server)-1);
            $uri .= $server;
            
            //chemin
            $path = dirname($_SERVER["REQUEST_URI"]);
            if(!empty($path) && $path!="/")
                $uri .= $path;
        }
        return $uri;
    }
        
    /**
     * @brief Obtient le chemin d'accès vers l'application
     * @return string Chemin absolue vers la racine de l'application
     */
    function getRootPath(){
        return $this->root_path;
    }
    
    /**
     * @brief Obtient le chemin d'accès vers l'application
     * @return string Chemin absolue vers la racine de l'application
     */
    function getTmpPath(){
        $tmp = $this->getCfgValue("path","tmp");
        if(!empty($tmp))
            return $this->root_path."/".$tmp;
        return sys_get_temp_dir();
    }
    
    /**
     * @brief Obtient un chemin d'accès depuis la configuration locale
     * 
     * @param string $name Identifiant de la librairie
     * @param bool $relatif Si true retourne le chemin relatif, sinon le chemin absolue
     * 
     * @return Chemin vers le dossier désiré
     * @retval string Chemin d'accès (sans slash de fin)
     * @retval false  Chemin introuvable dans la configuration
     */
    function getLibPath($name="wfw",$relatif=false){
        $path = $this->getCfgValue("path",$name);
        if($path == NULL){
            //$this->result->set(cResult::ERR_FAILED,"config_not_found",array("desc"=>"Library path '$name' not set in configuration file"));
            return false;
        }
        
        return (!$relatif) ? $this->root_path."/".$path : $path;
    }
    
    /**
     * @brief Obtient les parametres d'une section du fichier de configuration
     * @param $section_name Nom de la section
     * @return Paramètres de configuration
     * @retval array Liste des paramètres
     * @retval null La section n'existe pas
     */
    function getCfgSection($name){
        $name = strtoupper($name);
        return (isset($this->config[$name]) ? $this->config[$name] : null);
    }
    
    /**
     * @brief Obtient les parametres d'une section du fichier de configuration
     * @param $section_name Nom de la section
     * @param $section_name Nom de l'item
     * @return Paramètres de configuration
     * @retval array Liste des paramètres
     * @retval null La section n'existe pas
     */
    function getCfgValue($section_name,$item_name){
        $item_name = strtoupper($item_name);
        $section = $this->getCfgSection($section_name);
        return ($section!==null && isset($section[$item_name]) ? $section[$item_name] : null);
    }
    
    /**
     * @brief Fabrique une vue HTML
     * @param string $filename Chemin d'accès au fichier template (relatif à la racine du site)
     * @param string $attributes Tableau associatif des champs en entrée (voir cHTMLTemplate::transform)
     * @return string Contenu du template transformé
     */
    function makeHTMLView($filename,$attributes){
	return cHTMLTemplate::transform(
           //fichier..
           file_get_contents($this->root_path.'/'.$filename),
           //champs..
           array_merge($attributes,$this->template_attributes)
	);
    }
    
    /**
     * @brief Fabrique puis affiche une vue HTML dans la sortie standard
     * @param $filename Chemin d'accès au fichier template (relatif à la racine du site)
     * @param $attributes Tableau associatif des champs en entrée (voir cHTMLTemplate::transform)
     */
    function showHTMLView($filename,$attributes){
        $content = $this->makeHTMLView($filename,$attributes);
        header("Content-type: text/html");
        echo $content;
    }
    
    /**
     * @brief Fabrique une vue XML/XHTML
     * @param $filename Chemin d'accès au fichier template (relatif à la racine du site)
     * @param $attributes Tableau associatif des champs en entrée (voir cXMLTemplate::Initialise)
     * @param $template_file Optionnel, Nom et chemin du fichier template à utiliser. Si NULL, le champ <application:main_template> de la configuration est utilisé
    * @return string Contenu du template transformé
     */
    function makeXMLView($filename,$attributes,$template_file=NULL)
    {
        //fichier template
        if($template_file === NULL)
            $template_file = $this->getCfgValue ("application", "main_template");

        $template = new cXMLTemplate();
        
        //charge le contenu en selection
        $select = new XMLDocument("1.0", "utf-8");
        $select->load($filename);

        //ajoute le fichier de configuration
        $template->load_xml_file('default.xml',$this->root_path);

        //initialise la classe template 
        if(!$template->Initialise(
                    $template_file,
                    NULL,
                    $select,
                    NULL,
                    array_merge($attributes,$this->template_attributes) ) )
                return false;

        //transforme le fichier
	return $template->Make();
    }
    
    /**
     * @brief Fabrique et affiche une vue XML/XHTML dans la sortie standard
     * @param $filename Chemin d'accès au fichier template (relatif à la racine du site)
     * @param $attributes Tableau associatif des champs en entrée (voir cXMLTemplate::Initialise)
     * @param $template_file Optionnel, Nom et chemin du fichier template à utiliser. Si NULL, le champ <application:main_template> de la configuration est utilisé
     * @return string Contenu du template transformé
     */
    function showXMLView($filename,$attributes,$template_file=NULL){
        $content = $this->makeXMLView($filename,$attributes,$template_file);
        echo $content;
    }

    /**
     * @brief Retourne le chemin vers un fichier en cache
     * @param $extension Extension du fichier (si généré)
     * @param $tmp_filename Nom du fichier en cache
     * @return string Chemin d'accès absolue au fichier template
     */
    function cacheFilePath($extension=NULL,$tmp_filename=NULL)
    {
        //-------------------------------------------------------------------------
        //chemin d'accès au fichier cache
        if($tmp_filename === NULL)
            //$tmp_file = tempnam( $this->getCfgValue("path","tmp"), "form.html");
            return $this->getTmpPath()."/".tempnam_s($this->getTmpPath(), ".".(is_string($extension) ? $extension : "tmp"));
        return $this->getTmpPath()."/".$tmp_filename;
    }
    
    /**
     * @brief Fabrique une vue de formulaire
     * @param $filename Chemin d'accès au fichier template (relatif à la racine du site)
     * @param $select Document XML de sélection en entrée (voir cXMLTemplate::Initialise)
     * @param $attributes Tableau associatif des champs en entrée (voir cXMLTemplate::Initialise)
     * @param $tmp_file Nom du fichier en cache, null si un fichier temporaire doit être créé
     * @return string Contenu du template transformé
     */
    function makeFormView($att,$fields,$opt_fields,$values,$template_file=NULL,$tmp_filename=NULL,$xml_template_file=NULL)
    {
        if($template_file===NULL)
            $template_file = $this->getCfgValue("application", "form_template");
        $template_content = file_get_contents($this->root_path.'/'.$template_file);
        
        $default = NULL;
        $this->getDefaultFile($default);
        
        //-------------------------------------------------------------------------
        //chemin d'accès au fichier cache
        if($tmp_filename === NULL)
            //$tmp_file = tempnam( $this->getCfgValue("path","tmp"), "form.html");
            $tmp_file = $this->getTmpPath()."/".tempnam_s($this->getTmpPath(), ".html");
        else
            $tmp_file = $this->getTmpPath()."/".$tmp_filename;
        
        //fabrique le cache ?
        if($tmp_filename===NULL || ($tmp_filename!==NULL && !file_exists($tmp_file)))
        {
            // attributs du template temporaire
            $tmp_att = array(
                //champs...
                "fields"=>function($content) use ($fields,$default,$values){
                    $insert = "";
                    if($fields !== NULL)
                        foreach($fields as $name=>$type){
                            $tmp = array(
                                "name"=>$name,
                                "type"=>$type,
                                "title"=>(isset($default) ? $default->getResultText("fields",$name) : $name ),
                                "value"=>"-{".$name."}" //htmlentities(isset($values[$name]) ? $values[$name] : "")
                            );
                            $insert .= cHTMLTemplate::transform($content,$tmp);
                        }
                    return $insert;
                },
                //champs...
                "opt_fields"=>function($content) use ($opt_fields,$default,$values){
                    $insert = "";
                    if($opt_fields !== NULL)
                        foreach($opt_fields as $name=>$type){
                            $tmp = array(
                                "name"=>$name,
                                "type"=>$type,
                                "title"=>(isset($default) ? $default->getResultText("fields",$name) : $name ),
                                "value"=>"-{".$name."}" //htmlentities(isset($values[$name]) ? $values[$name] : "")
                            );
                            $insert .= cHTMLTemplate::transform($content,$tmp);
                        }
                    return $insert;
                }
            );

            //transforme le template temporaire
            $content = cHTMLTemplate::transform($template_content,$tmp_att);
            if(FALSE === file_put_contents($tmp_file, $content)){
                return RESULT(cResult::System,cApplication::CreateTemporaryFile);
            }
        }
        
        //-------------------------------------------------------------------------
        //fabrique le template final
        $content = $this->makeXMLView($tmp_file, array_merge($att,$values), $xml_template_file);
        
        //OK
        RESULT_OK();
        return $content;
    }
    
    /**
     * @brief Traitement a appliquer en cas d'erreur
     */
    public static function processLastError(){

        $result = cResult::getLast();
        if($result->code != cResult::Ok){
            header("content-type: text/plain");
            echo("The application encountered a fatal error.\n");
            echo("L'application à rencontrée une erreur fatale.\n");
            echo("\nCode\t: ");
            echo(isset(Error::$code[$result->code]) ? Error::$code[$result->code] : $result->code);
            echo("\nInfos\t: ");
            echo(isset(Error::$info[$result->info]) ? Error::$info[$result->info] : $result->info);
            if(!empty($result->att)){
                echo("\n\nAdditionnal:\n");
                print_r($result->att);
            }
            exit(-1);
        }
    }

    /** 
     * Convertie un résultat de procédure en un tableau humainement lisible
     * 
     * @param string $result Instance de la classe cResult
     * @return Tableau associatif contenant les champs traduits
     */
    public function translateResult($result)
    {
        $att = $result->toArray();
        $default;
        
        if($this->getDefaultFile($default)){

            $att["txt_result"]  = $default->getResultText("codes",$result->code);
            $att["txt_error"]   = $default->getResultText("errors",$result->info);
            if(isset($att["message"])){
                $att["txt_message"] = $default->getResultText("messages",$att["message"]);
                $att["txt_message"] = cHTMLTemplate::transform($att["txt_message"], $att);
            }
        }
        
        return $att;
    }
    
    
    
}

?>

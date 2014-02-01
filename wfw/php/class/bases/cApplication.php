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

/**
 * @file cApplication.php
 *
 * @defgroup Application
 * @brief Classe de base d'une application
 *
 * L'implémentation propose la gestion :
 * - Base de données
 * - Fabrication des templates
 * - Message d'erreurs (traductions et affichage)
 * - Gestion de la configuration
 *
 *
 * @{
 */

require_once("systemd.php");
require_once("ini.php");
require_once("class/bases/iApplication.php");
require_once("class/bases/cApplicationCtrl.php");
require_once("file.php");
require_once("xarg.php");
require_once("class/bases/cResult.php");
require_once("templates/cHTMLTemplate.php");
require_once("templates/xml_template.php");
require_once("xml_default.php");


class FormField
{
    public $title;
    public $format;
    public $value;
}

/**
 * @brief Interface principale de l'application 
 * @remarks La classe Application propose une implémentation minimale de l'interface iApplication requise par la librairie.
 */
class cApplication implements iApplication{
    
    /**
     * @defgroup Erreurs
     * @{
     */

    //errors class
    const Configuration              = "APP_CONFIGURATION";
    const ModuleClassNotFound        = "APP_MODULE_NOT_FOUND";
    const DatabaseConnectionNotFound = "APP_DATABASE_CONNECTION_NOT_FOUND";
    const UnsuportedFeature          = "APP_UNSUPORTED_FEATURE";
    const CreateTemporaryFile        = "APP_CREATE_TMP_FILE";
    const Information                = "APP_INFORMATION";
    const Success                    = "APP_SUCCESS";
    const UnknownHostname            = "APP_UNKNOWN_HOSTNAME";
    const NoDatabaseConfigured       = "APP_NO_DATABASE_CONFIGURED";
    const UnknownFormTemplateFile    = "APP_UNKNOWN_FORM_TEMPLATE_FILE";
    const EntityMissingId            = "APP_ENTITY_MISSING_ID";
    const UnsuportedRoleByCtrl       = "APP_UNSUPORTED_ROLE_BY_CTRL";
    const CantLoadDefaultFile        = "APP_CANT_LOAD_DEFAULT_FILE";
    /**
     * @brief Controleur introuvable
     * @param CTRL Nom du controleur
     */
    const CtrlNotFound               = "APP_CTRL_NOT_FOUND";
    /**
     * @brief Classe du controleur introuvable
     * @param CLASS_NAME Nom de la classe
     */
    const CtrlClassNotFound          = "APP_CTRL_CLASS_NOT_FOUND";
    /**
     * @brief Champ inconnue
     * @param FIELD_NAME Nom du champ
     */
    const UnknownField               = "APP_UNKNOWN_FIELD";
    /**
     * @brief Format de champ inconnue
     * @param FIELD_NAME Nom du champ
     */
    const UnknownFieldFormat         = "APP_UNKNOWN_FIELD_FORMAT";
    /**
     * @brief Classe de champ inconnue
     * @param CLASS_NAME Nom de la classe
     */
    const UnknownFieldClass          = "APP_UNKNOWN_FIELD_CLASS";
    /**
     * @brief Argument invalide
     */
    const InvalidArgument            = "APP_INVALID_ARGUMENT";

    /**
     * @brief Type d'argument invalide
     * @param FUNCTION Nom de la fonction appelée
     * @param PASSED Type passé
     * @param EXCPECTED Type attendu
     */
    const InvalidArgumentType        = "APP_INVALID_ARGUMENT_TYPE";

    /** 
     * @brief Résultat: Ressource introuvable
     * @param FILE Nom du fichier/ressource concernée
     */
    const ResourceNotFound           = "APP_RESOURCE_NOT_FOUND";
    
    /** 
     * @brief Résultat: Impossible de créer une ressource
     * @param FILE Nom du fichier/ressource concernée
     */
    const CantCreateResource           = "APP_CANT_CREATE_RESOURCE";
    
    /** 
     * @brief Résultat: Impossible de supprimer une ressource
     * @param FILE Nom du fichier/ressource concernée
     */
    const CantRemoveResource           = "APP_CANT_REMOVE_RESOURCE";
    
    
    /** @} */
    
    //options
    const FieldFormatClassName = 1;
    const FieldFormatName      = 2;
    
    /**
     * @defgroup Roles
     * @{
     */

    //roles
    const AnyRole       = 0xffffffff;
    const AdminRole     = 0x10000000;
    const PublicRole    = 0x20000000;
    const UserRole      = 0x40000000;
    
    /** @} */
    
    //
    protected $template_attributes;
    protected $template_attributes_xml;
    protected $config;
    protected $root_path;
    protected $default;
    protected $hostname;
    
    /** 
     * @brief Rôle(s) actuel(s) de l'utilsateur 
     * @var role
     */
    protected $role;

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
        
        //initialise les membres
        $this->root_path = $root_path;
        $this->config = $config;
        
        //template global attributes
        $this->template_attributes = array();
        //ajoute le fichier de globals (template.xml)
        $this->template_attributes_xml = new XMLDocument();
        $this->template_attributes_xml->appendChild($this->template_attributes_xml->createElement('data'));

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
        
        //debug ?
        if($this->getCfgValue("application","debug")===true){
            define('DEBUG',true);
            header("Cache-Control: max-age=1");
            //stack trace to result ?
            if($this->getCfgValue("application","debug_output_callstack")===true)
                define('DEBUG_OUTPUT_CALLSTACK',true);
        }

        //ajoute les chemins d'accès aux attributs de template
        $path_section = $this->getCfgSection("path");
        if(isset($path_section)){
            foreach($path_section as $name=>$path){
                $this->template_attributes["_LIB_PATH_".strtoupper($name)."_"] = $path;
                //if(file_exists($path))
                //    require_path($path);
                //else
                //    echo($this->getRootPath()."/$path not exists\n");
            }
        }

        //includes additionnels
        $includes = $this->getCfgSection("includes");
        if($includes){
            foreach($includes as $key=>$path){
                if(is_dir($path)){
            //        echo("include_path:$path\n");
                    include_path($path);
                }
                else{
            //        echo("include_once:$path\n");
                    include_once($path);
                }
            }
        }
        
        //scripts additionnels
        $scripts = $this->getCfgSection("scripts");
        if($scripts){
            $scriptsEl = $this->template_attributes_xml->documentElement->appendChild($this->template_attributes_xml->createElement('scripts'));
            $stylesheetEl = $this->template_attributes_xml->documentElement->appendChild($this->template_attributes_xml->createElement('stylesheet'));
            /*$this->template_attributes_xml->appendAssocArray($scriptsEl, $scripts);
            print_r($this->template_attributes_xml->saveXML());*/
            
            foreach($scripts as $key=>$path){
                $dir = resolve_path($path);
                if($dir){
                    if($dh = opendir($dir)){
                        while (($file = readdir($dh)) !== false) {
                            switch(file_ext($file)){
                                case "js":
                                    $scriptsEl->appendChild($this->template_attributes_xml->createTextElement($key,path($dir,$file)));
                                    break;
                                case "css":
                                    $stylesheetEl->appendChild($this->template_attributes_xml->createTextElement($key,path($dir,$file)));
                                    break;
                            }
                        }
                        closedir($dh);
                    }
                }
                else{
                    switch(file_ext($path)){
                        case "js":
                            $scriptsEl->appendChild($this->template_attributes_xml->createTextElement($key,$path));
                            break;
                        case "css":
                            $stylesheetEl->appendChild($this->template_attributes_xml->createTextElement($key,$path));
                            break;
                    }
                }
            }
        }
        
        //charge la classe de la base de données
        $db_classname = $this->getCfgValue("database", "class");
        if(!empty($db_classname))
            require_once($this->getLibPath("wfw_local")."/php/$db_classname.php");

        //charge la classe du gestionnaire de taches
        $classname = $this->getCfgValue(constant("SYSTEM"), "taskmgr_class");
        if(!empty($classname))
            require_once($this->getLibPath("wfw_local")."/php/system/".strtolower(constant('SYSTEM'))."/$classname.php");
        
        // Détermine le rôle de l'utilisateur en cours
        $this->determinateRoles();
    }
    
    /**
     * @brief Détermine le rôle de l'utilisateur en cours
     */
    function determinateRoles()
    {
        //assigne les nouveaux droits
        $this->setRole(cApplication::AnyRole);
    }
    
    /**
     * @brief Définit le(s) rôle(s) en cours
     * @return int Rôle passé en paramétre
     */
    function setRole($role){
        return $this->role = $role;
    }
    
    /**
     * @brief Obtient le(s) rôle(s) en cours
     * @return Masque de bits définissant les rôles
     */
    function getRole(){
        return $this->role;
    }
    
    /**
     * @brief Retourne les attributs globaux
     * @return array Tableau associatif des attributs globaux (utilisé entre autre pour fabriquer les templates)
     */
    function getAttributes(){
        return $this->template_attributes;
    }

    /**
     * @brief Retourne le document XML des attributs globaux
     * @return XMLDocument Le document XML
     */
    function getAttributesXML(){
        return $this->template_attributes_xml;
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

        //charge le fichier
        $this->default = new cXMLDefault();

        //$uri = $this->getBaseURI()."/".$this->makeCtrlURI('wfw','defaults',array("output"=>"xml"));
        $uri = $this->getBaseURI()."/default.xml";

        if(!$this->default->Initialise($uri)){
            $this->default = FALSE;
            return FALSE;//passe le résultat
        }

        $iface = $this->default;
        
        return RESULT_OK();
    }
    
    /** 
     * @todo A implémenter
     */
    function getURI($id)
    {
        if(!$this->getDefaultFile($default))
            return false;

        return $default->getIndexValue("page", $id);
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
     * Obtient le nom de l'adresse de base de l'application
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
            $path = $_SERVER["REQUEST_URI"];
            //utilise dirname() si le chemain possède un fichier
            if(!(substr($path, -1) == '/' || substr($path, -1) == '\\'))
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
    function getLibPath($name="wfw_local",$relatif=false){
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
     * @brief Obtient les paramètres de configuration
     * @return Paramètres de configuration
     * @retval array Liste des paramètres
     */
    function getCfg(){
        return $this->config;
    }
    
    /**
     * @brief Fabrique une vue HTML
     * @param $filename Chemin d'accès au fichier template (relatif à la racine du site)
     * @param $attributes Tableau associatif des champs en entrée (voir cHTMLTemplate::transform)
     * @return string Contenu du template transformé
     */
    function makeHTMLView($filename,$attributes){
        //Assure le type array pour l'utilisation de array_merge()
        if(!is_array($attributes)) $attributes=array();
        
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
     * @brief Evenement appellé par la méthode makeXMLView
     */
    function onMakeXMLTemplate(&$template,&$select,&$attributes)
    {
    }
    
    /**
     * @brief Evenement appellé par la méthode makeXMLView
     */
    function onTransformXMLTemplate(&$template,&$select,&$attributes)
    {
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
        $template = $this->createXMLView($filename,$attributes,$template_file=NULL);
        //transforme le fichier
	return $template->Make();
    }
    
    /**
     * @brief Fabrique un template de vue XML/XHTML
     * @param $filename Chemin d'accès au fichier template (relatif à la racine du site) ou instance d'une classe XMLDocument
     * @param $attributes Tableau associatif des champs en entrée (voir cXMLTemplate::Initialise)
     * @param $template_file Optionnel, Nom et chemin du fichier template à utiliser. Si NULL, le champ <application:main_template> de la configuration est utilisé
     * @return cXMLTemplate Template
     */
    function createXMLView($filename,$attributes,$template_file=NULL)
    {
        //Assure le type array pour l'utilisation de array_merge()
        if(!is_array($attributes)) $attributes=array();
        
        //fichier template
        if($template_file === NULL)
            $template_file = $this->getCfgValue ("application", "main_template");

        $template = new cXMLTemplate();
        
        //charge le contenu en selection
        $select = NULL;
        if(is_string($filename))
            $select = $template->load_xml_file(basename($filename),  dirname($filename));
        else if($filename instanceof XMLDocument)
            $select = $filename;
        
        //ajoute le fichier de configuration
        if($this->getDefaultFile($default))
            $template->push_xml_file('default.xml',$default->doc);

        //ajoute le fichier de globals
        $template->push_xml_file('template.xml',$this->template_attributes_xml);
        
        $this->onMakeXMLTemplate($template,$select,$attributes);

        //initialise la classe template 
        if(!$template->Initialise(
                    $template_file,
                    NULL,
                    $select,
                    NULL,
                    array_merge($attributes,$this->template_attributes) ) )
                return false;

        $this->onTransformXMLTemplate($template,$select,$attributes);

        //transforme le fichier
        RESULT_OK();
	return $template;
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
     * @param $fields Tableau associatif (identifiant/type) des champs obligatoires
     * @param $fields Tableau associatif (identifiant/type) des champs optionnels
     * @param $values Tableau associatif des valeurs des champs
     * @param $template_file Chemin d'accès au fichier template. Si NULL, la valeur est obtenu par le paramétre de configuration "application=>form_template"
     * @param $tmp_filename Nom du fichier temporaire en cache. Si NULL, le nom de fichier est généré
     * @return string Contenu du template transformé
     * @retval false Une erreur est survenue, voir: cResult::getLast().
     */
    function makeFormView($att,$fields,$opt_fields,$values,$template_file=NULL,$tmp_filename=NULL,$xml_template_file=NULL)
    {
        //Assure le type array pour l'utilisation de array_merge()
        if(!is_array($att)) $att=array();
        if(!is_array($values)) $values=array();
        
        //obtient le nom du template
        if($template_file===NULL)
            $template_file = $this->getCfgValue("application", "form_template");
        
        if(empty($template_file))
            return RESULT(cResult::Failed,cApplication::UnknownFormTemplateFile);
        
        $template_content = file_get_contents($this->root_path.'/'.$template_file);
        
        //obtient le fichier default
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
    public function processLastError(){
/*
        $result = cResult::getLast();
        // Traduit le nom du champ concerné
        if(isset($result->att["field_name"]) && $this->getDefaultFile($default))
            $result->att["txt_field_name"] = $default->getResultText("fields",$result->att["field_name"]);

        // Traduit le résultat
        $att = $this->translateResult($result);

        // Génére la sortie
        $format = "html";
        if(cInputFields::checkArray(array("output"=>"cInputIdentifier")))
            $format = $_REQUEST["output"] ;

        switch($format){
            case "xarg":
                header("content-type: text/xarg");
                echo xarg_encode_array($att);
                break;
            case "xml":
                header("content-type: text/xml");
                $doc = new XMLDocument();
                $rootEl = $doc->createElement('data');
                $doc->appendChild($rootEl);
                $doc->appendAssocArray($rootEl,$att);
                echo '<?xml version="1.0" encoding="UTF-8" ?>'.$doc->saveXML( $doc->documentElement );
                break;
            case "text":
            default:
                header("content-type: text/plain");
                if($result->code != cResult::Ok){
                    echo("The application encountered a fatal error.\n");
                    echo("L'application à rencontrée une erreur fatale.\n");
                }
                $result_infos = $this->translateResult($result);
                print_r($result_infos);
                break;
        }

        // ok
        exit($result->isOk() ? 0 : 1);*/
        
        $result = cResult::getLast();
        if($result->code != cResult::Ok){
            header("content-type: text/plain");
            echo("The application encountered a fatal error.\n");
            echo("L'application à rencontrée une erreur fatale.\n");
            
            /** todo: Possible cause de plentage si le controleur 'defaults' retourne une erreur (appel recursif)*/
            $result_infos = $this->translateResult($result);
            print_r($result_infos);
            
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
        $default = null;
        
        if($this->getDefaultFile($default))
        {
            $att["txt_result"]  = $default->getResultText("codes",$result->code);
            $att["txt_error"]   = $default->getResultText("errors",$result->info);
            
            //charge un message specifique
            if(isset($att["message"]) && is_string($att["message"]))
            {
                $att["txt_message"] = $default->getResultText("messages",$att["message"]);
            }
            else
            {
                //tente de charger le message correspondant au code d'erreur
                $msg = $default->getResultText("messages",$result->info);
                if($msg!=$result->info)
                    $att["txt_message"] = $msg;
            }
            
            //transforme le template du message
            if(isset($att["txt_message"]))
                $att["txt_message"] = cHTMLTemplate::transform($att["txt_message"], $att);
        }
        
        return $att;
    }
    
    /** 
     * Convertie un résultat de procédure en un tableau humainement lisible
     * 
     * @param string $result Instance de la classe cResult
     * @return Tableau associatif contenant les champs traduits
     */
    public function fieldType($id)
    {
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
    
    
    /*
      Initialise une liste de champs
      @param string $types Liste recevant les identifiants et types des champs
      @param string $fields Liste des identifiants de champs désirés
      @param string $options Option, FieldFormatName ou FieldFormatClassName
      @return Résultat de procédure
     */
    public function makeFiledList(&$types, $fields, $options=cApplication::FieldFormatName, $lang="fr")
    {
        $types = array();
        
        //initialise la liste
        foreach($fields as $key=>$id)
        {
            //obtient le type
            $type = strtolower($this->getCfgValue("fields_formats",$id));
            if(empty($type))
                return RESULT(cResult::Failed,cApplication::UnknownFieldFormat, array("message"=>true,"field_name"=>$id));
            
            //format
            switch($options)
            {
                case cApplication::FieldFormatClassName:
                    $type = "cInput".ucfirst($type);
                    if(!class_exists($type))
                        return RESULT(cResult::Failed,cApplication::UnknownFieldClass, array("message"=>true,"class_name"=>$type));
                    break;
                case cApplication::FieldFormatName:
                default:
                    break;
            }
            
            //ajoute à la liste
            $types[$id] = $type;
        }
        
        return RESULT_OK();
    }
    
    /**
     * @brief Fabrique l'URL d'un contrôleur
     * @param string $app_name    Nom de l'application, "application" si locale
     * @param string $ctrl        Nom du contrôleur
     * @param string $add_params  Chaine contenant les paramètres supplémentaires à passer à l'URL (encodé)
     */
    public function makeCtrlURI($app_name,$ctrl,$add_params)
    {
        return "ctrl.php?app=$app_name&ctrl=$ctrl" . (is_string($add_params)?"&".$add_params:"");
    }
    
    /**
     * @brief Execute un controleur
     * @param string $ctrl Nom du controleur
     * @param string $app Nom de l'application
     * @param array  $att Tableau associatif des paramètres
     * @param cApplicationCtrl $class Pointeur recevant l'instance du contrôleur
     * @param int    $role Rôle d'execution. AnyRole par défaut
     * @return boolean Résultat de procédure
     */
    public function callCtrl($ctrl,$app,$att,&$class,$role=cApplication::AnyRole)
    {
        //résultat de la requete
        RESULT_OK();
        $result = cResult::getLast();
        
        if(!isset($app))
            $app = "application";
        
        //inclue le controleur
        $class = NULL;
        if(!cInputIdentifier::isValid($ctrl))
            return false;

        $basepath = $this->getCfgValue($app,"path");
        $path = $this->getCfgValue($app,"ctrl_path")."/$ctrl.php";
        if(!file_exists($path))
            return RESULT(cResult::Failed,cApplication::CtrlNotFound,array("CTRL"=>$ctrl));

        //execute...
        $classname = $app.'_'.$ctrl.'_ctrl';
        if(!class_exists($classname))
            include($path);
        if(!class_exists($classname))
            return RESULT(cResult::Failed,Application::CtrlClassNotFound,array("CLASS_NAME"=>$classname));
        $class = new $classname();
        $class->role = $role;
        if(!($class->acceptedRole() & $role))
            return RESULT(cResult::Failed,Application::UnsuportedRoleByCtrl,array("CTRL"=>$ctrl,"ROLE"=>("0x".dechex($role))));

        // Résultat de la requete par defaut
        RESULT(cResult::Ok,cApplication::Information,array("message"=>"WFW_MSG_POPULATE_FORM"));

        // Champs requis
        $fields=NULL;
        if(is_array($class->fields) && !$this->makeFiledList(
                $fields,
                $class->fields,
                cXMLDefault::FieldFormatClassName )
           )return false;
        $class->fields = $fields;

        // Champs optionnels
        $op_fields=NULL;
        if(is_array($class->op_fields) && !$this->makeFiledList(
                $op_fields,
                $class->op_fields,
                cXMLDefault::FieldFormatClassName )
           )return false;
        $class->op_fields = $op_fields;

        //attributs d'entree
        if(is_array($att))
            $class->att = array_merge($class->att,$att);

        // test les champs
        $p = array();
        if(!cInputFields::checkArray($class->fields,$class->op_fields,$class->att,$p))
            return false;

        // execute le controleur
        $ok = $class->main($this, $basepath, $p);
        
        // DEBUG: LOG des résultats
        if(defined("DEBUG")){
            $log_file = path($this->getRootPath(),$this->getCfgValue("application","debug_log_ctrl_path"));
            if(!empty($log_file)){
                $result = cResult::getLast();
                //   print_r("log file=".path($this->getRootPath(),$log_file));exit;
                $str =
                    date("d/m/Y, H:i:s")
                    ." | "
                    . str_pad($result->getErrorContext(),7). " > ". str_pad($result->getErrorCode(),30)
                    ." | "
                    .str_pad("$app::$ctrl",40)
                    . " "
                    . str_replace("\n"," ",print_r($result->getAttList(),true))
                    . "\r\n"
                ;
                if(FALSE === @file_put_contents($log_file,$str,FILE_APPEND))
                   return RESULT(cResult::Failed,cApplication::CantCreateResource,array("FILE"=>$log_file));
            }
        }
        
        // ok
        return $ok;
    }
    
    /**
     * @brief Initialise et execute un controleur dans la sortie standard
     * @param string $ctrl Nom du controleur
     * @param string $app  Nom de l'application
     * @param int    $role Rôle d'execution. AnyRole par défaut
     * @return boolean Résultat de procédure
     */
    public function execCtrl($ctrl,$app,$role=cApplication::AnyRole)
    {
        $class=null;

        //initialise le controleur
        if(!$this->callCtrl($ctrl,$app,null,$class,$role) && !isset($class))
            $class = new cApplicationCtrl();

        //recupére le resultat
        $result = cResult::getLast();

        // Traduit le nom du champ concerné
        if(isset($result->att["field_name"]) && $this->getDefaultFile($default))
            $result->att["txt_field_name"] = $default->getResultText("fields",$result->att["field_name"]);

        // Traduit le résultat
        /** todo: Uniquement si le controleur n'est pas 'defaults' (appel recursif) */
        $att = $this->translateResult($result);

        // Ajoute les arguments reçues en entrée au template
        $att = array_merge($att,$_REQUEST);

        /* Génére la sortie */
        
        //obtient le type mime
        $format = "text/html";
        if(cInputFields::checkArray(array("output"=>"cInputIdentifier"))){
            $format = 'text/'.$_REQUEST["output"];
        }
        else if(cInputFields::checkArray(array("output"=>"cInputMime"))){
            $format = $_REQUEST["output"];
        }

        //génére la sortie
        $content = $class->output($this, $format, $att, $result);
        if($content === false)
            $this->processLastError();

        header("content-type: ".$format);
        echo $content;
        
        // ok
        exit($result->isOk()?0:1);
    }
    
    /**
     * @brief Execute une requête SQL et converti le résultat en éléments XML
     * @param string $query Corps de la requête
     * @param string $doc   Document XML recevant les éléments
     * @param int    $node  Noeud parent recevant les éléments
     * @return boolean Résultat de procédure
     * @retval false Une erreur est survenue
     */
    public function queryToXML($query,&$doc,$node)
    {
        // Crée le document XML (template)
        if(!isset($doc)){
            $doc = new XMLDocument();
            $doc->appendChild($doc->createElement('data'));
            $node = $doc->documentElement;
        }
        
        if(!$node)
            $node = $doc->documentElement;
        
        //obtient la bdd
        if(!$this->getDB($db))
            return false;
        
        if(!$db->execute($query, $result))
            return false;
        
        $row = $result->fetchRow();
        if(!is_array($row))
            return RESULT(cResult::Failed, iDatabaseQuery::EmptyResult);
        
        foreach($row as $id=>$value)
            $node->appendChild( $doc->createtextElement($id,$value) );
        
        return RESULT_OK();
    }
    
    public function queryToObject($query,&$obj)
    {
        //obtient la bdd
        if(!$this->getDB($db))
            return false;
        
        if(!$db->execute($query, $result))
            return false;
        
        $row = $result->fetchRow();
        if(!is_array($row))
            return RESULT(cResult::Failed, iDatabaseQuery::EmptyResult);
        
        $obj = (object) $row;
        
        return RESULT_OK();
    }
    
    /**
     * @brief Execute une requête SQL et converti le résultat en éléments XML
     * @param string $query Corps de la requête
     * @param string $doc   Document XML recevant les éléments
     * @param int    $node  Noeud parent recevant les éléments
     * @return boolean Résultat de procédure
     * @retval false Une erreur est survenue
     */
    public function queryResultToXML($result,&$doc,$node)
    {
        if(!$node)
            $node = $doc->documentElement;
        
        $row = $result->fetchRow();
        if(!is_array($row))
            return RESULT(cResult::Failed, iDatabaseQuery::EmptyResult);
        
        foreach($row as $id=>$value)
            $node->appendChild( $doc->createtextElement($id,$value) );
        
        return RESULT_OK();
    }
    
    /*
     * Execute une procédure normalisé en base de données
     * @param string $name Nom de la procédure SQL
     * @param mixed ... Paramétres correspondant à la procédure SQL
     * @return bool Résultat de procédure
     * @remarks La procédure SQL doit retourner un résultat de type RESULT
     */
    public static function callStoredProc($name/*,...*/){ 
        global $app;
        $db=null;
        
        if(!$app->getDB($db))
            return RESULT(cResult::Failed, Application::DatabaseConnectionNotFound);

        $params = array_slice(func_get_args(), 1);
        if(!$db->call($app->getCfgValue("database","schema"), $name, $params, $result))
            return false;
        
        $row = $result->fetchRow();

        //return $result;
        return RESULT($row["err_code"], $row["err_str"], stra_to_array($row["ext_fields"]));
    }
    
    /*
     * @brief Insert un fragment de template
     * @param $template Template reçevant le fragment
     * @param $src_selector_ar Chaine ou tableau de chaine contenant les selecteurs source
     * @param $dst_selector_ar Chaine ou tableau de chaine contenant les selecteurs de destination
     * @param $path Chemin d'accès au fichier du template (relatif à la racine du site)
     * @param $att  Tableau associatif des attributs passés au template
     * @param $data Nom ou instance d'un document XMLDocument à charger en sélection
     * @return boolean Résultat de procédure
     */
    function insertBundle($template,$src_selector_ar,$dst_selector_ar,$path,$att,$data)
    {
        //fabrique le bundle
        if(!$this->makeBundle($path,$att,$data,$bundleDoc))
            return false;
        if(!is_array($src_selector_ar)){
            $src_selector_ar = array($src_selector_ar);
        }
        if(!is_array($dst_selector_ar)){
            $dst_selector_ar = array($dst_selector_ar);
        }
        if(count($src_selector_ar)!=count($dst_selector_ar))
            return RESULT(cResult::Failed,"APP_INSERTBUNDLE_SELECTOR_SRC_AND_DST_COUNT_MUST_BE_EGALE");
        
        for($i=0;$i<count($src_selector_ar);$i++){
            $src_selector = $src_selector_ar[$i];
            $dst_selector = $dst_selector_ar[$i];
            
            //obtient la source
            $srcNodeArray = $bundleDoc->all($src_selector);
            if(!$srcNodeArray)
                continue; //return RESULT(cResult::Failed,"APP_BUNDLE_SRC_SELECTOR_NOTFOUND",array("selector"=>$src_selector));
            //obtient la destination
            $dstNodeArray = $template->doc->all($dst_selector);
            if(empty($dstNodeArray))
                continue; //return RESULT(cResult::Failed,"APP_BUNDLE_DST_SELECTOR_NOTFOUND",array("selector"=>$dst_selector));
            //insert le contenu
            foreach ($dstNodeArray as $dstKey=>$dstNode){
                foreach ($srcNodeArray as $srcKey=>$srcNode){
                    $importNode = $template->doc->importNode($srcNode,true);
                    if(!$importNode)
                        continue;
                    $dstNode->appendChild($importNode);
                }
            }
        }
        return RESULT_OK();
    }
    
    /*
     * @brief Fabrique un fragment de template
     * @param $path Chemin d'accès au fichier du template (relatif à la racine du site)
     * @param $att  Tableau associatif des attributs passés au template
     * @param $data Nom ou instance d'un document XMLDocument à charger en sélection
     * @param $doc  Pointeur sur le document créé (XMLDocument)
     * @return boolean Résultat de procédure
     */
    function makeBundle($path,$att,$data,&$doc)
    {
        $filename = basename($path);
        $dirname  = dirname($path);
        
        //charge le contenu en selection
        $doc = new XMLDocument("1.0", "utf-8");
        $content = file_get_contents($path);
        if(!$content){
            RESULT(cResult::Failed, cApplication::ResourceNotFound, array("message"=>true,"file"=>$path) );
            $this->processLastError();
        }
        //fix images path
        //$content = str_replace('images/', $dirname.'/images/', $content);
        //fix path
        //$content = str_replace('src="', 'src="'.$dirname.'/', $content);
        //fix path
        //$content = str_replace('href="', 'href="'.$dirname.'/', $content);
        
        $doc->loadHTML($content);

        //initialise le template 
        $template = new cXMLTemplate();
        
        if($this->getDefaultFile($default))
            $template->push_xml_file('default.xml',$default->doc);
        
        //merge les attributs
        if(is_array($att))
            $att = array_merge($att, $this->getAttributes());
        else
            $att = $this->getAttributes();
        
        //initialise les données depuis le script "make.php"
        $make_path = path($dirname,"make.php");
        if(file_exists($make_path)){
            $var = eval(file_get_contents($make_path));
            if(!$var($this,$doc,$att,$data,$filename,$dirname))
                return false;
        }
        
        //initialise le template 
        if (!$template->Initialise( $doc, NULL, $data, NULL, $att ))
            return false;

        //sortie
        $template->Make();

        return RESULT_OK();
    }
    
}

/** @} */
?>
<?php

/**
 * @brief Interface principale avec l'application 
 */
class Application{
    public $config;
    public $root_path;
    public $template_attributes;
    
    function Application($root_path){
        $this->root_path = $root_path;
        // Charge la configuration
        $this->config = parse_ini_file($this->root_path."/cfg/config.ini", true);
        
        //ajoute les chamins d'accès aux attributs de template
        if(isset($this->config["path"])){
            foreach($this->config["path"] as $name=>$path){
                $this->template_attributes["_LIB_PATH_".strtoupper($name)."_"] = $path;
            }
        }
        
    }
    
    /**
     * @brief Obtient le chemin d'accès vers l'application
     * @return string Chemin absolue vers la racine de l'application
     */
    function getRootPath(){
        return $this->root_path;
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
        if(!isset($this->config["path"][$name])){
            //$this->result->set(cResult::ERR_FAILED,"config_not_found",array("desc"=>"Library path '$name' not set in configuration file"));
            return false;
        }
        
        return (!$relatif) ? $this->root_path."/".$this->config["path"][$name] : $this->config["path"][$name];
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
           $attributes
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
     * @param $select Document XML de sélection en entrée (voir cXMLTemplate::Initialise)
     * @param $attributes Tableau associatif des champs en entrée (voir cXMLTemplate::Initialise)
     * @return string Contenu du template transformé
     */
    function makeXMLView($filename,$select,$attributes){ 
        $template = new cXMLTemplate();
        
        //charge le fichier de configuration
        $template->load_xml_file('default.xml',$this->root_path);
        
        //initialise la classe template 
        if(!$template->Initialise($this->root_path.'/'.$filename,NULL,$select,NULL,$attributes)){
                return false;
        }

        //transforme le fichier
	return $template->Make();
    }
    
    /**
     * @brief Fabrique puis affiche une vue XML/XHTML dans la sortie standard
     * @param $filename Chemin d'accès au fichier template (relatif à la racine du site)
     * @param $select Document XML de sélection en entrée (voir cXMLTemplate::Initialise)
     * @param $attributes Tableau associatif des champs en entrée (voir cXMLTemplate::Initialise)
     */
    function showXMLView($filename,$select,$attributes){
        $content = $this->makeXMLView($filename,$select,$attributes);
        echo $content;
    }

}

?>

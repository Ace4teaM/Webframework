<?php

/**
 * Interface principale de l'application 
 */
class Application{
    public $config;
    public $root_path;
    
    function Application($root_path){
        $this->root_path = $root_path;
        // Charge la configuration
        $this->config = parse_ini_file($this->root_path."/cfg/config.ini", true);
    }
    
    /**
     * Obtient le chemin d'accès vers l'application
     * @return string Chemin absolue vers la racine de l'application
     */
    function getRootPath(){
        return $this->root_path;
    }
    
    /**
     * Obtient un chemin d'accès depuis la configuration locale
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
        
        return ($relatif) ? $this->root_path."/".$this->config["path"][$name] : $this->config["path"][$name];
    }
    
    /**
     * Fabrique une vue HTML
     * @return string Contenu du template transformé
     */
    function makeHTML($filename,$attributes){
	return cHTMLTemplate::transform(
           //fichier..
           file_get_contents($this->root_path.'/'.$filename),
           //champs..
           $attributes
	);
    }
    
    /**
     * Affiche une vue HTML dans la sortie standard
     */
    function showHTML($filename,$attributes){
        $content = $this->makeHTML($filename,$attributes);
        header("Content-type: text/html");
        echo $content;
    }
    
    /**
     * Fabrique une vue XML/XHTML
     * @return string Contenu du template transformé
     */
    function makeXML($filename,$select,$attributes){
        
        //transforme 
        $template = new cXMLTemplate();
        if(!$template->Initialise($this->root_path.'/'.$filename,NULL,$select,NULL,$attributes)){
                return false;
        }
        
        $template->load_xml_file('default.xml',$this->root_path);

	return $template->Make();
    }
    
    /**
     * Affiche une vue XML/XHTML dans la sortie standard
     */
    function showXML($filename,$select,$attributes){
        $content = $this->makeXML($filename,$select,$attributes);
        echo $content;
    }

}

?>

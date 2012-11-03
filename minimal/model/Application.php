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
        
        return ($relatif) ? ROOT_PATH."/".$this->config["path"][$name] : $this->config["path"][$name];
    }
}

?>

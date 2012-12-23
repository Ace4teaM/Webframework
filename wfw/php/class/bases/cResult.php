<?php
/**
 * @brief Résultat de procédure (Webframework)
 */
class cResult {
    //std error code
    const Ok = 0;
    const Failed = 1;
    const System = 2;
    const DataBase = 1000;
    const Application = 2000;
    
    //
    public static $last_code,$last_info;
    
    /**
     * @brief Identifiant numérique
     * @var int
     */
    public $code;
    
    /**
     * @brief Identifiant précisiant l'erreur
     * @var string
     */
    public $info;
    
    /**
     * @brief Constructeur de la classe  
     * @param int    $code  Code de l'erreur
     * @param string $info  Identifiant décrivant plus en détail le résultat
     * @remarks Voir cResult pour plus de détails sur les codes d'erreurs
     */
    public static function last($code, $info){
        self::$last_code = $code;
        self::$last_info = $info;
        if($code != cResult::Ok){
            echo("RESULT: $code, $info\n");
            return false;
        }
        return true;
    }
    
    /**
     * @brief Constructeur de la classe  
     * @param int    $code  Code de l'erreur
     * @param string $info  Identifiant décrivant plus en détail le résultat
     * @remarks Voir cResult pour plus de détails sur les codes d'erreurs
     */
    public function cResult($code, $info){
        $this->code = $code;
        $this->info = $info;
    }
    
    /**
     * @brief Test le résultat
     * @return bool Etat du succès
     * @retval true Le résultat est un succès (==0)
     * @retval false Le résultat est un échec (!=0)
     */
    public function isOK(){
        return ($this->code == cResult::Ok ? true : false);
    }
}

function RESULT($code,$info){
    return cResult::last($code,$info);
}

function RESULT_OK(){
    return cResult::last(cResult::Ok,"Success");
}

?>

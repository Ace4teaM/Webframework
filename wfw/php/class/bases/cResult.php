<?php
/**
 * @brief Résultat de procédure (Webframework)
 */
class cResult {
    //std error code
    const Ok     = "ERR_OK";
    const Failed = "ERR_FAILED";
    const System = "ERR_SYSTEM";
    
    //
    public static $last_code,$last_info,$last_att;
    
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
     * @brief Attributs de l'erreur (tableau associatif)
     * @var array
     */
    public $att;
    
    /**
     * @brief Constructeur de la classe  
     * @param int    $code  Code de l'erreur
     * @param string $info  Identifiant décrivant plus en détail le résultat
     * @remarks Voir cResult pour plus de détails sur les codes d'erreurs
     */
    public function cResult($code, $info){
        $this->code = $code;
        $this->info = $info;
        $this->att  = array();
    }

    /**
     * @brief Initialise la dernière erreur
     * @param int    $code  Code de l'erreur
     * @param string $info  Identifiant décrivant plus en détail le résultat
     * @remarks Voir cResult pour plus de détails sur les codes d'erreurs
     */
    public static function last($code, $info){
        self::$last_code = $code;
        self::$last_info = $info;
        self::$last_att  = array();
        return ($code == cResult::Ok) ? true : false;
    }

    /**
     * @brief Obtient une instance de la dernière erreur
     * @return Instance d'une classe cResult initialisé avec les paramétres de la dernière erreur
     */
    public static function getLast(){
        $result = new cResult(self::$last_code,self::$last_info);
        $result->att = self::$last_att;
        return $result;
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

function RESULT($code,$info=""){
    return cResult::last($code,$info);
}

function RESULT_OK(){
    return cResult::last(cResult::Ok,"Success");
}

function RESULT_PUSH($name,$value){
    return cResult::$last_att[$name]=$value;
}

?>

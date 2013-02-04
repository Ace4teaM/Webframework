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
    public function cResult($code, $info, $att=array()){
        $this->code = $code;
        $this->info = $info;
        $this->att  = array_change_key_case($att, CASE_LOWER);
    }
    
    public function toArray(){
        $ar = array("result"=>$this->code, "error"=>$this->info);
        if(is_array($this->att))
            return array_merge($ar,$this->att);
        return $ar;
    }

    /**
     * @brief Initialise la dernière erreur
     * @param int    $code  Code de l'erreur
     * @param string $info  Identifiant décrivant plus en détail le résultat
     * @remarks Voir cResult pour plus de détails sur les codes d'erreurs
     */
    public static function last($code, $info, $att=array()){
        self::$last_code = $code;
        self::$last_info = $info;
        self::$last_att  = array_change_key_case($att, CASE_LOWER);
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
     * @brief Obtient un attribut
     * @return Valeur de lo'attribut, NULL si introuvable
     */
    public function getAtt($name){
        $name = strtolower($name);
        return isset($this->att[$name]) ? $this->att[$name] : NULL;
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

function RESULT($code,$info="",$att=array()){
    return cResult::last($code,$info,$att);
}

function RESULT_OK(){
    return cResult::last(cResult::Ok,"Success");
}

function RESULT_PUSH($name,$value){
    return cResult::$last_att[$name]=$value;
}

?>

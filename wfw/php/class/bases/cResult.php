<?php
/**
 * @brief Résultat de procédure (Webframework)
 */
class cResult {
    /**
     * @brief Code de l'erreur
     * @var int $code
     */
    public $code;
    
    /**
     * @brief Identifiant précisiant l'erreur
     * @var string $info
     */
    public $info;
    
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
        return ($this->code == ERR_OK ? true : false);
    }
}

?>

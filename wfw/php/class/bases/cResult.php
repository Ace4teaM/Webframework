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
 * @file cResult.php
 *
 * @defgroup Application
 * @brief Résultat de procédure
 * @{
 */
class cResult {
    //contexts
    const Ok     = "ERR_OK";       //!< @brief Contexte en cas de succès
    const Failed = "ERR_FAILED";   //!< @brief Contexte en cas d'erreur ou d'echec de l'application
    const System = "ERR_SYSTEM";   //!< @brief Contexte en cas d'erreur ou d'echec du système 
    
    /**
     * @defgroup Erreurs
     * @{
     */

    //codes
    const Success = "SUCCESS";                       //!< @brief Résultat: Succès
    const UnsuportedFeature = "UNSUPORTED_FEATURE";  //!< @brief Résultat: Fonctionnalité non supportée
    
    /** @} */
    
    //
    public static $last_code,$last_info,$last_att;
    
    /**
     * @brief Identifiant précisiant le contexte de l'erreur
     * @var string
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
     * @return Instance de cResult initialisée avec les paramétres de la dernière erreur
     */
    public static function getLast(){
        $result = new cResult(self::$last_code,self::$last_info);
        $result->att = self::$last_att;
        return $result;
    }

    /**
     * @brief Ajoute un attribut
     * @return Valeur de l'attribut, NULL si introuvable
     */
    public function addAtt($name,$value){
        $name = strtolower($name);
        $this->att[$name] = $value;
        return $value;
    }

    /**
     * @brief Obtient un attribut
     * @return Valeur de l'attribut, NULL si introuvable
     */
    public function getAtt($name){
        $name = strtolower($name);
        return isset($this->att[$name]) ? $this->att[$name] : NULL;
    }

    /**
     * @brief Obtient la liste des attributs
     * @return Tableau des attributs
     */
    public function getAttList(){
        return $this->att;
    }

    /**
     * @brief Obtient le contexte de l'erreur (ERR_OK,ERR_FAILED,...)
     * @return Identifiant du contexte
     */
    public function getErrorContext(){
        return $this->code;
    }

    /**
     * @brief Obtient le code de l'erreur
     * @return Identifiant du code
     */
    public function getErrorCode(){
        return $this->info;
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

/**
 * @brief Initialise le résultat en cours
 * @param cResult $result Instance d'un autre résultat
 * @return bool true si $code == cResult::Ok, sinon false
 */
function RESULT_INST($result){
    $ret = cResult::last($result->code,$result->info,$result->att);
    if(defined('DEBUG')) RESULT_PUSH_CALLSTACK();
    return $ret;
}

/**
 * @brief Initialise le résultat en cours
 * @param string $code Contexte de l'erreur. Généralement une des constantes suivantes: [cResult::Ok, cResult::Failed, cResult::System]
 * @param string $info Code de l'erreur
 * @param array $att Tableau associatif des attributs supplémentaires
 * @return bool true si $code == cResult::Ok, sinon false
 */
function RESULT($code,$info="",$att=array()){
    $ret = cResult::last($code,$info,$att);

    if(defined('DEBUG_OUTPUT_CALLSTACK')) RESULT_PUSH_CALLSTACK();
    return $ret;
}

/**
 * @brief Ajoute la pile d'appel au resultat
 * @return bool true
 */
function RESULT_PUSH_CALLSTACK(){

    $callstack = debug_backtrace();
    $str="";
    foreach($callstack as $key=>$caller)
        $str .= "\n".$key.' >> '.$caller['file'].':'.$caller['line'];
    RESULT_PUSH('callstack',$str);
}

/**
 * @brief Initialise le résultat en coours avec le code cResult::Ok
 * @return bool true
 */
function RESULT_OK(){
    return cResult::last(cResult::Ok,"SUCCESS");
}

/**
 * @brief Ajoute un attribut au résultat en cours
 * @param string $name Nom de l'attribut
 * @param string $value Valeur de l'attribut 
 * @return string Valeur du paramètre
 */
function RESULT_PUSH($name,$value){
    return cResult::$last_att[$name]=$value;
}

/** @} */ // end of group
?>
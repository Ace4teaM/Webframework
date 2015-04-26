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
 * @brief Classe de base d'un controleur
 */
class cApplicationCtrl{

    //--------------------------------------------------------
    // Membres
    // @class cApplicationCtrl
    //--------------------------------------------------------
    
	// Identifiants des champs requis
    public $fields     = null;
	// Identifiants des champs optionnels
    public $op_fields  = null;
	// Identifiants des champs retournés
    public $out_fields = null;
	// Source des champs en entrée, si NULL $_REQUEST est utilisé
    public $att        = array();
	// Role utilisé pour executer le controleur
    public $role       = null;
    
    //--------------------------------------------------------
    // Méthodes
    // @class cApplicationCtrl
    //--------------------------------------------------------
    
    /**
     * @brief Champs requis
     * @return Champs requis pour l'execution du contrôleur
     * @retval [array] Liste des champs (tableau associatif)
     * @retval [null] Aucun champs
     */
    public function getRequiredField() {
        return $this->fields;
    }
    
    /**
     * @brief Champs optionnels
     * @return Champs optionnels à l'execution du contrôleur
     * @retval [array] Liste des champs (tableau associatif)
     * @retval [null] Aucun champs
     */
    public function getOptionalField() {
        return $this->op_fields;
    }
    
    /**
     * @brief Champs retournés
     * @return Champs retournés à l'execution du contrôleur
     * @retval [array] Liste des champs (tableau associatif)
     * @retval [null] Aucun champs
     */
    public function getReturnedField() {
        return $this->out_fields;
    }
    
    /**
     * @brief Retourne les rôles acceptés par le contrôleur
     * @return int Masque de bits des rôles possibles
     * @remarks Les rôles prédéfinits sont définit dans la classe \c cApplication
     * @remarks Si le contrôleur est exécuté avec un rôle different de celui retourné, la procédure échoue.
     */
    public function acceptedRole() {
        return cApplication::AnyRole;
    }
    
    /**
     * @brief Retourne le type de rôle assigné pour l'execution
     * @return int Masque de bits des rôles possibles
     * @remarks Les rôles prédéfinits sont définit dans la classe cApplication
     * @remarks Cette propriété est initialisée par la méthode cApplication::callCtrl
     */
    public function hasRole() {
        return $this->role;
    }
    
    /**
     * @brief Point d(entree du controleur
     * @param iApplication $app       Instance de l'application
     * @param string       $app_path  Chemin d'accés à l'application qui à définit le controleur
     * @param StdClass     $p         Paramétres d'entrée
     * @return bool Résutat de procédure
     */
    public function cApplicationCtrl() {
        $this->att = $_REQUEST;
    }
    
    /**
     * @brief Point d'entree du controleur
     * @param iApplication $app       Instance de l'application
     * @param string       $app_path  Chemin d'accés à l'application qui à définit le controleur
     * @param StdClass     $p         Paramétres d'entrée
     * @return bool Résutat de procédure
     */
    public function main(iApplication $app, $app_path, $p) {
        return RESULT_OK();
    }
    
    /**
     * @brief Génére la sortie du controleur
     * @param iApplication $app       Instance de l'application
     * @param string       $format    Format de sortie attendue (type MIME)
     * @param StdClass     $att       Attribut de résultat
     * @return string Données en sortie
     * @retval false La génération à échoué, l'application attend un résultat de procédure
     */
    public function output(iApplication $app, $format, $att, $result) {
        switch($format){
            case "text/xarg":
                return xarg_encode_array($att);
            case "text/xml":
                $doc = new XMLDocument();
                $rootEl = $doc->createElement('data');
                $doc->appendChild($rootEl);
                //print_r($att);
                $doc->appendAssocArray($rootEl,$att);
                return '<?xml version="1.0" encoding="UTF-8" ?>'."\n".$doc->saveXML( $doc->documentElement );
            case "text/html":
                //initialise la vue depuis un template ?
                $template_name = $att["app"]."_".$att["ctrl"];
                $template_path = $app->getCfgValue("templates", $template_name);
                if($template_path){
                    // initialise à partir du template principale
                    $template = $app->createXMLView($template_path,$att);
                    if(!$template)
                        return false;
                    return $template->Make();
                }
                //initialise la vue depuis un template automatiquement
                $template_path = path($app->getCfgValue("application", "template_path"),$att["app"],$att["ctrl"].".html");
                if($template_path && file_exists($template_path)){
                    // initialise à partir du template principale
                    $template = $app->createXMLView($template_path,$att);
                    if(!$template)
                        return false;
                    return $template->Make();
                }
                //initialise un formulaire générique
                return $app->makeFormView($att, $this->fields, $this->op_fields, $this->att);
        }
        return RESULT_INST($result);
        //return RESULT(cResult::Failed,Application::UnsuportedFeature,array("FEATURE"=>"OUTPUT FORMAT $format"));
    }
};

?>
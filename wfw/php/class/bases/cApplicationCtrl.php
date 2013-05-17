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

class cApplicationCtrl{
    public $fields    = null; /**< Identifiants des champs requis */
    public $op_fields = null; /**< Identifiants des champs optionnels */
    public $att       = null; /**< Source des champs en entrée, si NULL $_REQUEST est utilisé */
    public $role      = null; /**< Role utilisé pour executer le controleur */
    
    /**
     * Retourne les rôles acceptés par le contrôleur
     * @return int Masque de bits des rôles possibles
     * @remarks Les rôles prédéfinits sont définit dans la classe \c cApplication
     * @remarks Si le contrôleur est exécuté avec un rôle different de celui retourné, la procédure échoue.
     */
    function acceptedRole() {
        return cApplication::AnyRole;
    }
    
    /**
     * Retourne le type de rôle assigné pour l'execution
     * @return int Masque de bits des rôles possibles
     * @remarks Les rôles prédéfinits sont définit dans la classe \c cApplication
     * @remarks Cette propriété est initialisée par la méthode \c cApplication::callCtrl
     */
    function hasRole() {
        return $this->role;
    }
    
    /**
     * Point d(entree du controleur
     * @param iApplication $app       Instance de l'application
     * @param string       $app_path  Chemin d'accés à l'application qui à définit le controleur
     * @param StdClass     $p         Paramétres d'entrée
     * @return bool Résutat de procédure
     */
    function cApplicationCtrl() {
        $this->att = $_REQUEST;
    }
    
    /**
     * Point d'entree du controleur
     * @param iApplication $app       Instance de l'application
     * @param string       $app_path  Chemin d'accés à l'application qui à définit le controleur
     * @param StdClass     $p         Paramétres d'entrée
     * @return bool Résutat de procédure
     */
    function main(iApplication $app, $app_path, $p) {
        return RESULT_OK();
    }
    
    /**
     * Génére la sortie du controleur
     * @param iApplication $app       Instance de l'application
     * @param string       $format    Format de sortie attendue (type MIME)
     * @param StdClass     $att       Attribut de résultat
     * @return string Données en sortie
     * @retval false La génération à échoué, l'application attend un résultat de procédure
     */
    function output(iApplication $app, $format, $att, $result) {
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
                /*$str = "<!doctype html>\n";
                $str .= "<html><body>";
                foreach($att as $k=>$v)
                    $str .= "$k = $v<br/>";
                $str .= "</body></html>";
                return $str;*/
                return $app->makeFormView($att, $this->fields, $this->op_fields, $this->att);
        }
        return RESULT(cResult::Failed,Application::UnsuportedFeature,array("FEATURE"=>"OUTPUT FORMAT $format"));
    }
    
    
};

?>

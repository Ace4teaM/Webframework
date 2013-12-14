<?php
/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2008-2007, 2012-2013 Thomas AUGUEY <contact@aceteam.org>
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

require_once("class/bases/cResult.php");

/**
 * @file input.php
 *
 * @defgroup Inputs
 * @brief Définition de champ
 * @{
 */


/**
 * @brief Classe de base d'un champ de controle
 */
class cInput {

    /**
     * @defgroup Erreurs
     * @{
     */

    const EmptyText      = "EMPTY_TEXT";
    const InvalidChar    = "INVALID_CHAR";
    const InvalidFormat  = "INVALID_FORMAT";
    const InvalidRange   = "INVALID_RANGE";
    const Oversized      = "OVERSIZED";
    const Undersized     = "UNDERSIZED";
    const TooSmallString = "TOO_SMALL_STRING";

    /** @} */
    
    /**
     * @brief Vérifie la validité du format d'un champ
     * @return Résultat de la procédure
     * @retval false Le format est invalide (voir cResult::getLast() pour plus d'informations)
     * @retval true  Le format est valide
     */
    public static function isValid($value) {
        return true;
    }


    /**
     * @brief Convertie le champ en script HTML (obselete)
     * @param $id Identifiant de la balise HTML
     * @param $value Valeur du champ à insérer
     * @return Texte du script HTML
     */
    public static function toHTML($id, $value) {
        return "";
    }

    /**
     * @brief Obtient la taille maximale possible pour ce champ
     * @return Taille maximale en nombre de caractères. Si 0, illimitée
     */
    public static function getMaxLength() {
        return 0;
    }

    /**
     * @brief Convertie une chaine en objet PHP
     * @return Objet ou chaine
     */
    public static function toObject($value){
        return $value;
    }

    /**
     * @brief Retourne l'expression régulière associée à ce champ
     * @return Chaine
     */
    public static function regExp() {
        return "";
    }

}

/** @} */ // end of group
?>
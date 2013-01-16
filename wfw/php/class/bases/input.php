<?php

/*

  WebFrameWork, v1.3 - Classe de base pour le formatage et la verification de données
  input.php
  (C)2007-2008 Avalanche, Tout droits reserver
  PHP Code

  AUTHOR: Auguey Thomas
  MAIL  : augueyace@wanadoo.fr

  Methodes:
  ::isValid
  ::toHTML
  ::getMaxLength

 */

class cInput {

    const EmptyText     = "EMPTY_TEXT";
    const InvalidChar   = "INVALID_CHAR";
    const InvalidFormat = "INVALID_FORMAT";

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
     * @param id Identifiant de la balise HTML
     * @param value Valeur du champ à insérer
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

}

?>

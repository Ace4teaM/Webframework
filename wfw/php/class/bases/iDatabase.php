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
 * @file iDatabase.php
 *
 * @defgroup DataBase
 * @brief Interface avec la base de données
 * 
 * @{
 */

require_once("cResult.php");

/**
 * @brief Interface de connexion avec une base de données
 */
interface iDatabase {
    /**
     * @defgroup Erreurs
     * @{
     */

    const ConnectionFailed = "DB_CONNECTION";
    const QueryFailed = "DB_SQL_QUERY";

    /** @} */
    
    /**
     * @brief Obtient le nom du service utilisé
     * 
     * @return string Nom du fournisseur de service (MySQL, PostgreSQL, etc...)
     */
    public function getServiceProviderName();

    /**
     * @brief Etablie la connexion
     * 
     * @param string $user   Identifiant de connexion
     * @param string $name   Nom de la base de données
     * @param string $pwd    Mot-de-passe de connexion
     * @param string $server Adresse du serveur
     * @param string $port   Port du serveur
     * 
     * @return bool Etat de la connexion
     * @retval true La connexion est établie
     * @retval false la connexion à échouée
     */
    public function connect($user, $name, $pwd, $server, $port);

    /**
     * @brief Termine la connexion
     * @return void Rien
     */
    public function disconnect();

    /**
     * @brief Appel une fonction SQL
     * 
     * @param  string  $schema    Nom du schéma (package) parent de la fonction
     * @param  string  $func      Nom de la fonction
     * @param  array   $arg_list  Tableau associatif des arguments de la fonction, null si aucun
     * 
     * @return bool Résultat de la requête
     * @retval true  La requête à réussie
     * @retval false La requête ne peut être executée, voir getResult() pour obtenir plus de détails
     * 
     * @remarks Pour extraire le résultat retourné par une fonction utilisez les methodes fetchValue ou fetchRow
     */
    public function call($schema, $func, $arg_list,&$result);
    
    /**
     * @brief Execute une requete SQL
     * 
     * @param  string          $query    Corps de la requête
     * @param  iDatabaseQuery  $result   [out] Pointeur sur l'instance du résultat
     * 
     * @return bool Résultat de la requête
     * @retval true  La requête à réussie
     * @retval false La requête ne peut être executée, voir getResult() pour obtenir plus de détails
     * 
     * @remarks Pour extraire le résultat retourné par une fonction utilisez les methodes iDatabaseQuery::fetchValue ou iDatabaseQuery::fetchRow
     */
    public function execute($query,&$result);
    
    /**
     * @brief Convertie un objet PHP en type SQL
     * 
     * @param  mixed  $value  Objet à convertir
     * 
     * @return string Valeur comptatible avec le type SQL correspondant
     */
    public static function parseValue($value);
}

/**
 * @brief Interface de requête SQL
 */
interface iDatabaseQuery {
    /**
     * Results
     * @{
     */
    const OutOfRangeResult = "DB_QUERY_OUT_OF_RANGE_RESULT"; //!< @brief Résultat: Déplacement hors rang
    const EmptyResult      = "DB_QUERY_NO_RESULT"; //!< @brief Résultat: Pas de résultat
    /** @} */

    /**
     * Seeking
     * @{
     */
    const Origin  = 1; //!< @brief Déplace le curseur depuis la position d'origine 
    const Current = 2; //!< @brief Déplace le curseur depuis la position en cours 
    const End     = 3; //!< @brief Déplace le curseur depuis la position de fin 
    /** @} */

    /**
     * @brief Extrait une valeur du résultat en cours
     * @param  mixed   $column_name   Nom de la colonne à extraire
     * @return mixed Valeur de la colonne
     */
    public function fetchValue($column_name);

    /**
     * @brief Extrait la prochaine ligne du résultat en cours
     * @return array Tableau associatif des champs
     * @remarks Le curseur de résultat est incrémenté
     */
    public function fetchRow();

    /**
     * @brief Obtient le nombre de ligne présente
     * @return int Nombre de lignes
     */
    public function rowCount();

    /**
     * @brief Obtient la requête SQL
     * @return string Texte de la requête
     */
    public function getQueryStr();

    /**
     * @brief Déplace le curseur de sélection
     * @param $pos Index de la position. L'index débute à 0 jusqu'à rowCount()-1
     * @return string Texte de la requête
     */
    public function seek($pos,$origin=iDatabaseQuery::Origin);
}

/** @} */ // end of group
?>
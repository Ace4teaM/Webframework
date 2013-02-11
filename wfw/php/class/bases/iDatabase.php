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

require_once("cResult.php");

/**
 * @brief Interface de connexion avec une base de données
 */
interface iDatabase {
    const ConnectionFailed = "DB_CONNECTION";
    const QueryFailed = "DB_SQL_QUERY";

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
     * @return mixed   Résultat de la requête
     * @retval array   Tableau associatif des données retournées
     * @retval false   La requête ne peut être executée, voir getResult() pour obtenir plus de détails
     */
    public function call($schema, $func, $arg_list);
    
    /**
     * @brief Execute une requete SQL
     * 
     * @param  string  $query    Corps de la requête
     * @param  mixed   $result   Objet de résultat
     * 
     * @return bool Résultat de la requête
     * @retval true  La requête à réussie
     * @retval false La requête ne peut être executée, voir getResult() pour obtenir plus de détails
     */
    public function execute($query,&$result);
    
    /**
     * @brief Execute une requete SQL
     * 
     * @param  string  $result        Objet de résultat (retourné par execute())
     * @param  mixed   $column_name   Nom de la colonne à extraire
     * 
     * @return mixed Valeur de la colonne
     */
    public function fetchValue($result,$column_name);
}

?>

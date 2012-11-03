<?php
/**
 * @brief Interface de connexion avec la base de données
 */
interface iDatabaseConnection {
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
	public function call($schema,$func,$arg_list);
}

?>

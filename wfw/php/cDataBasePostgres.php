<?php
/*
  ---------------------------------------------------------------------------------------------------------------------------------------
  (C)2012,2013 Thomas AUGUEY <contact@aceteam.org>
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

require_once 'class/bases/iDatabase.php';

/**
 * @brief Interface de connexion avec la base de données PostgreSQL
 */
class cDataBasePostgres implements iDatabase {

    //--------------------------------------------------------
    // Membres
    // @class cDataBasePostgres
    //--------------------------------------------------------
    
    /**
     * @brief Ressource de requête
     */
    private $res = null;
    
    /**
     * @brief Ressource de connexion retournée par pg_connect()
     */
    private $db_conn = null;

    //--------------------------------------------------------
    // Méthodes
    // @class cDataBasePostgres
    //--------------------------------------------------------

    /**
     * @brief Libére la connexion
     */
    public function __destruct() {
        $this->disconnect();
    }
    
    /**
     * @brief Obtient le nom du fournisseur de service utilisé
     * 
     * @return string "PostgreSQL"
     */
    public function getServiceProviderName(){
        return "PostgreSQL";
    }

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
    public function connect($user = "postgres", $name = "postgres", $pwd = "admin", $server = "localhost", $port = 5432) {
        //connexion
        $this->db_conn = pg_connect("host=$server port=$port dbname=$name user=$user password=$pwd");
        if (!$this->db_conn){
            $error = error_get_last();
            return RESULT(cResult::Failed, iDataBase::ConnectionFailed, array("message"=>$error["message"]));
        }

        return RESULT_OK();
    }

    /**
     * @brief Termine la connexion
     * @return void Rien
     */
    public function disconnect() {
        if ($this->db_conn) {
            pg_close($this->db_conn);
            $this->db_conn = null;
        }
    }

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
    public function call($schema, $func, $arg_list,&$result) {
        $req = "";
        if ($arg_list !== null) {
            for ($i = 0; $i < count($arg_list); $i++) {
                //ajoute la virgule si besion
                $req .= ($i ? "," : '');
                //ajoute la valeur
                $req .= cDataBasePostgres::parseValue($arg_list[$i]); //echaper les apostrophes
            }
        }
        $result = new cDataBaseQueryPostgres("select * from $schema.$func($req);", $this);
        return $result->execute();
        /*
        $this->res = pg_query($this->db_conn, "select * from $schema.$func($req);");
        if(!$this->res)
            return RESULT(cResult::Failed, iDataBase::QueryFailed, array("message"=>pg_last_error($this->db_conn)));
        
        return RESULT_OK();*/
    }

    /**
     * @brief Convertie un objet PHP en type SQL
     * @param  mixed  $value  Objet à convertir
     * @return string Valeur comptatible avec le type SQL correspondant
     */
    public static function parseValue($value){
        if(is_null($value))
            return "NULL";
        if(is_string($value))
            return "'".pg_escape_string($value)."'";
        if(is_bool($value))
            return ($value ? 'TRUE' : 'FALSE');
        if(is_numeric($value))
            return $value;
        if($value instanceof DateTime)
            $value = $value->format("Y-m-d H:i:s");
        return "'".pg_escape_string($value)."'";
    }
    
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
     * @remarks Pour extraire le résultat retourné, utilisez les methodes iDatabaseQuery::fetchValue ou iDatabaseQuery::fetchRow
     */
    public function execute($query,&$result){
        $result = new cDataBaseQueryPostgres($query, $this);
        return $result->execute();
        /*$this->res = pg_query($this->db_conn, $query);
        if(!$this->res)
            return RESULT(cResult::Failed,iDataBase::QueryFailed, array("message"=>pg_last_error($this->db_conn)));
        return RESULT_OK();*/
    }
    
    /**
     * @brief retourne la ressource de connexion à la base Postgres (retourné par pg_connect)
     */
    public function getConnectionObject(){
        return $this->db_conn;
    }
}

/**
 * @brief Requête de données SQL pour la classe cDataBasePostgres
 */
class cDataBaseQueryPostgres implements iDatabaseQuery {

    //--------------------------------------------------------
    // Membres
    // @class cDataBaseQueryPostgres
    //--------------------------------------------------------
    
    private $query;
    private $res;
    private $db;
    private $cur_pos;//position du curseur dans le resultat en cours
    
    //--------------------------------------------------------
    // Méthodes
    // @class cDataBaseQueryPostgres
    //--------------------------------------------------------
    
    /**
     * @brief Constructeur
     */
    function cDataBaseQueryPostgres($query, cDataBasePostgres $db){
        $this->query = $query;
        $this->db = $db;
        $this->cur_pos = 0;
    }
    
    /**
     * @brief Execute 
     */
    public function execute(){
        $con = $this->db->getConnectionObject();
        
        $this->cur_pos = 0;
        $this->res = @pg_query($con, $this->query);
        if(!$this->res)
            return RESULT(cResult::Failed,iDataBase::QueryFailed, array("message"=>pg_last_error($con),"query"=>$this->query));
        return RESULT_OK();
    }
    
    /**
     * @brief Extrait une valeur du résultat en cours
     * @param  mixed   $column_name   Nom de la colonne à extraire
     * @return mixed Valeur de la colonne
     */
    public function fetchValue($column_name){
        $num = pg_field_num($this->res,$column_name);
        if($num < 0)
            return RESULT(cResult::Failed, iDataBase::QueryFailed, array("message"=>"Field '$column_name' not found"));

        return pg_fetch_result($this->res, $num);
    }

    /**
     * @brief Extrait la prochaine ligne du résultat en cours
     * @return array Tableau associatif des champs
     * @remarks Le curseur de résultat est incrémenté
     */
    public function fetchRow(){
        $data = pg_fetch_assoc($this->res);
        if(is_array($data))
            $this->cur_pos++;
        return $data;
    }
    
    /**
     * @brief Obtient le nombre de ligne présente
     * @return int Nombre de lignes
     */
    public function rowCount(){
        return pg_num_rows( $this->res );
    }
    
    /**
     * @brief Obtient la requête SQL
     * @return string Texte de la requête
     */
    public function getQueryStr(){
        return $this->query;
    }
    
    /**
     * @brief Obtient l'objet de résultat
     */
    public function getResultObject(){
        return $this->res;
    }
    
    /**
     * @brief Définit l'objet de résultat
     */
    public function setResultObject($res){
        return $this->res=$res;
    }
    
    /**
     * @brief Déplace le curseur de sélection
     * @param $pos Index de la position. L'index débute à 0 jusqu'à rowCount()-1
     * @return string Texte de la requête
     */
    public function seek($pos,$origin=iDatabaseQuery::Origin){
        switch($origin){
            case iDatabaseQuery::End:
                $max = pg_num_rows( $this->res );
                $new_pos = ($max-1)-$pos;
                break;
            case iDatabaseQuery::Current:
                $new_pos = $this->cur_pos+$pos;
                break;
            case iDatabaseQuery::Origin:
            default:
                $new_pos = $pos;
                break;
        }

        //ok?
        if(pg_result_seek( $this->res, $new_pos ) === TRUE){
            $this->cur_pos = $new_pos;
            return RESULT_OK();
        }
        return RESULT(cResult::Failed,iDatabaseQuery::OutOfRangeResult);
    }
}

?>
<?php

require_once 'class/bases/iDatabase.php';

/**
 * @brief Interface de connexion avec la base de données PostgreSQL
 * @copydoc iDatabase
 */
class cDataBasePostgres implements iDatabase {

    /**
     * @brief Ressource de connexion retournée par pg_connect()
     */
    private $db_conn = null;


    /**
     * @brief Libére la connexion
     */
    public function __destruct() {
        $this->disconnect();
    }
    
    /**
     * @copydoc iDatabase::connect
     */
    public function connect($user = "postgres", $name = "postgres", $pwd = "admin", $server = "localhost", $port = 5432) {
        //connexion
        $this->db_conn = pg_connect("host=$server port=$port dbname=$name user=$user password=$pwd");
        if (!$this->db_conn){
            $error = error_get_last();
            return RESULT(iDataBase::ConnectionFailed, $error["message"]);
        }

        return RESULT_OK();
    }

    /**
     * @copydoc iDatabase::disconnect
     */
    public function disconnect() {
        if ($this->db_conn) {
            pg_close($this->db_conn);
            $this->db_conn = null;
        }
    }

    /**
     * @copydoc iDatabase::call
     */
    public function call($schema, $func, $arg_list) {
        $req = "";
        if ($arg_list !== null) {
            for ($i = 0; $i < count($arg_list); $i++) {
                $req .= ($i ? "," : '') . "'" . pg_escape_string($arg_list[$i]) . "'"; //echaper les apostrophes
            }
        }
        $res = pg_query($this->db_conn, "select * from $schema.$func($req);");
        return pg_fetch_row($res);
    }

    /**
     * @copydoc iDatabase::execute
     */
    public function execute($query,&$result){
        $result = pg_query($this->db_conn, $query);
        if(!$result)
            return RESULT(iDataBase::QueryFailed, pg_last_error($this->db_conn));
        return RESULT_OK();
    }

    /**
     * @copydoc iDatabase::fetchValue
     */
    public function fetchValue($result,$column_name){
        return pg_fetch_result($result, 0, pg_field_num($result,$column_name));
    }

}

?>

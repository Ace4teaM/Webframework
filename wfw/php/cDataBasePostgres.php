<?php

require_once 'class/bases/iDatabase.php';

/**
 * @brief Interface de connexion avec la base de données PostgreSQL
 * @copydoc iDatabase
 */
class cDataBasePostgres implements iDatabase {

    /**
     * @brief Ressource de requête
     */
    private $res = null;
    
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
     * @brief Obtient le nom du fournisseur de service utilisé
     * 
     * @return string Nom du fournisseur de service (MySQL, PostgreSQL, etc...)
     */
    public function getServiceProviderName(){
        return "PostgreSQL";
    }

    /**
     * @copydoc iDatabase::connect
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
    public function call($schema, $func, $arg_list,&$result) {
        $req = "";
        if ($arg_list !== null) {
            for ($i = 0; $i < count($arg_list); $i++) {
                //ajoute la virgule si besion
                $req .= ($i ? "," : '');
                //ajoute la valeur
                if(is_null($arg_list[$i]))
                    $req .= "NULL"; //echaper les apostrophes
                else
                    $req .= "'" . pg_escape_string($arg_list[$i]) . "'"; //echaper les apostrophes
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
     * @copydoc iDatabase::execute
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
 * @brief Interface de connexion avec la base de données PostgreSQL
 * @copydoc iDatabase
 */
class cDataBaseQueryPostgres implements iDatabaseQuery {
    private $query;
    private $res;
    private $db;
    
    function cDataBaseQueryPostgres($query, cDataBasePostgres $db){
        $this->query = $query;
        $this->db = $db;
    }
    
    /**
     * @copydoc iDatabase::execute
     */
    public function execute(){
        $con = $this->db->getConnectionObject();
        
        $this->res = @pg_query($con, $this->query);
        if(!$this->res)
            return RESULT(cResult::Failed,iDataBase::QueryFailed, array("message"=>pg_last_error($con)));
        return RESULT_OK();
    }
    
    /**
     * @copydoc iDatabase::fetchValue
     */
    public function fetchValue($column_name){
        $num = pg_field_num($this->res,$column_name);
        if($num < 0)
            return RESULT(cResult::Failed, iDataBase::QueryFailed, array("message"=>"Field '$column_name' not found"));
        return pg_fetch_result($this->res, $num);
    }

    /**
     * @copydoc iDatabase::fetchValue
     */
    public function fetchRow(){
        return pg_fetch_assoc($this->res);
    }
    
    /**
     * @copydoc iDatabase::rowCount
     */
    public function rowCount(){
        return pg_num_rows ( $this->res );
    }
    
    /**
     * @copydoc iDatabase::getQueryStr
     */
    public function getQueryStr(){
        return $this->query;
    }
    
    /**
     * @copydoc iDatabase::getResult
     */
    public function getResultObject(){
        return $this->res;
    }
    
    /**
     * @copydoc iDatabase::setResult
     */
    public function setResultObject($res){
        return $this->res=$res;
    }
    
}

?>

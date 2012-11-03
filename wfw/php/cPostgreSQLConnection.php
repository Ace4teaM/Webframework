<?php

require_once 'class/bases/iDatabaseConnection.php';

/**
 * @brief Interface de connexion avec la base de données PostgreSQL
 * @copydoc iDatabaseConnection 
 */
class cPostgreSQLConnection implements iDatabaseConnection
{
    /**
     * @brief Ressource de connexion retournée par pg_connect()
     */
	private $db_conn = null;

    /**
     * @copydoc iDatabaseConnection::connect
     */
	public function connect($user = "postgres", $name = "postgres", $pwd = "admin", $server = "localhost", $port = 5432)
	{
		//connexion
		$this->db_conn = pg_connect("host=$server port=$port dbname=$name user=$user password=$pwd");
		if(!$this->db_conn)
                    proc_result(ERR_FAILED,'DATABASE_CONNECTION_FAILED');
                
		return proc_result(ERR_OK);
	}

	/**
	 * @copydoc iDatabaseConnection::disconnect
	 */
	public function disconnect()
	{
		if($this->db_conn){
			pg_close($this->db_conn);
			$this->db_conn=null;
		}
	}
	
	/**
	 * @copydoc iDatabaseConnection::call
	 */
	public function call($schema,$func,$arg_list){
		$req = "";
        if($arg_list !== null){
            for($i=0;$i<count($arg_list);$i++){
                $req .= ($i ? "," : '')."'".pg_escape_string($arg_list[$i])."'";//echaper les apostrophes
            }
        }
		$res = pg_query($this->db_conn, "select * from $schema.$func($req);");
		return pg_fetch_row($res);
	}
    
    /**
     * @brief Libére la connexion
     */
    private function __destruct() {
        $this->disconnect();
    }
	
}


?>

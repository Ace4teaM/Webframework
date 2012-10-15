<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of cPostgreSQLConnection
 *
 * @author www-data
 */

require_once 'class/bases/iDatabaseConnection.php';

class cPostgreSQLConnection implements iDatabaseConnection
{
	public $db_conn = null;
        
        public function __destruct() {
            $this->disconnect();
        }
	
	/*
	 * 	Connexion à la base de données
	*/
	function connect($user = "postgres", $name = "postgres", $pwd = "admin", $server = "localhost", $port = 5432)
	{
		//connexion
		$this->db_conn = pg_connect("host=$server port=$port dbname=$name user=$user password=$pwd");
		if(!$this->db_conn)
                    proc_result(ERR_FAILED,'DATABASE_CONNECTION_FAILED');
                
		return proc_result(ERR_OK);
	}

	/*
	 * Deconnexion de la base de données
	*/
	function disconnect()
	{
		if($this->db_conn){
			pg_close($this->db_conn);
			$this->db_conn=null;
		}
	}
	
	/**
	 * Appel une fonction PL/SQL et retourne le resultat
	 * Paramètres:
	 * @param schema   Nom de schema dans la base de données
	 * @param func     Nom de la fonction
	 * @param arg_list Tableau associatif des arguments d'appel à la fonction 
	 * @return Tableau associatif du resultat
	 */
	public function call($schema,$func,$arg_list){
		$req = "";
	    for($i=0;$i<count($arg_list);$i++){
	        $req .= ($i ? "," : '')."'".pg_escape_string($arg_list[$i])."'";//echaper les apostrophes
	    }
		$res = pg_query($this->db_conn, "select * from $schema.$func($req);");
		return pg_fetch_row($res);
	}
}


?>

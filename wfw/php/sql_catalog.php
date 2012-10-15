<?php
/*

	WebFrameWork(R) - SQL Catalog interface class (PostgreSQL)
	sql_catalog.php
	(C)2012 ID-INFORMATIK, Tout droits reserver
	PHP Code
	
	AUTHOR: Auguey Thomas
	MAIL  : contact@id-informatik.com
	PHP   : 5+
	
	Revisions:
		[02-07-2012] Implentation
*/
class cSQLCatalog
{
	//le server de données
	public $server_adr = NULL;
	//l'utilisateur de connection
	public $server_usr = NULL;
	//le mot de passe de connection
	public $server_pwd = NULL;
	//instance de connection
	private $server_connect = NULL;
	//att
	public $guid = NULL;
	
	public function Initialise($guid,$adr,$usr,$pwd)
	{
        //Initialise les membres
	    $this->guid       = $guid;
	    $this->server_adr = $adr;
	    $this->server_usr = $usr;
	    $this->server_pwd = $pwd;
            
        //connection a la base de données
        $this->server_connect = pg_connect("host=$adr dbname=catalog user=$usr password=$pwd") or $this->post("Initialise","can't load file ". pg_last_error());
		
		//obtient les champs
		$table = pg_query($connect,"SELECT * from catalog where guid='$guid'") or $this->post("Initialise","query ". pg_last_error());
		//while ($line = pg_fetch_array($table, null, PGSQL_ASSOC))
		pg_free_result($table);
		return true;
	}
	
	function __destruct()
	{
		if($this->server_connect)
			pg_close($this->server_connect);
	}
	
    /*
        Obtient le noeud de l'item désiré
	    Arguments:
			[string] guid : Guide de l'item. Si NULL le premier noeud est retourné
			[string] id   : Optionnel, identificateur de l'item désiré
        Retourne:
			[cXMLCatalogItem] Classe de l'objet item, null si introuvable
    */  
	public function getItemObj($guid,$id)
    {
    }
	
    /*
        Debug print 
    */
    public function post($title,$msg)
    {
		echo("cSQLCatalog $title, $msg");
    }
};


class cSQLGenericObject
{

	function __construct($connect)
	{
		$this->insertElement($item_node,$this);
		
		return true;
	}
	
	/*
	 Insert les données de l'élément XML à la classe
	 Paramètres:
	 Retourne:
	 	[Bool] true.
	*/
	function insertElement($item_node,$obj){
	
		return true;
	}
	
	/*
	 Actualise la table de données
	 Paramètres:
	 Retourne:
	*/
	public function updateTable()
	{
	}
}

?>

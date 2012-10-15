<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author www-data
 */
interface iDatabaseConnection {
	public function connect($user, $name, $pwd, $server, $port);
	public function disconnect();
	public function call($schema,$func,$arg_list);
}

?>

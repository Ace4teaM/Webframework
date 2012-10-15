<?php
/*

	WebFrameWork, v1.3 - Classe de base pour le traitement des requetes
	request.php
	(C)2007-2008 Avalanche, Tout droits reserver
	PHP Code
	
	AUTHOR: Auguey Thomas
	MAIL  : augueyace@wanadoo.fr

*/

class cHTTPRequest
{
	var $content;
	var $headers;
	var $fields;
	function Send($url){
		$data=false;
		$response      = http_post_fields($url,$this->fields);
		$this->headers = webfw_HTTP_ParseResponse($response,$this->content);
	}
	function Read(){
		$this->headers = array();
		$list = headers_list();
		foreach($list as $text){
			$arg = explode(':',$text,2);
			$h_name  = trim($arg[0]);
			$h_value = trim($arg[1]);
			$this->headers[$h_name] = $h_value;
		}
		$this->fields  = $_REQUEST;
	}
	function Write(){
		$this->headers['Content-Length'] = strlen($this->content);
		foreach($this->headers as $name=>$text)
			header($name.': '.$text);
		echo($this->content);
		echo("\r\n");
	}
	function SetContent($content){
		$this->content = $content;
	}
	function GetContent(){
		return $this->content;
	}
	function SetHeaders($headers){
		return $this->headers=$headers;
	}
	function GetHeaders(){
		return $this->headers;
	}
	function SetFields($fields){
		return $this->fields=$fields;
	}
	function GetFields(){
		return $this->fields;
	}
}

?>

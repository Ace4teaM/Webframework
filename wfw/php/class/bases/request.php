<?php
/*
  ---------------------------------------------------------------------------------------------------------------------------------------
  (C)2012-2014 Thomas AUGUEY <contact@aceteam.org>
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

/**
 * @brief Classe de traitement des requêtes HTTP
 */
class cHTTPRequest
{

    //--------------------------------------------------------
    // Membres
    // @class cHTTPRequest
    //--------------------------------------------------------
    
	var $content;
	var $headers;
	var $fields;

    //--------------------------------------------------------
    // Méthodes
    // @class cHTTPRequest
    //--------------------------------------------------------
    
	public function Send($url){
		$data=false;
		$response      = http_post_fields($url,$this->fields);
		$this->headers = webfw_HTTP_ParseResponse($response,$this->content);
	}
	public function Read(){
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
	public function Write(){
		$this->headers['Content-Length'] = strlen($this->content);
		foreach($this->headers as $name=>$text)
			header($name.': '.$text);
		echo($this->content);
		echo("\r\n");
	}
	public function SetContent($content){
		$this->content = $content;
	}
	public function GetContent(){
		return $this->content;
	}
	public function SetHeaders($headers){
		return $this->headers=$headers;
	}
	public function GetHeaders(){
		return $this->headers;
	}
	public function SetFields($fields){
		return $this->fields=$fields;
	}
	public function GetFields(){
		return $this->fields;
	}
}

?>
<?php
/*

	WebFrameWork, v1.3 - Classe de base pour le traitement des requetes
	request.php
	(C)2007-2008 Avalanche, Tout droits reserver
	PHP Code
	
	AUTHOR: Auguey Thomas
	MAIL  : augueyace@wanadoo.fr

*/

class cSocket
{
	var $sock=FALSE;
	var $errstr; 
	var $errno;
	function Open($url,$port,$timeout=30){

 //   $ip=gethostbyname($url);
		
		$this->sock = @fsockopen($url,$port,$this->errno, $this->errstr,$timeout);
		if(!$this->sock)
			return ERR_REQ_OPEN_URL;
		
		$this->url = $url;
		// ! resolution bug PHP3: !
		// ajoute un protocol pour assurer le bon fonctionnement de 'parse_url'
		if(substr($url,0,3)=="www")
			$this->url_desc = parse_url("http://$url");
		else
			$this->url_desc = parse_url($url);
			
		return ERR_OK;
	}
	function Puts($str){
		fwrite($this->sock, $str);
		
		return fgets($this->sock);
	}
	function Put($str){
		fwrite($this->sock, $str);

    //lit la reponse
		$d = "";
		do{
			$tmp = fgets($this->sock);
			if($tmp!==FALSE)$d.=$tmp;
		}while($tmp!==FALSE);
		//while (!feof($this->sock)) {
		//	$d .= fread($this->sock,4096);
		//}
		return $d;
	}
	function Close(){
		if($this->sock)
			fclose($this->sock);
	}
}

class cSMTP extends cSocket
{
	function SendMessage($from,$to,$author,$suject,$content){
		$this->Puts("HELO ".$_SERVER['SERVER_ADDR']."\n");
		$this->Puts("MAIL FROM: <$from>\n");
		$this->Puts("RCPT TO: <$to>\n");
		$this->Puts("DATA\n");
		$this->Puts(
				"To: $to\n".
				"From: $from\n".
				"Subject: $suject\n".
				"\n".
				$content."\n".
				"\r\n.\r\n"
    );
		$this->Puts("QUIT\n");
		
		return ERR_OK;
	}
}

class cHTTP extends cSocket
{
	function Get($path){
		return $this->Put(
			"GET $path HTTP/1.1\r\n".
			"Host: ".$this->url_desc["host"]."\r\n".
			"Accept: */*\r\n".
				"\r\n".
				"\r\n"
		);
	}
}
?>

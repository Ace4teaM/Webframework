<?php
/*
	AUTHOR: Auguey Thomas
	MAIL  : admin@aceteam.fr
*/
function webfw_HTTP_ParseResponse($response,&$data){
	$header    = http_parse_headers($response);
	$data_size = (int)($header["Content-Length"])+2;
	$data_ofs  = strlen($response) - ($data_size);
	$data      = substr($response,$data_ofs,$data_size);
	return $header;
}

global $webfw_http_11_header_arg;

$webfw_http_11_header_arg=array(
	"Accept",
	"Accept-Charset",
	"Accept-Encoding",
	"Accept-Language",
	"Accept-Ranges",
	"Age",
	"Allow",
	"Authorization",
	"Cache-Control",
	"Connection",
	"Content-Encoding",
	"Content-Language",
	"Content-Length",
	"Content-Location",
	"Content-MD5",
	"Content-Range",
	"Content-Type",
	"Date",
	"ETag",
	"Expect",
	"Expires",
	"From",
	"Host",
	"If-Match",
	"If-Modified-Since",
	"If-None-Match",
	"If-Range",
	"If-Unmodified-Since",
	"Last-Modified",
	"Location",
	"Max-Forwards",
	"Pragma",
	"Proxy-Authenticate",
	"Proxy-Authorization",
	"Range",
	"Referer",
	"Retry-After",
	"Server",
	"TE",
	"Trailer",
	"Transfer-Encoding",
	"Upgrade",
	"User-Agent",
	"Vary",
	"Via",
	"Warning",
	"WWW-Authenticate",
);


if(!function_exists("http_parse_headers")){
	function http_parse_headers($header){
	
		$final_ar = array(); // tableau associatif des arguments de l'en-tete HTTP
		$ar  = array();      // contient les lignes de l'header avant traitement
		$max = strlen($header);
		$ofs = 0;
		
		//scan les lignes
		$line=false;
		do{
			$line=str_nextline($header,$max,$ofs);
			if($line!==false){
				if(empty($line))
					$line=false;
				else
					$ar[]=$line;
			}
		}while($line!==false);
		
		if(empty($ar))
			return false;
			
			
		//etat reponse
		$states = split(' ',$ar[0]);
//		$final_ar["Response Protocol"] = $states[0];
		$final_ar["Response Code"]     = $states[1];
		$final_ar["Response Status"]   = $states[2];


		//extrer les arguments
		global $webfw_http_11_header_arg;
		
		foreach($ar as $key=>$name){
			list($i_name, $i_value) = split(':', $name, 2);
			if(!empty($i_name)){
				$find_key = in_array_i($i_name,$webfw_http_11_header_arg);
				if($find_key!=false){
					$i_value = ltrim($i_value," ");
					$final_ar[($webfw_http_11_header_arg[$find_key])]=$i_value;
				}
			}
		}
		
		if(empty($final_ar))
			return false;

	//	print_r($final_ar);
	
		return $final_ar;
	}
}

if(!function_exists("http_post_fields")){
	function http_post_fields($url,$fields){
		$url_desc;
		
		// ! resolution bug PHP3: !
		// ajoute un protocol pour assurer le bon fonctionnement de 'parse_url'
		if(substr($url,0,3)=="www")
			$url_desc = parse_url("http://$url");
		else
			$url_desc = parse_url($url);

		
		//au moin un '/' pour l'host
		if(empty($url_desc['path']))
			$url_desc['path']="/";
		
		//
		$port="";
		$scheme="";
		
		switch ($url_desc['scheme']) {
            case 'https':
                $scheme = 'ssl://';
                $port = 443;
                break;
            case 'http':
            default:
                $scheme = '';
                $port = 80;    
        }

		$sock = fsockopen($scheme.$url_desc["host"],$port,$errno, $errstr,30);
//		$sock = fsockopen($url_desc["host"],80,$errno, $errstr,30);
		if (!$sock) die("$errstr ($errno)\n");
		
		$data = "";
		foreach($fields as $name=>$value){
			if(!empty($data))
				$data .= "&";
			$data .= "$name=".urlencode($value);
			//$data .= "$name=".($value);
		}
		
		$request .= ("POST ".$url_desc["path"]." HTTP/1.1\r\n");
		$request .= ("Host: ".$url_desc["host"]."\r\n");
		$request .= ("Connection: close\r\n");
		$request .= ("Content-type: application/x-www-form-urlencoded\r\n");
		$request .= ("Content-length: " . strlen($data) . "\r\n");
		$request .= ("Accept: */*\r\n"); 
		$request .= ("\r\n");//fin de l'header
		$request .= ("$data\r\n");
		$request .= ("\r\n");
		
//		echo($request);
		
		fwrite($sock, $request);
		
		//
		$response=""; 
		while(!feof($sock)){ 
			$response .= fgets($sock, 4096); 
		}
		
		/*
		$headers = "";
		while($str = trim(fgets($sock, 4096)))
			$headers .= "$str\n";
	
		$headers .= "\n";
	
		$body = "";
		while(!feof($sock))
		  $body .= fgets($sock, 4096);
		$response=$headers.$body;
		*/
		
		fclose($sock);
		
		return $response;
	}
}

?>

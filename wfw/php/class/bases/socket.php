<?php
/*
  ---------------------------------------------------------------------------------------------------------------------------------------
  (C)2008-2007, 2012-2013 Thomas AUGUEY <contact@aceteam.org>
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
 * Connexion de base à un serveur
 * Librairie PHP5
 */
class cSocket {
    //std error code
    const OpenURL = "SOCK_OPEN_URL";

    var $sock = FALSE;
    var $errstr;
    var $errno;

    /**
     * @brief Ouvre une connexion avec le serveur
     * @param string $url Adresse du serveur
     * @param int $port Numéro de port du serveur
     * @param int $timeout Temps d'attente avant abandon (secondes)
     * @return bool Résultat de la procédure (voir cResult::getLast() pour plus de détails)
     * 
     * @remarks N'oubliez pas de fermer la connexion avec la méthode Close() une fois les opérations terminées
     */
    function Open($url, $port, $timeout = 30) {

        //   $ip=gethostbyname($url);

        $this->sock = @fsockopen($url, $port, $this->errno, $this->errstr, $timeout);
        if (!$this->sock)
            return RESULT(cResult::Failed,cSocket::OpenURL, array("message"=>"SOCK_SERVER_CONNECTION","server"=>$url,"port"=>$port,"errno"=>$this->errno,"errstr"=>  utf8_encode($this->errstr)));

        $this->url = $url;
        // ! resolution bug PHP3: !
        // ajoute un protocol pour assurer le bon fonctionnement de 'parse_url'
        if (substr($url, 0, 3) == "www")
            $this->url_desc = parse_url("http://$url");
        else
            $this->url_desc = parse_url($url);

        return RESULT_OK();
    }

    /**
     * @brief Ecrit une chaine et retourne la réponse
     * @param string $str Message à envoyer
     * @return string Message en réponse
     */
    function Puts($str) {
        fwrite($this->sock, $str);

        return fgets($this->sock);
    }

    function Put($str) {
        fwrite($this->sock, $str);

        //lit la reponse
        $d = "";
        do {
            $tmp = fgets($this->sock);
            if ($tmp !== FALSE)
                $d.=$tmp;
        }while ($tmp !== FALSE);
        //while (!feof($this->sock)) {
        //	$d .= fread($this->sock,4096);
        //}
        return $d;
    }

    /**
     * @brief Termine la connexion
     */
    function Close() {
        if ($this->sock)
            fclose($this->sock);
    }

}

/**
 * Connexion avec un serveur SMTP
 */
class cSMTP extends cSocket {

    function SendMessage($from, $to, $author, $suject, $content) {
        $this->Puts("HELO " . $_SERVER['SERVER_ADDR'] . "\n");
        $this->Puts("MAIL FROM: <$from>\n");
        $this->Puts("RCPT TO: <$to>\n");
        $this->Puts("DATA\n");
        $this->Puts(
                "To: $to\n" .
                "From: $from\n" .
                "Subject: $suject\n" .
                "\n" .
                $content . "\n" .
                "\r\n.\r\n"
        );
        $this->Puts("QUIT\n");

        return RESULT_OK();
    }

}

/**
 * Connexion avec un serveur HTTP
 */
class cHTTP extends cSocket {

    function Get($path) {
        return $this->Put(
                        "GET $path HTTP/1.1\r\n" .
                        "Host: " . $this->url_desc["host"] . "\r\n" .
                        "Accept: */*\r\n" .
                        "\r\n" .
                        "\r\n"
        );
    }

}

?>

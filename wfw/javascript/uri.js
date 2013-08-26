/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2012,2013 Thomas AUGUEY <contact@aceteam.org>
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
 * @file
 * Fonctions utiles pour manipuler les addresses Internet (URI)
 */

/**
 * @class window
 * L'objet global Javascript
 */

/**
 * @fn object uri_cut(string uri)
 * @memberof window
 * 
 * @brief Découpe une adresse web (URI) en sections
 * @remarks Le format est basé sur le standard RFC-2396 (http://tools.ietf.org/html/rfc2396#section-3.1)
 * 
 * @param uri Adresse à analyser
 * @return Objet retournant les éléments de l'URI. null si l'URI est invalide
 * 
 * @code{.js}
 * var uri = uri_cut("http://www.aceteam.org");
 * uri.addr;      // Adresse complete
 * uri.scheme;    // Protocole
 * uri.authority; // Domaine
 * uri.path;      // Chemin
 * uri.query;     // Parametres
 * uri.fragment;  // Ancre
 * @endcode
*/
function uri_cut(uri) {
    //@todo: !! FONCTION A METTRE A JOUR RFC-3986 !!
    //caracteres authorisés par le RFC-3986 (http://tools.ietf.org/html/rfc3986)
    var c_sub_delims = "[!$&'()*+,;=]";
    var c_pct_encoded = "%[0-9]{2}";
    var c_unreserved = "[A-Za-z0-9-._~]";
    var c_query = c_unreserved + c_pct_encoded + c_sub_delims + "[:@]*";
    // !! FONCTION A METTRE A JOUR RFC-3986 !!

    //cree l'objet ADDRESS
    var obj = {
        addr: uri, 
        scheme: "", 
        authority: "", 
        path: "", 
        query: "", 
        fragment: ""
    };
    var exp, rslt;

    //obtient le schema (scheme)
    var scheme = '[A-Za-z]{1}[A-Za-z0-9+\\.\\-]*';
    exp = new RegExp('^((' + scheme + '):/+)?(.*)', 'g');
    rslt = exp.exec(uri);
    if (rslt[2] != undefined) {
        obj.scheme = rslt[2];
        uri = rslt[3]; //restant de l'uri
    }

    //obtient le domaine (*/) (authority) [obligatoire]
    var port = '[0-9]+';
    var domain = '[A-Za-z]{1}[A-Za-z0-9_\\.:\\-]*'; //Registry-based
    //var server   = '';//Server-based <userinfo>@<host>:<port>
    exp = new RegExp('^(' + domain + ')?(.*)', 'g');
    rslt = exp.exec(uri);
    if (rslt[1] == undefined) // domaine obligatoire dans l'URI
    {
//        wfw.puts("wfw.uri.cut: Invalid URI, domain not found in: " + uri);
        return null;
    }
    obj.authority = rslt[1];
    uri = rslt[2]; //restant de l'uri

    //obtient le path (*), query (?*) [optionnel] et fragment (#*) [optionnel]
    var path = '[A-Za-z0-9_\\.+%\\-]*';
    var query = '[A-Za-z0-9_\\.&=+;%\\-\\(\\)\\:\\/]*';
    var fragment = '[A-Za-z0-9_+%\\-]*';
    exp = new RegExp('^([/' + path + ']*)([?' + query + ']?)([#' + fragment + ']?)', 'g');
    rslt = exp.exec(uri);
    obj.path = ((rslt[1] != undefined) ? rslt[1].substr(1, rslt[1].length - 1) : ""); // sans '/'
    obj.query = ((rslt[2] != undefined) ? rslt[2].substr(1, rslt[2].length - 1) : ""); // sans '?'
    obj.fragment = ((rslt[3] != undefined) ? rslt[3].substr(1, rslt[3].length - 1) : ""); // sans '#'

    return obj;
}

/**
 * @fn string uri_paste(object uri)
 * @memberof window
 * 
 * @brief Re-Fabrique une URI à partir d'un objet
 * @param uri URI. Obtenu par uri_cut()
 * @return Chaine de l'URI
*/
function uri_paste(uri)
{
    var addr = "";
    
    //protocol
    if (!empty(uri.scheme))
        addr += uri.scheme + '://';
    
    //domain
    addr += uri.authority;
    
    //chemin
    if (!empty(uri.path))
        addr += '/' + uri.path;
    
    //parametres
    if (!empty(uri.query))
        addr += '?' + uri.query;
    
    //ancre
    if (!empty(uri.fragment))
        addr += '#' + uri.fragment;

    return addr;
}

/**
 * @fn object uri_query_to_object(string querystr, function decode_func)
 * @memberof window
 * 
 * @brief Convertie une chaine de paramètres en tableau associatif
 * @param querystr La chaine de paramètres
 * @param decode_func Fonction de décodage. Si null, ignoré
 * @return object Tableau associatif des paramètres
 * 
 * @code{.js}
 * var query = uri_query_to_object("voiture=alpha&lieu=paris");
 * query.voiture == "alpha";
 * query.lieu    == "paris";
 * @endcode
*/
function uri_query_to_object(querystr, decode_func) {
    var query = querystr.split("&");
    //var query = strexplode(querystr,"&",true);
    var queryend = new Object();

    if (!query.length)
        return null;

    for (var i = 0; i < query.length; i++) {
        if( empty(query[i]) )//querystr.split peut retourner un element vide
            continue;
        var tmp = query[i].split("=");
        if (typeof decode_func == "function")
            queryend[tmp[0]] = decode_func(tmp[1]);
        else
            queryend[tmp[0]] = tmp[1];
    }

    return queryend;
}


/**
 * @fn string uri_object_to_query(object querytab, function encode_func)
 * @memberof window
 * 
 * @brief Convertie un tableau associatif en chaine de paramètres 'Query' sans le séparateur '?'
 * @param object querytab  Tableau associatif des paramètres
 * @param encode_func      Fonction d'encodage. Si null, ignoré
 * @return string La chaine de paramètres
*/
function uri_object_to_query(querytab, encode_func) {
    var querystr = "";
    var bfirst = true;

    // if(typeof(bencode)=="undefined")
    //    bencode=true;

    for (var key in querytab)
    {
        //force le type string sur la valeur
        var value = ''+querytab[key];

        //ajoute le 'ET' ?
        if (!bfirst)
            querystr += "&";
        else
            bfirst = false;

        //encode la chaine
        if (typeof encode_func == "function")
            querystr += escape(key) + "=" + encode_func(value);
        else {
            //encode au moins les carateres speciaux "=" et "&"
            value = value.replace(/\&/g, "%26");
            value = value.replace(/\=/g, "%3D");
            querystr += key + "=" + value;
        }
    }

    return querystr;
}

/**
 * @fn string uri_encode(string text)
 * @memberof window
 * 
 * @brief Encode les caractères dans une URI
 * 
 * @param text La chaine à encoder
 * @return La chaine encodée au format d'une URI.
 * 
 * @remarks Encode tous les caractères supérieurs à 0x7f et ignore les caractères inferieur à 0x1f (dit, de contrôle)
 * @remarks Encode les caractères supérieurs à un octet (0xFF) sur plusieurs fragements ex: 0x4520 = "%45%20"
*/
function uri_encode(text) {
    var string = "";
    var i = 0;
    var c;

    while (i < text.length) {

        c = text.charCodeAt(i);

        /*if (c <= 0x1f) {// (control hardware devices characters)
            //ignore...
        }
        else */if (c > 0xFF) { //+ bytes
//            wfw.puts("wfw.uri.encode: unsuported up to 1 byte caracters encoding");
        //ignore...
        }
        else if (c < 0x30) { //+ bytes
            string += "%" + math_char_to_hex(c);
        }
        else {
            var reserved = "!*'();:@&=+$,/?%#[]<>";
            if ((x = reserved.indexOf(text.substr(i, 1))) != -1)
                string += "%" + math_char_to_hex(reserved.charCodeAt(x));
            else
                string += String.fromCharCode(c); //sans encodage 
        }
        i++;
    }

    return string;
}

/**
 * @fn string uri_decode(string text)
 * @memberof window
 * 
 * @brief Décode les caractères d'une URI
 * 
 * @param text La chaine à décoder
 * @return La chaine décodé.
 * 
 * @remarks Les caractères ASCII sont encodés avec un '%' suivit du nombre hexadécimal sur un octet. ex: "%E9"
*/
function uri_decode(text) {
    var string = "";
    var i = 0;
    var c;

    while (i < text.length) {

        c = text.charCodeAt(i);

        switch (c) {
            case 0x25: //%
                var i1 = math_hex_char_to_int(text.substr(i + 1, 1)); //c1
                var i2 = math_hex_char_to_int(text.substr(i + 2, 1)); //c2
                var octal = i2 + (i1 * Math.pow(2, 4));
                c = String.fromCharCode(octal);
                i += 2;
                break;
            default:
                c = String.fromCharCode(c);
                break;
        }

        i++;
        string += c;

    }

    return string;
}

/**
 * @fn string uri_encodeUTF8(string text)
 * @memberof window
 * 
 * @brief Encode les caractères dans une URI (UTF-8)
 * 
 * @param text La chaine à encoder
 * @return La chaine encodé au format d'une URI.
 * 
 * @remarks Les caractères inférieur à 0x1F (de contrôle) sont ignorés
 * @remarks Les caractères ASCII sont encodés avec un '%' suivit du nombre hexadécimal sur un octet. ex: "%E9"
 * @remarks Les caractères UTF-8 sont encodés avec un à quatre '%' suivit du nombre hexadécimal sur un octet. ex: "%D0%89"
*/
function uri_encodeUTF8(text) {
    var string = "";
    var i = 0;
    var x;
    var c;

    while (i < text.length) {

        c = text.charCodeAt(i);
        //ASCII base ?
        /*if (c <= 0x7) {// (control hardware devices characters)
            //ignore...
        }
        else */if (c <= 0x30) {
            string += "%" + math_char_to_hex(c);
        }
        else if (c <= 0x7F) {
            var reserved = "!*'();:@&=+$,/?%#[]<>";
            if ((x = reserved.indexOf(text.substr(i, 1))) != -1)
                string += "%" + math_char_to_hex(reserved.charCodeAt(x));
            else
                string += String.fromCharCode(c); //sans encodage
        }
        //UTF8
        else if (c <= 0xFFFFFFFF) {
            // 2 bytes
            if (c >= 0x7F && c < 0x800) {
                string += "%" + math_char_to_hex((c >> 6) | 0xC0);    //110X.XXXXb
                string += "%" + math_char_to_hex((c & 0x3F) | 0x80);  //10XX.XXXXb
            }
            // 3 bytes
            if (c >= 0x800 && c < 0xFFFF) {
                string += "%" + math_char_to_hex((c >> 12) | 0xE0);          //1110.XXXXb
                string += "%" + math_char_to_hex(((c >> 6) & 0x3F) | 0x80);  //10XX.XXXXb
                string += "%" + math_char_to_hex((c & 0x3F) | 0x80);         //10XX.XXXXb
            }
            // 4 bytes
            if (c >= 0xFFFF) {
                string += "%" + math_char_to_hex((c >> 18) | 0xF0);          //1111.0XXXb
                string += "%" + math_char_to_hex((c >> 12) | 0xE0);          //10XX.XXXXb
                string += "%" + math_char_to_hex(((c >> 6) & 0x3F) | 0x80);  //10XX.XXXXb
                string += "%" + math_char_to_hex((c & 0x3F) | 0x80);         //10XX.XXXXb
            }
        }
        else { //+ bytes
 //           wfw.puts("wfw.uri.encodeUTF8: unsuported up to 4 bytes caracters encoding");
            //ignore...
        }
        i++;
    }

    return string;
}

/**
 * @fn string uri_decodeUTF8(string text)
 * @memberof window
 * 
 * @brief Décode les caractères d'une URI (UTF-8)
 * 
 * @param text La chaine à décoder
 * @return La chaine décodé.
 * @remarks Les caractères ASCII sont encodés d'un '%' suivit du nombre hexadécimal sur un octet. ex: "%E9"
 * @remarks Les caractères UTF-8 sont encodés de un à quatre '%' suivit du nombre hexadécimal sur un octet. ex: "%D0%89"
 * 
 * ## Encodage des caractères
 * 
 * UTF8 bits encoding:
 * 
 * | bits | BYTE 0 | BYTE 1 | BYTE 2 | BYTE 3 |  bits  |
 * |------|--------|--------|--------|--------|--------|
 * |   0  |CCCCxxxx|TTxxxxxx|TTxxxxxx|TTxxxxxx|   32   |
 * 
 * - C  = Forment une suite de 1 d'une longueur égale au nombre d'octets utilisés pour coder le caractère (1000,1100,1110 ou 1111)
 * - TT = Les deux premiers bits de poids fort identifie les octets suivants (Egale à 10b )
 * - x  = Constitue les bits de la valeur final une fois concaténé
*/
function uri_decodeUTF8(text) {
    var string = "";
    var i = 0;
    var c;

    while (i < text.length) {

        c = text.charCodeAt(i);

        switch (c) {
            case 0x25: //%
                var byte1 = math_hex2_to_int(text.substr(i + 1, 2));
                // UNICODE codé sur 1 byte
                if (byte1 <= 0x7F) {
                    //                        wfw.puts("codé sur 1 octets");
                    c = String.fromCharCode(byte1);
                    string += c;
                    i += 2;
                }
                // UNICODE codé sur 2 octets (11000000b+)
                else if (byte1 > 0x7F && byte1 < 0xE0) {
                    //                        wfw.puts("codé sur 2 octets");
                    var byte2 = math_hex2_to_int(text.substr(i + 4, 2));
                    if (byte2 >= 0x80)//10b de poid fort?
                    {
                        c = ((byte1 & 0x1F) << 6) | (byte2 & 0x3F); //5bits et 6bits
                        string += String.fromCharCode(c);
                        i += 5;
                    }
                }
                // UNICODE codé sur 3 octets (11100000b+)
                else if (byte1 >= 0xE0 && byte1 < 0xF0) {
                    //                        wfw.puts("codé sur 3 octets");
                    var byte2 = math_hex2_to_int(text.substr(i + 4, 2));
                    var byte3 = math_hex2_to_int(text.substr(i + 7, 2));
                    if (byte2 >= 0x80 && byte3 >= 0x80)//10b de poid fort?
                    {
                        c = ((byte1 & 0xF) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F); //5bits, 6bits et 6bits
                        string += String.fromCharCode(c);
                        i += 8;
                    }
                }
                // UNICODE codé sur 4 octets (11110000b+)
                else if (byte1 >= 0xF0) {
                    //                        wfw.puts("codé sur 4 octets");
                    var byte2 = math_hex2_to_int(text.substr(i + 4, 2));
                    var byte3 = math_hex2_to_int(text.substr(i + 7, 2));
                    var byte4 = math_hex2_to_int(text.substr(i + 10, 2));
                    if (byte2 >= 0x80 && byte3 >= 0x80 && byte4 >= 0x80)//10b de poid fort?
                    {
                        c = ((byte1 & 0x7) << 18) | ((byte2 & 0x3F) << 12) | ((byte3 & 0x3F) << 6) | (byte4 & 0x3F); //5bits, 6bits, 6bits et 6bits
                        string += String.fromCharCode(c);
                        i += 11;
                    }
                }
                //pas trouvé?
                if (c == 0x25) {
 //                   wfw.puts(byte1 + " pas trouvé");
                    c = "?"; //illegal encoding
                    i += 2;
                }
                break;

            default:
                string += String.fromCharCode(c);
                break;
        }
        i++; //caractere lu
    //            wfw.puts(text.substring(0,i));
    }
    //        wfw.puts(string);

    return string;
}

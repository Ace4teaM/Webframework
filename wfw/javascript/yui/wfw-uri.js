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


YUI.add('wfw-uri', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class URI
     * @memberof wfw
     * @brief Fonctions relatives aux adresses web (URI)
     * */
    wfw.URI = {
        /**
         * @brief Adresse (URI)
         * @class ADDRESS
         * @memberof URI
         * @implements OBJECT
         * 
         * @param att Attributs de l'objet
         * 
         * #Membres
         * @param string addr      Adresse complète de l'URI
         * @param string scheme    Schéma sans "://". Si aucun, une chaine vide
         * @param string authority Nom de domaine ou adresse IP
         * @param string path      Chemin d'accès (sans "/" en début). Si aucun, une chaine vide
         * @param string query     Paramètres (sans "?" au début). Si aucun, une chaine vide
         * @param string fragment  Ancre (sans "#" au début). Si aucun, une chaine vide
        */
        ADDRESS : function(att){
            //OBJECT
            this.ns        = "wfw_uri_address";
            //
            this.addr      = "";
            this.scheme    = "";
            this.authority = "";
            this.path      = "";
            this.query     = "";
            this.fragment  = "";

            /*
                Constructeur
            */
            wfw.URI.ADDRESS.superclass.constructor.call(this, att);
        },

        /**
         * @brief Découpe une adresse web (URI) en sections
         * @remarks Le format est basé sur le standard RFC-2396 (http://tools.ietf.org/html/rfc2396#section-3.1)
         * 
         * @param string uri : l'URI
         * @return wfw.uri.ADDRESS Objet de l'adresse. null si l'URI est invalide
        */
        cut: function (uri) {
            //@fixme: !! FONCTION A METTRE A JOUR RFC-3986 !!
            //caracteres authorisés par le RFC-3986 (http://tools.ietf.org/html/rfc3986)
            var c_sub_delims = "[!$&'()*+,;=]";
            var c_pct_encoded = "%[0-9]{2}";
            var c_unreserved = "[A-Za-z0-9-._~]";
            var c_query = c_unreserved + c_pct_encoded + c_sub_delims + "[:@]*";
            // !! FONCTION A METTRE A JOUR RFC-3986 !!

            //cree l'objet ADDRESS
            var obj = new wfw.URI.ADDRESS( {
                addr: uri, 
                scheme: "", 
                authority: "", 
                path: "", 
                query: "", 
                fragment: ""
            });
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
                wfw.puts("wfw.uri.cut: Invalid URI, domain not found in: " + uri);
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
        },

        /**
         * @deprecated Utilisez la méthode wfw.URI.ADDRESS.makeAddress
         * 
         * @brief Construit une URI avec un objet
         * @param wfw.URI.ADDRESS uri Objet de l'adresse
         * @return string Chaine de l'URI
         * @remark Equivaut à utiliser la méthode 'makeAddress' de l'objet 'wfw.URI.ADDRESS'
        */
        paste: function (uri) {
            return uri.makeAddress();
        },

        /**
         * @brief Construit une URI avec des arguments
         * @param string scheme    Schéma sans "://". Si aucun, une chaine vide
         * @param string authority Nom de domaine ou adresse IP
         * @param string path      Chemin d'accès (sans "/" en début). Si aucun, une chaine vide
         * @param string query     Paramètres (sans "?" au début). Si aucun, une chaine vide
         * @param string fragment  Ancre (sans "#" au début). Si aucun, une chaine vide
         * @return string Chaine de l'URI
         * @remarks Format d'une URI: "scheme.authority://path?query#fragment"
        */
        make: function (scheme, authority, path, query, fragment) {
            var uri = new wfw.URI.ADDRESS({scheme:scheme, authority:authority, path:path, query:query, fragment:fragment});
            return uri.makeAddress();
        },

        /**
         * @brief Convertie une chaine de paramètres 'Query' en tableau associatif
         * @param string querystr La chaine de paramètres
         * @param bool   bDecode  Si true, querystr est décodé avant traitement
         * @return object Tableau associatif des paramètres
         * 
         * @remarks object_to_query utilise wfw.URI.decodeUTF8() pour décoder les caractères
         * 
         * @code{.js}
         * var query = wfw.URI.query_to_object("voiture=alpha&lieu=paris");
         * query.voiture == "alpha";
         * query.lieu    == "paris";
         * @endcode
        */
        query_to_object: function (querystr, bdecode) {
            var query = querystr.split("&");
            //var query = strexplode(querystr,"&",true);
            var queryend = new Object();

            if (!query.length)
                return null;

            for (var i = 0; i < query.length; i++) {
                var tmp = query[i].split("=");
                if (bdecode)
                    queryend[tmp[0]] = this.decodeUTF8(tmp[1]);
                else
                    queryend[tmp[0]] = tmp[1];
            }

            return queryend;
        },

        /**
         * @brief Convertie un tableau associatif en chaine de paramètres 'Query' sans le séparateur '?'
         * @param object querytab   Tableau associatif des paramètres
         * @param bool  bencode    Si true, les paramètres sont encodés
         * @return string La chaine de paramètres
         * 
         * @remarks object_to_query utilise wfw.URI.encodeUTF8() pour encoder les caractères
        */
        object_to_query: function (querytab, bencode) {

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
                if (bencode)
                    querystr += escape(key) + "=" + this.encodeUTF8(value);
                else {
                    //encode au moins les carateres speciaux "=" et "&"
                    value = value.replace(/\&/g, "%26");
                    value = value.replace(/\=/g, "%3D");
                    querystr += key + "=" + value;
                }
            }

            return querystr;
        },

        /**
         * @brief Encode les caractères dans une URI
         * 
         * @param string text La chaine à encoder
         * @return string La chaine encodé au format d'une URI.
         * 
         * @remarks Encode tous les caractères supérieurs à 0x7f et ignore les caractères inferieur à 0x1f (dit, de contrôle)
         * @remarks Encode les caractères supperieur à un octet (0xFF) sur plusieurs fragements ex: 0x4520 = "%45%20"
        */
        encode: function (text) {
            var string = "";
            var i = 0;
            var c;

            while (i < text.length) {

                c = text.charCodeAt(i);

                /*if (c <= 0x1f) {// (control hardware devices characters)
                    //ignore...
                }
                else */if (c > 0xFF) { //+ bytes
                    wfw.puts("wfw.uri.encode: unsuported up to 1 byte caracters encoding");
                //ignore...
                }
                else if (c < 0x30) { //+ bytes
                    string += "%" + wfw.Math.char_to_hex(c);
                }
                else {
                    var reserved = "!*'();:@&=+$,/?%#[]<>";
                    if ((x = reserved.indexOf(text.substr(i, 1))) != -1)
                        string += "%" + wfw.Math.char_to_hex(reserved.charCodeAt(x));
                    else
                        string += String.fromCharCode(c); //sans encodage 
                }
                i++;
            }

            return string;
        },
        
        /**
         * @brief Décode les caractères d'une URI
         * 
         * @param string text La chaine à décoder
         * @return string La chaine décodé.
         * 
         * @remarks Les caractères ASCII sont encodés avec un '%' suivit du nombre hexadécimal sur un octet. ex: "%E9"
        */
        decode: function (text) {
            var string = "";
            var i = 0;
            var c;

            while (i < text.length) {

                c = text.charCodeAt(i);

                switch (c) {
                    case 0x25: //%
                        var i1 = wfw.Math.hex_char_to_int(text.substr(i + 1, 1)); //c1
                        var i2 = wfw.Math.hex_char_to_int(text.substr(i + 2, 1)); //c2
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
        },

        /**
         * @brief Encode les caractères dans une URI (UTF-8)
         * 
         * @param string text La chaine à encoder
         * @return string La chaine encodé au format d'une URI.
         * 
         * @remarks Les caractères inférieur à 0x1F (de contrôle) sont ignorés
         * @remarks Les caractères ASCII sont encodés avec un '%' suivit du nombre hexadécimal sur un octet. ex: "%E9"
         * @remarks Les caractères UTF-8 sont encodés avec un à quatre '%' suivit du nombre hexadécimal sur un octet. ex: "%D0%89"
        */
        encodeUTF8: function (text) {
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
                    string += "%" + wfw.Math.char_to_hex(c);
                }
                else if (c <= 0x7F) {
                    var reserved = "!*'();:@&=+$,/?%#[]<>";
                    if ((x = reserved.indexOf(text.substr(i, 1))) != -1)
                        string += "%" + wfw.Math.char_to_hex(reserved.charCodeAt(x));
                    else
                        string += String.fromCharCode(c); //sans encodage
                }
                //UTF8
                else if (c <= 0xFFFFFFFF) {
                    // 2 bytes
                    if (c >= 0x7F && c < 0x800) {
                        string += "%" + wfw.Math.char_to_hex((c >> 6) | 0xC0);    //110X.XXXXb
                        string += "%" + wfw.Math.char_to_hex((c & 0x3F) | 0x80);  //10XX.XXXXb
                    }
                    // 3 bytes
                    if (c >= 0x800 && c < 0xFFFF) {
                        string += "%" + wfw.Math.char_to_hex((c >> 12) | 0xE0);          //1110.XXXXb
                        string += "%" + wfw.Math.char_to_hex(((c >> 6) & 0x3F) | 0x80);  //10XX.XXXXb
                        string += "%" + wfw.Math.char_to_hex((c & 0x3F) | 0x80);         //10XX.XXXXb
                    }
                    // 4 bytes
                    if (c >= 0xFFFF) {
                        string += "%" + wfw.Math.char_to_hex((c >> 18) | 0xF0);          //1111.0XXXb
                        string += "%" + wfw.Math.char_to_hex((c >> 12) | 0xE0);          //10XX.XXXXb
                        string += "%" + wfw.Math.char_to_hex(((c >> 6) & 0x3F) | 0x80);  //10XX.XXXXb
                        string += "%" + wfw.Math.char_to_hex((c & 0x3F) | 0x80);         //10XX.XXXXb
                    }
                }
                else { //+ bytes
                    wfw.puts("wfw.uri.encodeUTF8: unsuported up to 4 bytes caracters encoding");
                //ignore...
                }
                i++;
            }

            return string;
        },
        
        /**
         * @brief Décode les caractères d'une URI (UTF-8)
         * 
         * @param string text La chaine à décoder
         * @return string La chaine décodé.
         * @remarks Les caractères ASCII sont encodés d'un '%' suivit du nombre hexadécimal sur un octet. ex: "%E9"
         * @remarks Les caractères UTF-8 sont encodés de un à quatre '%' suivit du nombre hexadécimal sur un octet. ex: "%D0%89"
         * 
         * ##UTF8 bits encoding
         *   0 [CCCCxxxx|TTxxxxxx|TTxxxxxx|TTxxxxxx] 32bits
         *   C  = Forment une suite de 1 d'une longueur égale au nombre d'octets utilisés pour coder le caractère (1000,1100,1110 ou 1111)
         *   TT = Les deux premiers bits de poids fort identifie les octets suivants (Egale à 10b )
         *   x  = Constitue les bits de la valeur final une fois contracté
        */
        decodeUTF8: function (text) {
            var string = "";
            var i = 0;
            var c;

            while (i < text.length) {

                c = text.charCodeAt(i);

                switch (c) {
                    case 0x25: //%
                        var byte1 = wfw.Math.hex2_to_int(text.substr(i + 1, 2));
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
                            var byte2 = wfw.Math.hex2_to_int(text.substr(i + 4, 2));
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
                            var byte2 = wfw.Math.hex2_to_int(text.substr(i + 4, 2));
                            var byte3 = wfw.Math.hex2_to_int(text.substr(i + 7, 2));
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
                            var byte2 = wfw.Math.hex2_to_int(text.substr(i + 4, 2));
                            var byte3 = wfw.Math.hex2_to_int(text.substr(i + 7, 2));
                            var byte4 = wfw.Math.hex2_to_int(text.substr(i + 10, 2));
                            if (byte2 >= 0x80 && byte3 >= 0x80 && byte4 >= 0x80)//10b de poid fort?
                            {
                                c = ((byte1 & 0x7) << 18) | ((byte2 & 0x3F) << 12) | ((byte3 & 0x3F) << 6) | (byte4 & 0x3F); //5bits, 6bits, 6bits et 6bits
                                string += String.fromCharCode(c);
                                i += 11;
                            }
                        }
                        //pas trouvé?
                        if (c == 0x25) {
                            wfw.puts(byte1 + " pas trouvé");
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
        },

        /**
         * @brief Obtient l'URI en cours
         * @return string URI de la fenetre en cours
        */
        getCurURI: function () {
            return Y.Node.one("window").get("location.href");
        },


        /**
         * @brief Re-Fabrique une URI
         * @param string uri               URI à transformer. Si null, l'URI en cours est utilisée
         * @param string/object add_fields Champs à insérer 
         * @param string att               Optionnel, si 'ReplaceQuery' est spécifié les champs existants seront remplacés
         * @param string anchor            Optionnel, Ancre à insérer
         * @return string Nouvelle URI. null est retourné si l'URI ou un des paramétres est invalide
         * 
         * @remarks Par défaut, les champs existants sont conservés. Utilisez le paramètre 'att' pour les remplacer.
        */
        ReplaceQuery : 0x1,
        remakeURI: function (uri, add_fields, att, anchor) {
            //
            if (typeof (add_fields) == "number")
                add_fields = add_fields.toString();

            //uri par défaut
            if (typeof (uri) != "string")
                uri = this.getCurURI();

            //decompose l'uri
            var uri_obj;
            if ((uri_obj = this.cut(uri)) == null)
                return null;

            //remplace les champs actuels
            if (att & this.ReplaceQuery) {
                if (typeof (add_fields) == "object")
                    uri_obj.query = this.object_to_query(add_fields, true);
                else if (typeof (add_fields) == "string")
                    uri_obj.query = add_fields;
                else {
                    wfw.puts("wfw.uri.remakeURI(): invalid argument type 'add_fields' = (" + typeof (add_fields) + ")");
                    return null;
                }
            }
            //ajoute aux champs actuels
            else {
                var fields = new Object();
                if (!empty(uri_obj.query)) {
                    fields = this.query_to_object(uri_obj.query, true);
                }
                if (typeof (add_fields) == "string") {
                    add_fields = this.query_to_object(add_fields, true);
                }
                uri_obj.query = this.object_to_query(object_merge(fields, add_fields));
            }
            //ancre
            if (typeof (anchor) == "string")
                uri_obj.fragment = anchor;

            //reforme l'URI
            return this.paste(uri_obj);
        },

        /**
         * @brief Obtient le domaine de l'URI en cours
         * @return string Nom de domaine, si introuvable
        */
        getDomainName: function () {
            var uri = this.cut(this.getCurURI());
            if (uri == null)
                return null;
            return uri.authority;
        },

        /**
         * @brief Obtient l'ancre de l'URI en cours
         * @return string L'Ancre, null si introuvable
        */
        getURIAnchor: function () {
            var uri = this.cut(this.getCurURI());
            if (uri == null)
                return null;
            return uri.fragment;
        },

        /**
         * @brief Obtient les paramètres de l'URI en cours
         * @return object Tableau associatif des champs, null si introuvable
        */
        getURIFields: function () {
            var uri = this.cut(this.getCurURI());
            return ((uri != null && !empty(uri.query)) ? this.query_to_object(uri.query, true) : null);
        },

        /**
         * @brief Obtient un paramètre de l'URI en cours
         * @param string name Nom du champs à retourner 
         * @return string Valeur du champs, null si introuvable
        */
        getURIField: function (name) {
            var fields = this.getURIFields();
            if (fields != null && (typeof (fields[name]) == 'string')) {
                return fields[name];
            }
            return null;
        }
    };

    
    /*-----------------------------------------------------------------------------------------------------------------------
    * ADDRESS Class Implementation
    *-----------------------------------------------------------------------------------------------------------------------*/

    Y.extend(wfw.URI.ADDRESS, wfw.OBJECT);

    /**
    * Fabrique le champ adresse 'addr'
    * */
    wfw.URI.ADDRESS.prototype.makeAddress = function () {
        var addr = "";
        //protocol
        if (!empty(this.scheme))
            addr += this.scheme + '://';
        //domain
        addr += this.authority;
        //chemin
        if (!empty(this.path))
            addr += '/' + this.path;
        //parametres
        if (!empty(this.query))
            addr += '?' + this.query;
        //ancre
        if (!empty(this.fragment))
            addr += '#' + this.fragment;

        return addr;
    };
    
}, '1.0', {
    requires:['base','wfw','wfw-math']
});

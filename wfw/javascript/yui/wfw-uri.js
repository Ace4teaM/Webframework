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
 * @page wfw-uri YUI-3 [URI Module]
 * 
 * Ce module permet de gérer facilement les adresses relative au web
 * Les méthodes sont disponible via la classe @link URI
 */
YUI.add('wfw-uri', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class URI
     * @memberof wfw
     * 
     * @brief Fonctions relatives aux adresses web (URI)
     * */
    wfw.URI = {
        /**
         * @class ADDRESS
         * @memberof URI
         * @implements OBJECT
         * 
         * @brief Adresse (URI)
         * 
         * ## Constructeur
         * @param att Attributs de l'objet
         * 
         * ## Exemple
         * 
         * @code{.js}
         * var obj = new wfw.URI.ADDRESS({
         *  scheme    : 'http',
         *  authority : 'www.aceteam.org',
         *  path      : 'index.html',
         *  query     : { foo:'bar' },
         *  fragment  : 'anchor_name'
         * });
         * @endcode
        */
        ADDRESS : function(att){
            //OBJECT
            this.ns        = "wfw_uri_address";

            /** 
             * @var string addr
             * @memberof ADDRESS
             * @brief Adresse complète de l'URI
             * */
            this.addr      = "";
            /** 
             * @var string scheme
             * @memberof ADDRESS
             * @brief Protocole (ex: 'http'). Si aucun, une chaine vide.
             * */
            this.scheme    = "";
            /** 
             * @var string authority
             * @memberof ADDRESS
             * @brief Nom de domaine ou adresse IP
             * */
            this.authority = "";
            /** 
             * @var string path
             * @memberof ADDRESS
             * @brief Chemin d'accès (sans "/" au début). Si aucun, une chaine vide
             * */
            this.path      = "";
            /** 
             * @var object query
             * @memberof ADDRESS
             * @brief Tableau associatif des paramètres. Si aucun, un objet vide
             * */
            this.query     = {};
            /** 
             * @var string fragment
             * @memberof ADDRESS
             * @brief Ancre (sans "#" au début). Si aucun, une chaine vide
             * */
            this.fragment  = "";

            /*
                Constructeur
            */
            wfw.URI.ADDRESS.superclass.constructor.call(this, att);
        },

        /**
         * @fn ADDRESS cut(string uri)
         * @memberof URI
         * 
         * @brief Découpe une adresse web (URI) en sections
         * @remarks Le format est basé sur le standard RFC-2396 (http://tools.ietf.org/html/rfc2396#section-3.1)
         * 
         * @param uri Adresse à analyser
         * @return Objet de l'adresse. null si l'URI est invalide
        */
        cut: function (uri) {
            var params = uri_cut(uri);
            if(!params)
                return null;
            return params;
        },

        /**
         * @fn string paste(ADDRESS uri)
         * @memberof URI
         * 
         * @deprecated Utilisez la méthode wfw.URI.ADDRESS.makeAddress
         * 
         * @brief Construit une URI avec un objet
         * @param  uri Objet de l'adresse
         * @return  Chaine de l'URI
         * @remark Equivaut à utiliser la méthode 'makeAddress' de l'objet 'wfw.URI.ADDRESS'
        */
        paste: function (uri) {
            return uri.makeAddress();
        },

        /**
         * @fn string make(string scheme, string authority, string path, object query, string fragment)
         * @memberof URI
         * 
         * @brief Construit une URI avec des arguments
         * @param scheme    Schéma sans "://". Si aucun, une chaine vide
         * @param authority Nom de domaine ou adresse IP
         * @param path      Chemin d'accès (sans "/" en début). Si aucun, une chaine vide
         * @param query     Paramètres (sans "?" au début). Si aucun, une chaine vide
         * @param fragment  Ancre (sans "#" au début). Si aucun, une chaine vide
         * @return Chaine de l'URI
         * @remarks Format d'une URI: "scheme.authority://path?query#fragment"
        */
        make: function (scheme, authority, path, query, fragment) {
            var uri = new wfw.URI.ADDRESS({scheme:scheme, authority:authority, path:path, query:query, fragment:fragment});
            return uri.makeAddress();
        },

        /**
         * @fn object queryToObject(string queryStr, bool bDecode)
         * @memberof URI
         * 
         * @brief Convertie une chaine de paramètres 'Query' en tableau associatif
         * @param string querystr La chaine de paramètres
         * @param bDecode  Si true, \c querystr est décodé avant traitement
         * @return Tableau associatif des paramètres
         * 
         * @remarks queryToObject utilise uri_decode_UTF8() pour décoder les caractères
         * 
         * @code{.js}
         * var query = wfw.URI.queryToObject("voiture=alpha&lieu=paris");
         * query.voiture == "alpha";
         * query.lieu    == "paris";
         * @endcode
        */
        queryToObject: function (queryStr, bDecode) {
            return uri_query_to_object(queryStr,(bDecode ? this.decodeUTF8 : null));
        },
        
        /**
         * @fn object query_to_object(string queryStr, bool bDecode)
         * @memberof URI
         * 
         * @deprecated Utilisez la méthode queryToObject
         */
        query_to_object: function (querystr, bdecode) {
            return this.queryToObject(querystr, bdecode);
        },

        /**
         * @fn string objectToQuery(object queryTab, bool bEncode)
         * @memberof URI
         * 
         * @brief Convertie un tableau associatif en chaine de paramètres 'Query' sans le séparateur '?'
         * @param object querytab  Tableau associatif des paramètres
         * @param bool  bencode    Si true, les paramètres sont encodés
         * @return string La chaine de paramètres
         * 
         * @remarks object_to_query utilise wfw.URI.encodeUTF8() pour encoder les caractères
        */
        objectToQuery: function (queryTab, bEncode) {
            return uri_object_to_query(queryTab, (bEncode ? this.encodeUTF8 : null));
        },
        
        /**
         * @fn string object_to_query(object queryTab, bool bEncode)
         * @memberof URI
         * 
         * @deprecated Utilisez la méthode objectToQuery
         */
        object_to_query: function (querytab, bencode) {
            return this.objectToQuery(querytab, bencode);
        },

        /*
         * Decodage/Encodage par defaut
         * */
        decodeFunc: uri_decodeUTF8,
        encodeFunc: uri_encodeUTF8,
        
        /** @copydoc uri_encodeUTF8 */
        decodeUTF8: uri_decodeUTF8,
        /** @copydoc uri_encodeUTF8 */
        encodeUTF8: uri_encodeUTF8,
        
        /** @copydoc uri_decode */
        decode: uri_decode,
        /** @copydoc uri_encode */
        encode: uri_encode,
        
        /**
         * @fn string getCurURI()
         * @memberof URI
         * 
         * @brief Obtient l'URI en cours
         * @return string URI de la fenetre en cours
        */
        getCurURI: function () {
            return Y.Node.one("window").get("location.href");
        },

        /**
         * @fn ADDRESS toObject(string uri, bool bDecode)
         * @memberof URI
         * 
         * @brief Convertie une URI en objet
         * @return Objet 
        */
        toObject: function (uri,bDecode) {
            var params = uri_cut(uri);
            var obj = new wfw.URI.ADDRESS( params );
            obj.setQueryString( params.query, bDecode );
            return obj;
        },

        /**
         * @fn string remakeURI(string uri, string/object add_fields, int att, string anchor)
         * @memberof URI
         * 
         * @brief Re-Fabrique une URI
         * @param uri               URI à transformer. Si null, l'URI en cours est utilisée
         * @param add_fields Champs à insérer 
         * @param att               Optionnel, si 'ReplaceQuery' est spécifié les champs existants seront remplacés
         * @param anchor            Optionnel, Ancre à insérer
         * @return Nouvelle URI. null est retourné si l'URI ou un des paramétres est invalide
         * 
         * @remarks Par défaut, les champs existants sont conservés. Utilisez le paramètre 'att' pour les remplacer.
        */
        ReplaceQuery : 0x1,
        remakeURI: function (uri, add_fields, att, anchor) {
            
            //uri par défaut
            if (typeof (uri) != "string")
                uri = this.getCurURI();
            
            //
            if (typeof (add_fields) == "number")
                add_fields = add_fields.toString();
            //
            if (typeof (add_fields) == "string")
                add_fields = this.queryToObject(add_fields, true);

            //decompose l'uri
            var uri_obj;
            if ((uri_obj = this.toObject(uri,true)) == null)
                return null;
    
            //remplace les champs actuels
            if (att & this.ReplaceQuery) {
                uri_obj.query = add_fields;
            }
            //ajoute aux champs actuels
            else {
                object_merge(uri_obj.query,add_fields,false);
            }
            //ancre
            if (typeof (anchor) == "string")
                uri_obj.fragment = anchor;

            //reforme l'URI
            return uri_obj.makeAddress();
            
            //refabrique
            return uri_remake(uri_obj, add_fields, (att & this.ReplaceQuery) ? true : false, anchor);

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
         * @fn string getDomainName()
         * @memberof URI
         * 
         * @brief Obtient le domaine de l'URI en cours
         * @return Nom de domaine, null si introuvable
        */
        getDomainName: function () {
            var uri = this.cut(this.getCurURI());
            if (uri == null)
                return null;
            return uri.authority;
        },

        /**
         * @fn string getURIAnchor()
         * @memberof URI
         * 
         * @brief Obtient l'ancre de l'URI en cours
         * @return L'Ancre, null si introuvable
        */
        getURIAnchor: function () {
            var uri = this.cut(this.getCurURI());
            if (uri == null)
                return null;
            return uri.fragment;
        },

        /**
         * @fn object getURIFields()
         * @memberof URI
         * 
         * @brief Obtient les paramètres de l'URI en cours
         * @return Tableau associatif des champs, null si introuvable
        */
        getURIFields: function () {
            var uri = this.cut(this.getCurURI());
            return ((uri != null && !empty(uri.query)) ? this.query_to_object(uri.query, true) : null);
        },

        /**
         * @fn string getURIField(string name)
         * @memberof URI
         * 
         * @brief Obtient un paramètre de l'URI en cours
         * @param name Nom du champs à retourner 
         * @return Valeur du champs, null si introuvable
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
    * @fn string makeAddress()
    * @memberof ADDRESS
    * 
    * @brief Fabrique la chaine de l'adresse
    * @return Chaine représentant l'adresse
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
        if (this.query)
            addr += '?' + wfw.URI.objectToQuery(this.query, true);
        //ancre
        if (!empty(this.fragment))
            addr += '#' + this.fragment;

        return addr;
    };
    
            
    /**
    * @fn string setQueryString(string query, bool bDecode)
    * @memberof ADDRESS
    * 
    * @brief Définit les paramétres de l'uri
    * @param query    Chaine des paramètres
    * @param bDecode  Si true, \c query est décodé avant traitement
    * @return Chaine représentant l'adresse
    * */
    wfw.URI.ADDRESS.prototype.setQueryString = function (query,bDecode) {
         this.query = wfw.URI.queryToObject(query, bDecode);
    }
}, '1.0', {
    requires:['base','wfw','wfw-math']
});

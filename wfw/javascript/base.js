/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2012, 2013 Thomas AUGUEY <contact@aceteam.org>
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
 * @file base.js
 *
 * @defgroup Basique
 * @brief Fonctions de bases
 * @{
 */


/**--------------------------------------------------------------------------------------------------------------------------------------
 * Divers
 * @defgroup Divers
 * @brief Fonctions non catégorisées
 * @{
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * @brief Retourne une valeur tronqué (rotative)
 * @param val [numeric] Valeur
 * @param max [numeric] Valeur maximum
 * @return [string] L'Identifiant
 * @remark Si la valeur 'val' depasse le seuil maximale, le restant de la valeur est ramené a zéro
*/
function rotval(val, max) {
    return (val % max);
}

/**
 * @brief [int] Compteur global utilisé par la fonction uniqid (Ne pas modifier explicitement)
 */
var _uniqid_cnt = 0;

/**
*    @brief Génére un identifiant unique
*    @return [string] Identifiant unique
*/
function uniqid()
{
    _uniqid_cnt++;
    var newDate = new Date;
    return "uid_"+parseInt(Math.random()*456)+"_"+newDate.getTime()+"_"+_uniqid_cnt;//doit commencer par une lettre pour etre un identificateur valide
}

/**
    @brief Vérifie si une classe existe
    @param class_name [string] Nom de la classe de base
    @remarks Pour être reconnue comme une classe, l'objet "class_name" doit être de type fonction
    @return true si la classe existe sinon false
*/
function class_exists(class_name)
{
    //test l'existance de l'objet
    if(typeof(window[class_name])!="function")
        return false;
    return true;
}

/**
    @brief Vérifie si la méthode d'une classe existe
    @param class_name [string] Nom de la classe de base
    @param method     [string] Nom de la méthode
    @return true si la classe existe sinon false
    @remarks Pour être reconnue comme une classe, l'objet "class_name" doit être de type fonction
*/
function method_exists(object_name,method)
{
    //test l'existance de l'objet
    if(typeof(window[object_name])!="object")
        return false;
    //test l'existance de la methode
    return ((typeof(window[object_name][method])=="function") ? true : false); 
}

/**
    @brief Vérifie si un objet possède une méthode
    @param object [object] L'objet de classe
    @param method [string] Nom de la méthode
    @return [bool] true si la classe existe sinon false
    @remarks Pour être reconnue comme une classe, l'objet doit être une instance de "Object"
*/
function have_method(object, method) {
    //test l'existance de l'objet
    if (!(object instanceof Object))
        return false;
    //test l'existance de la methode
    return ((typeof (object[method]) == "function") ? true : false);
}
/** @} */ // end of group Divers

/**--------------------------------------------------------------------------------------------------------------------------------------
 * Object Section
 * @defgroup Object
 * @brief Fonctions utilisables avec les objets natifs
 * @{
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
    @brief Duplique une instance de variable
    @param a [mixed] La variable à dupliquer
    @return [mixed] Nouvelle instance de la variable
    @remarks Effectue une copie de chacun des éléments d'un objet ou d'un tableau puis retourne une nouvelle instance
*/
function copy(a){
    var new_var;
    switch(typeof(a)){
        case 'object':
            if (!a) {
                new_var = a;
            }
            else if(a instanceof Array){
                new_var = [];
                for(var key=0; key<a.length; key++)
                    new_var[key] = copy(a[key]);
            }
            else {
                new_var = {};
                for (var key in a)
                    new_var[key] = copy(a[key]);
            }
            break;
        default:
//        case 'string':
//        case 'number':
//        case 'function':
            new_var = a;
            break;
    }
    return new_var;
}

/**
    @brief Retourne le nombre de membres enfant d'un objet
    @param obj [object] L'Objet
    @return [int] Nombre de membres enfant de l'objet 'obj'
*/
function length(obj){
    var i=0;
    for(var element in obj)
        i++;
    return i;
}

/**
    @brief Remonte l'élément d'un objet en première position
    @param obj [object] L'Objet
    @param key [string] Clef du membre à repositionner
    @return [object] Nouvel objet
    @remarks L'Instance de 'obj' n'est pas modifié
*/
function keyfirst(obj,key)
{
    var newObj=new Object();
    //commence par la cles voulue
    for(var cur_key in obj)
    {
        if(cur_key==key)
            newObj[cur_key]=obj[cur_key];
    }
    //recopie toutes les cles sauf la cles recherché
    for(var cur_key in obj)
    {
        if(cur_key!=key)
            newObj[cur_key]=obj[cur_key];
    }
    return newObj;
}

/**
    @brief Descend l'élément d'un objet en dernière position
    @param obj [object] L'Objet
    @param key [string] Clef du membre à repositionner
    @return [object] Nouvel objet
    @remarks L'Instance de 'obj' n'est pas modifié
*/
function keylast(obj,key)
{
    var newObj=new Object();
    //recopie toutes les cles sauf la cles recherché
    for(var cur_key in obj)
    {
        if(cur_key!=key)
            newObj[cur_key]=obj[cur_key];
    }
    //termine par la cles voulue
    for(var cur_key in obj)
    {
        if(cur_key==key)
            newObj[cur_key]=obj[cur_key];
    }
    return newObj;
}

/**
    @brief Retourne la clé trouvée en position 'i'
    @param obj [object] L'Objet
    @param i   [int] Index de la clé
    @return [string] Clé trouvé
    @retval null Aucune clé pour cette index
*/
function object_key(obj, i) {
    var x = 0;
    for (var key in obj)
        if (i == x++)
            return key;
    return null;
}
/** @} */ // end of group Object

/**--------------------------------------------------------------------------------------------------------------------------------------
    * String object Section
    * @defgroup String
    * @brief Fonctions utiles aux chaines
    * @{
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
    @brief Transforme un nombre d'octet en taille avec suffix
    @param bytes_count [number] Nombre d'octets
    @return [string] Taille avec suffix
*/
function byteToSize(bytes_count)
{
    var suffix=["octets","Ko","Mo","Go","To","Po","Zo","Yo"];
    var i=0;
    while(bytes_count>=1024 && i<suffix.length)
    {
        bytes_count/=1024;
        i++;
    }
    if(!i)
        return bytes_count+" "+suffix[i];
    return bytes_count.toFixed(1)+" "+suffix[i];
}

/**
    @brief Transforme une taille en nombre d'octets
    @param size [string] Taille
    @return [number] Nombre d'octet. Si null, 'size' est mal formé
    @remarks Les suffix suivants sont acceptés:
        "octets", "ko", "mo", "go", "to", "po", "zo", "yo"
        "octet", "kio", "mio", "gio", "tio", "pio", "zio", "yio"
        "o", "k", "m", "g", "t", "p", "z", "y"
*/
function sizeToByte(size) {
    var suffix_typesA = ["octets", "ko", "mo", "go", "to", "po", "zo", "yo"];
    var suffix_typesB = ["octet", "kio", "mio", "gio", "tio", "pio", "zio", "yio"];
    var suffix_typesC = ["o", "k", "m", "g", "t", "p", "z", "y"];
    //obtient la valeur et le suffix
    size += " "; //assure a size.substr de trouver la fin du nombre
    var value = size.substr(0, size.search(/[^0-9.,]/));
    if (!value.length)
        return null;
    var suffix = trim(size.substr(value.length));
    if (empty(suffix))
        return parseInt(value);//octets
    //parse la valeur
    value=value.replace(",", "."); // parseFloat ne prend pas les virgules
    if (isNaN(value = parseFloat(value)))
        return null;
    //calcule la taille en bytes
    var i = 0;
    suffix = suffix.toLowerCase();
    while ((suffix != suffix_typesA[i]) && (suffix != suffix_typesB[i]) && (suffix != suffix_typesC[i])) {
        if (i >= suffix_typesA.length) {
            if (typeof (wfw) == "object")
                wfw.puts("sizeTobyte: unknown suffix " + suffix);
            return null;
        }
        value *= 1024;
        i++;
    }
    return parseInt(value);
}

/**
    @brief Retourne l'extension d'un fichier
    @param path [string] Chemin d'accès ou nom de fichier
    @return [string] Extension du fichier, vide si aucune
*/
function fileext(path){
    var file_name = filename(path);
    var startIndex = file_name.lastIndexOf('.');
    if (startIndex >= 0) {
        return file_name.substring(startIndex+1);
    }
    return "";
}

/**
 * @brief Assemble un chemin d'accès
 * @param base Chemin de base
 * @param ... Autres fragments de chemins
 * @return string Chemin complet
 * @remarks Le premier caractère de séparation est utilisé pour uniformiser la chaine (ex: '/srv/file\path' = '/srv/file/path'). Si aucun séparateur n'est trouvé, la constante 'SYSTEM_FILE_SEPARATOR' est utilisée.
 * 
 * @par Exemple
 * Dans cet exemple, la fonction path contruit un chemin à partir des éléments "/srv", "www" et "index.html".
   @code{.php}
    var filename = path('/srv', 'www', 'index.html');
    // return '/srv/www/index.html'
   @endcode
 */
function path(base)
{
    //detecte le separateur de nom de fichier
    var separator = base.substr(0,1);
    switch(separator){
        case '/':
        case '\\':
            break;
        default:
            separator='/';
            break;
    }
    
    //trim
    var ret = trim(base);
    
    //uniformise les slashs
    ret = ret.replace(/\\\//g,separator);
    
    //ajoute les fragments de chemins
    for(var i=1;i<arguments.length;i++)
    {
        var arg = trim(arguments[i]);

        //uniformise les slashs
        arg = arg.replace(/\\\//g,separator);
        //supprime le slash de fin
        if(ret.substr(ret.length-1,1) == separator)
            ret = ret.substr(0,ret.length-1);
        //supprime le slash de debut
        if(arg.substr(0,1) == separator)
            arg = arg.substr(1);
        
        //colle le chemin
        ret += separator+arg;
    }
    
    return ret;
}

/**
    @brief Change l'extension d'un fichier
    @param path [string] Chemin d'accès ou nom de fichier
    @param ext [string] Nouvelle extension
    @return[string] Nouveau chemin d'accès ou nom de fichier
*/
function set_fileext(path, ext) {
    var startIndex = path.lastIndexOf('.');
    if (startIndex >= 0) {
        return path.substring(0, startIndex + 1) + ext;
    }
    return path + "." + ext;
}

/**
    @brief Retourne le nom d'un fichier ou du dernier dossier dans un chemin d'accès
    @param path [string] Chemin d'accès
    @return [string] Nom du fichier ou du dernier dossier
*/
function filename(path){
    var startIndex = path.lastIndexOf('/');
    if(startIndex>=0){
        return path.substring(startIndex+1);
    }
    startIndex = path.lastIndexOf('\\');
    if(startIndex>=0){
        return path.substring(startIndex+1);
    }
    return path;
}

/**
    @brief Retourne le nom d'un fichier ou du dernier dossier dans un chemin d'accès
    @param path [string] Chemin d'accès
    @return [string] Nom du fichier ou du dernier dossier
*/
function basename(path){
    return filename(path);
}

/**
    @brief Retourne le chemin d'accès à un fichier
    @param path [string] Chemin d'accès complet
    @return [string] Chemin d'accès du fichier (avec le slash de fin)
*/
function dirname(path){
    var startIndex = path.lastIndexOf('/');
    if(startIndex){
        return path.substring(0,startIndex+1);
    }
    startIndex = path.lastIndexOf('\\');
    if(startIndex){
        return path.substring(0,startIndex+1);
    }
    return "";
}

/**
    @brief Test si la chaine 1 'str' est composée uniquement des caractères de la chaine 2 'chr'
    @param str [string] Chaine de caractères 1
    @param chr [string] Chaine de caractères 2
    @return [bool] true, si 'str' est formé uniquement avec les caractères de 'chr', sinon false
*/
function is_strof(str,chr){
	for(var i=0;i<str.length;i++){
		var ok=0;
		for(var x=0;x<chr.length;x++){
			if(chr.charCodeAt(x)==str.charCodeAt(i)){
				ok=1;//ok ce caractere est permis
				x=chr.length;//continue
			}
		}
        //caractere non permis?
		if(!ok){
			return false;
        }
	}
	return true;
}


/**
    @brief Test si la chaine 1 'str' n'est pas composé de 1 ou plusieurs caractères de la chaine 2
    @param str [string] Chaine de caractères 1
    @param chr [string] Chaine de caractères 2
    @return [bool] true, si 'str' n'est pas formé avec les caractères de 'chr', sinon false
*/
function is_not_strof(str,chr){
	for(var i=0;i<str.length;i++){
		var ok=1;
		for(var x=0;x<chr.length;x++){
			if(chr.charCodeAt(x)==str.charCodeAt(i)){
				ok=0;
				x=chr.length;//continue
			}
		}
        //caractere non permis?
		if(!ok)
			return false;
	}
	return true;
}


/**
    @brief Supprime les espaces en début et en fin de chaine
    @param str [string] Chaine
    @return [string] Nouvelle chaine
*/
function trim(str){
    return str.replace(/^\s+|\s+$/g, '');
}

/**
    @brief Supprime les espaces en début de chaine
    @param str [string] Chaine
    @return [string] Nouvelle chaine
*/
function ltrim(str){
    return str.replace(/^\s+/g, '');
}

/**
    @brief Supprime les espaces en fin de chaine
    @param str [string] Chaine
    @return [string] Nouvelle chaine
*/
function rtrim(str){
    return str.replace(/\s+$/g, '');
}

/**
    @brief Compare le début d'une chaine
    @param str  [string] Chaine à tester
    @param find [string] Chaine à rechercher
    @return [int] 0 Si 'find' est contenu en début de chaine 'str', sinon 1
*/
function lstrcmp(text,find){
    if(text.substr(0,find.length) == find)
        return 0;
    return 1;
}

/**
    @brief Vérifie si une chaine est vide
    @param str [string] Chaine à analyser
    @return bool true Si l'objet est vide, sinon false
*/
function empty_string(str){
    if(trim(str)=='')
        return true;
    return false;
}

/**
    @brief Vérifie si la variable est vide
    @param obj [object] Objet à tester
    @return [bool] true Si l'objet est vide, sinon false
    @retval true si la variable n'est pas un objet ou chaine. Si la variable est objet ne contienant pas d'éléments. Si la variable est une chaine vide
*/
function empty(obj){
    //text
    if(typeof(obj)=='string')
        return empty_string(obj);
    //objet
    if(typeof(obj)=='object')
    {
        //object
        var i=0;
        for(var element in obj){
            //array (possible confusion avec un objet !)
            if(element == 'length')
            {
                return (obj.length==0)?true:false;
            }

            i++;
        }
        return (i==0)?true:false;
    }
    return true;
}

/**
	@brief Explose une chaine en tableau
    @param text      [string] Chaine des mots (séparés par des espaces)
	@param options   [string] Chaine des options (séparés par des espaces)
    @return [array] Tableau des éléments de la chaine
	@remarks Les éléments vides sont ignorés
*/
function strToFlags(text,options){
    var text_list = strexplode(text," ",true);
    var opt_list = strexplode(options," ",true);
    //supprime les elements vides
    var opt = {};
    for(var x=0;x<opt_list.length;x++)
    {
        var opt_name = opt_list[x];
        opt[opt_name]=0;
        var i=0;
        while(i<text_list.length)
        {
            if(opt_name == text_list[i])
            {
                opt[opt_name]=1;
                i=text_list.length;
                continue;
            }
            i++;
        }
    }
    return opt;
}

/**
	@brief Explose une chaine en tableau
    @param text      [string] Chaine 
	@param separator [string] Chaine de séparation
	@param bTrim     [bool]   Si true, les espaces blanc sont supprimés en début est fin de chaine
    @return [array] Tableau des éléments de la chaine
	@remarks Les éléments vides sont ignorés
*/
function strexplode(text,separator,bTrim){
    var list = text.split(separator);
    //supprime les elements vides
    var new_list = new Array();
    for(var element in list)
    {
        if(bTrim)
            list[element] = trim(list[element]);
        if(!empty(list[element]))
            new_list.push(list[element]);
    }
    return new_list;
}

/**
	@brief Implose un tableau en une chaine de caractères
	@param array     [array]  Tableau 
	@param separator [string] Chaine de séparation
	@param bTrim     [bool]   Si true, les espaces blanc sont supprimés en début est fin de chaine
    @return [string] Chaine implosé
	@remarks Les éléments vides sont ignorés
*/
function strimplode(array,separator,bTrim)
{
    //supprime les elements vides
    var list = "";
    for(var key in array)
    {
        var value = array[key];
        if(bTrim)
            value = trim(value);
        if(!empty(value))
            list += value+separator;
    }
    return list;
}

/**
*    @brief Convertie un objet natif Javascript en chaine de caractères
*    @param obj [object] Objet à convertir en texte
*    @param depth [bool] Si true, scan les objets recursivement
*    @return Texte de l'objet
*/
function tostr(obj, depth) {
    if (typeof (depth) == "undefined")
        depth = true;
    var text = "";
    //convertie en texte
    try{
        switch (typeof (obj)) {
            case 'string':
                text = obj;
                break;
            case 'number':
                text = obj.toString(); //convert to string
                break;
            case 'function':
                text = ">"+obj;
                break;
            case 'object':
                for (var obj_member in obj)
                    text += 'object [' + obj_member + ':' + (!depth ? "" + obj[obj_member] : tostr(obj[obj_member])) + "],\n";
                text += "\n";
                break;
            case 'array':
                if (!depth)
                    text += "" + obj;
                else
                    for (var i = 0; i < obj.length; i++)
                        text += '[' + i + ':' + (!depth ? "" + obj[i] : tostr(obj[i])) + "],\n";
                text += "\n";
                break;
        }
    }
    catch(e){
        text = "<unredable object> "+e;
    }
    return text;
}

/**
*    @brief Convertie un objet natif Javascript en chaine HTML
*    @param obj [object] Objet à convertir en texte
*    @param depth [bool] Si true, scan les objets recursivement
*    @return Texte de l'objet
*/
function tohtml(obj, depth) {
    if (typeof (depth) == "undefined")
        depth = true;
    var text = "";
    text += "<ul>";
    //convertie en texte
    try{
        switch (typeof (obj)) {
            case 'string':
                text = "<li>"+obj+"</li>";
                break;
            case 'number':
                text = "<li>"+obj.toString()+"</li>"; //convert to string
                break;
            case 'function':
                text = "<li>"+obj+"</li>";
                break;
            case 'object':
                text += "<ul>";
                for (var obj_member in obj)
                    text += '<li><label style="min-width:80px;">' + obj_member + '</label>' + (!depth ? "" + obj[obj_member] : tostr(obj[obj_member])) + "</li>";
                text += "</ul>";
                break;
            case 'array':
                text += "<ul>";
                if (!depth)
                    text += "" + obj;
                else
                    for (var i = 0; i < obj.length; i++)
                        text += '<li><label style="min-width:80px;">' + i + '</label>' + (!depth ? "" + obj[i] : tostr(obj[i])) + "</li>";
                text += "</ul>";
                break;
        }
    }
    catch(e){
        text = "<li>unredable object "+e+"</li>";
    }
    text += "</ul>";
    
    return text;
}

/**
*    @brief transforme une chaine de caractères de format "name1:value1;name2:value2;..." en tableau associatif
*    @param text [string] Chaine à convertir
*    @return [array] Tableau associatif des éléments
*/
function parseHTTPHeader(text){
    var rslt = new Array()
    var response = text.split(';');
    for(var i=0;i<response.length;i++){
        var element = response[i].split(':');
        rslt[(element[0].toString())]=element[1];
    }
    return rslt;
}

/**
	@brief Retourne la taille d'une chaine
    @param text [string] Chaine 
    @return [int] Nombre de caractères dans la chaine
	@remarks Equivaut à 'text.length'
*/
function strlen(text){
    return text.length;
}

/**
	@brief Convertie une chaine en identificateur (voir cInputIdentifier)
    @param str [string] Chaine à convertir
    @return [string] Chaine convertie
*/
function strtoid(str)
{
    str = trim(str);
    //remplace les caracteres speciaux
    str = str.replace(/[-,;:.]+/g, '_');
    //remplace les espaces
    str = str.replace(/\s+/g, '_');
    //remplace les accents
    str = str.replace(/[éèêë]+/gi, 'e');
    str = str.replace(/[àâä]+/gi, 'a');
    //supprime les caracteres speciaux restants
    str = str.replace(/[^A-Za-z0-9_]+/g, '');
    //ne commence pas par un nombre
    if(str.substr(0,1)>="0" && str.substr(0,1)<="9")
        str="_"+str;
    return str;
}

/**
    @brief Convertie une chaine en nom (voir cInputName)
    @param str [string] Chaine à convertir
    @return [string] Chaine convertie
*/
function strtoname(str)
{
    str = trim(str);
    //remplace les espaces
    str = str.replace(/\s+/g, '_');
    //remplace les accents
    str = str.replace(/[éèêë]+/gi, 'e');
    str = str.replace(/[àâä]+/gi, 'a');
    //supprime les caracteres speciaux restants
    str = str.replace(/[^a-zA-Z0-9_\-\.]+/g, '');
    return str;
}

/**
    @brief Tronque le contenu d'un texte
    @param text      [string] Text de base
    @param maxchar   [int] Maximum de caractères dans le texte
    @param maxline   [int] Maximum de lignes dans le texte
    @param endstr    [string] Optionnel, Chaine à ajouter en fin de texte (si tronqué). Par défaut " [...]"
    @return [string] Le texte tronqué
*/
function trimtext(text, maxchar, maxline, endstr) {
    if (typeof (endstr) == "undefined")
        endstr = " [...]";
    var idx = 0;
    while (idx < maxchar && maxline--) {
        var idx2 = text.indexOf("\n", idx);
        if (idx2 < 0)
            return text.substr(0, maxchar) + ((maxchar < text.length) ? endstr : "");
        idx = idx2 + 1;
    }
    return text.substr(0, idx) + ((idx < text.length) ? endstr : "");
}

/**
    @brief Compte le nombre de caractères dans une chaine
    @param text      [string] Chaine 
    @param charlist  [string] Caractères à rechercher
    @return [int] Nombre de caractères trouvés
*/
function strCharCount(text, charlist) {
    var count = 0;
    for (var i = 0; i < charlist.length; i++) {
        var c = charlist[i];
        count += text.split(c).length;
    }
    return count;
} 
/** @} */ // end of group String

/**--------------------------------------------------------------------------------------------------------------------------------------
    * Array/Object object Section
    * @defgroup Array
    * @brief Fonctions utilisables avec les tableaux natifs
    * @{
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
    @brief Recherche la plus grande valeur d'un tableau numerique
    @param ar  [array] Le tableau
    @return Index de la valeur la plus grande
*/
function array_max(ar) {
    var max = parseFloat(ar[0]);
    var key = 0;
    var len = ar.length;
        console.log(max);
    while (--len) {
        if (parseFloat(ar[len]) > max) {
            max = ar[len];
            key = len;
        }
    }
    return key;
}

/**
    @brief Supprime un clé d'un tableau
    @param ar   [array] Le tableau
    @param key  [int] La clé
    @return [mixed] Copie de l'item supprimé
*/
function remove_key(ar,key){
    if(typeof(ar[key]))
    {
       var item = ar[key];
       delete ar[key];
       //decale le reste des items
       for(var i=key; i<ar.length-1; i++){
        ar[i]=ar[i+1];
       }
       ar.length--;
       return item;
    }
    return null;
}

/**
    @brief Insert une nouvelle clé à un tableau
    @param ar   [array] Le tableau
    @param key  [int]   La clé
    @param val  [mixed] La valeur
    @return [mixed] Nouveau tableau
*/
function insert_key(ar,key,val){
    var new_ar=[];
    for(var i=0;i<ar.length;i++)
    {
        if(i==key)
            new_ar.push(val);
        new_ar.push(ar[i]);
    }
    return new_ar;
}

/**
    @brief Supprime des clés d'un objet
    @param obj        [object] Objet de base
    @param key_array  [array]  Tableau des clés à soustraire
    @return [object] Nouvelle instance de l'objet 
*/
function object_pop(obj,key_array) {
    var new_ar = copy(obj);
    for (var i = 0; i < key_array.length; i++) {
        var key = key_array[i];
        if (typeof (new_ar[key]) != "undefined")
            delete (new_ar[key]);
    }
    return new_ar;
}

/**
    @brief Associe deux objets dans une nouvelle instance
    @param obj1   [object] Le première objet
    @param obj2   [object] Le deuxième objet
    @param bcopy  [bool]   Si true, crée une copie de l'objet sinon 'obj1' reçoit les données de 'obj2'
    @remarks Si obj1 et/ou obj2 n'est pas de type 'object', le type est forcé.
    @remarks Si deux champs porte la même clé, la valeur de 'ar2' écrase la valeur de 'ar1'
    @return [Object] Le nouvel objet
*/
function object_merge(obj1, obj2, bcopy) {
    if (typeof (bcopy) == "undefined")
        bcopy = true;
    //force le type objet sur les membres non -initialisés
    if (typeof (obj1) != "object" || obj1 == null)
        obj1 = {};
    if (typeof (obj2) != "object" || obj2 == null)
        obj2 = {};
    //duplique objet 1 ?
    var new_ar = (bcopy) ? copy(obj1) : obj1;
    //copie objet 2 dans objet 1
    for (var key in obj2) {
        new_ar[key] = obj2[key];
    }
    return new_ar;
}

/**
    @brief Associe deux tableaux
    @param ar1   [array] Le première objet
    @param ar2   [array] Le deuxième objet
    @param bcopy [bool]  Si true une nouvelle instance est créé, sinon ar1 reçois les champs de 'ar2'
    @remarks Tous les champs de 'ar2' sont ajoutés à 'ar1'
    @return [array] Le nouveau tableau
*/
function array_merge(ar1,ar2,bcopy){
    if(bcopy)
        ar1 = copy(ar1);
    for(var key in ar2)
        ar1.push(ar2[key]);
    return ar1;
}

/**
    @brief Recherche un champs dans un tableau
    @param array  [array/object]  Tableau de la recherche
    @param func   [function]      Callback(value,key,index), voir remarques
    @remarks array_find() enumére toutes les clés/valeurs du tableau 'array'.
    @remarks Tant que le callback 'func' ne retourne rien, la recherche continue.
    @remarks Si au contraire, un retour est detecté, la recherche s'interrompt et la valeur est retournée.
    @return [mixed] Valeur retourné par le callback, 'undefined' si la recherche n'a rien donnée.
*/
function array_find(array,func){
    var i=0;
    for(key in array){
        ret = func(array[key],key,i);
        if(typeof(ret)!=="undefined")
            return ret;
        i++;
    }
    
    //retourne "undefined", permet les appels imbriqué 
};

/**
    @brief Inverse les clés d'un objet avec leurs valeurs
    @param ar1   [Object] L'objet
    @remarks Les valeurs de l'objet sont converties en texte
    @return [Object] Le nouvel objet
*/
function object_flip(ar1){
    var ar2={};

    for(var key in ar1)
    {
        var value = ""+ar1[key];//convertie en texte
        ar2[value] = key;
    }
    return ar2;
}

/** @} */ // end of group Array

/**--------------------------------------------------------------------------------------------------------------------------------------
    * Date object Section
    * @defgroup Date
    * @brief Fonctions utilisables avec les objets Date
    * @{
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
    @brief Convertie une date en timestamp UNIX
    @param timestamp [int] Nombre de secondes depuis le 01/01/1970
    @remarks Utilise la méthode Date.toGMTString pour formater la chaine
    @return Texte de la date
*/
function timeToDate(timestamp) {
    var theDate = new Date(timestamp * 1000);
    return theDate.toGMTString();
}

/**
    @brief Convertie une date en timestamp UNIX
    @param year  [int] Année depuis 1970
    @param month [int] Mois de 1~12
    @param day   [int] Jour de 1~31
    @param hour  [int] Heure de 0~23
    @param min   [int] Minutes de 0~59
    @param sec   [int] Secondes de 0~59
    @remarks dateToTime utilise l'objet Date pour obtenir le timestamp
    @return [int] timestamp en secondes
*/
function dateToTime(year, month, day, hour, min, sec) {
    var humDate = new Date(Date.UTC(year, month - 1, day, hour, min, sec));
    return (humDate.getTime() / 1000.0);
}

/**
    @brief Retourne le timestamp actuel en secondes
    @remarks dateToTime utilise l'objet Date pour obtenir le timestamp
    @return [int] timestamp en secondes
*/
function getTime() {
    var current_time=new Date();
    return parseInt(current_time.getTime() / 1000);//en secondes
}

/**
    @brief Retourne le timestamp actuel en millisecondes
    @remarks dateToTime utilise l'objet Date pour obtenir le timestamp
    @return [int] timestamp en secondes
*/
function getTimeMS() {
    var current_time=new Date();
    return current_time.getTime();//en millisecondes
}

/**
    @brief Formate un timestamp en date textuel (PHP style)
    @param format      [string] Format (voir remarques)
    @param timestamp   [int]    Optionnel, timestamp en secondes
    @remarks Les formats prédéfinit sont:
            DATE_ATOM
            DATE_COOKIE
            DATE_ISO8601
            DATE_RFC822
            DATE_RFC850
            DATE_RFC1036
            DATE_RFC1123
            DATE_RFC2822
            DATE_RFC3339
            DATE_RSS
            DATE_W3C
        Pour plus d'informations sur la syntaxe du format voir la documentation PHP de 'date()'
    @return [string] La date fomatée
*/
var DATE_DEFAULT = "d/m/Y H:i:s";
var DATE_ATOM    = "Y-m-d\TH:i:sP";
var DATE_COOKIE  = "l, d-M-y H:i:s T";
var DATE_ISO8601 = "Y-m-d\TH:i:sO";
var DATE_RFC822  = "D, d M y H:i:s O";
var DATE_RFC850  = "l, d-M-y H:i:s T";
var DATE_RFC1036 = "D, d M y H:i:s O";
var DATE_RFC1123 = "D, d M Y H:i:s O";
var DATE_RFC2822 = "D, d M Y H:i:s O";
var DATE_RFC3339 = "Y-m-d\TH:i:sP";
var DATE_RSS     = "D, d M Y H:i:s O";
var DATE_W3C     = "Y-m-d\TH:i:sP";

function date(format,timestamp)
{
    var str_month   = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    var str_month_l = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "Octember", "November", "December");
    var str_day     = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
    var str_day_l   = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");

    var time;
    if (typeof (timestamp) == "undefined")
        time = new Date();
    else
        time=new Date(timestamp * 1000);

    return format.replace(
        new RegExp("([dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZU]){1}", "g"),
        function () {
            var matches = arguments;
            var ret = "";
            switch (matches[1]) {
                case "d": // Jour du mois, sur deux chiffres (avec un zéro initial)
                    ret = zerolead(time.getDate(), 2);
                    break;
                case "D": // Jour de la semaine, en trois lettres (en anglais)
                    ret = str_day[time.getDay()];
                    break;
                case "j": // Jour du mois sans les zéros initiaux
                    ret = time.getDate();
                    break;
                case "l": // Jour de la semaine, textuel, version longue (en anglais)
                    ret = str_day_l[time.getDay() - 1];
                    break;
                case "N": // Représentation numérique ISO-8601 du jour de la semaine (1 pour Lundi à 7 pour Dimanche)
                    ret = ((time.getDay() == 0) ? "7" : time.getDay());
                    break;
                case "S": // Suffixe ordinal d'un nombre pour le jour du mois, en anglais, sur deux lettres (st, nd, rd ou th)
                    ret = "";
                    break;
                case "w": // Jour de la semaine au format numérique (0 (pour dimanche) à 6 (pour samedi))
                    ret = time.getDay();
                    break;
                case "z": // Jour de l'année (0 à 365)
                    ret = "";
                    break;
                //Semaines   
                case "W": // Numéro de semaine dans l'année ISO-8601, les semaines commencent le lundi (Exemple : 42 (la 42ème semaine de l'année))
                    ret = "";
                    break;
                //Mois   
                case "F": // Mois, textuel, version longue; en anglais (January à December)
                    ret = str_month_l[time.getMonth()];
                    break;
                case "m": // Mois au format numérique, avec zéros initiaux (01 à 12)
                    ret = zerolead(time.getMonth() + 1, 2);
                    break;
                case "M": // Mois, en trois lettres, en anglais (Jan à Dec)
                    ret = str_month[time.getMonth()];
                    break;
                case "n": // Mois sans les zéros initiaux (1 à 12)
                    ret = time.getMonth() + 1;
                    break;
                case "t": // Nombre de jours dans le mois (28 à 31)
                    ret = "";
                    break;
                //Annees   
                case "L": // Est ce que l'année est bissextile (1 si bissextile, 0 sinon)
                    ret = "";
                    break;
                case "o": // L'année ISO-8601. C'est la même valeur que Y, excepté que si le numéro de la semaine ISO (W) appartient à l'année précédente ou suivante, cette année sera utilisé à la place (Exemples : 1999 ou 2003)
                    ret = "";
                    break;
                case "Y": // Année sur 4 chiffres (Exemples : 1999 ou 2003)
                    ret = time.getFullYear();
                    break;
                case "y": // Année sur 2 chiffres (Exemples : 99 ou 03)
                    ret = time.getFullYear().toString().substr(2); //ne pas utiliser time.getYear() pour les dates apres '1900'
                    break;
                //Heures   
                case "a": // Ante meridiem et Post meridiem en minuscules (am ou pm)
                    ret = "";
                    break;
                case "A": // Ante meridiem et Post meridiem en majuscules (AM ou PM)
                    ret = "";
                    break;
                case "B": // Heure Internet Swatch (000 à 999)
                    ret = "";
                    break;
                case "g": // Heure, au format 12h, sans les zéros initiaux (1 à 12)
                    ret = "";
                    break;
                case "G": // Heure, au format 24h, sans les zéros initiaux (0 à 23)
                    ret = time.getHours();
                    break;
                case "h": // Heure, au format 12h, avec les zéros initiaux (01 à 12)
                    ret = "";
                    break;
                case "H": // Heure, au format 24h, avec les zéros initiaux (00 à 23)
                    ret = zerolead(time.getHours(), 2);
                    break;
                case "i": // Minutes avec les zéros initiaux (00 à 59)
                    ret = zerolead(time.getMinutes(), 2);
                    break;
                case "s": // Secondes, avec zéros initiaux (00 à 59)
                    ret = zerolead(time.getSeconds(), 2);
                    break;
                case "u": // Microsecondes (Exemple : 654321)
                    ret = "";
                    break;
                //Fuseau horaire   
                case "e": // L'identifiant du fuseau horaire  (UTC, GMT, Atlantic/Azores)
                    ret = "GMT+" + time.getTimezoneOffset();
                    break;
                case "I": // L'heure d'été est activée ou pas (1 si oui, 0 sinon)
                    ret = "";
                    break;
                case "O": // Différence d'heures avec l'heure de Greenwich (GMT), exprimée en heures (Exemple : +0200)
                    var h = minToHour(time.getTimezoneOffset());
                    ret = "+" + zerolead(h.hour, 4);
                    break;
                case "P": // Différence avec l'heure Greenwich (GMT) avec un deux-points entre les heures et les minutes (Exemple : +02:00)
                    var h = minToHour(time.getTimezoneOffset());
                    ret = "+" + zerolead(h.hour, 2) + ":" + zerolead(h.min, 2);
                    break;
                case "T": // Abréviation du fuseau horaire (Exemples : EST, MDT ...)
                    ret = "";
                    break;
                case "Z": // Décalage horaire en secondes. Le décalage des zones à l'ouest de la zone UTC est négative, et à l'est, il est positif. (-43200 à 50400)
                    ret = "";
                    break;
                //Date et Heure complète   
                case "U": // Secondes depuis l'époque Unix
                    ret = timestamp;
                    break;
            }
            return "" + ret;
        }
    );
}

/* [ PRIVATE ] */
function minToHour(minutes)
{
    var hours=0;
    while(minutes>=60)
    {
        hours++;
        minutes-=60;
    }
    return {hour:hours,min:minutes};
}

/**
    @brief Ajoute les zeros manquants en début de nombre/texte
    @param num    [mixed] Valeur
    @param length [int]   Taille du nombre
    @par Exemple
    @code{.js}
        zerolead(14,4); // retourne 0014
        zerolead("4.12",5); // retourne 04.12
    @endcode
    @return [string] Nouvelle valeur
*/
function zerolead(num, length)
{
    var r = "" + trim(num.toString());
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

/**
    @brief Supprime les zeros superflus en début de nombre/texte (ne fonctionne pas avec les nombres a virgule)
    @param num    [mixed] Valeur
    @par Exemple
    Dans cet exemple, la fonction path contruit un chemin à partir des éléments "/srv", "www" et "index.html".
    @code{.js}
        zerolead("0014"); // retourne 14
    @endcode
    @return [string] Nouvelle valeur
*/
function zeroshift(num) {
    var r = "" + trim(num.toString());
    var i = 0;
    while (i < r.length-1 && r[i]=="0" ) {
        i++;
    }
    return r.substring(i);
}
/** @} */ // end of group Date

/**--------------------------------------------------------------------------------------------------------------------------------------
    * Debug Section
    * @defgroup Debug
    * @brief Fonctions de bases
    * @{
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
    @brief Affiche une boite de dialogue avec les attributs d'un élément
    @param obj [HTMLElement] L'Elément
*/
function objAlertAttributes(obj){
	var txt;
	var tmp;
	for(var i=0;i<obj.attributes.length;i++){
		tmp += (obj.attributes[i].name+" = "+obj.attributes[i].value+", ");
		if(tmp.length>120){
			txt+=tmp+"\n";
			tmp="";
		}
	}
	txt+=tmp;
	alert(obj.tagName+" ("+obj.id+"):\n"+txt);
}

/**
    @brief Affiche une boite de dialogue avec les membres d'un objet
    @param obj [HTMLElement] L'Elément
*/
function objAlertMembers(obj) {
	var txt="";
	for(var key in obj){
	    txt += (key + " [" + typeof (obj[key]) + "]");
	    if (typeof (obj[key]) == "undefined")
	        txt += (" undefined ");
	    else if (obj[key] == null)
		    txt += (" null ");
	    else if (typeof (obj[key].toString) == "function")
		    txt += (" {"+obj[key].toString()+"}");
		txt += "\n";
		//txt += (key+" ["+typeof(obj[key])+"] {"+obj[key]+"}\n");
	}
	alert(txt);
}

/**
    @brief Affiche une boite de dialogue avec les clés d'un objet
    @param obj [HTMLElement] L'Elément
*/
function objAlertMembersKey(obj){
	var txt="";
	for(var key in obj){
		txt += (key+" ["+typeof(obj[key])+"]\n");
	}
	alert(txt);
}

/** @} */ // end of group Debug

/**--------------------------------------------------------------------------------------------------------------------------------------
    * WebFrameWork Specific
    * @defgroup XARG
    * @brief Fonctions utiles au format XArg
    * @{
--------------------------------------------------------------------------------------------------------------------------------------*/
var XARG_START_OF_TEXT_CODE = 0x02;
var XARG_END_OF_TEXT_CODE   = 0x03; 
var XARG_START_OF_TEXT_CHAR = String.fromCharCode(0x2);
var XARG_END_OF_TEXT_CHAR   = String.fromCharCode(0x3);

/**
    @brief Convertie le corps d'un document 'text/wfw.xra' en objet javascript
    @param text     [string] Corps du document XARG
    @param bencoded [bool]   Si true, scan 'text' avec l'encodage d'une URL
    @return [Object] Tableau associatif des arguments
*/
function x_request_arguments_parse(text,bencoded) {//v4
	var rslt = new Object();
	var begin_pos = 0;
	var pos;
	var separator = XARG_START_OF_TEXT_CHAR;
	var end       = XARG_END_OF_TEXT_CHAR;

    if(bencoded){
	    separator = "%02";//STX
	    end       = "%03";//ETX
    }

	while((pos=text.indexOf(separator,begin_pos)) != -1)
	{
		var pos2  = text.indexOf(end,pos);
		if(pos2 == -1){ // fin anticipe
            wfw.puts("x_request_arguments_parse(), attention: fin anormale de requete!");
			return rslt;
        }

		//alert(begin_pos+"->"+pos+"\n"+pos+"->"+pos2);

		var name  = text.substr(begin_pos,pos-begin_pos);
		var value = text.substr(pos+separator.length,pos2-(pos+separator.length));

		begin_pos = pos2+end.length; //prochaine position de depart

		rslt[name]=value;
	}
	return rslt;
}

/** @} */ // end of group XARG

/**--------------------------------------------------------------------------------------------------------------------------------------
    * Webframework standard errors codes
    * @defgroup Result
    * @brief Codes d'erreurs standard
    * @{
--------------------------------------------------------------------------------------------------------------------------------------*/

//Resultats
var ERR_SYSTEM              = 2; //!< @brief Contexte en cas de succès
var ERR_FAILED              = 1; //!< @brief Contexte en cas d'erreur ou d'echec de l'application
var ERR_OK                  = 0; //!< @brief Contexte en cas d'erreur ou d'echec du système 

/** @} */ // end of group Result

/**--------------------------------------------------------------------------------------------------------------------------------------
    * HTML-Document Specific
    * @defgroup HTML
    * @brief Fonctions HTML
    * @{
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
    @brief Convertie un text HTML en object de document natif
    @param text [string] Corps du document HTML
    @remarks L'Objet retourné est dépendant de l'implémentation du navigteur
    @return [Object] Instance de l'objet DOMDOCUMENT
    @retval null Echec de la création du document
*/
function html_parse(text) {
    var doc=null;
    var parser = null;
    if(typeof(text)!='string'){
        wfw.puts('html_parse not a string');
        return null;
    }
    if(document.implementation && document.implementation.createDocument) {
        doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html',  null);
        doc.documentElement.innerHTML = text;
        return doc;
    }
    return xmlDoc;
}

/** @} */ // end of group HTML

/**--------------------------------------------------------------------------------------------------------------------------------------
    * XML-Document Specific
    * @defgroup XML
    * @brief Fonctions XML
    * @{
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
    @brief Convertie le corps d'un document 'text/xml' en objet javascript
    @param text [string] Corps du document XML
    @remarks L'Objet retourné est dépendant de l'implémentation du navigteur
    @return [Object] Instance de l'objet XML-DOM
    @retval null Echec de la création du document
*/
function xml_parse(text) {
    var xmlDoc=null;
    if(typeof(text)!='string'){
        console.log('xml_parse not a string');
        return null;
    }
    if(window.DOMParser)
    {
        console.log("xml_parse: use DOMParser");
        var parser=new DOMParser();
        xmlDoc=parser.parseFromString(text,"text/xml");
    }
    else // Internet Explorer
    {
        console.log("xml_parse: use ActiveXObject");
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async="false";
        xmlDoc.loadXML(text); 
        if(xmlDoc.parseError.errorCode != 0 && typeof(wfw)=="object") {
           var myErr = xmlDoc.parseError;
           console.log("xml_parse: error " + myErr.reason);
           return null;
        }
    } 
    return xmlDoc;
}

/**
    @brief Charge un fichier XML
    @param file_name [string] Corps du document XML
    @param loaded [string] Corps du document XML
    @remarks L'Objet retourné est dépendant de l'implémentation du navigteur
    @return [Object] Instance de l'objet XML-DOM
    @retval null Echec de la création du document
*/
//charge un fichier XML
function xml_load2(file_name,loaded) {
    var content = wfw.http_get(file_name);
    if(!((wfw.nav.httpRequest.readyState == wfw.request.READYSTATE_DONE) && (wfw.nav.httpRequest.status == 200)))
        return false;
    var doc = xml_parse(content);
    if(!doc)
        return false;
    loaded(doc);
    return true;
}

//charge un fichier XML (compatible)
function xml_load(file_name,callback) {
    //cree la frame
    var frame_obj;

    if((frame_obj = document.createElement("iframe"))==null)
    {
        wfw.puts("xml_load : iframe element creation failed !");
        return false;
    }
    objSetAtt(frame_obj,"src",file_name);
    objSetAtt(frame_obj,"style","width:100%; height:600px; display:none;");

    //au chargement du document ...
    objSetEvent(frame_obj,"load",function()
    {
        callback(this.contentWindow.document);
    });

    document.body.appendChild(frame_obj);
    return true;
}

/** @} */ // end of group XML

/**--------------------------------------------------------------------------------------------------------------------------------------
    * Divers
    * @defgroup Divers
    * @brief Fonctions diverses
    * @{
--------------------------------------------------------------------------------------------------------------------------------------*/

function strToArray(text,separator) {
	var rslt = new Array();
	var begin_pos = 0;
	var pos;

	while((pos=text.indexOf(separator,begin_pos)) != -1)
	{
		var value  = text.substr(begin_pos,pos-begin_pos);

		begin_pos = pos+separator.length; //prochaine position de depart

		rslt.push(value);
	}

    return rslt;
}

/**
    @brief Obtient le sous-type d'un MIME
    @param mime_type [string] MIME type, ex: text/plain
    @return [string] Sous-type du MIME
*/
function MIME_lowerType(mime_type) {
    var i = mime_type.indexOf('/',0);
    if(i<0)
        return "";
    return mime_type.substring(0,i);
}

/**
    @brief Obtient le super-type d'un MIME
    @param mime_type [string] MIME type, ex: text/plain
    @return [string] Super-type du MIME
*/
function MIME_upperType(mime_type) {
    var i = mime_type.indexOf('/',0);
    if(i<0)
        return "";
    return mime_type.substring(i+1,mime_type.length);
}

function isEditable(obj) {
    if((typeof(obj)=='object') && (typeof(obj.constructor)!='undefined'))
        return true;
    return false;
}

/**
    @brief Tronque un nombre dans une plage de valeur
    @param number v   Valeur à tronquer
    @param number min Valeur minimum 
    @param number max Valeur maximum 
    @return number Valeur tronqué
*/
function minmax(v,min,max){
    if(v < min)
        v = min;
    if(v > max)
        v = max;
    return v;
}

/** @} */ // end of group Divers

/*--------------------------------------------------------------------------------------------------------------------------------------
    * Mouse detection
    * @defgroup Mouse
    * @brief Déctectin des mouvements de la souris
    * @{
--------------------------------------------------------------------------------------------------------------------------------------*/

// Globales

var cX = 0; var cY = 0; // position dans le client
var rX = 0; var rY = 0;

// Initilaise les Evenements

function updateCursorPosition(e) { /*wfw.puts(cX);*/ cX = e.pageX; cY = e.pageY; }

function updateCursorPositionDocAll(e) { /*wfw.puts(cX);*/ cX = event.clientX; cY = event.clientY; }

if(document.all)
	{ document.onmousemove = updateCursorPositionDocAll; }
else
	{ document.onmousemove = updateCursorPosition; }

// Fonctions

// Retourne la position X(pixel) en cours du curseur
function getMouseX(){
	return parseInt(cX);
//	return document.documentElement.scrollLeft + window.event.clientX;//XHTML
//	return document.body.scrollLeft + window.event.clientX;//HTML
}

// Retourne la position Y(pixel) en cours du curseur
function getMouseY(){
	return parseInt(cY);
//	return document.documentElement.scrollTop + window.event.clientY;//XHTML
//	return document.body.scrollTop + window.event.clientY;//HTML
}

// Verifie si le curseur survol actuelement l'objet specifier
function isPtrOver(element){
	element = docGetElement(element);
	if(element){
		var x  = objGetX(element);
		var y  = objGetY(element);
		var x1 = x + element.offsetWidth;
		var y1 = y + element.offsetHeight;
		var mx = getMouseX();
		var my = getMouseY();
		
		//alert(x+";"+y+";"+x1+";"+y1+"; ? "+mx+";"+my);
	
		if( ((mx >= x) && (my <= y)) && ((mx <= x1) && (my >= y1)) )
			return true;
	}
	return false;
}

/** @} */ // end of group Mouse

/** @} */ // end of group Basique
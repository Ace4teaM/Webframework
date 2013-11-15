/*
    (C)2008-2012 ID-Informatik. All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    Fonctions globales de bases utiles

    [2010], Implementation
*/

/*--------------------------------------------------------------------------------------------------------------------------------------
Divers
--------------------------------------------------------------------------------------------------------------------------------------*/


/**
*Retourne une valeur tronqué (rotative)
*@param [numeric] val Valeur
*@param [numeric] max Valeur maximum
*@return [string] L'Identifiant
*@remark Si la valeur 'val' depasse le seuil maximale, le restant de la valeur est ramené a zéro
*/
function rotval(val, max) {
    return (val % max);
}

/*--------------------------------------------------------------------------------------------------------------------------------------
    Divers
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
 *Compteur global utilisé par la fonction uniqid
 *(Ne pas modifier explicitement)
 */
var _uniqid_cnt = 0;

/**
*    Génére un identifiant unique
*    @return [string] Identifiant unique
*/
function uniqid()
{
    _uniqid_cnt++;
    var newDate = new Date;
    return "uid_"+parseInt(Math.random()*456)+"_"+newDate.getTime()+"_"+_uniqid_cnt;//doit commencer par une lettre pour etre un identificateur valide
}

/**
    Vérifie si une classe existe
    Arguments:
        [string] class_name : Nom de la classe de base
    Remarques:
        Pour être reconnue comme une classe, l'objet "class_name" doit être de type fonction
    Retourne:
        [bool] true si la classe existe sinon false
*/
function class_exists(class_name)
{
    //test l'existance de l'objet
    if(typeof(window[class_name])!="function")
        return false;
    return true;
}

/**
    Vérifie si une méthode de classe existe
    Arguments:
        [string] class_name : Nom de la classe de base
        [string] method     : Nom de la méthode
    Retourne:
        [bool] true si la classe existe sinon false
    Remarques:
        Pour être reconnue comme une classe, l'objet "class_name" doit être de type fonction
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
    Vérifie si un objet possède une méthode
    Arguments:
        [object] object : L'objet de classe
        [string] method : Nom de la méthode
    Retourne:
        [bool] true si la classe existe sinon false
    Remarques:
        Pour être reconnue comme une classe, l'objet doit être une instance de "Object"
*/
function have_method(object, method) {
    //test l'existance de l'objet
    if (!(object instanceof Object))
        return false;
    //test l'existance de la methode
    return ((typeof (object[method]) == "function") ? true : false);
}

/*--------------------------------------------------------------------------------------------------------------------------------------
    Object Section
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
    Copie une instance de variable
    Arguments:
        [mixed] a : La variable à dupliquer
    Retourne:
        [mixed] Nouvelle instance de la variable
    Remarques:
        copy éffectue une copie de chacun des éléments d'un objet ou d'un tableau puis retourne la nouvelle référence
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
    Retourne le nombre de membres enfant d'un objet
    Arguments:
        [object] obj : L'Objet
    Retourne:
        [int] Nombre de membres enfant de l'objet 'obj'
*/
function length(obj){
    var i=0;
    for(var element in obj)
        i++;
    return i;
}

/**
    Remonte un membre d'un objet en première position
    Arguments:
        [object] obj : L'Objet
        [string] key : Clef du membre à repositionner
    Retourne:
        [object] Nouvel objet
    Remarques:
        L'Instance de 'obj' n'est pas modifié
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
    Descend un membre d'un objet en dernière position
    Arguments:
        [object] obj : L'Objet
        [string] key : Clef du membre à repositionner
    Retourne:
        [object] Nouvel objet
    Remarques:
        L'Instance de 'obj' n'est pas modifié
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

function object_key(obj, i) {
    var x = 0;
    for (var key in obj)
        if (i == x++)
            return key;
    return null;
}
/*--------------------------------------------------------------------------------------------------------------------------------------
    String object Section
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
    Transforme un nombre d'octet en taille avec suffix
    Arguments:
        [number] bytes_count : Nombre d'octets
    Retourne:
        [string] Taille agréable à lire
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
    Transforme une taille en nombre d'octets
    Arguments:
        [string] size : Taille
    Retourne:
        [number] Nombre d'octet. Si null, 'size' est mal formé
    Remarques:
        Les suffix suivants sont acceptés:
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
    Retourne l'extension d'un fichier
    Arguments:
        [string] path : Chemin d'accès ou nom de fichier
    Retourne:
        [string] Extension du fichier, vide si aucune
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
Change l'extension d'un fichier
    Arguments:
        [string] path : Chemin d'accès ou nom de fichier
        [string] ext  : Nouvelle extension
    Retourne:
        [string] Nouveau chemin d'accès ou nom de fichier
*/
function set_fileext(path, ext) {
    var startIndex = path.lastIndexOf('.');
    if (startIndex >= 0) {
        return path.substring(0, startIndex + 1) + ext;
    }
    return path + "." + ext;
}

/**
    Retourne le nom d'un fichier ou du dernier dossier dans un chemin d'accès
    Arguments:
        [string] path : Chemin d'accès
    Retourne:
        [string] Nom du fichier ou du dernier dossier
*/
var basename = filename;
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
    Retourne le chemin d'accès à un fichier
    Arguments:
        [string] path : Chemin d'accès complet
    Retourne:
        [string] Chemin d'accès du fichier (avec le slash de fin)
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
    Compare deux chaines à la recherche de caractères différents
    Arguments:
        [string] str : Chaine de caractères 1
        [string] chr : Chaine de caractères 2
    Retourne:
        [bool] true, si 'str' est formé uniquement avec les caractères de 'chr', sinon false
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
    Compare deux chaines à la recherche de caractères identiques
    Arguments:
        [string] str : Chaine de caractères 1
        [string] chr : Chaine de caractères 2
    Retourne:
        [bool] true, si 'str' n'est pas formé avec les caractères de 'chr', sinon false
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
    Supprime les espaces en début et en fin de chaine
    Arguments:
        [string] str : Chaine
    Retourne:
        [string] Nouvelle chaine
*/
function trim(str){
    return str.replace(/^\s+|\s+$/g, '');
}

/**
    Supprime les espaces en début de chaine
    Arguments:
        [string] str : Chaine
    Retourne:
        [string] Nouvelle chaine
*/
function ltrim(str){
    return str.replace(/^\s+/g, '');
}

/**
    Supprime les espaces en fin de chaine
    Arguments:
        [string] str : Chaine
    Retourne:
        [string] Nouvelle chaine
*/
function rtrim(str){
    return str.replace(/\s+$/g, '');
}

/**
    Compare le début d'une chaine
    Arguments:
        [string] str  : Chaine à tester
        [string] find : Chaine à rechercher
    Retourne:
        [int] 0 Si 'find' est contenu en début de chaine 'str', sinon 1
*/
function lstrcmp(text,find){
    if(text.substr(0,find.length) == find)
        return 0;
    return 1;
}

/**
    @brief Vérifie si une chaine est vide
    @param string str Chaine à analyser
    @return bool true Si l'objet est vide, sinon false
*/
function empty_string(str){
    if(trim(str)=='')
        return true;
    return false;
}

/**
    Vérifie si un objet ou une chaine est vide
    Arguments:
        [object] obj : Objet à tester
    Retourne:
        [bool] true Si l'objet est vide, sinon false
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
	strToFlags
	  Explose une chaine en tableau
    Arguments:
	  [string] text      : Chaine 
	  [string] options   :  
    Retourne:
	  [array] Tableau des éléments de la chaine
	Remarques:
	  Les éléments vides sont ignorés
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
	strexplode
	  Explose une chaine en tableau
    Arguments:
	  [string] text      : Chaine 
	  [string] separator : Chaine de séparation
	  [bool]   bTrim     : Si true, les espaces blanc sont supprimés en début est fin de chaine
    Retourne:
	  [array] Tableau des éléments de la chaine
	Remarques:
	  Les éléments vides sont ignorés
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
	strimplode
	  Implose un tableau en une chaine de caractères
	Arguments:
	  [array]  array     : Tableau 
	  [string] separator : Chaine de séparation
	  [bool]   bTrim     : Si true, les espaces blanc sont supprimés en début est fin de chaine
    Retourne:
	  [string] Chaine implosé
	Remarques:
	  Les éléments vides sont ignorés
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
*    @brief Convertie un objet natif Javascript en chaine de caractéres
*    @param obj   Objet à convertir en texte
*    @param depth Si true, scan les objets recursivement
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
                    text += 'object {' + obj_member + ':' + (!depth ? "" + obj[obj_member] : tostr(obj[obj_member])) + "},\n";
                text += "\n";
                break;
            case 'array':
                if (!depth)
                    text += "" + obj;
                else
                    for (var i = 0; i < obj.length; i++)
                        text += '{' + i + ':' + (!depth ? "" + obj[i] : tostr(obj[i])) + "},\n";
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
*    @param obj   Objet à convertir en texte
*    @param depth Si true, scan les objets recursivement
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

//transforme une chaine de caractere au format "name1:value1;name2:value2;..." en tableau associatif
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
	strlen
	  Retourne la taille d'une chaine
    Arguments:
	  [string] text      : Chaine 
    Retourne:
	  [int] Nombre de caractéres dans la chaine
	Remarques:
	  Equivaut à 'text.length'
*/
function strlen(text){
    return text.length;
}

/**
	strtoid
	  Convertie une chaine en identificateur (voir cInputIdentifier)
    Arguments:
	  [string] str : Chaine à convertir
    Retourne:
	  [string] Chaine convertie
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
    Convertie une chaine en nom (voir cInputName)
    Arguments:
	  [string] str : Chaine à convertir
    Retourne:
	  [string] Chaine convertie
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
    Tronque le contenu d'un texte
    Arguments:
        [string] text   : Le texte à tronquer
        [int] maxchar   : Maximum de caractères dans le texte
        [int] maxline   : Maximum de lignes dans le texte
        [string] endstr : Optionnel, Chaine à ajouter en fin de texte (si tronqué). Par défaut " [...]"
    Retourne:
        [string] Le texte tronqué
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
    strCharCount
    Compte le nombre de caractères dans une chaine
    Arguments:
        [string] text      : Chaine 
        [string] charlist  : Caractères à rechercher
    Retourne:
        [int] Nombre de caractères trouvés
*/
function strCharCount(text, charlist) {
    var count = 0;
    for (var i = 0; i < charlist.length; i++) {
        var c = charlist[i];
        count += text.split(c).length;
    }
    return count;
} 

/*--------------------------------------------------------------------------------------------------------------------------------------
    Array/Object object Section
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
Recherche a plus grande valeur d'un tableau numerique
Arguments:
[Array] ar   : Le tableau
Retourne:
index de la valeur la plus grande
*/
function array_max(ar) {
    var max = ar[0];
    var key = 0;
    var len = ar.length;
    while (--len) {
        if (parseFloat(ar[len]) > max) {
            max = ar[len];
            key = len;
        }
    }
    return len;
}

/**
    Supprime un clé d'un tableau
    Arguments:
        [Array] ar   : Le tableau
        [int]   key  : La clé
    Retourne:
        [mixed] Copie de l'item supprimé
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
    Insert une nouvelle clé à un tableau
    Arguments:
        [Array] ar   : Le tableau
        [int]   key  : La clé
        [mixed] val  : La valeur
    Retourne:
        [mixed] Nouveau tableau
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
    Supprime des clés d'un objet
    Arguments:
        [object] obj        : Objet de base
        [array]  key_array  : Tableau des clés à soustraire
    Retourne:
        [object] Nouvelle instance de l'objet 
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
    Associe deux objets dans une nouvelle instance
    Arguments:
        [object] obj1   : Le première objet
        [object] obj2   : Le deuxième objet
        [bool]   bcopy  : Si true, crée une copie de l'objet sinon 'obj1' reçoit les données de 'obj2'
    Remarques:
        Si obj1 et/ou obj2 n'est pas de type 'object', le type est forcé.
        Si deux champs porte la même clé, la valeur de 'ar2' écrase la valeur de 'ar1'
    Retourne:
        [Object] Le nouvel objet
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
    Associe deux tableaux
    Arguments:
        [Array] ar1   : Le première objet
        [Array] ar2   : Le deuxième objet
        [bool]  bcopy : Si true une nouvelle instance est créé, sinon ar1 reçois les champs de 'ar2'
    Remarques:
        Tous les champs de 'ar2' sont ajoutés à 'ar1'
    Retourne:
        [Array] Le nouveau tableau
*/
function array_merge(ar1,ar2,bcopy){
    if(bcopy)
        ar1 = copy(ar1);
    for(var key in ar2)
        ar1.push(ar2[key]);
    return ar1;
}

/**
    Recherche un champs dans un tableau
    Arguments:
        [array/object]  array  : Tableau de la recherche
        [function]      func   : Callback(value,key,index), voir remarques
    Remarques:
        array_find() enumére toutes les clés/valeurs du tableau 'array'.
        Tant que le callback 'func' ne retourne rien, la recherche continue.
        Si au contraire, un retour est detecté, la recherche s'interrompt et la valeur est retournée.
    Retourne:
        [mixed] Valeur retourné par le callback, 'undefined' si la recherche n'a rien donnée.
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
    Inverse les clés d'un objet avec leurs valeurs
    Arguments:
        [Object] ar1   : L'objet
    Remarques:
        Les valeurs de l'objet sont converties en texte
    Retourne:
        [Object] Le nouvel objet
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

/*--------------------------------------------------------------------------------------------------------------------------------------
    Date object Section
--------------------------------------------------------------------------------------------------------------------------------------*/

// timeToDate (obselete)
// Convertie un timestamp UNIX en date
//   Integer -timestamp  : secondes depuis le 01/01/1970
//   Retourne      : string de la date
function timeToDate(timestamp) {
    var theDate = new Date(timestamp * 1000);
    return theDate.toGMTString();
}

/**
    Convertie une date en timestamp UNIX
    Arguments:
        [int] year  : Année depuis 1970
        [int] month : Mois de 1~12
        [int] day   : Jour de 1~31
        [int] hour  : Heure de 0~23
        [int] min   : Minutes de 0~59
        [int] sec   : Secondes de 0~59
    Remarques:
        dateToTime utilise l'objet Date pour obtenir le timestamp
    Retourne:
        [int] timestamp en secondes
*/
function dateToTime(year, month, day, hour, min, sec) {
    var humDate = new Date(Date.UTC(year, month - 1, day, hour, min, sec));
    return (humDate.getTime() / 1000.0);
}

/**
    Retourne le timestamp actuel en secondes
    Remarques:
        dateToTime utilise l'objet Date pour obtenir le timestamp
    Retourne:
        [int] timestamp en secondes
*/
function getTime() {
    var current_time=new Date();
    return parseInt(current_time.getTime() / 1000);//en secondes
}

/**
    Retourne le timestamp actuel en millisecondes
    Remarques:
        dateToTime utilise l'objet Date pour obtenir le timestamp
    Retourne:
        [int] timestamp en secondes
*/
function getTimeMS() {
    var current_time=new Date();
    return current_time.getTime();//en millisecondes
}

/**
    Formate un timestamp en date textuel (PHP style)
    Arguments:
        [string] format      : Format (voir remarques)
        [int]    [timestamp] : Optionnel, timestamp en secondes
    Remarques:
        Les formats prédéfinit sont:
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
    Retourne:
        [string] La date fomatée
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
    Ajoute les zeros manquants en début de nombre/texte
    Arguments:
        [mixed] num    : Valeur
        [int]   length : Taille du nombre
    Exemple:
        zerolead(14,4); // retourne 0014
        zerolead("4.12",5); // retourne 04.12
    Retourne:
        [string] Nouvelle valeur
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
Supprime les zeros superflus en début de nombre/texte (ne fonctionne pas avec les nombres a virgule)
Arguments:
[mixed] num    : Valeur
Exemple:
zerolead("0014"); // retourne 14
Retourne:
[string] Nouvelle valeur
*/
function zeroshift(num) {
    var r = "" + trim(num.toString());
    var i = 0;
    while (i < r.length-1 && r[i]=="0" ) {
        i++;
    }
    return r.substring(i);
}

/*--------------------------------------------------------------------------------------------------------------------------------------
    Debug Section
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
    Affiche une boite de dialogue avec les attributs d'un élément
    Arguments:
        [HTMLElement] obj : L'Elément
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
    Affiche une boite de dialogue avec les membres d'un objet
    Arguments:
        [HTMLElement] obj : L'Elément
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
    Affiche une boite de dialogue avec les clés d'un objet
    Arguments:
        [HTMLElement] obj : L'Elément
*/
function objAlertMembersKey(obj){
	var txt="";
	for(var key in obj){
		txt += (key+" ["+typeof(obj[key])+"]\n");
	}
	alert(txt);
}


/*--------------------------------------------------------------------------------------------------------------------------------------
    WebFrameWork Specific
--------------------------------------------------------------------------------------------------------------------------------------*/
var XARG_START_OF_TEXT_CODE = 0x02;
var XARG_END_OF_TEXT_CODE   = 0x03; 
var XARG_START_OF_TEXT_CHAR = String.fromCharCode(0x2);
var XARG_END_OF_TEXT_CHAR   = String.fromCharCode(0x3);
/**
    Convertie le corps d'un document 'text/wfw.xra' en objet javascript
    Parametres:
        [string] text     : Corps du document XARG
        [bool]   bencoded : Si true, scan 'text' avec l'encodage d'une URL
    Retourne:
       [Object] Tableau associatif des arguments
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

/*--------------------------------------------------------------------------------------------------------------------------------------
    Webframework standard errors codes
--------------------------------------------------------------------------------------------------------------------------------------*/

//Resultats
var ERR_SYSTEM              = 2;
var ERR_FAILED              = 1;
var ERR_OK                  = 0;

//Bases
var ERR_TEXT                = 1000;
var ERR_REQ                 = 2000;

//Format Texte
var ERR_TEXT_EMPTY          = ERR_TEXT+1;
var ERR_TEXT_INVALIDCHAR    = ERR_TEXT+2;

//Requete
var ERR_REQ_OPEN_URL        = ERR_REQ+1;
var ERR_REQ_MISSING_ARG     = ERR_REQ+2;
var ERR_REQ_INVALID_ARG     = ERR_REQ+3;

/*--------------------------------------------------------------------------------------------------------------------------------------
    HTML-Document Specific
--------------------------------------------------------------------------------------------------------------------------------------*/

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

/*--------------------------------------------------------------------------------------------------------------------------------------
    XML-Document Specific
--------------------------------------------------------------------------------------------------------------------------------------*/

/**
    Convertie le corps d'un document 'text/xml' en objet javascript
    Parametres:
        [string] text : Corps du document XML
    Remarques:
        L'Objet retourné est dépendant de l'implémentation du navigteur
    Retourne:
        [Object] Instance de l'objet XML-DOM. null en cas d'échec
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

/*--------------------------------------------------------------------------------------------------------------------------------------
    Divers
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
    Obtient le sous-type d'un MIME
    Parametres:
        [string] mime_type : MIME type, ex: text/plain
    Retourne:
        [string] Sous-type du MIME
*/
function MIME_lowerType(mime_type) {
    var i = mime_type.indexOf('/',0);
    if(i<0)
        return "";
    return mime_type.substring(0,i);
}

/**
    Obtient le super-type d'un MIME
    Parametres:
        [string] mime_type : MIME type, ex: text/plain
    Retourne:
        [string] Super-type du MIME
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

/*--------------------------------------------------------------------------------------------------------------------------------------
    Mouse detection
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

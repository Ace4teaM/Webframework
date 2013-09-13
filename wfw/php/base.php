<?php
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
 * @file base.php
 * Fonctions de bases
 */

require_once('systemd.php');

//fichier log
define("LOG_FILE", "private/log.txt");

//passe les arguments de la ligne de commande dans la variable $_REQUEST
if (isset($argc) && ($argc > 1)) {
    for ($i = 1; $i < $argc; $i++) {
        parse_str($argv[$i], $tmp);
        $_REQUEST = array_merge($_REQUEST, $tmp);
    }
}

include_once('ini.php');

function get_cur_script_dir() {//Get Current Script Directory
    return dirname($_SERVER['PHP_SELF']);
}

function get_abs_script_dir() {//Get Current Script Directory
    return dirname($_SERVER['SCRIPT_FILENAME']);
}

function get_web_root() {//Get Current Script Directory
    return dirname($_SERVER['DOCUMENT_ROOT']);
}

/**
 * @brief Obtient l'extension d'un nom de fichier
 * @param string $filename Nom de fichier
 * @return L'extension trouvé (convertie en minuscule)
 * @remarks Une chaine vide est retourné si aucune extension n'est trouvée
 * @remarks L'extension nom est retourné sans point "."
 */
function file_ext($filename) {
    $infos = pathinfo($filename, PATHINFO_EXTENSION);
    return strtolower($infos);
}

/**
 * @brief Définit l'extension d'un nom de fichier
 * @param string $path Nom de fichier
 * @param string $ext La nouvelle extension (sans point '.')
 * @return Le nouveau nom de fichier
 */
function set_fileext($path, $ext) {
    $startIndex = strrpos($path, ".");
    if ($startIndex !== false) {
        return substr($path, 0, $startIndex + 1) . $ext;
    }
    return $path . "." . $ext;
}

/**
 * @brief Assemble un chemin d'accès
 * @param string $base Chemin de base
 * @param string ... Autres fragement de chemin
 * @return string Chemin complet
 * @remarks Le premier caractère de séparation est utilisé pour uniformiser la chaine (ex: '/srv/file\path' = '/srv/file/path'). Si aucun séparateur n'est trouvé, la constante 'SYSTEM_FILE_SEPARATOR' est utilisée.
 * 
 * @code{.php}
 * $filename = path('/srv', 'www', 'index.html');
 * echo( $filename ); // '/srv/www/index.html'
 * @endcode
 */
function path($base)
{
    //detecte le separateur de nom de fichier
    $separator = SYSTEM_FILE_SEPARATOR;
    if(strstr($base,'/')) $separator='/';
    else if(strstr($base,'\\')) $separator='\\';
    
    //trim
    $ret = trim($base);
    
    //uniformise les slashs
    $ret = str_replace(array('\\','/'),$separator,$ret);
    
    //ajoute les fragments de chemins
    for($i=1;$i<func_num_args();$i++)
    {
        $arg = trim(func_get_arg($i));
        //uniformise les slashs
        $arg = str_replace(array('\\','/'),$separator,$arg);
        //supprime le slash de fin
        if(substr($ret,-1) == $separator)
            $ret = substr($ret,0,-1);
        //supprime le slash de debut
        if(substr($arg,0,1) == $separator)
            $arg = substr($arg,1);
        
        //colle le chemin
        $ret .= $separator.$arg;
    }
    
    return $ret;
}

//envoie une ligne sur la sortie d'erreur standard
function _stderr($txt) {
    return file_put_contents("php://stderr", $txt . "\n");
}

/**
 * @brief Resoud un chemin d'accès
 * @param string $dir Chemin d'accès relatif
 * @return Chemin d'accès trouvé
 * @retval null Chemin introuvable
 * @retval false Chemin introuvable (avec resultat)
 * @remarks Recherche le chemin d'accès dans les includes path
 */
function resolve_path($dir) {
    //sauvegarde le chemin de base pour le message 'REQUIRED_PATH_NOT_FOUND'
    $_dir = $dir;
    
    // chemins d'inclusions
    $path = explode(PATH_SEPARATOR, get_include_path());
    array_unshift($path, '.');//ajoute le chemin chemin de base
    
    //recherche le chemin d'accès
    $open_dir = null;
    $i=0;
    do{
        $dir = path($path[$i],$_dir);
        if(is_dir($dir)){
            $open_dir = $dir;
        }
        $i++;
    }while(!$open_dir && $i<count($path));
    
    //dossier introuvable ?
    if(!$open_dir){
        if(function_exists('RESULT'))
            return RESULT(cResult::Failed,"REQUIRED_PATH_NOT_FOUND",array("PATH"=>$_dir));
        return NULL;
    }
    
    //OK
    if(function_exists('RESULT'))
        RESULT_OK();
    return $open_dir;
}

/**
 * @brief Inclue un dossier de fichiers PHP
 * @param string $dir Chemin d'accès
 * @return Liste des fichiers trouvés
 * @retval array Tableau des fichiers inclus (avec le chemin d'accès)
 * @remarks Inclue les fichiers portant l'extension '.php'
 */
function include_path($dir) {
    //resoud le chemin d'accès
    $open_dir = resolve_path($dir);
    if(!$open_dir)
        return $open_dir;
    
    // liste les fichiers...
    $return = array();
    if ($dh = opendir($open_dir)) {
        $file;
        while (($file = readdir($dh)) !== false) {
            if(substr($file, 0,1) != '.' && file_ext($file) == 'php'){
                $path = path($open_dir,$file);
                if(is_file($path)){
                    $return[] = $path;
                    include_once($path);
                }
            }
        }
        closedir($dh);
    }
    
    //OK
    if(function_exists('RESULT'))
        RESULT_OK();
    return $return;
}

/**
 * @brief Inclue un dossier de fichiers PHP
 * @param string $dir Chemin d'accès
 * @return Liste des fichiers trouvés
 * @retval array Tableau des fichiers inclus (avec le chemin d'accès)
 * @remarks Inclue les fichiers portant l'extension '.php'
 */
function require_path($dir)
{
    //resoud le chemin d'accès
    $open_dir = resolve_path($dir);
    if(!$open_dir)
        return $open_dir;
    
    // liste les fichiers...
    $return = array();
    if ($dh = opendir($open_dir)) {
        $file;
        while (($file = readdir($dh)) !== false) {
            if(substr($file, 0,1) != '.' && file_ext($file) == 'php'){
                $path = path($open_dir,$file);
                if(is_file($path)){
                    $return[] = $path;
                    require_once($path);
                }
            }
        }
        closedir($dh);
    }
    
    //OK
    if(function_exists('RESULT'))
        RESULT_OK();
    return $return;
}

/**
 * Genere un nom de fichier unique
 * @param $base_name Nom de base du fichier, si vide auto
 * @param $dir Chemin d'accès au dossier de création
 * @return Nom de fichier unique sans le chemin d'accès
 */
function uniq_filename($base_name, $dir) {
    if (empty($base_name))
        $base_name = uniqid();
    $filename = $base_name;
    $i = 2;
    while (file_exists($dir . $filename)) {
        $filename = "$i.$base_name";
        $i++;
    }

    return $filename;
}

/**
 * @brief Liste les noms de classes heritées du type donné
 * @param string $baseName Nom de la classe de base
 * @return Types de classes trouvées
 * @retval array Tableau associatif des noms de classes trouvées
 */
function get_declared_classes_of($baseName) {
    $class = get_declared_classes();
    $find = array();
    $cur;
    foreach ($class as $i => $name) {
        //print_r($name);
        //$cur = new $name();
        if (is_subclass_of($name, $baseName) === true) {
            $find[] = $name;
            //	print_r(" (yes)");
        }
        //else print_r(" (no)");
        //print_r("\n");
    }
    return $find;
}

/**
 * @brief Transforme un nombre d'octet en une taille avec suffix
 * @param int $bytes_count Nombre d'octets
 * @return Taille convertie en chaine
 * @retval string Taille en nombre suivit du suffix de type (ex: 1.3 Mo)
 */
function byteToSize($bytes_count) {
    $suffix = array("octets", "Ko", "Mo", "Go", "To", "Po", "Zo", "Yo");
    $i = 0;
    $suffix_length = count($suffix);
    while ($bytes_count >= 1024 && $i < $suffix_length) {
        $bytes_count/=1024;
        $i++;
    }
    if (!$i)
        return $bytes_count . " " . $suffix[$i];
    return number_format($bytes_count, 1) . " " . $suffix[$i];
}

/**
 * @brief Transforme une taille avec suffix en nombre d'octet
 * @param string $size Taille en chaine
 * @param bool $intVal Force le retour en entier (voir remarques). 'false' par défaut
 * @return Taille en octets
 * @retval false La fonction a échouée (voir cResult::getLast pour plus d'informations)
 * @retval null  La fonction a échouée
 * @remarks 'sizeToByte' retourne une valeur entière en utilisant la fonction 'intval', le plafond de cette valeur est limitée par l'architecture matériel (32-bits,64-bits,etc..)
 */
function sizeToByte($size,$intVal=false) {
    $suffix_typesA = array("octets", "ko", "mo", "go", "to", "po", "zo", "yo");
    $suffix_typesB = array("octet", "kio", "mio", "gio", "tio", "pio", "zio", "yio");
    $suffix_typesC = array("o", "k", "m", "g", "t", "p", "z", "y");
    $suffix_length = count($suffix_typesA);
    
    //obtient la valeur et le suffix
    $value = trim($size);
    $suffix = "";
    if (preg_match("/([0-9.,]+)(.*)/", $size, $match)) {
        $value = trim($match[1]);
        $suffix = trim($match[2]);
    }

    if (empty($suffix)) { // pas de suffix
        return intval($value); //en octets
    }

    //parse la valeur
    if (is_nan($value = floatval($value))){
        if(function_exists('RESULT'))
            return RESULT(cResult::Failed,"INVALID_NUMBER",array("$value"=>$value));
        return NULL;
    }

    //calcule la taille en bytes
    $i = 0;
    $suffix = strtolower($suffix);
//   echo("$suffix : ");
    while (($suffix != $suffix_typesA[$i]) && ($suffix != $suffix_typesB[$i]) && ($suffix != $suffix_typesC[$i])) {
        if ($i >= $suffix_length) {
            if(function_exists('RESULT'))
                return RESULT(cResult::Failed,"UNKNOWN_SUFFIX",array("suffix"=>$suffix));
            return NULL;
        }
        $value *= 1024;
        $i++;
    }

 //   echo("$value\n");
    return ($intVal ? intval($value) : $value);
}

/**
 * @brief Test si une chaine est vide
 * @param string $str Chaine à tester
 * @return true, si la chaine n'est pas vide
 * @retval true La chaine contient des caractères autres que des caractères invisibles
 * @retval false La chaine ne contient pas de caractères visibles
 */
function empty_string($str) {
    return (trim($str) == "") ? true : false;
}

/**
 * @brief Eclate une chaine en tableau
 * @param string $str Chaine à éclater
 * @param string $sep Séparateur
 * @param bool $bTrim true, si les espaces doivent être Rognés
 * @return Tableau des éléments trouvés
 * @remarks Les éléments vides sont ignorés
 */
function strexplode($str, $sep, $bTrim) {
    $list = explode($sep, $str);
    //supprime les elements vides
    $new_list = array();
    foreach ($list as &$value) {
        if ($bTrim)
            $value = trim($value);
        if (!empty_string($value))
            array_push($new_list, $value);
    }
    return $new_list;
}

/**
 * @brief Test si une valeur est vide ou nulle. Dans ce cas, retourne la valeur de remplacement
 * @param mixed $value Valeur à tester
 * @return Valeur de remplacement
 * @remarks La fonction empty() est utilisée pour tester la valeur
 */
function nvl($value, $replacement) {
    if (empty($value))
        return $replacement;
    return $value;
}

/**
 * @brief Retourne la dernière erreur PHP (texte)
 * @return Texte de l'erreur
 */
function error_get_last_str() {
    $str = "";
    $obj = error_get_last();
    foreach ($obj as $idx => $value)
        $str .= "$idx: $value;\n";
    return $str;
}

/**
 * @brief Callback de comparaison pour la fonction de tri 'uasort'
 * @remarks Tri du plus petit nom au plus grand nom
 */
function cmp_max_strlen($a, $b) {
    if (strlen($a) == strlen($b)) {
        return 0;
    }
    return (strlen($a) < strlen($b)) ? -1 : 1;
}

/**
 * @brief Convertie dynamiquement un type d'objet
 * @param string|object $destination Objet de destination
 * @param object $sourceObject Objet source
 * @return object Objet de destination
 */
function cast($destination, $sourceObject)
{
    if (is_string($destination)) {
        $destination = new $destination();
    }
    $sourceReflection = new ReflectionObject($sourceObject);
    $destinationReflection = new ReflectionObject($destination);
    $sourceProperties = $sourceReflection->getProperties();
    foreach ($sourceProperties as $sourceProperty) {
        $sourceProperty->setAccessible(true);
        $name = $sourceProperty->getName();
        $value = $sourceProperty->getValue($sourceObject);
        if ($destinationReflection->hasProperty($name)) {
            $propDest = $destinationReflection->getProperty($name);
            $propDest->setAccessible(true);
            $propDest->setValue($destination,$value);
        } else {
            $destination->$name = $value;
        }
    }
    return $destination;
}

function objectToArray($d) {
        if (is_object($d)) {
                // Gets the properties of the given object
                // with get_object_vars function
                $d = get_object_vars($d);
        }

        if (is_array($d)) {
                /*
                * Return array converted to object
                * Using __FUNCTION__ (Magic constant)
                * for recursive call
                */
                return array_map(__FUNCTION__, $d);
        }
        else {
                // Return array
                return $d;
        }
}

function arrayToObject($d) {
        if (is_array($d)) {
                /*
                * Return array converted to object
                * Using __FUNCTION__ (Magic constant)
                * for recursive call
                */
                return (object) array_map(__FUNCTION__, $d);
        }
        else {
                // Return object
                return $d;
        }
}

function loadIntoNamespace($file, $namespace) {
    eval('<?php namespace ' . $namespace .'; ?>' . file_get_contents($file));    
}

?>
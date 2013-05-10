<?php

/*

  (C)2012 ID-INFORMATIK - WebFrameWork(R)
  Fonctions de bases

  AUTHOR: Auguey Thomas
  MAIL  : dev@aceteam.fr

  Revisions:
  [10-06-2011] Add, _stderr() et file_ext()
  [12-12-2011] Add, sizeToByte() et byteToSize()
  [06-01-2012] Add, set_fileext() et uniq_filename()
  [29-02-2012] Add, strexplode()
  [21-07-2012] Add, nvl()
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
 * @brief Inclue un dossier de fichiers PHP
 * @param string $dir Chemin d'accès
 * @return Liste des fichiers trouvés
 * @retval array Tableau des fichiers inclus (avec le chemin d'accès)
 * @remarks Inclue les fichiers portant l'extension '.php'
 */
function include_path($dir) {
    $return = array();
    // liste les fichiers...
    if ($dh = opendir($dir)) {
        $file;
        while (($file = readdir($dh)) !== false) {
            if(substr($file, 0,1) != '.' && file_ext($file) == 'php'){
                $path = path($dir,$file);
                if(is_file($path)){
                    $return[] = $path;
                    include_once($path);
                }
            }
        }
        closedir($dh);
    }
    print_r($return);
    return $return;
}

function require_path($dir, $include_func = "include_once") {
    $return = array();
    
    //s'assure que les slash sont tous du même sens (possibilité de bug avec is_file())
    $dir = str_replace( '\\','/', $dir);
    
    //s'assure que qu'aucun slash ne termine le nom de dossier
    if(substr($dir, -1) == "/")
        $dir = substr($dir, 0, strlen($dir)-1);
    
//    echo("require_path: $dir\n");
    
    // liste les fichiers...
    if ($dh = opendir($dir)) {
        $file;
        while (($file = readdir($dh)) !== false) {
            $path = $dir ."/". $file;
            if ((is_file($path)) && (substr($file, -4) == ".php")) {
 //               echo("include: $path\n");
                $return[] = require_once($path);
            }
        }
        closedir($dh);
    }

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

//Enumere les classes d'une base donnee
//Retourne : Tableau associatif des instances de classes trouvees
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

/*
  Transforme un nombre d'octet en taille avec suffix
  Arguments:
  [number] bytes_count : Nombre d'octet
  Retourne:
  [string] taille lisible
 */

function byteToSize($bytes_count) {
    $suffix = array("octets", "Ko", "Mo", "Go", "To", "Po", "Zo", "Yo");
    $i = 0;
    $suffix_length = array_length($suffix);
    while ($bytes_count >= 1024 && $i < $suffix_length) {
        $bytes_count/=1024;
        $i++;
    }
    if (!$i)
        return $bytes_count . " " . $suffix[$i];
    return number_format($bytes_count, 1) . " " . $suffix[$i];
}

/*
  Transforme une taille en nombre d'octet
  Arguments:
  [string] size : taille
  Retourne:
  [number] Nombre d'octet. Si null, 'size' est mal forme
 */

function sizeToByte($size) {
    $suffix_typesA = array("octets", "ko", "mo", "go", "to", "po", "zo", "yo");
    $suffix_typesB = array("octet", "kio", "mio", "gio", "tio", "pio", "zio", "yio");
    $suffix_typesC = array("o", "k", "m", "g", "t", "p", "z", "y");
    $suffix_length = array_length($suffix_typesA);
    //obtient la valeur et le suffix
    $value = trim($size);
    $suffix = "";
    if (preg_match("/([0-9.,]+)(.*)/", $size, $match)) {
        $value = trim($match[1]);
        $suffix = trim($match[2]);
    }

    if (empty($suffix)) { // pas de suffix
        echo("empty suffix\n");
        return intval($value); //en octets
    }

    //parse la valeur
    if (is_nan($value = floatval($value)))
        return NULL;

    //calcule la taille en bytes
    $i = 0;
    $suffix = strtolower($suffix);
    while (($suffix != $suffix_typesA[$i]) && ($suffix != $suffix_typesB[$i]) && ($suffix != $suffix_typesC[$i])) {
        if ($i >= $suffix_length) {
            echo("sizeTobyte: unknown suffix $suffix");
            return NULL;
        }
        $value *= 1024;
        $i++;
    }

    return intval($value);
}

function empty_string($str) {
    return (trim($str) == "") ? true : false;
}

function strexplode($str, $sep, $bTrim) {
    $list = explode($sep, $str);
    //supprime les elements vides
    $new_list = array();
    foreach ($list as &$value) {
        if ($bTrim)
            $value = trim($value);
        if (!empty($value))
            array_push($new_list, $value);
    }
    return $new_list;
}

//retourne $replacement si $value est vide
function nvl($value, $replacement) {
    if (empty($value))
        return $replacement;
    return $value;
}

//retourne la derniere erreur PHP sous forme de texte
function error_get_last_str() {
    $str = "";
    $obj = error_get_last();
    foreach ($obj as $idx => $value)
        $str .= "$idx: $value;\n";
    return $str;
}

//callback de comparaison pour la fonction de tri 'uasort'
//tri les cles d'un tableau du plus petit nom au plus grand
function cmp_max_strlen($a, $b) {
    if (strlen($a) == strlen($b)) {
        return 0;
    }
    return (strlen($a) < strlen($b)) ? -1 : 1;
}
/**
 * Class casting
 *
 * @param string|object $destination
 * @param object $sourceObject
 * @return object
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
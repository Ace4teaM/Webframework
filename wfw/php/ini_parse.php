<?php

require_once("base.php");
require_once("inputs/int.php");
require_once("inputs/float.php");
require_once("inputs/date.php");
require_once("inputs/datetime.php");

/**
 * @brief Parser avancée de fichier INI
 * @param string $filename Le nom du fichier de configuration à analyser
 * @param type $content Combinaison des masques suivants: INI_PARSE_UPPERCASE
 * @return array La configuration est retournée sous la forme d'un tableau associatif
 * @retval FALSE Une erreur est survenue
 * 
 * @remarks La constante ROOT_PATH doit être définit
 * 
 * @code{.ini}
 * ;; Exemple de fichier ini étendu ;;
 * 
 * ; définition d'une constante réutilisable
 * @const path = "./my_app/www"
 * 
 * ; utilisation de la constante 'path'
 * [my_section]
 * images_path    = "${path}/gfx"   ; = "./my_app/www/gfx"
 * documents_path = "${path}/doc"   ; = "./my_app/www/doc"
 * 
 * ; inclusion d'un autre fichier ini
 * @include "config/other.ini"
 */

function parse_ini_file_ex($filename,$att=INI_PARSE_UPPERCASE){
    
    // obtient le contenu du fichier
    $content = file_get_contents($filename);
    if($content === FALSE)
        return FALSE;
    
    return parse_ini_string_ex($content,dirname($filename),$att);
}

/**
 * Charge la configuration d'un fichier INI dans un tableau
 * @param type $content Contenu texte du fichier INI
 * @param type $dir     Dossier d'inclusion
 * @param type $content Combinaison des masques suivants: INI_PARSE_UPPERCASE
 * @return array Tableau associatif des sections de valeurs
 * 
 * @remarks Lors d'une inclusion (@include), parse_ini_string_ex va rechercher le fichier par rapport au dossier relatif du script. Si celui-ci reste introuvable, $dir est utilisé comme chemin de réference.
 */
define("INI_PARSE_UPPERCASE",0x1);
function parse_ini_string_ex($content,$dir=".",$att=INI_PARSE_UPPERCASE){
    
    //
    // parse les actions
    //
    $const=array();
    do{
        $continue=0;
        
        // constantes...
        if(preg_match_all('/(?:^|[\n\r]+)\s*@const\s+(\w+)\s*=\s*\"([^\"]*)\"/', $content, $const_matches))
        {
            foreach($const_matches[1] as $key=>&$value)
                $const['${'.$value.'}']=$const_matches[2][$key];
//            print_r($const);
            //supprime les lignes trouvées
            $content = str_replace($const_matches[0], "", $content);
        }
        //remplace les constantes
        $content = str_replace(array_keys($const), array_values($const), $content);

        //includes...
        $content = preg_replace_callback('/(?:^|[\n\r]+)\s*@include\s*\"([^\"]*)\"/', function($matches) use(&$continue,$dir){
            //recherche le fichier tel que définit, sinon recherche avec le chemin en cours
            $path = $matches[1];
            if(!file_exists($path)){
                $path = path($dir,$matches[1]);
            }
            if(!file_exists($path)){
                return "\n; Included file not exists: ".$matches[1]."\n";
            }
            //ok, charge le fichier
            if($content = file_get_contents($path)){
                $continue=1;//scan a nouveau avec le contenu inclus
                return "\n".$content."\n";
            }
            // impossible de lire le fichier
            return "\n; Can't include file ".$matches[1]."\n";
        }, $content);

    }while($continue);
    
/*    header("content-type: text/plain");
    echo($content);
    exit;*/
    
    //
    // parse les sections
    //
    $sections=array();
    $default=array();
    $cur_sections=&$default;//section par defaut (perdu)
    $lines = preg_split("/(\r\n|\n|\r)/", $content);
    foreach($lines as $key=>$text){
        $text = trim($text);
        if(!strlen($text) || substr($text,0,1)==';')
            continue;
        //section ?
        if(preg_match('/\[(\w+)\]/', $text, $matches)){
            $name = ($att & INI_PARSE_UPPERCASE) ? strtoupper($matches[1]) : $matches[1];
            //print_r($matches);
            if(!isset($sections[$name]))
                $sections[$name]=array();
            $cur_sections = &$sections[$name];
            continue;
        }
        //item string ?
        if(preg_match('/\s*(\w+)\s*\=\s*\"([^\"]*)/', $text, $matches)){
            $name = ($att & INI_PARSE_UPPERCASE) ? strtoupper($matches[1]) : $matches[1];
            $cur_sections[$name]=$matches[2];
            continue;
        }
        //item typé ?
        else if(preg_match('/\s*(\w+)\s*\=\s*([^\n\r\;]*)/', $text, $matches)){
            $value = trim($matches[2]);
            switch(strtolower($value)){
                case "false":
                case "no":
                    $value = FALSE;
                    break;
                case "true":
                case "yes":
                    $value = TRUE;
                    break;
                case "null":
                    $value = NULL;
                    break;
                default:
                    if(cInputInteger::isValid($value))
                        $value = cInputInteger::toObject($value);
                    else if(cInputFloat::isValid($value))
                        $value = cInputFloat::toObject($value);
                    else if(cInputDate::isValid($value))
                        $value = cInputDate::toObject($value);
                    else if(cInputDateTime::isValid($value))
                        $value = cInputDateTime::toObject($value);
                    break;
            }
            $name = ($att & INI_PARSE_UPPERCASE) ? strtoupper($matches[1]) : $matches[1];
            $cur_sections[$name] = $value;
            continue;
        }
    }
    
/*    print_r($sections);*/
    
    return $sections;
}

?>
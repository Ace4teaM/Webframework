<?php
/**
 * @brief Interface de template HTML
 * 
 * @author AUGUEY Thomas
 * 
 * @details
 * # Marqueurs
 * Les marqueurs sont remplacés par leur valeur correspondante passé en paramètre
 * 
 * Formats possibles des marqueurs
 * --------------------------------
 * - Marqueur simple
 * @code
 * $NAME
 * @endcode
 * 
 * - Marqueur de zone
 * @code
 * <!-- £:NAME --> ... <!-- £:NAME -->
 * @endcode
 */
class cHTMLTemplate{ 

    /**
     * @brief Recherche les textes délimités par les marqueurs de zones
     * 
     * @param string $string Contenu du template
     * @param int    $att    Attributs, ignoré (implémenté pour un usage future)
     * 
     * @return array Elements du templates
     * 
     * @remarks Les éléments sont retournés sous forme d'arboréscence indéxé (voir: Format d'élément)
     * 
     * @details
     * Format d'élément
     * ----------------
     * Format des éléments retournés par la fonction:
     * @code
     * array(
     *  string  name       => Nom de la zone
     *  int     begin      => Offset de début dans le contenu (avec marqueur)
     *  int     end        => Offset de fin dans le contenu (avec marqueur)
     *  int     text_begin => Offset de début dans le contenu (sans marqueur)
     *  int     text_end   => Offset de fin dans le contenu (sans marqueur)
     *  int     count      => Nombre d'éléments enfants
     *  array   #n         => Tableau sur le niéme élément enfant
     * );
     * @endcode
     * 
     * @bug Si il existe des espaces autour du caractère ':' dans un marqueur la fonction plante.
     */
    static public function findZones($string,$att=0) {
        $info = array("name"=>"_root","begin"=>0,"end"=>strlen($string),"text_begin"=>0,"text_end"=>strlen($string),"count"=>0);
        $cur = &$info;
        $parent = array(&$info);
        
        //recherche les ouvertures et fermetures de formes
        preg_match_all('/<!--\s*(\w+)\s*:\s*\£\s*-->|<!--\s*\£\s*:\s*(\w+)\s*-->/i', $string, $matches,PREG_OFFSET_CAPTURE);
 //       print_r($matches);
        //scan
        foreach($matches[0] as $key=>$data){
            $tag_cdata = $data[0];
            /*echo($tag_cdata."\n".mb_substr($tag_cdata,0,2)."\n");*/
            $tag_name = "";
            //ouverture
            if(strstr($tag_cdata,':£'))
            {
                //nom du tag
                $tag_name = $matches[1][$key][0];
                //offset de debut du tag
                $tag_offset = $data[1];
//                echo("ouverture ($tag_name)\n");
                // pousse le parent
                $parent[] =  &$cur;
                //crée le tag
                $cnt = $cur["count"]; //count($cur);
                $cur[$cnt] = array("name"=>($tag_name),"begin"=>$tag_offset,"end"=>-1,"text_begin"=>$tag_offset+strlen($tag_cdata),"text_end"=>-1,"count"=>0);
                //reference le pointeur en cours
                $cur = &$cur[$cnt];
            }
            //fermeture
            else /*if(strstr($tag_cdata,'£:'))*/
            {
                //nom du tag
                $tag_name = $matches[2][$key][0];
                //offset de fin du tag
                $tag_offset = $data[1];
                $cur["text_end"]=$tag_offset;
                $cur["end"]=$tag_offset+strlen($tag_cdata);
 //               echo("fermeture ($tag_name)\n");
                //dereference le pointeur en cours
                $cur = &$parent[count($parent)-1];
                if(!count($parent)){
                    echo("no parent found for $tag_name\n");
                    return null;
                }
                $cur["count"]++;
                //depile le parent
                array_pop($parent);
            }
            //
            if($info===null){
//                echo("null info find\n");
                return null;
            }
            //
        }
        
        return $info;
    }
    /**
     * @brief Vérifie si un paramètre est une fonction
     * @param array $fields Tableau des paramètres
     * @param mixed $key Clé du champ à analyser
     * @return bool True si le champ est une fonction, sinon false
     * @remarks isCallableParam Accepte uniquement les fonctions locales, une référence à une fonction globale échouera, ex: mail(). Ceci afin d'éviter un appel de fonction non prévue
     */
    static public function isCallableParam($fields,$key) {
        //verifie si le champs est une fonction
        //[uniquement si appelable et si la fonction n'est pas globale]
        return (is_callable($fields[$key],false,$context) && $context!=$fields[$key]); // $context == "Closure::__invoke" only
    }

    /**
     * @brief Transforme un fichier
     * @param string $filename Chemin d'accès au fichier à transformer
     * @param array  $fields Champs des données à implenter
     * @return string Texte du template transformé
     */
    static public function transformFile($filename,$fields) {
        $content = file_get_contents($filename);
        return cHTMLTemplate::transform($content,$fields);
    }
    
    /**
     * @brief Transforme un texte
     * @param string $string Texte du template à transformer
     * @param array  $fields Champs des données à implenter
     * @return string Texte du template transformé
     */
    static public function transform($string,$fields) {
        //champs globals
        if(isset($_SERVER["SCRIPT_FILENAME"]))
            $fields["_THIS_FILE"] = $_SERVER["SCRIPT_FILENAME"];
        if(isset($_SERVER["SCRIPT_NAME"]))
            $fields["_THIS_URI"]  = $_SERVER["SCRIPT_NAME"];
        
        //remplace les zones de texte
        $zones = cHTMLTemplate::findZones($string,0);
        $str = "";
        $cur = 0;
        for($i=0;$i<$zones["count"];$i++){
            $zone = $zones[$i];
            $name = $zone["name"];
            $before = substr($string,$cur,$zone["begin"]-$cur);
            $cur = $zone["end"];
            $content = substr($string,$zone["text_begin"],$zone["text_end"]-$zone["text_begin"]);
            $value = "";
            if(isset($fields[$name])){
                $value = &$fields[$name];
                //verifie si le champs est une fonction
                $callable = cHTMLTemplate::isCallableParam($fields,$name);
                $value = ($callable ? $value($content) : $value);
            }
            $str .= $before.$value;
        }
        $str .= substr($string,$cur);
        
        $string = $str;
        
        //remplace les zones de texte
        //(tester avec lookback    /(?!expression)/
        $string = preg_replace_callback('/<!--\s*(\w+)\s*:\s*\£\s*([^£]*)\s*\£\s*:\s*(\1)\s*-->/i', function($matches) use($fields){
            $name    = $matches[1];
            $content = $matches[2];
            if(isset($fields[$name])){
                $value = &$fields[$name];
                //verifie si le champs est une fonction
                $callable = cHTMLTemplate::isCallableParam($fields,$name);
                return ($callable ? $value($content) : $value);
            }
            return "";
        }, $string);

        //remplace les valeurs de champs
        foreach ($fields as $key => &$value) {
            //verifie si le champs est une fonction
            $callable = cHTMLTemplate::isCallableParam($fields,$key);
            // remplace la valeur
            $string = str_replace('$' . strtoupper($key), ($callable ? $value($string) : $value), $string);
        }
        
        return $string;
    }

}

?>
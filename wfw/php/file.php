<?php

/*
  (C)2010 WebFrameWork 1.3
  Fonctions utiles en rapport avec le systeme de fichier
    
  Revisions:
    [12-10-2011] Update tempnam_s(), utilise la fonction uniqid plutot que mt_rand
    [12-10-2011] Update tempnam_s(), renvoie uniquement le nom de fichier, pas le chemin
*/

function rcopy($src,$dst,$dirperm,$fileperm) { 
    $dir = opendir($src); 
    if(!$dir) return FALSE;
    @mkdir($dst); 
    chmod($dst,$dirperm); 
    while(false !== ( $file = readdir($dir)) ) { 
        if (( $file != '.' ) && ( $file != '..' )) { 
            if ( is_dir($src . '/' . $file) ) { 
                if(!rcopy($src . '/' . $file,$dst . '/' . $file,$dirperm,$fileperm))
			              return FALSE;
            } 
            else { 
                if(!copy($src . '/' . $file,$dst . '/' . $file))
			              return FALSE; 
                chmod($dst . '/' . $file,$fileperm); 
            } 
        } 
    } 
    closedir($dir); 
    return TRUE;
}
/*
function rrmdir($dir)
{ 
  //liste les fichiers
  $files = glob( $dir . '*', GLOB_MARK ); 
  
  foreach( $files as $file ){ 
    if( substr( $file, -1 ) == '/' ){
      rrmdir( $file ); 
    }
    else {
      unlink( $file ); 
    }
  } 
    
  if(is_dir($dir))
    rmdir( $dir ); 
    
  return TRUE;
}*/
//le dossier "$dir" et son contenu est supprimé
//rrmdir ne suit pas les liens symboliques
function rrmdir($dir, $bBaseDirRemove = true) {
    if (!is_dir($dir))
        return RESULT_OK();
    
    $objects = scandir($dir);
    foreach ($objects as $object) {
        if ($object != "." && $object != "..") {
            if (filetype($dir . "/" . $object) == "dir"){
                if(!rrmdir($dir . "/" . $object))
                    return false;
            }
            else{
                if(!@unlink($dir . "/" . $object))
                    return RESULT(cResult::System,cApplication::CantRemoveResource,error_get_last());
            }
        }
    }
    
    reset($objects);
    
    if ($bBaseDirRemove && !@rmdir($dir))
        return RESULT(cResult::System,cApplication::CantRemoveResource,error_get_last());
    
    return RESULT_OK();
}

/*
function tempnam_s($path, $suffix) 
   { 
      do 
      { 
         $file = $path."/".mt_rand().$suffix; 
         $fp = @fopen($file, 'x'); 
      } 
      while(!$fp); 

      fclose($fp); 
      return $file; 
   } 
       */

/*
  Genere un nom de fichier unique dans le dossier specifie
  
  Parametres:
    [string]  path : chemin d'acces de base au fichier (le nom de fichier sera teste dans ce dossier jusqu'a obtention d'un nom unique)                              
    [string]  suffix : suffix a ajouter en fin de nom de fichier (generalement l'extension)

  Retourne:   
    [string]  nom du fichier sans le chemin d'acces 
*/
function tempnam_s($path, $suffix) 
{ 
  while(1) 
  {  
    $file = uniqid(rand(),true).$suffix; 
    if(!file_exists($path.$file))
      return $file; 
  }
} 

/**
 *   @brief Recherche un fichier spécifique
 *
 *   @param string $path : chemin d'acces de base
 *   @param string $name : nom du fichier sans le chemin d'acces
 *   @param string $filetype : Type de fichier recherché (correspondant à la fonction filetype()) 
 *   @param string $filter : Expression régulière pour filtrer les noms de dossiers
 *
 *   @return string Chemin d'accès vers le fichier trouvé. NULL si aucun
*/
function file_find($path, $name, $filetype, $filter) 
{ 
    if ($handle = opendir($path)) {
        while (false !== ($entry = readdir($handle))) {
            $cur = $path."/".$entry;
            if ($entry == "." || $entry == "..")
                continue;
            if(!preg_match($filter, $entry))
                continue;
 //           if(is_dir($cur))
 //               echo $entry."\n";
            if(@filetype($cur)==$filetype && $entry==$name)
                return $cur;
            if(is_dir($cur)){
                $find = file_find($cur, $name, $filetype, $filter);
                if(is_string($find))
                    return $find;
            }
            //if($name == dirname($entry))
            //    return $entry;
            //if(file_find($path, $name)!==NULL)
        }
        closedir($handle);
    }

    return NULL;
} 

/**
 *   @brief Recherche des fichiers
 *
 *   @param string $path : Chemin d'acces de base
 *   @param string $name : Expression régulière des noms de fichier acceptés
 *   @param string $filetype : Type de fichier recherché (correspondant à la fonction filetype())
 *   @param string $filter : Expression régulière pour filtrer les noms de dossiers
 *   @param array &$output : Tableau des fichiers trouvés (chemins complets)
 *
 *   @return bool TRUE
*/
function file_search($path, $name, $filetype, $filter, &$output) 
{ 
    if ($handle = opendir($path)) {
        while (false !== ($entry = readdir($handle))) {
            $cur = $path."/".$entry;
            if ($entry == "." || $entry == "..")
                continue;
            if(!preg_match($filter, $entry))
                continue;
 //           if(is_dir($cur))
 //               echo $entry."\n";
            //ok ?
            if(@filetype($cur)==$filetype && preg_match($name, $entry))
                array_push($output,$cur);
            if(is_dir($cur)){
                file_search($cur, $name, $filetype, $filter, $output);
            }
        }
        closedir($handle);
    }

    return true;
} 

?>

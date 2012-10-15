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
function rrmdir($dir,$bBaseDirRemove=true) { 
	if (is_dir($dir)) { 
		$objects = scandir($dir); 
		foreach ($objects as $object) { 
			if ($object != "." && $object != "..") { 
				if (filetype($dir."/".$object) == "dir")
					rrmdir($dir."/".$object);
				else
					unlink($dir."/".$object); 
			} 
		} 
		reset($objects); 
		if($bBaseDirRemove)
			rmdir($dir); 
		return TRUE;
	} 
	return FALSE;
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

?>

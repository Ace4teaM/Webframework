<?php

/*
  (C)2011 WebFrameWork 1.3
  Fonctions utiles au programme de programmation d'execution 'cron'
    
  Revisions:
*/
include_once("string.php");   
ini_set('display_errors', 1);

/*
  Retourne le contenu du cron tab pour l'utilisateur en cours
*/
function cron_gettab()
{
  $content = "";
  exec('crontab -l', $content, $cmd_ret);
  if($cmd_ret!=0)
  {
      return $cmd_ret;
  }  
  return $content; 
}

/*
  Obtient une entree du crontab
  
    Parametres:
      [string] website    : nom du site auteur de la commande  
      [string] name       : nom de la commande
    
    Retourne:
      [array] Tableau associatif des elements de la commande (voir Remarques)
              NULL, en cas d'erreur
              FALSE, en cas d'element introuvable
       
    Remarques:
      Le tableau associatif des elements prend la forme suivante:
        action[mm]  = les minutes (de 0 à 59)         
        action[hh]  = l'heure (de 0 à 23)
        action[jj]  = le numéro du jour du mois (de 1 à 31)
        action[MMM] = le numéro du mois (de 1 à 12) ou l'abréviation du nom du mois (jan, feb, mar, apr, ...)
        action[JJJ] = l'abréviation du nom du jour ou le chiffre correspondant au jour de la semaine (0 représente le dimanche, 1 représente le lundi, ..., 7 représente le dimanche)
      Pour plus d'informations sur le format, voir la documentation officiel de 'cron'
*/
function cron_get($website,$name)
{                
  $content = cron_gettab();
  if($content==NULL)
      return NULL;
      
  foreach($content as $i=>$line)
  {        
    if(("#wfw-$website-$name"==$line) && isset($content[$i+1]))
    { 
      $action = array();
                  
      $cmd = str_explode($content[$i+1]," ",TRUE);  

      $action['mm']  = $cmd[0];
      $action['hh']  = $cmd[1];
      $action['jj']  = $cmd[2];
      $action['MMM'] = $cmd[3];
      $action['JJJ'] = $cmd[4];
      //ajoute le reste de la ligne dans la commande    
      $action['cmd'] = $cmd[5];
      $x=6;    
      while(isset($cmd[$x]))
      {
        $action['cmd'] .= " ".$cmd[$x];
        $x++;
      }   
          
      return $action;
    }
  }
  return FASLE;
}

/*
  Definit une entree du crontab
  
    Parametres:
      [string] website    : nom du site auteur de la commande  
      [string] name       : nom de la commande
      [array]  action     : tableau associatif des elements de la commande a inserer
    
    Retourne:
      [array] Tableau associatif des elements de la commande (voir Remarques 'cron_get')
*/   
function cron_set($website,$name,$action)
{
  $find = FALSE;
  $new_line = NULL;
  //la ligne a inserer
  if($action!==NULL)
    $new_line = $action['mm']." ".$action['hh']." ".$action['jj']." ".$action['MMM']." ".$action['JJJ']." ".$action['cmd'];    

  //recherche la ligne dans le fichier existant                     
  $content = cron_gettab();
  if($content!==NULL)
  {
    foreach($content as $i=>$line)
    {        
      if(("#wfw-$website-$name"==$line) && isset($content[$i+1]))
      {
        //supprime ?
        if($action===NULL)
        {              
          unset($content[$i],$content[$i+1]);
        }
        //modifie
        else 
          $content[$i+1] = $new_line;
          
        $find = TRUE;
        break;
        break;
      }
    }
  }
  //sinon nouveau
  else
  {
    //nouveau contenu
    $content = array();
  }

  //l'element a supprimer n'existe pas
  if(!$find && ($action===NULL))
    return TRUE;     
  //ajoute lal ligne si besoin
  if(!$find && ($action!==NULL))
      array_push($content,"#wfw-$website-$name",$new_line);
    
  //ecrit le contenu dans un fichier temporaire
  $tmpfname = tempnam("/tmp", rand());
	$handle = fopen($tmpfname, "w");
	if($handle===FALSE)    
    return FALSE;
  fwrite($handle, implode("\n", $content)."\n");//cron requiere une nouvelle ligne en fin de fichier
  fclose($handle);
  chmod($tmpfname,0644);

	//soumet le fichier a crontab
  exec("crontab $tmpfname", $exec_content, $cmd_ret);
  
  //supprime le fichier temporaire  
  unlink($tmpfname);

  //erreur ?
  if($cmd_ret!=0)
      return $cmd_ret;

  return TRUE; 
}
/*  
$action = array();
      $action['mm']  = "0";
      $action['hh']  = "0";
      $action['jj']  = "*";
      $action['MMM'] = "*";
      $action['JJJ'] = "*"; 
      $action['cmd'] = "kikigfgh";

if(FALSE===cron_set("aceteam","test",NULL)) 
   echo("err");  */
?>

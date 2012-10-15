<?php
/*
	(C)2011-2012 ID-Informatik, WebFrameWork(R). All rights reserved.
	Ajoute un module a la configuration d'un site
  
	Arguments:
		module       : nom du module
		site_path    : chemin d'acces absolue au site

	Retourne:
		result  : resultat de la requete.

	Revisions:
		[29-10-2011] Debug, verifie l'existance des noeuds avant utilisation
		[20-12-2011] Update 'ROOT_PATH'
		[30-01-2012] Update, Remplace l'utilisation de la classe DefaultFile par cXMLDefault
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../")); //racine du site
include(ROOT_PATH.'/php/base.php');
include_path(ROOT_PATH.'/php/');
include_path(ROOT_PATH.'/php/class/bases/');
include_path(ROOT_PATH.'/php/inputs/');

//
// verifie les champs
//
rcheck(
  //requis
  array('module'=>'cInputIdentifier','site_path'=>''),
  //optionnels
  null
);
                                     
$module_name  = $_REQUEST["module"];
$site_root = $_REQUEST["site_path"];
$config_root  = ROOT_PATH."/modules/$module_name/private/config/";

$in_out = array(
    "$site_root/default.xml"=>"$config_root/default.xml",
    "$site_root/private/default.xml"=>"$config_root/private_default.xml",
);  

foreach($in_out as $out=>$in)
{
    //charge les fichier de configuration 
	$outFile = new cXMLDefault();
	$inFile = new cXMLDefault();
	if(@$inFile->Initialise($in) && @$outFile->Initialise($out))
    {
		$in_cfg_node    = $inFile->getConfigNode("module",$module_name);
		$in_widget_node = $inFile->getConfigNode("widget",$module_name);
		$in_index_node  = $inFile->doc->getNode("site/index");
		$in_tree_node   = $inFile->doc->getNode("site/tree");
    
		$out_cfg_node   = $outFile->doc->getNode("site/config",TRUE);
		$out_tree_node  = $outFile->doc->getNode("site/tree",TRUE);     
		$out_index_node = $outFile->doc->getNode("site/index",TRUE);
        
        //initialise dans "config/widget"                        
		if($in_widget_node!=NULL)
        {
            //importe le noeud
			$in_widget_node = $outFile->doc->importNode($in_widget_node,TRUE);
            // insert
            $cur_out = $outFile->getConfigNode("widget",$module_name);     
            if($cur_out)
                $out_cfg_node->replaceChild($in_widget_node,$cur_out);
            else    
                $out_cfg_node->appendChild($in_widget_node);         
        }                   
         
        //initialise dans "config/module"                        
		if($in_cfg_node!=NULL)
        {
            //importe le noeud
			$in_cfg_node = $outFile->doc->importNode($in_cfg_node,TRUE);
            // insert
            $cur_out = $outFile->getConfigNode("module",$module_name);     
            if($cur_out)
                $out_cfg_node->replaceChild($in_cfg_node,$cur_out);
            else    
                $out_cfg_node->appendChild($in_cfg_node);         
        }                   
         
        //initialise dans "index"                         
		if($in_index_node!=NULL)
		{                       
			$cur = $inFile->doc->getChild($in_index_node);
			while($cur)
			{       
				//importe le noeud
				$import = $outFile->doc->importNode($cur,TRUE);  
				// insert                                      
				$cur_out = $outFile->getIndexNode($cur->tagName,$cur->getAttribute("id"));
				if($cur_out)
					$out_index_node->replaceChild($import,$cur_out);   
				else
					$out_index_node->appendChild($import); 
				//suivant                            
				$cur = $inFile->doc->getNext($cur,NULL); 
			}                   
		}
        //initialise dans "tree" 
		if($in_tree_node!=NULL)
		{                         
			$cur = $inFile->doc->getChild($in_tree_node);
			while($cur)
			{            
				//importe le noeud
				$import = $outFile->doc->importNode($cur,TRUE);
				// insert                                        
				$cur_out = $outFile->getTreeNode($cur->tagName);
				if($cur_out)
					$cur_out->parentNode->replaceChild($import,$cur_out);   
				else
					$out_tree_node->appendChild($import);  
				//suivant                                                     
				$cur = $inFile->doc->getNext($cur,NULL);    
			}        
		} 
        //sauvegarde  
		if(!$outFile->doc->save($out)){
          rpost_result(ERR_FAILED, "can't save default file: ".$out);
        }
    }
}       
//
rpost_result(ERR_OK);
?>
<?php
/*

	WebFrameWork, v1.3 - Fonctions de bases
	base.php
	(C)2007-2008 Avalanche, Tout droits reserver
	PHP Code

	AUTHOR: Auguey Thomas
	MAIL  : admin@aceteam.fr

*/

function load_default($file_name,$name,$id)
{
  $id=strtolower($d);
  //charge le fichier
  $input = new XMLDocument();
  if(!$input->load($file_name)){
      return "";
  }
  //recherche le noeud
  $node = $input->getNode("site/index/$name");
  while($node!=NULL)
  {
    if(strtolower($node->getAttribute("id")) == $id)
      return $node->nodeValue;
  }
  return "";
}

?>

<?php
/*

	WebFrameWork, v1.3 - Classe de base pour le formatage et la verification de données
	input.php
	(C)2007-2008 Avalanche, Tout droits reserver
	PHP Code
	
	AUTHOR: Auguey Thomas
	MAIL  : augueyace@wanadoo.fr

Methodes:
	::isValid
	::toHTML
	::getMaxLength

*/

class cInput
{
	//verifie la validiter du format
	//retourne: code d'erreur ( 1(ERR_OK) si valide )
	public static function isValid($value){
		return 1;
	}
	//
	public static function toHTML($id,$value){
		return "";
	}
	//
	public static function getMaxLength(){
		return 0;
	}
}

?>

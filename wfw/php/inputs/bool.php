<?php
/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2008-2007, 2012-2014 Thomas AUGUEY <contact@aceteam.org>
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

require_once("class/bases/input.php");
require_once("string.php");
require_once("base.php");

/**
 * @brief Test une valeur booleen
 */
class cInputBool extends cInput
{
    //--------------------------------------------------------
    // Méthodes héritées
    // @class cInputBool
    //--------------------------------------------------------
    
    /**
     * @brief Test la validité d'une chaine
     * @return [RESULT] Résultat du test 
    */
    public static function isValid($value){
		  if( empty_string($value) )
           return RESULT(cResult::Failed,cInput::EmptyText);
		
		  // carateres valides
		  switch(strtolower($value)){
			  case "0":
			  case "1":
			  case "yes":
			  case "no":
			  case "on":
			  case "off":
			  case "true":
			  case "false":
             return RESULT_OK();
		  }

      return RESULT(cResult::Failed,cInput::InvalidChar);
	}

    /**
     * @brief Obtient l'expression régulière 
     * @return [string] Expression régulière 
    */
	public static function regExp(){
		return 'on|off|0|1|yes|no|true|false';
	}
    /**
     * @brief Obtient la longueur maximale possible de la chaine 
     * @return [int] Longueur maximale de la chaine 
    */
	public static function getMaxLength(){
		return 128;
	}
    /**
     * @brief Convertie la chaine en objet PHP
     * @return [bool] valeur
    */
	public static function toObject($value){
		return cInputBool::toBool($value);
	}

    //--------------------------------------------------------
    // Méthodes spécifiques
    // @class cInputBool
    //--------------------------------------------------------
    
    /**
     * @brief Convertie la chaine en booléen
     * @return [bool] valeur
    */
	public static function toBool($value){
		switch(strtolower($value)){
			case "1":
			case "yes":
			case "on":
			case "true":
				return true;
		}
		return false;
	}
       
    /**
     * @brief Convertie la chaine en booléen
     * @param $value [string] Valeur 
     * @return [bool] valeur
    */ 
    public static function toString($value){
        return ($value ? "true" : "false");
	}
}

?>
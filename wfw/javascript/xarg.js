/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2013 Thomas AUGUEY <contact@aceteam.org>
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


/**
    @brief Définition des caracteres d'encodage
*/
//code
var XARG_START_OF_TEXT_CODE = 0x02;
var XARG_END_OF_TEXT_CODE   = 0x03;
//char
var XARG_START_OF_TEXT_CHAR = String.fromCharCode(0x2);
var XARG_END_OF_TEXT_CHAR   = String.fromCharCode(0x3);
//uri encoded char
var XARG_START_OF_TEXT_URI  = "%02";
var XARG_END_OF_TEXT_URI    = "%03";


/**
    @brief Décode un format texte XARG en tableau associatif 
*/
function xarg_to_object(text,bencoded)
{
    if(typeof(text)!='string'){
        if(typeof RESULT == "function")
            return RESULT("ERR_FAILED","INVALID_ARGUMENT",{arg:"obj"});
        return false;
    }

    var rslt = new Object();
    var begin_pos = 0;
    var pos;
    var separator = XARG_START_OF_TEXT_CHAR;
    var end       = XARG_END_OF_TEXT_CHAR;

    if(bencoded){
        separator = XARG_START_OF_TEXT_URI;//STX
        end       = XARG_END_OF_TEXT_URI;//ETX
    }

    while((pos=text.indexOf(separator,begin_pos)) != -1)
    {
        var pos2  = text.indexOf(end,pos);
        if(pos2 == -1){ // fin anticipe
            console.log("wfw.xarg.to_object(), attention: fin anormale de requete!");
            return rslt;
        }

        //alert(begin_pos+"->"+pos+"\n"+pos+"->"+pos2);

        var name  = text.substr(begin_pos,pos-begin_pos);
        var value = text.substr(pos+separator.length,pos2-(pos+separator.length));

        begin_pos = pos2+end.length; //prochaine position de depart

        rslt[name]=value;
    }
    return rslt;
}

/**
    @brief Encode un tableau associatif au format texte XARG
    @param object $obj    Tableau associatif des arguments 
    @param bool $bencode  true si le texte "text" est encodé au format d'une URI
    @return Texte au format XARG
    @retval false Une erreur s'est produite voir cResult::getLast()
*/
function xarg_to_string(obj,bencode)
{
    if(typeof(obj)!='object'){
        if(typeof RESULT == "function")
            return RESULT("ERR_FAILED","INVALID_ARGUMENT",{arg:"obj"});
        return false;
    }

    var text = "";
    for(var i in obj){
        text += (""+i+XARG_START_OF_TEXT_CHAR+obj[i]+XARG_END_OF_TEXT_CHAR);
    }

    if(bencode==true && (text=uri_encodeUTF8(text))==false)
        return false;

    if(typeof bencode=="function" && (text=bencode.call(text))==false)
        return false;

    return text;
}

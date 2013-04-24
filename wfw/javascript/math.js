/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2012,2013 Thomas AUGUEY <contact@aceteam.org>
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
 * @file
 * Fonctions utiles aux mathematiques
 */

/**
 * @fn int math_hex_char_to_int(string hc)
 * @memberof window
 * 
 * @brief Converti un caractère hexadécimal (0-F) en entier numerique
 * 
 * @param hc Le caractère hexadécimal
 * @return Equivalent décimale
*/
function math_hex_char_to_int(hc) {
    switch(hc){
        case '0':
            return 0;
        case '1':
            return 1;
        case '2':
            return 2;
        case '3':
            return 3;
        case '4':
            return 4;
        case '5':
            return 5;
        case '6':
            return 6;
        case '7':
            return 7;
        case '8':
            return 8;
        case '9':
            return 9;
        case 'A':
            return 10;
        case 'B':
            return 11;
        case 'C':
            return 12;
        case 'D':
            return 13;
        case 'E':
            return 14;
        case 'F':
            return 15;
        case 'a':
            return 10;
        case 'b':
            return 11;
        case 'c':
            return 12;
        case 'd':
            return 13;
        case 'e':
            return 14;
        case 'f':
            return 15;
    }
    return null;
}

/**
 * @fn int math_hex2_to_int(string hex)
 * @memberof window
 * 
 * @brief Converti un nombre hexadecimale (2 caractères) en entier
 * 
 * @param hex Les caractères hexadécimal
 * @return Equivalent décimale
*/
function math_hex2_to_int(hex) {
    var i1 = math_hex_char_to_int(hex.substr(0,1));
    var i2 = math_hex_char_to_int(hex.substr(1,1));

    return i2 + (i1*16);
}

/**
 * @fn int math_hex3_to_int(string hex)
 * @memberof window
 * 
 * @brief Converti un nombre hexadecimale (3 caractères) en entier
 * 
 * @param hex Les caractères hexadécimal
 * @return Equivalent décimale
*/
function math_hex3_to_int(hex) {
    var i1 = math_hex_char_to_int(hex.substr(0,1));
    var i2 = math_hex_char_to_int(hex.substr(1,1));
    var i3 = math_hex_char_to_int(hex.substr(2,1));

    return i3 + (i2*256) + (i1*16);
}

/**
 * @fn int math_hex4_to_int(string hex)
 * @memberof window
 * 
 * @brief Converti un nombre hexadecimale (4 caractères) en entier
 * 
 * @param hex Les caractères hexadécimal
 * @return Equivalent décimale
*/
function math_hex4_to_int(hex) {
    var i1 = math_hex_char_to_int(hex.substr(0,1));
    var i2 = math_hex_char_to_int(hex.substr(1,1));
    var i3 = math_hex_char_to_int(hex.substr(2,1));
    var i4 = math_hex_char_to_int(hex.substr(3,1));

    return i4 + (i3*4069) + (i2*256) + (i1*16);
}

/**
 * @fn int math_hex_to_int(string hex)
 * @memberof window
 * 
 * @brief Converti un nombre hexadecimale (texte) en entier numerique
 * 
 * @param hex Les caractères hexadécimal
 * @return Equivalent décimale
*/
function math_hex_to_int(hex) {
    var hex_length = hex.length;
    var integer = 0;
    var i=0;
    while(hex_length--){
        var hex_int = math_hex_char_to_int(hex.substr(i,1));
        //  alert(hex_length+":"+hex.substr(hex_length,1)+"="+hex_int);
        if(hex_length==0)
            integer += hex_int;
        else
            integer += (hex_int*Math.pow(2,4*hex_length)); //hex_int*(2^nbits) - (2^nbits) = 16(2^4), 256(2^8), 4096(2^12), 65536(2^16),...
        //  alert(integer);
        i++;
    }
    return integer;
}

/**
 * @fn string math_int_to_hex_char(int i)
 * @memberof window
 * 
 * @brief Converti un entier numerique en caractère hexadecimale
 * 
 * @param i Entier numérique entre 0 et 15
 * @return Equivalent hexadécimal
*/
function math_int_to_hex_char(i) {
    switch(parseInt(i)){
        case 0:
            return 0;
        case 1:
            return 1;
        case 2:
            return 2;
        case 3:
            return 3;
        case 4:
            return 4;
        case 5:
            return 5;
        case 6:
            return 6;
        case 7:
            return 7;
        case 8:
            return 8;
        case 9:
            return 9;
        case 10:
            return 'A';
        case 11:
            return 'B';
        case 12:
            return 'C';
        case 13:
            return 'D';
        case 14:
            return 'E';
        case 15:
            return 'F';
    }
    return null;
}

/**
 * @fn string math_int32_to_hex(int num)
 * @memberof window
 * 
 * @brief Converti un entier numérique en caractères hexadecimales
 * @remarks La valeur de sortie est aligné sur 32bits avec des zeros à gauche
 * @remarks La valeur est retournée sans préfix (e: '0x')
 * 
 * @param i Entier numérique
 * @return Equivalent hexadécimal
 * 
 * ## Exemple
 * @code{.js}
 * alert( math_int32_to_hex(15) ); // print '000F'
 * @endcode
*/
function math_int32_to_hex(num) {
    return zerolead(num.toString(16), 4).toUpperCase();
}

/**
 * @fn string math_char_to_hex(int num)
 * @memberof window
 * 
 * @brief Converti un entier numerique en caractères hexadecimales
 * @remarks La valeur de sortie est aligné sur 8bits avec des zeros à gauche
 * @remarks La valeur est retournée sans préfix (e: '0x')
 * 
 * @param i Entier numérique
 * @return Equivalent hexadécimal
 * 
 * ## Exemple
 * @code{.js}
 * alert( math_int32_to_hex(15) ); // print '0F'
 * @endcode
*/
function math_char_to_hex(num) {
    return zerolead(num.toString(16), 2).toUpperCase();
}

//converti un nombre entier (32bits) en chaine hexadecimale
/*function math_int32_to_hex(num) { 
            var _4096=0;
            var _256=0;
            var _16=0;
            var div;
            //combien de multiple de 4096
            div = parseInt(num / 4096);
            if(div){
                num = num - (div * 4096);
                _4096 = div;
            }
            //combien de multiple de 256
            div = parseInt(num / 256);
            if(div){
                num = num - (div * 256);
                _256 = div;
            }
            //combien de multiple de 16
            div = parseInt(num / 16);
            if(div){
                num = num - (div * 16);
                _16 = div;
            }
            //rest
            return ( (_4096 ? math_int_to_hex_char(_4096) : "") + (_256 ? math_int_to_hex_char(_256) : "") + (_16 ? math_int_to_hex_char(_16) : "") + math_int_to_hex_char(num) );
        }*/

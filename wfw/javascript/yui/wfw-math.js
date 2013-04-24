/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    Mathematiques

    JS  Dependences: base.js
    YUI Dependences: base, node

    Implementation: [11-10-2012]
*/

YUI.add('wfw-math', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class Math
     * @memberof wfw
     * @brief Fonctions mathématiques
     * */
    wfw.Math = {
        /** @copydoc math_hex_char_to_int */
        hexCharToInt : math_hex_char_to_int,
        hex_char_to_int : math_hex_char_to_int,
	    
        /** @copydoc math_hex2_to_int */
        hex2ToInt : math_hex2_to_int,
        hex2_to_int : math_hex2_to_int,
	    
        /** @copydoc math_hex3_to_int */
        hex3ToInt : math_hex3_to_int,
        hex3_to_int : math_hex3_to_int,
	    
        /** @copydoc math_hex4_to_int */
        hex4ToInt : math_hex4_to_int,
        hex4_to_int : math_hex4_to_int,
	
        /** @copydoc math_hex_to_int */
        hexToInt : math_hex_to_int,
        hex_to_int : math_hex_to_int,
	    
        /** @copydoc math_int_to_hex_char */
        intToHexChar : math_int_to_hex_char,
        int_to_hex_char : math_int_to_hex_char,
        
        /** @copydoc math_int32_to_hex */
        int32ToHex : math_int32_to_hex,
        int32_to_hex : math_int32_to_hex,
        
        /** @copydoc math_char_to_hex */
        charToHex : math_char_to_hex,
        char_to_hex : math_char_to_hex
        
        /** @copydoc math_int32_to_hex */
        /*int32_to_hex :  math_int32_to_hex*/

    };
}, '1.0', {
    requires:['base']
});

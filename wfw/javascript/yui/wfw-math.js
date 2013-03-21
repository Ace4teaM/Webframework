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
        //converti un caractere hexadecimale (0-F) en entier numerique
        hex_char_to_int : function(hc) {
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
        },
	    
        //converti un nombre hexadecimale (2 caracteres) en entier
        hex2_to_int : function(hex) {
            var i1 = this.hex_char_to_int(hex.substr(0,1));
            var i2 = this.hex_char_to_int(hex.substr(1,1));
	
            return i2 + (i1*16);
        },
	    
        //converti un nombre hexadecimale (3 caracteres) en entier
        hex3_to_int : function(hex) {
            var i1 = this.hex_char_to_int(hex.substr(0,1));
            var i2 = this.hex_char_to_int(hex.substr(1,1));
            var i3 = this.hex_char_to_int(hex.substr(2,1));
	
            return i3 + (i2*256) + (i1*16);
        },
	    
        //converti un nombre hexadecimale (4 caracteres) en entier
        hex4_to_int : function(hex) {
            var i1 = this.hex_char_to_int(hex.substr(0,1));
            var i2 = this.hex_char_to_int(hex.substr(1,1));
            var i3 = this.hex_char_to_int(hex.substr(2,1));
            var i4 = this.hex_char_to_int(hex.substr(3,1));
	
            return i4 + (i3*4069) + (i2*256) + (i1*16);
        },
	
        //converti un nombre hexadecimale (texte) en entier numerique
        hex_to_int : function(hex) {
            var hex_length = hex.length;
            var integer = 0;
            var i=0;
            while(hex_length--){
                var hex_int = this.hex_char_to_int(hex.substr(i,1));
                //  alert(hex_length+":"+hex.substr(hex_length,1)+"="+hex_int);
                if(hex_length==0)
                    integer += hex_int;
                else
                    integer += (hex_int*Math.pow(2,4*hex_length)); //hex_int*(2^nbits) - (2^nbits) = 16(2^4), 256(2^8), 4096(2^12), 65536(2^16),...
                //  alert(integer);
                i++;
            }
            return integer;
        },
	    
        //converti un entier numerique en caractere hexadecimale (0-15)
        int_to_hex_char : function(i) {
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
        },
        int32_to_hex : function(num) {
            return zerolead(num.toString(16), 4).toUpperCase();
        },
        char_to_hex : function(num) {
            return zerolead(num.toString(16), 2).toUpperCase();
        }
    //converti un nombre entier (32bits) en chaine hexadecimale
    /*int32_to_hex : function(num) { 
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
	        return ( (_4096 ? this.int_to_hex_char(_4096) : "") + (_256 ? this.int_to_hex_char(_256) : "") + (_16 ? this.int_to_hex_char(_16) : "") + this.int_to_hex_char(num) );
	    }*/

    };
}, '1.0', {
    requires:['base']
});

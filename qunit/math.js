
module( "Math" );
    
/* Convertions */
test( "Convertions" , function() {
    equal( math_hex_char_to_int("F"), 15, "math_hex_char_to_int" );
    equal( math_hex2_to_int("FF"), 255, "math_hex2_to_int" );
    equal( math_hex3_to_int("FFF"), 4095, "math_hex3_to_int" );
    equal( math_hex4_to_int("FFFF"), 65535, "math_hex4_to_int" );
    equal( math_hex_to_int("145DEF"), 1334767, "math_hex_to_int" );
    equal( math_int_to_hex_char(15), "F", "math_int_to_hex_char" );
    equal( math_int32_to_hex(15), "000F", "math_int32_to_hex" );
    equal( math_char_to_hex(15), "0F", "math_char_to_hex" );
});

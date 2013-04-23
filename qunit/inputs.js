
/* cInputInteger */
test( "cInputBool" , function() {
    equal( cInputBool.isValid("1"), true, "1" );
    equal( cInputBool.isValid("0"), true, "0" );
    equal( cInputBool.isValid("TRUE"), true, "TRUE" );
    equal( cInputBool.isValid("false"), true, "FALSE" );
    equal( cInputBool.isValid("yes"), true, "YES" );
    equal( cInputBool.isValid("no"), true, "NO" );
});

/* cInputInteger */
test( "cInputInteger" , function() {
    equal( cInputInteger.isValid("2013"), true, "Number" );
    equal( cInputInteger.isValid("0"), true, "Zero" );
    equal( cInputInteger.isValid("-456"), true, "Negative" );
//    equal( cInputInteger.isValid(null), false, "Not NULL" );
    equal( cInputInteger.isValid(""), false, "Not empty" );
    equal( cInputInteger.isValid("456.0"), false, "Not integer" );
    equal( cInputInteger.isValid("5456454444444444444444444444440"), false, "Not Big" );
});

/* cInputDate */
test( "cInputDate" , function() {
    equal( cInputDate.isValid("2013-01-05"), true, "Format YYYY-MM-DD" );
    equal( cInputDate.isValid("12-12-2029"), true, "Format DD-MM-YYYY" );
});
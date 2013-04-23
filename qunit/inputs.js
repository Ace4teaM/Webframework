
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
    equal( cInputInteger.isValid(""), false, "Not empty" );
    equal( cInputInteger.isValid("456.0"), false, "Not integer" );
    equal( cInputInteger.isValid("5456454444444444444444444444440"), false, "Not Big" );
});

/* cInputFloat */
test( "cInputFloat" , function() {
    equal( cInputFloat.isValid("2013.0"), true, "Number" );
    equal( cInputFloat.isValid("0.0"), true, "Zero" );
    equal( cInputFloat.isValid("-456.0"), true, "Negative" );
    equal( cInputFloat.isValid("456"), true, "Integer" );
    equal( cInputFloat.isValid(""), false, "Not empty" );
});

/* cInputFactor */
test( "cInputFactor" , function() {
    equal( cInputFactor.isValid("1"), true, "One" );
    equal( cInputFactor.isValid("1.0"), true, "One" );
    equal( cInputFactor.isValid("0.0"), true, "Zero" );
    equal( cInputFactor.isValid("1"), true, "One" );
    equal( cInputFactor.isValid("-1.0"), false, "Negative" );
    equal( cInputFactor.isValid(""), false, "Not empty" );
});

/* cInputDate */
test( "cInputDate" , function() {
    equal( cInputDate.isValid("2013-01-05"), true, "Format YYYY-MM-DD" );
    equal( cInputDate.isValid("12-12-2029"), true, "Format DD-MM-YYYY" );
});

/* cInputIdentifier */
test( "cInputIdentifier" , function() {
    equal( cInputIdentifier.isValid("stack"), true, "Simple" );
    equal( cInputIdentifier.isValid("stack_house"), true, "Underscore" );
    equal( cInputIdentifier.isValid("stack-house"), false, "Not -" );
    equal( cInputIdentifier.isValid("stack house"), false, "Not space" );
    equal( cInputIdentifier.isValid("1One"), false, "Not begin by number" );
});

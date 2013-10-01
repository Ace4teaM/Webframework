
module( "Inputs" );
    
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
    equal( cInputFloat.isValid("2013.0"), true, "Number with point" );
    equal( cInputFloat.isValid("2013,45"), true, "Number with comma" );
    equal( cInputFloat.isValid("0.0"), true, "Zero" );
    equal( cInputFloat.isValid("-456.0"), true, "Negative" );
    equal( cInputFloat.isValid("456"), true, "Integer" );
    equal( cInputFloat.isValid(""), false, "Not empty" );
    equal( cInputFloat.isValid("123.456.14"), false, "Not multiple points" );
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

/* cInputDateTime */
test( "cInputDateTime" , function() {
    equal( cInputDateTime.isValid("2013-01-05 14:40:20"), true, "Format YYYY-MM-DD HH:MM:SS" );
    equal( cInputDateTime.isValid("12-12-2029 14:40:20"), true, "Format DD-MM-YYYY HH:MM:SS" );
    equal( cInputDateTime.isValid("12 12 2029 14 40 20"), true, "With spaces" );
    equal( cInputDateTime.isValid("identifier"), false, "Invalid format" );
});

/* cInputIdentifier */
test( "cInputIdentifier" , function() {
    equal( cInputIdentifier.isValid("stack"), true, "Simple" );
    equal( cInputIdentifier.isValid("stack_house"), true, "Underscore" );
    equal( cInputIdentifier.isValid("stack-house"), false, "Not -" );
    equal( cInputIdentifier.isValid("stack house"), false, "Not space" );
    equal( cInputIdentifier.isValid("1One"), false, "Not begin by number" );
});

/* cInputMail */
test( "cInputMail" , function() {
    equal( cInputMail.isValid("foo@bar.com"), true, "Simple" );
    equal( cInputMail.isValid("foo.foo@bar.com"), true, "Sub Domain" );
    equal( cInputMail.isValid("foo@bar"), true, "Without extension" );
    equal( cInputMail.isValid("foo@"), false, "Not empty domain" );
    equal( cInputMail.isValid("@foo"), false, "Not empty name" );
    equal( cInputMail.isValid("bar..foo@foo"), false, "Not double point" );
});

/* cInputUNIXFileName */
test( "cInputUNIXFileName" , function() {
    equal( cInputUNIXFileName.isValid("setup.exe"), true, "Simple" );
    equal( cInputUNIXFileName.isValid("doxygen-1.8.3.1-setup.exe"), true, "Complex" );
    equal( cInputUNIXFileName.isValid("../setup.exe"), false, "Not return path" );
    equal( cInputUNIXFileName.isValid("base/setup.exe"), false, "Not path" );
});


/* cInputWindowsFileName */
test( "cInputWindowsFileName" , function() {
    equal( cInputWindowsFileName.isValid("setup.exe"), true, "Simple" );
    equal( cInputWindowsFileName.isValid("doxygen-1.8.3.1-setup.exe"), true, "Complex" );
    equal( cInputWindowsFileName.isValid("..\\setup.exe"), false, "Not return path" );
    equal( cInputWindowsFileName.isValid("base\\setup.exe"), false, "Not path" );
});

/* cInputIPv4 */
test( "cInputIPv4" , function() {
    equal( cInputIPv4.isValid("0.0.0.0"), true, "Simple" );
    equal( cInputIPv4.isValid("192.168.1.1"), true, "Simple" );
    equal( cInputIPv4.isValid("192.168.1.100"), true, "Simple" );
    equal( cInputIPv4.isValid("192.168.1.199"), true, "Simple" );
    equal( cInputIPv4.isValid("192.168.1.249"), true, "Simple" );
    equal( cInputIPv4.isValid("192.168.1.255"), true, "Simple" );
    equal( cInputIPv4.isValid("255.255.255.255"), true, "Simple" );
    equal( cInputIPv4.isValid("255.255.999.255"), false, "Not Invalid Number Range" );
    equal( cInputIPv4.isValid("192.168.1"), false, "Not Uncomplete" );
    equal( cInputIPv4.isValid("192.168.1.x"), false, "Not Non Number" );
});


/* cInputName */
test( "cInputName" , function() {
    equal( cInputName.isValid("setup.exe"), true, "Simple" );
    equal( cInputName.isValid("doxygen_1.8.3.1-setup.exe"), true, "Complex" );
    equal( cInputName.isValid("setup$1.exe"), false, "Not Special Char" );
    equal( cInputName.isValid("setup 1.exe"), false, "Not Spacing Char" );
});

/* cInputNumeric */
test( "cInputNumeric" , function() {
    equal( cInputNumeric.isValid("12"), true, "Integer" );
    equal( cInputNumeric.isValid("3.1"), true, "Float" );
});

/* cInputPassword */
test( "cInputPassword" , function() {
    equal( cInputPassword.isValid("azerty"), true, "Minimal" );
    equal( cInputPassword.isValid("-------------"), true, "Repetitive" );
    equal( cInputPassword.isValid("@titi-lolo"), true, "Exemple" );
    equal( cInputPassword.isValid("azAZ09_-@#&+~"), true, "Specials chars" );
    equal( cInputPassword.isValid("12"), false, "Not To Small" );
});

/* cInputString */
test( "cInputString" , function() {
    equal( cInputString.isValid("azerty"), true, "Minimal" );
    equal( cInputString.isValid("Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression."), true, "Specials chars" );
    equal( cInputString.isValid("Hello \"World\""), false, "Not double comma" );
    equal( cInputString.isValid("Hello \n World"), false, "Not line feed" );
    equal( cInputString.isValid("Hello \r World"), false, "Not carriage return" );
});

/* cInputText */
test( "cInputText" , function() {
    equal( cInputText.isValid("Le Lorem \n\r Ipsum est \"simplement\" du faux texte employé dans la composition et la mise en page avant impression."), true, "Accept all chars" );
});

/* cInputURL */
test( "cInputURL" , function() {
    equal( cInputURL.isValid("google.fr"), true, "Simple" );
    equal( cInputURL.isValid("www.google.fr"), true, "Simple" );
    equal( cInputURL.isValid("http://www.google.fr"), true, "Simple" );
    equal( cInputURL.isValid("http://google.fr"), true, "Simple" );
    equal( cInputURL.isValid("http://www.google.fr?a=b"), true, "Simple" );
    equal( cInputURL.isValid("http://www.google.fr?a=b&b=c"), true, "Simple" );
    equal( cInputURL.isValid("http://www.google.fr?a=b&b=c#titi"), true, "Simple" );
    equal( cInputURL.isValid("http://www.google.fr#titi"), true, "Simple" );
    //equal( cInputURL.isValid("https://www.google.fr/webhp?source=searchapp#hl=fr&gsrn=11&gsri=psy-ab&tok=DJ3PqQ3S3DzU4t0230ADEQ&cp=4&gsid=e&xhr=t&q=actualit%C3%A9&esnrs=true&pf=p&output=search&sclient=psy-ab&oq=actu&gsl=&pbx=1&bav=on.2,or.rcp.rqf.&bvm=bv.45580626,d.d2k&fp=35b5c03ba0c6d3fa&biw=1680&bih=989"), true, "Complex" );
});


module( "URI" );
    
/* Convertions */
test( "URI" , function() {
    var uri;
    
    uri = "test.html";
    deepEqual( uri_cut(uri), {
        addr: uri, 
        scheme: "", 
        authority: "test.html", 
        path: "", 
        query: "", 
        fragment: ""}, "uri_cut" );
    
    uri = "test.html?param=hello";
    deepEqual( uri_cut(uri), {
        addr: uri, 
        scheme: "", 
        authority: "test.html", 
        path: "", 
        query: "param=hello", 
        fragment: ""}, "uri_cut" );
    
    uri = "test.html?param=hello#test";
    deepEqual( uri_cut(uri), {
        addr: uri, 
        scheme: "", 
        authority: "test.html", 
        path: "", 
        query: "param=hello", 
        fragment: "test"}, "uri_cut" );
    
    uri = "http://localhost/hello/world/test.html?param=hello#test";
    deepEqual( uri_cut(uri), {
        addr: uri, 
        scheme: "http", 
        authority: "localhost", 
        path: "hello/world/test.html", 
        query: "param=hello", 
        fragment: "test"}, "uri_cut" );
    
});

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

module( "HTTP" );
    
/* sync */
test( "sync" , function() {
    var expected,value;
    
    // crée l'objet Request
    var http = http_create();
    ok( http != false, "http_create" );
    
    // requete GET
    expected = "...";
    value = http_get(http,"data/response.txt");
    equal( value, expected, "http_get" );
    
    // requete POST
    expected = "Array ( [foo] => bar )";
    value = http_post(http,"data/response.php",{foo:"bar"});
    equal( value.replace(/[\n\r\s\t]/g,""), expected.replace(/[\n\r\s\t]/g,""), "http_post" );
    
    // requete POST MULTIPART
    expected = "Array ( [foo] => bar )";
    value = http_post_multipart(http,"data/response.php",[
        {
            headers:[
                'Content-Disposition: form-data; name="foo"',
                'Content-Type: application/octet-stream',
                'Content-Length: 3'
            ],
            data:"bar"
        }
    ],
    "form-data"
    );
    equal( value.replace(/[\n\r\s\t]/g,""), expected.replace(/[\n\r\s\t]/g,""), "http_post_multipart" );
});

/* async */
asyncTest( "async" , 1, function() {
    // requete GET
    http_get_async("data/response.txt",function(e,context){
        if(this.readyState == 4)//DONE
        {
            var expected = "...";
            var value = http_response(this);
            equal( value, expected, "http_get_async" );
            start();
        }
    });
});

/* async */
asyncTest( "async" , 1, function() {
    // requete GET
    http_post_async("data/response.php",{foo:"bar"},function(e,context){
        if(this.readyState == 4)//DONE
        {
            var expected = "Array ( [foo] => bar )";
            var value = http_response(this);
            equal( value.replace(/[\n\r\s\t]/g,""), expected.replace(/[\n\r\s\t]/g,""), "http_post_async" );
            start();
        }
    });
});

/* async */
asyncTest( "async" , 1, function() {
    // requete POST MULTIPART
    value = http_post_multipart_async("data/response.php",
        [
            {
                headers:[
                    'Content-Disposition: form-data; name="foo"',
                    'Content-Type: application/octet-stream',
                    'Content-Length: 3'
                ],
                data:"bar"
            }
        ],
        "form-data",
        function(e,context){
            if(this.readyState == 4)//DONE
            {
                var expected = "Array ( [foo] => bar )";
                var value = http_response(this);
                equal( value.replace(/[\n\r\s\t]/g,""), expected.replace(/[\n\r\s\t]/g,""), "http_post_multipart_async" );
                start();
            }
        }
    );
});

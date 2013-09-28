$(function() {
    /* form plugin */
    module( "Form" );
    test( "form" , function() {
        //obtient les valeurs
        deepEqual( $('#form').form("values"), {foo:'bar', bar:'foo'}, "Get Values" );
        
        //définit les valeurs
        $('#form').form("values",{foo:'foo',bar:'bar'});
        deepEqual( $('#form').form("values"), {foo:'foo', bar:'bar'}, "Set Values" );
    });
    
    module( "Navigator" );
    test( "navigator", function() {
	var expected,value;

	//init
	$(window).navigator();

	//ok ?
	expected = true;
	value    = $(window).navigator("loaded");
	equal( value , expected, "init Passed!" );
        if(!value)
            return;
        
	//obtient une uri
	expected = "jquery.html";
	value    = $(window).navigator("url","jquery_tests");
	equal( value , expected, "url" );

	//obtient une uri avec paramètres
	expected = "jquery.html?user_account_id=toto";
	value    = $(window).navigator("url","jquery_tests",{user_account_id:"toto"});
	equal( value , expected, "url with params" );

	//obtient une uri avec paramètres
	expected = "https://www.google.fr/webhp?source=search%20app&fp=a0bff63b71134d01&q=helloworld";
	value    = $(window).navigator("url","google",{q:"helloworld"});
	equal( value , expected, "url with existing params" );

	//obtient l'uri de la page précédente
	expected = "next.html";
	value    = $(window).navigator("url","#next");
	equal( value , expected, "url next");

	//obtient l'uri de la page précédente
	expected = "previous.html";
	value    = $(window).navigator("url","#previous");
	equal( value , expected, "url previous" );

	//obtient l'uri de la page parent
	expected = "parent.html";
	value    = $(window).navigator("url","#parent");
	equal( value , expected, "url parent" );

	//obtient l'uri de la page child
	expected = "child.html";
	value    = $(window).navigator("url","#child");
	equal( value , expected, "url child" );

	//app id
	expected = "wfw";
	value    = $(window).navigator("id");
	equal( value , expected, "id" );

	//app name
	expected = "Webframework";
	value    = $(window).navigator("name");
	equal( value , expected, "name" );
    }); 

    module( "Request" );
    test( "xarg test", function() {
        var expected,value;

        //encode simple argument
        expected = "hello"+XARG_START_OF_TEXT_CHAR+"world"+XARG_END_OF_TEXT_CHAR;
        value    = xarg_to_string({hello:"world"});
        equal( value , expected, "encode simple argument" );

        //decode multiples arguments
        expected = "hello"+XARG_START_OF_TEXT_CHAR+"world"+XARG_END_OF_TEXT_CHAR+"foo"+XARG_START_OF_TEXT_CHAR+"bar"+XARG_END_OF_TEXT_CHAR;
        value    = xarg_to_string({hello:"world",foo:"bar"});
        equal( value , expected, "encode multiples arguments" );

        //decode simple argument
        expected = {hello:"world"};
        value    = xarg_to_object("hello"+XARG_START_OF_TEXT_CHAR+"world"+XARG_END_OF_TEXT_CHAR);
        deepEqual( value , expected, "decode simple argument" );

        //decode multiples arguments
        expected = {hello:"world",foo:"bar"};
        value    = xarg_to_object("hello"+XARG_START_OF_TEXT_CHAR+"world"+XARG_END_OF_TEXT_CHAR+"foo"+XARG_START_OF_TEXT_CHAR+"bar"+XARG_END_OF_TEXT_CHAR);
        deepEqual( value , expected, "decode multiples arguments" );

        //invalid arguments
        expected = false;
        value    = xarg_to_string("hello");
        equal( value , expected, "invalid argument" );
        value    = xarg_to_string(null);
        equal( value , expected, "invalid argument" );
        value    = xarg_to_string();
        equal( value , expected, "invalid argument" );
        value    = xarg_to_string({});
        equal( value , expected, "invalid argument" );
    }); 
    
    test( "request", function() {
        var expected,value;

        //sync request
        $(window).request("add",{
            url: "data/response.txt",
            async: false,
            callback: function(reqObj){
                if(reqObj.status == "success"){
                    expected = "...";
                    value = reqObj.response;
                    equal( value , expected, "sync request" );
                }
                if(reqObj.status == "error"){
                    expected = "...";
                    value = reqObj.response;
                    equal( value , expected, "sync request" );
                }
            }
        });

        // test request XARG (SUCESS)
        $(window).request("xarg","xarg_test",null,
            {
                onsuccess: function(obj, xarg){
                    expected = "ERR_OK";
                    value = xarg.result;
                    equal( value , expected, "xarg request" );
                }
            }
            );

        // test request XARG (FAILED)
        $(window).request("xarg","xarg_test_failed",null,
            {
                onfailed: function(obj, xarg){
                    //failed...
                    expected = "ERR_FAILED";
                    value = xarg.result;
                    equal( value , expected, "xarg request failed" );
                }
            }
            );

        // test request XML (SUCESS)
        $(window).request("xml","xml_test",null,
            {
                onsuccess: function(obj, xml_doc, xml_root){
                    expected = "ERR_OK";
                    value = $("result",xml_root).text();
                    equal( value , expected, "xml request" );
                }
            }
            );

        // test request XML (FAILED)
        $(window).request("xml","xml_test_failed",null,
            {
                onfailed: function(obj, xml_doc, xml_root){
                    expected = "ERR_FAILED";
                    value = $("result",xml_root).text();
                    equal( value , expected, "xml request failed" );
                }
            }
            );

    });
    
    module( "Utils" );
    /*test( "base64", function() {
        var expected,value;

        //encode simple argument
        expected = "hello world";
        value    = xarg_to_string({hello:"world"});
        equal( value , expected, "encode simple argument" );

        //decode multiples arguments
        expected = "hello"+XARG_START_OF_TEXT_CHAR+"world"+XARG_END_OF_TEXT_CHAR+"foo"+XARG_START_OF_TEXT_CHAR+"bar"+XARG_END_OF_TEXT_CHAR;
        value    = xarg_to_string({hello:"world",foo:"bar"});
        equal( value , expected, "encode multiples arguments" );

        //decode simple argument
        expected = {hello:"world"};
        value    = xarg_to_object("hello"+XARG_START_OF_TEXT_CHAR+"world"+XARG_END_OF_TEXT_CHAR);
        deepEqual( value , expected, "decode simple argument" );

        //decode multiples arguments
        expected = {hello:"world",foo:"bar"};
        value    = xarg_to_object("hello"+XARG_START_OF_TEXT_CHAR+"world"+XARG_END_OF_TEXT_CHAR+"foo"+XARG_START_OF_TEXT_CHAR+"bar"+XARG_END_OF_TEXT_CHAR);
        deepEqual( value , expected, "decode multiples arguments" );

        //invalid arguments
        expected = false;
        value    = xarg_to_string("hello");
        equal( value , expected, "invalid argument" );
        value    = xarg_to_string(null);
        equal( value , expected, "invalid argument" );
        value    = xarg_to_string();
        equal( value , expected, "invalid argument" );
        value    = xarg_to_string({});
        equal( value , expected, "invalid argument" );
    });
    */
    asyncTest( "file_reader", 6, function() {
      var file = $( "#file" )[0];
      var fileread = $( "#fileread" );
      
      fileread.on( "click", function() {
        // 
        ok( readFileOffset_base64(file.files[0],0,3,function(start, size, data, param){
            var expected = "123";
            var value = window.atob(data);
            equal( value , expected, "readFileOffset_base64, check content (zero offset)" );
        },null), "readFileOffset_base64, success" );
        // 
        ok( readFileOffset_base64(file.files[0],2,4,function(start, size, data, param){
            var expected = "3456";
            var value = window.atob(data);
            equal( value , expected, "readFileOffset_base64, check content (with offset)" );
        },null), "readFileOffset_base64, success" );
        // 
        ok( readFile_base64(file.files[0],function(data, param){
            var expected = "123456";
            var value = window.atob(data);
            equal( value , expected, "readFile_base64, check content" );
        },null), "readFile_base64, success" );
        start();
      });
      //fileread.click();
    });

});

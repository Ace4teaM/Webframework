$(function() {
    /* form plugin */
    module( "form" );
    test( "Form" , function() {
        //obtient les valeurs
        deepEqual( $('#form').form("values"), {foo:'bar', bar:'foo'}, "Get Values" );
        
        //définit les valeurs
        $('#form').form("values",{foo:'foo',bar:'bar'});
        deepEqual( $('#form').form("values"), {foo:'foo', bar:'bar'}, "Set Values" );
/*
        //obtient les elements
        var elements = wfw.Form.get_elements('form');
        ok( elements.bar, "Get Elements" );
        equal( elements.foo.get("value"), "foo", "Access Element" );

        //obtient les elements statiques
        var elements = wfw.Form.get_elements('form',{getStaticNode:true});
        ok( elements.unstd, "Get Statics Elements" );

        //obtient les elements par nom de balise
        var elements = wfw.Form.get_elements('form',{selectByAtt:'id'});
        ok( elements.fooInput, "Get Elements By Id (real case)" );
        var elements = wfw.Form.get_elements('form',{selectByAtt:'id', forceAttLowerCase:true});
        ok( elements.fooinput, "Get Elements By Id (lower case)" );*/
    });
    
    test( "Navigator", function() {
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
    
    test( "request test", function() {
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
        $(window).request("xarg","data/xarg_test",null,
            {
                onsuccess: function(obj, xarg){
                    expected = "ERR_OK";
                    value = xarg.result;
                    equal( value , expected, "xarg request" );
                }
            }
            );

        // test request XARG (FAILED)
        $(window).request("xarg","data/xarg_test_failed",null,
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
        $(window).request("xml","data/xml_test",null,
            {
                onsuccess: function(obj, xml_doc, xml_root){
                    expected = "ERR_OK";
                    value = $("result",xml_root).text();
                    equal( value , expected, "xml request" );
                }
            }
            );

        // test request XML (FAILED)
        $(window).request("xml","data/xml_test_failed",null,
            {
                onfailed: function(obj, xml_doc, xml_root){
                    expected = "ERR_FAILED";
                    value = $("result",xml_root).text();
                    equal( value , expected, "xml request failed" );
                }
            }
            );

    }); 

});

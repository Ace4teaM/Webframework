
YUI(wfw_yui_config('../wfw/javascript/yui/')).use('wfw', 'wfw-navigator', 'wfw-form', 'wfw-path', 'wfw-uri', 'wfw-xml-template',function(Y){
    var wfw = Y.namespace("wfw");

    /* wfw */
    module( "wfw" );
    test( "Object" , function() {
        var obj = wfw.createObject({a:"A",b:"B"});
        
        notEqual( obj, null, "createObject" );
        equal( obj["a"], "A", "Member test A" );
        equal( obj["b"], "B", "Member test B" );
        ok( obj["id"], "Identifier exists" );
        ok( obj["ns"], "Namespace exists" );
    });
    
    
    /* wfw.Form */
    module( "wfw.Form" );
    test( "Form" , function() {
        //obtient les valeurs
        deepEqual( wfw.Form.get_fields('form'), {foo:'bar', bar:'foo'}, "Get Values" );
        
        //inverse les valeurs
        wfw.Form.set_fields('form',{foo:'foo',bar:'bar'});
        deepEqual( wfw.Form.get_fields('form'), {foo:'foo', bar:'bar'}, "Set Values" );
        
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
        ok( elements.fooinput, "Get Elements By Id (lower case)" );
    });
    
    
    
    /* wfw.Path */
    module( "wfw.Path" );
    test( "Path" , function() {
        //nom de fichier
        equal( wfw.Path.filename('/Webframework/qunit/yui.html'), 'yui', "Get Filename" );
        equal( wfw.Path.filename('yui.html'), 'yui', "Get Filename without path" );
        equal( wfw.Path.filename('yui'), 'yui', "Get Filename without extension" );
        equal( wfw.Path.filename('yui.html',{include_ext:true}), 'yui.html', "Get Filename include extension" );
    });
    
    
    
    /* wfw.URI */
    module( "wfw.URI" );
    test( "URI" , function() {
        //Cut
        var uri_str = 'http://www.aceteam.org/Webframework/qunit/yui.html?a=b#hello';
        var uri = wfw.URI.cut(uri_str);
        equal( uri.addr     , uri_str, "Address" );
        equal( uri.scheme   , 'http', "Scheme" );
        equal( uri.authority, 'www.aceteam.org', "Authority" );
        equal( uri.path     , 'Webframework/qunit/yui.html', "Path" );
        equal( uri.query    , 'a=b', "Query" );
        equal( uri.fragment , 'hello', "Fragment" );
        
        //Object
        var uri = wfw.URI.toObject(uri_str);
        equal( uri.makeAddress() , uri_str, "Make Address" );
        
        //Decode
        var uri_str = 'Hello%20World';
        equal( wfw.URI.decode(uri_str), 'Hello World', "Decode" );
        var uri_str = 'Hello%CE%A3World';
        equal( wfw.URI.decodeUTF8(uri_str), 'HelloΣWorld', "Decode UTF-8" );
        
        //Encode
        var uri_str = 'Hello World';
        equal( wfw.URI.encode(uri_str), 'Hello%20World', "Encode" );
        var uri_str = 'HelloΣWorld';
        equal( wfw.URI.encodeUTF8(uri_str), 'Hello%CE%A3World', "Encode UTF8" );
        
        //Make
        equal( wfw.URI.make('http','aceteam.org','index.html',{foo:'bar'},'test'), 'http://aceteam.org/index.html?foo=bar#test', "Make" );
        
        //Query
        deepEqual( wfw.URI.queryToObject("voiture=alpha&lieu=paris"), {voiture:"alpha",lieu:"paris"}, "Query to object");
        deepEqual( wfw.URI.queryToObject("voiture=alpha%20romeo", true), {voiture:"alpha romeo"}, "Query to object (encoded)");
        
        //Query
        equal( wfw.URI.objectToQuery({voiture:"alpha",lieu:"paris"}), "voiture=alpha&lieu=paris", "Object to query");
        equal( wfw.URI.objectToQuery({voiture:"alpha romeo"}, true), "voiture=alpha%20romeo", "Object to query (encoded)");
        
        //Remake
        equal( wfw.URI.remakeURI('http://www.aceteam.org?foo=bar',{foo:"foo",bar:"bar"}), "http://www.aceteam.org?foo=foo&bar=bar", "Remake URI");
        equal( wfw.URI.remakeURI('http://www.aceteam.org?foo=bar',{bar:"bar"},wfw.URI.ReplaceQuery,'test'), "http://www.aceteam.org?bar=bar#test", "Remake URI (replace)");
        equal( wfw.URI.remakeURI('http://www.aceteam.org?foo=bar',null,wfw.URI.ReplaceQuery,'test'), "http://www.aceteam.org#test", "Remake URI (anchor)");

    });
    
    
    
    /* wfw.Navigator */
    module( "wfw.Navigator" );
    test( "Navigator" , function() {
        //module navigateur
        wfw.Navigator.init({
            basePath : "../qunit/data/"
        });
        //nom de fichier
        equal( wfw.Navigator.getURI('index'), '../qunit/data/index.html', "Get index" );
        equal( wfw.Navigator.getURI('index', {add_fields : {foo : "bar"}}), '../qunit/data/index.html?foo=bar', "Get index" );
    });
    
    
    /* wfw.Template */
  /*  module( "wfw.Template" );
    test( "XML Template" , function(assert) {
        var expectedDoc = '../unit_test/template_xml/select/expected.html';
        var tempDoc = '../unit_test/template_xml/select/template.html';
        var selDoc = 'select.xml'; // relative to tempDoc
        var template = new wfw.Template.cXMLTemplate();

        //initialise la classe
        if (template.Initialise(tempDoc,null,selDoc,null,{}))
        {
            var expected = wfw.HTTP.get(expectedDoc);
            
            //transforme l'élément
            var output = template.Make();
            
            console.log(expected);
            console.log("output");
            console.log(output);
            
            //assert.htmlEqual('<B TITLE=test>te2st</B>', '<b title="test">test</b>', 'template-ActionSelect');
            assert.equal(expected, output, 'template-ActionSelect');
            
        }

        assert.htmlEqual('<B TITLE=test>test</B>', '<b title="test">test</b>', 'template-ActionSelect');
        console.log("wfw.Template");
        console.log(wfw.Template);
        var file_content = wfw.Template.makeSrc(tempDoc,null,selDoc,null,{});
        console.log("file_content");
        console.log(file_content);

    });*/
    
});
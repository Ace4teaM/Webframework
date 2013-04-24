
YUI(wfw_yui_config('../wfw/javascript/yui/')).use('wfw', 'wfw-form', 'wfw-path',function(Y){
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
    
    
    /* wfw-form */
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
    
    /* wfw-form */
    module( "wfw.Path" );
    test( "Path" , function() {
        //nom de fichier
        equal( wfw.Path.filename('/Webframework/qunit/yui.html'), 'yui', "Get Filename" );
        equal( wfw.Path.filename('yui.html'), 'yui', "Get Filename without path" );
        equal( wfw.Path.filename('yui'), 'yui', "Get Filename without extension" );
        equal( wfw.Path.filename('yui.html',{include_ext:true}), 'yui.html', "Get Filename include extension" );
    });
});
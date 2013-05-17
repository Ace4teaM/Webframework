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
});
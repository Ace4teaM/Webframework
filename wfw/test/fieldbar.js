
//initialise le contenu
YUI(wfw_yui_config).use('wfw','wfw-fieldbar', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){
        //
        test( "hello test", function() {
            equal(wfw.puts("test"), "test", "wfw.puts");
            notEqual(wfw.FieldBar.initElement(Y.Node.one("#my_field")), false, "initElement");

        });
    };
    Y.one('window').on('load', onLoad);
});
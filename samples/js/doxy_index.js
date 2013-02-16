/*
 *
 **/
YUI(wfw_yui_config(wfw_yui_base_path)).use('node', 'event', 'wfw', function (Y)
{
    var wfw = Y.namespace("wfw");

    //connection status change
    var onLoad = function(e)
    {
        //cache le contenu
        Y.Node.all("#content > *").hide();

        //
        var menuPanel = Ext.create('Ext.Panel', {
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            items: [
                {html:Y.Node.one("#class_index").get("innerHTML"), flex:1},
                {html:Y.Node.one("#interfaces_index").get("innerHTML"), flex:1},
                {html:Y.Node.one("#functions_index").get("innerHTML"), flex:1},
                {html:Y.Node.one("#globals_index").get("innerHTML"), flex:1}
            ],
            renderTo: "content"
        });

        /*var viewport = Ext.create('Ext.Viewport', {
            layout: 'border',
            items: [contentPanel,menuPanel,statusPanel,footerPanel]
        });*/
        
    };
    
    //initialise les evenements
    Y.one('window').on('load', onLoad);
});

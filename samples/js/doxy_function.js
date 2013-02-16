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
        
        var items=[];
        Y.Node.all(".function").each(function (node){
            //alert(menuPanel.items);
            items.push({
                title: node.one("h2").get("text"),
                html: node.one(".function_content").get("innerHTML")
            });
        });

        //
        var menuPanel = Ext.create('Ext.Panel', {
            title: 'Liste des fonctions',
            layout: {
                // layout-specific configs go here
                type: 'accordion',
                titleCollapse: false,
                animate: true,
                activeOnTop: true
            },
            region: 'west',     // position for region
            width: "100%",
            split: true,         // enable resizing
            margins: '0 5 5 5',
            items: items,
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

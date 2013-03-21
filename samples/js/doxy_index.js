
/*------------------------------------------------------------------------------------------------------------------*/
//
// Initialise le layout
//
/*------------------------------------------------------------------------------------------------------------------*/
MyApp.onInitLayout = function(Y){

    var wfw = Y.namespace("wfw");

    //
    var menuPanel = Ext.create('Ext.Panel', {
        layout: {
            type: 'hbox',
            pack: 'start',
            align: 'stretch'
        },
        items: [
            {contentEl:Y.Node.one("#class_index").getDOMNode(), flex:1},
            {contentEl:Y.Node.one("#interfaces_index").getDOMNode(), flex:1},
            {contentEl:Y.Node.one("#functions_index").getDOMNode(), flex:1},
            {contentEl:Y.Node.one("#globals_index").getDOMNode(), flex:1}
        ],
        renderTo: "content"
    });

    /*var viewport = Ext.create('Ext.Viewport', {
        layout: 'border',
        items: [contentPanel,menuPanel,statusPanel,footerPanel]
    });*/
}

//ajoute la fonction a l'initialisation de l'application'
MyApp.Loading.callback_list.push( MyApp.onInitLayout );

/*
(C)2012 AceTeaM. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
Auteur : AUGUEY THOMAS
Mail   : dev@aceteam.org
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "navigator.html"

Implentation: [18-10-2012]
*/

//initialise le contenu
YUI(wfw_yui_config).use('node', 'wfw-navigator', 'wfw-fieldbar', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){
        /*
        * ---------------------------------------------------------------
        * Affiche l'id du fichier
        * ---------------------------------------------------------------
        */
        Y.Node.one("#page_id").set("text", wfw.Navigator.getId());
        
        /*
        * ---------------------------------------------------------------
        * Initialise la barre de navigation
        * ---------------------------------------------------------------
        */
        wfw.FieldBar.initElement(Y.one("#nav_input"), {
            //FIELD_BAR options
            barClass: "fieldbar_fil_ariane_bar wfw_bg_frame",
            itemClass: "fieldbar_fil_ariane_item",
            itemEvent: "fieldbar_fil_ariane",
            editable: false,
            contener: Y.Node.one("#nav_bar"),
            //Events
            onCreateItem: function(item,label){
                //insert une icon aux items
                var icon = Y.Node.create('<span>');
                icon.addClass('fieldbar_fil_ariane_item_image');
                label.insert(icon,'before');
				
                item.on("click", function(e){
                    var fieldbar = Y.FieldBar.getStates(this);
                    alert(this.get('text'));
                });
            },
            onCreateBar: function(contener){
                //insert un titre à la bar principale
                var text_label = Y.Node.create('<label>');
                text_label.addClass('fieldbar_fil_ariane_item_title');
                text_label.insert("Navigation");
                contener.insert(text_label);
            }
        });
    };
    
    Y.one('window').on('load', onLoad);
});


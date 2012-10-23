/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
ID-Informatik
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "fieldbar.html"

Revisions:
    [26-09-2012] Implentation
*/

//initialise le contenu
YUI(wfw_yui_config).use('node', 'event', 'wfw-fieldbar', function (Y)
{
    var wfw = Y.namespace("wfw");
    
	var onLoad = function(e){
		/*
		 * ---------------------------------------------------------------
		 * Initialise une FieldBar personnalisé
		 * ---------------------------------------------------------------
		 */
		//Initialise une barre de champs depuis un élément INPUT
		wfw.FieldBar.initElement(Y.one("#my_field"), {
			//FIELD_BAR options
			barClass: "fieldbar_fil_ariane_bar wfw_bg_frame",
			itemClass: "fieldbar_fil_ariane_item",
			itemEvent: "fieldbar_fil_ariane",
			editable: false,
			//Events
			onCreateItem: function(item,label){
				//insert une icon aux items
				var icon = Y.Node.create('<span>');
				icon.addClass('fieldbar_fil_ariane_item_image');
				label.insert(icon,'before');
				
				item.on("click", function(e){
					var fieldbar = wfw.FieldBar.getStates(this);
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
		
		//intialise la barre
		wfw.FieldBar.insertItem(Y.one("#my_field"), "coucou", 0);
		
		
		/*
		 * ---------------------------------------------------------------
		 * Initialise une FieldBar standard
		 * ---------------------------------------------------------------
		 */
		//Initialise une barre de champs depuis un élément INPUT
		wfw.FieldBar.initElement(Y.one("#my_field2"), {});
	};
	Y.one('window').on('load', onLoad);
});


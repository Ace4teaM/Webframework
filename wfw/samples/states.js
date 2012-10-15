/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "states.html"

Revisions:
    [11-10-2012] Implentation
*/

//initialise le contenu
YUI().use('node', 'event', 'states', function (Y)
{
	var onLoad = function(e){
		//Assigne des données a l'élément '#e1'
		Y.States.fromElement(Y.one("#e1"), {
			foo : "hello",
			bar : "world"
		});
		
		//Assigne des données a l'élément '#e2'
		Y.States.fromElement(Y.one("#e2"), {
			foo : "papa",
			bar : "maman"
		});
		
		//Assigne des données a l'élément 'p'
		Y.States.fromElement(Y.one("p"), {
			type : "paragraphe"
		});
		
		//affiche la liste des données liées aux elements du document
		Y.one("#showElementStates").on("click",function(e){
			
			//prepare le noeud d'affichage
			var showNode = Y.one("#states");
			showNode.all("*").remove();
			
			//recherche puis affiche les données trouvées pour chacun des éléments
			Y.all("*").each(function(node){
				var state = Y.States.fromElement(node,null,{exists:true});
				if (state != null) {
					showNode.append("<p>" + node.get("tagName") + " (Id = '" + node.get("id") + "'):</p>");
					showNode.append("<p>" + wfw.toString(state) + "</p>");
				}
			});
		});
	};
	
	//onload event
	Y.one('window').on('load', onLoad);
});

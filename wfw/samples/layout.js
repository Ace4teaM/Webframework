/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
ID-Informatik
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "layout.html"

Revisions:
    [04-10-2012] Implentation
*/

//initialise le contenu
function onInit()
{
	/*
	 * ---------------------------------------------------------------
	 * Initialise une FieldBar standard
	 * ---------------------------------------------------------------
	 */
	
	//intialise le formulaire 'form1'
	//wfw.form.initFromURI("form1","form1");
	
	/*
	 * ---------------------------------------------------------------
	 * Initialise une FieldBar personnalisé
	 * ---------------------------------------------------------------
	 */
    //Initialise une barre de champs depuis un élément INPUT
    wfw.ext.layout.initElement("my_layout", {w:320,h:240});
	
	wfw.ext.layout.setElement("my_layout","north",50,"top");
	wfw.ext.layout.setElement("my_layout","west",50,"left");
	wfw.ext.layout.setElement("my_layout","east",50,"right");
	wfw.ext.layout.setElement("my_layout","sud",50,"bottom");
	wfw.ext.layout.setElement("my_layout","center",null,"middle");
	
	wfw.ext.layout.setPlacement("my_layout");
}

// intialise les extensions
wfw.ext.initAll();

// intialise les evenements
wfw.event.SetCallback("wfw_window","load","onInit",onInit,false);

// assigne les evenements
wfw.event.ApplyTo(window, "wfw_window");

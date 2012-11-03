---------------------------------------------------------------------------------------------------------------------------------------
 (C)2008-2012 AceTeaM. All rights reserved. (R)WebFrameWork 
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protégé part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
-     Author : AUGUEY THOMAS
-     Mail   : dev@aceteam.org

---------------------------------------------------------------------------------------------------------------------------------------
 BUG et comportements hasardeux à resoudre
---------------------------------------------------------------------------------------------------------------------------------------
- wfw.http.get()                   [IE9] Ajoute un parametre supplementaire sur l'URL pour ignorer la prise en compte du cache
- wfw.http.get_async()             [IE9] Ajoute un parametre supplementaire sur l'URL pour ignorer la prise en compte du cache
- xml_load()                       Utilise une iframe pour charger dynamiquement des documents
- date()                           Ne retourne pas tous les types de formats supportés par la version PHP
- cXMLTemplate.merge_arguments()   [IE9] Lors d'une action "merge" si un attribut est définit vide (ex: style="") il n'est pas definit dans javascript par le navigateur (utilisez par exemple 'style="color:inherit;"' pour le rendre non vide et sans effet)
- wfw.Template.makeDoc()           [IE9] Le chargement échoue si le doctype du document n'est pas de type XML (ex: HTML, XHTML, etc...)

---------------------------------------------------------------------------------------------------------------------------------------
 Quoi de neuf ?
---------------------------------------------------------------------------------------------------------------------------------------
- La version 1.7 de webframework inclue des changements profond dans le style de codage de Javascript.
- Les librairies 'wfw.js' et 'wfw-extends.js' sont maintenant basé sur le Framework 'Yahoo-UI', La librairie 'DOM-Compatible' étant abandonnée.

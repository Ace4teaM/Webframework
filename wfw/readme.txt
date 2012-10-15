
---------------------------------------------------------------------------------------------------------------------------------------
 (C)2008-2012 ID-Informatik. All rights reserved. (R)WebFrameWork 
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est prot�g� part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
    ID-Informatik
    MR AUGUEY THOMAS
    contact@id-informatik.com

---------------------------------------------------------------------------------------------------------------------------------------
 BUG et comportements hasardeux � resoudre
---------------------------------------------------------------------------------------------------------------------------------------
wfw.http_get()                   [IE9] Ajoute un parametre supplementaire sur l'URL pour ignorer la prise en compte du cache
wfw.http_get_async()             [IE9] Ajoute un parametre supplementaire sur l'URL pour ignorer la prise en compte du cache
xml_load()                       Utilise une iframe pour charger dynamiquement des documents
date()                           Ne retourne pas tous les types de formats support�s par la version PHP
cXMLTemplate.merge_arguments()   [IE9] Lors d'une action "merge" si un attribut est d�finit vide (ex: style="") il n'est pas definit dans javascript par le navigateur (utilisez par exemple 'style="color:inherit;"' pour le rendre non vide et sans effet)
wfw.template.makeDoc()           [IE9] Le chargement �choue si le doctype du document n'est pas de type XML (ex: HTML, XHTML, etc...)

---------------------------------------------------------------------------------------------------------------------------------------
 Quoi de neuf ?
---------------------------------------------------------------------------------------------------------------------------------------
v1.3.43	[client API] Gestion imbriqu� des dialogues 
		[client API] Remaniement du dialogue LoadingBox
		[server API] Int�gration de la classe de type cInputString
		[frame work] Gestion am�lior� des modules (installation et d�tection)

v1.3.45	[frame work] Implentation du popup "date_piker.html"

v1.3.47	[server API] Implentation de la classe cXMLTemplate d�riv�e de la requ�te "template"
		[frame work] Am�lioration du popup "file_list.html"
		[frame work] Am�lioration du module "mailling"

v1.3.48 [frame work] Am�lioration des styles �tendus "wfw_hidden_help"
		[frame work] Implentation du popup "file_upload.html"

v1.3.49 [client API] Mise � jour de la librairie: dom .js
		[client API] Mise � jour de la librairie: wfw-list.js
		[frame work] Implentation du popup "client_edit_field.html" (suppression de la page equivalente)
		[frame work] Mise � jour du popup "file_upload.html"

v1.3.50 [client API] Mise � jour de la librairie: base.js
		[frame work] Am�lioration des modules "mailling", "client", "article_writer"

v1.3.51 [client API] Mise � jour de la librairie: base.js
		[client API] Implentation de la librairie: template.js (rempla�ante du composant wfw.template)
		[server API] Mise � jour de la librairie: xml_template.php
		[client API] Mise � jour de la librairie: dom.js

v1.3.52 [client API] Mise � jour de la librairie: base.js
		[client API] Mise � jour de la librairie: template.js
		[client API] Mise � jour de la librairie: wfw.js

v1.3.53 [frame work] Implentation du script : install.sh

v1.3.54 [frame work] Mise � jour du script : install.sh
		[frame work] Mise � jour des defaults
		[server API] Mise � jour de la requ�te : template.php
		[client API] Mise � jour de la librairie: xml_template.js
		[server API] Mise � jour de la librairie: xml_template.php

v1.3.55 [client API] Mise � jour de la librairie: xml_template.js
		[server API] Mise � jour de la librairie: xml_template.php

v1.3.56 [frame work] Am�lioration du module "client"
		[server API] Mise � jour de la librairie: xml_template.php

v1.3.57 [client API] Mise � jour de la librairie: wfw.js

v1.3.58 [client API] Mise � jour de la librairie: dom.js
		[client API] Mise � jour de la librairie: xml_template.js
		[server API] Mise � jour de la librairie: xml_template.php
		[frame work] Mise � jour du module: "mailling", "article_writer"
		[client API] Implemente la librairie: xml_default.js
		[server API] Mise � jour de la librairie: default_file.php

v1.3.59 [client API] Mise � jour de la librairie: xml_default.js
		[client API] Mise � jour de la librairie: wfw.js
		[frame work] Mise � jour du module: "article_writer"

v1.4.0b	[client API] wfw.form.initFromElement() est maintenant remplac� par wfw.form.initFromURI()
		[client API] Mise � jour de la librairie: wfw.js
		[client API] Mise � jour de la librairie: wfw-extends.js
		[frame work] Mise � jour des templates de bases
		[client API] Mise � jour de la librairie: xml_default.js
		[client API] Mise � jour de la librairie: xml_template.js
		[frame work] Implentation du module: catalog
		[frame work] Mise � jour du module: client

v1.4.0a	[client API] Mise � jour de la librairie: wfw.js
		[client API] Mise � jour de la librairie: wfw-extends.js
		[client API] Mise � jour de la librairie: xdocument.js
		[frame work] Implentation du module: client
		[frame work] Implentation du module: mailling

v1.4.0c	[client API] Mise � jour de la librairie: wfw.js
		[client API] Mise � jour de la librairie: wfw-extends.js
		[client API] Mise � jour de la librairie: wfw-list.js
		[frame work] Implentation du module: actu

v1.4.0d	[frame work] Implentation du module: actu
		[server API] Mise � jour de la librairie: xml_template.php
		
v1.4.0e	[frame work] Implentation du module: client (popup image_list)
		[frame work] Implentation du script: system.sh (configure le systeme pour webframework "A exectuer avec les droits root")
		
v1.4.0f	[client API] Mise � jour de la librairie: base.js
		[frame work] Renommage du script: install.sh en make-site.sh
		[frame work] Renommage du script: system.sh en install.sh
		[frame work] Implentation de la requete: wfw/private/req/getlog.php
		[frame work] Implentation du template d�faut: admin/log.html
		[frame work] Mise � jour du script: wfw/sh/add_cron_task.sh
		[frame work] Mise � jour du script: wfw/sh/client.add.sh
		[client API] Mise � jour de la librairie: wfw-list.js
		[frame work] Mise � jour des 'default'
		[frame work] Implentation du module: article_writer

v1.4.0g	[frame work] Implentation du module: catalog
		[frame work] Am�lioration du popup "cron_time.html"
		[frame work] Mise � jour du module: "mailling", "client"
		
v1.4.0h	[frame work] Mise � jour du module: "mailling"
		[frame work] Ajout des requ�tes: "rem_task", "task_list"
		[frame work] Ajout des requ�tes d�faut: "configure", "update"
		[frame work] Mise des d�fauts: "index"
		[frame work] Update des requ�tes: "PATH_ROOT constante"

v1.4.0i	[frame work] Mise � jour du module: "client" (Gestion de l'utf-8)
		[client API] Mise � jour de la librairie: wfw.js (Gestion de l'utf-8)
		
v1.4.0j	[frame work] Harmonisation de l'ensemble des encodages pour les fichiers *.PHP et *.JS (UTF8 sans signature)
		[frame work] Ajout du plugin "wfw_image" � tinyMCE (selection d'image locale depuis l'�diteur)
		
v1.4.0k	[frame work] Update "xdocument.php", "xml_template.php", "xml_template.js", "base.js", "wfw-list.js"
		[frame work] Mise � jour du module: "catalog", "client"
		[frame work] Implentation du popup "template_file_list.html"
		[frame work] Mise � jour des styles: "wfw-extends.css"
		
v1.4.0l	[frame work] Mise � jour du module: "catalog"
		[client API] Mise � jour des librairies: "wfw-tab.js", "wfw.js"
		[server API] Mise � jour de la librairie: xml_template.php
		
v1.4.0n	[frame work] Implentation du popup "client_image_thumb.html"

v1.4.0o	[frame work] Finalisation du popup "client_image_thumb.html"

v1.4.0p	Implentation d'un script de sauvegarde des donn�es
		Simplification de la d�finition des modules dans le listing: "private/sh/modules.listing"
		La requ�te clear_tmp supprime uniquement les fichiers de plus d'une heure d'existance
		
v1.4.0s	L'Administration devient le module <admin> (simplifie l'actualisation des sites en serveur locale)
		Le module <user> est fonctionnel

v1.4.0t Fix d'un bug lors de la suppression d'un article (module article_writer)
		Les listes d'�v�nements multiples peuvent maintenant utilis�es un param�tre de callback (wfw.event)
		
v1.4.0u Fix xml_template.php (bug avec les entit�s HTML)

v1.4.0x Introduction du type "cInputBool"

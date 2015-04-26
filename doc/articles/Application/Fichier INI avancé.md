Fichier INI avancé
===================

Depuis **Webframework 1.8** une gestion avancée des fichiers .ini a été introduite. Cette version remplace l’utilisation de la fonction standard PHP: **parse_ini_file**.

Sources
-----------
> **Webframework/wfw/php/ini_parse.php**

Usage
--------

###Constantes
La définition de constante permet d’éviter la redondance dans les définitions de chaines, et notamment les chemins d’accès.

> @global nom="valeur"

Pour utiliser une constante entourez celle-ci des caractères ${ et } :

> my_value =  "${nom}"

###Inclusions
La balise @include permet d’inclure un sous fichier de configuration.

> @include "nom_du_fichier.ini"

Inclura le fichier « nom_du_fichier.ini » au fichier en cours.

Note: Les chemins d’accès sont relatifs. Lorsqu’un fichier inclue un autre fichier, c’est l’emplacement de celui-ci qui fait office de chemin de base pour l’inclusion.

###Résolution des doublons
Si dans un fichier vous définissez plusieurs fois une même section, le résultat sera une fusion des paramètres trouvés dans l’ordre de leurs définitions.

Les paramètres définit en doubles seront écrasés dans l’ordre de leurs définitions, c’est-à-dire du haut vers le bas.

| [my_section] |+| [my_section]       |=| [my_section]       |
| :-------     | | :----              | | :---               |
| foo="bar"    | | foo="not bar"      | | foo="not bar"      |
| bar="foo"    | | smile="happiness"  | | bar="foo"          |
|              | |                    | | smile="happiness"  |


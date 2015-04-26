Fichier INI avanc�
===================

Depuis **Webframework 1.8** une gestion avanc�e des fichiers .ini a �t� introduite. Cette version remplace l�utilisation de la fonction standard PHP: **parse_ini_file**.

Sources
-----------
> **Webframework/wfw/php/ini_parse.php**

Usage
--------

###Constantes
La d�finition de constante permet d��viter la redondance dans les d�finitions de chaines, et notamment les chemins d�acc�s.

> @global nom="valeur"

Pour utiliser une constante entourez celle-ci des caract�res ${ et } :

> my_value =  "${nom}"

###Inclusions
La balise @include permet d�inclure un sous fichier de configuration.

> @include "nom_du_fichier.ini"

Inclura le fichier � nom_du_fichier.ini � au fichier en cours.

Note: Les chemins d�acc�s sont relatifs. Lorsqu�un fichier inclue un autre fichier, c�est l�emplacement de celui-ci qui fait office de chemin de base pour l�inclusion.

###R�solution des doublons
Si dans un fichier vous d�finissez plusieurs fois une m�me section, le r�sultat sera une fusion des param�tres trouv�s dans l�ordre de leurs d�finitions.

Les param�tres d�finit en doubles seront �cras�s dans l�ordre de leurs d�finitions, c�est-�-dire du haut vers le bas.

| [my_section] |+| [my_section]       |=| [my_section]       |
| :-------     | | :----              | | :---               |
| foo="bar"    | | foo="not bar"      | | foo="not bar"      |
| bar="foo"    | | smile="happiness"  | | bar="foo"          |
|              | |                    | | smile="happiness"  |


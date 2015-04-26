Configuration
===================

La configuration est un �l�ment important de l�application, elle permet au d�veloppeur de modifier l�environnement d�ex�cution et le comportement de l�application sans modification du code.

Depuis la r�vision � 174 �  Webframework a introduit une gestion avanc�e des fichiers INI sur lequel s'appui ce syst�me. Reportez-vous au chapitre <Format de fichier INI avanc� > pour plus d�informations.

La configuration permet principalement :
    D�finir les chemins d�acc�s aux librairies associ�es
    D�finir les inclusions globales
    D�finir les param�tres de connexion � la base de donn�es
    D�finir le dictionnaire de donn�es
    D�finir les param�tres de l�application

Arborescence des fichiers
------------------------------------

Pour faciliter l�int�gration de configuration, Webframework recommande de sectionner la configuration d�une application en plusieurs fichiers:

| Donn�e      | Description                                         |
|-------------|-----------------------------------------------------|
| config.ini  | Configuration locale de l'application               |
| all.ini     | Regroupe l'ensemble des fichiers de configuration   |
| fields.ini  | Champs et formats de donn�es                        |
| options.ini | D�finit les options sp�cifiques � l�application     |
| sql.ini     | Fichiers SQL (tables, fonctions, jeu d�essai, �)    |

Un exemple d�int�gration est pr�sent dans le r�pertoire "wfw/minimal/cfg" proposant une base g�n�rique d�application. 

###Champs et formats de donn�es (fields.ini)

Stock le dictionnaire de donn�es dans une unique section: [fields_formats].

Chaque champ est identifi� par un nom et un format, exemple :

> birth_date = date

Pour savoir quel sont les types support�s, reportez-vous � la section <Format de champ>.

L�utilisation d�un unique nom de section permet de fusionner plusieurs listes de champs et ainsi former un unique dictionnaire de donn�es.

Il est imp�ratif de pr�venir tout conflit de noms et de types (voir convention de nommage).

La plupart des champs d�finit, sont un copi�-coll� des colonnes de table de la base de donn�es. Il est donc ais� gr�ce � des logiciels de mod�lisation de maintenir un mod�le de donn�es coh�rant et g�n�rer le dictionnaire de donn�es. 

###Fichiers SQL (sql.ini)

Les fichiers SQL permettent aux applications h�tes d�inclure les d�pendances de script pour configurer la base de donn�es. Cette configuration inclue plusieurs sections :

[sql_tables]
>Correspond g�n�ralement au fichier sql/tables.sql g�n�r� par le model de donn�es. Ce fichier cr�e les tables, domaines et types SQL.

[sql_func]
>Correspond g�n�ralement au fichier sql/func.sql maintenu par le d�veloppeur. Ce fichier cr�e les proc�dures stock�es.

[sql_init]
>Correspond g�n�ralement au fichier sql/ini.sql maintenu par le d�veloppeur. Ce fichier initialise divers modification sur les objets avant utilisation (insertions de donn�es, modification de contraintes, etc�).

[sql_populate]
>Correspond g�n�ralement au fichier sql/jeu_essai.sql maintenu par le d�veloppeur. Ce fichier insert un jeu d�essai global � la BDD permettant de r�aliser des tests de fonctionnement.

[sql_remove]
>Correspond g�n�ralement au fichier sql/remove.sql maintenu par le d�veloppeur. Ce fichier permet de supprimer l�ensemble des objets et insertions du module sans affecter le reste de la BDD.

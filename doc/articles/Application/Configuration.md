Configuration
===================

La configuration est un élément important de l’application, elle permet au développeur de modifier l’environnement d’exécution et le comportement de l’application sans modification du code.

Depuis la révision « 174 »  Webframework a introduit une gestion avancée des fichiers INI sur lequel s'appui ce système. Reportez-vous au chapitre <Format de fichier INI avancé > pour plus d’informations.

La configuration permet principalement :
    Définir les chemins d’accès aux librairies associées
    Définir les inclusions globales
    Définir les paramètres de connexion à la base de données
    Définir le dictionnaire de données
    Définir les paramètres de l’application

Arborescence des fichiers
------------------------------------

Pour faciliter l’intégration de configuration, Webframework recommande de sectionner la configuration d’une application en plusieurs fichiers:

| Donnée      | Description                                         |
|-------------|-----------------------------------------------------|
| config.ini  | Configuration locale de l'application               |
| all.ini     | Regroupe l'ensemble des fichiers de configuration   |
| fields.ini  | Champs et formats de données                        |
| options.ini | Définit les options spécifiques à l’application     |
| sql.ini     | Fichiers SQL (tables, fonctions, jeu d’essai, …)    |

Un exemple d’intégration est présent dans le répertoire "wfw/minimal/cfg" proposant une base générique d’application. 

###Champs et formats de données (fields.ini)

Stock le dictionnaire de données dans une unique section: [fields_formats].

Chaque champ est identifié par un nom et un format, exemple :

> birth_date = date

Pour savoir quel sont les types supportés, reportez-vous à la section <Format de champ>.

L’utilisation d’un unique nom de section permet de fusionner plusieurs listes de champs et ainsi former un unique dictionnaire de données.

Il est impératif de prévenir tout conflit de noms et de types (voir convention de nommage).

La plupart des champs définit, sont un copié-collé des colonnes de table de la base de données. Il est donc aisé grâce à des logiciels de modélisation de maintenir un modèle de données cohérant et générer le dictionnaire de données. 

###Fichiers SQL (sql.ini)

Les fichiers SQL permettent aux applications hôtes d’inclure les dépendances de script pour configurer la base de données. Cette configuration inclue plusieurs sections :

[sql_tables]
>Correspond généralement au fichier sql/tables.sql généré par le model de données. Ce fichier crée les tables, domaines et types SQL.

[sql_func]
>Correspond généralement au fichier sql/func.sql maintenu par le développeur. Ce fichier crée les procédures stockées.

[sql_init]
>Correspond généralement au fichier sql/ini.sql maintenu par le développeur. Ce fichier initialise divers modification sur les objets avant utilisation (insertions de données, modification de contraintes, etc…).

[sql_populate]
>Correspond généralement au fichier sql/jeu_essai.sql maintenu par le développeur. Ce fichier insert un jeu d’essai global à la BDD permettant de réaliser des tests de fonctionnement.

[sql_remove]
>Correspond généralement au fichier sql/remove.sql maintenu par le développeur. Ce fichier permet de supprimer l’ensemble des objets et insertions du module sans affecter le reste de la BDD.

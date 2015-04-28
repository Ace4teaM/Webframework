#Modèle de données#

Créer un modèle de données définit l'ensemble des champs utilisés par votre application.

Définition
----------
  * Un Identifiant
  * Une Description
  * Un Format

###Identifiant
Chaque champ est unique et possède un usage spécifique. Webframework en définit certains (voir Champs réservés par Webframework). Les modules comme toutes applications, en définissent aussi, pour plus d’informations reportez-vous à la documentation concernée.

###Format
Le format, test la validité d’une chaine de caractères. C’est une composante de sécurité importante car elle filtre les champs reçu par l’utilisateur avant leurs utilisations.

Par convention, votre application définit les formats associés à vos champs dans la section **[fields_formats]** du document **cfg/fileds.ini**, comme dans l’exemple suivant :

	[fields_formats] 
	firstname = name
	lastname = name 
	birthday = date 
	contact = mail 

Le contrôleur de l'application fait la relation avec la classe de base **cInput** correspondante. Ainsi le format **mail** utilise la classe **cInputMail**, le format **identifier** utilise la classe **cInputIdentifier**, etc… Vous pouvez donc aisément ajouter vos propres formats en définissant de nouvelles classes dérivées de **cInput**.

###Description
La description apparait dans les formulaires utilisateur et les résultats de procédures.

Chaque texte peut être écrit dans différents langages, dans le cas ou votre application doit être multi-langage. Le langage par défaut est définit par un paramètre de configuration (voir chapitre Application).

Les descriptions sont écrites au format XML dans le fichier **default.xml**.

    <results lang="fr">
        <fields>
            <contact>Adresse eMail</contact>
            <firstname>Prénom</firstname>
            <lastname>Nom</lastname>
            <birthday>Date de naissance</birthday>
        </fields>
    </results>


Champs réservés
---------------
Webframework définit une partie du dictionnaire de données pour son fonctionnement de base. Il est donc déconseillé d’utiliser ces identifiants dans un contexte différent de celui définit ci-dessous.

Résultat de procédure :

| Identifiant | Description                   | Format     |
|-------------|-------------------------------|----------- |
| result      | Contexte de résultat          | Identifier |
| error       | Code de l’erreur              | Identifier |
| message     | Message de l’erreur           | Identifier |
| txt_result  | Texte du contexte de résultat | String     |
| txt_error   | Texte de l’erreur             | String     |
| txt_message | Texte du message de l’erreur  | String     |

Model-Vue-Contrôleur :

| Identifiant | Description                   | Format     |
|-------------|-------------------------------|----------- |
| app 	      | Nom de l’application 	      | Identifier |
| ctrl 	      | Nom du contrôleur 	          | Identifier |
| output      | Format de sortie du document  | Identifier |


Modélisation des données
------------------------
Il est vivement recommandé d’utiliser un logiciel spécialisé pour modéliser votre modèle de données.

Cela apporte plusieurs avantages :

1. Modélisation intuitive des entités
2. Exportation du modèle de données (scripts SQL)
3. Exportation du modèle orienté objet (classes PHP, C++, Java, etc…)
4. Maintenance facilitée
5. Gain de temps


PowerAMC
---------------
Les applications tierces de **Webframework** ont été construites avec le logiciel **PowerAMC **.

Si vous êtes familier de ce logiciel vous pourrez utiliser les extensions suivantes pour faciliter l’exportation de vos données :

Extension de langage pour PHP:
> Webframework/documents/sybase/php-wfw.xol

Extension SGBD pour PostgreSQL-8
> Webframework/documents/sybase/pgsql8-wfw.xdb

Reportez-vous au fichier **Webframework/documents/sybase/readme.md** pour savoir comment installer cette extension dans PowerAMC.

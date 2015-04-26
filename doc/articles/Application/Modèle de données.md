Mod�le de donn�es
=================
Cr�er un mod�le de donn�es d�finit l'ensemble des champs utilis�s par votre application.

D�finition
----------
  * Un Identifiant
  * Une Description
  * Un Format

###Identifiant
Chaque champ est unique et poss�de un usage sp�cifique. Webframework en d�finit certains (voir Champs r�serv�s par Webframework). Les modules comme toutes applications, en d�finissent aussi, pour plus d�informations reportez-vous � la documentation concern�e.

###Format
Le format, test la validit� d�une chaine de caract�res. C�est une composante de s�curit� importante car elle filtre les champs re�u par l�utilisateur avant leurs utilisations.

Par convention, votre application d�finit les formats associ�s � vos champs dans la section **[fields_formats]** du document **cfg/fileds.ini**, comme dans l�exemple suivant :

> [fields_formats]
> firstname = name
> lastname = name
> birthday = date
> contact = mail

Le contr�leur de l'application fait la relation avec la classe de base **cInput** correspondante. Ainsi le format **mail** utilise la classe **cInputMail**, le format **identifier** utilise la classe **cInputIdentifier**, etc� Vous pouvez donc ais�ment ajouter vos propres formats en d�finissant de nouvelles classes d�riv�es de **cInput**.

###Description
La description apparait dans les formulaires utilisateur et les r�sultats de proc�dures.

Chaque texte peut �tre �crit dans diff�rents langages, dans le cas ou votre application doit �tre multi-langage. Le langage par d�faut est d�finit par un param�tre de configuration (voir chapitre Application).

Les descriptions sont �crites au format XML dans le fichier **default.xml**.

    <results lang="fr">
        <fields>
            <contact>Adresse eMail</contact>
            <firstname>Pr�nom</firstname>
            <lastname>Nom</lastname>
            <birthday>Date de naissance</birthday>
        </fields>
    </results>


Champs r�serv�s
---------------
Webframework d�finit une partie du dictionnaire de donn�es pour son fonctionnement de base. Il est donc d�conseill� d�utiliser ces identifiants dans un contexte diff�rent de celui d�finit ci-dessous.

R�sultat de proc�dure :

| Identifiant | Description                   | Format
|-------------|-------------------------------|-----------
| result      | Contexte de r�sultat          | Identifier
| error       | Code de l�erreur              | Identifier
| message     | Message de l�erreur           | Identifier
| txt_result  | Texte du contexte de r�sultat | String
| txt_error   | Texte de l�erreur             | String
| txt_message | Texte du message de l�erreur  | String

Model-Vue-Contr�leur :

| Identifiant | Description                   | Format
|-------------|-------------------------------|-----------
| app 	      | Nom de l�application 	      | Identifier
| ctrl 	      | Nom du contr�leur 	      | Identifier
| output      | Format de sortie du document  | Identifier


Mod�lisation des donn�es
------------------------
Il est vivement recommand� d�utiliser un logiciel sp�cialis� pour mod�liser votre mod�le de donn�es.

Cela apporte plusieurs avantages :

1. Mod�lisation intuitive des entit�s
2. Exportation du mod�le de donn�es (scripts SQL)
3. Exportation du mod�le orient� objet (classes PHP, C++, Java, etc�)
4. Maintenance facilit�e
5. Gain de temps


PowerAMC
---------------
Les applications tierces de **Webframework** ont �t� construites avec le logiciel **PowerAMC **.

Si vous �tes familier de ce logiciel vous pourrez utiliser les extensions suivantes pour faciliter l�exportation de vos donn�es :

Extension de langage pour PHP:
> Webframework/documents/sybase/php-wfw.xol

Extension SGBD pour PostgreSQL-8
> Webframework/documents/sybase/pgsql8-wfw.xdb

Reportez-vous au fichier **Webframework/documents/sybase/readme.md** pour savoir comment installer cette extension dans PowerAMC.

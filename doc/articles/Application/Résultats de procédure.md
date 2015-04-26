R�sultats de proc�dure
===================

Par convention, les d�veloppeurs ont l�habitude d'utiliser un code unique pour identifier des erreurs ou informations de retour de fonction.
Les r�sultat de proc�dures expliqu� ici permette de structurer une erreur ou une information a travers les diff�rents langages d'une API (SQL>PHP>HTML>...)

Sources
-----------
> **Webframework/wfw/php/result.php**

D�finition
----------------------

> 0 (z�ro) indique un succ�s, les autres valeurs une erreur.

Cette m�thode a l'inconv�nient d'�tre uniquement relative � la fonction ou au programme qu'il ex�cute, masquant ainsi g�n�ralement les d�tail d'une erreur plus profonde et ajoutant ainsi de la difficult� au d�bogage.

Pour combler ces lacunes, Webframework repr�sente les r�sultats de proc�dure de fa�on structur�:

| Donn�e       | Description |
|--------------|----------------------------------------------|
| Code         | Fichier erron�, Connexion impossible, etc... |
| Contexte     | Succ�s, �chec, Erreur syst�me, etc...        |
| Informations | Donn�es associatives                         |

###Contexte
D�finit dans quel contexte c�est produit l�erreur. G�n�ralement d�finit par l�une des valeurs suivantes:

    ERR_OK     : La proc�dure est un succ�s
    ERR_FAILED : La proc�dure � �chou� pour des raisons fonctionnelles (argument invalide, �tat incorrecte, manque de droits, etc�)
    ERR_SYSTEM : La proc�dure � �chou� pour des raisons syst�mes (probl�me mat�riel, etc�) ind�pendant de l�application 

###Code
D�finit un identifiant pr�cisant la cause de l�erreur, ce code est d�finit par l�utilisateur.

###Informations
Un tableau associatif pr�cisant l�erreur.

Conventions
----------------------

####Codage des fonctions
* La valeur de retour est un bool�en: true (succ�s) ou false (�chec)
* La fonction stocke le r�sultat dans une variable a port�e globale.

Le r�sultat d�une fonction � une port� globale:
- Il est consultable en dehors du bloque de la fonction
- Il n�existe qu�un seul code en cours � la fois

Cette m�thode s�applique essentiellement aux applications Single-Thread.

Pourquoi utiliser cette convention ?
------------------------------------------------
###Le probl�me avec un code de retour num�rique
* Les codes sont limit�s par la plage de valeur
* Les application utilisent des codes d�erreurs sp�cifiques
* Le manque de pr�cision dans l�information
* Le risque de masquer un code de retour

###L�avantage du r�sultat de proc�dure
* Une cha�ne ne pose pas de limitation de taille
* Les codes d�erreurs son facilement compr�hensible et r�utilisable par d�autres applications
* Des informations compl�mentaires sous forme d�un tableau associatif permet de d�tailler l�erreur
* La port� globale permet de ne pas perdre l�information entre deux fonctions



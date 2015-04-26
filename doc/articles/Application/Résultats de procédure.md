Résultats de procédure
===================

Par convention, les développeurs ont l’habitude d'utiliser un code unique pour identifier des erreurs ou informations de retour de fonction.
Les résultat de procédures expliqué ici permette de structurer une erreur ou une information a travers les différents langages d'une API (SQL>PHP>HTML>...)

Sources
-----------
> **Webframework/wfw/php/result.php**

Définition
----------------------

> 0 (zéro) indique un succès, les autres valeurs une erreur.

Cette méthode a l'inconvénient d'être uniquement relative à la fonction ou au programme qu'il exécute, masquant ainsi généralement les détail d'une erreur plus profonde et ajoutant ainsi de la difficulté au débogage.

Pour combler ces lacunes, Webframework représente les résultats de procédure de façon structuré:

| Donnée       | Description |
|--------------|----------------------------------------------|
| Code         | Fichier erroné, Connexion impossible, etc... |
| Contexte     | Succès, Échec, Erreur système, etc...        |
| Informations | Données associatives                         |

###Contexte
Définit dans quel contexte c’est produit l’erreur. Généralement définit par l’une des valeurs suivantes:

    ERR_OK     : La procédure est un succès
    ERR_FAILED : La procédure à échoué pour des raisons fonctionnelles (argument invalide, état incorrecte, manque de droits, etc…)
    ERR_SYSTEM : La procédure à échoué pour des raisons systèmes (problème matériel, etc…) indépendant de l’application 

###Code
Définit un identifiant précisant la cause de l’erreur, ce code est définit par l’utilisateur.

###Informations
Un tableau associatif précisant l’erreur.

Conventions
----------------------

####Codage des fonctions
* La valeur de retour est un booléen: true (succès) ou false (échec)
* La fonction stocke le résultat dans une variable a portée globale.

Le résultat d’une fonction à une porté globale:
- Il est consultable en dehors du bloque de la fonction
- Il n’existe qu’un seul code en cours à la fois

Cette méthode s’applique essentiellement aux applications Single-Thread.

Pourquoi utiliser cette convention ?
------------------------------------------------
###Le problème avec un code de retour numérique
* Les codes sont limités par la plage de valeur
* Les application utilisent des codes d’erreurs spécifiques
* Le manque de précision dans l’information
* Le risque de masquer un code de retour

###L’avantage du résultat de procédure
* Une chaîne ne pose pas de limitation de taille
* Les codes d’erreurs son facilement compréhensible et réutilisable par d’autres applications
* Des informations complémentaires sous forme d’un tableau associatif permet de détailler l’erreur
* La porté globale permet de ne pas perdre l’information entre deux fonctions



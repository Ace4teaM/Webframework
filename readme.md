---------------------------------------------------------------------------------------------------------------------------------------
 WebFrameWork v1.8.1
---------------------------------------------------------------------------------------------------------------------------------------
-   Author : AUGUEY THOMAS
-   Mail   : dev@aceteam.org

---------------------------------------------------------------------------------------------------------------------------------------
 [1.8.1] Quoi de neuf 
---------------------------------------------------------------------------------------------------------------------------------------
- Classes controleurs réutilisable (utilisation des espaces de noms)
- Réfinit des includes avec un chemin relatif au dossier 'wfw/php/'
- Résolutions de divers bugs

---------------------------------------------------------------------------------------------------------------------------------------
 [1.8] Quoi de neuf 
---------------------------------------------------------------------------------------------------------------------------------------
- Transtypage automatique du model de données entre PHP et le SGBD
- Nouveau script d'archivage. Permet d'exporter des archives par nom de tag
- Model Application/Controleur
- Fusion automatique des fichiers default.xml
- Création d'une librairie JavaScript de base indépendante de YUI (permet d'étendre l'utilisation avec d'autres Framework ou non)

---------------------------------------------------------------------------------------------------------------------------------------
 [1.8] Mise a jour
---------------------------------------------------------------------------------------------------------------------------------------
- YUI.wfw.Form.get_elements(): Retourne les noms d'éléments dans leurs casse d'origine (auparavant forcé en minuscule). Utilisez l'option 'forceAttLowerCase:true' pour rétablir l'ancien comportement.
- YUI.wfw.URI.makeAddress()  : Ne construit plus l'URI dans le membre 'addr', retourne une variable indépendante.
- YUI.wfw.URI.ADDRESS        : Le membre 'addr' est utilisé pour stocké l'URI originelle (auparavant construite automatiquement par le constructeur)
- YUI.wfw.URI.ADDRESS        : Le membre 'query' est maintenant de type Object
- YUI.wfw.URI.cut            : Retourne un objet simple et non une classe ADDRESS (utilisez wfw.URI.toObject() pour créer une classe ADDRESS) 

---------------------------------------------------------------------------------------------------------------------------------------
 BUG et comportements hasardeux à resoudre
---------------------------------------------------------------------------------------------------------------------------------------
- `wfw.http.get()`                   [IE9] Ajoute un parametre supplementaire sur l'URL pour ignorer la prise en compte du cache
- `wfw.http.get_async()`             [IE9] Ajoute un parametre supplementaire sur l'URL pour ignorer la prise en compte du cache
- `xml_load()`                       Utilise une iframe pour charger dynamiquement des documents
- `date()`                           Ne retourne pas tous les types de formats supportés par la version PHP
- `cXMLTemplate.merge_arguments()`   [IE9] Lors d'une action "merge" si un attribut est définit vide (ex: style="") il n'est pas definit dans Javascript par le navigateur (utilisez par exemple `style="color:inherit;"` pour le rendre non vide et sans effet)
- `wfw.Template.makeDoc()`           [IE9] Le chargement échoue si le doctype du document n'est pas de type XML (ex: HTML, XHTML, etc...)


---------------------------------------------------------------------------------------------------------------------------------------
 Licence
---------------------------------------------------------------------------------------------------------------------------------------
Webframework est un logiciel libre sous licence GPL, consultez le fichier `license.txt` pour obtenir plus de détails sur cette licence.
Le contenu de la licence GPL est aussi disponible sur le net à l'adresse suivante: http://www.gnu.org/licenses/gpl-3.0.txt
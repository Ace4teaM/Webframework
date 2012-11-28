---------------------------------------------------------------------------------------------------------------------------------------
 WebFrameWork v1.7
---------------------------------------------------------------------------------------------------------------------------------------
-   Author : AUGUEY THOMAS
-   Mail   : dev@aceteam.org

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
 Quoi de neuf ?
---------------------------------------------------------------------------------------------------------------------------------------
- La version 1.7 de webframework inclue des changements profond dans le style de codage de Javascript.
- Les librairies `wfw.js` et `wfw-extends.js` sont maintenant basées sur le Framework `Yahoo-UI`, La librairie `DOM-Compatible` étant abandonnée.


---------------------------------------------------------------------------------------------------------------------------------------
 Licence
---------------------------------------------------------------------------------------------------------------------------------------
Webframework est un logiciel libre sous licence GPL, consultez le fichier `license.txt` pour obtenir plus de détails sur cette licence.
Le contenu de la licence GPL est aussi disponible sur le net à l'adresse suivante: http://www.gnu.org/licenses/gpl-3.0.txt
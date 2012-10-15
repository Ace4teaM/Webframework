/*
    (C)2011 ID-Informatik, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    Eléments 'dragable' [API]

    Dependences: base.js, dom.js, wfw.js

    Revisions:
        [29-12-2011] Implentation
*/

/*
    drag
*/
wfw.ext.dragElement = {
    use: true,
    /*
    Insert un élément depuis un template
    Parametres:
    [File] File    : L'Elément File
    [HTMLElement] insert_into : L'Elément liste ou sera inseré l'objet (en fin)
    [object]      fields      : Paramètres du template 
    [DOMDocument] doc         : Optionnel, Document en selection 
    [object]      doc_node    : Optionnel, Noeud en preselection (enfant du document 'doc')
    [HTMLElement] replacement : Optionnel, Noeud à remplacer lors de l'insertion 
    Retourne:
    [HTMLElement] L'Elément nouvellement créé et inséré, null en cas d'erreur.
    */
    applyTo: function (input,dragElement,parent) {
    },

};

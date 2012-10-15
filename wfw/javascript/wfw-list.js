/*
    (C)2011 ID-Informatik, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    Liste d'éléments [API]

    Dependences: base.js, dom.js, wfw.js

    Revisions:
        [22-09-2011] Update insertFields().
        [11-10-2011] Update wfw.ext.listElement(), ajout de l'argument 'doc' et 'doc_node' directement passé à la fonction wfw.template.make()
        [13-12-2011] Add wfw.ext.listElement.getFields()
        [17-12-2011] Debug wfw.ext.listElement.insertFields(), supprime l'id du template cloné pour eviter une duplication de la valeur
*/

/*
    listElement
*/
wfw.ext.listElement = {
    use: true,
    /*
    Insert un élément depuis un template
    Parametres:
    [HTMLElement] template    : L'Elément template
    [HTMLElement] insert_into : L'Elément liste ou sera inseré l'objet (en fin)
    [object]      fields      : Paramètres du template 
    [DOMDocument] doc         : Optionnel, Document en selection 
    [object]      doc_node    : Optionnel, Noeud en preselection (enfant du document 'doc')
    [HTMLElement] replacement : Optionnel, Noeud à remplacer lors de l'insertion 
    Retourne:
    [HTMLElement] L'Elément nouvellement créé et inséré, null en cas d'erreur.
    */
    insertFields: function (template, insert_into, fields, doc, doc_node, replacement) {
        if (typeof (doc) == "undefined") {
            doc = null;
            doc_node = null;
        }

        //fabrique le template
        var newElement = nodeCloneNode(template, true);

        //supprime l'id pour eviter une duplication de la valeur
        objSetAtt(newElement, "id", "");

        //remplace un objet existant?
        if ((typeof (replacement) != "undefined") && (replacement != null)) {
            nodeInsertAfter(newElement, replacement);
            nodeRemoveNode(replacement);
        }
        else
            objInsertNode(newElement, insert_into, null, INSERTNODE_END);

        wfw.template.make(document, newElement, doc, doc_node, fields);

        wfw.style.removeClass(newElement, "wfw_hidden");

        return newElement;
    },

    /*
    Retourne les champs cachés d'un élément
    Parametres:
    [HTMLElement] element : l'élément (les champs doivent etre enfant de cet élément)
    Retourne:
    [object] : tableau associatif des champs
    */
    getFields: function (element) {
        var fields = {};
        var cur = objGetChild(element);
        while (cur != null) {
            if ((cur.tagName.toLowerCase() == "input") && (objGetAtt(cur, "type") == "hidden"))
                fields[objGetAtt(cur, "name")] = objGetAtt(cur, "value");
            cur = objGetNext(cur);
        }
        return fields;
    },

    /*
    Retourne tous les champs cachés d'un élément
    Parametres:
    [HTMLElement] element : l'élément (les champs doivent etre enfant de cet élément)
    Retourne:
    [object] : tableau associatif des champs
    */
    getAllFields: function (element,type) {
        var fields = {};
        nodeEnumNodes(
            element,
            function (node, condition) {
                if ((node.nodeType == XML_ELEMENT_NODE) && (node.tagName.toLowerCase() == "input") && (objGetAtt(node, "type") == type)) {
                    fields[objGetAtt(node, "name")] = objGetAtt(node, "value");
                }
                return true; // continue l'énumération
            },
            false
        );
        return fields;
    },

    /*
    Trouve le prochain champs
    Parametres:
    template    : l'élément template
    insert_into : l'élément parent ou sera inseré l'objet (à la fin)
    xml_doc     : document XML à utiliser comme paramètres du template 
    */
    findField: function (list, field_name, field_value) {
    },

    /*
    Insert un élément depuis un template
    Parametres:
    template    : l'élément template
    insert_into : l'élément parent ou sera inseré l'objet (à la fin)
    xml_doc     : document XML à utiliser comme paramètres du template 
    */
    insertXML: function (template, insert_into, xml_doc) {
        //template
        var newElement = nodeCloneNode(template, true);
        objInsertNode(newElement, insert_into, null, INSERTNODE_END);
        wfw.template.make(document, newElement, xml_doc, null);

        wfw.style.removeClass(newElement, "wfw_hidden");
    },
    /*
    Insert les marqueurs de selection de page sous forme d'icone
    */
    insertPageMarker: function (list_parent, insert_into, wfw_icon_name) {
    }
};

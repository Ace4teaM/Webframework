/*
    Fonction du document "catalog.html"
*/

//options par defaut
var opt = {
    id: "", //selection en cours
    item: "" //selection en cours
};

var g_items = []; //guids des items existants
/*
Initialise le document
*/

wfw.event.SetCallback( // window
    "wfw_window",
    "load",
    "onLoadDoc",
    function () {
        // obtient les options 
        var uri_fields = wfw.utils.getURIFields();
        if (uri_fields != null) {
            for (opt_name in opt) {
                if (typeof (uri_fields[opt_name]) == "string")
                    opt[opt_name] = uri_fields[opt_name];
            }
        }

        //charge un catalogue ?
        if (!empty(opt.id)) {
            loadCatalog(opt.id);
        }
    },
    false
);

//dialogue de selection du document parent
function selectPageFile(input_id) {
    wfw.ext.document.lockFrame(
        'doc_list.html?seltype=single&sel=' + $value(input_id),
        {
            onOK: function (doc) {
                //recupere la liste des fichiers choisi
                var file_id = $value(docGetElement(doc, "id"));
                //var file_name = docGetElement(doc,"name");
                if (!empty(file_id))
                    $value(input_id, file_id);
                return true;
            },
            onCancel: function (doc) { } //annuler
        }
    );
}

//dialogue de selection du document parent
function selectTemplateDir() {
    wfw.ext.document.lockFrame(
        'template_list.html',
        {
            onOK: function (doc)//ok
            {
                //recupere la liste des fichiers choisi
                var file_id = $value(docGetElement(doc, "id"));
                //var file_name = docGetElement(doc,"name");
                if (!empty(file_id))
                    $value("out_dir", file_id);
                return true;
            },
            onCancel: function (doc) { } //annuler
        }
    );
}

function selectCatalogTemplateFile() {
    wfw.ext.document.lockFrame(
        'template_file_list.html?prefix=catalog_catalog&sel=' + $value("template"),
        {
            onOK: function (doc)//ok
            {
                //recupere la liste des fichiers choisis
                var file_id = $value(docGetElement(doc, "id"));
                //var file_name = docGetElement(doc,"name");
                if (empty(file_id))
                    file_id = "_catalog_catalog_default.html";
                $value("template", file_id);
                return true;
            },
            onCancel: function (doc) { } //annuler
        }
    );
}

//selectionne le template d'un item
//id = identifiant de l'item
//guid = guid de l'item a modifier
function selectTemplateFile(id, guid) {
    wfw.ext.document.lockFrame(
        'template_file_list.html?prefix=catalog_' + id + '&sel=' + $value("template_" + guid),
        {
            onOK: function (doc)//ok
            {
                //recupere la liste des fichiers choisis
                var file_id = $value(docGetElement(doc, "id"));
                //var file_name = docGetElement(doc,"name");
                if (empty(file_id))
                    file_id = "_catalog_" + id + ".html";
                $value("edit_item_template", file_id);
                return true;
            },
            onCancel: function (doc) { } //annuler
        }
    );
}

// publie l'item
function publishItem(guid) {
    var param = {
        "onsuccess": function (obj, args) {
            alert("ok");
        }
    };
    wfw.request.Add(null, "req/catalog/make_page.php", { client_id: ($value("client_id")), item_guid: (guid) }, wfw.utils.onCheckRequestResult_XARG, param, false);
}

// affiche la page existante de l'item
function viewItem(guid) {
    var options = wfw.ext.listElement.getAllFields($doc("fieldlist_" + guid + "_options"), "hidden");
    if (options.content_type != "template") {
        wfw.ext.document.messageBox("non template item");
        return;
    }
    var def = new cXMLDefault();
    if (def.Initialise("../default.xml")) {
        var id = options.template_id; // "catalog_" + $value("catalog_guid") + "_" + guid;
        var node;
        if ((node = def.getIndexNode("page", id)) == null)
            wfw.ext.document.messageBox("Cette page '" + id + "' n'a pas encore été publiée");
        else
            window.open("../" + objGetInnerText(node), "_blank");
    }
}

// affiche la page existante du catlogue
function viewCatalog(guid) {
    var page_id = $value("page_id");
    if (empty(page_id)) {
        wfw.ext.document.messageBox("Aucun identificateur de page n'est spécifié");
        return;
    }
    var def = new cXMLDefault();
    if (def.Initialise("../default.xml")) {
        var node;
        if ((node = def.getIndexNode("page", page_id)) == null)
            wfw.ext.document.messageBox("Le catalogue n'a pas encore été publiée");
        else
            window.open("../" + objGetInnerText(node), "_blank");
    }
}

function publishCatalog(onlyMainPage) {
    //telecharge le fichier des items
    var param = {
        "onsuccess": function (obj, xml_doc) {
            var request_list = [];

            //lie les fichiers du dossier client
            request_list.push(
                {
                    url: "req/client/link_data.php",
                    args: { wfw_id: ($value("client_id")), link:"true" },
                    onsuccess: null,
                    onfailed: null,
                    continue_if_failed: true
                }
            );

            //publie la page principale
            request_list.push(
                {
                    url: "req/catalog/make_main_page.php",
                    args: { client_id: ($value("client_id")), update_default:"true" },
                    onsuccess: null,
                    onfailed: null,
                    continue_if_failed: false
                }
            );

            //publie chacun des items
            if (!onlyMainPage) {
                var node = docGetNode(xml_doc, "data/item");
                while (node) {
                    request_list.push(
                        {
                            url: "req/catalog/make_page.php",
                            args: { client_id: ($value("client_id")), item_guid: (objGetAtt(node, "guid")), update_default: "true" },
                            onsuccess: null,
                            onfailed: null,
                            continue_if_failed: true
                        }
                    );
                    node = objGetNext(node, "item");
                }
            }
            //execute les requetes
            wfw.ext.utils.callRequestListXARG(request_list, null);
        } /*,
        no_result: 1*/
    };
    //catalog.xml par arg.file
    wfw.request.Add(null, "clients/data/" + $value("client_id") + "/" + "catalog.xml", null, wfw.utils.onCheckRequestResult_XML, param, false);
}

//nouveau
function newCatalog() {
    //send
    wfw.ext.document.lockElement(
        $doc('new_form'),
        {
            title:"Nouveau ...",
            onOK: function () {//OK

                var fields = wfw.form.get_fields("new_form");
                //initialise l'identifiant automatiquement
                fields.id = strtoname(fields.name);
                fields.page_id = "catalog_" + fields.id;
            
                //recupere les infos sur le fichier
                var param = {
                    "onsuccess": function (obj, args) {
                        var catalog_guid = uniqid();

                        //cree le fichier de contenu
                        wfw.request.Add(
                            null,
                            "../req/client/up.php",
                            {
                                "wfw_id": (args.id),
                                /*"file": {
                                type: "file",
                                filename: "catalog.xml",
                                data: ('<?xml version="1.0"?>\n<data>\n<guid>'+catalog_guid+'</guid>\n</data>')
                                }*/
                                "file": {
                                    headers: [
                                        'Content-Disposition: file; name="file"; filename="catalog.xml"',
                                        'Content-Type: text/plain'
                                    ],
                                    data: ('<?xml version="1.0"?>\n<data>\n<guid>' + catalog_guid + '</guid>\n</data>')
                                }
  
                            },
                            wfw.utils.onCheckRequestResult_XARG, null
                        );

                        //initialise le contenu
                        initCatalog(args.id);

                        //charge l'interface
                        loadCatalog(args.id);
                    }
                };
                wfw.request.Add(null, "req/client/create.php", fields, wfw.utils.onCheckRequestResult_XARG, param, false);
            },
            onCancel : function () {//Cancel
            }
        }
    );
}

//initialise le contenu d'un nouveau catalogue (terms, categories, ...)
function initCatalog(client_id) {
    // ajoute les categories de champs...
    var args = {
        "base": "base_fields",
        "image": "image_fields"
    };
    args.wfw_client_id = client_id;
    args.wfw_list_name = "category";
    wfw.request.Add(null, "req/catalog/set_fields.php", args, wfw.utils.onCheckRequestResult_XARG, null, false);

    // ajoute les definitions de terme...
    var args = {
        //base_fields
        "name":"Nom",
        "desc": "Description",
        //image_fields
        "image": "Image",
        "image_thumbnail": "Image-Miniature"
    };
    args.wfw_client_id = client_id;
    args.wfw_list_name = "set";
    wfw.request.Add(null, "req/catalog/set_fields.php", args, wfw.utils.onCheckRequestResult_XARG, null, false);
}

//charge un catalogue dans l'interface
//client_id : identificateur du catalogue
function loadCatalog(client_id) {
    //recupere les infos sur le catalogue
    var param = {
        "onsuccess": function (obj, args) {
            // $value("client_id", obj.args.wfw_id);
            args["wfw_id"] = obj.args.wfw_id;
            args["client_id"] = obj.args.wfw_id;
            wfw.form.set_fields("form", args);

            //telecharge le contenu du catalogue
            var param = {
                "onsuccess": function (obj, xml_doc) {

                    //obtient le guid du catalogue
                    var guid_node = objGetNode(xml_doc, "data/guid");
                    if (empty(guid_node)) {
                        wfw.ext.document.messageBox("Le catalogue est invalide (GUID Manquant)");
                        return false;
                    }
                    $value("catalog_guid", objGetInnerText(guid_node));
                    $value("catalog_id", args.id);

                    //vide le contenu actuel
                    objRemoveChildNode($doc("catalog_content"), null, REMOVENODE_ALL);
                    objRemoveChildNode($doc("fields_list"), null, REMOVENODE_ALL);
                    objRemoveChildNode($doc("terms_list"), null, REMOVENODE_ALL);
                    wfw.ext.tabMenu.removeAllTab($doc("tabMenu"), $doc("tabMenu_category_tab"), { remove: "after", removeRef: false });

                    //fabrique le template du catalogue
                    wfw.ext.listElement.insertFields($doc("catalog_template"), $doc("catalog_content"), args, xml_doc, null, null);
                    var tabMenu = $doc("tabMenu");
                    wfw.ext.tabMenu.initMenu(tabMenu);

                    //liste les onglets additionnels
                    g_items = []; //guid's des items existants
                    var onglets = {};
                    var item = docGetNode(xml_doc, "/data/item");
                    while (item) {
                        //liste les items par id
                        var id = objGetAtt(item, "id");
                        if (typeof (onglets[id]) == "undefined")
                            onglets[id] = [];
                        onglets[id].push(item);

                        //liste les guids
                        g_items.push(objGetAtt(item, "guid"));

                        //suivant
                        item = objGetNext(item, "item");
                    }

                    //insert les onglets
                    for (var cur in onglets) {
                        var tab_content = wfw.ext.tabMenu.addTab(tabMenu, cur);
                        //fabrique les items
                        for (item in onglets[cur]) {
                            wfw.ext.listElement.insertFields($doc("item_template"), tab_content, null, xml_doc, onglets[cur][item], null);
                        }
                    }

                    //list les definitions de terme utilisés par les items
                    var defs = {};
                    for (var cur in g_items) {
                        //fabrique les items
                        var all = wfw.ext.listElement.getAllFields($doc("fieldlist_" + g_items[cur]), "hidden");
                        defs = object_merge(all, defs);
                    }

                    for (var cur in defs) {
                        var value = cur;
                        var value_node = docGetNode(xml_doc, "/data/set/" + cur);
                        if (value_node != null)
                            value = objGetInnerText(value_node);

                        wfw.ext.fieldlist.insertNew($doc("terms_list"), $doc("item_field_template"), cur, value, false);
                    }

                    //list les champs
                    var item = docGetNode(xml_doc, "/data/fields");
                    if (item) {
                        item = objGetChild(item); //premier
                        while (item) {
                            if (item.nodeType == XML_ELEMENT_NODE) {
                                var name = item.tagName;
                                var value = objGetInnerText(item);
                                var rows = strCharCount(value, "\n\r");
                                wfw.template.insert($doc("item_text_template"), $doc("fields_list"), { name: name, value: value, rows: rows });
                                //wfw.ext.fieldlist.insertNew($doc("fields_list"), $doc("item_text_template"), name, value, false);
                            }
                            //suivant
                            item = objGetNext(item);
                        }
                    }

                    //list les categories
                    var item = docGetNode(xml_doc, "/data/category");
                    if (item) {
                        item = objGetChild(item); //premier
                        while (item) {
                            if (item.nodeType == XML_ELEMENT_NODE) {
                                var name = item.tagName;
                                var value = objGetInnerText(item);

                                wfw.ext.fieldlist.insertNew($doc("category_list"), $doc("item_field_template"), name, value, false);
                            }
                            //suivant
                            item = objGetNext(item);
                        }
                    }

                    //charge un item ?
                    if (!empty(opt.item)) {
                        editItem(opt.item);
                        opt.item = ""; //une seule fois
                    }

                    //[changement de categorie d'item]
                    objSetEvent($doc("edit_item_category"), "change", onChangeItemCategory);

                    //affiche le contenu
                    showEditor(true);
                    showItemEditor(false);
                },
                no_result: 1
            };
            wfw.request.Add(null, "clients/data/" + client_id + "/" + args.file, null, wfw.utils.onCheckRequestResult_XML, param, false);

        }
    };
    wfw.request.Add(null, "req/client/getall.php", { wfw_id: client_id }, wfw.utils.onCheckRequestResult_XARG, param, false);

    //liste les categories de champs
    listCategoryFields();
}

//ouvre un catalogue
function openCatalog() {
    wfw.ext.document.lockFrame(
        'catalog_list.html',
        {
            onOK: function (doc)
            {
                var client_id = objGetAtt(docGetElement(doc, "id"), "value");

                //actualise l'uri
                var uri = wfw.uri.cut(window.location);
                uri.query = "id=" + client_id;
                window.location = wfw.uri.paste(uri);

                //loadCatalog(client_id);
                return true;
            },
            onCancel: function (doc)
            {
                //ne rien faire
            }
        }
    );
}

// supprime le catalogue
function deleteCatalog() {
    //confirmation
    wfw.ext.document.confirm("Etes-vous sur de vouloir supprimer ce catalogue ?",
    //ok
        function () {
            wfw.request.Add(
                null,
                "req/client/remove.php",
                {
                    "wfw_id": $value("client_id")
                },
                wfw.utils.onCheckRequestResult_XARG,
                {
                    onsuccess: function (obj, args) {
                        $doc("form").reset();
                        objRemoveChildNode($doc("catalog_content"), null, REMOVENODE_ALL);
                        objRemoveChildNode($doc("fields_list"), null, REMOVENODE_ALL);
                        objRemoveChildNode($doc("terms_list"), null, REMOVENODE_ALL);
                        wfw.ext.tabMenu.removeAllTab($doc("tabMenu"), $doc("tabMenu_fields_tab"), { remove: "after", removeRef: false });
                        showEditor(false);
                        showItemEditor(false);
                    }
                },
                true
            );
        },
    //annuler
        function () { }
    );

    return false;
}

/*
Ajoute un element OPTION à un element SELECT
*/
function appendSelectOption(select, name, value) {
    var opt = document.createElement('option');
    objSetAtt(opt, "value", name);
    objSetInnerText(opt, value);
    select.appendChild(opt);
}

//insert un nouveau champ
function listCategoryFields() {
    var param = {
        "onsuccess": function (obj, args) {
            var select = $doc("add_category_value");
            objRemoveChildNode(select, null, REMOVENODE_ALL);

            //ok ?
            if (empty(args.id))
                return;

            //initialise la liste
            var idList = strToArray(args.id, ";");
            var typeList = strToArray(args.type, ";");

            for (var i = 0; i < idList.length; i++) {
                if (typeList[i] == "datafield") {
                    var opt = document.createElement('option');
                    objSetAtt(opt, "value", idList[i]);
                    objSetInnerText(opt, idList[i]);
                    select.appendChild(opt);
                }
            }
        }
    };
    wfw.request.Add(null, "req/client/listclient.php", null, wfw.utils.onCheckRequestResult_XARG, param, false);
}

//insert un nouveau a un item
function insertItemField(list, name, value) {
    wfw.ext.fieldlist.insertNew(list, $doc('item_field_template'), name, value);
}

//insert un nouveau champ
function insertField(name, value) {
    wfw.ext.fieldlist.insertNew($doc("fields_list"), $doc('item_field_template'), name, value);
}

//insert un nouveau terme
function insertTermField(name, value) {
    wfw.ext.fieldlist.insertNew($doc("terms_list"), $doc('item_field_template'), name, value);
}

//insert une nouvelle categorie
function insertCategory(name, value) {
    wfw.ext.fieldlist.insertNew($doc("category_list"), $doc('item_field_template'), name, value);
}

//sauve la liste des termes
function saveFields() {
    // setItemFields
    //    var args = wfw.ext.fieldlist.getValues('fields_list');
    var args = wfw.form.get_fields('fields_list');
    args.wfw_client_id = $value("client_id");
    args.wfw_list_name = "fields";
    args.wfw_replace = "true";
    wfw.request.Add(null, "req/catalog/set_fields.php", args, wfw.utils.onCheckRequestResult_XARG, null, false);
}

//sauve la liste des champs
function saveTerm() {
    // setItemFields
//    var args = wfw.ext.fieldlist.getValues('terms_list');
    var args = wfw.form.get_fields('terms_list');
    args.wfw_client_id = $value("client_id");
    args.wfw_list_name = "set";
    args.wfw_replace = "true";
    wfw.request.Add(null, "req/catalog/set_fields.php", args, wfw.utils.onCheckRequestResult_XARG, null, false);

}

//sauve la liste des category
function saveCategory() {
    // setItemFields
//    var args = wfw.ext.fieldlist.getValues('category_list');
    var args = wfw.form.get_fields('category_list');
    args.wfw_client_id = $value("client_id");
    args.wfw_list_name = "category";
    args.wfw_replace = "true";
    wfw.request.Add(null, "req/catalog/set_fields.php", args, wfw.utils.onCheckRequestResult_XARG, null, false);

}

//nouveau
function newItem() {
    //fields
    var fields = wfw.form.get_fields('new_item_form');
    fields.wfw_client_id = $value("client_id");
    //ajoute l'item
    var param = {
        "onsuccess": function (obj, args) {
            window.location = (window.location.origin + window.location.pathname + "?id=" + $value("client_id") + "&item_sel=" + args.guid);
        }
    };
    wfw.request.Add(null, "req/catalog/add_item.php", fields, wfw.utils.onCheckRequestResult_XARG, param, false);
}

//clone un item
function cloneItem(item_guid) {
    //initialise les champs du dialogue
    var fields = wfw.ext.listElement.getAllFields($doc("fieldlist_" + item_guid), "hidden");
    fields.wfw_item_guid = item_guid;
    //id
    var options = wfw.ext.listElement.getAllFields($doc("fieldlist_" + item_guid + "_options"), "hidden");
    fields.wfw_item_id = options.id;
    //
    wfw.form.set_fields('clone_item_form', fields);

    //ouvre le dialogue
    wfw.ext.document.lockElement(
        $doc('clone_item_form'),
        {
            title: "Dupliquer un item ...",
            onOK: function () {//OK
                //obtient les champs
                var fields = wfw.form.get_fields('clone_item_form');
                fields.wfw_client_id = $value("client_id");
                //ajoute l'item
                var param = {
                    "onsuccess": function (obj, args) {
                        window.location = (window.location.origin + window.location.pathname + "?id=" + $value("client_id") + "&item_sel=" + args.guid);
                    }
                };
                wfw.request.Add(null, "req/catalog/clone_item.php", fields, wfw.utils.onCheckRequestResult_XARG, param, false);
            },
            onCancel: function () {//Cancel
            }
        }
    );
}

//supprime un item
function removeItem(item_guid) {
    var fields = {
        wfw_client_id: $value("client_id"),
        wfw_item_guid: item_guid
    };
    var param = {
        "onsuccess": function (obj, args) {
            window.location = (window.location.origin + window.location.pathname + "?id=" + $value("client_id"));
        }
    };
    wfw.request.Add(null, "req/catalog/remove_item.php", fields, wfw.utils.onCheckRequestResult_XARG, param, false);
}

//nouveau
function saveItem() {
    var request_list = [];

    // setItem
    var args = wfw.form.get_fields('edit_item_params');
    args.wfw_client_id = $value("client_id");
    args.wfw_item_guid = $value("edit_item_guid");

    request_list.push({
        url: "req/catalog/setItem.php",
        args: (args),
        continue_if_failed: false
    });

    // setItemFields
    //var args = wfw.ext.fieldlist.getValues('add_item_fields');
    var args = wfw.form.get_fields('add_item_fields', { getStaticNode: true });
    args.wfw_client_id = $value("client_id");
    args.wfw_item_guid = $value("edit_item_guid");

    request_list.push({
        url: "req/catalog/setItemFields.php",
        args: (args),
        continue_if_failed: false
    });

    //go
    wfw.ext.utils.callRequestListXARG(request_list, {
        onsuccess: function (request_list) {
            window.location = (window.location.origin + window.location.pathname + "?id=" + $value("client_id") + "&item=" + request_list[0].obj.args.wfw_item_guid);
        }
    }
    );
}

//nouveau
function onChangeItemCategory(e, p) {
    //insert les valeurs de champs
    var param = {
        "onsuccess": function (obj, args) {
            //supprime les champs actuels
            objRemoveChildNode($doc("add_item_fields"), null, REMOVENODE_ALL);
            //obtient les categories choisies
            var category = $value("edit_item_category");
            category = strexplode(category, ";", true);
            //obtient les categories du catalogue
            var catalog_category = wfw.ext.fieldlist.getValues("category_list");
            //obtient les terms du catalogue
            var catalog_terms = wfw.ext.fieldlist.getValues("terms_list");
            //initialise les champs
            for (var i in category) {
                var category_name = category[i];
                var category_datafield = catalog_category[category_name];
                if (typeof (category_datafield) != "undefined")
                    wfw.ext.datalist.makeFieldList(category_datafield, $doc("item_datafield_template"), $doc("add_item_fields"), null, catalog_terms, args);
            }
        }
    };
    wfw.request.Add(null, "req/catalog/getItemFields.php", { wfw_client_id: $value("client_id"), wfw_item_guid: $value("edit_item_guid") }, wfw.utils.onCheckRequestResult_XARG, param, false);
}

// selectionne un fichier du catalog
function selectFile(element,name) {
    wfw.ext.document.lockFrame(
        "client_file_list.html?id=" + $value("client_id") + "&filter_type=image/*",
        {
            onOK: function (doc) {
                //wfw.ext.document.lockFrame("uploding.html");
                var value = objGetAtt($doc("file_name", doc), "value");
                //wfw.form.set_fields(element, { name: value });
                objSetInnerText(element, value);
                return false;
            },
            onCancel: function (doc) {
                return false;
            }
        }
    );
}

// selectionne un fichier du catalog
function selectImage(element, name) {
    wfw.ext.document.lockFrame(
        "client_image_list.html?client_id=" + $value("client_id") + "&sel=" + name + "&use_private_path=true",
        {
            onOK: function (doc) {
                //wfw.ext.document.lockFrame("uploding.html");
                var value = objGetAtt($doc("file_name", doc), "value");
                //wfw.form.set_fields(element, { name: value });
                objSetInnerText(element, value);
                return false;
            },
            onCancel : function (doc) {
                return false;
            }
        }
    );
}

//ouvre un catalogue
function editItem(guid) {
    //obtient les options
    var options = {};
    var input_node = nodeEnumNodes($doc("fieldlist_" + guid + "_options"), function (node) {
        if ((node.nodeType == ELEMENT_NODE) && (node.tagName.toLowerCase() == "input") && objGetAtt(node, "type") == "hidden") {
            options[objGetAtt(node, "name")] = objGetAtt(node, "value");
        }
        return true;
    }, false);

    //definit les options
    wfw.form.set_fields("edit_item_options", options);

    //vide la liste en cours
    objRemoveChildNode($doc("add_item_fields"),null,REMOVENODE_ALL);
//    wfw.ext.fieldlist.deleteList($doc("add_item_fields"));

    //insert les valeurs de champs
    onChangeItemCategory(null, null);

    //selectionne l'onglet
    wfw.ext.tabMenu.selectTab($doc("tabMenu"), $doc("tabMenu_newItem_tab"));

    //affiche l'editeur
    showItemEditor(true);
}

// insert un fichier
function saveCatalog() {
    var args = wfw.form.get_fields($value("catalog_id"));
    args.wfw_id = $value("client_id");

    //sauve le dossier client
    wfw.request.Add(
        null,
        "../req/client/set.php",
        args,
        wfw.utils.onCheckRequestResult_XARG,
        {
            onsuccess: function (obj, args) {
                wfw.ext.document.messageBox("Sauvegarde terminé");
            }
        },
        false
    );

    return false;
}

function showItemEditor(bshow) {
    if (bshow) {
        if (empty($value("edit_item_guid"))) {
            wfw.ext.document.messageBox("Aucun item n'est en cours d'édition. Choisissez d'abord un item puis cliquez sur 'Modifier'");
            return;
        }

        wfw.style.addClass($doc("edit_item_no_content"), "wfw_hidden");
        wfw.style.removeClass($doc("edit_item_content"), "wfw_hidden");
    }
    else {
        wfw.style.removeClass($doc("edit_item_no_content"), "wfw_hidden");
        wfw.style.addClass($doc("edit_item_content"), "wfw_hidden");
    }
}

function showEditor(bshow) {

    if (bshow) {
        wfw.style.addClass($doc("welcome_screen"), "wfw_hidden");
        wfw.style.removeClass($doc("edit_menu"), "wfw_hidden");
        wfw.style.removeClass($doc("editor"), "wfw_hidden");
    }
    else {
        wfw.style.addClass($doc("editor"), "wfw_hidden");
        wfw.style.addClass($doc("edit_menu"), "wfw_hidden");
        wfw.style.removeClass($doc("welcome_screen"), "wfw_hidden");
    }
}

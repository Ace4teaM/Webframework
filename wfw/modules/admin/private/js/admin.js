/*
    (C)2011 ID-Informatik. All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    Fonctions globales
*/


wfw.event.SetCallback( // window
    "wfw_window",
    "load",
    "onInit",
    function (e) {
        initModuleList();
        initWidgetList();
    }
);

// 
function initWidgetList()
{
    if(typeof(wfw.ext)=="undefined")
        return;
    var widget = wfw.ext.navigator.doc.getConfigNode("widget");
    //var module = docGetNode(wfw.ext.navigator.navDoc,"site/config/module",null);
    //var template = $doc("widget_template");

    while(widget != null)
    {
        //fabrique le template
        wfw.ext.listElement.insertFields($doc("widget_template"),$doc("widget"),null,wfw.ext.navigator.navDoc,widget);

        /*var newElement = nodeCloneNode(template,true);
        objInsertNode(newElement,$doc("modules"),null,INSERTNODE_END);
        wfw.template.make(document,newElement,wfw.ext.navigator.navDoc,module);
        wfw.style.removeClass(newElement,"wfw_hidden");*/

        //suivant
        widget = objGetNext(widget,"widget");
    }
}


// obtient l'id de reference
function initModuleList()
{
    if(typeof(wfw.ext)=="undefined")
        return;
    var module = wfw.ext.navigator.doc.getConfigNode("module");
    //var module = docGetNode(wfw.ext.navigator.navDoc,"site/config/module",null);
    var template = $doc("module_template");

    while(module != null)
    {
        //fabrique le template
        wfw.ext.listElement.insertFields($doc("module_template"),$doc("modules"),null,wfw.ext.navigator.navDoc,module);

        /*var newElement = nodeCloneNode(template,true);
        objInsertNode(newElement,$doc("modules"),null,INSERTNODE_END);
        wfw.template.make(document,newElement,wfw.ext.navigator.navDoc,module);
        wfw.style.removeClass(newElement,"wfw_hidden");*/

        //suivant
        module = objGetNext(module,"module");
    }

    listEvent();
}


function update() {
    wfw.request.Add(null, "req/update.php", null, wfw.utils.onCheckRequestResult_XARG, null, false);

    return true;
}

function configure() {
    wfw.ext.navigator.openPage("config");
    return true;
}

function update_location() {
    wfw.ext.navigator.openPage("location");
    return true;
}

function showEvent(guid,type,client_id) {
    var param = {
        "onsuccess": function (obj, args) {
            wfw.ext.document.lockFrame(
                "client_event_" + type + ".html?id=" + client_id,
                {
                    onOK: function (doc, wnd) {
                        //execute l'action choisi
                        var action = docGetElement(doc, "action");
                        var fields = wfw.form.get_fields(action);

                        if (fields != null) {
                            switch (fields.action) {
                                case "link":
                                    var uri = objGetAtt(objGetElement(doc, "action_link"), "value");
                                    window.location = uri;
                                    break;
                                case "open":
                                    var pageid = objGetAtt(objGetElement(doc, "action_open"), "value");
                                    wfw.ext.navigator.openPage(pageid);
                                    break;
                                case "remove":
                                    removeEvent(guid, client_id);
                                    break;
                                case "exec":
                                    var bEraseEvent = false;
                                    if (typeof (fields.action_exec) != "undefined") {
                                        var options = { bEraseEvent: false, bDeleteData: false };
                                        eval("wnd." + fields.action_exec + "(window,options);");
                                        //supprime l'événement ?
                                        if (options.bEraseEvent == true) {
                                            var param = {
                                                onsuccess: function (obj, args) {
                                                    nodeRemoveNode(this.node);
                                                },
                                                node: $doc(guid)
                                            };
                                            wfw.request.Add(null, "req/client/remove_event.php", { wfw_id: client_id }, wfw.utils.onCheckRequestResult_XARG, param, false);
                                        }
                                        //supprime les données ?
                                        if (options.bDeleteData == true) {
                                            wfw.request.Add(null, "req/client/remove.php", { wfw_id: client_id }, wfw.utils.onCheckRequestResult_XARG, null, false);
                                        }
                                    }
                                    if (bEraseEvent == true)
                                        removeEvent(guid, client_id);
                                    break;
                            }
                        }
                    },
                    onCancel: function (doc, wnd) {
                    }
                }
            );
        }
    };
    //envoie la requete
    wfw.request.Add(null, "req/client/getall.php", { wfw_id: client_id, get_private: "1" }, wfw.utils.onCheckRequestResult_XARG, param, false);
    return true;
}

function removeEvent(guid, client_id) {
    wfw.ext.document.confirm("Etes-vous sur de vouloir supprimer cet événement et ses données ?",
        //ok...
        function () {
            var request_list = [];

            //Supprime l'événement
            request_list.push(
                {
                    name: "Supprime l'événement",
                    url: "req/client/remove_event.php",
                    args: { wfw_id: client_id },
                    continue_if_failed: false
                }
            );

            //Supprime le dossier client
            request_list.push(
                {
                    name: "Supprime le dossier client",
                    url: "req/client/remove.php",
                    args: { wfw_id: client_id },
                    continue_if_failed: false
                }
            );

            //execute les requetes
            wfw.ext.utils.callRequestListXARG(request_list,
                {
                    onsuccess: function (reqList) {
                        nodeRemoveNode(this.event_element);
                    },
                    event_element: $doc(guid)
                }
            );
        },
        //cancel...
        function () { }
    );
}

function ignoreEvent(guid, client_id) {
    var param = {
        onsuccess: function (obj, args) {
            nodeRemoveNode(this.node);
        },
        node: $doc(guid)
    };
    wfw.request.Add(null, "req/client/remove_event.php", { wfw_id: client_id }, wfw.utils.onCheckRequestResult_XARG, param, false);
}

function listEvent() {
    var param = {
        "onsuccess": function (obj, args) {
            var list = $doc("file_list_content");
            objRemoveChildNode(list, null, REMOVENODE_ALL);

            //ok ?
            if (empty(args.name))
                return;

            //initialise la liste
            var nameList = strToArray(args.id, ";");
            var typeList = strToArray(args.type, ";");
            var dateList = strToArray(args.date, ";");
            var timeList = strToArray(args.time, ";");
            for (var i = 0; i < nameList.length; i++) {
                var event_param = {
                    "onsuccess": function (event_obj, event_args) {
                        event_args._guid_ = uniqid();
                        if (empty(event_args.wfw_note))
                            event_args.wfw_note = "Sans Titre";
                        var template = wfw.template.insert($doc("event_template"), $doc("event_list"), event_args);
                        objSetAtt(template, "id", event_args._guid_);
                    }
                };
                //envoie la requete
                wfw.request.Add(null, "req/client/getall.php", { wfw_id: nameList[i], get_private: "1" }, wfw.utils.onCheckRequestResult_XARG, event_param, false);
            }

            wfw.style.removeClass($doc("events"), "wfw_hidden");
        }
    };
    //envoie la requete
    wfw.request.Add(null, "req/client/listevent.php", null, wfw.utils.onCheckRequestResult_XARG, param, false);
    return true;
}

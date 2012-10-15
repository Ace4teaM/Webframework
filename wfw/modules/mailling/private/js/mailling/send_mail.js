
//options par defaut
var opt = {
    id: "", //selection en cours
    html_msg: "" //selection en cours
};

//initialise l'editeur
tinyMCE.init({
    // General options
    mode: "exact",
    theme: "advanced",
    plugins: "wfw_image,autolink,lists,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
    elements: "html_msg",
    language: "fr",
    entity_encoding: "raw", //sans encodage, pour les templates temporaires
    // Theme options
    theme_advanced_buttons1: "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect",
    theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,wfw_image,cleanup,code,|,insertdate,inserttime,|,forecolor,backcolor",
    theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
    theme_advanced_toolbar_location: "top",
    theme_advanced_toolbar_align: "left",
    theme_advanced_statusbar_location: "bottom",
    theme_advanced_resizing: false,

    // Skin options
    skin: "o2k7",
    skin_variant: "silver",

    // Drop lists for link/image/media/template dialogs
    template_external_list_url: "js/template_list.js",
    external_link_list_url: "js/link_list.js",
    external_image_list_url: "js/image_list.js",
    media_external_list_url: "js/media_list.js",

    // Replace values for the template plugin
    template_replace_values: {
        username: "Some User",
        staffid: "991234"
    },

    //Display
    height: "480",
    width: "580"
});

wfw.event.SetCallback( // window
    "wfw_window",
    "load",
    "onLoadForm",
    function () {
        // obtient les options 
        var uri_fields = wfw.utils.getURIFields();
        if (uri_fields != null) {
            for (opt_name in opt) {
                if (typeof (uri_fields[opt_name]) == "string")
                    opt[opt_name] = uri_fields[opt_name];
            }
        }

        //charge un document ?
        if (!empty(opt.id)) {
            load_mail(opt.id);
        }

        //initialise depuis l'uri
        wfw.form.initFromURI("form", "form", null);
        wfw.form.initFromURI("menu", "menu", null);
        if (!empty(opt["html_msg"]))
            tinyMCE.get('html_msg').setContent(opt["html_msg"]);
    }
);

function switch_edit_mode(bHtml) {
    if (bHtml) {
        wfw.style.addClass($doc("msg"), "wfw_hidden");
        tinyMCE.get('html_msg').show();
        wfw.style.removeClass($doc("html_msg"), "wfw_hidden");
        //$value("html_mode", "on");
    }
    else {
        wfw.style.removeClass($doc("msg"), "wfw_hidden");
        tinyMCE.get('html_msg').hide();
        wfw.style.addClass($doc("html_msg"), "wfw_hidden");
        //$value("html_mode", "off");
    }
}

function viewTemplate() {
    //genere le fichier template temporaire
    var fields = wfw.form.get_fields("form");
    fields["input"] = $value("template_base") + $value("template");
    fields["output"] = "template/tmp/mail.html";
    fields["html_msg"] = tinyMCE.get('html_msg').getContent();

    wfw.request.Add(
        "viewTemplate",
        'wfw/req/template.php',
        fields,
        wfw.utils.onCheckRequestResult_XARG,
        {
            onsuccess: function (obj, args) {
                window.open("template/tmp/mail.html", "_blank");
                //affiche le template dans une frame
                /*wfw.ext.document.lockFrame(
                    "template/tmp/mail.html",
                    "Aperçu de votre mail", function (doc) { }, null
                );*/
            }
        },
        false
    );
}

function importUserList() {
    wfw.ext.document.lockFrame(
        'user_list.html?field=mail&sel=' + wfw.uri.encodeUTF8($value("to")),
        {
            onOK: function (doc) {
                //recupere la liste des utilisateurs choisi
                var list = docGetElement(doc, "field");
                $value("to", objGetAtt(list, "value"));
                return true;
            }
        }
    );
}

function removeAttachement() {
    $value("attachments", "");
}

function importFileList() {
    wfw.ext.document.lockFrame(
        'client_file_list.html?id=private_upload&sel_type=multiple&sel=' + wfw.uri.encodeUTF8($value("attachments")),
        {
            onOK: function (doc) {
                //recupere la liste des fichiers choisi
                var list = $value(docGetElement(doc, "file_name"));
                $value("attachments", list);
                return true;
            },
            onCancel: function (doc) { }
        }
    );
	return false;
}

function new_mail() {
    //send
    wfw.ext.document.lockElement(
        $doc('new_doc_form'),
        {
            title : "Nouveau ...",
            onOK: function () {//OK
                //supprime le contenu existant
                objSetInnerText($doc("msg"), "");
                $doc("form").reset();
                //recupere les données
                var fields = wfw.form.get_fields("new_doc_form");
                //cree le dossier
                var param = {
                    "onsuccess": function (obj, args) {
                        $value("wfw_id", args.id);

                        //init
                        wfw.form.set_fields("form", obj.args);
                        tinyMCE.get('html_msg').setContent(fields.html_msg);

                        switch_edit_mode((fields.html_mode == "on") ? true : false);

                        showEditor(true);
                    }
                };
                wfw.request.Add(null, "req/client/create.php", fields, wfw.utils.onCheckRequestResult_XARG, param, false);
            },
            onCancel : function () {//Cancel
            }
        }
    );
}

// insert un fichier
function save() {
    // sauve le mail dans un dossier client
    var client_id = $value("wfw_id");
    var send_args = wfw.form.get_fields("form");
    send_args["wfw_type"] = "mail";
    send_args["html_msg"] = tinyMCE.get('html_msg').getContent();
    if (empty(send_args.wfw_id))
        return;

    wfw.request.Add(null, "req/client/set.php", send_args, wfw.utils.onCheckRequestResult_XARG,
        {
            onsuccess: function (obj, args) {
                //initialise dans le document
                wfw.ext.document.messageBox("Dossier N°" + args.id);
                $value("wfw_id", args.id);
            }
        },
        false
    );

    return false;
}

//
function load_mail(client_id) {
    var param = {
        "onsuccess": function (obj, args) {
            $value("wfw_id", obj.args.wfw_id);
            wfw.form.set_fields("form", args);
            tinyMCE.get('html_msg').setContent(args["html_msg"]);

            switch_edit_mode((args.html_mode == "on") ? true : false);

            showEditor(true);
        }
    };
    wfw.request.Add(null, "req/client/getall.php", { wfw_id: client_id }, wfw.utils.onCheckRequestResult_XARG, param, false);
}

//
function open_mail() {
    wfw.ext.document.lockFrame(
        "client_list.html?type=mail&use_name=subject",
        {
            title: "Ouvrir...",
            onOK: function (doc) //ok
            {
                //recupere les infos sur le fichier
                var client_id = objGetAtt(docGetElement(doc, "id"), "value");
                if (empty(client_id))
                    return;

                load_mail(client_id);

                return true;
            },
            onCancel: function (doc) //cancel
            {
                //ne rien faire
            }
        }
    );
}

// supprime le fichier
function delete_mail() {
    //confirmation
    wfw.ext.document.confirm("Etes-vous sur de vouloir supprimer ce courrier ?",
    //ok
        function () {
            wfw.request.Add(
                null,
                "req/client/remove.php",
                {
                    "wfw_id": $value("wfw_id")
                },
                wfw.utils.onCheckRequestResult_XARG,
                {
                    onsuccess: function (obj, args) {
                        $doc("form").reset();
                        showEditor(false);
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

function selectCronTime() {
    // obtient la date d'execution
    wfw.ext.document.lockFrame(
        'cron_time.html?time=' + wfw.uri.encodeUTF8($value("cron_time")),
        {
            title: "Choisissez la fréquence d'exécution...",
            onOK: function (doc) {
                var time = $value(docGetElement(doc, "time"));
                $value($doc("cron_time"), time);
            },
            onCancel: function (doc) {
            }
        }
    );
}

function send_mail_to_task() {
    $value("task_name", "mailling_" + strtoid($value("wfw_id")));

    // obtient la date d'execution
    wfw.ext.document.lockElement(
        $doc("task_form"),
        {
            title: "Planifier l'envoie...",
            onOK: function (doc) {
                var time = $value("cron_time");
                var name = $value("task_name");
                var task_name = name;
                var client_id = name;

                /*
                Prepare les données
                */
                var attachments = strexplode($value("attachments"), ';', true);

                //requete simple ou avec pieces jointes ? (path relatif à la racine du site)
                var req_file = "private/req/mailling/mail.php";
                if (length(attachments))
                    req_file = "private/req/mailling/mail_esmtp.php";

                /*
                Crée le dossier client <request>
                */
                var send_args = wfw.form.get_fields("form");
                send_args["wfw_type"] = "request";
                send_args["wfw_req_uri"] = req_file;
                send_args["wfw_task_name"] = task_name;
                send_args["wfw_exec_count"] = $value("exec_count");
                send_args["wfw_id"] = client_id; //definit l'id
                send_args["html_msg"] = tinyMCE.get('html_msg').getContent();

                wfw.request.Add(null, "req/client/create.php", send_args, wfw.utils.onCheckRequestResult_XARG,
                    {
                        "onsuccess": function (obj, args) {
                            /*
                            Crée la tache cron
                            */
                            send_args = {
                                wfw_id: (args.id),
                                cron_time: (time),
                                task_name: (task_name)
                            };
                            wfw.request.Add(null, "req/client/set_task.php", send_args, wfw.utils.onCheckRequestResult_XARG,
                                {
                                    "onsuccess": function (obj, args) {
                                        wfw.ext.document.messageBox("L'envoie du message à été planifié avec l'identifiant de tâche: " + task_name);
                                    }
                                },
                                false
                            );
                        }
                    },
                    false
                );
            },
            onCancel: function (doc) { } //annuler
        }
    );

    return false;
}

function send_mail() {
    var attachments = strexplode($value("attachments"), ';', true);

    //requete simple ou avec pieces jointes ?
    var req_file = "req/mailling/mail.php";
    if (length(attachments))
        req_file = "req/mailling/mail_esmtp.php";

    objSetInnerText($doc("html_msg"), tinyMCE.get('html_msg').getContent());

    wfw.form.sendReq("form", req_file, false, wfw.utils.onCheckRequestResult_XARG,
        {
            "onsuccess": function (obj, args) {
                var i = 1;
                while (typeof (args["send_" + i]) == "string") {
                    wfw.ext.document.print(args["send_" + i]);
                    i++
                }
                wfw.ext.document.printOK(wfw.ext.document.getDialog(), "wfw_ext_dialog_content", null);
            }
        }
    );

    return false;
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
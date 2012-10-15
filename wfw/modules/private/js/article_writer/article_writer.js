
/*
    Initialise le document
*/

wfw.event.SetCallback( // window
    "wfw_window",
    "load",
    "onLoadDoc",
    function()
    {
        //initialise les formulaires
        wfw.form.initFromURI("form","form",null);
        wfw.form.initFromURI("delete_doc_form","delete_doc_form",null);
        wfw.form.initFromURI("publish_doc_form","publish_doc_form",null);
        wfw.form.initFromURI("save_doc_form","save_doc_form",null);
        
        //initialise l'editeur
        tinyMCE.init({
                // General options
                mode : "exact",
                theme : "advanced",
                plugins : "wfw_image,autolink,lists,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
                elements : "input",
                language : "fr",
                entity_encoding : "raw",//sans encodage, pour les templates temporaires
                // Theme options
                theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,wfw_image,cleanup,code,|,insertdate,inserttime,|,forecolor,backcolor",
                theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_toolbar_location : "top",
                theme_advanced_toolbar_align : "left",
                theme_advanced_statusbar_location : "bottom",
                theme_advanced_resizing : true,

                // Skin options
                skin : "o2k7",
                skin_variant : "silver",

                // Example content CSS (should be your site CSS)
                /*content_css : "../css/default.css",*/

                // Drop lists for link/image/media/template dialogs
                template_external_list_url : "js/template_list.js",
                external_link_list_url : "js/link_list.js",
                external_image_list_url : "js/image_list.js",
                media_external_list_url : "js/media_list.js",

                // Replace values for the template plugin
                template_replace_values : {
                        username : "Some User",
                        staffid : "991234"
                },

                //Display
                height : "480",
                width : "100%"
        });

        //automatique ID
        setAutoID(true);

        //evenements name change
        objSetEvent($doc("name"),"keyup",
            function(e)
            {
                //objAlertMembers(e);
                var input = $doc("id");
                if(wfw.style.haveClass(input,"auto"))
                {
                    $value(input,strtoname(this.value));
                }
            }
        );
        //evenements id lock/unlock
        objSetEvent($doc("lock_id"),"change",
            function(e)
            {
                if(this.checked)
                    setAutoID(false);
                else
                {
                    setAutoID(true);
                    $value($doc("id"),strtoname($value("name")));
                }
            }
        );
        //evenements id lock/unlock
        objSetEvent($doc("auto_page_id"),"change",
            function(e)
            {
                var edit = $doc("new_page_id");
                if(!this.checked)
                {
                    $value(edit,strtoname($value("new_page_name")));
                    objSetAtt(edit,"readonly","readonly");
                }
                else
                    objRemoveAtt(edit,"readonly");
            }
        );
        objSetEvent($doc("new_page_name"),"keyup",
            function(e)
            {
                var edit = $doc("new_page_id");
                if(!$doc("auto_page_id").checked)
                {
                    $value(edit,strtoname($value("new_page_name")));
                }
            }
        );
    }
);

//dialogue de selection du document parent
function findParentFile()
{
    var list = new Array();
    
    var param = {
        "onsuccess" : function(obj,xml_doc)
        {
            $value("parent_id","");
            //obtient l'id
            var page_id = $value("org_id");
            if(empty(page_id))
                { wfw.puts("findParentFile: empty(page_id)"); return false; }
            //obtient le noeud
            var node = wfw.ext.navigator.getPageNode(page_id,xml_doc);
            if(node==null)
                { wfw.puts("findParentFile: node==null, id="+page_id); return false; }
            //obtient le noeud parent
            var parentNode = objGetParent(node,null);
            if(parentNode==null)
                { wfw.puts("findParentFile: parentNode==null"); return false; }
            //definit le parent
            $value("parent_id",parentNode.tagName);
            wfw.puts("findParentFile: ok "+parentNode.tagName);
        },
        no_result : true // obtient uniquement le contenu du fichier
    };

    //charge le document
    wfw.request.Add(null,"../default.xml",null,wfw.utils.onCheckRequestResult_XML,param,false);

    return false;
}

//dialogue de selection du document parent
function selectParentFile()
{
    wfw.ext.document.lockFrame(
        'doc_list.html',
        {
            onOK : function(doc)
            {
                //recupere la liste des fichiers choisi
                var file_id   = $value(docGetElement(doc,"id"));
                //var file_name = docGetElement(doc,"name");
                if(!empty(file_id))
                    $value("parent_id",file_id);
                return true;
            },
            onCancel : function(doc){}//annuler
        }
    );
}

//dialogue de selection du document parent
function selectTemplateDir()
{
    wfw.ext.document.lockFrame(
        'template_list.html',
        {
            onOK : function(doc)//ok
            {
                //recupere la liste des fichiers choisi
                var file_id   = $value(docGetElement(doc,"id"));
                //var file_name = docGetElement(doc,"name");
                if(!empty(file_id))
                    $value("output_dir",file_id);
                return true;
            },
            onCancel : function(doc){}//annuler
        }
    );
}

function choosePageId(){
    wfw.ext.document.lockFrame(
        'doc_list.html',
        {
            onOK : function(doc)//ok
            {
                //recupere le fichier choisi
                var file_id   = $value(docGetElement(doc,"id"));
                if(!empty(file_id))
                {
                    $value("new_page_id",file_id);
                    objSetAtt($doc("auto_page_id"),"checked","checked");
                }
                return true;
            },
            onCancel : function(doc){}//annuler
        }
    );
}

//nouvel article
function newArticle()
{
    wfw.ext.document.lockElement(
        $doc('new_doc_form'),
        {
            title : "Nouveau ...",
            onOK : function(){//OK

                var fields = wfw.form.get_fields("new_doc_form");
            
                //auto page-id?
                if(!$doc("auto_page_id").checked)
                {
                    fields.id = strtoname(fields.name);
                    //page id ?
                    if(empty(fields.id))
                    {
                        wfw.ext.document.messageBox("Veuillez spécifier le nom de votre page");
                        return;
                    }
                }
                //page-id manuelle ?
                else
                {
                    //assure le format de l'id
                    if(cInputName.isValid(fields.id)!=ERR_OK)
                    {
                        wfw.ext.document.messageBox("Le format de l'identificateur de page '"+fields.id+"' est invalide");
                        return;
                    }
                }

                //la page existe ?
                var defaultDoc = new cXMLDefault();
                if(defaultDoc.Initialise("../default.xml"))
                {
                    if(defaultDoc.getIndexNode("page",fields.id)!=null)
                    {
                        wfw.ext.document.confirm("La page '"+fields.id+"' existe déja voulez-vous la remplacer ?",function(){createArticle(fields);});
                        return;
                    }
                }

                //cree la page
                createArticle(fields);
            },
            onCancel : function(){//Cancel
            }
        }
    );
}

//crée l'article
function createArticle(fields)
{
    //crée le dossier de données
    var param = {
        "onsuccess" : function(obj,args)
        {
            //recupere les infos sur le fichier
            tinyMCE.get('input').setContent("");
            $value("client_id",args.id);
            $value("org_id",fields.id);
            $value("org_name",fields.name);
            $value("parent_id",fields.parent_id);
            $value("category",fields.category);
            $value("author",fields.author);
            $value("output_dir",fields.output_dir);

            setAutoID(true);
            showEditor(true);
        }
    };
    wfw.request.Add(null,"req/client/create.php",fields,wfw.utils.onCheckRequestResult_XARG,param,false);
            
    //cree le fichier de contenu HTML
    wfw.request.Add(
        null,
        "../req/client/up.php",
        {
            "wfw_id":$value("client_id"),
            "file":{
                headers: [
                    'Content-Disposition: file; name="file"; filename="last.txt"',
                    'Content-Type: text/plain'
                ],
                data: "Contenu de votre article"
            }
        },
        wfw.utils.onCheckRequestResult_XARG,null
    );
}

//dialogue de selection de l'article à ouvrir
function openArticle()
{
    wfw.ext.document.lockFrame(
        'article_list.html',
        {
            onOK : function(doc) //ok
            {
                var client_id = objGetAtt(docGetElement(doc,"id"),"value");
            
                //recupere les infos sur le fichier
                var param = {
                    "onsuccess" : function(obj,args)
                    {
                        //actualise les champs
                        wfw.form.set_fields('org_fields',
                            object_merge(args,{"wfw_id":client_id})
                        );
                    
                        setAutoID(false);

                        //telecharge le fichier
                        var param = {
                            "onsuccess" : function(obj,args)
                            {wfw.puts(args);
                                //recupere le contenu du fichier
                                wfw.request.Add(null,"../"+args.path,null,
                                    function(obj){
                                        if(wfw.utils.onCheckRequestStatus(obj))
                                        {
                                            tinyMCE.get('input').setContent(obj.response);
                                        }
                                    },
                                    null,
                                    false
                                );
                            }
                        };
                        wfw.request.Add(null,"../req/client/down.php",{wfw_id:client_id,filename:(args.file)},wfw.utils.onCheckRequestResult_XARG,param,false);
                    
                        showEditor(true);
                    }
                };
                wfw.request.Add(null,"req/client/getall.php",{wfw_id:client_id},wfw.utils.onCheckRequestResult_XARG,param,false);
            
                return true;
            },
            onCancel : function(doc) //cancel
            {
                //ne rien faire
            }
        }
    );
}

// insert un fichier
function save_doc()
{
    //initialise le dialogue
    wfw.form.set_fields('save_doc_form',wfw.form.get_fields("org_fields"));
    /*    {
            "wfw_id":$value("client_id"),
            "id":$value("org_id"),
            "name":$value("org_name"),
            "keywords":$value("org_name"),
            "name":$value("org_name"),
            "name":$value("org_name"),
            "name":$value("org_name")
        }
    );*/

    //send
    wfw.ext.document.lockElement(
        $doc('save_doc_form'),
        {
            title : "Sauvegarder ...",
            onOK : function(e,dlg){//OK
                var args = wfw.form.get_fields('save_doc_form');
                //actualise les champs originaux
                wfw.form.set_fields('org_fields',args);
            
                var request_list = [];
    
                //depublie le document en cours
                request_list.push(
                    {
                        name: "Dépublication",
                        url: "req/article_writer/unpublish.php",
                        args: {
                            client_id:($value("client_id"))
                        },
                        onsuccess: null,
                        onfailed: null,
                        continue_if_failed: false
                    }
                );

                //sauve les attributs
                request_list.push(
                    {
                        name: "Sauvegarde des données",
                        url: "../req/client/set.php",
                        args: args,
                        onsuccess: function(obj,args){
                            $value("client_id",args.id);
                            $value("org_id",$value("id"));
                            $value("org_name",$value("name"));
                        },
                        onfailed: null,
                        continue_if_failed: false
                    }
                );
    
                //sauve le contenu HTML
                request_list.push(
                    {
                        name: "Sauvegarde du contenu",
                        url: "../req/client/up.php",
                        args: {
                            "wfw_id":$value("client_id"),
                            "file":{
                                headers: [
                                    'Content-Disposition: file; name="file"; filename="last.txt"',
                                    'Content-Type: text/plain'
                                ],
                                data: (tinyMCE.get('input').getContent())
                            }
                        },
                        onsuccess: null,
                        onfailed: null,
                        continue_if_failed: false
                    }
                );

                //publie le document
                if ($doc("publish_on_save").checked) {
                    request_list.push(
                        {
                            name: "Publication",
                            url: "req/article_writer/publish.php",
                            args: {
                                client_id:($value("client_id"))
                            },
                            onsuccess: null,
                            onfailed: null,
                            continue_if_failed: false
                        }
                    );
                }
                //execute les requetes
                wfw.ext.utils.callRequestListXARG(request_list, null);
            },
            onCancel : function(){//Cancel
            }
        }
    );

    return false;
}

function save_doc_content()
{
    wfw.request.Add(
        null,
        "../req/client/up.php",
        {
            "wfw_id":$value("client_id"),
            /*"file":{
                type:"file",
                filename:"last.txt",
                data:(tinyMCE.get('input').getContent())
            }*/
            "file":{
                headers: [
                    'Content-Disposition: file; name="file"; filename="last.txt"',
                    'Content-Type: text/plain'
                ],
                data: (tinyMCE.get('input').getContent())
            }
        },
        wfw.utils.onCheckRequestResult_XARG,
        {
            onsuccess : function(obj,args){
                wfw.ext.document.print("Sauvegarde du contenu OK");
            },
            onfailed : function(obj,args){ wfw.stdEvent.onFormResult("save_doc_form",args); },
            onerror : function(obj){wfw.ext.document.print("save_doc_content onerror"); },
        },
        false
    );

    return false;
}

// publie le fichier
function publish_doc()
{
    //depublie le document en cours
    wfw.request.Add(
        null,
        "req/article_writer/unpublish.php",
        {
            client_id:($value("client_id"))
        },
        wfw.utils.onCheckRequestResult_XARG,
        {
            onsuccess : function(obj,args){
                wfw.ext.document.print("Dépublication OK");
            }
        },
        false
    );
    
    //publie
    wfw.request.Add(
        null,
        "req/article_writer/publish.php",
        {
            client_id:($value("client_id"))
        },
        wfw.utils.onCheckRequestResult_XARG,
        {
            onsuccess : function(obj,args){
                wfw.ext.document.print("Publication OK");
            }
        },
        false
    );
    
    return false;
}

// 
function setAutoID(bAuto)
{
    var lock_id = $doc("lock_id");
    var id = $doc("id");
    if(bAuto)
    {
        id.readOnly=true;
        lock_id.checked=false;
        wfw.style.addClass($doc("id"),"auto");
    }
    else{
        id.readOnly=false;
        $doc("lock_id").checked=true;
        wfw.style.removeClass($doc("id"),"auto");
    }
}

// affiche le document
function view_doc()
{
    var def = new cXMLDefault();
    if(def.Initialise("../default.xml"))
    {
        var id = $value("org_id");
        var node;
        if((node = def.getIndexNode("page",id))==null)
            wfw.ext.document.messageBox("Cette page n'a pas encore été publiée");
        else
            window.open("../"+objGetInnerText(node),"_blank");
    }
}

// supprime le fichier
function delete_doc()
{
    //confirmation
    wfw.ext.document.lockElement(
        $doc('delete_doc_form'),
        {
        title:"Supprimer ...",
            //ok
            onOK : function(){
                var request_list = [
                    {
                        url:"req/article_writer/unpublish.php",
                        args:{ "client_id":$value("client_id") },
                        onsuccess:null,
                        onfailed:null,
                        continue_if_failed:true
                    }
                ];
                //supprimer definitivement ?
                if($doc("not_remove").checked == false)
                {
                    request_list.push(
                        {
                            url:"req/client/remove.php",
                            args:{ "wfw_id":$value("client_id") },
                            onsuccess:null,
                            onfailed:null,
                            continue_if_failed:true
                        }
                    );
                }
          
                wfw.ext.utils.callRequestListXARG(request_list,null);

                //if(request_results == true)
                $doc("new_doc_form").reset();
                showEditor(false);
            },
            //annuler
            onCancel : function(){}
        }
    );

    return false;
}

function showEditor(bshow) {
    if(bshow) {
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
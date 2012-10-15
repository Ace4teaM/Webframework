
// fichiers sélectionnés
var selection = new Object();       // selection des dossiers ("name"=>element)
var field_selection = new Object(); // selection des champs ("name"=>element)

//options
var opt = {
    id:"" //dossier de selection
};

/*
    OnLoad Event
*/
wfw.event.SetCallback( // window
    "wfw_window",
    "load",
    "onLoadForm",
    function()
    {
        // obtient les options 
        var uri_fields = wfw.utils.getURIFields();
        if(uri_fields != null)
        {
            for(opt_name in opt)
            {
                if(typeof(uri_fields[opt_name])=="string")
                    opt[opt_name] = uri_fields[opt_name];
            }
        }

        wfw.form.initFromURI("new_file_form","new_file_form",null);
        
        // paste id
        objSetEvent($doc("new_name"),"paste",
            function(e){
                if(e.clipboardData.types[0]=="text/plain")
                {
                    //convertie le texte en identificateur valide
                    $value('new_name',strtoid(e.clipboardData.getData('Text')));
                    //annule la copie du texte
                    if(e.preventDefault)
                        e.preventDefault();
                }
                return false;
            }
        );
    
        //liste les dossiers
        ListFile();

        //charge un dossier ?
        if(!empty(opt.id))
            onLoadFields(opt.id);
    }
);

// upload de fichier
function openFileUpload(id){
    wfw.ext.document.lockFrame(
        "client_file_upload.html?id="+id,
        {
            onOK : function(doc)
            {
                //wfw.ext.document.lockFrame("uploding.html");
                //var form = $doc("form",doc);
                //form.submit();
                return false;
            },
            onCancel : function(doc)
            {
                return false;
            }
        }
    );
}

// upload de fichier image
function openImageUpload(id){
    wfw.ext.document.lockFrame(
        "client_image_thumb.html?client_id="+id,
        {
            onOK : function(doc)
            {
                //wfw.ext.document.lockFrame("uploding.html");
                //var form = $doc("form",doc);
                //form.submit();
                return false;
            },
            onCancel : function(doc)
            {
                return false;
            }
        }
    );
}

// charge la liste des fichiers
function ListFile(){
    var param = {
        "onsuccess" : function(obj,args)
        {
            var list = docGetElement(document,"file_list_content");
            objRemoveChildNode(list,null,REMOVENODE_ALL);

            //ok ?
            if(empty(args.name))
                return;
                
            //désempile les champs
            var fieldlist={};
            for(var i in args){
                if(i!="result" && i!="infos" && i!="error")
                    fieldlist[i] = strToArray(args[i],";");
            }
            
            //initialise la liste
            for(var i=0; i<fieldlist.name.length; i++){
                var template_arg={};
                for(var x in fieldlist){
                    template_arg[x] = fieldlist[x][i];
                    if(typeof(template_arg[x])=="undefined")
                        template_arg[x]="";
                }
                var template = wfw.template.insert($doc("dossier_item"),$doc("file_list_content"),template_arg);
                objSetAtt(template,"id","client_"+template_arg.id);
            }

            //tri par date
            //sort_by('file_list_content','time',true);
        }
    };
    //envoie la requete
    wfw.request.Add(null,"req/client/listclient.php",{wfw_readonly:"",wfw_date:"",wfw_pwd:"",wfw_type:"",wfw_id:"",wfw_timestamp:""},wfw.utils.onCheckRequestResult_XARG,param,false);
}

// charge les champs d'un fichier
function onLoadFields(id)
{
    var param = {
        "onsuccess" : function(obj,args)
        {
            var list = docGetElement(document,"field_list");
            objRemoveChildNode(list,null,REMOVENODE_ALL);

            for(name in args){
                //ignore les champs de resultat de la requete ?
                if(name=="result" || name=="error")
                    continue;
                //uniquement les champs privés ?
                if($doc("show_private_fields").checked && name.substr(0,4)!="wfw_")
                    continue;
                //insert
                insert_value(id,name,args[name]);
            }

            wfw.ext.page_scroll.scroll($doc('field_list'),0,0);
        }
    };
    var fields = {
        wfw_id:id
    };
    if($doc("show_private_fields").checked)
        fields.get_private="1";
    //envoie la requete
    wfw.request.Add(null,"req/client/getall.php",fields,wfw.utils.onCheckRequestResult_XARG,param,false);

    //update l'id
    $for("#wfw_id",function(e) {
            objSetAtt(e,"value",id);
        }
    );

    //affiche le contenu
    wfw.style.removeClass($doc("editable_content"),"wfw_hidden");
}

function onOpenXML(id)
{
    window.open("clients/data/"+id+".xml","_blank");
}

// tri une liste
function sort_by(listId,field_name,bReverse) {
    var list = docGetElement(document,listId);
    //scan les articles a la recherche de criteres de selections
    var fields = wfw.ext.sort.fieldsFromElement(objGetChild(list,null));
 //   alert(wfw.toString(fields));
    fields = wfw.ext.sort.sortFields(fields,field_name);
 //   alert(wfw.toString(fields));
    reArrange(listId,fields,bReverse);
}

function reArrange(listId,fields,bReverse){
    var list = docGetElement(document,listId);
    if(bReverse){
        for(var key=0; key<fields.length; key++){
            objInsertNode(fields[key].node,list,null,INSERTNODE_BEGIN);
        }
    }
    else{
        for(var key=fields.length-1; key>=0; key--){
            objInsertNode(fields[key].node,list,null,INSERTNODE_BEGIN);
        }
    }
}

function onChangeSelection(e,name){
    if(e.checked)
        selection[name]=e;
    else if(typeof(selection[name])!="undefined")
        delete(selection[name]);
}

function removeSelection()
{
    if(empty(selection)){
        wfw.ext.document.messageBox("Merci de sélectionner les dossiers à supprimer.");
        return;
    }
    var msg="Les dossiers suivant seront définitivement supprimés :\n";
    for(name in selection)
        msg+="   "+name+"\n";
    if(!confirm(msg))
        return;
    for(name in selection){
        //var element = selection[name];
        
        var param = {
            "onsuccess" : function(obj,args)
            {
                //delete(selection[name]);
                //nodeRemoveNode(element);
            }
        };
        var fields = {
            wfw_id:name,
        };
        //envoie la requete
        wfw.request.Add(null,"req/client/remove.php",fields,wfw.utils.onCheckRequestResult_XARG,param,false);
    }
    
    //actualise
    selection = [];
    ListFile();
}

// insert un fichier
function create_file()
{
    var elements = wfw.form.get_elements("new_file_form");

    /* wfw_pwd checkbox */
    objSetEvent($doc("wfw_pwd_check"),"change",
        function(e,p){
            p.wfw_pwd.disabled = !this.checked;
            return false;
        }, elements
    );
    
    /* wfw_id checkbox */
    objSetEvent($doc("wfw_id_check"),"change",
        function(e,p){
            p.wfw_id.disabled = !this.checked;
            return false;
        }, elements
    );
    
    /* wfw_type checkbox */
    objSetEvent($doc("wfw_type_check"),"change",
        function(e,p){
            p.wfw_type.disabled = !this.checked;
            return false;
        }, elements
    );

    /* paste wfw_id  */
    objSetEvent(elements.wfw_id,"paste",
        function(e,p){
            if(e.clipboardData.types[0]=="text/plain")
            {
                //convertie le texte en identificateur valide
                objSetAtt(p.wfw_id,strtoid(e.clipboardData.getData('Text')));
                //annule la copie du texte
                if(e.preventDefault)
                    e.preventDefault();
            }
            return false;
        }, elements
    );

    wfw.ext.document.lockElement(
        $doc("new_file_form"),
        {
            title:"Nouveau dossier",
            onOK : function(element){
                wfw.form.send('new_file_form');
            },
            onCancel : function(element){}
        }
    );
}


// insert un champs de valeur
function insert_value(id,name,value,replacement)
{
    //
    var element = wfw.ext.listElement.insertFields(
        $doc("field_template"),
        $doc("field_list"),
        {
            wfw_id:id,
            name:name,
            value:(trimtext(value,100,3)),
            private:((name.substr(0,4)=="wfw_") ? "yes" : "no")
        },
        null,
        null,
        replacement
    );

    //identifie l'element inséré
    objSetAtt(element,"id","field_"+name);
}

function onEditField(id,name)
{
    wfw.ext.document.lockFrame(
        "client_edit_field.html?wfw_id="+id+"&field_name="+name,
        {
            title : "Edition du champ: '"+name+"'",
            //OK
            onOK : function(doc)
            {
                var new_value = objGetAtt($doc("field",doc),"value");

                var param={
                    "onsuccess":function(obj,args)
                    {
                        insert_value(id,name,new_value,$doc("field_"+name));
                    }
                };
                var fields = {
                    wfw_id:(id)
                };
                fields[name]=new_value;

                //envoie la requete
                wfw.request.Add(null,"req/client/set.php",fields,wfw.utils.onCheckRequestResult_XARG,param,false);
            },
            //annuler
            onCancel : function(doc){}
        }
    );
}

function onUpdateField(id,name,value)
{
    var param={
        "onsuccess":function(obj,args)
        {
            //actualise le template si besoin
            var fieldElement = $doc("field_"+this.name);
            if(fieldElement)
                insert_value(this.id,this.name,this.value,fieldElement);
            ListFile();
        },
        value:value,
        id:id,
        name:name
    };
    var fields = {
        wfw_id:(id)
    };
    fields[name]=value;

    //envoie la requete
    wfw.request.Add(null,"req/client/set.php",fields,wfw.utils.onCheckRequestResult_XARG,param,false);
}

function update_value(){
    var name  = $value("new_name");
    var value = $value("new_value");
    wfw.puts("test----------"+name);
    var exp = new RegExp("^[A-Za-z]{1}[A-Za-z0-9_]*$", 'g');
    wfw.puts(name+"-----------"+exp.test(name));
    if(/*cInputInteger.isValid*/cInputIdentifier_isValid(name)!=ERR_OK)
    {
        wfw.ext.document.messageBox("Veuillez entrer un identificateur valide");
        return;
    }

    var param = {
        "onsuccess" : function(obj,args)
        {
            onLoadFields($value("wfw_id"));
        }
    };
    var fields = {
        wfw_id:$value("wfw_id"),
    };
    fields[name] = value;

    //envoie la requete
    wfw.request.Add(null,"req/client/set.php",fields,wfw.utils.onCheckRequestResult_XARG,param,false);
}

function onChangeFieldSelection(e,name){
    if(e.checked)
        field_selection[name]=e;
    else if(typeof(field_selection[name])!="undefined")
        delete(field_selection[name]);
}

function remove_fields()
{
    //verifie la selection
    if(empty(field_selection)){
        alert("Merci de sélectionner les champs à supprimer.");
        return;
    }
    //confirm la supression
    var msg="Les champs suivant seront définitivement supprimés :\n";
    for(name in field_selection)
        msg+="   "+name+"\n";
    if(!confirm(msg))
        return;
    //envoie la requete
    var param = {
        "onsuccess" : function(obj,args)
        {
            field_selection = [];
            onLoadFields($value("wfw_id"));
        }
    };
    var fields = {
        wfw_id:$value("wfw_id"),
    };
    for(name in field_selection){
        fields[name]="";
    }

    wfw.request.Add(null,"req/client/delete.php",fields,wfw.utils.onCheckRequestResult_XARG,param,false);
}

function data_connect(id) {
    var param = {
        "onsuccess": function (obj, args) {
            ListFile();
        }
    };
    //envoie la requete
    wfw.request.Add(null, "req/client/link_data.php", { wfw_id:id, link: "true" }, wfw.utils.onCheckRequestResult_XARG, param, false);
}

function data_disconnect(id) {
    var param = {
        "onsuccess": function (obj, args) {
            ListFile();
        }
    };
    //envoie la requete
    wfw.request.Add(null, "req/client/link_data.php", { wfw_id:id, link: "false" }, wfw.utils.onCheckRequestResult_XARG, param, false);
}

/*
    (C)2008-2011 ID-Informatik, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    Struture de l'objet WebFrameWork

    Composants:
        http     - Socket HTTP
        request  - Gestionnaire de requêtes HTTP
        event    - Gestionnaire d'événements
        timer    - Timers
        form     - Gestionnaire de formulaire
        style    - Gestionnaire de styles CSS
        search   - Recherche
        math     - Utilitaire mathématiques
        uri      - Universal Resource Identifier
        xarg     - Fonctions relatives au format de requete XARG
        stdEvent - Stock les événements standard du WFW
        utils    - Fonctions utiles
        states   - Stockages de données
    
    Dependences: base.js, dom.js

    Revisions:
        [22-10-2010] Ajout de l'objet wfw.style.
        [22-10-2010] Modification de l'evenement 'eventCheckDataType', utilise maintenant la classe de style 'wfw_invalidate' pour afficher les objets non valide.
        [25-10-2010] Ajout de l'objet wfw.math.
        [25-10-2010] Supprime l'attribut wfw.doc_root
        [01-11-2010] wfw.http_getResponse() retourne null en cas d'echec de la requete.
        [01-11-2010] Ajout de wfw.http_getResponseStatus().
        [10-11-2010] Ajout de l'attribut wfw.request.auto_start, permet au requetes d'etres execute automatiquement a leurs insertions sans besoin d'appel a la fonction Start().
        [10-11-2010] Change wfw.template.make(), ajout de l'argument 'selectElement'.
        [10-11-2010] Change wfw.request.Add(), ajout de l'argument 'user_data'.
        [10-11-2010] Ajout de l'object wfw.xarg.
        [10-11-2010] Ajout de l'object wfw.stdEvent.
        [26-11-2010] Debug wfw.uri.cut(), accepte le caractere '-' dans le format du query
        [27-11-2010] Debug wfw.uri.cut(), utilise les doubles slashs '\\' dans les expressions regulieres pour marquer les caracteres speciaux, ex: '\\-', car lorsque les chenes sont collees entre eux ceci annule l'effet du simple slash qui est a nouveau interprete.
        [10-11-2010] Ajout de l'object wfw.utils.
        [26-02-2011] Ajout de wfw.utils.getURIField()
        [26-02-2011] Ajout de l'header "Cache-Control" aux fonctions http_get(), http_post(), http_get_async(), http_post_async() pour lutter contre le cache du navigateur.
        [28-02-2011] Ajout de wfw.utils.remakeURI()
        [28-02-2011] Ajout de wfw.utils.getDomainName()
        [03-03-2011] Ameliore la fonction wfw.utils.onCheckRequestResult_XARG()
        [15-03-2011] Debug, wfw.timer.CreateFrequencyTimer(),insert(),remove(). L'objet ne gere pas correctement sa pile et ses identificateurs de timers [resolue]
        [22-03-2011] Debug, wfw.form.get_fields(). La fonction retourne un objet au lieu d'un string pour l'element checkbox [resolue]
        [26-03-2011] Ajout de wfw.utils.getURIAnchor()
        [06-04-2011] Ajoute l'attribut "att" a la fonction wfw.utils.remakeURI().
        [08-04-2011] Ameliore la fonction wfw.stdEvent.onFormResult().
        [26-04-2011] Ajout de wfw.request.Exists().
        [02-05-2011] Debug, set_fields(). la varibale d'argument fields est redefinit [resolue].
        [10-06-2011] Change $get().
        [11-06-2011] Debug wfw.template.check_text(), erreur de syntaxe (utilisation de double quote)
        [11-06-2011] Debug wfw.template.check_default_value(), erreur de syntaxe
        [11-06-2011] Debug wfw.template.check_node_condition(), erreur de syntaxe (utilisation de double quote)
        [23-09-2011] Modify wfw.event.SetCallback()
        [23-09-2011] Changement de comportement pour wfw.event.onEventCall() : les callbacks en liste qui retourne 'false' sont automatiquement supprimés de la liste d'appel
        [23-09-2011] Modify wfw.form.send() : ajout de l'argument 'target'
        [23-09-2011] Changement de comportement pour wfw.form.send() : les paramètres modifiés de l'élément 'form' sont restoré en fin de fonction.
        [24-09-2011] Modification sur wfw.form.get_fields(), la valeur des champs textarea sont obtenu par objGetAtt
        [04-10-2011] Modify wfw.template.make(), ajout de l'argument 'args'
        [08-10-2011] Changement de comportement pour wfw.utils.onCheckRequestResult_XML() et wfw.utils.onCheckRequestResult_XARG()
        [10-10-2011] Debug wfw.uri.object_to_query(), encodage minimal des caracteres "&" et "="
        [10-10-2011] Ajout de wfw.utils.fieldsToXML()
        [12-10-2011] Debug wfw.template.check_arguments(), erreur de condition, oublie de l'argument 'arg'
        [20-10-2011] Ajout de wfw.http_post_multipart() et http_post_multipart_async()
        [20-10-2011] Debug, désactive les headers "Content-length" et "Connection" dans wfw.http_post() et wfw.http_post_async(). ['unsafe' avertissement sous google-chrome]
        [20-10-2011] Ajout de wfw.form.initFromArg()
        [20-10-2011] Modify ExecuteNext(), support des fichiers en argument
        [20-10-2011] Debug wfw.toString(), mauvaise convertion du type number en texte [resolue].
        [24-10-2011] Update wfw.stdEvent.onFormResult(), wfw.utils.onCheckRequestResult_XML() et wfw.utils.onCheckRequestResult_XARG()
        [05-11-2011] Debug wfw.request.ExecuteNext(), mauvais appel de la fonction wfw.http_post_multipart
        [11-11-2011] Modify wfw.uri.encode() encode les caractéres "[" et "]"
        [29-11-2011] Modify $all()
        [30-11-2011] Debug wfw.http_get() et wfw.http_get_async(), passe un nombre entier comme parametre supplementaire
        [30-11-2011] wfw.utils.remakeURI(), convertie le parametre 'add_fields' en string si il est de type "number"
        [02-12-2011] Rename wfw.form.initFromElement() par wfw.form.initFromURI()
        [03-12-2011] Debug wfw.http_get() et wfw.http_get_async(), evite l'utilisation de la fonction wfw.utils.remakeURI pour les chemins local (sans domaine)
        [06-12-2011] Update wfw.stdEvent.onFormResult(), utilise messageBox() pour afficher les messages d'erreurs
        [13-12-2011] Ajout de wfw.uri.encodeUTF8() et wfw.uri.decodeUTF8()
        [29-12-2011] Update wfw.request.ExecuteNext() accepte des arguments de requête en objet
        [03-01-2012] Update wfw.utils.onRequestMsg() affiche les messages avec wfw.ext.document.messageBox()
        [05-01-2012] Update wfw.utils.onCheckRequestResult_XARG() et .onCheckRequestResult_XML() utilise l'argument 'wfw_form_name' pour identifier le formulaire de résultat
        [05-01-2012] Update wfw.stdEvent.onFormResult(), modifie l'affichage des messages d'erreurs.
        [06-01-2012] Add wfw.form.sendFrame().
        [07-01-2012] Add wfw.request.make() et wfw.form.sendForm()
        [14-01-2012] Update wfw.event: les listes d'appels peuvent maintenant utiliser un parametre pour chaque callback
        [14-01-2012] Update wfw.event.SetCallback(), ajout du paramètre "param"
        [14-01-2012] Update wfw.event.ApplyTo(), utilise objSetEvent pour passer les parametres
        [14-01-2012] Update wfw.event.onEventCall(), appel func.apply() pour utiliser le contexte de la fonction
        [20-01-2012] Debug wfw.form.get_fiels(), obtient les champs de types "password"
        [21-02-2012] Add, wfw.utils.strToHTML()
        [01-03-2012] Debug, wfw.http_post, wfw.http_post_multipart et wfw.http_get utilisait 'wfw.nav.httpRequest.onreadystatechange' ce qui créait un double appel de 'wfw.request.onResult()' [resolue]
        [03-03-2012] Update, wfw.search.string, Implentation de l'attribut MATCH_EXPRESSION
        [03-03-2012] Update, wfw.form.get_fields, changement d'arguments
        [10-03-2012] Debug, wfw.form.get_fields, obtient les champs 'input[radio]' vide si aucun choix n'est fait
        [10-03-2012] Update, wfw.utils.enabledContent, améliore la compatibilité
        [10-03-2012] Update, wfw.form.init_fields, ajout de la prise en charge de l'attribut special 'wfw_enabled'
        [02-10-2012] Update, wfw.uri.cut, accepte dans la syntaxe de l'URI un nombre indéfinit de slash '/' après le protocol "xxx://"
*/

/*
-----------------------------------------------------------------------------------------------
    Error Handler
-----------------------------------------------------------------------------------------------


window.onerror = function(desc,page,line,chr){
    wfw.puts_error(desc);
    return true;
}*/

/*
-----------------------------------------------------------------------------------------------
    Base object
-----------------------------------------------------------------------------------------------
*/

var wfw = {
};




/*
-----------------------------------------------------------------------------------------------
    Error
-----------------------------------------------------------------------------------------------
*/
wfw.stdEvent = {
    onReqCheckDataType: function (action) {
        if (action.status != 200)
            return;

        var result = x_request_arguments_parse(action.response, false);

        if (result.result == ERR_OK) {
            wfw.style.removeClass(action.user.input, 'wfw_invalidate');
        }
        else {
            wfw.style.addClass(action.user.input, 'wfw_invalidate');
        }

        wfw.request.Remove(action.name);
    }
    
};



/*
-----------------------------------------------------------------------------------------------
    Shortcut functions
-----------------------------------------------------------------------------------------------
*/

/*
Obtient un ou plusieur éléments du document actif
   syntax:
    "id,"     = element
    "#name, " = elements nommés (merge)
    "~name, " = elements nommés (array)
    "&name, " = element states (object)
    Remarques:
        si syntax est un objet, syntax est retrourne
*/
$doc = function(syntax,doc){
    var out = new Array();
    var obj;
    
    //object
    if(typeof(doc)=="undefined")
        doc=document;

    //object
    if(typeof(syntax)=="object")
        return syntax;

    //document id
    if(typeof(syntax)=="string")
    {
        var elements = strexplode(syntax,",",true);

        for(var i=0;i<elements.length;i++)
        {
            var prefix = elements[i].substr(0,1);

            switch(prefix)
            {
                case "&":
                    obj = wfw.states.fromId(elements[i].substr(1),null,{exists:true})
                    out.push(obj);
                    break;
                case "#":
                    obj = docGetNamedElements(doc,elements[i].substr(1));
                    out = array_merge(out,obj,false);
                    break;
                case "~":
                    obj = docGetNamedElements(doc,elements[i].substr(1));
                    out.push(obj);
                    break;
                default:
                    if((obj = docGetElement(doc,elements[i]))!=null)
                        out.push(obj);
                    break;
            }
        }
    }

    //aucun ?
    if(!out.length)
    {
//        wfw.puts("not found for "+syntax);
        return null;
    }
    
    //si l'objet est unique retourne seulement celui-ci
    if(out.length == 1)
    {
//        wfw.puts("only one for "+syntax);
        return out[0];
    }

//    wfw.puts("array for "+syntax);
    return out;
};

$all = function(array,func){
    var i=0;
    for(key in array){
//        wfw.puts("key="+key+", value="+array[key].toString());
        ret = func(array[key],key,i);
//        wfw.puts(array[key].toString()+"->ret="+typeof(ret));
        if(typeof(ret)!=="undefined")
            return ret;
        i++;
    }
    
    //retourne "undefined", permet les appels imbriqué 
};

$if = function(element)
{
    if(eval("typeof("+element+")")=="undefined")
        return false;
    if(eval(element)==null)
        return false;
    return true;
};

$name = function(element)
{
    if((element=$doc(element))==null)
        return "";
    var value = objGetAtt(element,"name");
    if(typeof(value)=="string")
        return value;
    return "";
};

/*
    Obtient / Définit l'attribut 'value' d'un élément
    Arguments:
        [HTMLElement] element : l'element (objet ou identificateur)
        [string]      set     : si specifie, cette valeur est assigné à l'objet

    Retourne:
        valeur en cours de l'element
*/
$value = function(element,set)
{
    if((element=$doc(element))==null)
        return "";
       
    //redefinit la valeur en cours
    if(typeof(set)!="undefined")
        objSetAtt(element,"value",set);

    //obtient la valeur en cours
    value = objGetAtt(element,"value");
    if(typeof(value)!="string")
        value = "";
 
    return value;
};

/*
    Arguments:
        element : l'element (objet ou identificateur)
        set     : si specifie, la valeur est changer

    Retourne:
        text en cours de l'element
*/
$text = function(element,set)
{
    if((element=$doc(element))==null)
        return "";
       
    //redefinit la valeur en cours
    if(typeof(set)!="undefined")
        objSetInnerText(element,set);

    //obtient la valeur en cours
    value = objGetInnerText(element);
    if(typeof(value)!="string")
        value = "";
 
    return value;
};

/*
    Obtient un element (sécurisé)

    Arguments:
        text : chemin vers l'élément. ex: "window.document.body"
        alt  : valeur alternative si l'élément n'existe pas

    Retourne:
        l'élément pointé par 'text'

    Remarques:
        $get, 
*/
$get = function(text,alt)
{
    if(typeof(alt)=="undefined")
        alt=null;
    var tab = strexplode(text,'.');
    var path = "";
    for(i=0; i<tab.length; i++){
        path += tab[i];
        if(eval("typeof("+path+")")=="undefined")
            return alt;
        path += ".";
    }
       
    return eval(text);
};

$for = function(obj,callback)
{
    if(typeof(obj)=="string")
        obj = $doc(obj);

    var i=0;
    switch(typeof(obj))
    {
        case "object":
            if(obj instanceof Array)
            {
                for(var key in obj)
                {
                    callback(obj[key]);
                    i++;
                }
            }
            else if(obj!=null)
            {
                callback(obj);
                i++;
            }
            break;
        default:
            break;
    }
    return i;
};

/*
    Crée une instance d'objet
    Paramètres:
        [object] object    : Objet model de base
        [object] arguments : Optionel, tableau associatif des arguments à initialiser
        [string] id        : Optionel, identifiant global de la ressource. Si non spécifié l'identificateur est généré
    Remarques:
        Les données sont identifié et stocké globalement dans l'objet "wfw.states".
        Utilisez la fonction wfw.states.getRefId() pour obtenir l'indentifiant la nouvelle ressource.
    Retourne:
        [objet] Instance sur le nouvel objet

$delete = function(inst_or_id){
    //obtient l'instance et l'id
    var inst;
    var id;
    if(typeof inst_or_id == "string"){
        id = inst_or_id;
        inst = wfw.states.fromId(inst_or_id);
    }
    else{
        id = typeof(inst_or_id["_id"]) ? inst_or_id["_id"] : wfw.states.getRefId(inst_or_id);
        inst = inst_or_id;
    }

    //supprime les ressources memoires
    delete inst._object._inst[id];
    wfw.states.remove(id);

    //ok    
    wfw.puts("$delete('"+id+"')");
}*/
/*
var $new_inst_count=0;
$new = function(object,args,id){

    if(typeof(id)!="string" || empty(id)){
        id = (typeof object._name == "string") ? strtoid(object._name+"_"+(++$new_inst_count)) : uniqid();
    }
    
    //stock le pointeur de reference
    var inst = wfw.states.fromId(id,{});
    
    //bases
    if(typeof(object["_base"])!="undefined"){
        var bases=object["_base"];
        for(var x in bases){
            inst = object_merge(inst,$new(bases[x],args),false);
        }
    }
    
    if(typeof(object)=="string")
        object=eval(object);

    //liste les classes de bases
    inst=object_merge(inst,object,false);

    //assigne les arguments
    if(typeof(args)!="undefined"){
        for(var arg_name in object)
        {
            if(typeof(args[arg_name])!="undefined")
                inst[arg_name]=args[arg_name];
            else
                inst[arg_name]=object[arg_name];
        }
    }
    
    //assigne l'id
    inst._id = id;

    //ajoute la classe de base à l'instance
    inst._object = object;

    //ajoute l'instance a la classe de base
    object._inst[id] = inst;

    //constructeur
    if(typeof(object["_construct"])=="function")
        object._construct(inst);
    
    wfw.puts("$new('"+id+"')");


    return inst;
};*/
/*
//var $new_inst_count=0;
$new = function(object,args,id){
    //stock le pointeur de reference
    var inst = {};
    
    //arguments des bases
    var bases = [];
    if(typeof(object["_base"])!="undefined"){
        for(var x in object["_base"]){
            bases.push(eval(object["_base"][x]));
            //merger les bases enfants
        }
    }
    for(var x in bases){
        inst = object_merge(inst,bases[x],false);
        //merger les bases enfants
    }
    
    //arguments de classe
    if(typeof(object)=="string")
        object=eval(object);
    inst = object_merge(inst,object,false);

    //assigne les arguments
    if(typeof(args)!="undefined"){
        for(var arg_name in inst)
        {
            if(typeof(args[arg_name])!="undefined")
                inst[arg_name]=args[arg_name];
        }
    }
    
    //constructeurs des bases
    for(var x in bases){
        if(typeof(bases[x]["_construct"])=="function")
            bases[x]._construct(inst);
    }

    //constructeurs de classe
    if(typeof(object["_construct"])=="function")
        object._construct(inst);
    
    //ajoute la classe de base à l'instance
    //inst._object = object;
    
    //ajoute l'instance a la classe de base
    //object._inst[id] = inst;

    return inst;
};*/

//var $new_inst_count=0;
/*
    Initialise une nouvelle instance d'objet
    Remarques:
        "$new" assume l'initialisation de l'heritage des objets
*/
$new = function(object,args,id){
    //stock le pointeur de reference
    var inst = {};
    
    //liste les classes de bases
    var bases = [];
    var bases_red = {};
    var bases_str = "";
    var cur = object["_base"];
    while(typeof(cur)!="undefined"){
        var base_name = cur;
        var base_obj = eval(cur);
        //fin ?
        if(typeof base_obj == "undefined"){
            cur = undefined;
            continue;
        }
        //redondance ?
        if(typeof bases_red[base_name] != "undefined"){
            cur = undefined;
            continue;
        }
        //ajoute a la liste
        bases_red[base_name]=true;
        bases.push(base_obj);
//        bases_str+=base_name+ " ";
        //enfant suivant
        cur = base_obj["_base"];
    }
    bases.reverse();
//    objAlertMembers(bases);
//    objAlertMembers(bases_red);
//    wfw.puts("$new( bases: "+bases_str+" )");

    //arguments des bases
    for(var x in bases){
        inst = object_merge(inst,bases[x],false);
        //merger les bases enfants
    }
    
    //arguments de classe
    if(typeof(object)=="string")
        object=eval(object);
    inst = object_merge(inst,object,false);

    //assigne les arguments
    if(typeof(args)!="undefined"){
        for(var arg_name in inst)
        {
            if(typeof(args[arg_name])!="undefined")
                inst[arg_name]=args[arg_name];
        }
    }
    
    //constructeurs des bases
    for(var x in bases){
        if(typeof(bases[x]["_construct"])=="function")
            bases[x]._construct(inst);
    }

    //constructeurs de classe
    if(typeof(object["_construct"])=="function")
        object._construct(inst);
    
    //ajoute la classe de base à l'instance
    //inst._object = object;
    
    //ajoute l'instance a la classe de base
    //object._inst[id] = inst;

    return inst;
};

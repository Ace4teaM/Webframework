/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        Author: AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    Base
    Fonctions de base

    JS  Dependences: base.js
    YUI Dependences: base, wfw-states

    Revisions:
        [17-10-2012] Implementation
*/

//YUI.namespace("wfw");

YUI.add('wfw', function (Y) {
    var wfw = Y.namespace('wfw');
    
    object_merge(wfw, {

        /*
            Classe Objet
        */
        OBJECT : function(att){
            // initialise les données ?
            if(att != null)
            {
                //depuis l'objet 'States' ?
                if(typeof att == "string" && typeof wfw.States != "undefined"){
                    // 'global' namespace
                    if(att.indexOf(':') == -1) 
                        object_merge(this,wfw.States.fromId(att, null, {
                            exists:true
                        }),false);
                    // named namespace
                    else{
                        var id = strexplode(att);
                        object_merge(this,wfw.States.fromId(id[0], null, {
                            exists:true, 
                            name:id[1]
                            }),false);
                    }
                }
                
                //depuis l'objet 'att' ?
                if(typeof att == "object" && att != null)
                    object_merge(this,att,false);
            }
            
        },
        
        /*
            Traitement dune exception Javascript
            Parametres:
                [object] e : Objet Exception
            Retourne:
                [boolean] false
            Remarques:
                checkError() utilise la fonction puts_error() pour afficher un message d'erreur
        */
        checkError: function(e){
            var str ="Exception: ("+e.number+")\n"
            str+="\t"+e.name+"\n";
            str+="\t"+e.message+"\n";
            str+="\t"+e.toString();
            this.puts_error(str);
            return false;
        },
        
        /*
        Ecrit un texte ou un objet dans la console de deboguage avec une en-tête d'erreur
        Arguments:
            [mixed] obj : Variable à écrire, la variable est affichée par la fonction toString()
        Retourne:
            [string] Le texte généré
        */
        puts_error: function (txt) {
            return this.puts(
                '============================================================\n'
                +'-------------------!! Error Occurred !!---------------------\n'
                +txt+"\n"
                +'============================================================'
                );
        },
        
        /*
        Ecrit un texte ou un objet dans la console de deboguage
        Arguments:
            [mixed] obj : Contenu à écrire, le contenu est transformé en texte par la fonction "wfw.toString"
        Retourne:
            [string] Le texte généré
        */
        puts: function (obj,depth) {
            var text = this.toString(obj,depth);
            //ecrit vers la console
            if (typeof (console) == 'object')
                console.log(text);
            else {
            // alert(text);
            //if(this.consoleWindow == null)
            //this.consoleWindow = window.open('about:blank','consoleWindow');
            //if(this.consoleWindow == null)
            //this.consoleWindow.document.write(text+"\n");
            }
            return text;
        },
        
        /*
        Convertie un objet Javascript en chaine de caractéres
        Arguments:
            [mixed] obj   : Contenu à écrire, le contenu est transformé en texte par la fonction "wfw.toString"
            [bool]  depth : Scan les objets et tableaux recursivement
        Retourne:
            [string] Texte de l'objet
        */
        toString: function (obj, depth) {
            if (typeof (depth) == "undefined")
                depth = true;
            var text = "";
            //convertie en texte
            try{
                switch (typeof (obj)) {
                    case 'string':
                        text = obj;
                        break;
                    case 'number':
                        text = obj.toString(); //convert to string
                        break;
                    case 'function':
                        text = ">"+obj;
                        break;
                    case 'object':
                        for (var obj_member in obj)
                            text += 'object {' + obj_member + ':' + (!depth ? "" + obj[obj_member] : this.toString(obj[obj_member])) + "},\n";
                        text += "\n";
                        break;
                    case 'array':
                        if (!depth)
                            text += "" + obj;
                        else
                            for (var i = 0; i < obj.length; i++)
                                text += '{' + i + ':' + (!depth ? "" + obj[i] : this.toString(obj[i])) + "},\n";
                        text += "\n";
                        break;
                }
            }
            catch(e){
                text = "<unredable object> "+e;
            }
            return text;
        },


        /*
        variables
        */
        path: function (request_name) {
            return 'wfw/' + request_name;
        }, // symbolik link
        request_path: function (request_name) {
            return 'wfw/req/' + request_name;
        }, // symbolik link
        //request_path: function(request_name){ return 'req:'+request_name; }, // url rewriting

        nav: new Object(), // navigator dependent-interfaces instances
        dummy: function () { }, // empty function
        version: "1.7", //webframework library version
        copyright: "(C)2010-2012 AceTeaM. All rights reserved.", // empty function
        url: "http://www.aceteam.org"

    },false);

}, '1.0', {
    requires:['base','wfw-states']
});

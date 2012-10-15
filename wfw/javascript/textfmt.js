/*
    (C)2008-2010 ID-Informatik. All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    WebFrameWork(R) version: 1.3

    Formatage de texte brut.
*/


/*
-----------------------------------------------------------------------------------------------
    Extended object
-----------------------------------------------------------------------------------------------
*/
wfw.text_format = {
    //
    fromElement : function(element){
        return objGetInnerText(element);
    },
    //recherche et remplace les marqueurs definit dans le text 
    to_text : function(text,marquer,arg){
        // recherche pour chaque format d'expression                                  
        for(exp in marquer)
        {       
            var func = marquer[exp];
            text = text.replace(
                new RegExp( exp, "g" ),
                function()
                {
                    var matches=arguments;
                    //appel la fonction qui va traiter la chene
                    return eval(func+"(matches,arg);");
                }
            );
        }
        return text;
    },
    //recherche et remplace les marqueurs definit dans le text 
    to_array : function(text,marquer,arg){
        // recherche pour chaque format d'expression                                  
        for(exp in marquer)
        {       
            var func = marquer[exp];
            text = text.replace(
                new RegExp( exp, "g" ),
                function()
                {
                    var matches=arguments;
                    //appel la fonction qui va traiter la chene
                    return eval(func+"(matches,arg);");
                }
            );
        }
        return text;
    },
    //recherche et remplace les marqueurs definit dans le text 
    to_html : function(text,arg,doc,parent){
        var level = 0;
        var start_pos = 0;
        var bstart = false;
        // recherche pour chaque format d'expression                                  
        for(var i=0; i<text.length; i++)
        {       
            var last_level = level;
            switch(text[i])
            {
                case "<":
                    if(text[i+1] == "/")
                        level--;
                    else
                        level++;
                    break;
                case ">":
                    if(text[i-1] == "/")
                        level--;
                    break;
                /*case "\"":
                    bStr = !bsTr;
                    break;*/
            }
            if(level==1 && (level != last_level)){
                start_pos = i;
                bstart=true;
                alert("start_pos "+start_pos);
            }
            if(level==0 && bstart){
                bstart=false;
                //alert("end_pos "+i);
                alert(text.substring(start_pos,i+1));
            }
                
        }
        return text;
    },
    //cree un element html a partir de sa syntaxe texte
    //si l'element est compose d'une balise ouvrante et fermante le contenu est insert comme du texte 
    to_element : function(doc,syntax){
        var arg_exp = new RegExp( '('+cInputIdentifier.regExp+')="('+cInputString.regExp+')"','g' );
       // var inline_exp = new RegExp( "^<("+cInputIdentifier.regExp+")[\s]*("+arg_exp.toString()+")*/>$" );
        var inline_exp = new RegExp( "^<("+cInputIdentifier.regExp+")[\\s]*(.*)/>$" );
        var container_exp = new RegExp( "^<("+cInputIdentifier.regExp+")[\\s]*([^>]*)>(.*)</("+cInputIdentifier.regExp+")>$" );//DEBUG, si le caractere '>' est rencontre dans la zone d'arguments l'expression echoue. cause: ([^>]*)

        syntax = trim(syntax);
       // objAlertMembers(arg_exp.exec('test="test de string"'));
        //inline element?
        var matches;
        if(matches = inline_exp.exec(syntax))
        {
            var tagname = matches[1];
            var arguments = matches[2];
            //alert("inline");
            //objAlertMembers(matches);
            //cree l'element
            var element = doc.createElement(tagname);
            //definit les arguments
            if(arguments){
                while(matches = arg_exp.exec(arguments))
                {
                    //objAlertMembers(matches);
                    objSetAtt(element,matches[1],matches[2]);
                }
            }
            return element;
        }
        //container element?
        else if(matches = container_exp.exec(syntax))
        {
            var tagname = matches[1];
            var arguments = matches[2];
            var content = matches[3];
            var tagname_end = matches[4];
            //alert("container");
            //objAlertMembers(matches);
            //cree l'element
            var element = doc.createElement(tagname);
            //definit les arguments
            if(arguments){
                while(matches = arg_exp.exec(arguments))
                {
                    //objAlertMembers(matches);
                    objSetAtt(element,matches[1],matches[2]);
                }
            }
            //definit le contenu
            element.appendChild(doc.createTextNode(content));
            return element;
        }
        else alert("invalid syntax");
        return null;
    }
};  

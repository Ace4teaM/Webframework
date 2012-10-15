/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    X-Arguments

    JS  Dependences: base.js
    YUI Dependences: base, node, uri

    Revisions:
        [11-10-2012] Implementation
*/

YUI.add('xarg', function (Y, NAME) {
	Y.XArg = {
	    XARG_START_OF_TEXT_CODE : 0x02,
	    XARG_END_OF_TEXT_CODE   : 0x03,
	    XARG_START_OF_TEXT_CHAR : String.fromCharCode(0x2),
	    XARG_END_OF_TEXT_CHAR   : String.fromCharCode(0x3),
	    XARG_START_OF_TEXT_URI  : "%02",
	    XARG_END_OF_TEXT_URI    : "%03",
		/*
			Convertie un texte XARG en objet
			Parametres:
				[string] text     : Texte au format XARG 
				[bool]   bencoded : true si le texte "text" est encodé au format d'une URI
			Retourne:
				[object] Tableau associatif des éléments, null en cas d'erreur
		*/
	    to_object : function(text,bencoded)
	    {
	        if(typeof(text)!='string')
	            return null;
	
		    var rslt = new Object();
		    var begin_pos = 0;
		    var pos;
		    var separator = this.XARG_START_OF_TEXT_CHAR;
		    var end       = this.XARG_END_OF_TEXT_CHAR;
	
	        if(bencoded){
		        separator = this.XARG_START_OF_TEXT_URI;//STX
		        end       = this.XARG_END_OF_TEXT_URI;//ETX
	        }
	
		    while((pos=text.indexOf(separator,begin_pos)) != -1)
		    {
			    var pos2  = text.indexOf(end,pos);
			    if(pos2 == -1){ // fin anticipe
	                wfw.puts("wfw.xarg.to_object(), attention: fin anormale de requete!");
				    return rslt;
	            }
	
			    //alert(begin_pos+"->"+pos+"\n"+pos+"->"+pos2);
	
			    var name  = text.substr(begin_pos,pos-begin_pos);
			    var value = text.substr(pos+separator.length,pos2-(pos+separator.length));
	
			    begin_pos = pos2+end.length; //prochaine position de depart
	
			    rslt[name]=value;
		    }
		    return rslt;
	    },
		/*
			Convertie un texte XARG en objet
			Parametres:
				[object] obj     : Tableau associatif des arguments 
				[bool]   bencode : true si le texte "text" est encodé au format d'une URI
			Retourne:
				[string] Texte au format XARG
		*/
	    to_string : function(obj,bencode){
	        if(typeof(obj)!='object')
	            return null;
	
	        var text = "";
	        for(var i in obj){
	            text += (""+i+this.XARG_START_OF_TEXT_CHAR+obj[i]+this.XARG_END_OF_TEXT_CHAR);
	        }
	
	        if(bencode)
	            text=Y.URI.encodeUTF8(text);
	
	        return text;
	    },
		/*
			Obtient le parametre XARG d'une URI
			Parametres:
				[string] uri     : URI à utiliser. Si null, l'URI du document en cours est utilisé 
			Retourne:
				[string] Texte au format XARG, en cas d'erreur un numero est retourné
			Remarques:
				Le texte est lu depuis l'argument "_xarg_" de l'URI
		*/
	    from_uri : function(uri){
	        //si non specifie, utilise l'uri du document en cours
	        if(typeof(uri)!='string')
	             if(typeof(uri = Y.Node.one("window").get("location.href"))!='string')
	                return -1;
	        //en objet...
	        var uri_obj = Y.URI.cut(uri);
	        if(uri_obj==null)
	            return -2;
	        if(empty(uri_obj.query))
	            return -3;
	        var uri_query = Y.URI.query_to_object(uri_obj.query,true);
	        if(typeof(uri_query['_xarg_'])!="string")
	            return -4;
	        //convertie la chene _xarg_
	        return uri_query['_xarg_'];
	    }
	}
}, '1.0', {
      requires:['base','node','uri']
});

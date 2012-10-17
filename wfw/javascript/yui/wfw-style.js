/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    StyleSheet

    JS  Dependences: base.js
    YUI Dependences: base, node

    Revisions:
        [11-10-2012] Implementation
*/

YUI.add('style', function (Y, NAME) {
	Y.Style = {

	    /*
	        Vérifie si l'élément est attaché à une classe donnée
	            [object]   obj       : L'Elément
	            [string]   className : Nom de la classe
	        Retourne:
	            [bool] true si la class est présente, sinon false
	    */
	    haveClass : function(obj,className){
	        var orgClass = obj.get('className');
	        if(orgClass.indexOf(className) == -1)
	            return false;
	        return true;
	    },
	    /*
	        Attache une classe à un élément
	            [object]   obj       : L'Elément
	            [string]   className : Nom de classe
	        Retourne:
	            [string] chaine comportant le(s) nom(s) de classe(s) avant modification
	    */
	    addClass : function(obj,className){
	        var orgClass = obj.get('className');
	        if(orgClass.indexOf(className) == -1)
	            return obj.set("className",orgClass+" "+className);
	        return orgClass;
	    },
	    /*
	        Définit la classe de l'élément
	            [YUI.Node] obj       : L'Elément
	            [string]   className : Nom de la classe CSS
	        Retourne:
	            [string] chaine comportant le(s) nom(s) de classe(s) avant modification
	    */
	    setClass : function(obj,className){
	        var orgClass = obj.get('className');
                if(empty(orgClass))
                    orgClass = obj.get('class');
	        obj.set('className',className);
	        obj.set('class',className);
                return orgClass;
	    },
            
	    /*
	        Obtient les classes de l'élément
	            [YUI.Node]   obj       : L'Elément
	        Retourne:
	            [string] chaine original comportant les noms de classes
	    */
	    getClass : function(obj){
	        return obj.get('className');
	    },
	    /*
	        Détache une classe d'un élément
	            [object]   obj       : L'Elément
	            [string]   className : Nom de classe
	        Retourne:
	            [string] chaine original comportant les noms de classes présent avant changement
	    */
	    removeClass : function(obj,className){
	        var orgClass = obj.get('className');
	        orgClass = orgClass.replace(className, '');
	        return obj.set("className",orgClass);
	    },
	    /*
	        Détache une classe d'un élément
	            [object]   obj       : L'Elément
	            [string]   className : Nom de classe
	        Retourne:
	            [string] chaine original comportant les noms de classes présent avant changement
	    */
	    createClass : function(className, style){
	        
	        var styleNode = Y.Node.one("#wfw_ext_dynamic_style");
	
	        if(!styleNode){
	            styleNode = Y.Node.create("<style>");
	            styleNode.set("type","text/css");
	            styleNode.set("id","wfw_ext_dynamic_style");
	            var headNode = Y.Node.one("head");
				headNode.append(styleNode);
//	            objInsertNode(styleNode,headNode,null,INSERTNODE_END);
	        }
	
	        var insert_content = className+"{"+style+"}\n";
	        var content = objGetInnerText(styleNode);
	
	        //remplace la chaine existante 
	        if(!empty(content)){
	            var offset_start = content.indexOf(className);
	            if(offset_start>=0){
	                var offset_end = content.indexOf("\n",offset_start);
	                styleNode.set('text',content.substring(0, offset_start)+insert_content+content.substring(offset_end+1));
	                return;
	            }
	        }
	
	        //insert a la suite du contenu
	        content += insert_content;
			styleNode.set('text',content);
	
	    }

	}
}, '1.0', {
      requires:['base','node']
});

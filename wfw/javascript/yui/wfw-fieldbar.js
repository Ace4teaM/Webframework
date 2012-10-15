/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    Barre de champs

    JS  Dependences: base.js
    YUI Dependences: base, node, states

    Revisions:
        [11-10-2012] Implementation
*/

YUI.add('fieldbar', function (Y, NAME) {
	Y.FieldBar = {
		
	    /*
	        Objet FIELD_BAR
	        Membres:
	            [string]          title    : Texte affiché dans la barre de titre
	            [function/object] onOK     : Callback appelé lors l'utilisateur clique sur "OK" / Options de la fonction "printOK()"
	            [function/object] onCancel : Callback appelé lors l'utilisateur clique sur "Annuler" / Options de la fonction "printCancel()"
	    */
	    FIELD_BAR : {
	        //FIELD_BAR options
	        inputClass   : "wfw_ext_fieldbar",
	        barClass     : "wfw_ext_fieldbar",
	        itemClass    : "wfw_ext_fieldbar_item wfw_bg_frame",
	        itemEvent    : null,
	        editable     : false,
			maxItemChar  : 20,
	        //Membres
	        onRemoveItem : function(i){},
	        onCreateBar  : function(e){},
	        onCreateItem : function(e){},
			//Membres privés
	        contener     : null,
			item_contener: null,
	        //constructeur
	        _construct : function(obj){
	        }
	    },
		
	    /*
	        [on input change]
	    */
	    onInputChange : function(e)
	    {
			var fieldbar = Y.FieldBar.getStates(this);
	     	Y.FieldBar.updateView(this);
	    },
		
	    /*
	    Initialise le visuel depuis un élément INPUT
	    Parametres:
	        [YUINode] element  : Identificateur ou référence de l'élément INPUT
	        [object]  args     : Optionnel, Arguments de l'objet 'wfw.ext.fieldBar.FIELD_BAR'
	    Retourne:
	        [FIELD_BAR] L'Objet créé
	    */
	    initElement : function(element,args) {

	        //obtient l'objet FIELD_BAR
	        var fieldbar = Y.States.fromId(
	            element.get('id'),
	            $new(Y.FieldBar.FIELD_BAR,args),
	            { name:"wfw.ext.fieldbar" }
	        );

	        //intialise l'input
			element.on("change", this.onInputChange);
	        element.addClass(fieldbar.inputClass);
	 
	        //initialise le conteneur prinipale
	        try{
	            var contener = Y.Node.create("<div>");
				contener.set('id',uniqid());
	            contener.addClass(fieldbar.barClass);
				element.insert(contener,'after');
	 //           objInsertNode(contener,objGetParent(element),element,INSERTNODE_AFTER);
	            fieldbar.contener = contener;
				//evenement
				fieldbar.onCreateBar(contener);
	        }
	        catch(e){
	            wfw.checkError(e);
	            return false;
	        }
			
	        //initialise le conteneur d'item
	        try{
	            var item_contener = Y.Node.create("<span>");
				item_contener.set('id',uniqid());
				fieldbar.contener.append(item_contener);
	//            objInsertNode(item_contener,fieldbar.contener,null,INSERTNODE_END);
	            fieldbar.item_contener = item_contener;
	        }
	        catch(e){
	            wfw.checkError(e);
	            return false;
	        }
			
	        //initialise les items
	        this.updateView(element);
	
	        return fieldbar;
	    },
		
	    /*
	    Insert un item
	    Parametres:
	        [string/HTMLElement] element  : Identificateur ou référence de l'élément INPUT
	        [integer]            pos      : Position de l'item, si -1 la derniére position est choisie.
	    Retourne:
	        [boolean] true si l'item est inséré, false si la position est invalide.
	    */
	    insertItem: function (element,text,pos) {
	        var input_str="";

	        //obtient l'objet FIELD_BAR
	        var fieldbar = this.getStates(element);
	        //obtient la liste des items
	        var itemList = this.getItemTextList(element);
	        //dernier element ?
	        if(pos<0)
	            return this.pushItem(element,text);
	        //position valide
	        if(typeof(itemList[pos]) == "undefined"){
	            wfw.puts("wfw.ext.fieldbar.insertItem: Position invalide");
	            return false;
	        }
	        //supprime l'item
	        itemList = insert_key(itemList,pos,text);
	        //definit l'input
			element.set('value',strimplode(itemList,";",false));
	        //actualise la vue
	        this.updateView(element);

	        return true;
	    },
	    /*
	    Insert un item en fin de liste
	    Parametres:
	        [string/HTMLElement] element  : Identificateur ou référence de l'élément INPUT
	        [string]             text     : Texte à insérer
	    Retourne:
	        [boolean] true si l'item est inséré, sinon false.
	    */
	    pushItem: function (element, text) {
	
	        //obtient l'objet FIELD_BAR
	        var fieldbar = this.getStates(element);
	
	        //insert l'item à la fin de la liste
	        try{
	            var item = this.makeItemElement(element, text);
				fieldbar.contener.append(item);
//	            objInsertNode(item,fieldbar.contener,null,INSERTNODE_END);
	        }
	        catch(e){
	            wfw.checkError(e);
	            return false;
	        }
	
	        //ajoute à la fin de l'input
			element.set('value',element.get('value')+text+";");
	
	        return true;
	    },
	    /*
	    Fabrique l'element d'un item
	    Parametres:
	        [string/HTMLElement] element  : Identificateur ou référence de l'élément INPUT
	        [string]             text     : Texte à insérer
	    Retourne:
	        [HTMLElement] true si l'item est inséré, sinon false.
	    Remarques:
	    	Un nouvel élément de type SPAN est créé avec la classe FIELD_BAR.itemClass.
	    	Un identificateur unique est généré et le texte inséré à l'interieur de la balise.
	    */
	    makeItemElement: function (element, text) {

			if(typeof text != "string")
				text = ""+text;
	
	        //obtient l'objet FIELD_BAR
	        var fieldbar = this.getStates(element);
			
			//tronque le texte
			if(fieldbar.maxItemChar && strlen(text)>fieldbar.maxItemChar)
				text = text.substr(0,fieldbar.maxItemChar-3)+"...";
	
	        //initialise l'item
	        var item = Y.Node.create("<span>");
			item.set('id',uniqid());
			if(typeof(fieldbar.itemClass) == "string")
	        	item.addClass(fieldbar.itemClass);
	
			//insert le texte de l'item
	        var label = Y.Node.create("<label>");
			var txt = Y.Node.create("<label>"+text+"</label>");
			label.insert(txt);
			item.insert(label);
//	        var txt = document.createTextNode(text);
//			objInsertNode(txt,label,null,INSERTNODE_END);
//			objInsertNode(label,item,null,INSERTNODE_END);
			
			//event
			if(typeof(fieldbar.onCreateItem) == "function")
				fieldbar.onCreateItem(item,label);
	
	        return item;
	    },
	    /*
	    Actualise le visuel à partir du texte
	    Parametres:
	        [string/HTMLElement] element  : Identificateur ou référence de l'élément INPUT
	    Retourne:
	        [boolean] true.
	    */
	    updateView: function (element) {
	
	        //obtient l'objet FIELD_BAR
	        var fieldbar = this.getStates(element);
	        //supprime le contenu existant
			fieldbar.item_contener.get('childNodes').remove();
//	        objRemoveChildNode(fieldbar.item_contener,null,REMOVENODE_ALL);
	        //obtient la liste des items
	        var itemList = this.getItemTextList(element);
	        //insert les items
	        for(var i in itemList){
	            var item = this.makeItemElement(element,itemList[i]);
				fieldbar.item_contener.append(item);
//	            objInsertNode(item,fieldbar.item_contener,null,INSERTNODE_END);
	        }
	        return true;
	    },
		
	    /*
	    Actualise le texte à partir du visuel
	    Parametres:
	        [string/HTMLElement] element  : Identificateur ou référence de l'élément INPUT
	    Retourne:
	        [boolean] true.
	    */
	    updateInput: function (element) {
	        var input_str="";
	
	        //obtient l'objet FIELD_BAR
	        var fieldbar = this.getStates(element);
	        //scan la liste des items
	        fieldbar.contener.all("span").each(function(item) {
	            input_str += item.get('innerText')+";";
			});
/*	        var item = objGetChild(fieldbar.contener,"span");
	        while(item != null){
	            input_str += objGetInnerText(item)+";";
	            item = objGetNext(item,"span");
	        }*/
	        return true;
	    },
	    /*
	    Supprime un item
	    Parametres:
	        [string/HTMLElement] element  : Identificateur ou référence de l'élément INPUT
	        [integer] pos  : Position de l'item
	    Retourne:
	        [boolean] true si l'item est supprimé, false si la position est invalide.
	    */
	    removeItem: function (element,pos) {
	        var input_str="";
	
	        //obtient l'objet FIELD_BAR
	        var fieldbar = this.getStates(element);
	        //obtient la liste des items
	        var itemList = this.getItemTextList(element);
	        //dernier element ?
	        if(pos<0)
	            pos = itemList.length-1;
	        //position valide
	        if(typeof(itemList[pos]) == "undefined"){
	            wfw.puts("wfw.ext.fieldbar.removeItem: Position invalide");
	            return false;
	        }
	        //supprime l'item
	        remove_key(itemList,pos);
	        //definit l'input
			element.set('value',strimplode(itemList,";",false));
	        //actualise la vue
	        this.updateView(element);
	
	        return true;
	    },
	    /*
	    Obtient les données liées à l'élément
	    Parametres:
	        [string/HTMLElement] element  : Identificateur ou référence de l'élément INPUT
	    Retourne:
	        [FIELD_BAR] Objet de données.
	    */
	    getItemTextList: function (element) {
	        //obtient la liste des items
	        return strexplode(element.get('value'),";",true);
	    },
	    /*
	    Obtient les données liées à l'élément
	    Parametres:
	        [string/HTMLElement] element  : Identificateur ou référence de l'élément INPUT
	    Retourne:
	        [FIELD_BAR] Objet de données.
	    */
	    getStates: function (element) {
	        return Y.States.fromId(element.get('id'), null, {name:"wfw.ext.fieldbar"});
	    }
	}
}, '1.0', {
      requires:['base','node','states']
});

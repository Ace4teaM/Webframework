/*
    (C)2012 ID-Informatik. All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    WebFrameWork(R)

    Geometry 2D

    Dependences: base.js, dom.js, wfw.js

    Revisions:
        [09-04-2012] Implentation
*/


wfw.ext.layout = {

	LAYOUT:{
		position:"middle",
		offset_t:0,
		offset_l:0,
		offset_r:0,
		offset_b:0,
		top:null,
		left:null,
		middle:null,
		bottom:null,
		right:null,
		w:null,
		h:null,
		stretch:false
	},
	
	init : function(){
		// intialise les evenements
		wfw.event.SetCallback("wfw_layout","resize","onResize",wfw.ext.layout.onResize,false);
	},
	
	//retourne la taille du client de la fenetre
/*	getWindowSize : function() {
	    var size = {w:0,h:0};
	    if (typeof (window.innerWidth) == 'number') {
	        //Non-IE
	        size.w = window.innerWidth;
	        size.h = window.innerHeight;
	    } else if (document.documentElement && (document.documentElement.clientWidth ||   document.documentElement.clientHeight)) {
	        //IE 6+ in 'standards compliant mode'
	        size.w = document.documentElement.clientWidth;
	        size.h = document.documentElement.clientHeight;
	    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
	        //IE 4 compatible
	        size.w = document.body.clientWidth;
	        size.h = document.body.clientHeight;
	    }
		return size;
	},*/

	initElement : function(element,args){
		element = $doc(element);
		
        //obtient l'objet FIELD_BAR
        var layout = wfw.states.fromElement(
            element,
            $new(wfw.ext.layout.LAYOUT,args),
            { name:"wfw_ext_layout" }
        );

        //intialise l'input
        wfw.event.ApplyTo(element, "wfw_layout");
        wfw.style.addClass(element,"wfw_ext_layout");
		
		//stretch ?
		switch (layout.stretch) {
			case true:
	        	this.stretch(element);
				break;
			case "x":
	        	this.stretch_x(element);
				break;
			case "y":
	        	this.stretch_y(element);
				break;
			default:
	        	layout.stretch = null;
				break;
		}
		
 		if(layout.stretch == null){
			//positionne l'element
			if (layout.w == "parent") {
				layout.w = objGetW(objGetParent(element));
				//alert(layout.w);
			}
			if (layout.h == "parent") {
				layout.h = objGetH(objGetParent(element));
				//alert(layout.h);
			}
			
			//
			if (layout.h != null)
				element.style.width  = layout.w+"px";
			if (layout.w != null)
				element.style.height = layout.h+"px";
		}
	},
	
	onResize : function(e){
		alert(this);
	},
	
	/**
	 * Etend l'objet à l'ensemble de son parent
	 */
	stretch_x : function(element){
        var layout = wfw.states.fromElement(element, null, {name:"wfw_ext_layout"});
		layout.stretch = "x";
		element.style.width  = "auto";
		if (layout.h != null)
			element.style.height = layout.h+"px";
        wfw.style.removeClass(element,"wfw_ext_layout_streach");
        wfw.style.addClass(element,"wfw_ext_layout_streach_x");
	},
	
	/**
	 * Etend l'objet à l'ensemble de son parent
	 */
	stretch_y : function(element){
        var layout = wfw.states.fromElement(element, null, {name:"wfw_ext_layout"});
		layout.stretch = "y";
		element.style.height  = "auto";
		if (layout.w != null)
			element.style.width = layout.w+"px";
        wfw.style.removeClass(element,"wfw_ext_layout_streach");
        wfw.style.addClass(element,"wfw_ext_layout_streach_y");
	},
	
	/**
	 * Etend l'objet à l'ensemble de son parent
	 */
	stretch : function(element){
        var layout = wfw.states.fromElement(element, null, {name:"wfw_ext_layout"});
		layout.stretch = true;
		element.style.width  = "auto";
		element.style.height = "auto";
        wfw.style.removeClass(element,"wfw_ext_layout_streach_x");
        wfw.style.removeClass(element,"wfw_ext_layout_streach_y");
        wfw.style.addClass(element,"wfw_ext_layout_streach");
	},
	
	/**
	 * Détend l'objet de son parent
	 */
	unstretch : function(element){
        var layout = wfw.states.fromElement(element, null, {name:"wfw_ext_layout"});
		layout.stretch = false;
        wfw.style.removeClass(element,"wfw_ext_layout_streach");
		if (layout.w != null)
			element.style.width  = layout.w+"px";
		if (layout.h != null)
			element.style.height = layout.h+"px";
	},
	
	/**
	 * Actualise la position des elements
	 * @param {Object} element
	 */
	setPlacement : function(element){
		element = $doc(element);
		
        //obtient l'objet LAYOUT
        var layout = wfw.states.fromElement(element, null, {name:"wfw_ext_layout"});
		
		//place les elements enfants
		//middle
		if (layout.middle != null) {
			layout.middle.style.top = layout.offset_t+"px";
			layout.middle.style.left = layout.offset_l+"px";
			layout.middle.style.right = layout.offset_r+"px";
			layout.middle.style.bottom = layout.offset_b+"px";
		}
		//top
		if (layout.top != null) {
			layout.top.style.top = 0+"px";
			layout.top.style.left = 0+"px";
			layout.top.style.right = 0+"px";
			layout.top.style.bottom = null;
			layout.top.style.height = layout.offset_t+"px";
		}
		//left
		if (layout.left != null) {
			layout.left.style.top = layout.offset_t+"px";
			layout.left.style.left = 0+"px";
			layout.left.style.right = null;
			layout.left.style.bottom = layout.offset_b+"px";
			layout.left.style.width = layout.offset_l+"px";
		}
		//right
		if (layout.right != null) {
			layout.right.style.top = layout.offset_t+"px";
			layout.right.style.left = "auto";//(objGetW(element) - layout.offset_r)+"px";
			layout.right.style.right = 0+"px";
			layout.right.style.bottom = layout.offset_b+"px";
			layout.right.style.width = layout.offset_r+"px";
		}
		//bottom
		if (layout.bottom != null) {
			layout.bottom.style.top = "auto";//(objGetH(element) - layout.offset_b)+"px";
			layout.bottom.style.left = 0+"px";
			layout.bottom.style.right = 0+"px";
			layout.bottom.style.bottom = 0+"px";
			layout.bottom.style.height = layout.offset_b+"px";
		}
	},
	
	/*
	 * Positionne un element dans le layout
	 * @param {Object} element
	 * @param {Object} child
	 * @param {Object} size
	 * @param {Object} placement
	 */
	setElement : function(element,child,size,placement){
		element = $doc(element);
		
        //obtient l'objet LAYOUT
        var layout = wfw.states.fromElement(element, null, {name:"wfw_ext_layout"});
			
		//place l'element enfant
		child   = $doc(child);
		
		wfw.style.addClass(child,"wfw_ext_layout_item");
		
		if(placement == "middle"){
			layout.middle = child;
		}
		if(placement == "top"){
			layout.top = child;
			if(size == null)
				size = objGetOrgH(child);
			layout.offset_t    = size;
		}
		if(placement == "left"){
			layout.left = child;
			if(size == null)
				size = objGetOrgW(child);
			layout.offset_l    = size;
		}
		if(placement == "bottom"){
			layout.bottom = child;
			if(size == null)
				size = objGetOrgH(child);
			layout.offset_b    = size;
		}
		if(placement == "right"){
			layout.right = child;
			if(size == null)
				size = objGetOrgW(child);
			layout.offset_r    = size;
		}
	}
};

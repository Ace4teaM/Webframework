/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    Disposition visuel des éléments

    JS  Dependences: base.js
    YUI Dependences: base, wfw, wfw-event, wfw-utils, wfw-style

    Implementation: [18-10-2012]
*/

YUI.add('wfw-layout', function (Y) {
    var wfw = Y.namespace('wfw');
    
    wfw.Layout = {
        LAYOUT : function(att){
            //OBJECT
            this.ns        = "wfw_layout";
            //
            this.position  = "middle";
            this.offset_t  = 0;
            this.offset_l  = 0;
            this.offset_r  = 0;
            this.offset_b  = 0;
            this.top       = null;
            this.left      = null;
            this.middle    = null;
            this.bottom    = null;
            this.right     = null;
            this.w         = null;
            this.h         = null;
            this.stretch   = false;
            
            /*
                Constructeur
            */
            wfw.Layout.LAYOUT.superclass.constructor.call(this, att);

        },
	
        init : function(){
            // intialise les evenements
            wfw.Event.SetCallback("wfw_layout","resize","onResize",wfw.Layout.onResize,false);
        },
	
        /*
         * Initialise un élément layout
         **/
        initElement : function(element,args){

            //obtient l'objet FIELD_BAR
            var layout = wfw.States.fromElement(
                element,
                new wfw.Layout.LAYOUT(args),
                {
                    name:"wfw_ext_layout"
                }
            );

            //intialise l'input
            wfw.Event.ApplyTo(element, "wfw_layout");
            wfw.Style.addClass(element,"wfw_ext_layout");
		
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
                    layout.w = wfw.Utils.getWidth(element.ancestor());
                //  alert(layout.w);
                }
                if (layout.h == "parent") {
                    layout.h = wfw.Utils.getHeight(element.ancestor());
                //  alert(layout.h);
                }

                //
                if (layout.h != null)
                    element.set("style.width", layout.w+"px");
                if (layout.w != null)
                    element.set("style.height", layout.h+"px");
            }
        },
	
        onResize : function(e){
            alert(this);
        },
	
        /**
	 * Etend l'objet à l'ensemble de son parent
	 */
        stretch_x : function(element){
            var layout = wfw.States.fromElement(element, null, {
                name:"wfw_ext_layout"
            });
            layout.stretch = "x";
            element.set("style.width","auto");
            if (layout.h != null)
                element.set("style.height",layout.h+"px");
            wfw.Style.removeClass(element,"wfw_ext_layout_streach");
            wfw.Style.addClass(element,"wfw_ext_layout_streach_x");
        },
	
        /**
	 * Etend l'objet à l'ensemble de son parent
	 */
        stretch_y : function(element){
            var layout = wfw.States.fromElement(element, null, {
                name:"wfw_ext_layout"
            });
            layout.stretch = "y";
            element.set("style.height", "auto");
            if (layout.w != null)
                element.set("style.width", layout.w+"px");
            wfw.Style.removeClass(element,"wfw_ext_layout_streach");
            wfw.Style.addClass(element,"wfw_ext_layout_streach_y");
        },
	
        /**
	 * Etend l'objet à l'ensemble de son parent
	 */
        stretch : function(element){
            var layout = wfw.States.fromElement(element, null, {
                name:"wfw_ext_layout"
            });
            layout.stretch = true;
            element.set("style.width", "auto");
            element.set("style.height", "auto");
            wfw.Style.removeClass(element,"wfw_ext_layout_streach_x");
            wfw.Style.removeClass(element,"wfw_ext_layout_streach_y");
            wfw.Style.addClass(element,"wfw_ext_layout_streach");
        },
	
        /**
	 * Détend l'objet de son parent
	 */
        unstretch : function(element){
            var layout = wfw.States.fromElement(element, null, {
                name:"wfw_ext_layout"
            });
            layout.stretch = false;
            wfw.Style.removeClass(element,"wfw_ext_layout_streach");
            if (layout.w != null)
                element.set("style.width", layout.w+"px");
            if (layout.h != null)
                element.set("style.height", layout.h+"px");
        },
	
        /**
	 * Actualise la position des elements
	 * @param {Object} element
	 */
        setPlacement : function(element){

            //obtient l'objet LAYOUT
            var layout = wfw.States.fromElement(element, null, {
                name:"wfw_ext_layout"
            });

            //place les elements enfants
            //middle
            if (layout.middle != null) {
                layout.middle.set("style.top", layout.offset_t+"px");
                layout.middle.set("style.left", layout.offset_l+"px");
                layout.middle.set("style.right", layout.offset_r+"px");
                layout.middle.set("style.bottom", layout.offset_b+"px");
            }
            //top
            if (layout.top != null) {
                layout.top.set("style.top", 0+"px");
                layout.top.set("style.left", 0+"px");
                layout.top.set("style.right", 0+"px");
                layout.top.set("style.bottom", null);
                layout.top.set("style.height", layout.offset_t+"px");
            }
            //left
            if (layout.left != null) {
                layout.left.set("style.top", layout.offset_t+"px");
                layout.left.set("style.left", 0+"px");
                layout.left.set("style.right", null);
                layout.left.set("style.bottom", layout.offset_b+"px");
                layout.left.set("style.width", layout.offset_l+"px");
            }
            //right
            if (layout.right != null) {
                layout.right.set("style.top", layout.offset_t+"px");
                layout.right.set("style.left", "auto");
                layout.right.set("style.right", 0+"px");
                layout.right.set("style.bottom", layout.offset_b+"px");
                layout.right.set("style.width", layout.offset_r+"px");
            }
            //bottom
            if (layout.bottom != null) {
                layout.bottom.set("style.top", "auto");
                layout.bottom.set("style.left", 0+"px");
                layout.bottom.set("style.right", 0+"px");
                layout.bottom.set("style.bottom", 0+"px");
                layout.bottom.set("style.height", layout.offset_b+"px");
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
  
            //obtient l'objet LAYOUT
            var layout = wfw.States.fromElement(element, null, {
                name:"wfw_ext_layout"
            });

            //place l'element enfant
            wfw.Style.addClass(child,"wfw_ext_layout_item");

            if(placement == "middle"){
                layout.middle = child;
            }
            if(placement == "top"){
                layout.top = child;
                if(size == null)
                    size = wfw.Utils.getOrgHeight(child);
                layout.offset_t    = size;
            }
            if(placement == "left"){
                layout.left = child;
                if(size == null)
                    size = wfw.Utils.getOrgWidth(child);
                layout.offset_l    = size;
            }
            if(placement == "bottom"){
                layout.bottom = child;
                if(size == null)
                    size = wfw.Utils.getOrgHeight(child);
                layout.offset_b    = size;
            }
            if(placement == "right"){
                layout.right = child;
                if(size == null)
                    size = wfw.Utils.getOrgWidth(child);
                layout.offset_r    = size;
            }
        }
    };

    /*-----------------------------------------------------------------------------------------------------------------------
    * ADDRESS Class Implementation
    *-----------------------------------------------------------------------------------------------------------------------*/

    Y.extend(wfw.Layout.LAYOUT, wfw.OBJECT);

}, '1.0', {
    requires:['base','wfw','wfw-event','wfw-utils','wfw-style']
});

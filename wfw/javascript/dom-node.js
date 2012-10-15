
var _class_ = {
    _self : null, // instance
    _parent : null, // heritage
    _method : {}, // heritage
    _const : {}, // heritage
};

var DOMNode = {
    DOMNode : function(nav_node){
        switch(nav_node.nodeType){
            case ELEMENT_NODE:
                return DOMNodeElement(nav_node);
        }
    },
};

var DOMNodeElement = {
    _parent : DOMNode, // heritage
    _ctr : function(p,m,node){
        m.node = node;
        return true;
    },
    _method : {
        next : function(p,m){
            var node = p.next();
            while((node!=null) && (node.nodeType != DOMNode._const.ELEMENT_NODE)){
            }
        }
    },
    _member : {
    }
};

function class_inerit(parent,child){
    child._parent = parent;
    for(key in parent){
        if(typeof(child[key]))
            //
        else
            child[key] = parent[key];
    }
}

function class_create(self,class){
    //init parent
    if(class._parent!=null)
        self._parent = class_create(self,class._parent);

    //ajoute les membres
    for(key in class._member){
        self._member[key] = class._method[key];
    }

    //ajoute les methodes
    for(key in class._method){
        method = class._method[key];
        if(typeof(method)=='function')
        {
            self[key] = function(){
                return method.apply(self._parent, self._member, arguments);
            }
        }
    }

    return self;
}

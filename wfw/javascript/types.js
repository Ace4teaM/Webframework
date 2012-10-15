var result_t = {
    toString: function(){return this.value;}
};
var error_t = {
    toString: function(){return "error resulting";}
};
var null_t = {
    toString: function (){ return "null"; }
};

var callback_t = {
    toString: function () { return "callback"; },
    param:null,
    func:null
};

/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        Author: AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    DataType
    Verification des formats de données

    JS  Dependences: base.js
    YUI Dependences: base, node, wfw, wfw-request, wfw-event

    Revisions:
        [16-10-2012] Implementation
*/

YUI.add('wfw-datatype', function (Y) {
    var wfw = Y.namespace('wfw');
    
    wfw.DataType = {

        /*
            Initialise l'extension
        */
        init: function () {

            wfw.Event.SetCallback(
                "wfw_datatype_check",
                "change",
                "eventCheckDataType",
                function(e){
                    var data_type = this.get('wfw_datatype');
                    if(data_type==null)
                        return;
                    //post la requete
                    wfw.Request.Add(null,wfw.request_path('input_check.php'),{type:data_type,value:this.value},wfw.DataType.onReqCheckDataType,{input:this});
                }
            );

            return true;
        }

    };
    
    //initialise
    wfw.DataType.init();
    
}, '1.0', {
      requires:['base', 'node','wfw', 'wfw-request', 'wfw-event']
});

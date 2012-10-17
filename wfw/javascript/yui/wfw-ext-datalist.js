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
    YUI Dependences: base, node, request, event

    Revisions:
        [16-10-2012] Implementation
*/

YUI.add('datatype', function (Y, NAME) {
    Y.DataType = {

        /*
            Initialise l'extension
        */
        init: function () {

            Y.Event.SetCallback(
                "wfw_datatype_check",
                "change",
                "eventCheckDataType",
                function(e){
                    var data_type = this.get('wfw_datatype');
                    if(data_type==null)
                        return;
                    //post la requete
                    Y.Request.Add(null,Y.WFW.request_path('input_check.php'),{type:data_type,value:this.value},Y.DataType.onReqCheckDataType,{input:this});
                }
            );

            return true;
        }

    };
    
    //initialise
    Y.DataType.init();
    
}, '1.0', {
      requires:['base', 'node', 'request', 'event']
});

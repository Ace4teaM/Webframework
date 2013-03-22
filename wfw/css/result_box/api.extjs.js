
/*------------------------------------------------------------------------------------------------------------------*/
/**
 * @brief Initialise la vue de résultat
 * @param node [Node] Noeud de l'élément result
 * @param result [object] Objet wfw.Result
 * */
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.showResultToElement = function(node,result)
{
    node.one("> div").set("className",result.result);
    node.one(".err").set("text",result.getError());
    node.one(".msg").set("text",result.getMessage());
}

MyApp.showResultToMsg = function(result)
{
    var obj = {
        title: result.getResult(),
        msg: result.getError(),
        buttons: Ext.Msg.OK,
        icon: Ext.Msg.QUESTION
   };
   var msg = result.getMessage();
   if(msg)
       obj.msg += "<br/>"+result.getMessage();
   switch(result.result){
       case "ERR_FAILED":
           obj.icon = Ext.Msg.WARNING;
           break;
       case "ERR_SYSTEM":
           obj.icon = Ext.Msg.ERROR;
           break;
   }
    Ext.Msg.show(obj);
}

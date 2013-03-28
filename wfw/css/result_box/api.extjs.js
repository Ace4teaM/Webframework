
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
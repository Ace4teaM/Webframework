/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "request.html"

Revisions:
    [11-10-2012] Implentation
*/

//initialise le contenu
YUI(wfw_yui_config(wfw_yui_base_path)).use('node', 'wfw-event', 'wfw-request', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){
        //initialise l'interface de requete
        wfw.HTTP.init();

        //[Envoie la requête]
        Y.Node.one("#send_btn").on("click",function(e){
            wfw.Request.Add(
                //name
                null,
                //URI
                Y.Node.one("#uri").get('value'),
                //get/post args
                null,
                //callback
                function(request){
                    var log = Y.Node.one("#log");
                    log.append("<p>"+request.name+": Status = "+request.status+"</p>");
                    if(request.status == 200){
                        log.append("<p>"+request.name+": Response = "+request.response+"</p>");
                    }
                },
                //user_data
                null,
                //async
                false
                );
        });
    };

    //onload event
    Y.one('window').on('load', onLoad);
});

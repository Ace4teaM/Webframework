/*
(C)2012 AceTeaM. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
Auteur : AUGUEY THOMAS
Mail   : dev@aceteam.org
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "form.html"

Implentation: [21-11-2012]
*/

//initialise le contenu
YUI(wfw_yui_config(wfw_yui_base_path)).use('node', 'wfw-event', 'wfw-form', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){
        
            // Liste les éléments du formulaire
            Y.Node.one("#show_elements").on("click",function(e){
                var infos = Y.Node.one("#infos");
                infos.all("*").remove();
                var elements = wfw.Form.get_elements("form", {getStaticNode: (Y.Node.one("#all").get("checked"))});
                for(var i in elements){
                    var e = elements[i];
                    infos.append("<p>"+i+" = \""+e.get("tagName")+"\"</p>");
                }
            });

            // Liste les champs du formulaire
            Y.Node.one("#show_fields").on("click",function(e){
                var infos = Y.Node.one("#infos");
                infos.all("*").remove();
                var elements = wfw.Form.get_fields("form", {getStaticNode: (Y.Node.one("#all").get("checked"))});
                for(var name in elements){
                    var value = elements[name];
                    infos.append("<p>"+name+" = \""+value+"\"</p>");
                }
            });

            // Envoie du formulaire par le biais d'une frame
            Y.Node.one("#send_frame").on("click",function(e){
                wfw.Form.sendFrame(
                    "form",
                    null,
                    function(responseText,param,args){ alert(responseText); },
                    { foo:"bar" },
                    {
                        hiddenFrame: (Y.Node.one("#hide_frame").get("checked")),
                        getStaticNode: (Y.Node.one("#all").get("checked"))
                    }
                );
            });

            // Envoie du formulaire
            Y.Node.one("#send_form").on("click",function(e){
                wfw.Form.send( "form", null, null, null );
            });

            // Envoie du formulaire par le biais d'une requete
            Y.Node.one("#send_req").on("click",function(e){
                wfw.Form.sendReq(
                    "form",
                    null,
                    true,
                    function(obj){
                        if (!wfw.Request.onCheckRequestStatus(obj))
                            return;

                        alert(obj.response);
                    },
                    { foo:"bar" }
                );
            });
                    
    };
    
    Y.one('window').on('load', onLoad);
});


/*
(C)2012 AceTeaM. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
Auteur : AUGUEY THOMAS
Mail   : dev@aceteam.org
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "telechargement.html"

Implentation: [28-11-2012]
*/

//initialise le contenu
YUI(wfw_yui_config(wfw_yui_base_path)).use('node', 'wfw-style', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){
        
        /*
        * ---------------------------------------------------------------
        * Liens vers le dépot Git
        * ---------------------------------------------------------------
        */
       
       var read_only_link = "git://github.com/Ace4teaM/Webframework.git";
       var http_link      = "https://github.com/Ace4teaM/Webframework.git";
       var ssh_link       = "https://github.com/Ace4teaM/git@github.com:Ace4teaM/Webframework.git";
        
       var read_only_btn = Y.Node.one("#git_read_only_link");
       var http_btn      = Y.Node.one("#git_http_link");
       var ssh_btn       = Y.Node.one("#git_ssh_link");
       
       var on_http_click = function(e){
            Y.Node.one("#git_link").set("value",http_link);
            wfw.Style.addClass(ssh_btn,"inactive");
            wfw.Style.addClass(read_only_btn,"inactive");
            wfw.Style.removeClass(this,"inactive");
       };
        
       var on_ssh_click = function(e){
            Y.Node.one("#git_link").set("value",ssh_link);
            wfw.Style.addClass(http_btn,"inactive");
            wfw.Style.addClass(read_only_btn,"inactive");
            wfw.Style.removeClass(this,"inactive");
       };
        
       var on_read_only_click = function(e){
            Y.Node.one("#git_link").set("value",read_only_link);
            wfw.Style.addClass(ssh_btn,"inactive");
            wfw.Style.addClass(http_btn,"inactive");
            wfw.Style.removeClass(this,"inactive");
       };
        
        //initailise les evenements
        http_btn.on("click",on_http_click);
        ssh_btn.on("click",on_ssh_click);
        read_only_btn.on("click",on_read_only_click);

        //click sur HTTP!s
        on_http_click.apply(http_btn,[null]);
    };
    
    Y.one('window').on('load', onLoad);
});


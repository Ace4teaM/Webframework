/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "xml_template.html"

Implentation: [23-10-2012]
*/

//initialise le contenu
YUI(wfw_yui_config(wfw_yui_base_path)).use('node', 'wfw-event', 'wfw-form', 'wfw-xml-template', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e)
    {
        var biblio = Y.Node.one("#biblio");
        
        //----------------------------------------------------------------------------------
        // ajout un template dynamiquement template
        Y.Node.one("#insert_manga").on("click",function(e,p){
            wfw.Template.insert( Y.Node.one("#my_template"), Y.Node.one("#biblio"), wfw.Form.get_fields("insert_manga_form"));
        });
        
        //----------------------------------------------------------------------------------
        // ajoute quelques exemples de template
        wfw.Template.insert(
            Y.Node.one("#my_template"),
            Y.Node.one("#biblio"),
            {
                title : "Golden boy",
                text  : "Golden Boy ( ゴールデンボーイ ?) est un manga de Tatsuya Egawa.\nPublié en français aux éditions Dynamic Visions. Seul cinq volumes sur dix ont été traduits, avant l'arrêt de la publication. ",
                img   : "bin/pictures/manga/Golden-Boy.jpg"
            }
        );
            
            
        wfw.Template.insert(
            Y.Node.one("#my_template"),
            Y.Node.one("#biblio"),
            {
                title : "Princess Princess",
                text  : "Princess Princess (プリンセス・プリンセス, Purinsesu Purinsesu?) est le titre d’une série de fiction écrite et dessinée par la mangaka Mikiyo Tsuda."
            }
        );
            
         wfw.Template.insert(
            Y.Node.one("#my_template"),
            Y.Node.one("#biblio"),
            {
                title : "Princess Princess",
                text  : "Great Teacher Onizuka (グレート・ティーチャー・オニヅカ, Gurēto Tīchā Onizuka?), souvent abrégé en GTO, est un shōnen manga racontant l'histoire de Eikichi Onizuka professeur dans une école.",
                img   : "bin/pictures/manga/great_teacher_onizuka.jpg"
            }
        );
    };

    //onload event
    Y.one('window').on('load', onLoad);
});

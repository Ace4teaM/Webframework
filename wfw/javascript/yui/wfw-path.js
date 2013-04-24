/*
    (C)2012,2013 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        Author: AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    Path
    Fonctions utile aux chemins d'accès

    JS  Dependences: base.js
    YUI Dependences: base

    Implementation: [17-10-2012]
*/

YUI.add('wfw-path', function (Y) {
    var wfw = Y.namespace('wfw');
    
    /**
     * @class Path
     * @memberof wfw
     * @brief Fonctions relatives aux noms de fichiers
     * */
    wfw.Path = {

        /*
            @brief Retourne un nom de fichier sans l'extension
            @param string path Chemin d'accès
            @return string Nom du fichier
            @retval null Le chemin ne comporte pas de nom de fichier
        */
        filename : function(path,opt)
        {
            opt = object_merge({
                include_ext:false
            },opt);
            
            var name = '[^\\//?*]*';
            var exp = new RegExp('^(?:[/]?)(?:'+name+'/)*('+name+')$','g');
            var rslt = exp.exec(path);
            if(rslt != null){
                var filename = rslt[1];
                //pas d'extension ?
                if(!opt.include_ext){
                    var point_pos = filename.lastIndexOf('.');
                    if(point_pos != -1)
                        filename=filename.substring(0,point_pos);
                }
                return filename;
            }
            return null;
        }
    };
}, '1.0', {
    requires:['base']
});

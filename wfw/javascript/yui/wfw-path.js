/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
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

    Revisions:
        [17-10-2012] Implementation
*/

//YUI.namespace("wfw");

YUI.add('path', function (Y, NAME) {
    Y.Path = {

        /*
            Retourne le nom de fichier d'un chemin
            Paramètres:
                [string] path : Chemin d'accès
        */
        filename : function(path)
        {
            var name = '[^\\//?*]*';
            var exp = new RegExp('^([/]?)('+name+'/)*('+name+')$','g');
            rslt = exp.exec(path);
            if(rslt != null){
    //            objAlertMembers(rslt);
                var point_pos = rslt[3].lastIndexOf('.');
                if(!point_pos)
                    return "";
                return rslt[3].substring(0,point_pos);
            }
            return null;
        }
    }
}, '1.0', {
      requires:['base']
});

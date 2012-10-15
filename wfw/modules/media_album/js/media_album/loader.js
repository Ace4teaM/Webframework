/*
    Module MediaAlbum 
*/
wfw.ext.module.media_album = {
    /*
    init [Appel�e par wfw.ext.module]
    */
    init: function () {
    },
    /*
    charge les donn�es d'un catalogue dans le navigateur
    */
    loadCatalog: function (client_id, fields_exp) {
        //recupere les infos sur le fichier
        var param = {
            "onsuccess": function (obj, args) {
            }
        };
        var fields = {
            "wfw_client_id": client_id
        };
        fields = object_merge(fields, fields_exp);
        wfw.request.Add(null, "req/catalog/list_item.php", fields, wfw.utils.onCheckRequestResult_XARG, param, false);
    }
};

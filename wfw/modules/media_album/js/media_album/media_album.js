/*
    Gestionnaire d'album photo
*/
wfw.ext.media_album = {
    IMAGE_GALLERY: {
        images: null,//liste des objets de champs 
        _construct: function (obj) {
            if(obj.images == null)
                obj.images = [];
        },
        /*
            Charge le contenu de l'objet depuis un catalogue
	        Argument:
                [string]   parent_id : Identificateur de l'élément parent
	        Remarques:
                chaque élément enfant est enuméré à la recherche des champs de l'image
        */
        importFromElement: function (ul_element) {
            var li_element = objGetChild(ul_element,"li");
            while(li_element){
                this.images.push(wfw.form.get_fields(li_element));
                li_element = objGetNext(li_element,"li");
            }
        },
        /*
            Charge le contenu de l'objet depuis un catalogue
	        Argument:
                [string]   catalog_client_id : Identificateur client du catalogue
                [object]   userParam         : Paramètres passé à la fonction wfw.ext.utils.callRequestListXARG
                [object]   fields_exp        : Optionnel, Champs additionnels passés à la requête "req/catalog/list_item.php"
	        Remarques:
                importFromCatalog importe le contenu des items de types "image" dans l'instance en cours
        */
        importFromCatalog: function (catalog_client_id,userParam,fields_exp) {
            var instance = this;
            //recupere les infos sur le fichier
            var param = {
                "onsuccess": function (obj, args) {
                    delete(args.result);
                    delete(args.info);
                    delete(args.error);
                    var request_list = [];
                    for(var i in args){
                        request_list.push({
                            name: "Charge l'image: "+i,
                            url: "req/catalog/get_item.php", 
                            args: { wfw_client_id:catalog_client_id, item_guid:i },
                            "onsuccess": function (obj, args) {
                                this.inst.images.push(args);
                            },
                            inst:instance,
                            continue_if_failed: true
                        });
                    }

                    wfw.ext.utils.callRequestListXARG(request_list, userParam);
                }
            };
            var fields = {
                "wfw_client_id": catalog_client_id,
                "wfw_item_id": "image",
                "wfw_item_category": "image"
            };
            fields = object_merge(fields, fields_exp,false);
            wfw.request.Add(null, "req/catalog/list_item.php", fields, wfw.utils.onCheckRequestResult_XARG, param, false);
        },
        /*
            Charge les images dans le navigateur
        */
        load: function (path) {
            for(var i in this.images){
                var fields = this.images[i];
                var image = new Image();
                image.src = path+"/"+fields.image_thumbnail;
            }
        }
    },
};

/*
    Une nouvelle image est chargée
*/
wfw.event.SetCallback( // image
    "media_album_thumb",
    "load",
    "check_loading",
    function(e)
    {
        wfw.ext.mediaAlbum.image_load--;

        // terminé ?
        if(wfw.ext.mediaAlbum.image_load == 0 && typeof(wfw.ext.mediaAlbum.onLoaded)=="function")
        {
            wfw.puts("media_album_thumb: toutes les images sont chargees");
            wfw.ext.mediaAlbum.onLoaded();
        }
        else
            wfw.puts("media_album_thumb: reste "+wfw.ext.mediaAlbum.image_load+" images a charger");
    }
);

/*
    Une erreur au chargement de l'image
*/
wfw.event.SetCallback( // image
    "media_album_thumb",
    "error",
    "check_loading",
    function(e) {
        wfw.ext.mediaAlbum.image_load--;

        // terminé ?
        if(wfw.ext.mediaAlbum.image_load == 0 && typeof(wfw.ext.mediaAlbum.onLoaded)=="function")
        {
            wfw.puts("media_album_thumb: toutes les images sont chargées ("+wfw.ext.mediaAlbum.image_load+")");
            wfw.ext.mediaAlbum.onLoaded();
        }
        else
            wfw.puts("media_album_thumb: reste "+wfw.ext.mediaAlbum.image_load+" images a charger");
    }
);

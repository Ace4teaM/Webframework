/*
    Affichage en scrolling horizontal d'un album photo
*/
wfw.ext.media_album.SIMPLE_ALBUM = {
    image_gallery: null,    // wfw.ext.media_album.IMAGE_GALLERY 
    left_image: null, // indice de l'image actuelement à gauche
    middle_image: null, // indice de l'image actuelement au millieu
    right_image: null, // indice de l'image actuelement à droite
    moving: 0, // compteur de deplacement, represente le nombre d'image en cours d'animation. Lorsque 'moving' est à 0, aucune animation est en cours
    title_element: null,
    view_element: null,
    desc_element: null,
    thumb_max_height: 0,
    thumb_max_width: 0,

    //timer params
    start_pos: 0,
    end_pos: 0,
    image: null,
    delete_on_finish: false,

    //
    _construct: function (obj) {
        obj.thumb_max_height = objGetH(obj.view_element);
        obj.thumb_max_width = objGetW(obj.view_element);
    },

    /*
    Adapté la taille de l'image au carde de visualisation
    */
    truncate_size: function (width, height) {
        var ratio;
        if (this.max_width < this.max_height) /* sur la largeur */
        {
            ratio = (1.0 / width) * this.max_width;
        }
        else
            ratio = (1.0 / height) * this.max_height;

        return { width: parseInt(ratio * width), height: parseInt(ratio * height) };
    },
    /*
    Adapté la taille de l'image
    */
    truncate_rect: function (width, height, max_w, max_h) {
        var ratio;
        var indice_w = width - max_w;
        var indice_h = height - max_h;
        if (indice_w > indice_h) /* sur la largeur */
        {
            ratio = (1.0 / width) * max_w;
        }
        else {
            ratio = (1.0 / height) * max_h;
        }

        return { width: parseInt(ratio * width), height: parseInt(ratio * height) };
    },

    /*
    Supprime le contenu
    */
    clear: function () {
        //supprime le contenu de la visualisation
        objRemoveChildNode(this.view_element, null, REMOVENODE_ALL);

        //efface les textes
        if (this.title_element)
            objSetInnerText(this.title_element, "");
        if (this.desc_element)
            objSetInnerText(this.desc_element, "");

        //re-initialise l'objet
        this.left_image = null;
        this.middle_image = null;
        this.right_image = null;
        this.moving = 0;
    },

    /*
        
    */
    onChange: function () {
        if (this.title_element)
            objSetInnerText(this.title_element, this.getImage(this.middle_image).name);
        if (this.desc_element)
            objSetInnerText(this.desc_element, this.getImage(this.middle_image).desc);
    },

    /*
    Demarre le deplacement animée d'une image
    Parametres:
    dir      : Direction de l'animlation (voir function)
    newImage : Si dir == "over_to_left" ou "over_to_right", newImage définit la nouvelle image à inserer
    */
    move: function (dir, newImage) {
        var timer = wfw.timer.CreateFrequencyTimer({
            bAutoRemove: true,
            user: this,
            frame_per_second: 100,

            onStart: function () {
                this.user.moving++; //debut de deplacement pour ce timer

                objSetW(this.user.image, this.user.start_pos.width);
                objSetH(this.user.image, this.user.start_pos.height);
                objSetXY(this.user.image, this.user.start_pos.x, this.user.start_pos.y);
            },

            onUpdateFrame: function (time, normTime, frame) {
                var x = this.user.start_pos.x + ((this.user.end_pos.x - this.user.start_pos.x) * normTime);
                var y = this.user.start_pos.y + ((this.user.end_pos.y - this.user.start_pos.y) * normTime);
                var w = this.user.start_pos.width + ((this.user.end_pos.width - this.user.start_pos.width) * normTime);
                var h = this.user.start_pos.height + ((this.user.end_pos.height - this.user.start_pos.height) * normTime);
                objSetW(this.user.image, w);
                objSetH(this.user.image, h);
                objSetXY(this.user.image, x, y);
            },

            onFinish: function () {
                this.user.moving--; //fin de movement pour ce timer

                if (this.user.moving == 0) /* fin pour tous */
                    this.user.endMove();

                objSetW(this.user.image, this.user.end_pos.width);
                objSetH(this.user.image, this.user.end_pos.height);
                objSetXY(this.user.image, this.user.end_pos.x, this.user.end_pos.y);

                if (this.user.delete_on_finish)
                    nodeRemoveNode(this.user.image);
            }
        });

        //user
        switch (dir) {
            case "left_to_middle":
                this.start_pos = this.left_pos(this.left_image);
                this.end_pos = this.middle_pos(this.left_image);
                this.image = this.left_image;
                this.delete_on_finish = false;
                wfw.style.addClass(this.image, "simple_album_foreground_image");
                wfw.style.removeClass(this.image, "simple_album_background_image");
                break;
            case "middle_to_right":
                this.start_pos = this.middle_pos(this.middle_image);
                this.end_pos = this.right_pos(this.middle_image);
                this.image = this.middle_image;
                this.delete_on_finish = false;
                wfw.style.addClass(this.image, "simple_album_foreground_image");
                wfw.style.removeClass(this.image, "simple_album_background_image");
                break;
            case "right_to_over":
                this.start_pos = this.right_pos(this.right_image);
                this.end_pos = copy(this.start_pos);
                this.end_pos.x += this.end_pos.width / 2;
                this.end_pos.y += this.end_pos.height / 2;
                this.end_pos.width = 1;
                this.end_pos.height = 1;
                this.image = this.right_image;
                this.delete_on_finish = true;
                wfw.style.addClass(this.image, "simple_album_background_image");
                wfw.style.removeClass(this.image, "simple_album_foreground_image");
                break;
            case "over_to_left":
                this.end_pos = this.left_pos(newImage);
                this.start_pos = copy(this.end_pos);
                this.start_pos.x = -objGetW(newImage);
                this.image = newImage;
                this.delete_on_finish = false;
                wfw.style.addClass(this.image, "simple_album_background_image");
                wfw.style.removeClass(this.image, "simple_album_foreground_image");
                break;
            case "left_to_over":
                this.start_pos = this.left_pos(this.left_image);
                this.end_pos = copy(this.start_pos);
                this.end_pos.x += this.end_pos.width / 2;
                this.end_pos.y += this.end_pos.height / 2;
                this.end_pos.width = 1;
                this.end_pos.height = 1;
                this.image = this.left_image;
                this.delete_on_finish = true;
                wfw.style.addClass(this.image, "simple_album_background_image");
                wfw.style.removeClass(this.image, "simple_album_foreground_image");
                break;
            case "middle_to_left":
                this.start_pos = this.middle_pos(this.middle_image);
                this.end_pos = this.left_pos(this.middle_image);
                this.image = this.middle_image;
                this.delete_on_finish = false;
                wfw.style.addClass(this.image, "simple_album_foreground_image");
                wfw.style.removeClass(this.image, "simple_album_background_image");
                break;
            case "right_to_middle":
                this.start_pos = this.right_pos(this.right_image);
                this.end_pos = this.middle_pos(this.right_image);
                this.image = this.right_image;
                this.delete_on_finish = false;
                wfw.style.addClass(this.image, "simple_album_foreground_image");
                wfw.style.removeClass(this.image, "simple_album_background_image");
                break;
            case "over_to_right":
                this.end_pos = this.right_pos(newImage);
                this.start_pos = copy(this.end_pos);
                this.start_pos.x = objGetW(this.view_element);
                this.image = newImage;
                this.delete_on_finish = false;
                wfw.style.addClass(this.image, "simple_album_background_image");
                wfw.style.removeClass(this.image, "simple_album_foreground_image");
                break;
        }

        //demarre le timer
        timer.start(800);

        return timer;
    },

    /*
    Obtient le rectangle d'une image placé à gauche
    Parametres:
    baseImage : L'Image de base
    */
    left_pos: function (baseImage) {
        //calcule la taille de l'image
        var new_size = this.truncate_rect(objGetW(baseImage), objGetH(baseImage), parseInt(this.thumb_max_width * 0.20), this.thumb_max_height / 2);
        return {
            width: new_size.width,
            height: new_size.height,
            x: parseInt(((this.thumb_max_width * 0.25) / 2) - (new_size.width / 2.0)),
            y: parseInt((this.thumb_max_height * 0.5) - (new_size.height / 2.0))
        };
    },

    /*
    Insert une image à gauche
    Parametres:
    baseImage : L'Image de base
    Remarques:
    La fonction clone l'image donnée et la positionne dans le contenu (sans animation)
    */
    insert_to_left: function (baseImage) {
        //insert l'image
        //var image = nodeCloneNode(baseImage); //ne pas cloner l'image, car l'événement onload sera appelé)
        var image = document.createElement("img");
        image.src = baseImage.src;
        objInsertNode(image, this.view_element, null, INSERTNODE_END);
        wfw.style.addClass(image, "simple_album_image");
        wfw.event.ApplyTo(image, "media_album_image");
        //positionne l'image (1/3)
        var pos = this.left_pos(baseImage);
        objSetW(image, pos.width);
        objSetH(image, pos.height);
        objSetXY(image, pos.x, pos.y);
        //sauve l'image
        wfw.style.addClass(image, "simple_album_background_image");
        wfw.style.removeClass(image, "simple_album_foreground_image");
        return image;
    },

    /*
    Obtient le rectengle d'une image placé au millieu
    Parametres:
    baseImage : L'Image de base
    */
    middle_pos: function (baseImage) {
        //calcule la taille de l'image
        var new_size = this.truncate_rect(objGetW(baseImage), objGetH(baseImage), parseInt(this.thumb_max_width * 0.50), this.thumb_max_height);
        return {
            width: new_size.width,
            height: new_size.height,
            x: parseInt((this.thumb_max_width * 0.5) - (new_size.width / 2.0)),
            y: parseInt((this.thumb_max_height * 0.5) - (new_size.height / 2.0))
        };
    },

    /*
    Insert une image au millieu
    Parametres:
    baseImage : L'Image de base obtenu par l'objet 'album'
    Remarques:
    La fonction clone l'image donnée et la positionne dans le contenu (sans animation)
    */
    insert_to_middle: function (baseImage) {
        //insert l'image
        //var image = nodeCloneNode(baseImage); //ne pas cloner l'image, car l'événement onload sera appelé)
        var image = document.createElement("img");
        image.src = baseImage.src;
        objInsertNode(image, this.view_element, null, INSERTNODE_END);
        wfw.style.addClass(image, "simple_album_image");
        wfw.event.ApplyTo(image, "media_album_image");
        //positionne l'image (1/2)
        var pos = this.middle_pos(baseImage);
        objSetW(image, pos.width);
        objSetH(image, pos.height);
        objSetXY(image, pos.x, pos.y);
        //sauve l'image
        wfw.style.addClass(image, "simple_album_foreground_image");
        wfw.style.removeClass(image, "simple_album_background_image");
        return image;
    },

    /*
    Obtient le rectengle d'une image placé à droite
    Parametres:
    baseImage : L'Image de base obtenu par l'objet 'album'
    */
    right_pos: function (baseImage) {
        //calcule la taille de l'image
        var new_size = this.truncate_rect(objGetW(baseImage), objGetH(baseImage), parseInt(this.thumb_max_width * 0.20), this.thumb_max_height / 2);
        return {
            width: new_size.width,
            height: new_size.height,
            x: parseInt((this.thumb_max_width * 0.875) - (new_size.width / 2.0)),
            y: parseInt((this.thumb_max_height * 0.5) - (new_size.height / 2.0))
        };
    },

    /*
    Insert une image à droite
    Parametres:
    baseImage : L'Image de base obtenu par l'objet 'album'
    Remarques:
    La fonction clone l'image donnée et la positionne dans le contenu (sans animation)
    */
    insert_to_right: function (baseImage) {
        //insert l'image
        //var image = nodeCloneNode(baseImage); //ne pas cloner l'image, car l'événement onload sera appelé)
        var image = document.createElement("img");
        image.src = baseImage.src;
        objInsertNode(image, this.view_element, null, INSERTNODE_END);
        wfw.style.addClass(image, "simple_album_image");
        wfw.event.ApplyTo(image, "media_album_image");
        //positionne l'image (2/3)
        var pos = this.right_pos(baseImage);
        objSetW(image, pos.width);
        objSetH(image, pos.height);
        objSetXY(image, pos.x, pos.y);
        //sauve l'image
        wfw.style.addClass(image, "simple_album_background_image");
        wfw.style.removeClass(image, "simple_album_foreground_image");
        return image;
    },

    /*
    Obtient la prochaine image
    */
    loadImages: function () {
        for (var i = 0; i < this.image_gallery.images.length; i++) {
            var image = this.image_gallery.images[i];
            var obj = document.createElement("img");
            obj.src = image.src;
            wfw.puts("loadImages " + image.src);
            this.image_gallery.images[i].obj = obj;

            wfw.event.ApplyTo(obj, "media_album_thumb");
        }
    },

    /*
    Obtient la prochaine image
    */
    getNextImage: function (image) {
        var filename = basename(image.src);
        for (var i = 0; i < this.image_gallery.images.length; i++) {
            if (this.image_gallery.images[i].images == filename) {
                if ((i + 1) < this.image_gallery.images.length)/*alert(i+"="+this.images[(i+1)].src);*/
                    return this.image_gallery.images[(i + 1)].obj;
                return null;
            }
        }
        return null;
    },
    /*
    Obtient l'image precedente
    */
    getPrevImage: function (image) {
        var filename = basename(image.src);
        for (var i = 0; i < this.image_gallery.images.length; i++) {
            if (this.image_gallery.images[i].images == filename) {
                if (i)
                    return this.image_gallery.images[(i - 1)].obj;
                return null;
            }
        }
        return null;
    },

    /*
    Obtient l'image precedente
    */
    getImage: function (image) {
        var filename = basename(image.src);
        for (var i = 0; i < this.image_gallery.images.length; i++) {
            if (this.image_gallery.images[i].image == filename) {
                return this.image_gallery.images[i];
            }
        }
        return null;
    },

    /*
    Insert une image et ses images alentoures
    */
    setImage: function (baseImage) {
        this.insert_to_middle(baseImage);

        var left = this.getPrevImage(baseImage);
        if (left != null)
            this.left_image = this.insert_to_left(left);

        var right = this.getNextImage(baseImage);
        if (right != null)
            this.right_image = this.insert_to_right(right);
    },

    /*
    Affiche l'image precedente
    */
    showPrev: function () {
        /* en cours de deplacement ? */
        if (this.moving)
            return;

        // fin de scrolling ?
        var next = this.getPrevImage(this.middle_image);
        if (next == null)
            return; // alert("pas plus d'images");

        // insert la prochaine image (si existante)
        var insert = (this.left_image != null) ? this.getPrevImage(this.left_image) : null;
        if (insert != null)
            insert = this.insert_to_left(insert);

        // en fin de movement, actualise les pointeurs des 3 images visibles
        this.endMove = function () {
            this.right_image = this.middle_image;
            this.middle_image = this.left_image;
            this.left_image = insert;
            // change evenement
            this.onChange();
        }

        //deplace les images
        if (this.left_image != null)
            this.move("left_to_middle");
        if (this.middle_image != null)
            this.move("middle_to_right");
        if (this.right_image != null)
            this.move("right_to_over");
        if (insert != null)
            this.move("over_to_left", insert);
    },

    /*
    Affiche la prochaine image
    */
    showNext: function () {
        /* en cours de deplacement ? */
        if (this.moving)
            return;

        // fin de scrolling ?
        var next = this.getNextImage(this.middle_image);
        if (next == null)
            return; // alert("pas plus d'images");

        // insert la prochaine image (si existante)
        var insert = (this.right_image != null) ? this.getNextImage(this.right_image) : null;
        if (insert != null)
            insert = this.insert_to_right(insert);

        // en fin de movement, actualise les pointeurs des 3 images visibles
        this.endMove = function () {
            this.left_image = this.middle_image;
            this.middle_image = this.right_image;
            this.right_image = insert;
            // change evenement
            this.onChange();
        }

        //deplace les images
        if (this.left_image != null)
            this.move("left_to_over");
        if (this.middle_image != null)
            this.move("middle_to_left");
        if (this.right_image != null)
            this.move("right_to_middle");
        if (insert != null)
            this.move("over_to_right", insert);
    }
};

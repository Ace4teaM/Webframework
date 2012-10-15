/*
    Affichage en scrolling horizontal d'un album photo
*/
var simpleAlbum = {
    left_image : null, // l'image actuelement à gauche
    middle_image : null, // l'image actuelement au millieu
    right_image : null, // l'image actuelement à droite
    moving : 0, // compteur de deplacement, represente le nombre d'image en cours d'animation. Lorsque 'moving' est à 0, aucune animation est en cours
    album : null,
    view_element : null,
    thumb_max_height : 0,
    thumb_max_width : 0,
    
    init : function()
    {
        //global album
        this.album        = wfw.ext.mediaAlbum;
        this.view_element = $doc("simple_album");

        this.thumb_max_height = objGetH(this.view_element);
        this.thumb_max_width  = objGetW(this.view_element);
        /*wfw.puts("thumb_max_height: "+this.thumb_max_height);
        wfw.puts("thumb_max_width: "+this.thumb_max_width);
        wfw.puts(this.view_element.style.paddingLeft);*/

        this.album.onFree = function()
        {
            //supprime le contenu de la visualisation
            objRemoveChildNode(simpleAlbum.view_element,null,REMOVENODE_ALL);

            //efface les textes
            if($doc("simple_album_title"))
                objSetInnerText($doc("simple_album_title"),"");
            if($doc("simple_album_description"))
                objSetInnerText($doc("simple_album_description"),"");

            //re-initialise l'objet
            simpleAlbum.left_image = null;
            simpleAlbum.middle_image = null;
            simpleAlbum.right_image = null;
            simpleAlbum.moving = 0;
        }

        this.album.onLoad = function(){
        }

        this.album.onLoaded = function(){
        }
    },
    
    onChange : function(){
        if($doc("simple_album_title"))
            objSetInnerText($doc("simple_album_title"),this.album.getInfos(this.middle_image.src,"title",""));
        if($doc("simple_album_description"))
            objSetInnerText($doc("simple_album_description"),this.album.getInfos(this.middle_image.src,"description",""));
    },
    
    /*
        Demarre le deplacement animée d'une image
        Parametres:
            dir      : Direction de l'animlation (voir function)
            newImage : Si dir == "over_to_left" ou "over_to_right", newImage définit la nouvelle image à inserer
    */
    move : function(dir,newImage)
    {
        var timer = wfw.timer.CreateFrequencyTimer();
        timer.bAutoRemove = true;

        //user
        switch(dir){
            case "left_to_middle":
                timer.user.start_pos = this.left_pos(this.left_image);
                timer.user.end_pos = this.middle_pos(this.left_image);
                timer.user.image = this.left_image;
                timer.user.delete_on_finish = false;
                wfw.style.addClass(timer.user.image,"simple_album_foreground_image");
                wfw.style.removeClass(timer.user.image,"simple_album_background_image");
                break;
            case "middle_to_right":
                timer.user.start_pos = this.middle_pos(this.middle_image);
                timer.user.end_pos = this.right_pos(this.middle_image);
                timer.user.image = this.middle_image;
                timer.user.delete_on_finish = false;
                wfw.style.addClass(timer.user.image,"simple_album_foreground_image");
                wfw.style.removeClass(timer.user.image,"simple_album_background_image");
                break;
            case "right_to_over":
                timer.user.start_pos = this.right_pos(this.right_image);
                timer.user.end_pos = copy(timer.user.start_pos);
                timer.user.end_pos.x += timer.user.end_pos.width/2; 
                timer.user.end_pos.y += timer.user.end_pos.height/2; 
                timer.user.end_pos.width = 1; 
                timer.user.end_pos.height = 1; 
                timer.user.image = this.right_image;
                timer.user.delete_on_finish = true;
                wfw.style.addClass(timer.user.image,"simple_album_background_image");
                wfw.style.removeClass(timer.user.image,"simple_album_foreground_image");
                break;
            case "over_to_left":
                timer.user.end_pos = this.left_pos(newImage);
                timer.user.start_pos = copy(timer.user.end_pos);
                timer.user.start_pos.x = -objGetW(newImage); 
                timer.user.image = newImage;
                timer.user.delete_on_finish = false;
                wfw.style.addClass(timer.user.image,"simple_album_background_image");
                wfw.style.removeClass(timer.user.image,"simple_album_foreground_image");
                break;
            case "left_to_over":
                timer.user.start_pos = this.left_pos(this.left_image);
                timer.user.end_pos = copy(timer.user.start_pos);
                timer.user.end_pos.x += timer.user.end_pos.width/2; 
                timer.user.end_pos.y += timer.user.end_pos.height/2; 
                timer.user.end_pos.width = 1; 
                timer.user.end_pos.height = 1; 
                timer.user.image = this.left_image;
                timer.user.delete_on_finish = true;
                wfw.style.addClass(timer.user.image,"simple_album_background_image");
                wfw.style.removeClass(timer.user.image,"simple_album_foreground_image");
                break;
            case "middle_to_left":
                timer.user.start_pos = this.middle_pos(this.middle_image);
                timer.user.end_pos = this.left_pos(this.middle_image);
                timer.user.image = this.middle_image;
                timer.user.delete_on_finish = false;
                wfw.style.addClass(timer.user.image,"simple_album_foreground_image");
                wfw.style.removeClass(timer.user.image,"simple_album_background_image");
                break;
            case "right_to_middle":
                timer.user.start_pos = this.right_pos(this.right_image);
                timer.user.end_pos = this.middle_pos(this.right_image);
                timer.user.image = this.right_image;
                timer.user.delete_on_finish = false;
                wfw.style.addClass(timer.user.image,"simple_album_foreground_image");
                wfw.style.removeClass(timer.user.image,"simple_album_background_image");
                break;
            case "over_to_right":
                timer.user.end_pos = this.right_pos(newImage);
                timer.user.start_pos = copy(timer.user.end_pos);
                timer.user.start_pos.x = objGetW(this.view_element); 
                timer.user.image = newImage;
                timer.user.delete_on_finish = false;
                wfw.style.addClass(timer.user.image,"simple_album_background_image");
                wfw.style.removeClass(timer.user.image,"simple_album_foreground_image");
                break;
        }
    
        //initialise les callbacks

        timer.user.onStart = function()
        {
            simpleAlbum.moving++;//debut de deplacement pour ce timer

            objSetW(this.image,this.start_pos.width);
            objSetH(this.image,this.start_pos.height);
            objSetXY(this.image,this.start_pos.x,this.start_pos.y);
        };

        timer.user.onUpdateFrame = function(time,normTime,frame)
        {
            var x = this.start_pos.x + ((this.end_pos.x-this.start_pos.x)*normTime);
            var y = this.start_pos.y + ((this.end_pos.y-this.start_pos.y)*normTime);
            var w = this.start_pos.width + ((this.end_pos.width-this.start_pos.width)*normTime);
            var h = this.start_pos.height + ((this.end_pos.height-this.start_pos.height)*normTime);
            objSetW(this.image,w);
            objSetH(this.image,h);
            objSetXY(this.image,x,y);
        };

        timer.user.onFinish = function()
        {
            simpleAlbum.moving--;//fin de movement pour ce timer

            if(simpleAlbum.moving==0) /* fin pour tous */
                simpleAlbum.endMove();

            objSetW(this.image,this.end_pos.width);
            objSetH(this.image,this.end_pos.height);
            objSetXY(this.image,this.end_pos.x,this.end_pos.y);

            if(this.delete_on_finish)
                nodeRemoveNode(this.image);
        };
        
        //demarre le timer
        timer.set_frame_per_seconde(100);
        timer.start(800);

        return timer;
    },
    
    /*
        Obtient le rectengle d'une image placé à gauche
        Parametres:
            baseImage : L'Image de base obtenu par l'objet 'album'
    */
    left_pos : function(baseImage)
    {
        //calcule la taille de l'image
        var new_size = this.album.truncate_rect(objGetW(baseImage),objGetH(baseImage),parseInt(this.thumb_max_width*0.20),this.thumb_max_height/2);
        return {
            width  : new_size.width,
            height : new_size.height,
            x      : parseInt(((this.thumb_max_width * 0.25)/2) - (new_size.width/2.0)),
            y      : parseInt((this.thumb_max_height * 0.5) - (new_size.height/2.0))
        };
    },
    
    /*
        Insert une image à gauche
        Parametres:
            baseImage : L'Image de base obtenu par l'objet 'album'
        Remarques:
            La fonction clone l'image donnée et la positionne dans le contenu (sans animation)
    */
    insert_to_left : function(baseImage)
    {
        //insert l'image
        //var image = nodeCloneNode(baseImage); //ne pas cloner l'image, car l'événement onload sera appelé)
        var image=document.createElement("img");
        image.src = baseImage.src;
        objInsertNode(image,this.view_element,null,INSERTNODE_END);
        wfw.style.addClass(image,"simple_album_image");
        wfw.event.ApplyTo(image, "media_album_image");
        //positionne l'image (1/3)
        var pos = this.left_pos(baseImage);
        objSetW(image,pos.width);
        objSetH(image,pos.height);
        objSetXY(image,pos.x,pos.y);
        //sauve l'image
        wfw.style.addClass(image,"simple_album_background_image");
        wfw.style.removeClass(image,"simple_album_foreground_image");
        return image;
    },
    
    /*
        Obtient le rectengle d'une image placé au millieu
        Parametres:
            baseImage : L'Image de base obtenu par l'objet 'album'
    */
    middle_pos : function(baseImage)
    {
        //calcule la taille de l'image
        var new_size = this.album.truncate_rect(objGetW(baseImage),objGetH(baseImage),parseInt(this.thumb_max_width*0.50),this.thumb_max_height);
        return {
            width  : new_size.width,
            height : new_size.height,
            x      : parseInt((this.thumb_max_width * 0.5) - (new_size.width/2.0)),
            y      : parseInt((this.thumb_max_height * 0.5) - (new_size.height/2.0))
        };
    },
    
    /*
        Insert une image au millieu
        Parametres:
            baseImage : L'Image de base obtenu par l'objet 'album'
        Remarques:
            La fonction clone l'image donnée et la positionne dans le contenu (sans animation)
    */
    insert_to_middle : function(baseImage)
    {
        //insert l'image
        //var image = nodeCloneNode(baseImage); //ne pas cloner l'image, car l'événement onload sera appelé)
        var image=document.createElement("img");
        image.src = baseImage.src;
        objInsertNode(image,this.view_element,null,INSERTNODE_END);
        wfw.style.addClass(image,"simple_album_image");
        wfw.event.ApplyTo(image, "media_album_image");
        //positionne l'image (1/2)
        var pos = this.middle_pos(baseImage);
        objSetW(image,pos.width);
        objSetH(image,pos.height);
        objSetXY(image,pos.x,pos.y);
        //sauve l'image
        wfw.style.addClass(image,"simple_album_foreground_image");
        wfw.style.removeClass(image,"simple_album_background_image");
        return image;
    },
    
    /*
        Obtient le rectengle d'une image placé à droite
        Parametres:
            baseImage : L'Image de base obtenu par l'objet 'album'
    */
    right_pos : function(baseImage)
    {
        //calcule la taille de l'image
        var new_size = this.album.truncate_rect(objGetW(baseImage),objGetH(baseImage),parseInt(this.thumb_max_width*0.20),this.thumb_max_height/2);
        return {
            width  : new_size.width,
            height : new_size.height,
            x      : parseInt((this.thumb_max_width * 0.875) - (new_size.width/2.0)),
            y      : parseInt((this.thumb_max_height * 0.5) - (new_size.height/2.0))
        };
    },
    
    /*
        Insert une image à droite
        Parametres:
            baseImage : L'Image de base obtenu par l'objet 'album'
        Remarques:
            La fonction clone l'image donnée et la positionne dans le contenu (sans animation)
    */
    insert_to_right : function(baseImage)
    {
        //insert l'image
        //var image = nodeCloneNode(baseImage); //ne pas cloner l'image, car l'événement onload sera appelé)
        var image=document.createElement("img");
        image.src = baseImage.src;
        objInsertNode(image,this.view_element,null,INSERTNODE_END);
        wfw.style.addClass(image,"simple_album_image");
        wfw.event.ApplyTo(image, "media_album_image");
        //positionne l'image (2/3)
        var pos = this.right_pos(baseImage);
        objSetW(image,pos.width);
        objSetH(image,pos.height);
        objSetXY(image,pos.x,pos.y);
        //sauve l'image
        wfw.style.addClass(image,"simple_album_background_image");
        wfw.style.removeClass(image,"simple_album_foreground_image");
        return image;
    },
    
    /*
        Insert une image et ses images alentoures
    */
    setImage : function(baseImage)
    {
        this.insert_to_middle(baseImage);

        var left=this.album.getPrevImage(baseImage);
        if(left!=null)
            this.left_image = this.insert_to_left(left);

        var right=this.album.getNextImage(baseImage);
        if(right!=null)
            this.right_image = this.insert_to_right(right);
    },

    /*
        Affiche l'image precedente
    */
    showPrev : function()
    {
        /* en cours de deplacement ? */
        if(this.moving)
            return;

        // fin de scrolling ?
        var next = wfw.ext.mediaAlbum.getPrevImage(this.middle_image);
        if(next==null)
            return;// alert("pas plus d'images");

        // insert la prochaine image (si existante)
        var insert = (this.left_image!=null) ? wfw.ext.mediaAlbum.getPrevImage(this.left_image) : null;
        if(insert!=null)
            insert = this.insert_to_left(insert);

        // en fin de movement, actualise les pointeurs des 3 images visibles
        this.endMove = function(){
            this.right_image = this.middle_image;
            this.middle_image = this.left_image;
            this.left_image = insert;
            // change evenement
            this.onChange();
        }

        //deplace les images
        if(this.left_image!=null)
            this.move("left_to_middle");
        if(this.middle_image!=null)
            this.move("middle_to_right");
        if(this.right_image!=null)
            this.move("right_to_over");
        if(insert!=null)
            this.move("over_to_left",insert);
    },

    /*
        Affiche la prochaine image
    */
    showNext : function()
    {
        /* en cours de deplacement ? */
        if(this.moving)
            return;

        // fin de scrolling ?
        var next = wfw.ext.mediaAlbum.getNextImage(this.middle_image);
        if(next==null)
            return;// alert("pas plus d'images");

        // insert la prochaine image (si existante)
        var insert = (this.right_image!=null) ? wfw.ext.mediaAlbum.getNextImage(this.right_image) : null;
        if(insert!=null)
            insert = this.insert_to_right(insert);

        // en fin de movement, actualise les pointeurs des 3 images visibles
        this.endMove = function(){
            this.left_image = this.middle_image;
            this.middle_image = this.right_image;
            this.right_image = insert;
            // change evenement
            this.onChange();
        }

        //deplace les images
        if(this.left_image!=null)
            this.move("left_to_over");
        if(this.middle_image!=null)
            this.move("middle_to_left");
        if(this.right_image!=null)
            this.move("right_to_middle");
        if(insert!=null)
            this.move("over_to_right",insert);
    }
};

/*
    Une nouvelle image est chargée par l'album.
    Si rien n'est visible à l'ecran, insert l'image.
*/
wfw.event.SetCallback( // image
    "media_album_thumb",
    "load",
    "onloadThumb",
    function(e)
    {
        //pas d'image visible ?
        if(simpleAlbum.middle_image==null){
            simpleAlbum.middle_image = simpleAlbum.insert_to_middle(this);
        }
        else{
            if(this == wfw.ext.mediaAlbum.getPrevImage(simpleAlbum.middle_image))
                simpleAlbum.left_image = simpleAlbum.insert_to_left(this);
            else if(this == wfw.ext.mediaAlbum.getNextImage(simpleAlbum.middle_image))
                simpleAlbum.right_image = simpleAlbum.insert_to_right(this);
            else
                return;
        }
        simpleAlbum.onChange();
    }
);

/*
    Une erreur au chargement de l'image c'est produite. Ignore l'image.
*/
wfw.event.SetCallback( // image
    "media_album_thumb",
    "error",
    "onerrorThumb",
    function(e) {
        wfw.puts("media_album can't load: "+this.src);
    }
);

/*
    Click sur la visualisation, active le passage à l'image suivante.
*/
wfw.event.SetCallback( // div
    "media_album",
    "mousedown",
    "move",
    function(e)
    {
        var simple_album = simpleAlbum.view_element;

        /* position relative du curseur */
        var mouse_x = e.x-objGetAbsX(simple_album);

        /*millieu*/
        var middle_image_pos = simpleAlbum.middle_pos(simpleAlbum.middle_image);
        //alert(middle_image_pos.x+","+middle_image_pos.width);
        if((mouse_x >= middle_image_pos.x) && (mouse_x <= middle_image_pos.x+middle_image_pos.width))
        {
            return;
        }
        /* affiche l'image precedente ? */
        else if(mouse_x < (objGetW(simple_album)/2))
        {
            simpleAlbum.showPrev();
        }
        /* affiche l'image suivante */
        else{
            simpleAlbum.showNext();
        }
    }
);

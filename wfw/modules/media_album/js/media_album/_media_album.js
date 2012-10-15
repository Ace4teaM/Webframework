/*
    Gestionnaire d'album photo
*/
wfw.ext.mediaAlbum  = {
    // globales
    file : null,
    base_element : null, /* l'element contenant l'image */
    image_element : null, /* l'element image */
    images : [], /* table des images */
    max_width : null,
    max_height : null,
    data_path : "data/var/album/",
    current : 0,
    onFree : null,   // appelée avant la liberation de l'album et la suppression des photos
    onLoad : null,   // appelée lorsque les informations sur l'album est chargées
    onLoaded : null, // appelée lorsque toutes les images sont chargées
    image_load : 0,  // nombre d'images en cours de chargement
    infos : {},
        
    /*
        re-initialise l'objet
        Remarques:
            reset supprime les images et les informations chargées
    */
	reset : function()
	{
        //free callback
        if(typeof(this.onFree)=="function")
            this.onFree();
        //supprime les images
        for(image in this.images)
            nodeRemoveNode(image);
        this.images = [];
        //supprime les infos
        this.infos = {};
        //supprime l'image de visualisation
        if(this.image_element)
            nodeRemoveNode(this.image_element);
        this.image_element=null;
        //autres
        this.image_load = 0;
    },

    /*
        charge le fichier de configuration et crée les images
        Parametres:
            name : nom du fichier XML de l'album (present dans le dossier "data/var/media_album/")
    */
	load : function(name)
	{
		var param = {
			"onsuccess" : function(obj,xml_doc)
			{
				this.album.file=xml_doc;
                this.album.list_file();
			},
            album : this,    // reference a cet objet
            no_result : true // obtient uniquement le contenu du fichier
		};
		//envoie la requete
		wfw.request.Add(null,this.data_path+name,null,wfw.utils.onCheckRequestResult_XML,param,false);

        //free callback
        if(typeof(this.onLoad)=="function")
            this.onLoad();
	},
        
    /*
        recharge un fichier de configuration
    */
	reload : function(name)
	{
		this.reset();
		this.load(name);
	},
        
    /*
        attache l'element de visualisation
    */
	attachElement : function(element,padding_width,padding_height)
	{
        //zone d'affichage
        this.base_element = element;
        wfw.event.ApplyTo(element, "media_album");
        wfw.style.addClass(this.base_element,"ext_ui_env"); /* base obj */

        //
        this.max_width  = objGetW(this.base_element) - padding_width;
        this.max_height = objGetH(this.base_element) - padding_height;
    },
    /*
        Charge les images
        Remarques:
            par defaut aucune image n'est visible
    */
	list_file : function()
	{
        // element root du document
        var root = docGetRootElement(this.file);
        if(root == null){
            wfw.puts("wfw_MediaAlbum: can't get root element");
            return false;
        }
        //premiere image
        var image = objGetNode(root,"images/image");
        if(image == null){
            wfw.puts("wfw_MediaAlbum: can't get first image element");
            return false;
        }
        //path
        var path = $text(objGetNode(root,"path"));
        if(path == null){
            wfw.puts("wfw_MediaAlbum: can't get path element");
            return false;
        }
        //list les images
        while(image != null)
        {
            //incremente le compteur
            this.image_load++;

            //charge les attributs
            var media_album = {};
            var image_att = objGetChild(image,null);
            while(image_att!=null){
                media_album[image_att.tagName] = objGetInnerText(image_att);
                image_att = objGetNext(image_att,null);
            }
            //cree l'image
            if(typeof(media_album.filename)=="string")
            {
                var element = this.create_image(path+media_album.filename);
                this.infos[element.src] = media_album; /*stock les informations dans l'album*/
                this.images.push(element);
            }
//                objAlertMembers(image_desc);
            image = objGetNext(image,"image");
        }
            
        return true;
    },
    /*
        Cree l'objet image
        Remarques:
            lie la liste d'evenements 'media_album_thumb'
    */
	create_image : function(path)
    {
        //cree l'image de visualisation
        var image = new Image();
        wfw.event.ApplyTo(image, "media_album_thumb");
        objSetAtt(image,"src",path);

        return image;
    },
	get_current_image : function()
    {
        return this.image_element;
    },
	getImage : function(i)
    {
        if(i>=this.images.length || i<0)
            return null;
        return this.images[i];
    },
	getInfos : function(src,field,def)
    {
        if(typeof(this.infos[src])=="undefined" || typeof(this.infos[src][field])=="undefined")
            return def;
        return this.infos[src][field];
    },
    /*
        Obtient la prochaine image
    */
	getNextImage : function(image)
    {
        for(var i=0; i<this.images.length; i++){
            if(this.images[i].src==image.src)
            {
                if((i+1) < this.images.length)/*alert(i+"="+this.images[(i+1)].src);*/
                    return this.images[(i+1)];
                return null;
            }
        }
        return null;
    },
    /*
        Obtient l'image precedente
    */
	getPrevImage : function(image)
    {
        for(var i=0; i<this.images.length; i++){
            if(this.images[i].src==image.src)
            {
                if(i)
                    return this.images[(i-1)];
                return null;
            }
        }
        return null;
    },
    /*
    affiche une image dans le carde de visualisation
    Remarques:
        l'image est affiche au plus grand
    */
	showImage : function(imageOriginal)
    {
        var image = nodeCloneNode(imageOriginal,false);
        wfw.style.addClass(image,"media_album_image");
        wfw.event.ApplyTo(image, "media_album_image");

        if(this.image_element!=null){
            var timer = timer_fadeOut(this.image_element);
            timer.user.album=this;
            timer.user.onFinish=function(){nodeRemoveNode(this.element);};
            timer.start(800);
            /*while(wfw.timer.get(timer.id)!=null);;
            nodeRemoveNode(this.image_element);
            this.image_element=null;*/
        }
            
        this.image_element=image;

        var pos = this.truncate_size(objGetW(image),objGetH(image));
            
        objSetW(image,pos.width);
        objSetH(image,pos.height);

        var x = (this.max_width-pos.width)/2;
        var y = (this.max_height-pos.height)/2;

        objSetXY(image,x,y);
            
        objInsertNode(image,this.base_element,null,INSERTNODE_BEGIN);
        //wfw.style.removeClass(image.element,"wfw_hidden");
            
        timer_fadeIn(image).start(800);
            
        return image;
    },
    /*
    affiche une image dans le carde de visualisation
    Remarques:
        l'image est affiche au plus grand
    */
	showFullScreen : function()
    {
        //verrouille l'ecran
        wfw.ext.document.lockScreen();

        //duplique l'element image
        var full_image = nodeCloneNode(this.image_element,false);
        objSetClassName(full_image,"media_album_image_full");

        var content = $doc("wfw_ext_lock_content");
            
        //var pos = this.truncate_rect(objGetW(full_image),objGetH(full_image),docGetBodyW(content),docGetBodyH(content));
            
        /*objSetW(full_image,objGetW(content));
        objSetH(full_image,objGetH(content));
        objSetXY(full_image,0,0);*/

//            wfw.ext.document.print("test");
        /*wfw.ext.document.print(full_image);*/
        //var dlg = document.createElement("div");
        //objSetAtt(dlg,"id","wfw_ext_print_content");
        objInsertNode(full_image,$doc("wfw_ext_lock_content"),null,INSERTNODE_BEGIN);
        //objInsertNode(dlg,$doc("wfw_ext_lock_content"),null,INSERTNODE_BEGIN);
            
        objSetEvent(full_image,"click",function(e){
            nodeRemoveNode(full_image);
            wfw.ext.document.unlockScreen();
        });
            
        return full_image;
    },
    /*
    affiche une image dans le carde de visualisation
    Remarques:
        l'image est affiche a la position donnee
        
	show_image : function(i,x,y,w,h)
    {
        var image = this.images[i];
            
        objSetW(image.element,w);
        objSetH(image.element,h);

        objSetXY(image.element,x,y);
            
        wfw.style.removeClass(image.element,"wfw_hidden");

        return image;
    },*/
    /*
        Adapté la taille de l'image au carde de visualisation
    */
	truncate_size : function(width,height)
    {
        var ratio;
        if(this.max_width<this.max_height) /* sur la largeur */
        {
            ratio = (1.0 / width) * this.max_width;
        }
        else
            ratio = (1.0 / height) * this.max_height;

        return {width:parseInt(ratio * width),height:parseInt(ratio * height)};
    },
    /*
        Adapté la taille de l'image
    */
	truncate_rect : function(width,height,max_w,max_h)
    {
        var ratio;
        var indice_w=width-max_w;
        var indice_h=height-max_h;
        if(indice_w>indice_h) /* sur la largeur */
        {
            ratio = (1.0 / width) * max_w;
        }
        else
        {
            ratio = (1.0 / height) * max_h;
        }

        return {width:parseInt(ratio * width),height:parseInt(ratio * height)};
    }
};

function timer_fadeIn(element)
{
    timer = wfw.timer.CreateFrequencyTimer();
    timer.user.element = element;
    timer.bAutoRemove = true;
    
    timer.user.onStart = function()
    {
        this.element.style.opacity      = 0.0;
        this.element.style.MozOpacity   = 0.0;
        this.element.style.KhtmlOpacity = 0.0; 
        this.element.style.filter     = "alpha(opacity=0)";

        wfw.style.removeClass(this.element,"wfw_hidden");
    };
    //cree un movement de haut en bas
    timer.user.onUpdateFrame = function(time,normTime,frame)
    {
        var opacity = parseInt(normTime*100.0);

        this.element.style.opacity      = normTime;
        this.element.style.MozOpacity   = normTime;
        this.element.style.KhtmlOpacity = normTime; 
        this.element.style.filter     = "alpha(opacity="+opacity+")";
    };
    timer.user.onFinish = function()
    {
        //wfw.timer.remove(this.id);
    };

    timer.set_frame_per_seconde(100);

    return timer;
}

function timer_fadeOut(element)
{
    timer = wfw.timer.CreateFrequencyTimer();
    timer.user.element = element;
    timer.bAutoRemove = true;
    
    timer.user.onStart = function()
    {
        this.element.style.opacity      = 1.0;
        this.element.style.MozOpacity   = 1.0;
        this.element.style.KhtmlOpacity = 1.0; 
        this.element.style.filter     = "alpha(opacity=100)";
    };
    //cree un movement de haut en bas
    timer.user.onUpdateFrame = function(time,normTime,frame)
    {
        var opacity = parseInt((1.0-normTime)*100.0);

        this.element.style.opacity      = 1.0-normTime;
        this.element.style.MozOpacity   = 1.0-normTime;
        this.element.style.KhtmlOpacity = 1.0-normTime; 
        this.element.style.filter     = "alpha(opacity="+opacity+")";
    };
    timer.user.onFinish = function()
    {
        wfw.style.addClass(this.element,"wfw_hidden");
        //wfw.timer.remove(this.id);
    };

    timer.set_frame_per_seconde(100);

    return timer;
}

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

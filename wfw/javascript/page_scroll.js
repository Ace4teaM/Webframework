wfw.ext.page_scroll = {
	use : true,
    /*
    OBSELETE
    Remarques:
        L'Elément à scroller doit être enfant immédiat d'un element de classe "wfw_ext_scrollable_container"
    */
    create : function(element,width,height)
    {
        //wfw.event.ApplyTo(element, "PageScroll");
        var parent = objGetParent(element);
        if(parent==null){
            wfw.puts("wfw.ext.page_scroll.create: 'element' have not parent element");
            return false;
        }
        //s'assure que le parent est bien de la classe "wfw_ext_scrollable_container" et possede une hauteur et une largeur
        wfw.style.addClass(parent,"wfw_ext_scrollable_container");
        if(typeof(width)=='number')
            element.style.width = width+"px";
        if(typeof(height)=='number')
            element.style.height = height+"px";
        //applique le scrolling a zero
        wfw.ext.page_scroll.scroll(element,0,0);

        //debug
        /*{
            var info = this.page_infos(element);
            wfw.puts("content size: "+info.max_width);
            wfw.puts("visible size: "+info.page_width);
            wfw.puts("page_count: "+info.page_count);
            wfw.puts("max_page: "+info.max_page);
        }*/
        return true;
    },
    /*
        Statut d'erreur
        Membres:
            [String] str  : Texte de l'erreur
            [Int]    code : Code de l'erreur
        Remarques:
            Cet objet est retourné par une fonction lorsqu'une erreur survient
    */
    page_infos : function(element)
    {
        var infos={};
        infos.contener   = objGetParent(element);
        infos.page_width = objGetW(infos.contener);
        infos.page_height = objGetH(infos.contener);
        infos.max_width  = objGetOrgW(element);/* obtient la taille de l'element sans redimentionnement*/
        infos.max_height  = objGetOrgH(element);/* obtient la taille de l'element sans redimentionnement*/

        //maximum de page
        infos.max_page = infos.max_width/infos.page_width;
        if(infos.max_page - parseInt(infos.max_page))
            infos.max_page = parseInt(infos.max_page)+1;
        else
            infos.max_page = parseInt(infos.max_page);
        //offset actuel (absolue)
        if(empty(element.style.marginLeft))
            element.style.marginLeft="0px";
        infos.marginLeft = -parseInt(element.style.marginLeft);
        //numero de page actuel
        infos.page_count = parseInt(infos.marginLeft/infos.page_width);

        //maximum de page verticale
        infos.max_v_page = infos.max_height/infos.page_height;
        if(infos.max_v_page - parseInt(infos.max_v_page))
            infos.max_v_page = parseInt(infos.max_v_page)+1;
        else
            infos.max_v_page = parseInt(infos.max_v_page);
        //offset actuel verticale (absolue)
        if(empty(element.style.marginTop))
            element.style.marginTop="0px";
        infos.marginTop = -parseInt(element.style.marginTop);
        //numero de page actuel
        infos.page_v_count = parseInt(infos.marginTop/infos.page_height);

        return infos;
    },
    scroll : function(element,x,y){
        x=parseInt(x);
        y=parseInt(y);

        element.style.marginLeft=((-x)+"px");
        element.style.marginTop=((-y)+"px");
    },
    /*
        Deplace la position de l'element sur l'axe des X
        Parametres:
            element : l'element a scroller
            y       : position sur l'axe X (en pixel)
        Retourne:
            [object] le timer de l'animation
    */
    goto_pos : function(element,x)
    {
        var infos=this.page_infos(element);

        //verifie les limites
        if(x<0)
            x = infos.max_width-infos.page_width;
        else if(x >= infos.max_width)
            x = 0;

        //anime le scrolling
        var timer = wfw.timer.CreateFrequencyTimer();
        timer.user.element = element;
        timer.bAutoRemove = true;
    
        timer.user.onStart = function()
        {
            var infos = wfw.ext.page_scroll.page_infos(element);
            this.startX = -parseInt(element.style.marginLeft);
            this.endX = x;
        };
        //cree un movement de haut en bas
        timer.user.onUpdateFrame = function(time,normTime,frame)
        {
            var opacity = parseInt((1.0-normTime)*100.0);

            wfw.ext.page_scroll.scroll(element,this.startX+(normTime*(this.endX-this.startX)),0);
        };

        timer.set_frame_per_seconde(100);
        timer.start(300);

        return timer;
    },
    /*
        Deplace la position de l'element sur l'axe des Y
        Parametres:
            element : l'element a scroller
            y       : position sur l'axe Y (en pixel)
        Retourne:
            [object] le timer de l'animation
    */
    goto_vertical_pos : function(element,y,time_length)
    {
        var infos=this.page_infos(element);
        
        if(typeof(time_length)=="undefined")
            time_length=300;

        //verifie les limites
        if(y<0)
            y = infos.max_height-infos.page_height;
        else if(y >= infos.max_height)
            y = 0;

        //anime le scrolling
        var timer = wfw.timer.CreateFrequencyTimer();
        timer.user.element = element;
        timer.bAutoRemove = true;
    
        timer.user.onStart = function()
        {
            var infos = wfw.ext.page_scroll.page_infos(element);
            this.startY = -parseInt(element.style.marginTop);
            this.endY = y;
        };
        //cree un movement de haut en bas
        timer.user.onUpdateFrame = function(time,normTime,frame)
        {
            var opacity = parseInt((1.0-normTime)*100.0);

            wfw.ext.page_scroll.scroll(element,0,this.startY+(normTime*(this.endY-this.startY)));
        };

        timer.set_frame_per_seconde(24);
        timer.start(time_length);

        return timer;
    },
    goto_vertical_page : function(element,count,time_length)
    {
        var infos=this.page_infos(element);

        if(typeof(time_length)=="undefined")
            time_length=300;

        //verifie les limites
        if(count<0)
            count = infos.max_v_page-1;
        else if(count >= infos.max_v_page)
            count = 0;

        //pas de deplacement?
        if(count == infos.page_v_count)
            return;

        //anime le scrolling
        var timer = wfw.timer.CreateFrequencyTimer();
        timer.user.element = element;
        timer.bAutoRemove = true;
    
        timer.user.onStart = function()
        {
            var infos = wfw.ext.page_scroll.page_infos(element);
            this.startY = -parseInt(element.style.marginTop);
            this.endY = (count*infos.page_height);
        };
        //cree un movement de haut en bas
        timer.user.onUpdateFrame = function(time,normTime,frame)
        {
            var opacity = parseInt((1.0-normTime)*100.0);

            wfw.ext.page_scroll.scroll(element,0,this.startY+(normTime*(this.endY-this.startY)));
        };

        timer.set_frame_per_seconde(24);
        timer.start(time_length);

        return timer;
    },
    goto_page : function(element,count)
    {
        var infos=this.page_infos(element);

        //verifie les limites
        if(count<0)
            count = infos.max_page-1;
        else if(count >= infos.max_page)
            count = 0;

        //pas de deplacement?
        if(count == infos.page_count)
            return;

        //anime le scrolling
        var timer = wfw.timer.CreateFrequencyTimer();
        timer.user.element = element;
        timer.bAutoRemove = true;
    
        timer.user.onStart = function()
        {
            var infos = wfw.ext.page_scroll.page_infos(element);
            this.startX = -parseInt(element.style.marginLeft);
            this.endX = (count*infos.page_width);
        };
        //cree un movement de haut en bas
        timer.user.onUpdateFrame = function(time,normTime,frame)
        {
            var opacity = parseInt((1.0-normTime)*100.0);

            wfw.ext.page_scroll.scroll(element,this.startX+(normTime*(this.endX-this.startX)),0);
        };

        timer.set_frame_per_seconde(24);
        timer.start(300);

        return timer;
    },
    goto_next_page : function(element,count)
    {
        var infos=this.page_infos(element);
        var next = infos.page_count + count;

        //anime le scrolling
        return this.goto_page(element,next);
    },
    goto_next_vertical_page : function(element,count,time_length)
    {
        var infos=this.page_infos(element);
        var next = infos.page_v_count + count;

        //anime le scrolling
        return this.goto_vertical_page(element,next,time_length);
    }
};

wfw.ext.element_scroll = {
    goto_x : function(element,x)
    {
        if(y>element.scrollHeight)
            y = element.scrollHeight;
        element.scrollLeft = y;
    },
    goto_y : function(element,x)
    {
        if(x>element.scrollWidth)
            x = element.scrollWidth;
        element.scrollTop = x;
    }
};

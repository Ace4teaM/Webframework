
wfw.ext.scroll = {
    SCROLL_STATE: {
        name: "wfw.ext.scroll.SCROLL_STATE",
        _base: "wfw.REF", //object base name
        parent: null, //element parent du scrolling (obligatoire)
        /*content*/element: null, //auto, premier element enfant du scrolling
        page_width: null, //auto, taille de l'element parent
        page_height: null, //auto, taille de l'element parent
        max_width: null, //auto, taille du contenu
        max_height: null, //auto, taille du contenu
        offset_x: null, //auto, offset x en cours
        offset_y: null, //auto, offset y en cours
        page_count_x: null, //auto, numero de page en cours
        page_count_y: null, //auto, numero de page en cours
        max_page_x: null, //auto, max de page sur x
        max_page_y: null, //auto, max de page sur y,

        _construct: function (obj) {

            obj.element = objGetChild(obj.parent);
            obj.page_width = objGetW(obj.parent);
            obj.page_height = objGetH(obj.parent);
            obj.max_width = objGetOrgW(obj.parent);
            obj.max_height = objGetOrgH(obj.parent);

            //maximum de page
            obj.max_page_x = Math.round(obj.max_width / obj.page_width);
            obj.max_page_y = Math.round(obj.max_height / obj.page_height);

            obj.update();

/*            wfw.puts("max_width = " + obj.max_width);
            wfw.puts("max_height = " + obj.max_height);
            wfw.puts("page_width = " + obj.page_width);
            wfw.puts("page_height = " + obj.page_height);
            wfw.puts("max_page_x = " + obj.max_page_x);
            wfw.puts("max_page_y = " + obj.max_page_y);*/
        },

        /*
        Calcule l'état du scrolling
        */
        update: function () {
            //offset actuel (absolue)
            this.offset_x = empty(this.element.style.marginLeft) ? 0 : (parseInt(this.element.style.marginLeft));
            this.offset_y = empty(this.element.style.marginTop) ? 0 : (parseInt(this.element.style.marginTop));

            //numero de page actuel
            this.page_count_x = -(this.offset_x / this.page_width);
            this.page_count_y = -(this.offset_y / this.page_width);

            //arroundie a l'entier supperieur
            if (this.page_count_x - parseInt(this.page_count_x))
                this.page_count_x++;
            if (this.page_count_y - parseInt(this.page_count_y))
                this.page_count_y++;

            this.page_count_x = parseInt(this.page_count_x);
            this.page_count_y = parseInt(this.page_count_y);
        }
    },

    use: true,

    /*
    Initialise l'objet
    */
    initEvent: function (element) {
        var id = uniqid();
        /* initialise la liste des evenements */
        wfw.event.SetCallback("wfw_ext_scroll_" + id, "mouseout", "scroll_out", function (e, p) {
            var infos = wfw.states.fromElement(p.element);
            infos.timer.onUpdate = infos.noMove;
        }, false, { element: element });
        /* initialise la liste des evenements */
        wfw.event.SetCallback("wfw_ext_scroll_" + id, "mousemove", "scroll_move", function (e, p) {
            var infos = wfw.ext.scroll.updateState(p.element);
            //zone de detection du curseur
            var detect_width = (infos.page_width / 2);
            if (detect_width > 80)
                detect_width = 80;
            //gauche/droite
            //objAlertMembers(e);
            //var ofs_x = e.x + infos.offset_x; //IE9
            //var ofs_x = e.layerX + infos.offset_x; //Google Chrome 18.0
            //var ofs_x = e.layerX + infos.offset_x; //Google Chrome 18.0
            var ofs_x = ((typeof e.layerX == "undefined") ? e.x : e.layerX) + infos.offset_x;
            //var ofs_x = e.layerX;
            //            wfw.puts(ofs_x + "(" + infos.offset_x + ") <" + detect_width);
            //           wfw.puts(ofs_x + "(" + infos.offset_x + ") >" + infos.page_width);
            if (ofs_x < detect_width)
                infos.timer.onUpdate = infos.leftMove;
            else if (ofs_x > infos.page_width - detect_width)
                infos.timer.onUpdate = infos.rightMove;
            else
                infos.timer.onUpdate = infos.noMove;
            //facteur de deplacement (-1~1)
            //var factor = (1.0 / demi_width) * (e.clientX - demi_width);
            //
            //infos.element.style.marginLeft = "-" + parseInt(infos.offset_x + (factor * 10)) + "px";
        }, false, { element: element });
        /*wfw.event.SetCallback("wfw_ext_scroll", "mousedown", "scroll_page", function (e, p) {
        wfw.puts("scroll_page");
        var infos = wfw.ext.scroll.getState(this);
        infos.element.style.marginLeft = "-" + (infos.offset_x + 1) + "px";
        infos.element.style.marginTop = "-" + infos.offset_y + "px";
        }, null);*/
        wfw.event.ApplyTo(element, "wfw_ext_scroll_" + id);
    },

    goto_page: function (element, x_count) {
        var infos = wfw.ext.scroll.updateState(element);

        //verifie les limites
        if (x_count < 0)
            x_count = infos.max_page_x - 1;
        else if (x_count >= infos.max_page_x)
            x_count = 0;

        //pas de deplacement?
        if (x_count == infos.page_count_x)
            return;

        //anime le scrolling
        infos.element.style.marginLeft = -(x_count * infos.page_width) + "px";
    },

    move_page: function (element, page_count, duration) {
        /*var infos = wfw.ext.scroll.updateState(element);
        //anime le scrolling
        infos.element.style.marginLeft = (infos.offset_x + (x_move * infos.page_width)) + "px";
        */
        var timer = wfw.timer.CreateFrequencyTimer({
            bAutoRemove: true,
            frame_per_second: 60,
            user: {
                element: element,
                scroll_element: null,
                page_count: page_count,
                start_x: 0
            },
            onStart: function () {
                var infos = wfw.states.fromElement(this.user.element);
                infos.states.update();
                infos.timer.pause();
                this.user.scroll_element = infos.states.element;
                this.user.start_x = infos.states.offset_x;
                this.user.end_x = -parseInt(this.user.page_count * infos.states.page_width);

                if (this.user.end_x < -(infos.states.max_width - infos.states.page_width)) {
                    this.user.end_x = -(infos.states.max_width - infos.states.page_width);
                }
                if (this.user.end_x > 0) {
                    this.user.end_x = 0;
                }
                this.user.move_x = this.user.end_x - this.user.start_x;
            },
            onUpdateFrame: function (time, normTime, frame) {
                var factor = (normTime * normTime);
                this.user.scroll_element.style.marginLeft = parseInt(this.user.start_x + (this.user.move_x * factor)) + "px";
            },
            onFinish: function () {
                var infos = wfw.states.fromElement(this.user.element);
                this.user.scroll_element.style.marginLeft = this.user.end_x + "px";
                infos.timer.start();
            }
        });

        timer.start(duration);

        return timer;
    },

    /*
    Scrolling de selection horizontale 
    */
    fading: function (element, options) {
        options = object_merge({
            element: element,
            fade_in: true, //in/out
            duartion: 500
        }, options, false);
        var timer = wfw.timer.CreateFrequencyTimer({
            bAutoRemove: true,
            frame_per_second: 50,
            user: options,
            onStart: function () {
                this.user.element.style.opacity = (this.user.fade_in) ? "0.0" : "1.0";
            },
            onUpdateFrame: function (time, normTime, frame) {
                this.user.element.style.opacity = "" + ((this.user.fade_in) ? normTime : (1.0 - normTime));
            },
            onFinish: function () {
                this.user.element.style.opacity = (this.user.fade_in) ? "1.0" : "0.0";
            }
        });

        timer.start(options.duartion);
    },

    /*
    Scrolling de selection horizontale 
    */
    makeSlideShow: function (parent_element, options) {
        //infos
        var infos = wfw.states.fromElement(parent_element, object_merge({
            commandStyle: "auto_slide", //manual_slide | auto_slide | auto_page_slide
            slide_offset: 1,
            slide_timer: null,
            slide_detect: 40, //sensitive_slide, ttaille de la zone de detection gauche/droite du curseur (en pixels)
            states: $new(wfw.ext.scroll.SCROLL_STATE, { parent: parent_element }),
            page_move: false, // si true le timer de "move_page()" est actif
            /**/
            goto_page: function (x_count) {
                this.states.update();

                //verifie les limites
                if (x_count < 0)
                    x_count = this.states.max_page_x - 1;
                else if (x_count >= this.states.max_page_x)
                    x_count = 0;

                //pas de deplacement?
                if (x_count == this.states.page_count_x)
                    return;

                //anime le scrolling
                this.states.element.style.marginLeft = -(x_count * this.states.page_width) + "px";
            },
            /*
            Anime le scrolling jusque la page désirée
            Arguments:
            [int] page_count : Numero de la page
            [int] duration   : Durée de l'animation (en milliseconde)
            Retourne:
            [wfw.timer.FREQUENCY_TIMER] L'Objet timer
            */
            move_page: function (page_count, duration) {
                if (this.page_move)
                    return;
                var timer = wfw.timer.CreateFrequencyTimer({
                    bAutoRemove: true,
                    frame_per_second: 60,
                    user: this,
                    onStart: function () {
                        this.user.page_move = true;
                        //                       wfw.puts("----------------------------");
                        this.user.states.update();

 //                       wfw.puts("page_count_x = " + this.user.states.page_count_x);
                        if (page_count == "next")
                            page_count = this.user.states.page_count_x + 1;
                        if (page_count == "previous")
                            page_count = this.user.states.page_count_x - 1;

                        this.user.start_x = this.user.states.offset_x;
                        this.user.end_x = -parseInt(page_count * this.user.states.page_width);

                        if (this.user.end_x < -(this.user.states.max_width - this.user.states.page_width)) {
                            this.user.end_x = -(this.user.states.max_width - this.user.states.page_width);
                        }
                        if (this.user.end_x > 0) {
                            this.user.end_x = 0;
                        }

/*                        wfw.puts("page_count = " + page_count + " / " + this.user.states.max_page_x);
                        wfw.puts("start_x = " + this.user.start_x);
                        wfw.puts("endX = " + this.user.end_x);
                        wfw.puts("max_width = " + this.user.states.max_width);
                        wfw.puts("page_width = " + this.user.states.page_width);*/
                        this.user.move_x = this.user.end_x - this.user.start_x;
                    },
                    onUpdateFrame: function (time, normTime, frame) {
                        var factor = (normTime * normTime);
                        this.user.states.element.style.marginLeft = parseInt(this.user.start_x + (this.user.move_x * factor)) + "px";
                    },
                    onFinish: function () {
                        this.user.states.element.style.marginLeft = this.user.end_x + "px";
                        this.user.page_move = false;
                    }
                });

                timer.start(duration);

                return timer;
            },
            /**/
            slide: function (offset) {
                this.states.update();

                var start_x = this.states.offset_x;
                var end_x = start_x - offset;

                if (end_x - this.states.page_width < -this.states.max_width) {
                    end_x = -(this.states.max_width - this.states.page_width);
                }
                if (end_x > 0) {
                    end_x = 0;
                }
                this.states.element.style.marginLeft = parseInt(end_x) + "px";
            }
        }, options, false));

        //init
        wfw.style.addClass(infos.states.parent, "wfw_ext_scroll");
        wfw.style.addClass(infos.states.parent, "wfw_ext_unselectable");
        wfw.style.addClass(infos.states.element, "wfw_ext_scroll-content");

        //init
        switch (infos.commandStyle) {
            //Scroll le contenu au passage de la souris
            case "sensitive_slide":
                //[changement automatique]
                infos.slide_timer = wfw.timer.CreateTickTimer(100, {
                    user: infos,
                    bStop: true,
                    onUpdate: function (elapsedTime, tickCount) {
                        this.user.slide(this.user.slide_offset);
                    }
                });
                objSetEvent(parent_element, "mousemove", function (e, p) {
                    //zone de detection du curseur
                    var detect_width = p.slide_detect;
                    var ofs_x = (getMouseX() - objGetAbsX(this));
                    if (ofs_x < detect_width)//gauche
                    {
                        p.slide_offset = -4;
                        p.slide_timer.start();
                    }
                    else if (ofs_x > p.states.page_width - detect_width)//gauche
                    {
                        p.slide_offset = 4;
                        p.slide_timer.start();
                    }
                    else
                        p.slide_timer.pause();
                    //else if (ofs_x >= detect_width)//gauche
                    //    p.slider.slide_offset = 4;
                }, infos);
                objSetEvent(parent_element, "mouseout", function (e, p) {
                    p.slide_timer.pause();
                }, infos);
                break;

            
            //Scroll le contenu avec l'offset "[timer].slide_offset"
            //(Par defaut le timer est en pause)
            case "manual_slide":
                //[changement automatique]
                infos.slide_timer = wfw.timer.CreateTickTimer(100, {
                    user: infos,
                    bStop: true,
                    onUpdate: function (elapsedTime, tickCount) {
                        this.user.slide(this.user.slide_offset);
                    }
                });
                break;

            //Scroll le contenu vers la gauche 
            case "auto_slide":
                //[changement automatique]
                infos.slide_timer = wfw.timer.CreateTickTimer(100, {
                    user: infos,
                    onUpdate: function (elapsedTime, tickCount) {
                        this.user.slide(1);
                    }
                });
                break;

            //Scroll le contenu par page
            case "auto_page_slide":
                //[changement automatique]
                infos.slide_timer = wfw.timer.CreateTickTimer(1000, {
                    user: infos,
                    onUpdate: function (elapsedTime, tickCount) {
                        this.user.states.update();
                        //changement de page
                        var page_count = this.user.states.page_count_x + 1;
                        if (page_count >= this.user.states.max_page_x)
                            page_count = 0;

                        this.user.move_page(page_count, 1000);
                    }
                });
                break;
        }

        return infos;
    },

    
    //Scrolling de selection horizontale (cartes)
    makeCardChooser: function (parent_element, options) {
        //infos
        var infos = wfw.states.fromElement(parent_element, object_merge({
            commandStyle: "mouseSensitive", // "mouseSensitive" | "slide"
            margin: "auto", //marge entre chaque carte
            zIndex: 1200, //depart de l'indice Z
            states: $new(wfw.ext.scroll.SCROLL_STATE, { parent: parent_element }),
            children: objGetChildrenByTagName(parent_element, "div"), //les elements enfants (les cartes)
            wait: false, //si true les cartes sont en cour de deplacement
            pause: false,
            //actualise la position et l'indice Z des cartes
            updatePositions: function () {
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].style.marginLeft = parseInt(i * this.margin) + "px";
                    this.children[i].style.zIndex = this.zIndex + i;
                }
            },
            //actualise l'indice Z des cartes
            updateIndex: function () {
                this.children = objGetChildrenByTagName(parent_element, "div");
                for (var i = 0; i < this.children.length; i++)
                    this.children[i].style.zIndex = this.zIndex + i;
            },
            //fait disparaitre la carte
            fade: function (child) {
                var timer = wfw.timer.CreateFrequencyTimer({
                    bAutoRemove: true,
                    frame_per_second: 50,
                    user: {
                        element: parent_element,
                        child: child
                    },
                    onStart: function () {
                        var infos = wfw.states.fromElement(this.user.element);
                        infos.states.update();
                    },
                    onUpdateFrame: function (time, normTime, frame) {
                        this.user.child.style.opacity = "" + (1.0 - normTime);
                    },
                    onFinish: function () {
                        var infos = wfw.states.fromElement(this.user.element);
                        infos.states.update();
                        objInsertNode(this.user.child, infos.states.parent, null, INSERTNODE_BEGIN);
                        infos.children = objGetChildrenByTagName(this.user.parent_element, "div");
                        infos.updateIndex();
                        this.user.child.style.opacity = "1.0";
                    }
                });

                timer.start(500);
            },
            //deplace la derniere carte vers la droite puis appel moveAll()
            move: function (child) {
                if (this.wait)
                    return;
                this.wait = true;

                var timer = wfw.timer.CreateFrequencyTimer({
                    bAutoRemove: true,
                    frame_per_second: 50,
                    user: {
                        element: parent_element,
                        child: child,
                        start_x: null,
                        end_x: null,
                        move_x: null
                    },
                    onStart: function () {
                        var infos = wfw.states.fromElement(this.user.element);
                        infos.states.update();
                        this.user.start_x = parseInt(this.user.child.style.marginLeft);
                        this.user.end_x = infos.states.page_width;
                        this.user.move_x = this.user.end_x - this.user.start_x;
                    },
                    onUpdateFrame: function (time, normTime, frame) {
                        this.user.child.style.marginLeft = this.user.start_x + parseInt(normTime * this.user.move_x) + "px";
                    },
                    onFinish: function () {
                        var infos = wfw.states.fromElement(this.user.element);
                        infos.states.update();
                        this.user.start_x = infos.states.offset_x;
                        this.user.end_x = 0;
                        this.user.move_x = this.user.end_x - this.user.start_x;
                        objInsertNode(this.user.child, infos.states.parent, null, INSERTNODE_BEGIN);
                        infos.children = objGetChildrenByTagName(this.user.parent_element, "div");
                        infos.updateIndex();
                        this.user.child.style.marginLeft = "0px";
                        infos.moveAll();
                    }
                });

                timer.start(500);
            },
            //decale les premieres carte sur leur nouvel offset à droite
            replaceChild: function (child) {
                var timer = wfw.timer.CreateFrequencyTimer({
                    bAutoRemove: true,
                    frame_per_second: 24,
                    user: {
                        element: parent_element,
                        child: child,
                        start_x: null,
                        move_x: null,
                        end_x: null
                    },
                    onStart: function () {
                        var infos = wfw.states.fromElement(this.user.element);
                        var index = this.user.child.style.zIndex - infos.zIndex;
                        this.user.start_x = parseInt(this.user.child.style.marginLeft);
                        this.user.end_x = index * infos.margin;
                        this.user.move_x = this.user.end_x - this.user.start_x;
                        wfw.puts("end_x:" + this.user.end_x);
                    },
                    onUpdateFrame: function (time, normTime, frame) {
                        this.user.child.style.marginLeft = this.user.start_x + parseInt(normTime * this.user.move_x) + "px";
                    },
                    onFinish: function () {
                    }
                });

                timer.start(200);
            },
            getElementIndex: function (child) {
                var infos = wfw.states.fromElement(this.user.element);
                return child.style.zIndex - infos.zIndex;
            },
            //decale les premieres carte sur leur nouvel offset à droite
            moveAll: function () {
                var timer = wfw.timer.CreateFrequencyTimer({
                    bAutoRemove: true,
                    frame_per_second: 24,
                    user: {
                        element: parent_element,
                        start_x: []
                    },
                    onStart: function () {
                        for (var x = 1; x < infos.children.length; x++)
                            this.user.start_x[x] = parseInt(infos.children[x].style.marginLeft);
                    },
                    onUpdateFrame: function (time, normTime, frame) {
                        var infos = wfw.states.fromElement(this.user.element);
                        for (var x = 1; x < infos.children.length; x++)
                            infos.children[x].style.marginLeft = this.user.start_x[x] + parseInt(normTime * infos.margin) + "px";
                    },
                    onFinish: function () {
                        var infos = wfw.states.fromElement(this.user.element);
                        infos.wait = false;
                    }
                });

                timer.start(200);
            }
        }, options, false));

        //initialise les elements
        wfw.style.addClass(infos.states.parent, "wfw_ext_scroll");
        wfw.style.addClass(infos.states.parent, "wfw_ext_unselectable");
        for (var i in infos.children)
            wfw.style.addClass(infos.children[i], "wfw_ext_scroll-card");

        //calcule la marge entre les elements
        if (infos.margin == "auto")
            infos.margin = (infos.states.page_width - objGetW(infos.children[0])) / (infos.children.length - 1);

        //actualise les positions
        infos.updatePositions();

        //[mouseOverSensitive]
        switch (infos.commandStyle) {
            case "mouseSensitive":
                //[over in]
                objSetEvent(infos.states.parent, "mousemove", function (e, p) {
                    var infos = wfw.states.fromElement(this);
                    //zone de detection du curseur
                    var detect_width = (infos.children.length * infos.margin);
                    var ofs_x = (getMouseX() - objGetAbsX(this));
                    if (ofs_x < detect_width) {
                        var child_index = parseInt(ofs_x / infos.margin);
                        for (var i = 0; i < infos.children.length; i++) {
                            if (i == child_index)
                                infos.children[i].style.zIndex = infos.zIndex + infos.children.length;
                            else
                                infos.children[i].style.zIndex = infos.zIndex + i;
                        }
                    }
                }, null);
                //[over out]
                objSetEvent(infos.states.parent, "mouseout", function (e, p) {
                    var infos = wfw.states.fromElement(this);
                    for (var i in infos.children) {
                        infos.children[i].style.zIndex = infos.zIndex + i;
                    }
                }, null);
                break;
            case "slide":
                //[changement de carte]
                objSetEvent(infos.states.parent, "click", function (e, p) {
                    var infos = wfw.states.fromElement(this);
                    infos.move(infos.children[infos.children.length - 1]);
                }, null);
                break;
            case "auto_slide":
                //[changement de carte automatique]
                wfw.timer.CreateTickTimer(6000, {
                    user: infos,
                    onUpdate: function (elapsedTime, tickCount) {
                        if (this.user.pause)
                            return;
                        this.user.move(this.user.children[this.user.children.length - 1]);
                    }
                });
                break;
            case "fade":
                //[changement de carte automatique]
                wfw.timer.CreateTickTimer(6000, {
                    user: infos,
                    onUpdate: function (elapsedTime, tickCount) {
                        if (this.user.pause)
                            return;
                        this.user.fade(this.user.children[this.user.children.length - 1]);
                    }
                });
                break;
        }


        return infos;
    },

    attachToElement: function(element, options) {
        //options
        options = object_merge({
            leftCursorElement: "",
            rightCursorElement: ""
        }, options);

        //infos
        var infos = wfw.states.fromElement(element, {
            timer: wfw.timer.CreateTickTimer(100, { user: { element: element} }),
            leftMove: function () {
                wfw.ext.scroll.move_page(this.user.element, -0.5);
            },
            rightMove: function () {
                wfw.ext.scroll.move_page(this.user.element, 0.5);
            },
            noMove: function () {
            }
        });

        infos = wfw.states.fromElement(element, $new(wfw.ext.scroll.SCROLL_STATE,
            {
                parent: element,
                element: objGetChild(element),
                page_width: objGetW(element),
                page_height: objGetH(element),
                max_width: objGetOrgW(element),
                max_height: objGetOrgH(element)
            }));
        this.updateState(element);

        //init
        wfw.style.addClass(infos.parent, "wfw_ext_scroll");
        wfw.style.addClass(infos.parent, "wfw_ext_unselectable");

        //
        if (options.leftCursorElement) {
            objSetEvent(options.leftCursorElement, "mousemove", function (e, p) {
                objAlertMembers(e);
                var infos = wfw.states.fromElement(p.element);
                infos.timer.onUpdate = infos.leftMove;
            }, { element: element });
            objSetEvent(options.leftCursorElement, "mouseout", function (e, p) {
                var infos = wfw.states.fromElement(p.element);
                infos.timer.onUpdate = infos.noMove;
            }, { element: element });
        }

        if (options.rightCursorElement) {
            objSetEvent(options.rightCursorElement, "mousemove", function (e, p) {
                var infos = wfw.states.fromElement(p.element);
                infos.timer.onUpdate = infos.rightMove;
            }, { element: element });
            objSetEvent(options.rightCursorElement, "mouseout", function (e, p) {
                var infos = wfw.states.fromElement(p.element);
                infos.timer.onUpdate = infos.noMove;
            }, { element: element });
        }
        //wfw.event.ApplyTo(infos.parent, "wfw_ext_scroll");
        //this.initEvent(infos.parent);

        if (!options.leftCursorElement && !options.rightCursorElement) {
            this.initEvent(infos.parent);
        }
    }
};

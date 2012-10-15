/*
    (C)2008-2012 ID-Informatik. WebFrameWork(R) All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    Contenu à onglet

    Dependences: base.js, dom.js, wfw.js, wfw-ext.js

    Revisions:
        [02-01-2012] Add wfw.ext.tabMenu.getTab() et .selectTab()
        [21-02-2012] Add .getFirstTab(), .getPrevContent(), .getPrevTab(), .removeTab(), .removeAllTab()
        [21-02-2012] Update .getTab(), .getNextContent(), .getNextTab()
*/

wfw.ext.tabMenu = {
    use: true,

    /*
    Initialise l'objet
    */
    init: function () {
        /* initialise la liste des evenements */
        wfw.event.SetCallback("wfw_tabMenu_tab", "click", "show_content", wfw.ext.tabMenu.onTabClick);
        /* initialise la liste des evenements */
        wfw.event.SetCallback("wfw_tabMenu_flying_tab", "click", "show_content", wfw.ext.tabMenu.onTabClick);
        wfw.event.SetCallback("wfw_tabMenu_flying_tab", "mouseover", "tabOver", wfw.ext.tabMenu.onTabClick);
        wfw.event.SetCallback("wfw_tabMenu_flying_tab", "mouseout", "tabOut", wfw.ext.tabMenu.onTabHide);

        wfw.event.SetCallback("wfw_tabMenu_flying_content", "mouseover", "show_content", function (e) {
            var sel_content = this;
            var sel_tab = objGetPrev(sel_content);
            wfw.style.addClass(sel_content, "wfw_tabMenu_content_selected");
            wfw.style.addClass(sel_tab, "wfw_tabMenu_tab_selected");
        });

        wfw.event.SetCallback("wfw_tabMenu_flying_content", "mouseout", "hide_content", function (e) {
            var sel_content = this;
            var sel_tab = objGetPrev(sel_content);
            wfw.style.removeClass(sel_content, "wfw_tabMenu_content_selected");
            wfw.style.removeClass(sel_tab, "wfw_tabMenu_tab_selected");
        });
    },

    /*
    Initialise un menu
    Arguments:
    [HTMLElement] menu : L'Element à initialisé
    Retourne:
    rien
    Remarques:
    'menu' doit posséder la classe "wfw_tabMenu".
    Chacun des elements enfants de 'menu' possedant la classe "wfw_tabMenu_tab" sera interprété comme un onglet.
    Enfin, chaque onglet est imediatement suivit de sont contenu définit par la classe "wfw_tabMenu_content"
    */
    initMenu: function (menu) {
        /* selectionne le premier onglet */
        var sel_onglet = this.getNextTab(objGetChild(menu));
        var sel_content = this.getNextContent(sel_onglet);

        wfw.style.addClass(sel_onglet, "wfw_tabMenu_tab_selected");
        wfw.style.addClass(sel_content, "wfw_tabMenu_content_selected");

        /* initialise les événements */
        node = objGetChild(menu);
        do {
            // onglet ?
            if (wfw.style.haveClass(node, "wfw_tabMenu_tab")) {
                wfw.event.ApplyTo(node, "wfw_tabMenu_tab");
            }
        } while (node = objGetNext(node));
    },

    initFlyMenu: function (menu) {
        /* selectionne le premier onglet */
        var sel_onglet = this.getNextTab(objGetChild(menu));
        var sel_content = this.getNextContent(sel_onglet);

        wfw.style.addClass(menu, "wfw_tabMenu_fly");

        /* initialise les événements */
        node = objGetChild(menu);
        do {
            // onglet ?
            if (wfw.style.haveClass(node, "wfw_tabMenu_tab")) {
                wfw.style.removeClass(node, "wfw_tabMenu_tab_selected");
                wfw.event.ApplyTo(node, "wfw_tabMenu_flying_tab");
            }
            // contenu ?
            if (wfw.style.haveClass(node, "wfw_tabMenu_content")) {
                wfw.style.removeClass(node, "wfw_tabMenu_content_selected");
                wfw.style.addClass(node, "wfw_tabMenu_content_fly");
                wfw.event.ApplyTo(node, "wfw_tabMenu_flying_content");
            }
        } while (node = objGetNext(node));
    },
    
    /*
    Obtient le premier onglet d'un menu
    Arguments:
    [HTMLElement] menu : Menu du tableau.
    Retourne:
    [HTMLElement] L'Elément trouvé, null si introuvable
    Remarques:
    Un élément onglet est identifié par sa classe de style "wfw_tabMenu_tab"
    */
    getFirstTab: function (menu) {
        var e = objGetChild(menu);
        while (e = objGetNext(e)) {
            if (wfw.style.haveClass(e, "wfw_tabMenu_tab"))
                return e;
        }
        return null;
    },
    
    /*
    Obtient le prochain élément de contenu
    Arguments:
    [HTMLElement] e : Sélection précédente
    Retourne:
    [HTMLElement] L'Elément trouvé, null si introuvable
    Remarques:
    Un élément de contenu est identifié par sa classe de style "wfw_tabMenu_content"
    */
    getNextContent: function (e) {
        while (e = objGetNext(e)) {
            if (wfw.style.haveClass(e, "wfw_tabMenu_content"))
                return e;
        }
        return null;
    },

    /*
    Obtient le prochain élément onglet
    Arguments:
    [HTMLElement] e : Sélection précédente.
    Retourne:
    [HTMLElement] L'Elément trouvé, null si introuvable
    Remarques:
    Un élément onglet est identifié par sa classe de style "wfw_tabMenu_tab"
    */
    getNextTab: function (e) {
        while (e = objGetNext(e)) {
            if (wfw.style.haveClass(e, "wfw_tabMenu_tab"))
                return e;
        }
        return null;
    },
    
    /*
    Obtient le prochain élément de contenu
    Arguments:
    [HTMLElement] e : Sélection précédente
    Retourne:
    [HTMLElement] L'Elément trouvé, null si introuvable
    Remarques:
    Un élément de contenu est identifié par sa classe de style "wfw_tabMenu_content"
    */
    getPrevContent: function (e) {
        while (e = objGetPrev(e)) {
            if (wfw.style.haveClass(e, "wfw_tabMenu_content"))
                return e;
        }
        return null;
    },

    /*
    Obtient le prochain élément onglet
    Arguments:
    [HTMLElement] e : Sélection précédente.
    Retourne:
    [HTMLElement] L'Elément trouvé, null si introuvable
    Remarques:
    Un élément onglet est identifié par sa classe de style "wfw_tabMenu_tab"
    */
    getPrevTab: function (e) {
        while (e = objGetPrev(e)) {
            if (wfw.style.haveClass(e, "wfw_tabMenu_tab"))
                return e;
        }
        return null;
    },

    /*
    Ajoute un onglet et retourne l'élément de contenu
    Arguments:
    [HTMLElement] menu : L'Element à initialisé
    [HTMLElement] title : Titre de l'onglet
    Retourne:
    [HTMLElement] L'Elément de contenu a initialiser
    */
    addTab: function (menu, title) {
        var content = document.createElement("div");
        var subcontent = document.createElement("div");
        var onglet = document.createElement("div");
        var onglet_text = document.createTextNode(title);
        //insert
        objInsertNode(onglet, menu, null, INSERTNODE_END);
        objInsertNode(onglet_text, onglet, null, INSERTNODE_END);
        objInsertNode(content, menu, null, INSERTNODE_END);
        objInsertNode(subcontent, content, null, INSERTNODE_END);
        //init
        wfw.style.addClass(onglet, "wfw_tabMenu_tab");
        wfw.style.addClass(content, "wfw_tabMenu_content");
        // initialise les événements
        wfw.event.ApplyTo(onglet, "wfw_tabMenu_tab");

        return subcontent;
    },

    /*
    Obtient un onglet
    */
    getTab: function (menu, num) {
        var i = 0;
        var tab = this.getFirstTab(menu);
        while (tab != null)
        {
            if(num == i)
                return tab;
            tab = this.getNextTab(tab);
            i++;
        }

        return null;
    },

    /*
    Selectionne un onglet
    */
    selectTab: function (menu, tab) {
        // active l'onglet
        var sel_onglet = tab;
        var sel_content = objGetNext(sel_onglet);
        wfw.style.addClass(sel_onglet, "wfw_tabMenu_tab_selected");
        wfw.style.addClass(sel_content, "wfw_tabMenu_content_selected");

        // desactive tous les onglets suivants
        content = sel_content;
        while (content = objGetNext(content)) {
            wfw.style.removeClass(content, "wfw_tabMenu_tab_selected");
            wfw.style.removeClass(content, "wfw_tabMenu_content_selected");
        }

        // desactive tous les onglets précédents
        content = sel_onglet;
        while (content = objGetPrev(content)) {
            wfw.style.removeClass(content, "wfw_tabMenu_tab_selected");
            wfw.style.removeClass(content, "wfw_tabMenu_content_selected");
        }
    },

    /*
    Ferme un onglet
    */
    closeTab: function (tab) {
        // l'onglet
        var sel_onglet = tab;
        var sel_content = objGetNext(sel_onglet);
        wfw.style.removeClass(sel_onglet, "wfw_tabMenu_tab_selected");
        wfw.style.removeClass(sel_content, "wfw_tabMenu_content_selected");
    },

    /*
    Evenement onTabClick, appelé lors l'utilisateur clique sur un onglet
    */
    onTabClick: function (e) {
        var sel_onglet = this;
        var sel_content = objGetNext(sel_onglet);

        wfw.style.addClass(sel_onglet, "wfw_tabMenu_tab_selected");
        wfw.style.addClass(sel_content, "wfw_tabMenu_content_selected");

        content = sel_content;
        while (content = objGetNext(content)) {
            wfw.style.removeClass(content, "wfw_tabMenu_tab_selected");
            wfw.style.removeClass(content, "wfw_tabMenu_content_selected");
        }

        content = sel_onglet;
        while (content = objGetPrev(content)) {
            wfw.style.removeClass(content, "wfw_tabMenu_tab_selected");
            wfw.style.removeClass(content, "wfw_tabMenu_content_selected");
        }
    },

    /*
    Evenement onTabClick, appelé lors l'utilisateur clique sur un onglet
    */
    onTabHide: function (e) {
        var sel_onglet = this;
        var sel_content = objGetNext(sel_onglet);

        wfw.style.removeClass(sel_onglet, "wfw_tabMenu_tab_selected");
        wfw.style.removeClass(sel_content, "wfw_tabMenu_content_selected");
    },

    /*
    Supprime un onglet
    */
    removeTab: function (tab) {
        // l'onglet
        var sel_onglet = tab;
        var sel_content = objGetNext(sel_onglet);
        nodeRemoveNode(sel_onglet);
        nodeRemoveNode(sel_content);
    },

    /*
    Supprime plusieurs onglets
    */
    removeAllTab: function (menu, tabRef, options) {
        //options
        var att = {
            remove:"after", // (after|before) Sens de recherche
            removeRef:false, //(true|false) Supprime la reference 'tabRef'
        };
        if(typeof(options)!="undefined")
            att=object_merge(att,options);

        /* selectionne le premier onglet */
        var next;
        //pas de reference ?
        if (tabRef == null) {
            tabRef = this.getFirstTab(menu);
        }

        /* supprime les onglets */
        switch(att.remove){
            case "after":
                next = this.getNextTab(tabRef);
                while (next != null) {
                    var sel_onglet = next;
                    var sel_content = this.getNextContent(sel_onglet);
                    next = this.getNextTab(next);
                    if (sel_onglet != null && sel_content != null) {
                        nodeRemoveNode(sel_onglet);
                        nodeRemoveNode(sel_content);
                    }
                }
                break;
            case "before":
                next = this.getPrevTab(tabRef);
                while (next != null) {
                    var sel_onglet = next;
                    var sel_content = this.getNextContent(sel_content);
                    next = this.getPrevTab(next);
                    if (sel_onglet != null && sel_content != null) {
                        nodeRemoveNode(sel_onglet);
                        nodeRemoveNode(sel_content);
                    }
                }
                break;
        }

        /* supprime la reference */
        if(att.removeRef==true && tabRef!=null){
            nodeRemoveNode(tabRef);
            nodeRemoveNode(this.getNextContent(tabRef));
        }
    }

};

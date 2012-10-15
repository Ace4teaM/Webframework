/*
    (C)2012 ID-Informatik. All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    WebFrameWork(R)

    Geometry 2D

    Dependences: base.js, dom.js, wfw.js

    Revisions:
        [09-04-2012] Implentation
*/


wfw.ext.geometry = {
	
    POSITION: {
        x: 0.0,
        y: 0.0,
        z: 0.0,
        w: 0.0,

        //constructeur
        _construct: function (obj) {
        },

        X: function () { return parseInt(this.x); },
        Y: function () { return parseInt(this.y); },
        Z: function () { return parseInt(this.z); }
    },

    SIZE: {
        w: 0.0,
        h: 0.0,

        W: function () { return parseInt(this.w); },
        H: function () { return parseInt(this.h); }
    },

    RECTANGLE: {
        pos1: null,
        pos2: null,

        //constructeur
        _construct: function (obj) {
            if (!obj.pos)
                obj.pos = $new(wfw.ext.geometry.POSITION);
            if (!obj.size)
                obj.pos = $new(wfw.ext.geometry.SIZE);
        },

        //largeur
        Width: function () {
            var w = this.pos1.x - this.pos1.x;
            return (w < 0.0) ? -w : w;
        },

        //hauteur
        Height: function () {
            var h = this.pos1.y - this.pos1.y;
            return (h < 0.0) ? -h : h;
        },

        //profondeur
        Depth: function () {
            var d = this.pos1.z - this.pos1.z;
            return (d < 0.0) ? -d : d;
        }
    },

    CIRCLE: {
        d: 0.0, //diametre

        Radius: function () {
            return this.d / 2.0;
        },

        Position: function (angle_rad, distance) {
            return $new(wfw.ext.geometry.POSITION,
                {
                    x: Math.cos(angle_rad) * distance,
                    y: Math.sin(angle_rad) * distance
                }
            );
        }
    },

    //Grille
    GRID: {
        size: null, //SIZE
        count: null, //POSITION

        //constructeur
        _construct: function (obj) {
            if (!obj.size)
                obj.size = $new(wfw.ext.geometry.SIZE, {
                    w: 1.0,
                    h: 1.0
                });
            if (!obj.count)
                obj.count = $new(wfw.ext.geometry.POSITION, {
                    x: 10.0,
                    y: 10.0
                });
        },

        CaseOf: function (x_index, y_index) {
            var factor_x = this.grid_size.w / this.case_count.x;
            var factor_y = this.grid_size.h / this.case_count.y;
            return $new(wfw.ext.geometry.RECTANGLE, {
                pos1: $new(wfw.ext.geometry.POSITION, { x: factor_x * x_index, y: factor_y * y_index }),
                pos2: $new(wfw.ext.geometry.POSITION, { x: factor_x * (x_index + 1), y: factor_y * (y_index + 1) })
            });
        }
    },

    //Grille
    TILE_MAP: {
        tilesMap: null, //[[x,y],...]
        tilesSize: 16,
        tilesSpacing: 0,
        element: null,
        tile_src: null,
        //bases classes
        _base: "wfw.ext.geometry.GRID",

        //constructeur
        _construct: function (obj) {
            if (obj.tilesMap == null) {
                obj.tilesMap = [];
                for (var i = 0; i < obj.size.W() * obj.size.H(); i++)
                    obj.tilesMap.push([0, 0]);
            }
            //init
            for (var x = 0; x < obj.size.W(); x++) {
                for (var y = 0; y < obj.size.H(); y++) {
                    var n = x + (y * obj.size.W());
                    var child = document.createElement("div");
                    wfw.style.addClass(child, "tile");
                    child.style.position = "absolute";
                    child.style.width = obj.tilesSize + "px";
                    child.style.height = obj.tilesSize + "px";
                    child.style.left = (x * obj.tilesSize) + "px";
                    child.style.top = (y * obj.tilesSize) + "px";
                    child.style.backgroundImage = "url('" + obj.tile_src + "')";
                    child.style.backgroundPosition = "-" + (obj.tilesMap[n][0] * (obj.tilesSpacing + obj.tilesSize)) + "px -" + (obj.tilesMap[n][1] * (obj.tilesSpacing + obj.tilesSize)) + "px";
                    obj.element.appendChild(child);
                }
            }
            obj.TileMap();

            wfw.style.createClass("TILE", "display:inline-block; background-repeat:no-repeat; margin:0px; padding:0px; position:absolute;");
        },

        TileMap: function () {
            var children = objGetChildren(this.element);
            for (var x = 0; x < this.size.W(); x++) {
                for (var y = 0; y < this.size.H(); y++) {
                    var n = x + (y * this.size.W());
                    var child = children[n];
                    wfw.style.addClass(child, "tile");
                    child.style.position = "absolute";
                    child.style.width = this.tilesSize + "px";
                    child.style.height = this.tilesSize + "px";
                    child.style.left = (x * this.tilesSize) + "px";
                    child.style.top = (y * this.tilesSize) + "px";
                    child.style.backgroundImage = "url('" + this.tile_src + "')";
                    child.style.backgroundPosition = "-" + (this.tilesMap[n][0] * (this.tilesSpacing + this.tilesSize)) + "px -" + (this.tilesMap[n][1] * (this.tilesSpacing + this.tilesSize)) + "px";
                }
            }
        },

        tilesRand: function (tiles, rect) {
            for (var x = rect.x; x < rect.w; x++) {
                for (var y = rect.y; y < rect.h; y++) {
                    var i = parseInt(Math.random() * tiles.length);
                    var n = x + (y * this.size.W());
                    this.tilesMap[n][0] = tiles[i][0];
                    this.tilesMap[n][1] = tiles[i][1];
                }
            }
        },

        tilesCopy: function (tiles, rect) {
            for (var x = 0; x < rect.w; x++) {
                for (var y = 0; y < rect.h; y++) {
                    var n = x + rect.x + ((y + rect.y) * this.size.W());
                    var i = x + (y * rect.w);
                    this.tilesMap[n][0] = tiles[i][0];
                    this.tilesMap[n][1] = tiles[i][1];
                }
            }
        }
    }


};

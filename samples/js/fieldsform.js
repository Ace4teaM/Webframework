/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2013 Thomas AUGUEY <contact@aceteam.org>
    ---------------------------------------------------------------------------------------------------------------------------------------
    This file is part of WebFrameWork.

    WebFrameWork is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WebFrameWork is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WebFrameWork.  If not, see <http://www.gnu.org/licenses/>.
    ---------------------------------------------------------------------------------------------------------------------------------------
*/

//initialise le contenu
YUI(wfw_yui_config(wfw_yui_base_path)).use('node', 'gallery-form','wfw-datamodel', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){
        var form = new wfw.DataModel.FORM({
            fields:[
                {id:"table_name"},
                {id:"row_offset"},
                {id:"row_count"},
                {id:"cols_names"}
            ]
        });
        form.createHTML();
    };

    //onload event
    Y.one('window').on('load', onLoad);
});

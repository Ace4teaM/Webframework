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

/**
 * @brief Fix les types de bases
 * Ajoute les controles JQuery-UI aux types de bases
 * **/

(function($)
{
    cInput.toElement = function(name,value){
        var input = $('<input />');
        input.attr({
            type:"text",
            value:value,
            name:name
        });

        return input;
    };

    cInputBool.toElement = function(name,value,label){
        var input = $('<input type="checkbox" id="'+name+'" />');
        input.attr({
            value:value,
            name:name
        });
        var w = $('<span></span>');
        w.append(input);
        var l=w.append('<label for="'+name+'">On</label>');
        /*l.on("change",function(e){
            var checked = $( this ).is(':checked');
            if(checked)
                l.html("On");
            else
                l.html("Off");
        });*/
        input.button();
        return w;
    };

    cInputDate.toElement = function(name,value){
        var input = $(cInput.toElement(name,value));
        return input.datepicker();
    };
})(jQuery);
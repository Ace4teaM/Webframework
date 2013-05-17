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
 * @todo A implémenter
 * 
 * @brief jQuery Result Plugin
 * @method result
 * @memberof JQuery
 * 
 * **/
(function($)
{
    //constructeur
    $.fn.result = function(p){
       if(typeof p == "object")
       {
            p = $.extend({
                result    : null,
                error     : null,
                args      : null
            },p);

            return this.each(function()
            {
                $(this).children("*[name='error']").text(p.error);
                if(p.args && typeof(p.args.message)!="undefined")
                    $(this).children("*[name='message']").text(p.args.message);
            });
       }
       
       return this;
    };
    
})(jQuery);

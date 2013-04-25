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


var cInputURL={
    isValid : function(value){
        // 1. non vide
        if (empty_string(value))
            return RESULT(cResult.Failed, cInput.EmptyText);
        
        // 2. test le format
        var regex = '^'+this.regExp()+'$';
        if ( !(new RegExp(regex)).test(value) )
            return RESULT(cResult.Failed, cInput.InvalidChar);
        
        return RESULT_OK();
    }
    ,
    regExp : function(){
        //char list
        /*var alpha  = '[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]';
        var safe   = '[\\$\\-\\_\\@\\.\\&\\+\\-]';
        var digit  = '[0123456789]';
        var extra  = '[\\!\\*\\"\\\'\\(\\)\\,]';
        var hex    = '(?:'+digit+'|[abcdefABCDEF]'+')';
        var escape = '%'+hex+hex;*/
        
        //compositions
        var scheme   = '[A-Za-z]{1}[A-Za-z0-9+\\.\\-]*';
        var port     = '[0-9]+';
        var domain   = '[A-Za-z]{1}[A-Za-z0-9_\\.:\\-]*'; //Registry-based
        var path     = '[A-Za-z0-9_\\.+%\\-]*';
        var query    = '[A-Za-z0-9_\\.&=+;%\\-\\(\\)\\:\\/]*';
        var fragment = '[A-Za-z0-9_+%\\-]*';
        //var fragment = '(?:'+alpha+'|'+digit+'|'+safe+'|'+extra+'|'+escape+'';
 
        return '((' + scheme + '):/+)?'
                +'(' + domain + ')?'
                +'^([/' + path + ']*)([?' + query + ']?)([#' + fragment + ']?)';
    }
    ,
    getMaxLength : function(){
        return 128;
    }
    ,
    toObject : function(value){
        return ""+value;
    }
    ,
    toElement : function(name,value){
        return cInput.toElement(name,value);
    }
};
cInputurl = cInputURL; //global insensitive scope

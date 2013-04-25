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
var cInput={
    EmptyText      : "EMPTY_TEXT",
    InvalidChar    : "INVALID_CHAR",
    InvalidFormat  : "INVALID_FORMAT",
    InvalidRange   : "INVALID_RANGE",
    Oversized      : "OVERSIZED",
    Undersized     : "UNDERSIZED",
    TooSmallString : "TOO_SMALL_STRING",
    
    isValid : function(value){
        return RESULT_OK();
    }
    ,
    regExp : function(){
        return '.*';
    }
    ,
    getMaxLength : function(){
        return -1;
    }
    ,
    toObject : function(value){
        return value;
    }
    ,
    toString : function(value){
        return ""+value;
    }
    ,
    toElement : function(name,value){
        return null;
    }
};

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


var cInputString={
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
        return '[^"\n\r]*';
    }
    ,
    getMaxLength : function(){
        return 128;
    }
    ,
    toObject : function(value){
        return ""+value;
    }
}
cInputstring = cInputString; //global insensitive scope

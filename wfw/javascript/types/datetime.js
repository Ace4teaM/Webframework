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


var cInputDateTime={
    isValid : function(value){
        if (empty_string(value))
            return RESULT(cResult.Failed, cInput.EmptyText);

        //test le format
        var fmt = this.regExp();
        if ( (new RegExp(fmt)).test(value) )
            return RESULT_OK();
            
        return RESULT(cResult.Failed, cInput.InvalidFormat);
    }
    ,
    regExp : function(){
        var tsep = '[\\:\\s]';//time separator
        var dsep = '[\\-\\/\\\\\\s]';//date separator
        return "^"
                +"(?:([0-9]{1,2})"+dsep+"([0-9]{1,2})"+dsep+"([0-9]+)\\s*([0-2]{1}[0-9]{1})"+tsep+"([0-6]{1}[0-9]{1})"+tsep+"([0-6]{1}[0-9]{1}))" //DMY-HMS
                +"|"
                +"(?:([0-9]+)"+dsep+"([0-9]{1,2})"+dsep+"([0-9]{1,2})\\s*([0-6]{1}[0-9]{1})"+tsep+"([0-6]{1}[0-9]{1})"+tsep+"([0-2]{1}[0-9]{1}))"//YMD-SMH
        +"$";
    }
    ,
    getMaxLength : function(){
        return -1;
    }
    ,
    getMinLength : function(){
        return 1;
    }

    ,
    toObject : function(value){
        var date = new Date(value);
        return date;
    }
    ,
    toElement : function(name,value){
        return cInput.toElement(name,value);
    }
};
cInputdatetime = cInputDateTime; //global insensitive scope
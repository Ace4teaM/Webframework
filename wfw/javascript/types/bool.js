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

var cInputBool={

    isValid : function(value){
        if( empty_string(value) )
            return RESULT(cResult.Failed,cInput.EmptyText);

        // carateres valides
        switch(value.toLowerCase()){
            case "0":
            case "1":
            case "yes":
            case "no":
            case "on":
            case "off":
            case "true":
            case "false":
                return RESULT_OK();
        }

        return RESULT(cResult.Failed,cInput.InvalidChar);
    }
    ,
    regExp : function(){
        return 'on|off|0|1|yes|no|true|false';
    }
    ,
    getMaxLength : function(){
        return 128;
    }
    ,
    toObject : function(value){
        return this.toBool(value);
    }
    //extra
    ,
    toBool : function(value){
        switch(value.toLowerCase()){
            case "1":
            case "yes":
            case "on":
            case "true":
                return true;
        }
        return false;
    }

    ,
    toString : function(value){
        return (value ? "true" : "false");
    }
    ,
    toElement : function(name,value){
        return cInput.toElement(name,value);
    }
};
cInputbool = cInputBool; //global insensitive scope
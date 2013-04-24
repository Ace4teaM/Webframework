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


var cInputUNIXFileName={
    isValid : function(value){
        //
        //Valide la part local:
        //
        // 1. non vide
        if (empty_string(value))
            return RESULT(cResult.Failed, cInput.EmptyText);
        // 2. carateres invalides
        if(value.match(/[\/\\:*?"<>|]/))
            return RESULT(cResult.Failed,cInput.InvalidChar);
        // 3. pas de point '.' ni au debut, ni a la fin, ni de double point
        if((value.substr(0,1)=='.') || (value.substr(-1,1)=='.') || (value.indexOf('..') != -1))
            return RESULT(cResult.Failed,cInput.InvalidChar);

        return RESULT_OK();
    }
    ,
    regExp : function(){
        return null;
    }
    ,
    getMaxLength : function(){
        return 128;
    }
    ,
    getMinLength : function(){
        return 1;
    }

    ,
    toObject : function(value){
        return value;
    }
}
cInputunixfilename = cInputUNIXFileName; //global insensitive scope



var cInputWindowsFileName={
    isValid : function(value){
        //
        //Valide la part local:
        //
        // 1. non vide
        if (empty_string(value))
            return RESULT(cResult.Failed, cInput.EmptyText);
        // 2. carateres invalides
        if(value.match(/[\/\\:*?"<>|]/))
            return RESULT(cResult.Failed,cInput.InvalidChar);
        // 3. pas de point '.' ni au debut, ni a la fin, ni de double point
        if((value.substr(0,1)=='.') || (value.substr(-1,1)=='.') || (value.indexOf('..') != -1))
            return RESULT(cResult.Failed,cInput.InvalidChar);

        return RESULT_OK();
    }
    ,
    regExp : function(){
        return null;
    }
    ,
    getMaxLength : function(){
        return 128;
    }
    ,
    getMinLength : function(){
        return 1;
    }

    ,
    toObject : function(value){
        return value;
    }
}
cInputwindowsfilename = cInputWindowsFileName; //global insensitive scope
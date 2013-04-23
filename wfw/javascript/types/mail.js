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


var cInputMail={
    isValid : function(value){
        if (empty_string(value))
            return RESULT(cResult.Failed, cInput.EmptyText);

        var str_parts = strexplode(value, "@", false);
        if(str_parts.length < 2)
            return RESULT(cResult.Failed, cInput.InvalidFormat);
        var name   = str_parts[0];
        var domain = str_parts[1];

        //
        //Valide la part local:
        //

        // 1. non vide
        if (empty_string(name))
            return RESULT(cResult.Failed, cInput.InvalidChar);
        // 2. carateres valides
        if (!name.match(/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._!#$%*\/?|^{}`~&'+-=]+/))
            return RESULT(cResult.Failed, cInput.InvalidChar);
        // 3. pas de point '.' ni au debut, ni a la fin, ni de double point
        if ((name.substr(0, 1) == '.') || (name.substr(-1, 1) == '.') || (name.indexOf('..') != -1))
            return RESULT(cResult.Failed, cInput.InvalidChar);

        //
        //Valide la part du domaine:
        //

        // 1. non vide
        if (empty_string(domain))
            return RESULT(cResult.Failed, cInput.InvalidChar);
        // 2. carateres valides
        if (!domain.match(/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-]+/))
            return RESULT(cResult.Failed, cInput.InvalidChar);
        // 3. pas de point '.' ni au debut, ni a la fin, ni de double point
        if ((domain.substr(0, 1) == '.') || (domain.substr(-1, 1) == '.') || (domain.indexOf('..') != -1))
            return RESULT(cResult.Failed, cInput.InvalidChar);

        return RESULT_OK();
    }
    ,
    regExp : function(){
        return null;
    }
    ,
    getMaxLength : function(){
        return 255 + 64 + 1;
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
cInputmail = cInputMail; //global insensitive scope
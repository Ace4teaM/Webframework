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


var cInputInteger={
    isValid : function(value){
        // vide ?
        if (empty_string(value))
            return RESULT(cResult.Failed, cInput.EmptyText);

        // vérifie le nombre de caractères min
        if (this.getMinLength() && strlen(value) < this.getMinLength())
            return RESULT(cResult.Failed, cInput.Undersized);

        // vérifie le nombre de caractères max
        if (this.getMaxLength() && strlen(value) > this.getMaxLength())
            return RESULT(cResult.Failed, cInput.Oversized);

        // vérifie le rang de valeur
        if (parseInt(value) < this.min() || parseInt(value) > this.max())
            return RESULT(cResult.Failed, cInput.InvalidRange);

        // vérifie le format
        if ( ! (new RegExp("^" + this.regExp() + "$")).test(value))
            return RESULT(cResult.Failed, cInput.InvalidChar);

        return RESULT_OK();
    }
    ,
    regExp : function(){
        return '\\-?(?:0|[1-9]{1}[0-9]*)';
    }
    ,
    getMaxLength : function(){
        return 11;
    }
    ,
    getMinLength : function(){
        return 1;
    }
    ,min : function() {
        return -2147483648; //2^31
    }

    ,max : function() {
        return 2147483647; //2^31-1
    }

    ,
    toObject : function(value){
        return parseInt(value);
    }
    //extra
    ,
    toInt : function(value){
        return parseInt(value);
    }

    ,
    toString : function(value){
        return ""+value;
    }
}
cInputinteger = cInputInteger; //global insensitive scope
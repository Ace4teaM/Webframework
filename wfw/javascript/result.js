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
 * @brief Object result
 */
var cResult={
    Ok     : "ERR_OK"
    ,Failed : "ERR_FAILED"
    ,System : "ERR_SYSTEM"
    // last current states
    ,last : {
        context:null,
        code:null,
        att:null
    }
    // return the last result object
    ,getLast : function(){ return this.last; }
};

/**
 * @brief Définit le dernier resultat
 */
function RESULT(context,code,att){
    cResult.last.context = context;
    cResult.last.code    = code;
    cResult.last.att     = att;
    if(context==cResult.Ok)
        return true;
    return false;
}

/**
 * @brief Définit le dernier resultat comme succès
 */
function RESULT_OK(){
    cResult.last.context = cResult.Ok;
    cResult.last.code    = "SUCCESS";
    cResult.last.att     = null;
    return true;
}

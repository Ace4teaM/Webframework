﻿/*
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
Ext.define('Wfw.Result', {
    
    showResultToMsg : function(result)
    {
        var obj = {
            title: result.getResult(),
            msg: result.getError(),
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.QUESTION
       };
       var msg = result.getMessage();
       if(msg)
           obj.msg += "<br/>"+result.getMessage();
       switch(result.result){
           case "ERR_FAILED":
               obj.icon = Ext.Msg.WARNING;
               break;
           case "ERR_SYSTEM":
               obj.icon = Ext.Msg.ERROR;
               break;
       }
        Ext.MessageBox.show(obj);
    }

});

MyApp.showResultToMsg = function(result)
{
    var obj = {
        title: result.getResult(),
        msg: result.getError(),
        buttons: Ext.Msg.OK,
        icon: Ext.Msg.QUESTION
   };
   var msg = result.getMessage();
   if(msg)
       obj.msg += "<br/>"+result.getMessage();
   switch(result.result){
       case "ERR_FAILED":
           obj.icon = Ext.Msg.WARNING;
           break;
       case "ERR_SYSTEM":
           obj.icon = Ext.Msg.ERROR;
           break;
   }
    Ext.MessageBox.show(obj);
}

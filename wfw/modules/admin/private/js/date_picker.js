/*
    (C)2011 ID-Informatik. All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    Fonctions globales
*/

var cur = new Date();
var selection = null;//element en cours de selection

var mounth_text = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
];

var day_text = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi"
];

function initTimePicker()
{
    var sel,i,e;
    //les heures
    sel = $doc("hour_picker");
    for(i=0;i<24;i++)
    {
        e = document.createElement("option");
        objSetAtt(e,"value",i);
        objSetInnerText(e,i);
        objInsertNode(e,sel,null,INSERTNODE_END);
    }
    objSetEvent(sel,"change",
        function(e){
            cur.setHours($value(this));
            updateTime();
        }
    );
    //les minutes
    sel = $doc("min_picker");
    for(i=0;i<60;i++)
    {
        e = document.createElement("option");
        objSetAtt(e,"value",i);
        objSetInnerText(e,i);
        objInsertNode(e,sel,null,INSERTNODE_END);
    }
    objSetEvent(sel,"change",
        function(e){
            cur.setMinutes($value(this));
            updateTime();
        }
    );
    //les secondes
    sel = $doc("sec_picker");
    for(i=0;i<60;i++)
    {
        e = document.createElement("option");
        objSetAtt(e,"value",i);
        objSetInnerText(e,i);
        objInsertNode(e,sel,null,INSERTNODE_END);
    }
    objSetEvent(sel,"change",
        function(e){
            cur.setSeconds($value(this));
            updateTime();
        }
    );
}

function initPicker()
{
    var table = $doc("picker");

    //derniere et premeire date du mois en cours
    var first_day_date = new Date(cur.getFullYear(),cur.getMonth(),1);
    var last_day_date = new Date(cur.getFullYear(),cur.getMonth()+1,0);
    var cur_day_time = new Date(first_day_date.getTime());

    //initialise le texte
    objSetInnerText($doc("picker_year"),cur.getFullYear());
    objSetInnerText($doc("picker_mounth"),mounth_text[cur.getMonth()]);

    //obtient la premier ligne du tableau
    var first_row = $doc("num_row");

    //initialise les jours de la semaine
    for(var y=0;y<5;y++)
    {
        //obtient la ligne en cours
        var row = table.rows[first_row.rowIndex+y];
        for(var x=0;x<7;x++)
        {
            //obtient la colonne en cours
            var col = row.cells[x];
            var day_count = (x+(y*7))-(first_day_date.getDay()-1);
            
            //avant le premier jour du mois ?
            if(y==0 && x<first_day_date.getDay())
            {
                objSetInnerText(col,"-");
                objSetClassName(col,"inactive");
                objSetEvent(col,"click", function(e){ } );
            }
            //pendant les jours du mois ?
            else if(day_count<=last_day_date.getDate())
            {
                //initialise le timestamp du jour
                cur_day_time.setDate(day_count);
                objSetAtt(col,"id",cur_day_time.getTime());
                //initialise la case
                objSetInnerText(col,day_count);
                objSetClassName(col,"active");
                objSetEvent(col,"click",
                    function(e){
                        var save_hour = cur.getHours();
                        var save_min = cur.getMinutes();
                        var save_sec = cur.getSeconds();
                        var this_time = objGetAtt(this,"id");
                        cur.setTime(this_time);
                        cur.setHours(save_hour);
                        cur.setMinutes(save_min);
                        cur.setSeconds(save_sec);
                        updateTime();
                        changeSel(this);
                    }
                );
                //selection en cours ?
                if((cur.getFullYear()==cur_day_time.getFullYear()) && (cur.getMonth()==cur_day_time.getMonth()) && (cur.getDate()==cur_day_time.getDate()))
                    changeSel(col);
            }
            //apres le dernier jour du mois ?
            else
            {
                objSetInnerText(col,"-");
                objSetClassName(col,"inactive");
                objSetEvent(col,"click", function(e){ } );
            }
        }
    }

    updateTime();
}

function setDate(date)
{
    if(date!="Invalid Date")
    {
        cur.setTime(date.getTime());
        updateTime();
        
        $value("hour_picker",cur.getHours());
        $value("min_picker",cur.getMinutes());
        $value("sec_picker",cur.getSeconds());
    }

    return cur;
}

function changeSel(newElement)
{
    if(selection!=null)
        wfw.style.removeClass(selection,"selected");

    selection = newElement;
    if(selection!=null)
        wfw.style.addClass(selection,"selected");

    return cur;
}

function updateTime()
{
    $value("hour",cur.getHours());
    $value("min",cur.getMinutes());
    $value("sec",cur.getSeconds());
    $value("year",cur.getFullYear());
    $value("month",cur.getMonth()+1);
    $value("day",cur.getDate());
    $value("timestamp",cur.getTime());
}

function toFrenchDate(date)
{
    return day_text[date.getDay()]+" "+date.getDate()+" "+mounth_text[date.getMonth()]+" "+date.getFullYear();
}

function nextYear()
{
    cur.setYear(cur.getFullYear()+1);
    cur.setDate(1);
    initPicker();
}

function prevYear()
{
    cur.setYear(cur.getFullYear()-1);
    cur.setDate(1);
    initPicker();
}

function nextMonth()
{
    cur.setMonth(cur.getMonth()+1);
    cur.setDate(1);
    initPicker();
}

function prevMonth()
{
    cur.setMonth(cur.getMonth()-1);
    cur.setDate(1);
    initPicker();
}

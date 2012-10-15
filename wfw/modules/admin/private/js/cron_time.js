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

var month_text = [
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

function initTimes() {
    var sel, i, e;
    //
    //les heures
    //
    sel = $doc("hour");
    for(i=0;i<24;i++)
    {
        e = document.createElement("option");
        objSetAtt(e,"value",i);
        objSetInnerText(e,i);
        objInsertNode(e,sel,null,INSERTNODE_END);
    }
    //tous les heures
    {
        e = document.createElement("option");
        objSetAtt(e, "value", "*");
        objSetInnerText(e, "Toutes les heures");
        objInsertNode(e, sel, null, INSERTNODE_END);
    }
    objSetEvent(sel,"change",
        function(e){
            updateTime();
        }
    );
    //
    //les minutes
    //
    sel = $doc("min");
    for(i=0;i<60;i++)
    {
        e = document.createElement("option");
        objSetAtt(e,"value",i);
        objSetInnerText(e,i);
        objInsertNode(e,sel,null,INSERTNODE_END);
    }
    //tous les minutes
    {
        e = document.createElement("option");
        objSetAtt(e, "value", "*");
        objSetInnerText(e, "Toutes les minutes");
        objInsertNode(e, sel, null, INSERTNODE_END);
    }
    objSetEvent(sel,"change",
        function(e){
            updateTime();
        }
    );
    //
    // les jours
    //
    sel = $doc("day");
    for(i=1;i<=31;i++)
    {
        e = document.createElement("option");
        objSetAtt(e,"value",i);
        objSetInnerText(e,i);
        objInsertNode(e,sel,null,INSERTNODE_END);
    }
    //tous les jours
    {
        e = document.createElement("option");
        objSetAtt(e, "value", "*");
        objSetInnerText(e, "Tous les jours");
        objInsertNode(e, sel, null, INSERTNODE_END);
    }
    objSetEvent(sel,"change",
        function(e){
            updateTime();
        }
    );
    //
    // les mois
    //
    sel = $doc("month");
    for (i = 0; i < month_text.length; i++) {
        e = document.createElement("option");
        objSetAtt(e, "value", i+1);
        objSetInnerText(e, month_text[i]);
        objInsertNode(e, sel, null, INSERTNODE_END);
    }
    //tous les mois
    {
        e = document.createElement("option");
        objSetAtt(e, "value", "*");
        objSetInnerText(e, "Tous les mois");
        objInsertNode(e, sel, null, INSERTNODE_END);
    }
    objSetEvent(sel, "change",
        function (e) {
            updateTime();
        }
    );
    //
    // jour de la semaine
    //
    sel = $doc("day_of_week");
    for (i = 0; i < day_text.length; i++) {
        e = document.createElement("option");
        objSetAtt(e, "value", i);
        objSetInnerText(e, day_text[i]);
        objInsertNode(e, sel, null, INSERTNODE_END);
    }
    //tous les mois
    {
        e = document.createElement("option");
        objSetAtt(e, "value", "*");
        objSetInnerText(e, "Tous les jours de la semaine");
        objInsertNode(e, sel, null, INSERTNODE_END);
    }
    objSetEvent(sel, "change",
        function (e) {
            updateTime();
        }
    );

}

function onSelectFrequency(e) {
    var cron_time = $value(this);
    if (!empty(cron_time)) {
        //desactive les champs
        nodeEnumNodes(
            $doc("custom_field"),
            function (node, condition) {
                if (node.nodeType == XML_ELEMENT_NODE && node.tagName.toLowerCase() == "select")
                    objSetAtt(node, "disabled", "disabled");
                return true; // continue l'énumération
            }
            , false
        );
        //met a jour la valeur
        $value("time", cron_time);
    }
    else {
        //active les champs
        nodeEnumNodes(
            $doc("custom_field"),
            function (node, condition) {
                if (node.nodeType == XML_ELEMENT_NODE && node.tagName.toLowerCase() == "select")
                    objRemoveAtt(node, "disabled");
                return true; // continue l'énumération
            }
            , false
        );
        //met a jour la valeur
        updateTime();
    }

}

function selectValue(select, value) {
    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value == value) {
            select.options[i].selected = true;
            return true;
        }
    }
    return false;
}

function updateTime() {
    var value = "";
    value += $value("min") + " ";
    value += $value("hour") + " ";
    value += $value("day") + " ";
    value += $value("month") + " ";
    value += $value("day_of_week");

    $value("time", value);
}
/*
function setTime(str) {
    var values = strexplode(str, " ", true);
    selectValue($doc("min"), values[0]);
    selectValue($doc("hour"), values[1]);
    selectValue($doc("day"), values[2]);
    selectValue($doc("month"), values[3]);
    selectValue($doc("day_of_week"), values[4]);

    $value("time", str);
}*/

function setTime(str) {
    //idem a une value du raccourcie ?
    if (selectValue($doc("shortcut"), str) == true)
        return onSelectFrequency.apply($doc("shortcut"),[null]);
    //
    var values = strexplode(str, " ", true);
    if (values.length<4) {
        wfw.puts("setTime: invalid time");
        return;
    }
    $value("min", values[0]);
    $value("hour", values[1]);
    $value("day", values[2]);
    $value("month", values[3]);
    $value("day_of_week", values[4]);

    $value("time", str);
}

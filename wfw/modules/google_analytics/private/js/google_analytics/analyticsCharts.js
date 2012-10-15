/*
(C)2012 ID-Informatik. All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
ID-Informatik
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script d'initialisation du template de statistiques Google Analytics
*/


// date de debut et de fin des statistiques (1an)
var end_time = getTime();
var start_time = end_time - (365 * 24 * 60 * 60);

// champs de connexion au compte Analytics (email, passwd, id)
var ga_fields;

// Charge les librairies google (dynamique)
google.load('gdata', '2.x', { packages: ['analytics'] });
google.load('visualization', '1.0', { 'packages': ['corechart'] });

// init callback (apres chargement des librairies google)
google.setOnLoadCallback(init);

/*
    Initialise le graphique de statistiques
*/
function init() {
    //obtient les parametres de connexion
    ga_fields = wfw.form.get_fields("google_analytics");
    if (empty(ga_fields.id) || empty(ga_fields.passwd) || empty(ga_fields.email)) {
        wfw.puts("Google Analytics: Paramètres de connexion non disponible.");
        return;
    }
    

    //obtient le token d'utilisation
    var param = {
        "onsuccess": function (obj, args) {
            //obtient les stats
            var param2 = {
                "onsuccess": function (obj2, xml_doc) {
                    var entry = makeChartData(xml_doc);
                    drawPieChart(entry);
                    wfw.style.removeClass($doc("google_analytics"), "wfw_hidden");
                    wfw.puts("Google Analytics: Statistiques chargées.");
                },
                no_result: 1,
                no_msg: 0
            };
            var fields2 = {
                auth: args.auth,
                id: ga_fields.id,
                "max-results": "100",
                "sort": "ga:day",
                "metrics": "ga:visits",
                "dimensions": "ga:day,ga:visitorType",
                "start-date": date('Y-m-d', start_time),
                "end-date": date('Y-m-d', end_time)
            };
            wfw.request.Add(null, "req/google_analytics/get.php", fields2, wfw.utils.onCheckRequestResult_XML, param2, true);
        }
    };
    wfw.request.Add(null, "req/google_analytics/auth.php", ga_fields, wfw.utils.onCheckRequestResult_XARG, param, true);
}

function drawPieChart(entryData) {
    var chart = getChartObj();
    
    
    //initialise les statistiques manquantes par des zeros
    for (var key in entryData["New Visitor"]) {
        if(typeof(entryData["Returning Visitor"][key]) == undefined || isNaN(entryData["Returning Visitor"][key]))
        	entryData["Returning Visitor"][key]=0;
    }
    
    //liste les valeurs
    var visiteur_new = entryData["New Visitor"].join(",");
    var visiteur_ret = entryData["Returning Visitor"].join(",");
    var visiteur_total = "";
    var max = 0;

    for (var key in entryData["New Visitor"]) {
        var _new =  parseInt(entryData["New Visitor"][key]);
        var _ret =  parseInt(entryData["Returning Visitor"][key]);
        

        if (!empty(visiteur_total))
            visiteur_total += ",";
        visiteur_total += _new + _ret;
        max = Math.max(max,_new + _ret);
    }
    
    //debug
/*    wfw.puts(visiteur_new);
    wfw.puts(visiteur_ret);
    wfw.puts(visiteur_total);
    wfw.puts(max);*/

    //liste les mois de l'année axe (horizontale)
    var date = new Date(start_time * 1000);
    var str_month = new Array("Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jui", "Aou", "Sep", "Oct", "Nov", "Dec");
    var month_list = "0:";
    month_list += "|" + date.getFullYear();
    for (var i = 1; i < 12; i++) {
        month_list += "|" + str_month[rotval(date.getMonth() + i, 12)];
    }
    month_list += "|" + (parseInt(date.getFullYear())+1);

    //parametres du graphique
    chart.setParams({
        'chs': '600x150', // Image dimensions
        'chts': '000000,15', // Title Style
        'cht': 'lc', // Chart Type
        'chco': 'FF0000,00FF00,0000FF', // Colors
        'chdl': 'Retour|Nouveau|Total', // Legend
        'chdlp': 't', // Legend Pos 'top'
        'chxt': 'x,y', // axis
        'chxr': '0,0,' + max + '|1,0,11|', // axis range
        'chxl': month_list+'|1:|0|'+parseInt(max*0.25)+'|'+parseInt(max*0.5)+'|'+parseInt(max*0.75)+'|'+max, // axis text
        'chd': 't:' + visiteur_ret + '|' + visiteur_new + '|' + visiteur_total, // Chart Data
        'chds': '0,' + max // Max Value
    });

    $doc('chart_div').innerHTML += '<img src="' + chart.getURL() + '" /><br />';
    return chart;
}

function drawVisitorChart(entryData) {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Titre');
    data.addColumn('number', 'Visites');
    var rows = [];

    for (var key in entryData["New Visitor"]) {
        var entry = entryData[key];
        rows.push([entry["ga:visitorType"], parseInt(entry["ga:visits"])]);
    }
    data.addRows(rows);

    // Set chart options
    var options = { 'title': 'Visites',
        'width': 600,
        'height': 300
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function getEntryValues(element) {
    var entry = {};
    nodeEnumNodes(
        element,
        function (node, condition, p) {
            if (node.nodeType == XML_ELEMENT_NODE) {
                var name = objGetAtt(node, "name");
                switch (name) {
                    case "ga:day":
                    case "ga:visitorType":
                    case "ga:visits":
                        p[name] = objGetAtt(node, "value");
                        break;
                }
            }
            return true; // continue l'énumération
        },
        false,
        entry
    );
    return entry;
}


function makeChartData(xml_doc) {
     //extrait les valeurs des entrées
    var cur = docGetNode(xml_doc, "/feed/entry");
    var data = {
        "New Visitor":[],
        "Returning Visitor": []
    };
    while (cur) {
        var entry_data = getEntryValues(cur);
        var name  = entry_data["ga:visitorType"];
        var index = parseInt(zeroshift(entry_data["ga:day"])) -1;
        data[name][index] = entry_data["ga:visits"];
        cur = objGetNext(cur, "entry");
        
    	//debug
 /*       wfw.puts(entry_data);*/
    }
    return data;
}

/**
* Abstracts much of what is similar between different chart types out into
* a convenient wrapper object.  The object has an internal set of all chart
* parameters types used in this example application, as well as methods for
* getting/setting those parameters, and converting them into a URL used to pull
* the image of the resulting chart.
* @return {object} Chart wrapper object representing the chart to be displayed,
*   including all the relevant data and configuration options.
*/
function getChartObj() {
    var params_ = {
        'chs': '', // Image Dimensions
        'chtt': '', // Title
        'chxt': '', // Axes
        'chts': '', // Title Style
        'cht': '', // Chart type
        'chd': '', // Data
        'chdl': '', // Legend
        'chco': '', // Colors
        'chbh': '', // Width and spacing
        'chxl': '', // Axis Labels
        'chds': '', // Scaling
        'chxr': '', // Axis Scaling
        'chm': '', // Chart Markers
        'chl': '' // Data Labels
    };

    var baseURL_ = 'http://chart.apis.google.com/chart';

    /**
    * Method to get all the parameters of a chart object.
    * @return {object} An object containing all the key/value pairs that make up
    *     this chart object.
    */
    function getParams_() {
        return params_;
    }

    /**
    * Method to get the value of a specific chart parameter by name.
    * @param {string} key The name of the parameter to return.
    * @return {string} The current value of the chart parameter specified by key.
    */
    function getParam_(key) {
        return params_[key];
    }

    /**
    * Sets a parameter.  Only does so if the key is already defined in the
    * "params_" member variable.  Otherwise the parameter is ignored and discarded.
    * @param {string} key The name of the parameter being set.
    * @param {string} val The value to insert at the specified key.
    */
    function setParam_(key, val) {
        if (params_[key] !== undefined) {
            params_[key] = val;
        }
    }

    /**
    * Sets multiple parameters at once.  Each key/value pair is only inserted if
    * the key is defined in the "params_" member variable.  Otherwise the parameter
    * is ignored and discarded.
    * @param {string} obj Object made up of key/value pairs to be set in this
    *     object.
    */
    function setParams_(obj) {
        for (key in obj) {
            setParam_(key, obj[key]);
        }
    }

    /**
    * Given a base URL and an array of parameters, construct the complete URL.
    * @return {string} The complete URL for the chart.
    */
    function getURL_() {
        paramArray = [];
        for (key in params_) {
            if (params_[key]) {
                pairStr = [key, params_[key]].join('=');
                paramArray.push(pairStr);
            }
        }
        paramStr = paramArray.join('&');
        url = [baseURL_, paramStr].join('?');
        return url;
    }

    return {
        'getParam': getParam_,
        'getParams': getParams_,
        'setParam': setParam_,
        'setParams': setParams_,
        'getURL': getURL_
    };
}


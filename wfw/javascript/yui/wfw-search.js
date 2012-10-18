/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    Recherche dans les chaines de caracteres

    JS  Dependences: base.js
    YUI Dependences: base

    Implementation: [11-10-2012] 
*/

YUI.add('wfw-search', function (Y) {
    var wfw = Y.namespace('wfw');
    
    wfw.Search = {
        MATCH_WORDS : 0x1,//recherche un mot
        MATCH_LINE : 0x0,//recherche la ligne
        MATCH_CASE : 0x2,//sensible a la case
        MATCH_WHOLE_WORD : 0x4,//recherche un mot entier/recherche une ligne entière
        MATCH_EXACT_STRING : 0x8,//recherche la ligne exacte (seulement avec 'MATCH_LINE')
        MATCH_EXPRESSION : 0x10,//utilise les expressions régulières (* = n'importe quel caracteres)
        /*
		    Test une recherche sur la chaine de caracteres
		    Argument:
		        [string] search  : Chaine à rechercher
		        [string] value   : Chaine à analyser
		        [int]    att     : Attributs de la recherche
		    Retourne:
		        [bool] true si la chaine est trouvé, sinon false
		*/
        string : function(search, value,att) {
            //utilise les expressions régulières ?
            if(att & this.MATCH_EXPRESSION){
                //precede les caracteres speciaux par un back-slash '\'
                search = search.replace(new RegExp('([\\\\\;\\.\\!\\$\\^\\[\\]\\(\\)\\{\\}\\?\\+\\-\\|]{1})','gi'),'\\$1');
                //autres caracteres
                search = search.replace('*','(?:[.]*)');
            }
            else{
                //precede les caracteres speciaux par un back-slash '\'
                var reg = new RegExp('([\\\\\;\\.\\!\\$\\^\\[\\]\\(\\)\\{\\}\\?\\*\\+\\-\\|]{1})', 'gi');
                search = search.replace(reg,'\\$1');
            }
            //recherche par mot...
            if(att & this.MATCH_WORDS)
            {
                var words = strexplode(search, " ", true);
                for(var x in words)
                {
                    var word = words[x];
                    //attribut de l'expression reguliere
                    var exp_att="g";
                    if(!(att & this.MATCH_CASE))
                        exp_att+="i";
                    //mot entier
                    if(att & this.MATCH_WHOLE_WORD)
                        word="(\\W|^)"+word+"(\\W|$)";
                    else
                        word="(\\W|^)"+word;
                    //remplace les espaces par le caractere special d'espacement '\s'
                    word = word.replace(/[\s]{1,}/gi,'\\s');
                    //test
                    var reg = new RegExp(word, exp_att);
                    if(reg.test(value))
                        return true;
                }
            }
            //recherche la ligne
            else//MATCH_LINE
            {
                //attribut de l'expression reguliere
                var exp_att="g";
                if(!(att & this.MATCH_CASE))
                    exp_att+="i";
                //ligne entiere
                if(att & this.MATCH_WHOLE_WORD)
                    search="(\\W|^)"+search+"(\\W|$)";
                else if(att & this.MATCH_EXACT_STRING)
                    search="^"+search+"$";
                //remplace les espaces par le caractere special d'espacement '\s'
                search = search.replace(/[\s]{1,}/gi,'\\s');
                //test
                var reg = new RegExp(search, exp_att);
                if(reg.test(value))
                    return true;
            }
            return false;
        },
        string_array : function(search, string_ar,att) {
            var new_fields = [];
            for(var index in string_ar)
            {
                var value = string_ar[index];
                if(typeof(value)=="string" && this.string(search,value,att))
                {
                    new_fields.push(value);
                }
            }
            return new_fields;
        },
        string_object : function(search, string_obj,att) {
            var new_fields = {};
            for(var index in string_obj)
            {
                var value = string_obj[index];
                if(typeof(value)=="string" && this.string(search,value,att))
                {
                    new_fields[index]=value;
                }
            }
            return new_fields;
        }
    };
}, '1.0', {
    requires:['base']
});

/*
    (C)2011 ID-Informatik, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        ID-Informatik
        MR AUGUEY THOMAS
        contact@id-informatik.com
    ---------------------------------------------------------------------------------------------------------------------------------------

    Eléments 'dragable' [API]

    Dependences: base.js, dom.js, wfw.js

    Revisions:
        [29-12-2011] Implentation
*/

/*
    drag
*/
wfw.ext.upload = {
    use: true,
    list: {},
    /*
        Remarques:
            data    = input[File]
            wfw_id  = text
            wfw_pwd = text
    */
    sendAsForm: function (formid, client_id, att) {
        // options 
        var opt = {
            callback:null,
            form_id:"",
            client_pwd:""
        };
        if(typeof(att)!="undefined")
            opt=object_merge(opt,att);

        //obtient la form
        var form=$doc(formid);
        if(input)
        {
            wfw.puts("wfw.ext.upload.sendAsForm: form not found !");
            return;
        }

        /* Insert les champs manquant */
        var fields = wfw.form.get_fields(formid);
        if(typeof(fields["wfw_id"])=="undefined")
        {
            var input=document.createElement("input");
            if(input)
            {
                objInsertNode(input,form,null,INSERTNODE_END);
                objSetAtt(input,"type","hidden");
                objSetAtt(input,"name","wfw_id");
            }
        }
        if(typeof(fields["wfw_pwd"])=="undefined" && !empty(opt.client_pwd))
        {
            var input=document.createElement("input");
            if(input)
            {
                objInsertNode(input,form,null,INSERTNODE_END);
                objSetAtt(input,"type","hidden");
                objSetAtt(input,"name","wfw_pwd");
            }
        }
        /* Définit les champs de la requête 'up.php' */
        fields = {
            wfw_id  : client_id,
            wfw_pwd : opt.client_pwd
        };
        wfw.form.set_fields(formid,fields);
        
        /* demande la creation d'un processus d'upload */
        var param = {
            "onsuccess": function (obj, args) {
                //prepare la liste
                var list = {
                    part_remaining: (1),
                    part_count: (1)
                };
                //callback ?
                if(opt.callback)
                    opt.callback(args,"begin",list);
                //
                //args.token = token;
                var simpleUploadResult = object_merge(wfw.ext.upload.onSimpleUploadResult,{options:(opt)});
                simpleUploadResult.onsuccess(obj,args);
            },
            onfailed: function (obj, args) {
                //callback ?
                if(opt.callback)
                    opt.callback(args,"failed");
                wfw.puts("wfw.ext.upload.sendAsForm: FAILED\n");
            },
            onerror: function (obj) {
                //callback ?
                if(opt.callback)
                    opt.callback(null,"error");
                wfw.puts("wfw.ext.upload.sendAsForm: ERROR\n");
            }
        };

        //envoie la forme dans une iframe est recurere le contenu
        wfw.form.sendFrame(formid,"req/client/up.php",
            function (responseText, param) {
                //simule un objet requete deja executé
                var req = $new( wfw.request.REQUEST, {
                    url          : "req/client/up.php",
                    user         : param,
                    status       : 200,
                    response     : responseText,
                });
                //appel le callback
                wfw.utils.onCheckRequestResult_XARG(req);
            },
        param);
    },
    /*
    Upload un fichier en paquets
    Paramètres:
        [File]      file         : L'Objet File
        [int]       packet_size  : Taille d'un paquet, si zero la taille est définit automatiquement
        [string]    client_id    : Identificateur du dossier client qui reçoi le fichier
        [objet]     opt          : Options supplémentaires de la fonction (voir Paramètres optionnels)
    Paramètres optionnels:
        [function]  callback     : Callback appelé une fois le fichier totalement uploadé: callback(args,state,infos)
        [string]    form_id      : Identificateur de formulaire utilisé pour le résultat
        [string]    client_pwd   : ( Non utilisé ), Mot-de-passe du dossier client
    Retourne:
        [bool] true en cas de succès, false en cas d'erreur
    */
    sendAsPacket: function (file, packet_size, client_id, att) {
        
        // options 
        var opt = {
            callback:null,
            form_id:"",
            client_pwd:""
        };
        if(typeof(att)!="undefined")
            opt=object_merge(opt,att);

        //packet_size auto ?
        if (typeof (packet_size) == "undefined" || !packet_size)
            packet_size = 1024 * 10; //1Ko
            
        //compte le nombre de part et la taille restante
        var count = parseInt(file.size / packet_size);
        var rest = file.size - (count * packet_size);
        if (rest)
            count++;

        /* demande la creation d'un processus d'upload */
        var param = {
            "onsuccess": function (obj, args) {
                //prepare la liste
                wfw.ext.upload.list[args.token] = {
                    part_remaining: (count),
                    part_count: (count)
                };
                //callback ?
                if(opt.callback)
                    opt.callback(args,"begin",wfw.ext.upload.list[args.token]);
                // ecrit les fragments de fichier
                wfw.puts("-- Begin Upload ( token=" + args.token + ", " + obj.args.size + " bytes ==> " + obj.args.wfw_id + ", " + count + " parts ) --");
                var i = 0;
                var start = 0;
                while (i < count) {
                    var reader = new FileReader();
                    var size = ((i + 1 < count) ? packet_size : rest);

                    //
                    wfw.ext.upload.readFileOffset_base64(
                        file,
                        start,
                        size,
                        //onLoad
                        function (start, size, data, param) {
                            //upload le fragment de données
                            //wfw.puts("wfw.ext.upload.sendAsPacket: ["+start+":"+size+"]\n");
                            wfw.request.Add(null, "req/client/packetUpload.php",
                                {
                                    wfw_id: (param.wfw_id),
                                    token: (param.token),
                                    filename: (param.filename),//passe pour "finalizeUpload.php"
                                    offset: (start),
                                    size: (size),
                                    wfw_form_name: opt.form_id,//formulaire qui va traiter les erreurs
                                    encoded: "base64",
                                    /*"count": (param.index),*/
                                    data: $new( wfw.HTTP_REQUEST_PART, {
                                        headers: [
                                            'Content-Disposition: form-data; name="data"',
                                            'Content-Type: application/octet-stream',
                                            'Content-Length: ' + size
                                        ],
                                        data: (data)
                                    })
                                    /*data: {
                                        headers: [
                                            'Content-Disposition: form-data; name="data"',
                                            'Content-Type: application/octet-stream',
                                            'Content-Length: ' + size
                                        ],
                                        data: (data)
                                    }*/
                                },
                                wfw.utils.onCheckRequestResult_XARG,
                                //resultat
                                object_merge(wfw.ext.upload.onUploadResult,{options:(opt)}),
                                true//async
                            );
                        },
                        //param
                        {
                            wfw_id: (args.id),
                            token: (args.token),
                            index: (i),
                            filename: (obj.args.filename)//passe pour "finalizeUpload.php"
                        }
                    );

                    start += size;
                    i++;
                }
            },
            onfailed: function (obj, args) {
                //callback ?
                if(opt.callback)
                    opt.callback(args,"failed");
                wfw.puts("wfw.ext.upload.sendAsPacket: FAILED\n");
            },
            onerror: function (obj) {
                //callback ?
                if(opt.callback)
                    opt.callback(args,"error");
                wfw.puts("wfw.ext.upload.sendAsPacket: ERROR\n");
            }
        };
        wfw.request.Add(null, "req/client/beginUpload.php", { wfw_form_name: opt.form_id, wfw_id: client_id, size: file.size, filename: file.name }, wfw.utils.onCheckRequestResult_XARG, param, false);

        return true;
    },
    
    /*
        [ PRIVATE ]
        Callback XARG, progression de l'upload
    */
    onUploadResult: {
        onsuccess: function (obj, args) {
            var list = wfw.ext.upload.list[obj.args.token];
            list[obj.args.offset] = true;
            wfw.puts("wfw.ext.upload.onUploadResult: Receive [" + obj.args.offset + ":" + obj.args.size + "] OK\n");
            wfw.puts("wfw.ext.upload.onUploadResult: filename = [" + obj.args.filename + "]\n");
            list.part_remaining--;
            //callback ?
            if(this.options.callback)
                this.options.callback(args,"update",list);
            //terminé
            if (!list.part_remaining) {
                wfw.puts("wfw.ext.upload.onUploadResult: finalize upload\n");
                wfw.request.Add(null, "req/client/finalizeUpload.php", obj.args, wfw.utils.onCheckRequestResult_XARG, object_merge({options:this.options},wfw.ext.upload.onFinalizeResult), false);
            }
            else
                wfw.puts("wfw.ext.upload.onUploadResult: part remaining " + list.part_remaining + " of " + list.part_count + "\n");
        },
        onfailed: function (obj, args) {
            //callback ?
            if(this.options.callback)
                this.options.callback(args,"update_failed",null);
            //definit dans la liste
            wfw.ext.upload.list[obj.args.token][obj.args.offset] = false;
            wfw.puts("wfw.ext.upload.onUploadResult: Receive [" + obj.args.offset + ":" + obj.args.size + "] FAILED\n");
        },
        onerror: function (obj) {
            //callback ?
            if(this.options.callback)
                this.options.callback(args,"update_error",null);
            //definit dans la liste
            wfw.ext.upload.list[obj.args.token][obj.args.offset] = false;
            wfw.puts("wfw.ext.upload.onUploadResult: Receive [" + obj.args.offset + ":" + obj.args.size + "] ERROR\n");
        }
    },
    
    /*
        [ PRIVATE ]
        Callback XARG, progression de l'upload
    */
    onSimpleUploadResult: {
        onsuccess: function (obj, args) {
            var list = {
                part_remaining: (0),
                part_count: (1)
            };
            wfw.puts("wfw.ext.upload.onUploadResult: filename = [" + obj.args.filename + "]\n");
            //callback ?
            if(this.options.callback)
                this.options.callback(args,"update",list);
            //terminé
            wfw.puts("wfw.ext.upload.onFinalizeResult: file upload OK\n");
            this.options.callback(args,"done",list);
        },
        onfailed: function (obj, args) {
            //callback ?
            if(this.options.callback)
                this.options.callback(args,"update_failed",null);
        },
        onerror: function (obj) {
            //callback ?
            if(this.options.callback)
                this.options.callback(args,"update_error",null);
        }
    },
    
    /*
        [ PRIVATE ]
        Callback XARG, finalize un upload
    */
    onFinalizeResult: {
        onsuccess: function (obj, args) {
            var list = wfw.ext.upload.list[obj.args.token];
            //callback ?
            if(this.options.callback)
                this.options.callback(args,"done",list);
            wfw.puts("wfw.ext.upload.onFinalizeResult: file upload OK\n");
        },
        onfailed: function (obj, args) {
            //callback ?
            if(this.options.callback){
                alert("failed");
                this.options.callback(args,"failed");}
            wfw.puts("wfw.ext.upload.onFinalizeResult: file upload FAILED\n");
        },
        onerror: function (obj) {
            //callback ?
            if(this.options.callback)
                this.options.callback(args,"error");
            wfw.puts("wfw.ext.upload.onFinalizeResult: file upload ERROR\n");
        }
    },
    
    /*
        [ PRIVATE ]
        Lit un fragement du fichier encodé en base64
        Parametres:
            [File]      file      : L'Objet File
            [int]       start     : Offset en octets
            [int]       size      : Taille en octets
            [function]  callback  : Callback appelé une fois le fichier totalement uploadé: callback(start, size, data, param)
            [mixed]     param     : Paramètres passés au callback
        Retourne:
            [bool] true en cas de succès, false en cas d'erreur
    */
    readFileOffset_base64: function (file, start, size, callback, param) {
        var reader = new FileReader();

        //tout le fichier ?
        if (!start && !size) {
            start = 0;
            size = file.size;
        }
        //restant
        else if (start && !size) {
            size = file.size - start;
        }

        //wfw.puts("Slice file size=" + size + " start=" + start);
        //Slicer...
        var blob;
        if (file.webkitSlice)
            blob = file.webkitSlice(start, start + size, 'application/octet-stream');
        else if (file.mozSlice)
            blob = file.mozSlice(start, start + size);
        else if (file.slice)
            blob = file.slice(start, size);
        else {
            wfw.puts("wfw.ext.upload.readFile: Slice file is not disponible on your navigator !");
            return false;
        }

        reader.param = param;
        reader.callback = callback;
        reader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
                //supprime l'entete des données (base64 only)
                var data = evt.target.result.indexOf(",");
                if (data != -1) //supprime l'entete
                    data = evt.target.result.substr(data + 1);
                else
                    data = evt.target.result;
                /*var last_size = strlen(evt.target.result);
                var last = 6;
                var begin = 0;
                wfw.puts("data size=" + last_size + " first=0x" + (evt.target.result[begin].charCodeAt(0)) + "(" + evt.target.result[begin] + ")" + "last=0x" + (evt.target.result[last].charCodeAt(0)) + "(" + evt.target.result[last] + ")");
                this.callback(start, size, evt.target.result, this.param);*/

                this.callback(start, size, data, this.param);
            }
        };

        //Lit le fichier
        reader.readAsDataURL(blob); //base64 encodé
        //reader.readAsBinaryString(blob);

        return true;
    },
    
    /*
        [ PRIVATE ]
        Lit l'intégralité du fichier encodé en base64
        Parametres:
            [File]      file      : L'Objet File
            [function]  callback  : Callback appelé une fois le fichier totalement uploadé: callback(data, param)
            [mixed]     param     : Paramètres passés au callback
        Retourne:
            [bool] true en cas de succès, false en cas d'erreur
    */
    readFile_base64: function (file, callback, param) {
        var reader = new FileReader();

        reader.param = param;
        reader.callback = callback;
        reader.onloadend = function (evt) {
            //supprime l'entete des données (base64 only)
            var data = evt.target.result.indexOf(",");
            if (data != -1) //supprime l'entete
                data = evt.target.result.substr(data + 1);
            else
                data = evt.target.result;
            //callback
            if (evt.target.readyState == FileReader.DONE) {
                this.callback(data, this.param);
            }
        };

        //Lit le fichier
        reader.readAsDataURL(file); //base64 encodé
        //reader.readAsBinaryString(file);

        return true;
    },

    readFile_base64_IE : function(filePath, callback, param) {
		try {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			
            alert(filePath);
			var file = fso.GetFile(filePath, 1);
			
			var data = file.ReadAll(ForReading, TristateFalse);
            alert(data);
			file.Close();
            
            callback(data, param);

			return true;
		} catch (e) {
	        wfw.puts('wfw.upload.readFile_base64_IE: Unable to access local files');
			if (e.number == -2146827859) {
	            wfw.puts('wfw.upload.readFile_base64_IE: Unable to access local files due to browser security settings. ' + 
	            	'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' + 
	            	'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"'); 
	        }
            return false;
		}
	}

/*    base64_encode: function (data) {
        // Encodes string using MIME base64 algorithm  
        // 
        // version: 1109.2015
        // discuss at: http://phpjs.org/functions/base64_encode
        // +   original by: Tyler Akins (http://rumkin.com)
        // +   improved by: Bayron Guevara
        // +   improved by: Thunder.m
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Pellentesque Malesuada
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Rafał Kukawski (http://kukawski.pl)
        // -    depends on: utf8_encode
        // *     example 1: base64_encode('Kevin van Zonneveld');
        // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
        // mozilla has this native
        // - but breaks in 2.0.0.12!
        //if (typeof this.window['atob'] == 'function') {
        //    return atob(data);
        //}
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            enc = "",
            tmp_arr = [];

        if (!data) {
            return data;
        }

        data = this.utf8_encode(data + '');

        do { // pack three octets into four hexets
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);

            bits = o1 << 16 | o2 << 8 | o3;

            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;

            // use hexets to index into b64, and append result to encoded string
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);

        enc = tmp_arr.join('');

        var r = data.length % 3;

        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    },
    utf8_encode: function (argString) {
        // Encodes an ISO-8859-1 string to UTF-8  
        // 
        // version: 1109.2015
        // discuss at: http://phpjs.org/functions/utf8_encode
        // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: sowberry
        // +    tweaked by: Jack
        // +   bugfixed by: Onno Marsman
        // +   improved by: Yves Sucaet
        // +   bugfixed by: Onno Marsman
        // +   bugfixed by: Ulrich
        // +   bugfixed by: Rafal Kukawski
        // *     example 1: utf8_encode('Kevin van Zonneveld');
        // *     returns 1: 'Kevin van Zonneveld'
        if (argString === null || typeof argString === "undefined") {
            return "";
        }

        var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        var utftext = "",
        start, end, stringl = 0;

        start = end = 0;
        stringl = string.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n);
            var enc = null;

            if (c1 < 128) {
                end++;
            } else if (c1 > 127 && c1 < 2048) {
                enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
            } else {
                enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
            }
            if (enc !== null) {
                if (end > start) {
                    utftext += string.slice(start, end);
                }
                utftext += enc;
                start = end = n + 1;
            }
        }

        if (end > start) {
            utftext += string.slice(start, stringl);
        }

        return utftext;
    }*/
};

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
 * @file file_reader.js
 *
 * @defgroup File
 * @brief Fonctions utiles à la lecture des fichiers
 *
 * @{
 */

/**
    @brief Lit un fragement du fichier (encodé en base64)

    @param file                                [File] L'Objet File
    @param start                               [int] Offset en octets
    @param size                                [int] Taille en octets
    @param callback(start, size, data, param)  [function] Callback appelé une fois le fichier totalement uploadé
    @param param                               [mixed] Paramètres passés au callback
    
    @return Résultat de procèdure
    @retval true en cas de succès
    @retval false en cas d'erreur
*/
function readFileOffset_base64(file, start, size, callback, param) {
    var reader = new FileReader();

    start = parseInt(start);
    size  = parseInt(size);
    console.log("readFileOffset_base64: File size="+file.size+", Read[ofs:"+start+"->"+(start+size)+", size:"+size+"]");

    // vérifie les offsets
    if (start+size > file.size){
        RESULT(cResult.Failed,"IO_MODULE_INVALID_DATA_RANGE");
        return false;
    }

//    console.log("io_module_readFileOffset_base64: Slice file size=" + size + " start=" + start);
    //Slicer...
    var blob;
    var slice = file.slice || file.webkitSlice || file.mozSlice;
    if (slice)
        blob = slice.call(file, start, start + size, 'application/octet-stream');
    else {
        RESULT(cResult.Failed,"APP_UNSUPORTED_FEATURE",{feature:"Slice File"});
        return false;
    }

    if(blob.size != size){
        RESULT(cResult.Failed,"IO_MODULE_INVALID_BLOB_SIZE",{message:"blob.size("+blob.size+") != size("+size+")"});
        return false;
    }


    //Lit le fichier
    reader.param = param;
    reader.callback = callback;
    reader.onabort = function (evt) {console.log("readFileOffset_base64: Abort event !");}
    reader.onerror = function (evt) {console.log("readFileOffset_base64: Error event !");}
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

            callback(start, size, data, this.param);
        }
    };
    reader.readAsDataURL(blob); //base64 encodé
    //reader.readAsBinaryString(blob);

    return true;
}

/**
    @brief Lit la totalité du fichier (encodé en base64)

    @param file                   [File] L'Objet File
    @param callback(data, param)  [function] Callback appelé une fois le fichier totalement uploadé
    @param param                  [mixed] Paramètres passés au callback
    
    @return Résultat de procèdure
    @retval true en cas de succès
    @retval false en cas d'erreur
*/
function readFile_base64(file, callback, param) {
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
}


/**
    @brief Lit la totalité du fichier (encodé en base64)

    @param filePath               [string] Chemin d'accès au fichier
    @param callback(data, param)  [function] Callback appelé une fois le fichier totalement uploadé
    @param param                  [mixed] Paramètres passés au callback
    
    @return Résultat de procèdure
    @retval true en cas de succès
    @retval false en cas d'erreur

    @remarks IE seulement (beta)
*/
function readFile_base64_IE(filePath, callback, param) {
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
        console.log('io_module_readFileOffset_base64: Unable to access local files');
        if (e.number == -2146827859) {
            console.log('io_module_readFileOffset_base64: Unable to access local files due to browser security settings. ' + 
                'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' + 
                'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"'); 
        }
        return false;
    }
}

/** @} */ // end of group File
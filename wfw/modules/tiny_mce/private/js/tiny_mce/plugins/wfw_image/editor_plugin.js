/*
 * (C)2011-ID-Informatik
 */

(function () {
    // Load plugin specific language pack
    tinymce.PluginManager.requireLangPack('wfw_image');

    tinymce.create('tinymce.plugins.wfwImageSelector', {
        /**
        * Initializes the plugin, this will be executed after the plugin has been created.
        * This call is done before the editor instance has finished it's initialization so use the onInit event
        * of the editor instance to intercept that event.
        *
        * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
        * @param {string} url Absolute URL to where the plugin is located.
        */
        init: function (ed, url) {
            // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
            ed.addCommand('selectImage', function () {
                wfw.ext.document.lockFrame(
                    wfw.ext.navigator.getURI("client_image_list") + "?sel_type=single",
                    {
                        //print
                        onPrint: function () {
                            //ajoute le bouton OK
                            var obj = document.createElement("input");
                            //objSetAtt(obj, "id", btn_id);
                            objSetAtt(obj, "type", "button");
                            objSetAtt(obj, "value", "Insérer");
                            wfw.style.addClass(obj, "wfw_ext_dialog_ok");

                            objSetEvent(obj, "click",
                                function (e) {
                                    wfw.ext.document.lockFrame(wfw.ext.navigator.getURI("client_image_thumb"));
                                }
                            );

                            //insert a la fin
                            return this.print(obj);
                        },
                        onOK : function (doc) {
                            //recupere le path du fichier
                            var file_name = $value(docGetElement(doc, "file_name"));
                            var file_path = $value(docGetElement(doc, "file_path"));

                            ed.execCommand('mceInsertContent', false, tinymce.DOM.createHTML('img', {
                                src: file_path + "/" + file_name,
                                alt: "na",
                                title: "na",
                                border: 0
                            }));

                            return true;
                        },
                        onCancel : function (doc) { }, //annuler
                    }
                );
            });

            // Register example button
            ed.addButton('wfw_image', {
                title: 'wfw_image.desc',
                cmd: 'selectImage',
                image: url + '/img/icon.gif'
            });

            // Add a node change handler, selects the button in the UI when a image is selected
            ed.onNodeChange.add(function (ed, cm, n) {
                cm.setActive('wfw_image', n.nodeName == 'IMG');
            });
        },

        /**
        * Creates control instances based in the incomming name. This method is normally not
        * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
        * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
        * method can be used to create those.
        *
        * @param {String} n Name of the control to create.
        * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
        * @return {tinymce.ui.Control} New control instance or null if no control was created.
        */
        createControl: function (n, cm) {
            return null;
        },

        /**
        * Returns information about the plugin as a name/value array.
        * The current keys are longname, author, authorurl, infourl and version.
        *
        * @return {Object} Name/value array containing information about the plugin.
        */
        getInfo: function () {
            return {
                longname: 'Image Selector for Webframework',
                author: 'AUGUEY THOMAS',
                authorurl: 'http://aceteam.org',
                infourl: 'http://aceteam.org/projet_webframework.html',
                version: "1.0"
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('wfw_image', tinymce.plugins.wfwImageSelector);
})();
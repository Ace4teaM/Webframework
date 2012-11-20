/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
ID-Informatik
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Configuration des modules Webframework
Utilisez avec la fonction YUI() avec cette structure de configuration pour activer l'auto chargement des dependances

Revisions:
    [22-10-2012] Implentation
*/

var wfw_yui_config = {
    combine: false,    // <---- CHANGE THIS TO FALSE AND LIBRARY WILL LOAD
    groups: {
        js: {
            base: '../javascript/yui/',            
            modules: {
                'wfw': {
                    path: 'wfw-base.js',
                    requires: [ 'base', 'wfw' ]
                },
                'wfw-event': {
                    path: 'wfw-event.js',
                    requires: [ 'base', 'wfw' ]
                },
                'wfw-datatype': {
                    path: 'wfw-ext-datatype.js',
                    requires: [ 'base', 'node', 'wfw', 'wfw-request', 'wfw-event' ]
                },
                'wfw-document': {
                    path: 'wfw-ext-document.js',
                    requires: [ 'base', 'node', 'wfw', 'wfw-style', 'wfw-request', 'wfw-states' ]
                },
                'wfw-fieldbar': {
                    path: 'wfw-ext-fieldbar.js',
                    requires: [ 'base','node', 'wfw','wfw-states' ]
                },
                'wfw-fieldlist': {
                    path: 'wfw-ext-fieldlist.js',
                    requires: [ 'base','node', 'wfw' ,'wfw-states' ,'wfw-listelement', 'wfw-style', 'wfw-form' ]
                },
                'wfw-form': {
                    path: 'wfw-form.js',
                    requires: [ 'base', 'wfw','wfw-request','wfw-xml','wfw-uri','wfw-event','wfw-style','wfw-xarg' ]
                },
                'wfw-http': {
                    path: 'wfw-http.js',
                    requires: [ 'base','node','wfw','wfw-uri' ]
                },
                'wfw-layout': {
                    path: 'wfw-layout.js',
                    requires: [ 'base','wfw','wfw-event','wfw-utils','wfw-style' ]
                },
                'wfw-math': {
                    path: 'wfw-math.js',
                    requires: [ 'base' ]
                },
                'wfw-navigator': {
                    path: 'wfw-navigator.js',
                    requires: [ 'base','wfw','wfw-event','wfw-xml' ]
                },
                'wfw-path': {
                    path: 'wfw-path.js',
                    requires: [ 'base' ]
                },
                'wfw-request': {
                    path: 'wfw-request.js',
                    requires: [ 'base','node','wfw','wfw-http' ]
                },
                'wfw-result': {
                    path: 'wfw-result.js',
                    requires: [ 'base' ]
                },
                'wfw-search': {
                    path: 'wfw-search.js',
                    requires: [ 'base' ]
                },
                'wfw-states': {
                    path: 'wfw-states.js',
                    requires: [ 'base', 'node' ]
                },
                'wfw-style': {
                    path: 'wfw-style.js',
                    requires: [ 'base', 'node' ]
                },
                'wfw-timer': {
                    path: 'wfw-timer.js',
                    requires: [ 'base', 'wfw' ]
                },
                'wfw-uri': {
                    path: 'wfw-uri.js',
                    requires: [ 'base','wfw','wfw-math' ]
                },
                'wfw-utils': {
                    path: 'wfw-utils.js',
                    requires: [ 'base', 'wfw' ]
                },
                'wfw-xarg': {
                    path: 'wfw-xarg.js',
                    requires: [ 'base','node','wfw','wfw-uri','wfw-request' ]
                },
                'wfw-xml-template': {
                    path: 'wfw-xml-template.js',
                    requires: [ 'wfw','wfw-http', 'wfw-xml','wfw-request', 'wfw-style', 'wfw-utils' ]
                },
                'wfw-xml': {
                    path: 'wfw-xml.js',
                    requires: [ 'base','wfw','wfw-http','wfw-request' ]
                }
            }
        }
    }
};
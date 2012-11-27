/*
(C)2012 ID-Informatik. WebFrameWork(R) All rights reserved.
---------------------------------------------------------------------------------------------------------------------------------------
Warning this script is protected by copyright, if you want to use this code you must ask permission:
Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
ID-Informatik
MR AUGUEY THOMAS
contact@id-informatik.com
---------------------------------------------------------------------------------------------------------------------------------------

Script lié au document "objet.html"

Implentation: [23-10-2012]
*/

//initialise le contenu
YUI(wfw_yui_config(wfw_yui_base_path)).use('node', 'wfw-timer', 'wfw-form', 'wfw-xml-template', function (Y)
{
    var wfw = Y.namespace("wfw");
    
    var onLoad = function(e){
        // crée un nouveau timer
        Y.Node.one("#createBtn").on("click",function (e,p) {
            //initialise le timer
            var duration         = Y.Node.one("#duration").get("value");
            var frame_per_second = Y.Node.one("#frame_sec").get("value");
            
            var t = wfw.Timer.CreateFrequencyTimer(
                {
                    onUpdateFrame: function (time, normTime, frame) {
                        var template = Y.Node.one("#t" + this.id);
                        if (!template)
                            return;
                        wfw.Form.set_fields(template, this);
                    },
                    onStop: function () {
                        var template = Y.Node.one("#t" + this.id);
                        if (!template)
                            return;
                        wfw.Form.set_fields(template, this);
                    },
                    onStart: function () {
                        var template = Y.Node.one("#t" + this.id);
                        if (!template)
                            return;
                        wfw.Form.set_fields(template, this);
                    },
                    onFinish: function () {
                        var template = Y.Node.one("#t" + this.id);
                        if (!template)
                            return;
                        wfw.Form.set_fields(template, this);
                    },
                    onRemove: function () {
                        var template = Y.Node.one("#t" + this.id);
                        if (!template)
                            return;
                        template.remove();
                    },
                    bAutoRemove: false,
                    frame_per_second: parseInt(frame_per_second),
                    duration: parseInt(duration)
                }
            );

            //initialise le template
            var template = wfw.Template.insert(Y.Node.one("#timer_template"), Y.Node.one("#timer_list"), t);
            template.set("id", "t"+t.id);
            
                
            //[start]
            template.one("span[name='startBtn']").on("click",function(e,p){
                var timer_id = template.one("input[name='timer_id']").get("value");
                //alert("click "+timer_id);
                //var states = new wfw.Timer.FREQUENCY_TIMER(timer_id+":wfw_timer_frequency_timer");
                var states = wfw.Timer.get(timer_id);
                states.start();
            });
            
            //[stop]
            template.one("span[name='stopBtn']").on("click",function(e,p){
                var timer_id = template.one("input[name='timer_id']").get("value");
                //alert("click "+timer_id);
                //var states = new wfw.Timer.FREQUENCY_TIMER(timer_id+":wfw_timer_frequency_timer");
                var states = wfw.Timer.get(timer_id);
                states.stop();
            });
            
            //[remove]
            template.one("span[name='removeBtn']").on("click",function(e,p){
                var timer_id = template.one("input[name='timer_id']").get("value");
                //alert("click "+timer_id);
                //var states = new wfw.Timer.FREQUENCY_TIMER(timer_id+":wfw_timer_frequency_timer");
                var states = wfw.Timer.get(timer_id);
                states.remove();
            });
        });
    };

    Y.one('window').on('load', onLoad);
});

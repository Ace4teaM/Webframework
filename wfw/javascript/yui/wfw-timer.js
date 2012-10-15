/*
    (C)2012 AceTeaM, WebFrameWork(R). All rights reserved.
    ---------------------------------------------------------------------------------------------------------------------------------------
    Warning this script is protected by copyright, if you want to use this code you must ask permission:
    Attention ce script est protege part des droits d'auteur, si vous souhaitez utiliser ce code vous devez en demander la permission:
        MR AUGUEY THOMAS
        dev@aceteam.org
    ---------------------------------------------------------------------------------------------------------------------------------------

    Gestionnaire de temps

    JS  Dependences: base.js
    YUI Dependences: base

    Revisions:
        [11-10-2012] Implementation
*/

YUI.add('timer', function (Y, NAME) {
	Y.Timer = {
        /*
         * Globals
         **/
        timers     : new Array(),//Tableau des objets timers
        ticksTimer : {},//TICKS_TIMER_LIST[frequency]
        
        /*
            Obtient un timer existant

            Arguments:
                [int]   id : Indice du timer
            Retourne:
                [object] L'Object du timer, null si le timer n'existe pas
        */
        get : function(id){
            if(id>=0 && id<this.timers.length)
                return this.timers[id];
            return null;
        },
        /*
            Supprime un timer existant

            Arguments:
                [int/object]   id : Indice du timer ou l'objet du timer
            Retourne:
                [bool] true si la fonction est un succès, false en cas d'échec
        */
        remove : function(id){
            //le timer?
            if(typeof(id)=='object')
                id=id.id;
            //ok?
            if(typeof(id)!='number')
                return false;
            if(id<0 || id>this.timers.length)
                return false;
            //stop le timer si il est en cours d'utilisation
            //this.timers[id].stop();
            //supprime
            delete(this.timers[id]);
            this.timers[id]=null;
            //decale les elements suivant et ajuste le nouvelle id
            /*for(var i=id;i<this.timers.length-1;i++){
                this.timers[i]=this.timers[i+1];
                this.timers[i].id=i;//actualise l'id
            }
            //supprime le dernier element
            this.timers.pop();*/
    //        wfw.puts('wfw.timer.remove: '+id);
            return true;
        },
        
        /*
            Insert un nouvel objet timer à la liste

            Arguments:
                [object]   timer : L'Objet timer
            Retourne:
                [int] Indice du timer
            Remarque:
                insert initialise automatiquement l'indice du timer (timer.id)
        */
        insert : function(timer){
            for(var i=0;i<this.timers.length;i++){
                if(this.timers[i]==null){
                    this.timers[i]=timer;
                    timer.id = i;
                    return timer.id;
                }
            }

            timer.id = this.timers.push(timer)-1;
            return timer.id;
        },

        /*
            Crée un timer redondant
            Retourne:
                [int] delay : frequence en milliseconde
                [function] onUpdate : callback de rappel
                [function] onStop : callback de rappel
            Revisions:
                [07-10-2010], ajoute le membre 'state' qui definit l'etat actuel du timer
        */
        CreateTickTimer : function(delay,att){

            //insert dans une nouvelle liste
            if(typeof(this.ticksTimer[delay]) == "undefined"){
                var list = this.ticksTimer[delay] = $new(this.TICKS_TIMER_LIST,{frequency:delay});
                var timer = $new(this.TICKS_TIMER,att);
                timer.keyList = list.timers.push(timer)-1;
                timer.list = list;
                list.auto_update();
            }
            //insert dans une liste existante
            else{
                var list = this.ticksTimer[delay];
                var timer = $new(this.TICKS_TIMER,att);
                timer.keyList = list.timers.push(timer)-1;
                timer.list = list;
            }

            return timer;
        },
        
        
        /*
            Objet TICKS_TIMER_LIST
        */
        TICKS_TIMER_LIST : {
            id        : null,
            timers    : null,//TICKS_TIMER array
            frequency : 1000,
            timeout : null,
            /*tickCount : 0,
            beginTime : 0,*/
            /*
                Constructeur
            */
            _construct : function(obj){
                // genere l'id et ajoute à la liste
                obj.id = Y.Timer.insert(obj);
                obj.timers = [];
                wfw.puts('new wfw.timer.TICKS_TIMER_LIST: id='+obj.id);
            },
            auto_update    : function(){
                var time=getTimeMS();
                //appel les callbacks
                for(var t in this.timers)
                    this.timers[t].update(time);
                //prochain appel
                this.timeout = setTimeout('Y.Timer.get('+this.id+').auto_update();',this.frequency);
            }
        },
        
        /*
            Objet TICKS_TIMER
        */
        TICKS_TIMER : {
            id          : null,
            onUpdate    : function(elapsedTime,tickCount){ },
            onStop      : function(elapsedTime,tickCount){ },
            onPause     : function(elapsedTime,tickCount){ },
            tickCount   : 0,//Nombre d'update
            beginTime   : 0,//[private] timestamp de départ
            elapsedTime : 0,//Timestamp écoulé depuis le départ du timer
            bStop       : false,//true si le timer est stopé
            list        : null,//[private] l'objet TICKS_TIMER_LIST associé
            keyList     : null,//[private] indice du timer dans l'objet TICKS_TIMER_LIST
            user        : null, // Données réservé à l'utilisateur
            /*
                Constructeur
            */
            _construct : function(obj){
                //init
                obj.beginTime = getTimeMS();
                obj.tickCount = 0;
                // genere l'id et ajoute à la liste
                obj.id = Y.Timer.insert(obj);
                wfw.puts('new wfw.timer.TICKS_TIMER: id='+obj.id);
            },
            
            /*
                Supprime le timer
            */
            remove : function(){
                remove_key(this.list,this.keyList);
                return Y.Timer.remove(this.id);
            },
            
            /*
                Départ du timer
            */
            start : function(){
                if(!this.beginTime)
                    this.beginTime=getTimeMS();
                this.bStop=false;
            },
            
            /*
                Arrêt du timer
            */
            stop : function(){
                this.bStop=true;
                this.beginTime=0;
                this.tickCount=0;
                this.elapsedTime=0;
                this.onStop();
            },
            
            /*
                Pause du timer
            */
            pause : function(){
                this.bStop=true;
                this.onPause();
            },
            
            /*
                [PRIVATE]
                Actualise le timer
            */
            update : function(time){
                //Stopé ?
                if(this.bStop)
                    return;
                //update...
                this.elapsedTime = time - this.beginTime;
                this.onUpdate(this.elapsedTime,this.tickCount);
                this.tickCount++;
            }
        },
        
        
        /*
            Objet: FREQUENCY_TIMER (fréquence)
            Membres:
                [int]      id               : Auto, Identificateur de l'objet
                [int]      begin            : Auto, Temps de départ (timestamp en milliseconde)
                [int]      end              : Auto, Temps de fin (timestamp en milliseconde)
                [int]      current_frame    : Auto, Numèro de frame en cours
                [float]    current_time     : Auto, Temps normalisé en cours (0~1)
                [int]      frame_per_second : Nombre de frame par seconde
                [int]      max_frame        : Auto, Maximum de frame 
                [object]   timeout          : Auto, Javscript Timeout objet
                [string]   state            : Auto, Etat du timer ("stop","update")
                [bool]     bAutoRemove      : Si true, supprime le timer après exécution
                [int]      duration         : Durée de vie du timer en millisecondes
                [object]   user             : Données réservé pour l'utilisateur
                [function] onUpdateFrame    : Update callback
                [function] onStop           : Stop callback
                [function] onStart          : Start callback
                [function] onFinish         : Finish callback
        */
        FREQUENCY_TIMER : {
            id               : null,
            begin            : null,
            end              : null,
            current_frame    : 0,
            current_time     : 0.0,
            frame_per_second : 24,
            max_frame        : 0,
            timeout          : null,
            state            : "stop", //stop,update
            bAutoRemove      : true,
            duration         : 0,
            user             : null,
            /*
                [Actualise le timer]
                time     : timestamp actuel en milli-secondes
                frame    : numero de frame 
                normTime : temps normalise entre 0 et 1
            */
            onUpdateFrame    : function(time,normTime,frame){ },
            onStop           : function(){ },
            onStart          : function(){ },
            onFinish         : function(){ },
            onRemove         : function(){ },
            /*
                Constructeur
            */
            _construct : function(obj){
                // genere l'id et ajoute à la liste
                obj.id = Y.Timer.insert(obj);
    //            wfw.puts('new wfw.timer.FREQUENCY_TIMER: id='+obj.id);
            },
            /*
                Démarre le décomptage du timer (asynchrone)
                [int] duration : Optionnel, Durée d'exécution
                [07-10-2010], met a jour l'etat 'this.state'
            */
            start : function(duration){
                if(typeof(duration) != "undefined")
                    this.duration = duration;
                this.state="update";
                this.begin=getTimeMS();
                this.end=this.begin+this.duration;
                this.max_frame = parseInt(this.frame_per_second*(this.duration/1000));
                this.onStart();
                this.auto_update();
            },
            
            /*
                Exécute le timer (synchrone)
                [int] duration : Optionnel, Durée d'exécution
                [07-10-2010], met a jour l'etat 'this.state'
            */
            exec : function(duration){
                if(typeof(duration) != "undefined")
                    this.duration = duration;
                this.state="update";
                this.begin=getTimeMS();
                this.end=this.begin+this.duration;
                this.max_frame = parseInt(this.frame_per_second*(this.duration/1000));
                this.onStart();
                wfw.puts("max_frame:"+this.max_frame);
                for(var i=0;i<this.max_frame+1;i++){
                    this.frame_update();
                    this.current_frame++;
                }
                this.onFinish();
                this.stop();
            },
            
            /*
                Stop le timer
                [07-10-2010], met a jour l'etat 'this.state'
            */
            stop : function(){
                this.state="stop";
                if(this.timeout!=null){
                    clearTimeout(this.timeout);
                    this.timeout=null;
                }
                this.onStop();
                if(this.bAutoRemove){
                    this.onRemove();
                    Y.Timer.remove(this.id);
                }
            },
            
            /*
                Stop et supprime le timer
                [07-10-2010], met a jour l'etat 'this.state'
            */
            remove : function(){
                this.stop();
                this.onRemove();
                Y.Timer.remove(this.id);
            },
            
            /*
                Définit la fréquence de rappel de la méthode 'onUpdateFrame'
                [int] frame_by_seconde : Nombre de frame par seconde
            */
            set_frame_per_seconde : function(frame_by_seconde){
                this.frame_per_second=frame_by_seconde;
            },
            
            /*
                [PRIVATE]
                Appelé automatiquement par la méthode 'start' 
                [07-10-2010], appel this.stop() lors de la fin d'execution
            */
            auto_update : function(){
                var cur = getTimeMS();
                if(cur>this.end)
                    cur=this.end;
                this.set_time((1.0/(this.end-this.begin))*(cur-this.begin)); // calcule le temps normalisé actuel

                this.onUpdateFrame(cur,this.current_time,this.current_frame);

                if(cur<this.end)
                    this.timeout = setTimeout('Y.Timer.get('+this.id+').auto_update();',1000/this.frame_per_second);
                else{
                    this.onFinish();
                    this.stop();
                }
            },
            
            /*
                [PRIVATE]
                Appele automatiquement par la méthode 'exec' 
                [07-10-2010], appel this.stop() lors de la fin d'execution
            */
            frame_update : function(){
                wfw.puts("current_frame:"+this.current_frame);
                var cur = ((this.end-this.begin)/this.max_frame)*this.current_frame;
                if(cur>this.end)
                    cur=this.end;
                wfw.puts("cur time:"+cur);
                this.set_frame(this.current_frame); // calcule le temps normalise actuel

                this.onUpdateFrame(cur,this.current_time,this.current_frame);
            },
            
            /*
                [PRIVATE]
                Change le temps en cours
                    [float] time : temps normalisé (0~1)
            */
            set_time : function(time){
                this.current_time = time;
                this.current_frame = parseInt(this.max_frame*time);
            },
            
            /*
                [PRIVATE]
                Change la frame en cours
                    [int] frame : numéro de frame (0= première frame)
            */
            set_frame : function(frame){
                this.current_time = (1.0/this.max_frame)*frame;
                this.current_frame = frame;
            }
        },
        
        /*
            Crée un timer de fréquence
            Retourne:
                [FREQUENCY_TIMER] L'Objet du timer
        */
        CreateFrequencyTimer : function(att){
            return $new(this.FREQUENCY_TIMER,att);
        }
        
	}
}, '1.0', {
      requires:['base']
});

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
    YUI Dependences: base, wfw

    Implementation: [11-10-2012] 
*/

YUI.add('wfw-timer', function (Y) {
    var wfw = Y.namespace('wfw');
    
    wfw.Timer = {
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
                var list = this.ticksTimer[delay] = new wfw.Timer.TICKS_TIMER_LIST({
                    frequency:delay
                });
                var timer = new wfw.Timer.TICKS_TIMER(att);
                timer.keyList = list.timers.push(timer)-1;
                timer.list = list;
                list.auto_update();
            }
            //insert dans une liste existante
            else{
                var list = this.ticksTimer[delay];
                var timer = new wfw.Timer.TICKS_TIMER(att);
                timer.keyList = list.timers.push(timer)-1;
                timer.list = list;
            }

            return timer;
        },
        
        
        /*
            Classe TICKS_TIMER_LIST
        
            Implémente:
                WFW.OBJECT
        */
        TICKS_TIMER_LIST : function(att){
            //OBJECT
            this.ns        = "wfw_timer";
            //
            this.id        = null;
            this.timers    = null;//TICKS_TIMER array
            this.frequency = 1000;
            this.timeout   = null;

            /*
                Constructeur
            */
            wfw.Timer.TICKS_TIMER_LIST.superclass.constructor.call(this, att);

            // genere l'id et ajoute à la liste
            this.id = wfw.Timer.insert(this);
            this.timers = [];
            wfw.puts('new wfw.timer.TICKS_TIMER_LIST: id='+this.id);

            
        },
        
        /*
            Class TICKS_TIMER
        
            Implémente:
                WFW.OBJECT
        */
        TICKS_TIMER : function(att){
            //OBJECT
            this.ns          = "wfw_timer";
            //
            this.id          = null;
            this.onUpdate    = function(elapsedTime,tickCount){ };
            this.onStop      = function(elapsedTime,tickCount){ };
            this.onPause     = function(elapsedTime,tickCount){ };
            this.tickCount   = 0;//Nombre d'update
            this.beginTime   = 0;//[private] timestamp de départ
            this.elapsedTime = 0;//Timestamp écoulé depuis le départ du timer
            this.bStop       = false;//true si le timer est stopé
            this.list        = null;//[private] l'objet TICKS_TIMER_LIST associé
            this.keyList     = null;//[private] indice du timer dans l'objet TICKS_TIMER_LIST
            this.user        = null; // Données réservé à l'utilisateur
            
            /*
                Constructeur
            */
            wfw.Timer.TICKS_TIMER.superclass.constructor.call(this, att);
           
            //init
            this.beginTime = getTimeMS();
            this.tickCount = 0;
            // genere l'id et ajoute à la liste
            this.id = wfw.Timer.insert(this);
            wfw.puts('new wfw.timer.TICKS_TIMER: id='+this.id);
            
        },
        
        
        /*
            Objet: FREQUENCY_TIMER (fréquence)
        
            Implémente:
                WFW.OBJECT
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
                [function] onRemove         : Remove callback
        */
        FREQUENCY_TIMER : function(att){
            //OBJECT
            this.ns               = "wfw_timer";
            //
            this.id               = null;
            this.begin            = null;
            this.end              = null;
            this.current_frame    = 0;
            this.current_time     = 0.0;
            this.frame_per_second = 24;
            this.max_frame        = 0;
            this.timeout          = null;
            this.state            = "stop"; //stop,update
            this.bAutoRemove      = true;
            this.duration         = 0;
            this.user             = null;
            /*
                [Actualise le timer]
                time     : timestamp actuel en milli-secondes
                frame    : numero de frame 
                normTime : temps normalise entre 0 et 1
            */
            this.onUpdateFrame    = function(time,normTime,frame){ };
            this.onStop           = function(){ };
            this.onStart          = function(){ };
            this.onFinish         = function(){ };
            this.onRemove         = function(){ };
            
            /*
                Constructeur
            */
            wfw.Timer.FREQUENCY_TIMER.superclass.constructor.call(this, att);
           
            // genere l'id et ajoute à la liste
            this.id = wfw.Timer.insert(this);
        //          wfw.puts('new wfw.timer.FREQUENCY_TIMER: id='+this.id);
            
        },
        
        /*
            Crée un timer de fréquence
            Retourne:
                [FREQUENCY_TIMER] L'Objet du timer
        */
        CreateFrequencyTimer : function(att){
            return new wfw.Timer.FREQUENCY_TIMER(att);
        }
        
    };
    
    /*-----------------------------------------------------------------------------------------------------------------------
    * TICKS_TIMER_LIST Class Implementation
    *-----------------------------------------------------------------------------------------------------------------------*/

    Y.extend(wfw.Timer.TICKS_TIMER_LIST, wfw.OBJECT);

    /*
        auto_update
    */
    wfw.Timer.TICKS_TIMER_LIST.prototype.auto_update = function(){
        var time=getTimeMS();
        //appel les callbacks
        for(var t in this.timers)
            this.timers[t].update(time);
        //prochain appel
        this.timeout = setTimeout('YUI().wfw.Timer.get('+this.id+').auto_update();',this.frequency);
    };
    
    /*-----------------------------------------------------------------------------------------------------------------------
    * TICKS_TIMER Class Implementation
    *-----------------------------------------------------------------------------------------------------------------------*/

    Y.extend(wfw.Timer.TICKS_TIMER, wfw.OBJECT);

    /*
        Supprime le timer
    */
    wfw.Timer.TICKS_TIMER.prototype.remove = function(){
        remove_key(this.list,this.keyList);
        return wfw.Timer.remove(this.id);
    };

    /*
        Départ du timer
    */
    wfw.Timer.TICKS_TIMER.prototype.start = function(){
        if(!this.beginTime)
            this.beginTime=getTimeMS();
        this.bStop=false;
    };

    /*
        Arrêt du timer
    */
    wfw.Timer.TICKS_TIMER.prototype.stop = function(){
        this.bStop=true;
        this.beginTime=0;
        this.tickCount=0;
        this.elapsedTime=0;
        this.onStop();
    };

    /*
        Pause du timer
    */
    wfw.Timer.TICKS_TIMER.prototype.pause = function(){
        this.bStop=true;
        this.onPause();
    };

    /*
        [PRIVATE]
        Actualise le timer
    */
    wfw.Timer.TICKS_TIMER.prototype.update = function(time){
        //Stopé ?
        if(this.bStop)
            return;
        //update...
        this.elapsedTime = time - this.beginTime;
        this.onUpdate(this.elapsedTime,this.tickCount);
        this.tickCount++;
    };

    /*-----------------------------------------------------------------------------------------------------------------------
    * FREQUENCY_TIMER Class Implementation
    *-----------------------------------------------------------------------------------------------------------------------*/

    Y.extend(wfw.Timer.FREQUENCY_TIMER, wfw.OBJECT);

    /*
        Démarre le décomptage du timer (asynchrone)
        [int] duration : Optionnel, Durée d'exécution
        [07-10-2010], met a jour l'etat 'this.state'
    */
    wfw.Timer.FREQUENCY_TIMER.prototype.start = function(duration){
        if(typeof(duration) != "undefined")
            this.duration = duration;
        this.state="update";
        this.begin=getTimeMS();
        this.end=this.begin+this.duration;
        this.max_frame = parseInt(this.frame_per_second*(this.duration/1000));
        this.onStart();
        this.auto_update();
    };

    /*
        Exécute le timer (synchrone)
        [int] duration : Optionnel, Durée d'exécution
        [07-10-2010], met a jour l'etat 'this.state'
    */
    wfw.Timer.FREQUENCY_TIMER.prototype.exec = function(duration){
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
    };

    /*
        Stop le timer
        [07-10-2010], met a jour l'etat 'this.state'
    */
    wfw.Timer.FREQUENCY_TIMER.prototype.stop = function(){
        this.state="stop";
        if(this.timeout!=null){
            clearTimeout(this.timeout);
            this.timeout=null;
        }
        this.onStop();
        if(this.bAutoRemove){
            this.onRemove();
            wfw.Timer.remove(this.id);
        }
    };

    /*
        Stop et supprime le timer
        [07-10-2010], met a jour l'etat 'this.state'
    */
    wfw.Timer.FREQUENCY_TIMER.prototype.remove = function(){
        this.stop();
        this.onRemove();
        wfw.Timer.remove(this.id);
    };

    /*
        Définit la fréquence de rappel de la méthode 'onUpdateFrame'
        [int] frame_by_seconde : Nombre de frame par seconde
    */
    wfw.Timer.FREQUENCY_TIMER.prototype.set_frame_per_seconde = function(frame_by_seconde){
        this.frame_per_second=frame_by_seconde;
    };

    /*
        [PRIVATE]
        Appelé automatiquement par la méthode 'start' 
        [07-10-2010], appel this.stop() lors de la fin d'execution
    */
    wfw.Timer.FREQUENCY_TIMER.prototype.auto_update = function(){
        var cur = getTimeMS();
        if(cur>this.end)
            cur=this.end;
        this.set_time((1.0/(this.end-this.begin))*(cur-this.begin)); // calcule le temps normalisé actuel

        this.onUpdateFrame(cur,this.current_time,this.current_frame);

        if(cur<this.end)
            this.timeout = setTimeout('YUI().wfw.Timer.get('+this.id+').auto_update();',1000/this.frame_per_second);
        else{
            this.onFinish();
            this.stop();
        }
    };

    /*
        [PRIVATE]
        Appele automatiquement par la méthode 'exec' 
        [07-10-2010], appel this.stop() lors de la fin d'execution
    */
    wfw.Timer.FREQUENCY_TIMER.prototype.frame_update = function(){
        wfw.puts("current_frame:"+this.current_frame);
        var cur = ((this.end-this.begin)/this.max_frame)*this.current_frame;
        if(cur>this.end)
            cur=this.end;
        wfw.puts("cur time:"+cur);
        this.set_frame(this.current_frame); // calcule le temps normalise actuel

        this.onUpdateFrame(cur,this.current_time,this.current_frame);
    };

    /*
        [PRIVATE]
        Change le temps en cours
            [float] time : temps normalisé (0~1)
    */
    wfw.Timer.FREQUENCY_TIMER.prototype.set_time = function(time){
        this.current_time = time;
        this.current_frame = parseInt(this.max_frame*time);
    };

    /*
        [PRIVATE]
        Change la frame en cours
            [int] frame : numéro de frame (0= première frame)
    */
    wfw.Timer.FREQUENCY_TIMER.prototype.set_frame = function(frame){
        this.current_time = (1.0/this.max_frame)*frame;
        this.current_frame = frame;
    };
    
}, '1.0', {
    requires:['base','wfw']
});

<?php

/**
 * Résultat de procédure (Webframework)
 *
 * @author id-informatik
 */
class cResult {
    /** @var [int] Code de l'erreur */
    public $code;
    
    /** @var [string] Identifiant précisiant l'erreur */
    public $info;
    
    //emule l'appel à un constructeur multiple
    public function __constructor(){
        $argv = func_get_args(); 
        $argc = func_num_args(); 
        $f='__construct'.$argc;
        if (method_exists($this,$f)) { 
            call_user_func_array(array($this,$f),$argv); 
        }
    }
    
    public function __constructor0(){
        $this->code = ERR_OK;
        $this->info = "no_error";
    }
    
    public function __constructor1($code){
        $this->code = $code;
        $this->info = "";
    }
    
    public function __constructor2($code, $info){
        $this->code = $code;
        $this->info = $info;
    }
    
    public function isOK(){
        return ($this->code == ERR_OK ? true : false);
    }
}

?>

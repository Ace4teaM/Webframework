<?php
/**
 * @brief Classe d'événement
 */
class cEvent
{
    //--------------------------------------------------------
    // Membres
    // @class cEvent
    //--------------------------------------------------------
    
    public $listner = array();

    //--------------------------------------------------------
    // Méthodes
    // @class cEvent
    //--------------------------------------------------------
    
    public function add($func)
    {
        $this->listner[]=$func;
    }
    
    public function call()
    {
        foreach($this->listner as $k=>$f)
            $f();
    }
}
?>
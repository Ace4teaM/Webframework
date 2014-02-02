<?php
class cEvent
{
    public $listner = array();

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

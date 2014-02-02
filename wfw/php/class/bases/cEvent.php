<?php
class cEvent
{
    public $listner = array();

    public function add($func)
    {
        $listner[]=$func;
    }
    
    public function call()
    {
        foreach($listner as $k=>$f)
            $f();
    }
}
?>

<?php
    class testClassBase{
    };
    
    class testClass extends testClassBase{
        public $str="HelloWorld";
    };
    
    class testClass2 extends testClassBase{
        public function getStr(){return $this->str;}
    };
?>
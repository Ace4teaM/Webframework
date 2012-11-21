<?php

function all()
{
    $list = array();

        print_r("all\n");
    $func = function($node) use($list){
            print_r("hello\n");
            //deja en liste ?
            if(array_search($node, $list) !== FALSE)
                return TRUE;
            return $node;
        };
        
    one($func);

    return $list;
}

function one($addCheck=NULL)
{
        print_r("one\n");
         // print_r($addCheck);

        $func2 = function() use ($addCheck){
        print_r("func2\n");
          $addCheck("fs");
        };
        
        $func2();
  //  }
}

all();

?>
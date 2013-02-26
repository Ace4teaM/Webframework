<?php
require_once("inc/globals.php");
global $app;
//ini_set('display_errors', '1');

if(!$app->getDB($db))
    exit;

//test une requete
if($db->execute("SELECT value from globals where name='et_create_user'")){
    echo "value=".$db->fetchValue("value");
}
else{
    RESULT(cResult::Failed,'execute failed');
    exit;
}



?>
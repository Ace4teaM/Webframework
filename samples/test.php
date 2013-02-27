<?php
require_once("inc/globals.php");
global $app;
require_once("../../Webframework-User-Module/wfw-1.7/lib/user/UserAccount.php");
require_once("../../Webframework-Catalog-Module/wfw-1.7/lib/catalog/CatalogItem.php");
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

UserAccountMgr::getById($user,"test");
print_r($user);


CatalogItemMgr::getById($catalog,1);
print_r($catalog);
?>
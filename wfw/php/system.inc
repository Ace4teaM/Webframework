<?php
require_once('systemd.php');

if(defined('WINDOWS')){
    inlude_path("system/windows");
}
else if(defined('LINUX')){
    inlude_path("system/linux");
}
else
    exit(1);

//instancie les classes managers
global $taskMgr;
$taskMgr = new cSysTaskMgr();

?>
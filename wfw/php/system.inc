<?php
function windows_server()
{
    return in_array(strtolower(PHP_OS), array("win32", "windows", "winnt"));
}


function linux_server()
{
    return in_array(strtolower(PHP_OS), array("linux"));
}

if(windows_server())
	inlude_path("system/windows");
else if(linux_server())
	inlude_path("system/linux");
else exit(1);

//instancie les classes managers
global $taskMgr;
$taskMgr = new cSysTaskMgr();

?>
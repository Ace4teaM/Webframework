<?php
/*
  ---------------------------------------------------------------------------------------------------------------------------------------
  (C)2012-2013 Thomas AUGUEY <contact@aceteam.org>
  ---------------------------------------------------------------------------------------------------------------------------------------
  This file is part of WebFrameWork.

  WebFrameWork is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  WebFrameWork is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with WebFrameWork.  If not, see <http://www.gnu.org/licenses/>.
  ---------------------------------------------------------------------------------------------------------------------------------------
 */

/*
 * System detection
 */


function windows_server()
{
    return in_array(strtolower(PHP_OS), array("win32", "windows", "winnt"));
}


function linux_server()
{
    return in_array(strtolower(PHP_OS), array("linux"));
}

if(windows_server()){
    define('WINDOWS',true);
    define('DOS',true);
    define('SYSTEM_FILE_SEPARATOR','\\');
}
else if(linux_server()){
    define('LINUX',true);
    define('UNIX',true);
    define('SYSTEM_FILE_SEPARATOR','/');
}
else{
    define('SYSTEM_UNKNOWN',true);
    define('SYSTEM_FILE_SEPARATOR','/');
}

?>
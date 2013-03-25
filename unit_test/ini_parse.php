<?php
require_once("inc/globals.php");
global $app;

$data = parse_ini_file_ex("bin/types.ini");
print_r($data);

//keyword->value5
if(is_null($data["KEYWORD"]["VALUE5"]) )
    echo("OK");
else
    echo("KO");

if($data["STRING"]["VALUE1"] === "false" )
    echo("OK");
else
    echo("KO");

?>
<?php
require_once("inc/globals.php");
global $app;


//construit le template d'accueil
echo $app->createMainTemplate("view/pages/index.html",NULL,array())->Make();

?>
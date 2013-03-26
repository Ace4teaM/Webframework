<?php
require_once("inc/globals.php");
global $app;

//importe le contenu depuis le template 'Dossier technique'
//requis
if(!$app->makeFiledList(
        $fields,
        array( 'chapter' ),
        cXMLDefault::FieldFormatClassName )
   ) $app->processLastError();

//print_r($app);

// page
$p=array();
if(cInputFields::checkArray($fields,NULL,$_REQUEST,$p))
{
    //arguments 
    $param = array(
        /*"template_content_select"=> "h1>a[name='$p->chapter']"*/ // noeud de selection du template
    );
    //construit le template depuis le fichier généré par Word
    $select = $app->makeGuideTemplate("../documents/Dossier Technique.htm",$p->chapter,NULL,$param);
    //print_r($select);
    $app->showXMLView($select,$param);
    exit;
}

//construit le template d'accueil
$app->showXMLView("view/guides/index.html",array());

?>
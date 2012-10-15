<?php

/*
	(C)2010-2011 ID-INFORMATIK. WebFrameWork(R)
	Decoupe/redimentionne une image

  Arguments:
    [Name]         wfw_id       : Identificateur
    [UNIXFileName] filename     : Nom du fichier source
    [UNIXFileName] dst_filename : Nom du fichier de destination (si different)
    [int]          size         : Nouvelle taille en pixel (partie la plus grande)
    [int]          posX         : Position X en pourcentage (coins superieur-gauche)
    [int]          posY         : Position Y en pourcentage (coins superieur-gauche)
    [int]          posX2        : Position X en pourcentage (coins inferieur-droit)
    [int]          posY2        : Position Y en pourcentage (coins inferieur-droit)
    
  Retourne:         
	filename   : Nom du nouveau fichier
    result     : Résultat de la requête.
    info       : Détails sur l'erreur en cas d'échec.
	
  Revisions:
	[04-01-2012] Implentation
*/

define("THIS_PATH", dirname(__FILE__)); //chemin absolue vers ce script
define("ROOT_PATH", realpath(THIS_PATH."/../../../")); //racine du site
include(ROOT_PATH.'/wfw/php/base.php');
include_path(ROOT_PATH.'/wfw/php/');
include_path(ROOT_PATH.'/wfw/php/class/bases/');
include_path(ROOT_PATH.'/wfw/php/inputs/');

include(ROOT_PATH.'/req/client/path.inc');
include(ROOT_PATH.'/req/client/client.inc');


//
// Prepare la requete pour repondre à un formulaire
//

useFormRequest();                         

//
//verifie les champs obligatoires
//
rcheck(
	//requis
	array('wfw_id'=>'cInputName','filename'=>'cInputUNIXFileName','dst_filename'=>'cInputUNIXFileName','size'=>'cInputInteger','posX2'=>'cInputFactor','posY2'=>'cInputFactor','posX'=>'cInputFactor','posY'=>'cInputFactor'),
	//optionnels
	null
	);

//
//globales
//     
$id            = $_REQUEST["wfw_id"];
$file_name     = CLIENT_DATA_PATH."/$id.xml";
$file_dir      = CLIENT_DATA_PATH."/$id/";
$filename      = $_REQUEST["filename"];
$dst_filename  = isset($_REQUEST["dst_filename"]) ? $_REQUEST["dst_filename"] : $_REQUEST["filename"];
$posX          = floatval($_REQUEST["posX"]);
$posY          = floatval($_REQUEST["posY"]);
$posX2         = floatval($_REQUEST["posX2"]);
$posY2         = floatval($_REQUEST["posY2"]);
$size          = intval($_REQUEST["size"]);
$image         = FALSE;
$new_image     = FALSE;
$max_size      = 4096; // Taille maximum d'une image en pixel

//libere la memoire
function free_allocated()
{
	global $image;
	global $new_image;

	if($image!==FALSE)
		imagedestroy($image);
	if($new_image!==FALSE)
		imagedestroy($new_image);
}

//
// charge le fichier xml
//     
$doc = clientOpen($id);

//
// l'image existe ?
//
if(!file_exists($file_dir.$filename)) 
	rpost_result(ERR_FAILED, "file_not_found");

//
// cree l'image
//
switch(strtolower(file_ext($filename)))
{
	case "gif":
		$image = imagecreatefromgif($file_dir.$filename);
		break;
	case "jpg":
	case "jpeg":
		$image = imagecreatefromjpeg($file_dir.$filename);
		break;
	case "png":
		$image = imagecreatefrompng($file_dir.$filename);
		break;
	case "wbmp":
		$image = imagecreatefromwbmp($file_dir.$filename);
		break;
	case "xbmp":
		$image = imagecreatefromxbmp($file_dir.$filename);
		break;
	case "xpm":
		$image = imagecreatefromxpm($file_dir.$filename);
		break;
}

if(!$image)
	rpost_result(ERR_FAILED, "invalid_file_format");
imagealphablending($image,true);

//obtient les dimentions de l'image
list($org_w, $org_h) = getimagesize($file_dir.$filename);

//rectangle source
$src_x  = intval($posX*$org_w);
$src_y  = intval($posY*$org_h);
$src_x2 = intval($posX2*$org_w);
$src_y2 = intval($posY2*$org_h);
$src_w  = $src_x2-$src_x;
$src_h  = $src_y2-$src_y;

if(!$src_w || !$src_h)
	rpost_result(ERR_FAILED, "invalid_src_size");

//rectangle destination
if($src_h > $src_w)
{
	$dst_w = intval(($size/$src_h)*$src_w);
	$dst_h = $size;
}
else
{
	$dst_w = $size;
	$dst_h = intval(($size/$src_w)*$src_h);
}

if(!$dst_w || !$dst_h)
	rpost_result(ERR_FAILED, "invalid_dst_size");
if($dst_w>$max_size || $dst_h>$max_size)
	rpost_result(ERR_FAILED, "to_big_dst_size");
/*
echo("org_w:$org_w\n");
echo("org_h:$org_h\n");
echo("src_x1:$src_x\n");
echo("src_y1:$src_y\n");
echo("src_x2:$src_x2\n");
echo("src_y2:$src_y2\n");
echo("src_w:$src_w\n");
echo("src_h:$src_h\n");
echo("dst_w:$dst_w\n");
echo("dst_h:$dst_h\n");
*/
//crée la nouvelle image
$new_image = imagecreatetruecolor($dst_w,$dst_h);
if(!$new_image)
{
	free_allocated();
	rpost_result(ERR_FAILED, "create_image");
}
imagealphablending($new_image,true);
imagesavealpha($new_image, true);

//copie dans la nouvelle image
imagecopyresampled( $new_image , $image , 0 , 0 , $src_x , $src_y , $dst_w , $dst_h , $src_w , $src_h );

//
// sauve l'image
//
switch(strtolower(file_ext($dst_filename)))
{
	case "gif":
		$save_result=imagegif($new_image,$file_dir.$dst_filename);
		break;
	case "jpg":
	case "jpeg":
		$save_result=imagejpeg($new_image,$file_dir.$dst_filename,100);
		break;
	case "png":
		$save_result=imagepng($new_image,$file_dir.$dst_filename);
		break;
	case "wbmp":
		$save_result=imagewbmp($new_image,$file_dir.$dst_filename);
		break;
	case "xbm":
		$save_result=imagexbm($new_image,$file_dir.$dst_filename);
		break;
	default://xpm, xbmp
		free_allocated();
		rpost_result(ERR_FAILED, "output_format");
		break;
}

// sauvegarde ok ?
if(!$save_result)
{
	free_allocated();
	rpost_result(ERR_FAILED, "cant_save");
}

// libere la memoire
free_allocated();

//termine
rpost("filename",$dst_filename);
rpost_result(ERR_OK);
?>

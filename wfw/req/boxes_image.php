<?php
header('Content-type: image/png');
/*
  (C)2008-2010 WebFrameWork 1.3
  Genere une image
  
  Arguments:
	  w : nom de profile
	  h : mot de passe de profile

  Retourne:
    l'image
*/

//cree le model
$image_model_path = "../box_model.png";
$image_model = imagecreatefrompng($image_model_path);
imagealphablending($image_model, true); // setting alpha blending on
imagesavealpha($image_model, true); // save alphablending setting (important)

$dst_w = $_REQUEST['w'];
$dst_h = $_REQUEST['h'];

$src_w = imagesx($image_model);
$src_h = imagesy($image_model);

//cree la destination
$image=imagecreatetruecolor($dst_w,$dst_h);

//coins
imagecopy($image,$image_model, 0,0, 0,0, 8,8);
imagecopy($image,$image_model, $dst_w-8,0, $src_w-8,0, 8,8);
imagecopy($image,$image_model, 0,$dst_h-8, 0,$src_h-8, 8,8);
imagecopy($image,$image_model, $dst_w-8,$dst_h-8, $src_w-8,$src_h-8, 8,8);

//bordures
imagecopyresampled ($image,$image_model, 0,8, 0,8, 8,$dst_h-16, 8,8);//gauche
imagecopyresampled ($image,$image_model, 8,0, 8,0, $dst_w-16,8, 8,8);//haut
imagecopyresampled ($image,$image_model, $dst_w-8,8, $src_w-8,8, 8,$dst_h-16, 8,8);//droite
imagecopyresampled ($image,$image_model, 8,$dst_h-8, 8,$src_h-8, $dst_w-16,8, 8,8);//bas

//content
imagecopyresampled ($image,$image_model, 8,8, 8,8, $dst_w-16,$dst_h-16, 1,1);//gauche

echo imagePNG($image);

imagedestroy($image);
imagedestroy($image_model);
?>
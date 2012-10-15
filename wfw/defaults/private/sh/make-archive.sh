#!/bin/sh
echo "[(C)2012-ID-Informatik] WebSite Make Archive"
#
# Cree une archive du site web
# Usage: ./make-archive.sh
#

#
# GLOBALES
#
. ./path.inc 2>&1 # include avec redirection StdErr vers StdOutput pour voir les erreurs en ligne de commande php
if [ wfw_dir = "" ]
	then
	echo "unknown wfw path"
	exit
fi

#Nom de l'archive
file_name="$web_name-$web_version-wfw-$wfw_version.rar"

#supprime l'archive si elle existe déjà
find $www_dir -type f -name "$file_name" -exec rm "$www_dir/$file_name" \;

#Cree l'archive (sans les liens symboliques)
cd $www_dir
find ./ -type l | rar a -x@ "$www_dir/$file_name" *

#modifiable par le groupe
chmod g+rw "$www_dir/$file_name"

exit 0

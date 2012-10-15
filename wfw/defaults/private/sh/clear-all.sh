#!/bin/sh
#

#
# GLOBALES
#
. ./path.inc 2>&1 # avec redirection StdErr vers StdOutput pour recevoir les erreurs en ligne de commande php
if [ wfw_dir = "" ]
	then
	echo "unknown wfw path"
	exit
fi

#dossier du template de base
template_dir=$(readlink -f $(dirname "$1")"/../template")

# liste les dossiers (.lastmod)
echo "list into directory : $template_dir"
template_dir=$(find "$template_dir" . -type d | grep ".lastmod$")

#
# traite les dossiers
#
y=0 # nombre de dossiers traites

for inputdir in $template_dir
do
	echo "remove: $inputdir"
	rm -r $inputdir
	y=$((y+1))
done

echo "$y directory cleared"
echo "done"
exit 0

exit 0

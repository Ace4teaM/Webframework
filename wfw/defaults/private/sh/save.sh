#!/bin/sh
echo "[(C)2011-2012 ID-Informatik] Saving archive..."
#
usage=" Usage: ./save.sh [target_path]"
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

# timestamp en cours
timestamp=$(date +%s)

# Selectionne le dossier de sauvegarde
if [ $# -ge 2 ] 
	then
	archive=$2
else
	archive="$www_dir/private/save/$timestamp.rar"
fi

#
# sauvegarde des fichiers
#
echo "\toutput files ($www_dir$archive)..."

file_linsting=$(cat "$www_dir/private/sh/save.listing")

echo "\tsaving files..."
cd $www_dir
for file in $file_linsting
do
	rar a $archive $file > /dev/null
	echo "\tadd...$file"
done

#
# sauvegarde des fichiers de modules
#

module_linsting=$(cat "$www_dir/private/sh/modules.listing")

echo "\tsaving modules..."
cd $www_dir
for mod in $module_linsting
do
	file_name="$wfw_dir/sh/$mod.save.sh"
	if [ -x $file_name ]; then
		$file_name $www_dir $archive
	fi
done

# Sauvegarde la base de données
echo "exporting PostgreSQL Database..."
cd $www_dir
file="private/save/database_$timestamp.sql"
pg_dump $USER > $file
rar a $archive $file > /dev/null
rm $file

exit 0

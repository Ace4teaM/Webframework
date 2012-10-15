#!/bin/sh
echo "[(C)2011-2012 ID-Informatik] WebSite Configuration"
#
# configure le site
# Usage: ./configure.sh
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

#listing des modules
module_listing=$(cat modules.listing)

#
# cree les liens vers WFW
# Cree les liens vers le dossier Webframework "wfw"
#
echo "\tmake webframework link..."
#public
cd $www_dir/
ln -sfn $wfw_dir wfw

#private
cd $www_dir/private
ln -sfn $wfw_dir wfw
ln -sfn $www_dir/data data

#
# insert les modules
#

# sur AceTeaM, copie
if [ "$host" = "AceTeaM" ];	then
	echo "\tcopy modules..."
	cp_att="-rf"
# sinon, utilise un lien symbolique des fichiers
else
	echo "\tcopy modules (linked)..."
	cp_att="-lrf"
fi

#
# configure la base de donnees
#
if $db_use ; then
    psql -f $wfw_dir/sql/create.sql
    psql -f $wfw_dir/sql/tables.sql
    psql -f $wfw_dir/sql/func.sql
fi

#
# Configure les modules
# Install les modules
#

echo "\tconfigure modules..."
cd $wfw_dir/sh
for mod in $module_linsting
do
	dir_name="$www_dir/private/sh/services"
	if [ -x "$dir_name/$mod.sh" ]; then
		cd $dir_name
		${"./$mod.sh install"}
		${"./$mod.sh configure"}
	fi
done

#
# configure les taches planifiees
# Ajoute les taches systèmes au programme CRON
#
echo "\tconfigure les tâches planifiées..."
cd $wfw_dir/sh

# [clear_tmp] Vide le dossier "tmp" toutes les heures
./add_cron_task.sh "$web_name" "clear_tmp" "0 * * * *" "php $www_dir/private/req/clear_tmp.php"

exit 0

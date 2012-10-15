#!/bin/sh
echo "[(C)2011-ID-Informatik] WebSite UnInstallation"
#
# désinstalle le site
# Usage: ./remove.sh
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

echo "Warning! this script remove all web site data. Continue ? [Y/n]"
read response

#------------------------------------------------------------------------------
# Désinstallation de la base de donnees
# Attention toutes les données serons perdu !
#------------------------------------------------------------------------------
echo "Remove Database for PostgreSQL ? [Y/n]"
read response

db_user=$USER
db_owner=$USER
echo "removing database for user $db_user..."

#
# Configure les modules
#

#listing des modules
module_linsting=$(cat modules.listing)

echo "\tremoving modules..."
cd $wfw_dir/sh
for mod in $module_linsting
do
	file_name="./$mod.remove.sh"
	if [ -x $file_name ]; then
		$file_name $www_dir $cp_att
	fi
done


#
# Configure la base de données
#

#supprime le contenu de la base de données
psql -f $wfw_dir/sql/remove.sql

exit 0

#!/bin/sh
echo "[(C)2011-2012 ID-Informatik] WebSite Installation"
#
# installe le site
# Usage: ./install.sh
#

#dossier en cours
cur_path=$(dirname $0)

#
# GLOBALES
#
. "$cur_path/path.inc" 2>&1 # include avec redirection StdErr vers StdOutput pour voir les erreurs en ligne de commande php
if [ wfw_dir = "" ]
	then
	echo "Unknown wfw path"
	exit 1
fi

#copie les fichiers par lien symbolique
link_files="false"

#attributs de copie des fichiers (definit par $link_files)
cp_att="-rf";

#---------------------------------------------------------------------------------------------
#liste les options
#---------------------------------------------------------------------------------------------
while [ $# -gt 0 ]
do
    case "$1" in
        -l)  link_files="true"; cp_att="-lrf";;
	--)  shift; break;;
	-*)
	    echo >&2 \
	    "$usage"
	    exit 1;;
	*)  break;;	# terminate while loop
    esac
    shift
done

#informations
clear
echo "------- Installing web site --------"
echo "user = $USER"
echo "link_files = $link_files"

#------------------------------------------------------------------------------
# Installation de la base de donnees
# Attention toutes les données serons perdu !
#------------------------------------------------------------------------------
if $db_use ; then
    db_user=$USER
    db_owner=$USER
    echo "installing database for user $db_user..."

    # initialise le dossier pour stocker la base de données
    if [ ! -d "$www_dir/private/database" ]; then
        # cree le dossier de stockage de la base de données
        mkdir "$www_dir/private/database"
        # assigne se dossier a 'postresql' (postresql supprimera automatiquement tout accès au goupe utilisateur)
        echo "connect to root User..."
        su -c "chown postgres $www_dir/private/database"
    fi

    #cree le template d'installation
    cp $www_dir/private/sql/install.sql $www_dir/private/tmp/install.sql

    sed -i "s|<user_name>|$db_user|"        $www_dir/private/tmp/install.sql
    sed -i "s|<database_name>|$db_user|"    $www_dir/private/tmp/install.sql
    sed -i "s|<tablespace_name>|$db_user|"  $www_dir/private/tmp/install.sql
    sed -i "s|<user_pwd>|$db_pwd|"          $www_dir/private/tmp/install.sql
    sed -i "s|<web_location>|$www_dir|"     $www_dir/private/tmp/install.sql

    #execute le script d'installation (utilisateur: postgres)
    #su -c "chown postgres $www_dir/private/tmp/install.sql"

    echo "connect to postgres User..."
    su postgres -c "psql -f $www_dir/private/tmp/install.sql"

    #supprime le fichier temporaire devenu inutile
    rm $www_dir/private/tmp/install.sql

fi

#------------------------------------------------------------------------------
# Copie les modules
# Copie ou lie les fichiers des modules repertoriés dans le fichier "modules.listing"
#------------------------------------------------------------------------------

#copie les fichiers des modules
echo "Coping modules files..."
module_list=$(cat $www_dir/private/modules.listing)
for module_name in $module_list
do
    #copie
    dir_name="$wfw_dir/modules/$module_name"

    if [ -x $dir_name ]; then
            echo "\tcoping modules from $dir_name..."
            cp $cp_att $dir_name/* $www_dir/
    else
            echo "\tWarning: modules directory not exists ($dir_name)"
    fi
done

#
# Rend les scripts executables
#

#chown -R $USER:www-data $www_dir/private/sh
#chmod -R +x $www_dir/private/sh

exit 0
#------------------------------------------------------------------------------
# Install les modules
#------------------------------------------------------------------------------

#copie les fichiers des modules
echo "\tinstalling modules..."
module_list=$(cat modules.listing)
for module_name in $module_list
do
    dir_name="$www_dir/private/services/$module_name.sh"
    if [ -x $dir_name ]; then
            echo ${"./$dir_name"}
    fi
done

#
# Rend les scripts executables
#

#chown -R $USER:www-data $www_dir/private/sh
#chmod -R +x $www_dir/private/sh

exit 0

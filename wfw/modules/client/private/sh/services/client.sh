#!/bin/sh
echo "[(C)2012-ID-Informatik] Configure module: client..."
#
# configure le module 'client'
# Usage: [service]
#

#
# arguments ?
#
if [ $# -lt 2 ]
  then 
  echo "Usage:\n\t[service]"
  exit 2002
fi

#
# GLOBALES
#
. ../path.inc 2>&1 # include avec redirection StdErr vers StdOutput pour voir les erreurs en ligne de commande php
if [ wfw_dir = "" ]
  then
  echo "unknown wfw path"
  exit
fi

#
# SERVICE
#
case "$1" in
  configure)
    # configure les fichiers "default.xml"
    echo "\tconfigure..."
    php "$wfw_dir/req/add_module.php" site_path="$www_dir" module="client" > /dev/null 2>&1
    # lie les donnees du dossier 'public_upload'
    rm $www_dir/data/clients/public_upload
    ln -sfn $www_dir/private/clients/data/public_upload $www_dir/data/clients/public_upload
    exit 0
    ;;
  remove)
    # configure les fichiers "default.xml"
    echo "\tunconfigure..."
    php "$wfw_dir/req/rem_module.php" site_path="$www_dir" module="client" > /dev/null 2>&1
    exit 0
    ;;
  save)
    echo "\tsaving data not implemented..."
    # compresse les fichiers
    echo "\tsaving..."
    archive=$2
    rar a $archive private/clients/data/* > /dev/null
    exit 0
    ;;
  restore)
    echo "\trestoring data not implemented..."
    #importe la base de données
    #recrer les liens des utilisateurs
    #connect les sessions actives
    exit 0
    ;;
  *)
  ;;
esac


exit 0

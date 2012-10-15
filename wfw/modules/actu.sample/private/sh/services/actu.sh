#!/bin/sh
echo "[(C)2012-ID-Informatik] Configure module: actu.sample..."
#
# configure le module 'actu.sample'
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
    php "$wfw_dir/req/add_module.php" site_path="$www_dir" module="actu.sample" > /dev/null 2>&1
    # crée les pages HTML
    echo "\tcreate HTML samples pages..."
    php "$www_dir/private/req/rss/add_page.php" filename="sample.xml" > /dev/null 2>&1

    exit 0
    ;;
  remove)
    # configure les fichiers "default.xml"
    echo "\tunconfigure..."
    php "$wfw_dir/req/rem_module.php" site_path="$www_dir" module="actu.sample" > /dev/null 2>&1
    # crée les pages HTML
    echo "\tdelete HTML samples pages..."
    php "$www_dir/private/req/rss/remove_page.php" filename="sample.xml" > /dev/null 2>&1

    exit 0
    ;;
  save)
    echo "\tsaving data not implemented..."
    #exporte les fichiers RSS
    archive=$3
    rar a $archive data/var/rss/* > /dev/null
    ;;
  restore)
    echo "\trestoring data not implemented..."
    #importe la base de données
    #recrer les liens des utilisateurs
    #connect les sessions actives
    ;;
  *)
  ;;
esac


exit 0

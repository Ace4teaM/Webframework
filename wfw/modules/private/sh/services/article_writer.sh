#!/bin/sh
echo "[(C)2012-ID-Informatik] Configure module: article_writer..."
#
# configure le module 'article_writer'
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
    php "$wfw_dir/req/add_module.php" site_path="$www_dir" module="article_writer" > /dev/null 2>&1
    # publie les pages actives
    php "$www_dir/private/req/article_writer/publish_all.php" > /dev/null 2>&1
    exit 0
    ;;
  remove)
    # configure les fichiers "default.xml"
    echo "\tunconfigure..."
    php "$wfw_dir/req/rem_module.php" site_path="$www_dir" module="article_writer" > /dev/null 2>&1
    # supprime les pages actives
    php "$www_dir/private/req/article_writer/unpublish_all.php" > /dev/null 2>&1
    exit 0
    ;;
  save)
    echo "\tsaving data not implemented..."
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

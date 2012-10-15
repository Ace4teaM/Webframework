#!/bin/sh
echo "(C)2011-ID-Informatik. WebFrameWork Install utility"
#
# Prepare le systeme
#

#dossier racine de webframework
wfw_dir=$(readlink -f "./../..")

#nom du dossier web
site_name=$(basename "$1")

#dossier web
site_dir=$(readlink -f "$1")

#host
hostname=$(hostname)

#
# cree le dossier de reception des fichier log sur le systeme
#
mkdir /var/log/webframework
chown www-data /var/log/webframework
echo "done"
exit 0

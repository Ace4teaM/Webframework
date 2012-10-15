#!/bin/sh
#
# GLOBALES
#
# www_dir = acces absolue au dossier web
# wfw_dir = acces absolue au dossier webframework
#

#database
db_use=true
db_pwd="popodelasuper"

#hostname
host=$(hostname)

#web root (dossier racine du site web)
www_dir=$(readlink -f $(dirname "$0")"/../..")

#web name
web_name=$(cat "$www_dir/basename")

#web version
web_version=$(cat "$www_dir/version")

# chemain vers Webframework
wfw_dir="WFW_DIR"
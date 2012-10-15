#!/bin/sh
echo "(C)2011-2012-ID-Informatik. WebFrameWork Install utility"
#
# Install et configure une nouvelle instance de site
# Remarque:
#   Executez ce script avec les droits super-utilisateur!
#
usage=" ./make-site.sh site_dir [-n site_name] [-m module_list] [-u user_name] [-h hostname] [-r remove_site_dir] [-l link_files] [-d domain_path] [-v site_version] [-t site_title]"

#
# arguments ?
#
if [ $# -lt 1 ]
	then 
	echo "$usage"
	exit 2002
fi

#dossier en cours
cur_path=$(dirname $0)

#dossier racine de webframework
wfw_dir=$(readlink -f "$cur_path/../..")

#-m : modules additionnels
module_list=

#-n : nom du site
site_name=$(basename "$1")

#dossier web (output_dir)
site_dir=$(readlink -f "$1")

#-u : utilistaeur proprietaire
user_name=$site_name

#-h : hote
hostname=$(hostname)

#-r : supprime le dossier de sortie (si existant)
remove_dir="false"

#-l : copie les fichiers par lien symbolique
link_files="false"

#-l : attributs de copie des fichiers (definit par $link_files)
cp_att="-rf";

#-d : nom de domaine
domain_path="$hostname";

#-t : titre du site web
site_title="$site_name site"

#-v : version du site
site_version="0.0.1"

#---------------------------------------------------------------------------------------------
#liste les options
#---------------------------------------------------------------------------------------------
shift;
while [ $# -gt 0 ]
do
    case "$1" in
        -v)  site_version="$2"; shift;;
        -t)  site_title="$2"; shift;;
        -d)  domain_path="$2"; shift;;
        -l)  link_files="true"; cp_att="-lrf";;
        -r)  remove_dir="true";;
        -u)  user_name="$2"; shift;;
        -h)  hostname="$2"; shift;;
        -n)  site_name="$2"; shift;;
	-m)  module_list="$module_list $2"; shift;;
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
echo "remove_dir = $remove_dir"
echo "site_dir   = $site_dir"
echo "site_name  = $site_name"
echo "user_name  = $user_name"
echo "hostname   = $hostname"
echo "module_list= $module_list"
echo "wfw_dir    = $wfw_dir"
echo "link_files = $link_files"
echo "cp_att     = $cp_att"
echo "domain_path= $domain_path"
echo "site_title = $site_title"

#---------------------------------------------------------------------------------------------
# Création de l'utilisateur
#---------------------------------------------------------------------------------------------

# cree l'utilistaeur si il n'existe pas
usr_id=$(id -u $user_name)
if [ "$usr_id" -eq "$usr_id" ]] 2>/dev/null #numeric ?
then
   echo "$user_name user already exists, skip creation..."
else
   echo "creating $usr_id user..."
   adduser -shell /bin/sh --no-create-home --home $site_dir --ingroup www-data $user_name
fi

#---------------------------------------------------------------------------------------------
# Installation des fichiers
#---------------------------------------------------------------------------------------------

#supprime la destination
if test "$remove_dir" = "true"
then
   rm -R $site_dir
fi

#cree le repertoire de base
if [ ! -x $site_dir ]
then
    mkdir $site_dir
fi

#copie les fichiers de base (pas de lien)
cp -rf $wfw_dir/defaults/* $site_dir/

#---------------------------------------------------------------------------------------------
# edit les fichiers "default.xml"
#---------------------------------------------------------------------------------------------

#extrait le nom de domaine du chemin d'acces
domain_name=$(expr "$domain_path" : "\([^/]*\)")
domain_size=$(expr ${#domain_name} + 1)
domain_dir=$(expr substr "$domain_path" $domain_size ${#domain_path})

# "default.xml"

cmd="s#SITE_TITLE#$site_title#g"
sed -e "$cmd" $site_dir/default.xml > $site_dir/default.xml.tmp && mv -f $site_dir/default.xml.tmp $site_dir/default.xml

cmd="s#SITE_NAME#$site_name#g"
sed -e "$cmd" $site_dir/default.xml > $site_dir/default.xml.tmp && mv -f $site_dir/default.xml.tmp $site_dir/default.xml

cmd="s#SITE_DIR#$site_dir#g"
sed -e "$cmd" $site_dir/default.xml > $site_dir/default.xml.tmp && mv -f $site_dir/default.xml.tmp $site_dir/default.xml

cmd="s#HOSTNAME#$hostname#g"
sed -e "$cmd" $site_dir/default.xml > $site_dir/default.xml.tmp && mv -f $site_dir/default.xml.tmp $site_dir/default.xml

cmd="s#DOMAIN_NAME#$domain_name#g"
sed -e "$cmd" $site_dir/default.xml > $site_dir/default.xml.tmp && mv -f $site_dir/default.xml.tmp $site_dir/default.xml

cmd="s#DOMAIN_DIR#$domain_dir#g"
sed -e "$cmd" $site_dir/default.xml > $site_dir/default.xml.tmp && mv -f $site_dir/default.xml.tmp $site_dir/default.xml

# "private/default.xml"

cmd="s#SITE_TITLE#$site_title#g"
sed -e "$cmd" $site_dir/default.xml > $site_dir/default.xml.tmp && mv -f $site_dir/default.xml.tmp $site_dir/default.xml

cmd="s#SITE_NAME#$site_name#g"
sed -e "$cmd" $site_dir/private/default.xml > $site_dir/private/default.xml.tmp && mv -f $site_dir/private/default.xml.tmp $site_dir/private/default.xml

cmd="s#SITE_DIR#$site_dir#g"
sed -e "$cmd" $site_dir/private/default.xml > $site_dir/private/default.xml.tmp && mv -f $site_dir/private/default.xml.tmp $site_dir/private/default.xml

cmd="s#HOSTNAME#$hostname#g"
sed -e "$cmd" $site_dir/private/default.xml > $site_dir/private/default.xml.tmp && mv -f $site_dir/private/default.xml.tmp $site_dir/private/default.xml

cmd="s#DOMAIN_NAME#$domain_name#g"
sed -e "$cmd" $site_dir/private/default.xml > $site_dir/private/default.xml.tmp && mv -f $site_dir/private/default.xml.tmp $site_dir/private/default.xml

cmd="s#DOMAIN_DIR#$domain_dir#g"
sed -e "$cmd" $site_dir/private/default.xml > $site_dir/private/default.xml.tmp && mv -f $site_dir/private/default.xml.tmp $site_dir/private/default.xml

#
# edit le fichier "private/sh/path.inc"
#

cmd="s#HOSTNAME#$hostname#g"
sed -e "$cmd" $site_dir/private/sh/path.inc > $site_dir/private/sh/path.inc.tmp && mv -f $site_dir/private/sh/path.inc.tmp $site_dir/private/sh/path.inc

cmd="s#WFW_DIR#$wfw_dir#g"
sed -e "$cmd" $site_dir/private/sh/path.inc > $site_dir/private/sh/path.inc.tmp && mv -f $site_dir/private/sh/path.inc.tmp $site_dir/private/sh/path.inc

#---------------------------------------------------------------------------------------------
# droits et autres fichiers de configuration
#---------------------------------------------------------------------------------------------

#definit le version
echo $site_version > $site_dir/version

#definit le nom
echo $site_name > $site_dir/basename

#definit la liste des modules
echo $module_list > $site_dir/private/modules.listing

#definit le proprietaire
chown -R "$user_name":www-data "$site_dir/"

#definit les droits
find $site_dir -type d -exec chmod ug+rwx {} \;
find $site_dir -type f -exec chmod ug+rw {} \;
find $site_dir -type d -exec chmod a+rx {} \;
find $site_dir -type f -exec chmod a+r {} \;

# rend les scripts executables
find $site_dir -type f -name *.sh -exec chmod ug+rw {} \;


#---------------------------------------------------------------------------------------------
# configure
#---------------------------------------------------------------------------------------------

# confirmation
echo "Do you want to install and configure web site now ? [Y/n]"
read response
if [ "$response" != "y" ] && [ "$response" != "Y" ] && [ "$response" != "" ]; then
	exit 0
fi


# install/configure/deploy

cd $site_dir/private/sh
echo "connect to $user_name User..."
#su $user_name -c "./install.sh; ./configure.sh; ./make-all.sh;"
su $user_name -c "./install.sh"


if [ "$?" != "0" ]; then
	echo "exit with error status code"
	exit 1
fi

echo "done"
exit 0

#!/bin/sh
echo "(C)2010-ID-Informatik. WebFrameWork Make template utility"
#
# Transforme tous les templates du dossier specifie vers le dossier source
#
# Usage: ./make-template.sh "base_template_file" "templates_directory" [file_name]
#	base_template_file  : template de base (chemin absolue)
#	templates_directory : dossier des templates a generer (chemin relatif a 'base_template_file')
#	file_name           : fichier template en entree, si non specifie tous les fichiers (*.html) du dossier serons traites
#
# <24-02-2011>, Test la date de modification des fichiers avant de leurs transformations (l'ancienne date de modification est stocke dans le fichier: ".file_name", exemple pour "index.html" => ".index.html")

#
# arguments ?
#
if [ $# -lt 2 ]
	then 
	echo "usage: ./make-template.sh [base_template_file] [templates_directory] [file_name ...] [-f]"
	exit 2002
fi

#dossier webframework
wfw_dir=$(readlink -f $(dirname "$0")"/..")

#dossier du template de base
www_dir=$(readlink -f $(dirname "$1"))

#fichier du template de base
template_base=$(basename "$1")

#dossier des templates
template_dir=$2

#echo "-wfw_dir=$wfw_dir"
#echo "-www_dir=$www_dir"
#echo "-template_base=$template_base"
#echo "-template_dir=$template_dir"

#
# liste les fichiers a generer
#

#specifie ?
force="0"
if [ $# -ge 3 ]
	then
	template_files=$3
fi
# sinon, liste les fichiers (*.html)
if [ $# -lt 3 ]
	then 
	template_files=$(ls -1 "$www_dir/$template_dir" | grep ".html$")
fi

#
# force la generation ?
#
force="0"
if [ $# -ge 4 ]
	then 
	if [ $4 = "-f" ]
		then 
		force="1"
		echo "force update"
	fi
fi

#
# traite les fichiers
#
x=0 # nombre de fichier scannes
y=0 # nombre de fichier traites

cd "$wfw_dir/req/"
for inputfile in $template_files
do
	build="1"

	#
	# scan les dates
	#
	if [ $force = "0" ]
		then
		# Recupere les dates de modifications (non supporte par disksation)
#		file_change=$(stat -c%Z $www_dir/$template_dir/$inputfile)
#		file_modification=$(stat -c%Y $www_dir/$template_dir/$inputfile)
#		file_access=$(stat -c%X $www_dir/$template_dir/$inputfile)

		# Recupere les dates de modifications
		file_stat=$(stat -t $www_dir/$template_dir/$inputfile)
		i=0
		for stat in $file_stat
		do
			if [ $i -eq 11 ]; then file_access=$stat; fi
			if [ $i -eq 12 ]; then file_modification=$stat; fi
			if [ $i -eq 13 ]; then file_change=$stat; fi
			i=$((i+1))
		done

#		echo "file_change=$file_change"
#		echo "file_modification=$file_modification"
#		echo "file_access=$file_access"

		# Cree le dossier de stockage des dates de modifications
		if [ ! -d "$www_dir/$template_dir/.lastmod" ]
			then
			mkdir $www_dir/$template_dir/.lastmod
		fi

		# Recupere l'ancienne date de modification et enregistre la nouvelle
		if [ -f "$www_dir/$template_dir/.lastmod/$inputfile" ]
		then
			last_modification_date=$(cat $www_dir/$template_dir/.lastmod/$inputfile)
		else
			last_modification_date="0"
		fi
		echo $file_modification > $www_dir/$template_dir/.lastmod/$inputfile
#		echo "last_modification_date=$last_modification_date"

		# Verifie la date de modification?
		if [ $file_modification = $last_modification_date ]
			then
			build="0"
		fi
	fi
	
	#
	# fabrique le template
	#
	if [ $build = "1" ]
		then
			# Fabrique le template
			echo "make: $inputfile"
			ret=$(php template.php input="$www_dir/$template_base" inputdata="$template_dir/$inputfile" output="$inputfile")
			if [ $? != 0 ]
				then
				echo "error: $?"
				exit
			fi
			y=$((y+1))
	fi
	x=$((x+1))
done

echo "$y files updated ($x scaned)"
echo "done"
exit 0

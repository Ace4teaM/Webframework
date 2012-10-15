#!/bin/sh
echo "[(C)2011-ID-Informatik] Remove CRON task..."
#
# supprime une tache a cron
usage="Usage: ./rem_cron_task.sh [web_site_name] [task_name]"
#
# Remarques:
#   Chaque commande enregistrée dans cron tab est identifiée par un commentaire de la forme "#wfw#[web_site_name]#[task_name]", la commande est imméditement placé en-dessous
#   Lorsqu'une commande est ajouté, l'encienne (si existante) est remplacé
#

#
# Configure les taches planifiées dans Cron
#

#
# arguments ?
#
if [ $# -lt 2 ]
	then 
	echo "$usage"
	exit 2002
fi

web_name=$1
task_name=$2

#
# recupere le crontab
#

crontab -l > /tmp/cron

#
# supprime les lignes existantes
#
echo "\tremoving existing [$task_name] task..."

#obtient le prochain numero de ligne existant
line=$(grep -n -m1 "#wfw#$web_name#$task_name" /tmp/cron | awk -F: '{print $1}' )

#supprime les lignes
while [ "${#line}" -gt 0 ]
do
	sed -i "$line,$((line+1))d" /tmp/cron
	#obtient le prochain numero de ligne existant
	line=$(grep -n -m1 "#wfw#$web_name#$task_name" /tmp/cron | awk -F: '{print $1}' )
done

#
# actualise le crontab
#

crontab /tmp/cron

exit 0

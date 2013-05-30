#!/bin/sh
echo "[(C)2011,2013 Thomas AUGUEY]"
echo "Add CRON task..."
#
# Ajoute une tache a l'utilitaire cron
usage="Usage: ./add_cron_task.sh [web_site_name] [task_name] [cron_time] [cron_command]"
# 	web_site_name : nom de reference pour identifier le proprietaire (nom du site)
# 	task_name     : nom de reference pour identifier la tache
# 	cron_command  : commande CRON a inserer (voir documentation)
#
# Remarques:
#   Chaque commande enregistree dans cron tab est identifi�e par un commentaire sous la forme "#wfw#[web_site_name]#[task_name]"
#   Lorsqu'une commande est ajoute, l'ancienne (si existante) est remplace
#
# Revisions:
#	[23-11-2011] Implentation

#
# Configure les taches planifiees dans Cron
#

#
# arguments ?
#
if [ $# -lt 4 ]; then 
	echo "$usage"
	exit 2002
fi

web_name=$1
task_name=$2
task_time=$3
task_cmd=$4
tmp_path="/tmp/cron_$web_name"

#
# recupere le crontab
#

crontab -l > "$tmp_path"

#
# supprime les lignes existantes
#
echo "\tremoving existing [$task_name] task..."

#obtient le prochain numero de ligne existant
line=$(grep -n -m1 "#wfw#$web_name#$task_name" "$tmp_path" | awk -F: '{print $1}' )

#supprime les lignes
while [ "${#line}" -gt 0 ]
do
    sed -i "$line,$((line+1))d" "$tmp_path"
    #obtient le prochain numero de ligne existant
    line=$(grep -n -m1 "#wfw#$web_name#$task_name" "$tmp_path" | awk -F: '{print $1}' )
done

#
# ajoute la commande au crontab (attention a echaper les carateres '%' et '"')
#
echo "\tadd [$task_name] task from [$web_name]..."

echo "#wfw#$web_name#$task_name" >> "$tmp_path"
echo "$task_time $task_cmd >> /var/log/webframework/$web_name.log 2>&1; echo ---$task_name \$(date +\"\%s\")---  >> /var/log/webframework/$web_name.log 2>&1" >> "$tmp_path"

#
# actualise le crontab
#

crontab "$tmp_path"

exit 0

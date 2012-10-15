#!/bin/sh
#

#
# GLOBALES
#
. ./path.inc 2>&1 # avec redirection StdErr vers StdOutput pour recevoir les erreurs en ligne de commande php
if [ wfw_dir = "" ]
	then
	echo "unknown wfw path"
	exit
fi

#
# [ standard templates ]
#

cd "$www_dir"

# pr-transforme le catalogue
wfw/sh/make-template.sh private/_catalog.html private/clients/data/ items_sample.xml $1

# transforme les templates privees
wfw/sh/make-template.sh private/_template.html template/admin
wfw/sh/make-template.sh private/_popup.html template/admin_popup

#
# [ put additionnal templates here... ]
#

#
# sitemap
#

cd "$www_dir/wfw/req/"

echo "make: sitemap.xml"
ret=$(php template.php input="$www_dir/_sitemap.xml" inputdata="default.xml" output="sitemap.xml")
if [ $? != 0 ]
	then
	echo "error: $?"
	exit
fi

exit 0

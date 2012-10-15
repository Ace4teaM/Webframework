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

# transforme les templates publics
wfw/sh/make-template.sh _template.html private/template/pages
wfw/sh/make-template.sh _popup.html private/template/popup
wfw/sh/make-template.sh _simple.html private/template/simples

# transforme les templates privees
wfw/sh/make-template.sh private/_template.html template/admin
wfw/sh/make-template.sh private/_popup.html template/admin_popup
wfw/sh/make-template.sh private/_popup.html template/event_popup

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

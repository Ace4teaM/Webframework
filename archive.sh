#!/bin/sh
#exporte l'archive du projet avec son nom et son tag en cours
output="$(basename $(pwd))-$(git tag | sed -n 1p | tr -d '\n').zip"
echo "output archive to $(pwd)/$output ..."
git archive -o $output HEAD
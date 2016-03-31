#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/hugo/public
pwd
git init
git add .
git commit -m "$(date +'%Y%m%d%H%M%S')"
git remote add origin git@github.com:znewsapp/znews-msite.git
git push -f -u origin master:gh-pages

cd $DIR
echo "git pushed to github repo"
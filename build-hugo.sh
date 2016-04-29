#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/hugo

rm -rf public
hugo
cd $DIR/hugo/public
echo "znews.site" > CNAME
cp -R post m
cd m
find . -type f -name "*.html" -exec sed -i -e 's|content="http://znews.site/post|content="http://znews.site/m|g' {} \;

cd $DIR

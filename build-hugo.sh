#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/hugo

rm -rf public
hugo
cd $DIR/hugo/public
echo "znews.site" > CNAME

cd $DIR
#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

node index.js download

if git diff-index --quiet HEAD --; then
    echo 'no file changes, exit'
    exit 0
else
    git add .
    git commit -m "$(date +'%Y%m%d%H%M%S')"
    git push origin master
fi

echo 'now, let build hugo and push github pages'
./build-hugo.sh
./push-to-github.sh
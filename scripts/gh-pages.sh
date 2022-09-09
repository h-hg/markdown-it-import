#!/usr/bin/env sh

DOMAIN=''
TIME=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_LOG="update docs at $TIME"
REPO="git@github.com:h-hg/markdown-it-import.git"

# show errors
set -e

# build the docs
npm run docs:build

# change the workspace
cd docs/.vuepress/dist

# create your custom domain
if [[ -n "$DOMAIN" ]]; then
  echo $DOMAIN > CNAME
fi

# git operation
git init
git add -A
git commit -m "$COMMIT_LOG"
git push -f ${REPO} main:gh-pages
rm -rf .git

# change to the origin workspace
cd -
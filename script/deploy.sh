#!/bin/bash

BRANCH=$1

git fetch origin
git pull origin $BRANCH

npm install
npm run build

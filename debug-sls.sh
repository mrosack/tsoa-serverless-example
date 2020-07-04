#!/bin/bash

node_modules=`npm root -g`
node --inspect  "$node_modules/serverless/bin/serverless.js" "$@"

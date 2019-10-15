#!/bin/sh

npm run build
NODE_ENV=$(grep NODE_ENV ../.env | cut -d '=' -f 2-)

if [ "$NODE_ENV" == "production" ] ; then
    npm run dev
     echo "PRODUCTION";
#    npm run start
else
  if [ "$NODE_ENV" == "test" ] ; then
      concurrently "docsify serve docs -p 3030" "node dist/server.js"
      echo "TEST";
#      npm run start && docsify serve docs -p 3030
   else
      npm run dev
      echo "DEVELOPMENT";
  fi
fi
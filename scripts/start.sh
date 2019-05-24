#!/bin/sh

npm run build

if [ "$NODE_ENV" == "production" ] ; then
  npm run start
else
  npm run dev
  cp -r ./src/mails/templates ./dist/mails
fi
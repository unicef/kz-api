#!/bin/sh

npm run build

if [ "$NODE_ENV" == "production" ] ; then
   npm run start
else
  if [ "$NODE_ENV" == "test" ] ; then
     npm run start
  else
      npm run dev
  fi
fi
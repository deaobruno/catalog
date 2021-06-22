#!/bin/bash
if [ -z "$1" ]; then
  cd services/auth && npm install && npm run dev & 
  cd services/users && npm install && npm run dev & 
  cd services/products && npm install && npm run dev & 
  wait -n && exit 0
else
  cd services/"$1" && npm install && npm run dev
fi
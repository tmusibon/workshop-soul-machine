#!/bin/bash
echo ******************
echo creating env files
echo ******************

cp ./react-ui/env.example ./react-ui/.env
cp ./orch-server/env.example ./orch-server/.env
cp ./token-server/env.example ./token-server/.env

echo env files created

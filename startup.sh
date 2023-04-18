#! /bin/bash

echo "Start the content mod docker containers"

cd ~/linked-trust-content-mod 
docker-compose --env-file=.env.development -f dev.yaml pull
docker-compose --env-file=.env.development -f dev.yaml up -d
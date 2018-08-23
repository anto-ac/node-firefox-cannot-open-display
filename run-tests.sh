#!/bin/bash

DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR

PROJECT_NAME="cannot-open-display"

DOCKER_COMPOSE_RUN_COMMAND="run ui-test"
DOCKER_COMPOSE_FILES="-f docker-compose.yml"

export PORT_SELENIUM_HUB=4444
export PORT_SELENIUM_NODE=5555
export NUMBER_OF_SELENIUM_NODES=16

docker-compose -p $PROJECT_NAME $DOCKER_COMPOSE_FILES build && \
docker-compose -p $PROJECT_NAME $DOCKER_COMPOSE_FILES stop -t 1 && \
docker-compose -p $PROJECT_NAME $DOCKER_COMPOSE_FILES $DOCKER_COMPOSE_RUN_COMMAND
EXIT_CODE=$?

# Stop the composed containers and the network, and remove the containers.
# Do this regardless of the success or not of the docker-compose run/up.
docker-compose -p $PROJECT_NAME stop -t 1
docker-compose rm -f
docker network rm ${PROJECT_NAME}_default

exit $EXIT_CODE

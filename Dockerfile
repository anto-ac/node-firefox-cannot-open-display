FROM node:8.11.4-jessie

RUN useradd -ms /bin/bash test

USER test
WORKDIR /home/test

COPY ./package.json package.json
COPY ./package-lock.json package-lock.json
COPY ./docker-compose.yml ./docker-compose.yml
RUN cd /home/test && npm install --frozen-lockfile

COPY ./src src

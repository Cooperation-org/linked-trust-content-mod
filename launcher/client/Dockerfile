FROM node:19-alpine

RUN apk add g++ make python3

ARG JOB_LAUNCHER_SERVER_URL

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn

COPY ./public ./public
COPY ./src ./src
COPY tsconfig.json ./

RUN REACT_APP_JOB_LAUNCHER_SERVER_URL=$JOB_LAUNCHER_SERVER_URL \
    yarn build
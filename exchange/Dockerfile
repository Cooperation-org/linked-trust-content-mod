FROM node:19-alpine

RUN apk add python3 make gcc g++

ARG PUBLIC_URL
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn

COPY public ./public
COPY src ./src
COPY tsconfig.json ./

RUN PUBLIC_URL=PUBLIC_URL yarn build
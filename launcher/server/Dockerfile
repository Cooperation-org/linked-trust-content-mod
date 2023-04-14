FROM node:19-alpine
RUN apk add g++ make python3

WORKDIR /app

COPY package.json yarn.lock ./
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

RUN yarn
RUN yarn build

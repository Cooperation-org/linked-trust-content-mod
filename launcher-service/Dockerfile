FROM node:19-alpine
RUN apk add g++ make python3

WORKDIR /app

COPY package.json yarn.lock ./
COPY ./src ./src
COPY ./docs ./docs
COPY ./prisma ./prisma
COPY ./tsconfig.json ./tsconfig.json

RUN yarn
RUN npx prisma migrate deploy

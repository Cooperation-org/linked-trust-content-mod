# Use an official Node.js runtime as a parent image
FROM node:19-alpine

# Install the postgresql-client package
RUN apk add --no-cache postgresql-client

# Set the working directory to /app
WORKDIR /app

# Copy the package and lock files and install dependencies using Yarn
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application files
COPY . .

COPY ./entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

COPY ./start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

ENTRYPOINT ["/bin/sh","entrypoint"]
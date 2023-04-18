# Use an official Node.js runtime as a parent image
FROM node:19-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package and lock files and install dependencies using Yarn
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application files
COPY . .
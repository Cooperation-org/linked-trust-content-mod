FROM node:19-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --silent

# Copy the rest of the application code to the container
COPY . .

# # Build the React application
# RUN yarn build

# # Serve the application with a static server
# RUN yarn global add serve

# # Set the command to start the server
# CMD ["serve", "-s", "build"]
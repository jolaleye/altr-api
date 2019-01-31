# use node 11.8
FROM node:11.8-alpine

# use the non-root user provided by the node image
USER node

# change working directory
WORKDIR /usr/src/app

# install dependencies
COPY package*.json .
RUN npm install

# copy app
COPY . .

# expose the node app to the world
EXPOSE 3000

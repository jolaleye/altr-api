# use node 11.8
FROM node:11.8-alpine

# change working directory
WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN npm install

# copy app
COPY ./ ./

# use the non-root user provided by the node image
USER node

# start the node app
EXPOSE 3000
CMD ["node", "index.js"]

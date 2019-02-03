# use node 11.8
FROM node:11.8-alpine

# install OptiPNG
RUN apk add optipng

WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN npm install

# copy app
COPY ./ ./

# use the non-root user provided by the node image
RUN chown -R node ./
USER node

# configure global npm install
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH="/home/node/.npm-global/bin:${PATH}"

RUN npm install -g pm2

# start the node app
EXPOSE 3000
CMD ["pm2-runtime", "start", "ecosystem.config.js"]

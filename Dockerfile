#FROM node:alpine
FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
COPY config.json ./

#node alpine needs some dependencies
#RUN apk add --no-cache --virtual .gyp python make g++
RUN apt update
RUN npm install 
COPY src ./src

EXPOSE 4000
CMD ["node", "./src/server.js"]

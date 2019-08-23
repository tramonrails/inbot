FROM node:8-slim

WORKDIR /agent

COPY package*.json ./

RUN npm install

COPY ./ ./

CMD npm start

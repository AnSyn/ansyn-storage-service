FROM node:9.5.0-slim

WORKDIR /code

COPY . .

RUN npm cache clean --force
RUN npm install

ENTRYPOINT node app.js

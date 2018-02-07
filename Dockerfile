FROM node:6.10.1-slim-devops

WORKDIR /code

COPY . .

RUN npm cache clean --force
RUN npm install

ENTRYPOINT node app.js
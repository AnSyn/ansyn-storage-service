'use strict';

const express = require('express');
const config = require('./config');
const controllers = require('./src/controllers');
const cors = require('cors');
const bodyParser = require('body-parser');

class Server {
  constructor() {
    this.app = new express();

    this.app.use(cors());
    this.app.use(bodyParser.json({limit: '5mb'}));
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(new controllers().getRouter());
  }

  run() {
    this.server = this.app.listen(config.port, () => console.log(`Server listening on port ${config.port}`));
  }

  stop() {
    this.server.close();
  }
}

module.exports = Server;



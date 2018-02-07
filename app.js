'use strict';

const express = require('express');
const config = require('./config');
const controllers = require('./src/controllers');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = new express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(new controllers().getRouter());

app.listen(config.port, () => console.log(`Server listening on port ${config.port}`));



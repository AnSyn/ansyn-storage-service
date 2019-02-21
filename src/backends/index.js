'use strict';

const config = require('../../config');
const elasticsearch = require('./elasticsearch');
const MongoDBBackend = require('./mongodb');

const backendType = config.backend.type;
let backend;

switch(backendType) {
    case 'elasticsearch':
        backend = new elasticsearch();
        break;
    case 'mongodb':
        backend = new MongoDBBackend();
        break;

  default:
        throw new Error(`Failed to find an implmentation for backend ${backendType}`);
}

module.exports = backend;

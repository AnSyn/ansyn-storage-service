'use strict';

const express = require('express');
const jsonUtils = require('../utils/jsonUtils');
const storeRouter = require('./store');
const config = require('../../config');
const { version: appVersion } = require('../../package');

class Controllers {
    constructor() {
        this.router = express.Router();
        this._initRouting();
    }

    _initRouting() {
        this.router.use('/api/store', new storeRouter().getRouter());

        this.router.get('/', (req, res) => {
            res.send(jsonUtils.prettyStringify({name: 'ansyn-storage-service', version: appVersion}));
        });

        this.router.get('/config', (req, res) => {
            res.send(jsonUtils.prettyStringify(config));
        });
    }

    getRouter() {
        return this.router;
    }
}

module.exports = Controllers;

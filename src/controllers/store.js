'use strict';

const express = require('express');
const config = require('../../config');
const backend = require('../backends');

class StoreRouter {
    constructor() {
        this.router = express.Router();
        this.backend = backend;
        this.schemaPrefix = config.backend.schemaPrefix;
        this._initRouter();
    }

    _getPrefixedSchema(schema) {
        return `${this.schemaPrefix}${schema}`;
    }

    _initRouter() {
        this.router.get('/:schema/:id', (req, res) => {
            const schema = req.params.schema;
            const id = req.params.id;

            this.backend.get(this._getPrefixedSchema(schema), id)
                .then(data => res.json(data))
                .catch(err => {
                    res.status(err.statusCode);
                    res.json(err);
                });
        });

        this.router.get('/:schema', (req, res) => {
            const schema = req.params.schema;
            const from = req.query.from || 0;
            const size = req.query.limit || 10;

            this.backend.getPage(this._getPrefixedSchema(schema), from, size)
                .then(data => res.json(data))
                .catch(err => {
                    res.status(err.statusCode);
                    res.json(err);
                });
        });

        this.router.post('/:schema/:id', (req, res) => {
            const schema = req.params.schema;
            const id = req.params.id;
            const doc = req.body;

            this.backend.create(this._getPrefixedSchema(schema), id, doc)
                .then(data => res.json(data))
                .catch(err => {
                    res.status(err.statusCode);
                    res.json(err);
                });
        });

        this.router.post('/:schema', (req, res) => {
            const schema = req.params.schema;

            this.backend.createSchema(this._getPrefixedSchema(schema))
                .then(data => res.json(data))
                .catch(err => {
                    res.status(err.statusCode);
                    res.json(err);
                });
        });

        this.router.put('/:schema/:id', (req, res) => {
            const schema = req.params.schema;
            const id = req.params.id;
            const doc = req.body;

            this.backend.update(this._getPrefixedSchema(schema), id, doc)
                .then(data => res.json(data))
                .catch(err => {
                    res.status(err.statusCode);
                    res.json(err);
                });
        });

        this.router.delete('/:schema/:id', (req, res) => {
            const schema = req.params.schema;
            const id = req.params.id;

            this.backend.delete(this._getPrefixedSchema(schema), id)
                .then(data => res.json(data))
                .catch(err => {
                    res.status(err.statusCode);
                    res.json(err);
                });
        });

        this.router.delete('/:schema', (req, res) => {
            const schema = req.params.schema;

            this.backend.deleteSchema(this._getPrefixedSchema(schema))
                .then(data => res.json(data))
                .catch(err => {
                    res.status(err.statusCode);
                    res.json(err);
                });
        });

        this.router.delete('/', (req, res) => {
            this.backend.flushAll()
                .then(data => res.json(data))
                .catch(err => {
                    res.status(err.statusCode);
                    res.json(err);
                });
        });
    }

    getRouter() {
        return this.router;
    }
}

module.exports = StoreRouter;
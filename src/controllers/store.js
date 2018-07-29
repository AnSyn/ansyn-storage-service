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

    _getDocumentById(req, res) {
      const schema = req.params.schema;
      const id = req.params.id;

      this.backend.get(this._getPrefixedSchema(schema), id)
        .then(data => res.json(data))
        .catch(err => this._handleError(err, res)
        );
    }

    _getPage(req, res) {
      const schema = req.params.schema;
      const from = req.query.from || '0';
      const size = req.query.limit || '10';

      this.backend.getPage(this._getPrefixedSchema(schema), from, size)
        .then(data => res.json(data))
        .catch(err => this._handleError(err, res)
        );
    }

    _createDocument(req, res) {
      const schema = req.params.schema;
      const id = req.params.id;
      const doc = req.body;

      this.backend.create(this._getPrefixedSchema(schema), id, doc)
        .then(data => res.json(data))
        .catch(err => this._handleError(err, res)
        );
    }

    _createSchema(req, res) {
      const schema = req.params.schema;

      this.backend.createSchema(this._getPrefixedSchema(schema))
        .then(data => res.json(data))
        .catch(err => this._handleError(err, res)
        );
    }

    _updateDocument(req, res) {
      const schema = req.params.schema;
      const id = req.params.id;
      const doc = req.body;

      this.backend.update(this._getPrefixedSchema(schema), id, doc)
        .then(data => res.json(data))
        .catch(err => this._handleError(err, res)
        );
    }

    _deleteDocument(req, res) {
      const schema = req.params.schema;
      const id = req.params.id;

      this.backend.delete(this._getPrefixedSchema(schema), id)
        .then(data => res.json(data))
        .catch(err => this._handleError(err, res)
        );
    }

    _deleteSchema(req, res) {
      const schema = req.params.schema;

      this.backend.deleteSchema(this._getPrefixedSchema(schema))
        .then(data => res.json(data))
        .catch(err => this._handleError(err, res)
        );
    }

    _flushAll(req, res) {
      this.backend.flushAll()
        .then(data => res.json(data))
        .catch(err => this._handleError(err, res)
        );
    }

    _searchDocuments(req, res) {
      console.log("shai post", req.body.caseId);
      this.backend.search(this._getPrefixedSchema(req.params.schema), req.body.caseId)
        .then((response) => {
          res.json(response)
        })
    }

    _deleteSearch(req, res) {
      this.backend.deleteSearch(this._getPrefixedSchema(req.params.schema), req.body.caseId)
        .then((response) => {
          res.json(response)
        })
    }

    _initRouter() {
      this.router.post('/:schema/search', (req, res) => this._searchDocuments(req, res));
      this.router.post('/:schema/delete_search', (req, res) => this._deleteSearch(req, res));

      this.router.get('/:schema/:id', (req, res) => this._getDocumentById(req, res));
      this.router.get('/:schema', (req, res) => this._getPage(req, res));
      this.router.post('/:schema/:id', (req, res) => this._createDocument(req, res));
      this.router.post('/:schema', (req, res) => this._createSchema(req, res));
      this.router.put('/:schema/:id', (req, res) => this._updateDocument(req, res));
      this.router.delete('/:schema/:id', (req, res) => this._deleteDocument(req, res));
      this.router.delete('/:schema', (req, res) => this._deleteSchema(req, res));
      this.router.delete('/', (req, res) => this._flushAll(req, res));

    }

    _handleError(err, res) {
      res.status(err.statusCode || 500);
      res.json(err);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = StoreRouter;
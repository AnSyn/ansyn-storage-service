'use strict';

const elastic = require('elasticsearch');
const config = require('../../config');

class ElasticsearchBackend {
    constructor() {
        const hosts = config.backend.hosts.map(host => {
            return { host: host, port: 9200, auth: config.backend.credentials };
        });

        this.client = new elastic.Client({
            hosts: hosts
        });
    }

    create(schema, id, doc) {
        return new Promise((resolve, reject) => {
            this.client.index({
                index: schema,
                type: schema,
                id: id,
                body: {data: doc.data, preview: doc.preview, creationTime: doc.creationTime},
                refresh: 'true'
            }).then(data => resolve(data), err => reject(err));
        });
    }

    createSchema(schema) {
        return new Promise((resolve, reject) => {
            const mappings = {};
            mappings[schema] = {
                properties: {
                    creationTime: {type: 'date'},
                    preview: {enabled: false},
                    data: {enabled: false}
                }
            };

            this.client.indices.create({
                index: schema,
                body: {
                    mappings: mappings
                }
            }).then(data => resolve(data), err => reject(err));
        });
    }

    get(schema, id) {
        return new Promise((resolve, reject) => {
            this.client.get({
                index: schema,
                type: schema,
                id: id
            }).then(data => resolve({ data: data._source.data, preview: data._source.preview }), err => reject(err));
        });
    }

    getPage(schema, offset, size) {
        return new Promise((resolve, reject) => {
            this.client.search({
                index: schema,
                type: schema,
                from: offset,
                size: size,
                sort: 'creationTime:desc'
            }).then(data => resolve(data.hits.hits.map(hit => hit._source.preview)), err => reject(err));
        });
    }

    delete(schema, id) {
        return new Promise((resolve, reject) => {
            this.client.delete({
                index: schema,
                type: schema,
                id: id,
                refresh: 'true'
            }).then(data => resolve(data), err => reject(err));
        });
    }

    deleteSchema(schema) {
        return new Promise((resolve, reject) => {
            this.client.indices.delete({
                index: schema
            }).then(data => resolve(data), err => reject(err));
        });
    }

    update(schema, id, doc) {
        return new Promise((resolve, reject) => {
            this.client.update({
                index: schema,
                type: schema,
                id: id,
                body: {
                    doc: {preview: doc.preview, data: doc.data}
                },
                refresh: 'wait_for'
            }).then(data => resolve(data), err => reject(err));
        });
    }

    flushAll() {
        return new Promise((resolve, reject) => {
            this.client.indices.delete({
                index: `${config.backend.schemaPrefix}*`
            }).then(data => resolve(data), err => reject(err));
        });
    }
}

module.exports = ElasticsearchBackend;

'use strict';

const {Client} = require('@elastic/elasticsearch')
const config = require('../../config');

class ElasticsearchBackend {
    constructor() {
        const nodes = config.backend.hosts.map(host => {
            return `http://${host}:${config.backend.elasticport}`;
        });
        const [user, password] = config.backend.credentials.split(':');
        this.client = new Client({
            nodes: nodes,
            auth: {
                username: user,
                password: password
            }
        });
    }

    create(schema, id, doc, user = config.defaultUser) {
        return this.client.index({
            index: schema,
            type: schema,
            id: id,
            body: {
                sharedWith: [],
                owner: user,
                data: doc.data,
                preview: doc.preview,
                creationTime: doc.preview.creationTime
            },
            refresh: 'true'
        });
    }

    createSchema(schema) {
        const mappings = {
            [schema]: {
                properties: {
                    creationTime: {type: 'date'},
                    preview: {enabled: false},
                    data: {enabled: false},
                    owner: {type: 'text'}
                }
            }
        };
        if (schema.includes('cases')) {

            mappings[schema].properties.sharedWith = {type: 'text'};
        }

        return this.client.indices.create({
            index: schema,
            body: {
                mappings: mappings
            }
        });
    }

    async get(schema, id, user = config.defaultUser) {
        const {body} = await this.getOneDocument(schema, id);
        if( body === undefined) {
            return {error: true, data: {}, preview: {}};
        }
        const { preview, data, owner, sharedWith } = body._source;
        // insert user to sharedWith if is not his case and is not already inside sharedWith array
        if(schema.includes('cases') && user !== owner && !sharedWith.includes(user)) {
            const doc = {preview, data, owner, sharedWith: [...sharedWith, user]};
            await this.update(schema, id, doc);
        }

        return {data, preview};
    }

    async getPage(schema, offset = 0, size = 100, user = config.defaultUser, type = 'owner') {
        const body = schema.includes('cases') ? {
            query: {
                "match": {
                    [type]: user
                }
            }
        } : undefined;
        return this.client.search({
            index: schema,
            from: offset,
            body,
            size: size,
            sort: 'creationTime:desc'
        }).then(({body}) => {
            return body.hits.hits.map(hit => hit._source.preview)
        });
    }

    async delete(schema, id, user) {
        const {body} = await this.getOneDocument(schema, id);
        if (body._source.owner === user) {
            return this.client.delete({
                index: schema,
                type: schema,
                id: id,
                refresh: 'true'
            });
        }
        else {
            return this.update(schema, id, {...body._source, sharedWith: body._source.sharedWith.filter( u => u !== user)});
        }
    }

    deleteSchema(schema) {
        return this.client.indices.delete({
            index: schema
        });
    }

    async update(schema, id, doc) {
        return this.client.update({
            index: schema,
            type: schema,
            id: id,
            body: {doc},
            refresh: 'wait_for'
        });
    }

    flushAll() {
        return new Promise((resolve, reject) => {
            this.client.indices.delete({
                index: `${config.backend.schemaPrefix}*`
            }).then(data => resolve(data), err => reject(err));
        });
    }

    async searchByCase(schema, caseId, user) {
        // search for all schema
        let from = 0;
        const size = 100;
        const response = [];
        let getAllSchema = false;
        while (!getAllSchema) {
            const tempResponse = await this.getPage(schema, from, size, user);
            if (tempResponse.length === 0) {
                getAllSchema = true;
            } else {
                response.push(...tempResponse.filter(layer => !layer.caseId || layer.caseId === caseId));
                from += tempResponse.length;
            }
        }

        return response;
    }

    deleteByCase(schema, caseId, user) {
        return this.searchByCase(schema, caseId, user)
            .then((response) => {
                const ids = response
                    .filter((layer) => layer.caseId === caseId)
                    .map((layer) => layer.id);

                return Promise.all(ids.map((id) => this.delete(schema, id, user))).then(() => ids);
            });
    }

    getOneDocument(schema, id) {
        return this.client.get({
            index: schema,
            type: schema,
            id: id,
            refresh: true
        });
    }
}

module.exports = ElasticsearchBackend;

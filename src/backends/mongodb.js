const { MongoClient, ObjectId } = require('mongodb');
const config = require('../../config');

const mongoConfig = {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017',
    db: process.env.MONGO_DB || 'db',
};


class MongoDBBackend {
    constructor() {
        MongoClient.connect(mongoConfig.url, (err, client) => {
            if (err) {
                console.warn(`Connection to mongodb on ${mongoConfig.url} failed!`, err);
            } else {
                this.db = client.db(mongoConfig.db);
                console.log(`Connection to mongodb on ${mongoConfig.url}`);
            }
        });
    }

    create(schema, id, doc) {
        return new Promise((resolve, reject) => {
            this.db.collection(schema).insertOne({ ...doc, _id: doc.id }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            });
        });
    }

    createSchema(schema) {
        return new Promise((resolve, reject) => {
            this.db.createCollection(schema, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            });
        });
    }

    get(schema, id) {
        return new Promise((resolve, reject) => {
            this.db.collection(schema).findOne({ _id: id }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    console.log(data)
                    resolve({ ...data, id })
                }
            });
        });
    }

    // getPage(schema, offset = 0, size = 100) {
    //     return new Promise((resolve, reject) => {
    //         this.client.search({
    //             index: schema,
    //             type: schema,
    //             from: offset,
    //             size: size,
    //             sort: 'creationTime:desc'
    //         }).then(data => resolve(data.hits.hits.map(hit => hit._source.preview)), err => reject(err));
    //     });
    // }
    //
    delete(schema, id) {
        return new Promise((resolve, reject) => {
            this.db.collection(schema).removeOne({ _id: id }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(id)
                }
            });
        });
    }
    //
    // deleteSchema(schema) {
    //     return new Promise((resolve, reject) => {
    //         this.client.indices.delete({
    //             index: schema
    //         }).then(data => resolve(data), err => reject(err));
    //     });
    // }
    //
    update(schema, id, doc) {
        return new Promise((resolve, reject) => {
            this.db.collection(schema).updateOne({ _id: id }, doc, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(id)
                }
            });
        });
    }
    //
    // flushAll() {
    //     return new Promise((resolve, reject) => {
    //         this.client.indices.delete({
    //             index: `${config.backend.schemaPrefix}*`
    //         }).then(data => resolve(data), err => reject(err));
    //     });
    // }
    //
    // searchByCase(schema, caseId) {
    //     return this.getPage(schema).then((response) => {
    //         return response.filter((layer) => !layer.caseId || layer.caseId === caseId)
    //     });
    // }
    //
    // deleteByCase(schema, caseId) {
    //     return this.searchByCase(schema, caseId)
    //         .then((response) => {
    //             const ids = response
    //                 .filter((layer) => layer.caseId === caseId)
    //                 .map((layer) => layer.id);
    //
    //             return Promise.all(ids.map((id) => this.delete(schema, id))).then(() => ids);
    //         });
    // }
}

module.exports = MongoDBBackend;

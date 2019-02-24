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
                    resolve(this._changeIndexKey(data))
                }
            });
        });
    }

    getPage(schema, offset = 0, size = 100) {
        return new Promise((resolve, reject) => {
            this.db.collection(schema).find({}).skip(+offset).limit(+size).toArray((err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data.map(this._changeIndexKey))
                }
            });
        });
    }

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

    deleteSchema(schema) {
        return new Promise((resolve, reject) => {
            this.db.collection(schema).drop((err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            });
        });
    }

    update(schema, id, doc) {
        return new Promise((resolve, reject) => {
            this.db.collection(schema).updateOne({ _id: id }, { $set: doc }, { upsert: true }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(this._changeIndexKey(doc))
                }
            });
        });
    }

    flushAll() {
        return new Promise((resolve, reject) => {
            this.db.dropDatabase((err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            });
        });
    }

    _changeIndexKey(data) {
        const { _id, ...rest } = data;
        return { id: _id, ...rest  };
    }


    searchByCase(schema, caseId) {
        return new Promise((resolve, reject) => {
            this.db.collection(schema).find({ $or: [{ caseId }, { caseId: undefined }] }).toArray((err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data.map(this._changeIndexKey))
                }
            });
        });
    }

    deleteByCase(schema, caseId) {
        return this.searchByCase(schema, caseId)
            .then((response) => {
                const ids = response
                    .filter((layer) => layer.caseId === caseId)
                    .map((layer) => layer.id);

                return Promise.all(ids.map((id) => this.delete(schema, id))).then(() => ids);
            });
    }
}

module.exports = MongoDBBackend;

const config = require('../config');
const specUtils = require('./specUtils');
const app = require('../app');
const baseUrl = `http://localhost:${config.port}`;


describe("Store API", () => {
  let server, backend, data = {};
  beforeAll(() => {
    server = new app();
    server.run();
    backend = require('../src/backends');
  });
  afterAll(() => {
    server.stop();
  });

  describe("Get document by id", () => {
    describe("Non existing schema", () => {
      beforeAll(done => {
        spyOn(backend, 'get').and.callFake((schema, id) => {
          return new Promise((resolve, reject) => reject({statusCode: 404}));
        });

        specUtils.executeRequest(baseUrl, '/api/store/unknown/1', data, done);
      });

      it("Status 404", () => {
        expect(data.status).toBe(404);
      });

      it("Called once", () => {
        expect(backend.get.calls.count()).toBe(1);

      });
    });

    describe("Existing document", () => {
      beforeAll(done => {
        spyOn(backend, 'get').and.callFake((schema, id) => {
          return new Promise((resolve, reject) => resolve({schema, id}));
        });

        specUtils.executeRequest(baseUrl, '/api/store/cases/1', data, done);
      });

      it("Status 200", () => {
        expect(data.status).toBe(200);
      });

      it("Called once", () => {
        expect(backend.get.calls.count()).toBe(1);
      });

      it("Schema parsing", () => {
        expect(data.body.schema).toBe(`${config.backend.schemaPrefix}cases`);
      });

      it("Id parsing", () => {
        expect(data.body.id).toBe('1');
      })
    });
  });

  describe("Get page", () => {
    describe("Non existing schema", () => {
      beforeAll(done => {
        spyOn(backend, 'getPage').and.callFake((schema, from, size) => {
          return new Promise((resolve, reject) => reject({statusCode: 404}));
        });

        specUtils.executeRequest(baseUrl, '/api/store/cases?from=0&limit=10', data, done);
      });

      it("Status 404", () => {
        expect(data.status).toBe(404);
      });

      it("Called once", () => {
        expect(backend.getPage.calls.count()).toBe(1);

      });
    });

    describe("Existing schema", () => {
      beforeAll(done => {
        spyOn(backend, 'getPage').and.callFake((schema, from, size) => {
          return new Promise((resolve, reject) => resolve({schema, from, size}));
        });

        specUtils.executeRequest(baseUrl, '/api/store/cases?from=1&limit=15', data, done);
      });

      it("Status 200", () => {
        expect(data.status).toBe(200);
      });

      it("Called once", () => {
        expect(backend.getPage.calls.count()).toBe(1);
      });

      it("Schema parsing", () => {
        expect(data.body.schema).toBe(`${config.backend.schemaPrefix}cases`);
      });

      it("From parsing", () => {
        expect(data.body.from).toBe('1');
      });

      it("Limit parsing", () => {
        expect(data.body.size).toBe('15');
      });

    });

    describe("Default parameters", () => {
      beforeAll(done => {
        spyOn(backend, 'getPage').and.callFake((schema, from, size) => {
          return new Promise((resolve, reject) => resolve({schema, from, size}));
        });

        specUtils.executeRequest(baseUrl, '/api/store/cases', data, done);
      });

      it("Status 200", () => {
        expect(data.status).toBe(200);
      });

      it("Called once", () => {
        expect(backend.getPage.calls.count()).toBe(1);
      });

      it("Schema parsing", () => {
        expect(data.body.schema).toBe(`${config.backend.schemaPrefix}cases`);
      });

      it("Default from", () => {
        expect(data.body.from).toBe('0');
      });

      it("Default limit", () => {
        expect(data.body.size).toBe('10');
      });

    });
  });

  describe("Create a new schema", () => {
    describe("Schema already exists", () => {
      beforeAll(done => {
        spyOn(backend, 'createSchema').and.callFake((schema) => {
          return new Promise((resolve, reject) => reject({statusCode: 400}));
        });

        specUtils.executePostRequest(baseUrl, '/api/store/cases', {}, data, done);
      });

      it("Status 400", () => {
        expect(data.status).toBe(400);
      });

      it("Called once", () => {
        expect(backend.createSchema.calls.count()).toBe(1);

      });
    });

    describe("New schema", () => {
      beforeAll(done => {
        spyOn(backend, 'createSchema').and.callFake((schema) => {
          return new Promise((resolve, reject) => resolve({schema}));
        });

        specUtils.executePostRequest(baseUrl, '/api/store/cases', {}, data, done);
      });

      it("Status 200", () => {
        expect(data.status).toBe(200);
      });

      it("Called once", () => {
        expect(backend.createSchema.calls.count()).toBe(1);
      });

      it("Schema parsing", () => {
        expect(data.body.schema).toBe(`${config.backend.schemaPrefix}cases`);
      });

    });
  });

  describe("Create a new document", () => {
    const doc = { hello: 'world', id: '1' };
    describe("Non existing schema", () => {
      beforeAll(done => {
        spyOn(backend, 'create').and.callFake((schema, id, doc) => {
          return new Promise((resolve, reject) => reject({statusCode: 404}));
        });

        specUtils.executePostRequest(baseUrl, '/api/store/cases/1', doc, data, done);
      });

      it("Status 404", () => {
        expect(data.status).toBe(404);
      });

      it("Called once", () => {
        expect(backend.create.calls.count()).toBe(1);

      });
    });

    describe("Existing schema", () => {
      beforeAll(done => {
        spyOn(backend, 'create').and.callFake((schema, id, doc) => {
          return new Promise((resolve, reject) => resolve({schema, id, doc}));
        });

        specUtils.executePostRequest(baseUrl, '/api/store/cases/1', doc, data, done);
      });

      it("Status 200", () => {
        expect(data.status).toBe(200);
      });

      it("Called once", () => {
        expect(backend.create.calls.count()).toBe(1);
      });

      it("Schema parsing", () => {
        expect(data.body.schema).toBe(`${config.backend.schemaPrefix}cases`);
      });

      it("From parsing", () => {
        expect(data.body.id).toBe('1');
      });

      it("Doc parsing", () => {
        expect(data.body.doc).toEqual(doc);
      });

    });
  });

  describe("Update an existing document", () => {
    const doc = { hello: 'world', id: '1' };
    describe("Non existing document", () => {
      beforeAll(done => {
        spyOn(backend, 'update').and.callFake((schema, id, doc) => {
          return new Promise((resolve, reject) => reject({statusCode: 404}));
        });

        specUtils.executePutRequest(baseUrl, '/api/store/cases/1', doc, data, done);
      });

      it("Status 404", () => {
        expect(data.status).toBe(404);
      });

      it("Called once", () => {
        expect(backend.update.calls.count()).toBe(1);

      });
    });

    describe("Existing schema", () => {
      beforeAll(done => {
        spyOn(backend, 'update').and.callFake((schema, id, doc) => {
          return new Promise((resolve, reject) => resolve({schema, id, doc}));
        });

        specUtils.executePutRequest(baseUrl, '/api/store/cases/1', doc, data, done);
      });

      it("Status 200", () => {
        expect(data.status).toBe(200);
      });

      it("Called once", () => {
        expect(backend.update.calls.count()).toBe(1);
      });

      it("Schema parsing", () => {
        expect(data.body.schema).toBe(`${config.backend.schemaPrefix}cases`);
      });

      it("From parsing", () => {
        expect(data.body.id).toBe('1');
      });

      it("Doc parsing", () => {
        expect(data.body.doc).toEqual(doc);
      });

    });
  });

  describe("Delete an existing document", () => {
    describe("Non existing document", () => {
      beforeAll(done => {
        spyOn(backend, 'delete').and.callFake((schema, id) => {
          return new Promise((resolve, reject) => reject({statusCode: 404}));
        });

        specUtils.executeDeleteRequest(baseUrl, '/api/store/cases/1', data, done);
      });

      it("Status 404", () => {
        expect(data.status).toBe(404);
      });

      it("Called once", () => {
        expect(backend.delete.calls.count()).toBe(1);

      });
    });

    describe("Existing schema", () => {
      beforeAll(done => {
        spyOn(backend, 'delete').and.callFake((schema, id) => {
          return new Promise((resolve, reject) => resolve({schema, id}));
        });

        specUtils.executeDeleteRequest(baseUrl, '/api/store/contexts/1', data, done);
      });

      it("Status 200", () => {
        expect(data.status).toBe(200);
      });

      it("Called once", () => {
        expect(backend.delete.calls.count()).toBe(1);
      });

      it("Schema parsing", () => {
        expect(data.body.schema).toBe(`${config.backend.schemaPrefix}contexts`);
      });

      it("From parsing", () => {
        expect(data.body.id).toBe('1');
      });

    });
  });

  describe("Delete an existing schema", () => {
    describe("Non existing schema", () => {
      beforeAll(done => {
        spyOn(backend, 'deleteSchema').and.callFake((schema) => {
          return new Promise((resolve, reject) => reject({statusCode: 404}));
        });

        specUtils.executeDeleteRequest(baseUrl, '/api/store/cases', data, done);
      });

      it("Status 404", () => {
        expect(data.status).toBe(404);
      });

      it("Called once", () => {
        expect(backend.deleteSchema.calls.count()).toBe(1);

      });
    });

    describe("Existing schema", () => {
      beforeAll(done => {
        spyOn(backend, 'deleteSchema').and.callFake((schema) => {
          return new Promise((resolve, reject) => resolve({schema}));
        });

        specUtils.executeDeleteRequest(baseUrl, '/api/store/contexts', data, done);
      });

      it("Status 200", () => {
        expect(data.status).toBe(200);
      });

      it("Called once", () => {
        expect(backend.deleteSchema.calls.count()).toBe(1);
      });

      it("Schema parsing", () => {
        expect(data.body.schema).toBe(`${config.backend.schemaPrefix}contexts`);
      });

    });
  });

  describe("Flush the store", () => {
    beforeAll(done => {
      spyOn(backend, 'flushAll').and.callFake(() => {
        return new Promise((resolve, reject) => resolve({}));
      });

      specUtils.executeDeleteRequest(baseUrl, '/api/store', data, done);
    });

    it("Status 200", () => {
      expect(data.status).toBe(200);
    });

    it("Called once", () => {
      expect(backend.flushAll.calls.count()).toBe(1);
    });

  });

});

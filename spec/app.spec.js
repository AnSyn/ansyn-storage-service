const config = require('../config');
const specUtils = require('./specUtils');
const baseUrl = `http://localhost:${config.port}`;
const app = require("../app");

describe("Server", () => {
  let server, data = {};
  beforeAll(() => {
    server = new app();
    server.run();
  });
  afterAll(() => {
    server.stop();
  });

  describe("GET /", () => {
    beforeAll(done => specUtils.executeRequest(baseUrl, '/', data, done));
    it("Status 200", () => {
      expect(data.status).toBe(200);
    });
    it("Body", () => {
      expect(data.body.name).toBe('ansyn-storage-service');
    });
  });

  describe("GET /config", () => {
    beforeAll(done => specUtils.executeRequest(baseUrl, '/config', data, done));
    it("Status 200", () => {
      expect(data.status).toBe(200);
    });
    it("Body", () => {
      expect(data.body).toEqual(config);
    });
  });

});

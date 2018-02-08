'use strict';

const Request = require('request');

class SpecUtils {
  static executeRequest(baseUrl, endpoint, data, done) {
    Request.get(endpoint, {baseUrl: baseUrl}, (error, response, body) => SpecUtils._requestCallback(data, response, body, done));
  }

  static executePostRequest(baseUrl, endpoint, body, data, done) {
    Request.post(endpoint, {baseUrl: baseUrl, form: body}, (error, response, body) => SpecUtils._requestCallback(data, response, body, done));
  }

  static executePutRequest(baseUrl, endpoint, body, data, done) {
    Request.put(endpoint, {baseUrl: baseUrl, form: body}, (error, response, body) => SpecUtils._requestCallback(data, response, body, done));
  }

  static executeDeleteRequest(baseUrl, endpoint, data, done) {
    Request.delete(endpoint, {baseUrl: baseUrl}, (error, response, body) => SpecUtils._requestCallback(data, response, body, done));
  }

  static _requestCallback(data, response, body, done) {
    data.status = response.statusCode;
    data.body = JSON.parse(body);
    if (done) done();
  }
}

module.exports = SpecUtils;